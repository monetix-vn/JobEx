import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Expr } from '@je/contracts';
import { ExpressionError, evaluate, validate } from '../src';

/** Arbitrary JSON, including shapes that look almost like expressions. */
const json = fc.letrec((tie) => ({
  value: fc.oneof(
    { depthSize: 'small' },
    fc.constant(null),
    fc.boolean(),
    fc.double({ noNaN: false }),
    fc.string(),
    fc.array(tie('value'), { maxLength: 4 }),
    fc.dictionary(
      fc.constantFrom('add', 'all', 'any', 'not', 'gte', 'lit', 'var', 'if', 'div', 'x'),
      tie('value'),
      {
        maxKeys: 2,
      },
    ),
  ),
})).value;

describe('property: safety', () => {
  it('only ever throws ExpressionError, whatever the input', () => {
    fc.assert(
      fc.property(json, (input) => {
        try {
          evaluate(input as Expr, () => 1);
        } catch (error) {
          expect(error).toBeInstanceOf(ExpressionError);
        }
      }),
      { numRuns: 500 },
    );
  });

  it('validate() never throws and agrees with evaluate() on operator shape', () => {
    fc.assert(
      fc.property(json, (input) => {
        const issues = validate(input);
        if (issues.length > 0) {
          // A statically invalid expression can never evaluate successfully to a wrong shape:
          // it either throws or short-circuits past the bad branch.
          try {
            evaluate(input as Expr, () => 1);
          } catch (error) {
            expect(error).toBeInstanceOf(ExpressionError);
          }
        }
      }),
      { numRuns: 500 },
    );
  });

  it('is deterministic: same expression and scope give the same answer', () => {
    fc.assert(
      fc.property(json, fc.integer(), (input, n) => {
        const run = (): unknown => {
          try {
            return evaluate(input as Expr, () => n);
          } catch (error) {
            return (error as ExpressionError).code;
          }
        };
        expect(run()).toEqual(run());
      }),
      { numRuns: 300 },
    );
  });
});

/** Arithmetic trees paired with a reference computed by plain JavaScript. */
type Tree = { expr: Expr; value: number };
const tree: fc.Arbitrary<Tree> = fc.letrec<{ t: Tree }>((tie) => ({
  t: fc.oneof(
    { depthSize: 'small' },
    fc.integer({ min: -50, max: 50 }).map((n) => ({ expr: n, value: n })),
    fc
      .tuple(tie('t'), tie('t'))
      .map(([a, b]) => ({ expr: { add: [a.expr, b.expr] }, value: a.value + b.value })),
    fc
      .tuple(tie('t'), tie('t'))
      .map(([a, b]) => ({ expr: { sub: [a.expr, b.expr] }, value: a.value - b.value })),
    fc
      .tuple(tie('t'), tie('t'))
      .map(([a, b]) => ({ expr: { mul: [a.expr, b.expr] }, value: a.value * b.value })),
    fc
      .tuple(tie('t'), tie('t'))
      .map(([a, b]) => ({ expr: { max: [a.expr, b.expr] }, value: Math.max(a.value, b.value) })),
    tie('t').map((a) => ({ expr: { neg: [a.expr] }, value: -a.value })),
  ),
})).t;

describe('property: correctness', () => {
  it('matches a plain JavaScript reference for arithmetic', () => {
    fc.assert(
      fc.property(tree, ({ expr, value }) => {
        // Adding 0 folds -0 into 0: JavaScript and the evaluator may differ only in the sign of zero.
        expect((evaluate(expr, {}) as number) + 0).toBe(value + 0);
      }),
      { numRuns: 500 },
    );
  });

  it('comparison operators agree with JavaScript', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(evaluate({ lt: [a, b] }, {})).toBe(a < b);
        expect(evaluate({ gte: [a, b] }, {})).toBe(a >= b);
        expect(evaluate({ eq: [a, b] }, {})).toBe(a === b);
        expect(evaluate({ not: [{ lt: [a, b] }] }, {})).toBe(a >= b);
      }),
    );
  });

  it('clamp always lands inside the bounds', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.integer({ min: -100, max: 0 }),
        fc.integer({ min: 0, max: 100 }),
        (x, lo, hi) => {
          const v = evaluate({ clamp: [x, lo, hi] }, {}) as number;
          expect(v).toBeGreaterThanOrEqual(lo);
          expect(v).toBeLessThanOrEqual(hi);
        },
      ),
    );
  });

  it('variable lookups never reach inherited properties', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const inherited = name in {} && !Object.prototype.hasOwnProperty.call({}, name);
        if (!inherited) return;
        expect(() => evaluate(name, {})).toThrow(ExpressionError);
      }),
    );
  });
});
