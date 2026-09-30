import { describe, expect, it } from 'vitest';
import type { ContentView, EventDraft, Fact } from '@je/contracts';
import { SeededRandom, runFixture } from '@je/kernel';
import { manifest, riskModule, type RiskConfig } from '../src';

const fact = (id: string, severity: number, traces: Fact['traces'] = []): Fact => ({
  id,
  category: 'integrity',
  severity,
  text_key: id,
  ...(traces.length > 0 ? { traces } : {}),
});
const facts = [
  fact('fact.fee', 9, [
    { type: 'payment', visibility: 1, detectors: ['finance', 'internal_audit'] },
  ]),
  fact('fact.cert', 7),
  fact('fact.doc', 7, [{ type: 'document', visibility: 1, detectors: ['internal_audit'] }]),
  fact('fact.chat', 4, [{ type: 'message', visibility: 1, detectors: ['buyer'] }]),
  fact('fact.clean', 2),
];
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'fact' ? facts.find((f) => f.id === id) : undefined) as never,
  all: ((kind: string) => (kind === 'fact' ? facts : [])) as never,
  text: () => undefined,
};

const state = (vars: Record<string, number>, full = true) => ({
  type: 'sim.stateChanged',
  payload: { full, vars },
});
const tick = (week: number, turn = week) => ({
  type: 'clock.ticked',
  payload: { turn, year: 0, week_of_year: week, month_of_year: 1, quarter: 1 },
});
const endPhase = { type: 'turn.phaseStarted', payload: { phase: 'end' } };
const learned = (factId: string, visibility: string) => ({
  type: 'fact.learned',
  payload: { factId, visibility, knownBy: ['player'] },
});
const escalated = (factId: string, to: string) => ({
  type: 'fact.escalated',
  payload: { factId, from: 'private', to, knownBy: ['player'] },
});

function run(
  given: { type: string; payload: unknown }[],
  cfg: Partial<RiskConfig> = {},
  seed = 'risk',
  turn = 0,
): EventDraft[] {
  return runFixture(riskModule, { seed, turn, config: { content, ...cfg }, given, expect: [] });
}
const kinds = (out: EventDraft[], type: string) =>
  out.filter((e) => e.type === type).map((e) => e.payload);

/** A risk module driven week by week, for frequency tests. */
function driver(cfg: Partial<RiskConfig> = {}, seed = 'drv') {
  let turn = 0;
  const instance = riskModule.createModule({
    moduleId: 'risk',
    rng: new SeededRandom(seed).stream('risk'),
    clock: { now: () => ({ turn, year: 0, week_of_year: 0, month_of_year: 1, quarter: 1 }) },
    ports: {} as never,
    config: { content, ...cfg },
  });
  const env = (type: string, payload: unknown) => ({
    id: 'e',
    type,
    v: 1,
    runId: 'r',
    turn,
    source: 't',
    payload,
  });
  return {
    feed(type: string, payload: unknown, at = turn): EventDraft[] {
      turn = at;
      return instance.handlers[type]!(env(type, payload)) ?? [];
    },
  };
}

