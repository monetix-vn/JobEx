import { describe, expect, it } from 'vitest';
import type { ContentView, Role } from '@je/contracts';
import { Run, runFixture } from '@je/kernel';
import { manifest, simCoreModule } from '../src';

const role: Role = {
  id: 'role.test.one',
  department: 'dept.test',
  level: 2,
  title_key: 't',
  start_state: { salary_vnd: 12000000, stress: 30, 'skill.negotiation': 40 },
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'role' && id === role.id ? role : undefined) as never,
  all: (() => []) as never,
  text: () => undefined,
};
const config = { content, roleId: role.id };

const started = { type: 'run.started', payload: { seed: 's', modules: [] } };
const delta = (path: string, value: number, mode?: 'set') => ({
  type: 'sim.applyDelta',
  payload: { path, value, ...(mode ? { mode } : {}) },
});
const emit = (given: { type: string; payload: unknown }[]) =>
  runFixture(simCoreModule, { config, given, expect: [] });
const types = (given: { type: string; payload: unknown }[]) => emit(given).map((e) => e.type);

describe('sim-core: initial state', () => {
  it('layers defaults, role start_state (bare keys are player vars, dotted keys are paths)', () => {
    const [first] = emit([started]);
    const { full, vars } = first!.payload as { full: boolean; vars: Record<string, unknown> };
    expect(full).toBe(true);
    expect(vars).toMatchObject({
      'player.role': 'role.test.one',
      'player.level': 2,
      'player.salary_vnd': 12000000,
      'player.stress': 30,
      'player.energy': 100,
      'skill.negotiation': 40,
      'player.rep.boss': 50,
      'company.audit_readiness': 50,
    });
  });

  it('applies company overrides', () => {
    const out = runFixture(simCoreModule, {
      config: { ...config, company: { audit_readiness: 80, 'company.headcount': 300 } },
      given: [started],
      expect: [],
    });
    expect((out[0]!.payload as { vars: Record<string, number> }).vars).toMatchObject({
      'company.audit_readiness': 80,
      'company.headcount': 300,
    });
  });

  it('needs content and a known role', () => {
    expect(() => simCoreModule.createModule({ config: undefined } as never)).toThrow(/config/);
    expect(() =>
      simCoreModule.createModule({ config: { content, roleId: 'role.nope' } } as never),
    ).toThrow(/unknown role/);
  });
});

describe('sim-core: world clock and energy', () => {
  it('mirrors the clock into world variables and refills energy each week', () => {
    const out = emit([
      started,
      delta('player.energy', -40),
      {
        type: 'clock.ticked',
        payload: { turn: 55, year: 1, week_of_year: 3, month_of_year: 1, quarter: 1 },
      },
    ]);
    const last = out.at(-1)!.payload as { full: boolean; vars: Record<string, number> };
    expect(last.full).toBe(false);
    expect(last.vars).toEqual({
      'player.energy': 100,
      'world.month_of_year': 1,
      'world.quarter': 1,
      'world.turn': 55,
      'world.week_of_year': 3,
      'world.year': 1,
    });
  });
});

describe('sim-core: deltas', () => {
  it('adds, sets, and reports the change', () => {
    const out = emit([started, delta('player.stress', 5), delta('player.stress', 10, 'set')]);
    const applied = out.filter((e) => e.type === 'sim.deltaApplied').map((e) => e.payload);
    expect(applied).toEqual([
      { path: 'player.stress', from: 30, to: 35 },
      { path: 'player.stress', from: 35, to: 10 },
    ]);
    const changes = out.filter((e) => e.type === 'sim.stateChanged').slice(1);
    expect(changes.map((e) => e.payload)).toEqual([
      { full: false, vars: { 'player.stress': 35 } },
      { full: false, vars: { 'player.stress': 10 } },
    ]);
  });

  it('keeps percentage variables inside 0..100', () => {
    const out = emit([
      started,
      delta('player.stress', 500),
      delta('player.rep.boss', -500),
      delta('player.health', 50),
    ]);
    const to = out
      .filter((e) => e.type === 'sim.deltaApplied')
      .map((e) => (e.payload as { to: number }).to);
    expect(to).toEqual([100, 0, 100]);
  });

  it('creates variables on demand only in open namespaces', () => {
    const out = emit([started, delta('player.cash_vnd', 3000000), delta('skill.charm', 5)]);
    expect(out.filter((e) => e.type === 'sim.deltaApplied')).toHaveLength(2);
    expect(types([started, delta('world.turn', 1)]).at(-1)).toBe('sim.deltaRejected');
    expect(types([started, delta('nonsense.thing', 1)]).at(-1)).toBe('sim.deltaRejected');
  });

  it('refuses to do arithmetic on a non-numeric variable', () => {
    expect(types([started, delta('player.role', 1)]).at(-1)).toBe('sim.deltaRejected');
  });
});

describe('sim-core: ownership', () => {
  it('declares exactly what it consumes and emits', () => {
    expect(manifest.consumes).toEqual(['run.started', 'clock.ticked', 'sim.applyDelta']);
    expect(manifest.emits).toEqual(['sim.stateChanged', 'sim.deltaApplied', 'sim.deltaRejected']);
  });

  it('snapshots its state (sorted, plain data)', () => {
    const run = new Run({ seed: 's', modules: [simCoreModule], configs: { 'sim-core': config } });
    run.start();
    const snap = run.snapshot()['sim-core'] as Record<string, unknown>;
    expect(Object.keys(snap)).toEqual([...Object.keys(snap)].sort());
    expect(snap['player.stress']).toBe(30);
  });
});
