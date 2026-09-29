import { describe, expect, it } from 'vitest';
import type { ContentView, Effect, EventDraft, GameEvent } from '@je/contracts';
import { SeededRandom, runFixture } from '@je/kernel';
import { directorModule, manifest, type DirectorConfig } from '../src';

const ev = (id: string, extra: Partial<GameEvent> = {}): GameEvent => ({
  id,
  scene: `scene.${id}`,
  ...extra,
});
const viewOf = (events: GameEvent[]): ContentView => ({
  get: ((kind: string, id: string) =>
    kind === 'event' ? events.find((e) => e.id === id) : undefined) as never,
  all: ((kind: string) => (kind === 'event' ? events : [])) as never,
  text: () => undefined,
});

const state = (vars: Record<string, number>, full = true) => ({
  type: 'sim.stateChanged',
  payload: { full, vars },
});
const plan = { type: 'turn.phaseStarted', payload: { phase: 'plan' } };
const ids = (out: EventDraft[] | void): string[] =>
  (out ?? []).map((e) => (e.payload as { eventId: string }).eventId);

/** One-week fixture: state, then the plan phase, on a fixed clock. */
function week(
  events: GameEvent[],
  given: { type: string; payload: unknown }[],
  cfg: Partial<DirectorConfig> = {},
  seed = 'd',
): string[] {
  return ids(
    runFixture(directorModule, {
      seed,
      config: { content: viewOf(events), ...cfg },
      given,
      expect: [],
    }),
  );
}

/** A director driven week by week on a moving clock, with a real seeded RNG stream. */
function driver(events: GameEvent[], cfg: Partial<DirectorConfig> = {}, seed = 'drv') {
  let turn = 0;
  const instance = directorModule.createModule({
    moduleId: 'director',
    rng: new SeededRandom(seed).stream('director'),
    clock: { now: () => ({ turn, year: 0, week_of_year: 0, month_of_year: 1, quarter: 1 }) },
    ports: {} as never,
    config: { content: viewOf(events), ...cfg },
  });
  const envelope = (type: string, payload: unknown) => ({
    id: 'e',
    type,
    v: 1,
    runId: 'r',
    turn,
    source: 'test',
    payload,
  });
  return {
    /** Runs the plan phase of `at` and returns the events fired. */
    plan(at: number): string[] {
      turn = at;
      return ids(
        instance.handlers['turn.phaseStarted']!(envelope('turn.phaseStarted', { phase: 'plan' })),
      );
    },
    resolve(at: number, effects: Effect[]): void {
      turn = at;
      instance.handlers['choice.resolved']!(
        envelope('choice.resolved', { sceneId: 's', choiceId: 'c', outcome: 'ok', effects }),
      );
    },
    snapshot: () =>
      instance.snapshot() as { fired: number; scheduled: { eventId: string; due: number }[] },
  };
}

describe('director: drawing from the pool', () => {
  const pool = [ev('event.a'), ev('event.b'), ev('event.c'), ev('event.d')];

  it('fires between min and max events per week, without repeats within a week', () => {
    const counts = new Set<number>();
    for (let i = 0; i < 60; i++) {
      const fired = week(pool, [state({}), plan], { eventsPerWeek: [1, 3] }, `s${i}`);
      expect(fired.length).toBeGreaterThanOrEqual(1);
      expect(fired.length).toBeLessThanOrEqual(3);
      expect(new Set(fired).size).toBe(fired.length);
      counts.add(fired.length);
    }
    expect(counts.size).toBe(3);
  });

  it('only acts at the plan phase', () => {
    const resolve = { type: 'turn.phaseStarted', payload: { phase: 'resolve' } };
    expect(week(pool, [state({}), resolve])).toEqual([]);
  });

  it('respects the when condition against sim state, and treats unknown variables as false', () => {
    const events = [
      ev('event.calm', { when: { lt: ['player.stress', 40] } }),
      ev('event.tense', { when: { gte: ['player.stress', 40] } }),
      ev('event.ghost', { when: { gte: ['no.such.var', 1] } }),
    ];
    const all = { eventsPerWeek: [3, 3] as [number, number] };
    for (let i = 0; i < 20; i++) {
      expect(week(events, [state({ 'player.stress': 10 }), plan], all, `c${i}`)).toEqual([
        'event.calm',
      ]);
      expect(week(events, [state({ 'player.stress': 80 }), plan], all, `t${i}`)).toEqual([
        'event.tense',
      ]);
    }
  });

  it('follows state changes as they arrive', () => {
    const events = [ev('event.tense', { when: { gte: ['player.stress', 40] } })];
    const given = [state({ 'player.stress': 10 }), state({ 'player.stress': 50 }, false), plan];
    expect(week(events, given, { eventsPerWeek: [1, 1] })).toEqual(['event.tense']);
  });

  it('weight decides how often an event is drawn, and weight 0 is never drawn', () => {
    const events = [
      ev('event.heavy', { weight: 9 }),
      ev('event.light', { weight: 1 }),
      ev('event.never', { weight: 0 }),
    ];
    let heavy = 0;
    for (let i = 0; i < 1500; i++) {
      const fired = week(events, [state({}), plan], { eventsPerWeek: [1, 1] }, `w${i}`);
      expect(fired).toHaveLength(1);
      expect(fired[0]).not.toBe('event.never');
      if (fired[0] === 'event.heavy') heavy += 1;
    }
    expect(heavy / 1500).toBeGreaterThan(0.86);
    expect(heavy / 1500).toBeLessThan(0.94);
  });

  it('is deterministic per seed and varies across seeds', () => {
    const run = (seed: string) => week(pool, [state({}), plan], { eventsPerWeek: [2, 2] }, seed);
    expect(run('same')).toEqual(run('same'));
    expect(new Set(Array.from({ length: 30 }, (_, i) => run(`x${i}`).join())).size).toBeGreaterThan(
      3,
    );
  });
});