describe('risk: detection', () => {
  const privateFacts = state({ 'fact.fee': 1, 'fact.doc': 1, 'fact.chat': 1, 'fact.clean': 1 });

  it('a detector that finds a private fact reports it and asks the ledger to make it witnessed', () => {
    const out = run([privateFacts, tick(3)], {
      detectBase: 1,
      strengths: { finance: 1, buyer: 1 },
    });
    expect(kinds(out, 'risk.detected')).toEqual([
      { factId: 'fact.chat', detector: 'buyer', trace: 'message', audit: false },
      { factId: 'fact.fee', detector: 'finance', trace: 'payment', audit: false },
    ]);
    expect(kinds(out, 'knowledge.escalate')).toEqual([
      { factId: 'fact.chat', to: 'witnessed', reason: 'detected:buyer' },
      { factId: 'fact.fee', to: 'witnessed', reason: 'detected:finance' },
    ]);
  });

  it('the internal audit only looks in audit weeks, and then looks hard', () => {
    const cfg = { detectBase: 0, auditFactor: 1, strengths: { internal_audit: 1 } };
    expect(kinds(run([privateFacts, tick(3)], cfg), 'risk.detected')).toEqual([]);
    const audit = run([privateFacts, tick(12)], cfg);
    expect(kinds(audit, 'risk.auditStarted')).toEqual([{ turn: 12 }]);
    expect(kinds(audit, 'risk.detected').map((d) => (d as { factId: string }).factId)).toEqual([
      'fact.doc',
      'fact.fee',
    ]);
    expect((kinds(audit, 'risk.detected')[0] as { audit: boolean }).audit).toBe(true);
  });

  it('only the internal audit itself counts as an audit finding, even in an audit week', () => {
    const cfg = { detectBase: 1, auditFactor: 0, strengths: { finance: 1 } };
    const out = run([state({ 'fact.fee': 1 }), tick(12)], cfg);
    expect(kinds(out, 'risk.detected')).toEqual([
      { factId: 'fact.fee', detector: 'finance', trace: 'payment', audit: false },
    ]);
  });

  it('audit weeks are configurable', () => {
    expect(kinds(run([tick(12)], { auditWeeks: [5] }), 'risk.auditStarted')).toEqual([]);
    expect(kinds(run([tick(5)], { auditWeeks: [5] }), 'risk.auditStarted')).toEqual([{ turn: 5 }]);
  });

  it('only private facts with evidence can be found', () => {
    const known = state({ 'fact.fee': 2, 'fact.doc': 3, 'fact.chat': 4, 'fact.clean': 1 });
    const cfg = {
      detectBase: 1,
      auditFactor: 1,
      strengths: { finance: 1, buyer: 1, internal_audit: 1 },
    };
    expect(kinds(run([known, tick(12)], cfg), 'risk.detected')).toEqual([]);
    expect(kinds(run([state({}), tick(12)], cfg), 'risk.detected')).toEqual([]); // nothing known at all
  });

  it('finds at most one thing per fact per week', () => {
    const cfg = { detectBase: 1, auditFactor: 1, strengths: { finance: 1, internal_audit: 1 } };
    const out = run([state({ 'fact.fee': 1 }), tick(12)], cfg);
    expect(kinds(out, 'risk.detected')).toHaveLength(1);
  });

  it('serious, visible evidence is found more often than faint evidence', () => {
    const rate = (visibility: number) => {
      const faint: Fact = fact('fact.x', 5, [
        { type: 'record', visibility, detectors: ['finance'] },
      ]);
      const view: ContentView = {
        ...content,
        all: (() => [faint]) as never,
        get: (() => faint) as never,
      };
      let hits = 0;
      for (let i = 0; i < 400; i++) {
        const d = driver({ content: view }, `v${i}`);
        d.feed('sim.stateChanged', { full: true, vars: { 'fact.x': 1 } });
        for (let w = 0; w < 26; w++)
          hits += d
            .feed('clock.ticked', tick(w).payload, w)
            .filter((e) => e.type === 'risk.detected').length;
        // A found fact would become witnessed; here we keep it private to count every roll.
      }
      return hits;
    };
    expect(rate(1)).toBeGreaterThan(rate(0.2) * 2);
    expect(rate(0)).toBe(0);
  });

  it('roughly half of the worst deeds come out within a year at default settings', () => {
    const worst: Fact = fact('fact.fee', 9, [
      { type: 'payment', visibility: 0.5, detectors: ['finance', 'internal_audit'] },
    ]);
    const view: ContentView = {
      ...content,
      all: (() => [worst]) as never,
      get: (() => worst) as never,
    };
    let found = 0;
    const runs = 400;
    for (let i = 0; i < runs; i++) {
      const d = driver({ content: view }, `yr${i}`);
      d.feed('sim.stateChanged', { full: true, vars: { 'fact.fee': 1 } });
      for (let w = 0; w < 52; w++) {
        const out = d.feed('clock.ticked', tick(w).payload, w);
        if (out.some((e) => e.type === 'risk.detected')) {
          found += 1;
          break;
        }
      }
    }
    expect(found / runs).toBeGreaterThan(0.35);
    expect(found / runs).toBeLessThan(0.65);
  });
});

