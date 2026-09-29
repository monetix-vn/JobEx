import { describe, expect, it } from 'vitest';
import type { Expr } from '@je/contracts';
import { ExpressionError, collectVars, evaluate, validate } from '../src';

const scope = {
  'world.month_of_year': 4,
  'company.audit_readiness': 45,
  'skill.analysis': 30,
  'player.name': 'Lan',
  'flag.on': true,
};
const ev = (e: Expr) => evaluate(e, scope);
const code = (e: Expr): string | undefined => {
  try {
    ev(e);
  } catch (error) {
    return (error as ExpressionError).code;
  }
  return undefined;
};

describe('evaluate', () => {
  it('runs the event condition from the design plan', () => {
    const when = {
      all: [{ gte: ['world.month_of_year', 3] }, { lt: ['company.audit_readiness', 60] }],
    };
    expect(ev(when)).toBe(true);
    expect(evaluate(when, { ...scope, 'company.audit_readiness': 60 })).toBe(false);
  });

  it('treats bare strings as variables and lit as a string literal', () => {
    expect(ev('player.name')).toBe('Lan');
    expect(ev({ lit: 'player.name' })).toBe('player.name');
    expect(ev({ eq: ['player.name', { lit: 'Lan' }] })).toBe(true);
  });

  it('handles arithmetic and helpers', () => {
    expect(ev({ add: [1, 2, 3] })).toBe(6);
    expect(ev({ sub: [10, 4] })).toBe(6);
    expect(ev({ mul: [2, 3, 4] })).toBe(24);
    expect(ev({ div: [9, 2] })).toBe(4.5);
    expect(ev({ mod: [9, 4] })).toBe(1);
    expect(ev({ min: [3, 1, 2] })).toBe(1);
    expect(ev({ max: [3, 1, 2] })).toBe(3);
    expect(ev({ clamp: [150, 0, 100] })).toBe(100);
    expect(ev({ abs: [-3] })).toBe(3);
    expect(ev({ neg: [3] })).toBe(-3);
    expect(ev({ floor: [1.9] })).toBe(1);
    expect(ev({ ceil: [1.1] })).toBe(2);
    expect(ev({ round: [1.5] })).toBe(2);
  });

  it('handles logic, membership and if', () => {
    expect(ev({ any: [false, { not: [false] }] })).toBe(true);
    expect(ev({ all: [] })).toBe(true);
    expect(ev({ any: [] })).toBe(false);
    expect(ev({ in: ['world.month_of_year', 2, 4, 6] })).toBe(true);
    expect(ev({ if: ['flag.on', 1, 2] })).toBe(1);
    expect(ev({ neq: [1, 2] })).toBe(true);
  });

  it('short-circuits so the unused branch is never evaluated', () => {
    expect(ev({ all: [false, 'no.such.variable'] })).toBe(false);
    expect(ev({ any: [true, 'no.such.variable'] })).toBe(true);
    expect(ev({ if: [true, 1, 'no.such.variable'] })).toBe(1);
  });

  it('supports var with a default', () => {
    expect(ev({ var: ['missing.value', 7] })).toBe(7);
    expect(ev({ var: ['skill.analysis', 7] })).toBe(30);
  });

  it('reports errors with a code and a path', () => {
    expect(code('nope')).toBe('UNKNOWN_VAR');
    expect(code({ frobnicate: [1] })).toBe('UNKNOWN_OP');
    expect(code({ gte: [1] })).toBe('ARITY');
    expect(code({ add: [1, 'player.name'] })).toBe('TYPE');
    expect(code({ all: [1] })).toBe('TYPE');
    expect(code({ div: [1, 0] })).toBe('DIV_ZERO');
    expect(code({ mod: [1, 0] })).toBe('DIV_ZERO');
    expect(code({ a: [], b: [] })).toBe('MALFORMED');
    expect(code({ add: 5 } as unknown as Expr)).toBe('MALFORMED');
    expect(code({ lit: { nested: 1 } } as unknown as Expr)).toBe('TYPE');
    try {
      ev({ all: [true, { gt: [1, 'player.name'] }] });
    } catch (error) {
      expect((error as ExpressionError).path).toBe('$.all[1].gt[1]');
    }
  });

  it('enforces depth and size limits', () => {
    let deep: Expr = 1;
    for (let i = 0; i < 40; i++) deep = { abs: [deep] };
    expect(code(deep)).toBe('TOO_DEEP');
    expect(code({ add: Array.from({ length: 600 }, () => 1) })).toBe('TOO_LARGE');
  });
});

describe('validate and collectVars', () => {
  it('accepts good expressions and lists every problem in bad ones', () => {
    expect(validate({ all: [{ gte: ['a.b', 1] }, { lt: ['c.d', 2] }] })).toEqual([]);
    const issues = validate({ all: [{ nope: [1] }, { gte: [1] }, { lit: [] }] });
    expect(issues.map((i) => i.code).sort()).toEqual(['ARITY', 'TYPE', 'UNKNOWN_OP']);
    expect(issues.find((i) => i.code === 'ARITY')?.path).toBe('$.all[1]');
  });

  it('never throws on hostile input', () => {
    for (const bad of [undefined, [], [1, 2], { __proto__: 1 }, Symbol.iterator, () => 1, 10n]) {
      expect(() => validate(bad)).not.toThrow();
    }
  });

  it('collects variables but not literals', () => {
    const e = {
      all: [{ gte: ['world.month_of_year', 3] }, { eq: [{ lit: 'text' }, { var: ['x.y'] }] }],
    };
    expect(collectVars(e)).toEqual(['world.month_of_year', 'x.y']);
  });
});

describe('scope safety', () => {
  it('never resolves inherited properties from an object scope', () => {
    for (const name of ['constructor', '__proto__', 'toString', 'hasOwnProperty']) {
      expect(() => evaluate(name, {})).toThrow(ExpressionError);
    }
  });

  it('only calls the scope function it was given', () => {
    const seen: string[] = [];
    evaluate({ add: ['a', 'b'] }, (p) => (seen.push(p), 1));
    expect(seen).toEqual(['a', 'b']);
  });
});
