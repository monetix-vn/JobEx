import { describe, expect, it } from 'vitest';
import type { ContentView, EventDraft, Role } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { manifest, workloadModule } from '../src';

const role: Role = {
  id: 'role.test.one',
  department: 'dept.test',
  level: 1,
  title_key: 't',
  weekly_demand: [
    { task: 'task.a', per_week: [2, 4], effort_h: 2.5 },
    { task: 'task.b', per_week: [1, 1], effort_h: 1 },
  ],
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'role' && id === role.id ? role : undefined) as never,
  all: (() => []) as never,
  text: () => undefined,
};
const config = { content, roleId: role.id, capacityHours: 45, overheadHours: 20 };

const tick = {
  type: 'clock.ticked',
  payload: { turn: 0, year: 0, week_of_year: 0, month_of_year: 1, quarter: 1 },
};
const phase = (p: string) => ({ type: 'turn.phaseStarted', payload: { phase: p } });
const state = (stress: number) => ({
  type: 'sim.stateChanged',
  payload: { full: true, vars: { 'player.stress': stress } },
});
const resolved = (hours: number, outcome = 'ok') => ({
  type: 'choice.resolved',
  payload: { sceneId: 's', choiceId: 'c', outcome, cost: { hours } },
});
const run = (given: { type: string; payload: unknown }[], seed = 'w'): EventDraft[] =>
  runFixture(workloadModule, { seed, config, given, expect: [] });
const of = <T = Record<string, number>>(out: EventDraft[], type: string): T[] =>
  out.filter((e) => e.type === type).map((e) => e.payload as T);

describe('workload: planning', () => {
  it('samples the role demand within its ranges and adds overhead', () => {
    for (let i = 0; i < 40; i++) {
      const [plan] = of<{
        demandHours: number;
        tasks: { task: string; count: number; hours: number }[];
      }>(run([tick, phase('plan')], `seed-${i}`), 'workload.weekPlanned');
      const [a, b] = plan!.tasks;
      expect(a!.count).toBeGreaterThanOrEqual(2);
      expect(a!.count).toBeLessThanOrEqual(4);
      expect(b!.count).toBe(1);
      expect(a!.hours).toBe(a!.count * 2.5);
      expect(plan!.demandHours).toBe(20 + a!.hours + b!.hours);
    }
  });

  it('is deterministic for a seed and varies across seeds', () => {
    const a = run([tick, phase('plan')], 'one');
    expect(run([tick, phase('plan')], 'one')).toEqual(a);
    const distinct = new Set(
      Array.from({ length: 30 }, (_, i) => JSON.stringify(run([tick, phase('plan')], `s${i}`))),
    );
    expect(distinct.size).toBeGreaterThan(1);
  });
});

describe('workload: closing the week', () => {
  const week = (extraHours: number, stress = 30) => [
    state(stress),
    tick,
    phase('plan'),
    resolved(extraHours),
    phase('consequence'),
  ];

  it('an ordinary week within capacity relieves stress', () => {
    const out = run(week(0));
    const [closed] = of(out, 'workload.weekClosed');
    expect(closed!.overloadHours).toBe(0);
    expect(closed!.backlogHours).toBe(0);
    expect(closed!.stressDelta).toBe(-2);
    expect(of<{ path: string; value: number }>(out, 'sim.applyDelta')).toEqual([
      { path: 'player.stress', value: -2, reason: 'workload' },
    ]);
  });

  it('a week near capacity neither relieves nor adds stress', () => {
    const [plan] = of(run([tick, phase('plan')]), 'workload.weekPlanned');
    const extra = 45 - plan!.demandHours! - 1;
    const [closed] = of(run(week(extra)), 'workload.weekClosed');
    expect(closed!.overloadHours).toBe(0);
    expect(closed!.stressDelta).toBe(0);
  });

  it('hours over capacity become stress (capped) and carry over as backlog', () => {
    const out = run(week(30));
    const [plan] = of(run([tick, phase('plan')]), 'workload.weekPlanned');
    const expectedOverload = Math.round(Math.max(0, plan!.demandHours! + 30 - 45) * 10) / 10;
    const [closed] = of(out, 'workload.weekClosed');
    expect(closed!.overloadHours).toBe(expectedOverload);
    expect(closed!.stressDelta).toBe(Math.min(10, Math.round(expectedOverload * 0.6)));
    expect(closed!.doneHours).toBe(45);

    const huge = of(run(week(200)), 'workload.weekClosed')[0]!;
    expect(huge.stressDelta).toBe(10);
  });

  it('backlog from one week is added to the next', () => {
    const out = run([
      state(30),
      tick,
      phase('plan'),
      resolved(50),
      phase('consequence'),
      tick,
      phase('plan'),
    ]);
    const [first, second] = of(out, 'workload.weekPlanned');
    expect(first!.backlogHours).toBe(0);
    const [closed] = of(out, 'workload.weekClosed');
    expect(second!.backlogHours).toBe(closed!.backlogHours);
    expect(second!.backlogHours).toBeGreaterThan(0);
  });

  it('burnout: high stress also costs health', () => {
    const calm = of<{ path: string }>(run(week(30, 20)), 'sim.applyDelta').map((d) => d.path);
    expect(calm).toEqual(['player.stress']);
    const burnt = of<{ path: string; value: number }>(run(week(30, 79)), 'sim.applyDelta');
    expect(burnt.map((d) => d.path)).toEqual(['player.stress', 'player.health']);
    expect(burnt[1]!.value).toBe(-2);
  });

  it('ignored scenes cost no hours; only resolved choices with hour costs count', () => {
    const [closed] = of(
      run([state(30), tick, phase('plan'), resolved(8, 'ignored'), phase('consequence')]),
      'workload.weekClosed',
    );
    expect(closed!.extraHours).toBe(0);
    const [closed2] = of(
      run([
        state(30),
        tick,
        phase('plan'),
        resolved(3),
        resolved(2.5, 'fail'),
        { type: 'choice.resolved', payload: { sceneId: 's', choiceId: 'c', outcome: 'ok' } },
        phase('consequence'),
      ]),
      'workload.weekClosed',
    );
    expect(closed2!.extraHours).toBe(5.5);
  });
});

describe('workload: contract', () => {
  it('declares what it uses and needs a known role', () => {
    expect(manifest.emits).toEqual([
      'workload.weekPlanned',
      'workload.weekClosed',
      'sim.applyDelta',
    ]);
    expect(() =>
      workloadModule.createModule({ config: { content, roleId: 'role.nope' } } as never),
    ).toThrow(/unknown role/);
    expect(() => workloadModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