describe('risk: endings chosen in a scene', () => {
  const resolved = (effects: unknown[]) => ({
    type: 'choice.resolved',
    payload: { sceneId: 's', choiceId: 'c', outcome: 'ok', effects },
  });

  it('a choice that ends the run asks for that ending, once', () => {
    const out = run([resolved([{ ending: 'promoted' }]), resolved([{ ending: 'walked_away' }])]);
    expect(kinds(out, 'run.endRequested')).toEqual([{ ending: 'promoted', reason: 'choice' }]);
  });

  it('ignores choices whose effects do not end the run', () => {
    expect(run([resolved([{ delta: 'player.stress', value: 1 }]), resolved([])])).toEqual([]);
  });

  it('does not add a second ending request at the end phase after one was chosen', () => {
    const out = run([
      state({ 'player.health': 0 }),
      resolved([{ ending: 'walked_away' }]),
      tick(9, 9),
      endPhase,
    ]);
    expect(kinds(out, 'run.endRequested')).toEqual([{ ending: 'walked_away', reason: 'choice' }]);
  });
});

describe('risk: scapegoating', () => {
  const blamed = (boss: number, severity: number, seed: string) => {
    const d = driver(
      { content: { ...content, get: (() => fact('fact.s', severity)) as never } },
      seed,
    );
    d.feed('sim.stateChanged', { full: true, vars: { 'player.rep.boss': boss } });
    return d
      .feed('fact.escalated', escalated('fact.s', 'witnessed').payload)
      .some((e) => e.type === 'risk.scapegoated');
  };
  const rate = (boss: number, severity: number) =>
    Array.from({ length: 600 }, (_, i) =>
      blamed(boss, severity, `s${boss}-${severity}-${i}`),
    ).filter(Boolean).length / 600;

  it('is likelier when the boss thinks little of you, and when the fact is serious', () => {
    expect(rate(10, 9)).toBeGreaterThan(rate(90, 9));
    expect(rate(50, 9)).toBeGreaterThan(rate(50, 6));
    expect(rate(0, 9)).toBeLessThanOrEqual(0.75 + 0.06);
  });

  it('never blames you for something minor, and costs boss standing and stress when it happens', () => {
    expect(rate(0, 5)).toBe(0);
    let out: EventDraft[] = [];
    for (let i = 0; i < 200 && !out.some((e) => e.type === 'risk.scapegoated'); i++) {
      const d = driver(
        { content: { ...content, get: (() => fact('fact.s', 9)) as never } },
        `x${i}`,
      );
      d.feed('sim.stateChanged', { full: true, vars: { 'player.rep.boss': 10 } });
      out = d.feed('fact.escalated', escalated('fact.s', 'public').payload);
    }
    expect(kinds(out, 'sim.applyDelta')).toEqual([
      { path: 'player.rep.boss', value: -6, reason: 'risk:scapegoat:fact.s' },
      { path: 'player.stress', value: 5, reason: 'risk:scapegoat:fact.s' },
    ]);
  });

  it('considers each fact once, and not a fact only the player knows', () => {
    const d = driver({ content: { ...content, get: (() => fact('fact.s', 9)) as never } }, 'once');
    d.feed('sim.stateChanged', { full: true, vars: { 'player.rep.boss': 0 } });
    expect(d.feed('fact.learned', learned('fact.s', 'private').payload)).toEqual([]);
    const first = d.feed('fact.escalated', escalated('fact.s', 'witnessed').payload);
    const second = d.feed('fact.escalated', escalated('fact.s', 'public').payload);
    expect(second).toEqual([]);
    expect([0, 3]).toContain(first.length);
  });
});

