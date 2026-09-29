import { describe, expect, it } from 'vitest';
import type { ContentView, Effect, EventDraft, Fact, Scene } from '@je/contracts';
import { Run, runFixture } from '@je/kernel';
import { factRank, knowledgeModule, manifest } from '../src';

const fact = (id: string): Fact => ({
  id,
  category: 'integrity',
  severity: 5,
  text_key: `t.${id}`,
});
const facts = new Map(['fact.a', 'fact.b'].map((id) => [id, fact(id)]));
const scene: Scene = {
  id: 'scene.s',
  location: 'loc.x',
  cast: ['role:boss', 'role:buyer_contact'],
  lines: [{ speaker: 'a', text_key: 'k' }],
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'fact'
      ? facts.get(id)
      : kind === 'scene' && id === scene.id
        ? scene
        : undefined) as never,
  all: (() => []) as never,
  text: () => undefined,
};

const resolved = (effects: Effect[], sceneId = 'scene.s') => ({
  type: 'choice.resolved',
  payload: { sceneId, choiceId: 'c1', outcome: 'ok', effects },
});
const escalate = (factId: string, to: string) => ({
  type: 'knowledge.escalate',
  payload: { factId, to },
});
const run = (given: { type: string; payload: unknown }[]): EventDraft[] =>
  runFixture(knowledgeModule, { config: { content }, given, expect: [] });
const only = (out: EventDraft[], type: string) =>
  out.filter((e) => e.type === type).map((e) => e.payload);

describe('knowledge: learning facts', () => {
  it('a private fact is known to the player alone and is published as a state variable', () => {
    const out = run([resolved([{ fact: 'fact.a', visibility: 'private' }])]);
    expect(out.map((e) => e.type)).toEqual(['sim.applyDelta', 'fact.learned']);
    expect(out[0]!.payload).toMatchObject({ path: 'fact.a', value: 1, mode: 'set' });
    expect(out[1]!.payload).toEqual({
      factId: 'fact.a',
      visibility: 'private',
      knownBy: ['player'],
      sceneId: 'scene.s',
    });
  });

  it('a witnessed fact is also known to the roles who were in the scene', () => {
    const [learned] = only(
      run([resolved([{ fact: 'fact.a', visibility: 'witnessed' }])]),
      'fact.learned',
    );
    expect(learned).toMatchObject({
      visibility: 'witnessed',
      knownBy: ['player', 'boss', 'buyer_contact'],
    });
  });

  it('a public fact is known to everyone', () => {
    const [learned] = only(
      run([resolved([{ fact: 'fact.a', visibility: 'public' }])]),
      'fact.learned',
    );
    expect((learned as { knownBy: string[] }).knownBy).toEqual([
      'player',
      'boss',
      'buyer_contact',
      'everyone',
    ]);
  });

  it('handles several facts in one outcome, ignoring non-fact effects', () => {
    const out = run([
      resolved([
        { fact: 'fact.a', visibility: 'private' },
        { delta: 'player.stress', value: 3 },
        { schedule: 'event.x', delay_weeks: [1, 2] },
        { fact: 'fact.b', visibility: 'witnessed' },
      ]),
    ]);
    expect(only(out, 'fact.learned').map((p) => (p as { factId: string }).factId)).toEqual([
      'fact.a',
      'fact.b',
    ]);
  });

  it('a resolved choice with no effects does nothing', () => {
    expect(
      run([{ type: 'choice.resolved', payload: { sceneId: 's', choiceId: 'c', outcome: 'ok' } }]),
    ).toEqual([]);
  });
});

describe('knowledge: facts only become better known', () => {
  it('escalates from private to witnessed to rumor to public, with rank and event each time', () => {
    const out = run([
      resolved([{ fact: 'fact.a', visibility: 'private' }]),
      escalate('fact.a', 'witnessed'),
      escalate('fact.a', 'rumor'),
      escalate('fact.a', 'public'),
    ]);
    expect(only(out, 'sim.applyDelta').map((p) => (p as { value: number }).value)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(only(out, 'fact.escalated')).toEqual([
      {
        factId: 'fact.a',
        from: 'private',
        to: 'witnessed',
        knownBy: ['player', 'boss', 'buyer_contact'],
      },
      {
        factId: 'fact.a',
        from: 'witnessed',
        to: 'rumor',
        knownBy: ['player', 'boss', 'buyer_contact'],
      },
      {
        factId: 'fact.a',
        from: 'rumor',
        to: 'public',
        knownBy: ['player', 'boss', 'buyer_contact', 'everyone'],
      },
    ]);
  });

  it('remembers the scene, so a leak has witnesses even without a scene in the command', () => {
    const out = run([
      resolved([{ fact: 'fact.a', visibility: 'private' }]),
      escalate('fact.a', 'witnessed'),
    ]);
    expect((only(out, 'fact.escalated')[0] as { knownBy: string[] }).knownBy).toContain('boss');
  });

  it('ignores repeats and downgrades', () => {
    const out = run([
      resolved([{ fact: 'fact.a', visibility: 'public' }]),
      resolved([{ fact: 'fact.a', visibility: 'private' }]),
      resolved([{ fact: 'fact.a', visibility: 'public' }]),
      escalate('fact.a', 'rumor'),
    ]);
    expect(out.filter((e) => e.type === 'fact.learned')).toHaveLength(1);
    expect(out.filter((e) => e.type === 'fact.escalated')).toHaveLength(0);
  });

  it('rejects a fact that content does not define', () => {
    expect(() => run([resolved([{ fact: 'fact.nope', visibility: 'private' }])])).toThrow(
      /unknown fact/,
    );
  });

  it('ranks visibilities in order', () => {
    expect(['private', 'witnessed', 'rumor', 'public'].map((v) => factRank(v as never))).toEqual([
      1, 2, 3, 4,
    ]);
  });
});

describe('knowledge: in a run', () => {
  it('snapshots the ledger with who knows what', () => {
    const run = new Run({
      seed: 's',
      modules: [knowledgeModule],
      configs: { knowledge: { content } },
    });
    run.start();
    run.submit('knowledge.escalate', { factId: 'fact.b', to: 'rumor' });
    expect(run.snapshot().knowledge).toEqual({
      'fact.b': { visibility: 'rumor', firstTurn: 0, knownBy: ['player'] },
    });
  });

  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toEqual(['sim.applyDelta', 'fact.learned', 'fact.escalated']);
    expect(() => knowledgeModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
