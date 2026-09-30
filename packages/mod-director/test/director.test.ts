import { describe, expect, it } from 'vitest';
import type { Arc, ContentView, Effect, EventDraft, GameEvent } from '@je/contracts';
import { SeededRandom, runFixture } from '@je/kernel';
import { directorModule, manifest, type DirectorConfig } from '../src';

const ev = (id: string, extra: Partial<GameEvent> = {}): GameEvent => ({
  id,
  scene: `scene.${id}`,
  ...extra,
});
const viewOf = (events: GameEvent[], arcs: Arc[] = []): ContentView => ({
  get: ((kind: string, id: string) =>
    kind === 'event'
      ? events.find((e) => e.id === id)
      : kind === 'arc'
        ? arcs.find((a) => a.id === id)
        : undefined) as never,
  all: ((kind: string) => (kind === 'event' ? events : kind === 'arc' ? arcs : [])) as never,
  text: () => undefined,
});

const state = (vars: Record<string, number>, full = true) => ({
  type: 'sim.stateChanged',
  payload: { full, vars },
});
const plan = { type: 'turn.phaseStarted', payload: { phase: 'plan' } };
const ids = (out: EventDraft[] | void): string[] =>
  (out ?? [])
    .filter((e) => e.type === 'director.eventFired')
    .map((e) => (e.payload as { eventId: string }).eventId);

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
function driver(
  events: GameEvent[],
  cfg: Partial<DirectorConfig> = {},
  seed = 'drv',
  arcs: Arc[] = [],
) {
  let turn = 0;
  const instance = directorModule.createModule({
    moduleId: 'director',
    rng: new SeededRandom(seed).stream('director'),
    clock: { now: () => ({ turn, year: 0, week_of_year: 0, month_of_year: 1, quarter: 1 }) },
    ports: {} as never,
    config: { content: viewOf(events, arcs), ...cfg },
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
      return ids(this.planAll(at));
    },
    /** Tells the director what the world looks like now. */
    state(vars: Record<string, number>): void {
      instance.handlers['sim.stateChanged']!(envelope('sim.stateChanged', { full: false, vars }));
    },
    /** Like plan, but returns every draft (arc events included). */
    planAll(at: number): EventDraft[] {
      turn = at;
      return (
        instance.handlers['turn.phaseStarted']!(envelope('turn.phaseStarted', { phase: 'plan' })) ??
        []
      );
    },
    resolve(at: number, effects: Effect[]): EventDraft[] {
      turn = at;
      return (
        instance.handlers['choice.resolved']!(
          envelope('choice.resolved', { sceneId: 's', choiceId: 'c', outcome: 'ok', effects }),
        ) ?? []
      );
    },
    snapshot: () =>
      instance.snapshot() as {
        fired: number;
        scheduled: { eventId: string; due: number }[];
        arcs: Record<string, { status: string; stage?: string }>;
      },
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

describe('director: beats (fixed episodes of the season)', () => {
  const events = [
    ev('event.premiere', { beat: { from_week: 1, to_week: 3 } }),
    ev('event.twist', { beat: { from_week: 5, to_week: 7 }, when: { gte: ['player.stress', 50] } }),
    ev('event.filler'),
  ];
  const feed = (stress: number) => {
    const d = driver(events, { eventsPerWeek: [1, 1], defaultCooldownWeeks: 1 }, 'beats');
    d.state({ 'player.stress': stress });
    return Array.from({ length: 10 }, (_, i) => d.plan(i));
  };

  it('plays a beat once, in the first week of its window, and never from the random pool', () => {
    const weeks = feed(80);
    expect(weeks[0]).toContain('event.premiere');
    expect(weeks.flat().filter((id) => id === 'event.premiere')).toHaveLength(1);
    expect(weeks[4]).toContain('event.twist'); // week 5
    expect(weeks.flat().filter((id) => id === 'event.twist')).toHaveLength(1);
    expect(feed(0).flat()).not.toContain('event.twist');
  });

  it('waits inside the window for its condition, and is missed if the window closes first', () => {
    const d = driver(events, { eventsPerWeek: [1, 1], defaultCooldownWeeks: 1 }, 'late');
    d.state({ 'player.stress': 10 });
    expect([3, 4, 5].flatMap((t) => d.plan(t))).not.toContain('event.twist');
    d.state({ 'player.stress': 90 });
    expect(d.plan(6)).toContain('event.twist');
    const missed = driver(events, { eventsPerWeek: [1, 1], defaultCooldownWeeks: 1 }, 'late');
    missed.state({ 'player.stress': 10 });
    expect([3, 4, 5, 6, 7, 8].flatMap((t) => missed.plan(t))).not.toContain('event.twist');
  });

  it('a beat shares the week with the pool and only one beat plays a week', () => {
    const two = [
      ev('event.one', { beat: { from_week: 1, to_week: 1 } }),
      ev('event.two', { beat: { from_week: 1, to_week: 2 } }),
      ev('event.pool'),
    ];
    const d = driver(two, { eventsPerWeek: [2, 2], defaultCooldownWeeks: 1 }, 'two');
    expect(d.plan(0)).toEqual(['event.one', 'event.pool']);
    expect(d.plan(1)).toContain('event.two');
  });
});

describe('director: storylines (arcs)', () => {
  const arc: Arc = {
    id: 'arc.hamper',
    title_key: 't',
    stages: [
      { id: 'gift', event: 'event.gift' },
      { id: 'favour', event: 'event.favour', delay_weeks: [2, 2] },
      { id: 'threat', event: 'event.threat', delay_weeks: [3, 3] },
    ],
  };
  const events = [
    ev('event.gift', { arc: 'arc.hamper', weight: 1 }),
    ev('event.favour', { weight: 0 }),
    ev('event.threat', { weight: 0 }),
  ];
  const types = (out: EventDraft[]) => out.map((e) => e.type);

  it('an event tagged with an arc starts it, once', () => {
    const d = driver(events, { eventsPerWeek: [1, 1], defaultCooldownWeeks: 1 }, 'a', [arc]);
    const first = d.planAll(0);
    expect(types(first)).toEqual(['director.eventFired', 'arc.started']);
    expect(first[1]!.payload).toEqual({ arc: 'arc.hamper', eventId: 'event.gift' });
    expect(types(d.planAll(3))).toEqual(['director.eventFired']);
  });

  it('a choice effect moves the arc to a stage and its event comes due after the stage delay', () => {
    const d = driver(events, { eventsPerWeek: [1, 1] }, 'b', [arc]);
    d.planAll(0);
    const moved = d.resolve(1, [{ arc: 'arc.hamper', stage: 'favour' }]);
    expect(moved).toEqual([
      {
        type: 'arc.advanced',
        payload: { arc: 'arc.hamper', stage: 'favour', eventId: 'event.favour', due: 3 },
      },
    ]);
    expect([1, 2].map((t) => d.plan(t))).toEqual([[], []]);
    expect(d.plan(3)).toEqual(['event.favour']);
  });

  it('different choices branch to different stages, and the last stage finishes the arc', () => {
    const d = driver(events, { eventsPerWeek: [1, 1] }, 'c', [arc]);
    d.planAll(0);
    d.resolve(1, [{ arc: 'arc.hamper', stage: 'threat' }]);
    expect(d.plan(4)).toEqual(['event.threat']);
    expect(d.snapshot()).toMatchObject({
      arcs: { 'arc.hamper': { status: 'ended', stage: 'threat' } },
    });
  });

  it('stage "end" ends an arc early, and an ended arc ignores later effects', () => {
    const d = driver(events, { eventsPerWeek: [1, 1] }, 'd', [arc]);
    d.planAll(0);
    expect(d.resolve(1, [{ arc: 'arc.hamper', stage: 'end' }])).toEqual([
      { type: 'arc.ended', payload: { arc: 'arc.hamper', reason: 'end' } },
    ]);
    expect(d.resolve(2, [{ arc: 'arc.hamper', stage: 'favour' }])).toEqual([]);
    expect(d.snapshot().scheduled).toEqual([]);
  });

  it('ignores effects for unknown arcs and stages', () => {
    const d = driver(events, { eventsPerWeek: [1, 1] }, 'e', [arc]);
    expect(
      d.resolve(1, [
        { arc: 'arc.nope', stage: 'x' },
        { arc: 'arc.hamper', stage: 'nope' },
      ]),
    ).toEqual([]);
  });

  it('is deterministic for a seed', () => {
    const go = () => {
      const d = driver(events, { eventsPerWeek: [1, 2] }, 'same', [arc]);
      const out = [d.planAll(0), d.resolve(1, [{ arc: 'arc.hamper', stage: 'favour' }])];
      for (let t = 2; t < 8; t++) out.push(d.planAll(t));
      return JSON.stringify(out);
    };
    expect(go()).toBe(go());
  });
});

describe('director: roles', () => {
  const events = [
    ev('event.any'),
    ev('event.sales', { role: 'role.sales' }),
    ev('event.qc', { role: 'role.qc' }),
  ];
  const as = (role: string | undefined, seed = 'r') =>
    week(
      events,
      [
        {
          type: 'sim.stateChanged',
          payload: { full: true, vars: role ? { 'player.role': role } : {} },
        },
        plan,
      ],
      { eventsPerWeek: [3, 3] },
      seed,
    ).sort();

  it('draws events for everybody plus the ones for the player role, and never another role', () => {
    expect(as('role.sales')).toEqual(['event.any', 'event.sales']);
    expect(as('role.qc')).toEqual(['event.any', 'event.qc']);
  });

  it('a player with no known role only gets the events meant for everybody', () => {
    expect(as(undefined)).toEqual(['event.any']);
  });

  it('a scheduled consequence is delivered whatever the role', () => {
    const d = driver([ev('event.audit', { role: 'role.other', weight: 0 })], {
      eventsPerWeek: [1, 1],
    });
    d.resolve(0, [{ schedule: 'event.audit', delay_weeks: [1, 1] }]);
    expect(d.plan(1)).toEqual(['event.audit']);
  });
});

describe('director: contract', () => {
  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toEqual([
      'director.eventFired',
      'arc.started',
      'arc.advanced',
      'arc.ended',
    ]);
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