describe('risk: endings', () => {
  /** Two end-of-week checks in a row, which is how long a situation must last to end the run. */
  const ending = (vars: Record<string, number>, turn = 20, weeks = 2) =>
    kinds(
      run([state(vars), ...Array.from({ length: weeks }, () => endPhase)], {}, 'end', turn),
      'run.endRequested',
    );

  it('nothing happens to a player in good standing', () => {
    expect(ending({ 'player.rep.boss': 60, 'player.health': 80 })).toEqual([]);
  });

  it('burnout at zero health, straight away', () => {
    expect(ending({ 'player.health': 0 }, 20, 1)).toEqual([{ ending: 'burnout', reason: 'risk' }]);
  });

  it('a low standing alone is a bad year, not a firing', () => {
    expect(ending({ 'player.rep.boss': 0 })).toEqual([]);
  });

  it('fired when a scandal is out and the boss has written you off', () => {
    expect(ending({ 'fact.doc': 3, 'player.rep.boss': 10 })).toEqual([
      { ending: 'fired', reason: 'risk' },
    ]);
    expect(ending({ 'fact.doc': 3, 'player.rep.boss': 11 })).toEqual([]);
    expect(ending({ 'fact.doc': 2, 'player.rep.boss': 0 })).toEqual([]); // only witnessed so far
    expect(ending({ 'fact.chat': 4, 'player.rep.boss': 0 })).toEqual([]); // too minor to be a scandal
  });

  it('fired after two serious public scandals with a poor standing', () => {
    const vars = { 'fact.cert': 4, 'fact.doc': 4, 'player.rep.boss': 25 };
    expect(ending(vars)).toEqual([{ ending: 'fired', reason: 'risk' }]);
    expect(ending({ ...vars, 'fact.doc': 3 })).toEqual([]); // the second is only a rumor
    expect(ending({ ...vars, 'player.rep.boss': 26 })).toEqual([]);
  });

  it('prosecuted when a grave fact is public and the boss will not cover for you', () => {
    expect(ending({ 'fact.fee': 4, 'player.rep.boss': 30 })).toEqual([
      { ending: 'prosecuted', reason: 'risk' },
    ]);
    expect(ending({ 'fact.fee': 4, 'player.rep.boss': 31 })).toEqual([]);
    expect(ending({ 'fact.fee': 3, 'player.rep.boss': 30 })).toEqual([]); // a rumor is not yet a case
  });

  it('burnout outranks prosecution, which outranks being fired', () => {
    expect(
      ending({ 'player.health': 0, 'fact.fee': 4, 'player.rep.boss': 0 }, 20, 1)[0],
    ).toMatchObject({
      ending: 'burnout',
    });
    expect(ending({ 'fact.fee': 4, 'fact.doc': 4, 'player.rep.boss': 0 })[0]).toMatchObject({
      ending: 'prosecuted',
    });
  });

  it('gives a grace period: the situation must last, and a recovery resets the count', () => {
    const d = driver();
    const bad = { full: true, vars: { 'fact.doc': 3, 'player.rep.boss': 5 } };
    const better = { full: true, vars: { 'fact.doc': 3, 'player.rep.boss': 40 } };
    d.feed('sim.stateChanged', bad);
    expect(d.feed('turn.phaseStarted', endPhase.payload, 20)).toEqual([]); // first bad week
    d.feed('sim.stateChanged', better);
    expect(d.feed('turn.phaseStarted', endPhase.payload, 21)).toEqual([]); // recovered: count resets
    d.feed('sim.stateChanged', bad);
    expect(d.feed('turn.phaseStarted', endPhase.payload, 22)).toEqual([]); // first bad week again
    expect(d.feed('turn.phaseStarted', endPhase.payload, 23)).toHaveLength(1); // second in a row
  });

  it('the grace period is configurable', () => {
    const vars = { 'fact.doc': 3, 'player.rep.boss': 5 };
    const once = run([state(vars), endPhase], { graceWeeks: 1 }, 'g', 20);
    expect(kinds(once, 'run.endRequested')).toHaveLength(1);
  });

  it('never in the first weeks, and only once', () => {
    expect(ending({ 'player.health': 0 }, 3, 1)).toEqual([]);
    const d = driver();
    d.feed('sim.stateChanged', { full: true, vars: { 'player.health': 0 } });
    expect(d.feed('turn.phaseStarted', endPhase.payload, 20)).toHaveLength(1);
    expect(d.feed('turn.phaseStarted', endPhase.payload, 21)).toEqual([]);
  });

  it('only at the end of a turn', () => {
    const out = run(
      [state({ 'player.health': 0 }), { type: 'turn.phaseStarted', payload: { phase: 'plan' } }],
      {},
      's',
      20,
    );
    expect(out).toEqual([]);
  });
});

describe('risk: contract', () => {
  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toContain('run.endRequested');
    expect(() => riskModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
