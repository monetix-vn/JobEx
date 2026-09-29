import { describe, expect, it } from 'vitest';
import type { ContentView, EventDraft, Fact } from '@je/contracts';
import { SeededRandom, runFixture } from '@je/kernel';
import { manifest, socialModule, type SocialConfig } from '../src';

const grave: Fact = {
  id: 'fact.grave',
  category: 'integrity',
  severity: 10,
  text_key: 't',
  consequences: { witnessed: { finance: -8, boss: -6 }, public: { boss: -12, buyer: -5 } },
};
const minor: Fact = { id: 'fact.minor', category: 'other', severity: 1, text_key: 't' };
const good: Fact = {
  id: 'fact.good',
  category: 'integrity',
  severity: 2,
  text_key: 't',
  consequences: { witnessed: { boss: 3 } },
};
const facts = new Map([grave, minor, good].map((f) => [f.id, f]));
const content: ContentView = {
  get: ((kind: string, id: string) => (kind === 'fact' ? facts.get(id) : undefined)) as never,
  all: (() => []) as never,
  text: () => undefined,
};

const learned = (factId: string, visibility: string) => ({
  type: 'fact.learned',
  payload: { factId, visibility, knownBy: ['player'] },
});
const escalated = (factId: string, from: string, to: string) => ({
  type: 'fact.escalated',
  payload: { factId, from, to, knownBy: ['player'] },
});
const tick = {
  type: 'clock.ticked',
  payload: { turn: 1, year: 0, week_of_year: 1, month_of_year: 1, quarter: 1 },
};

const run = (
  given: { type: string; payload: unknown }[],
  cfg: Partial<SocialConfig> = {},
  seed = 'soc',
): EventDraft[] =>
  runFixture(socialModule, { seed, config: { content, ...cfg }, given, expect: [] });
const reps = (out: EventDraft[]) =>
  out
    .filter((e) => e.type === 'sim.applyDelta')
    .map((e) => [(e.payload as { path: string }).path, (e.payload as { value: number }).value]);

describe('social: reputation consequences', () => {
  it('a private fact costs nothing yet', () => {
    expect(reps(run([learned('fact.grave', 'private')]))).toEqual([]);
  });

  it('a fact witnessed at once applies the witnessed consequences, once', () => {
    const out = run([
      learned('fact.grave', 'witnessed'),
      escalated('fact.grave', 'private', 'witnessed'),
    ]);
    expect(reps(out)).toEqual([
      ['player.rep.boss', -6],
      ['player.rep.finance', -8],
    ]);
  });

  it('going public applies the public consequences on top, and rumor applies nothing', () => {
    const out = run([
      learned('fact.grave', 'witnessed'),
      escalated('fact.grave', 'witnessed', 'rumor'),
      escalated('fact.grave', 'rumor', 'public'),
    ]);
    expect(reps(out)).toEqual([
      ['player.rep.boss', -6],
      ['player.rep.finance', -8],
      ['player.rep.boss', -12],
      ['player.rep.buyer', -5],
    ]);
    expect(
      out.every((e) => (e.payload as { reason?: string }).reason?.startsWith('fact:fact.grave:')),
    ).toBe(true);
  });

  it('a fact that skips straight to public applies the witnessed level too, in order', () => {
    const out = run([learned('fact.grave', 'public')]);
    expect(reps(out).map(([path]) => path)).toEqual([
      'player.rep.boss',
      'player.rep.finance',
      'player.rep.boss',
      'player.rep.buyer',
    ]);
  });

  it('honest deeds can raise reputation, and facts without consequences change nothing', () => {
    expect(reps(run([learned('fact.good', 'witnessed')]))).toEqual([['player.rep.boss', 3]]);
    expect(reps(run([learned('fact.minor', 'public')]))).toEqual([]);
  });
});

describe('social: gossip', () => {
  const weeks = (
    start: { type: string; payload: unknown }[],
    n: number,
    cfg: Partial<SocialConfig> = {},
    seed = 'g',
  ) => {
    const instance = socialModule.createModule({
      moduleId: 'social',
      rng: new SeededRandom(seed).stream('social'),
      clock: { now: () => ({ turn: 0, year: 0, week_of_year: 0, month_of_year: 1, quarter: 1 }) },
      ports: {} as never,
      config: { content, ...cfg },
    });
    const env = (type: string, payload: unknown) => ({
      id: 'e',
      type,
      v: 1,
      runId: 'r',
      turn: 0,
      source: 't',
      payload,
    });
    for (const e of start) instance.handlers[e.type]!(env(e.type, e.payload));
    const escalations: { factId: string; to: string; reason: string }[] = [];
    for (let i = 0; i < n; i++) {
      const out = instance.handlers['clock.ticked']!(env('clock.ticked', tick.payload));
      for (const d of out ?? []) escalations.push(d.payload as never);
    }
    return escalations;
  };

  it('spreads witnessed facts to rumor, and rumors to public, only by asking the ledger', () => {
    const asked = run([learned('fact.grave', 'witnessed'), tick], { gossipPerSeverity: 0.5 });
    expect(asked.filter((e) => e.type === 'knowledge.escalate').map((e) => e.payload)).toEqual([
      { factId: 'fact.grave', to: 'rumor', reason: 'gossip' },
    ]);
    const next = run([learned('fact.grave', 'rumor'), tick], { gossipPerSeverity: 0.5 });
    expect(
      next
        .filter((e) => e.type === 'knowledge.escalate')
        .map((e) => (e.payload as { to: string }).to),
    ).toEqual(['public']);
  });

  it('never spreads a public fact', () => {
    expect(
      weeks([learned('fact.grave', 'public')], 200, { gossipPerSeverity: 1, leakPerSeverity: 1 }),
    ).toEqual([]);
  });

  it('severity decides how fast word gets around', () => {
    const rate = (fact: string) =>
      Array.from(
        { length: 40 },
        (_, i) => weeks([learned(fact, 'witnessed')], 1, {}, `s${i}`).length,
      ).reduce((a, b) => a + b, 0);
    // Severity 10 spreads at 0.2 a week, severity 1 at 0.02: expect roughly ten to one.
    expect(rate('fact.grave')).toBeGreaterThan(rate('fact.minor'));
  });

  it('private facts sometimes leak to the people who were there, more often when serious', () => {
    const leaks = (fact: string) =>
      Array.from(
        { length: 300 },
        (_, i) => weeks([learned(fact, 'private')], 30, {}, `l${i}`).length,
      ).reduce((a, b) => a + b, 0);
    const grave10 = leaks('fact.grave');
    const minor1 = leaks('fact.minor');
    expect(grave10).toBeGreaterThan(minor1);
    expect(grave10 / 300).toBeGreaterThan(0.25); // 1 - (1 - 0.015)^30 is about 0.37
    expect(grave10 / 300).toBeLessThan(0.5);
    expect(weeks([learned('fact.grave', 'private')], 1000, { leakPerSeverity: 0 })).toEqual([]);
    expect(weeks([learned('fact.grave', 'private')], 1, { leakPerSeverity: 1 })[0]).toEqual({
      factId: 'fact.grave',
      to: 'witnessed',
      reason: 'leak',
    });
  });

  it('is deterministic per seed', () => {
    const a = weeks([learned('fact.grave', 'witnessed')], 50, {}, 'same');
    expect(weeks([learned('fact.grave', 'witnessed')], 50, {}, 'same')).toEqual(a);
  });
});

describe('social: contract', () => {
  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toEqual(['sim.applyDelta', 'knowledge.escalate']);
    expect(() => socialModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