describe('director: cooldowns', () => {
  it('will not repeat an event until its cooldown has passed', () => {
    const d = driver([ev('event.only', { cooldown_weeks: 3 })], { eventsPerWeek: [1, 1] });
    expect([0, 1, 2, 3, 4, 5, 6].map((t) => d.plan(t).length)).toEqual([1, 0, 0, 1, 0, 0, 1]);
  });

  it('applies the default cooldown when an event declares none', () => {
    const d = driver([ev('event.x')], { eventsPerWeek: [1, 1], defaultCooldownWeeks: 2 });
    expect([0, 1, 2, 3].map((t) => d.plan(t).length)).toEqual([1, 0, 1, 0]);
  });
});

describe('director: scheduled consequences', () => {
  const events = [
    ev('event.trigger', { effects: [{ schedule: 'event.later', delay_weeks: [2, 4] }] }),
    ev('event.later', { weight: 0 }),
  ];

  it('an event effect schedules another event after a delay in range, and it comes due exactly once', () => {
    for (let i = 0; i < 25; i++) {
      const d = driver(events, { eventsPerWeek: [1, 1], defaultCooldownWeeks: 100 }, `t${i}`);
      const timeline = Array.from({ length: 12 }, (_, turn) => d.plan(turn));
      const triggerTurn = timeline.findIndex((f) => f.includes('event.trigger'));
      const laterTurns = timeline.flatMap((f, turn) => (f.includes('event.later') ? [turn] : []));
      expect(laterTurns).toHaveLength(1);
      expect(laterTurns[0]! - triggerTurn).toBeGreaterThanOrEqual(2);
      expect(laterTurns[0]! - triggerTurn).toBeLessThanOrEqual(4);
    }
  });

  it('a resolved choice can schedule an event too, at the exact delay', () => {
    const d = driver([ev('event.later', { weight: 0 })], { eventsPerWeek: [1, 1] });
    expect([0, 1, 2, 3, 4].map((t) => d.plan(t))).toEqual([[], [], [], [], []]);
    d.resolve(5, [{ schedule: 'event.later', delay_weeks: [3, 3] }]);
    expect(d.snapshot().scheduled).toEqual([{ eventId: 'event.later', due: 8 }]);
    expect([5, 6, 7, 8, 9].map((t) => d.plan(t))).toEqual([[], [], [], ['event.later'], []]);
    expect(d.snapshot().scheduled).toEqual([]);
  });

  it('a scheduled event fires even when its own condition is false, and ignores effects it cannot find', () => {
    const d = driver([ev('event.later', { weight: 0, when: false })], { eventsPerWeek: [1, 1] });
    d.resolve(0, [
      { schedule: 'event.later', delay_weeks: [1, 1] },
      { schedule: 'event.missing', delay_weeks: [1, 1] },
      { delta: 'player.stress', value: 1 },
    ]);
    expect(d.plan(1)).toEqual(['event.later']);
  });

  it('due events take slots before the pool does', () => {
    const d = driver([ev('event.later', { weight: 0 }), ev('event.filler')], {
      eventsPerWeek: [1, 1],
    });
    d.resolve(0, [{ schedule: 'event.later', delay_weeks: [1, 1] }]);
    expect(d.plan(1)).toEqual(['event.later']);
  });
});

describe('director: contract', () => {
  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toEqual(['director.eventFired']);
    expect(() => directorModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });

  it('reports tags with the fired event', () => {
    const out = runFixture(directorModule, {
      config: {
        content: viewOf([ev('event.t', { tags: ['buyer', 'pressure'] })]),
        eventsPerWeek: [1, 1],
      },
      given: [state({}), plan],
      expect: [],
    });
    expect(out[0]!.payload).toEqual({ eventId: 'event.t', tags: ['buyer', 'pressure'] });
  });
});
