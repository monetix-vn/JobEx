import { describe, expect, it } from 'vitest';
import type { ContentView, EventDraft, Scene } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { CONTINUE_CHOICE, choiceModule, manifest } from '../src';

const scene: Scene = {
  id: 'scene.test',
  location: 'loc.x',
  lines: [{ speaker: 'a', text_key: 'k' }],
  choices: [
    {
      id: 'c1',
      text_key: 'k',
      cost: { energy: 10, hours: 6 },
      requires: { gte: ['skill.negotiation', 35] },
      outcomes: [
        {
          p: 0.6,
          narration_key: 'n.ok',
          effects: [
            { delta: 'player.rep.boss', value: 5 },
            { fact: 'fact.did_it', visibility: 'private' },
            { schedule: 'event.later', delay_weeks: [1, 2] },
          ],
        },
        {
          p: 0.4,
          result: 'fail',
          narration_key: 'n.fail',
          effects: [{ delta: 'player.stress', value: 6 }],
        },
      ],
    },
    { id: 'c2', text_key: 'k', outcomes: [{ p: 1, narration_key: 'n.only' }] },
  ],
};
const talk: Scene = {
  id: 'scene.talk',
  location: 'loc.x',
  lines: [{ speaker: 'a', text_key: 'k' }],
};
const scenes = new Map([scene, talk].map((s) => [s.id, s]));
const content: ContentView = {
  get: ((kind: string, id: string) => (kind === 'scene' ? scenes.get(id) : undefined)) as never,
  all: (() => []) as never,
  text: () => undefined,
};

const state = (vars: Record<string, number>) => ({
  type: 'sim.stateChanged',
  payload: { full: true, vars: { 'skill.negotiation': 40, 'player.energy': 100, ...vars } },
});
const open = (sceneId: string) => ({
  type: 'scene.started',
  payload: { sceneId, location: 'l', lines: [], choices: [] },
});
const made = (sceneId: string, choiceId: string) => ({
  type: 'choice.made',
  payload: { sceneId, choiceId },
});
const run = (given: { type: string; payload: unknown }[], seed = 'c'): EventDraft[] =>
  runFixture(choiceModule, { seed, config: { content }, given, expect: [] });
const pay = (e: EventDraft | undefined) => e!.payload as Record<string, unknown>;

describe('choice: resolving', () => {
  it('applies cost and numeric deltas via sim-core, then reports the outcome', () => {
    const out = run([state({}), open('scene.test'), made('scene.test', 'c1')], 'seed-1');
    const kinds = out.map((e) => e.type);
    expect(kinds.at(-1)).toBe('choice.resolved');
    expect(kinds.filter((k) => k === 'sim.applyDelta').length).toBeGreaterThanOrEqual(2);
    expect(pay(out[0])).toEqual({ path: 'player.energy', value: -10, reason: 'scene.test/c1' });
    const resolved = pay(out.at(-1));
    expect(resolved).toMatchObject({
      sceneId: 'scene.test',
      choiceId: 'c1',
      cost: { energy: 10, hours: 6 },
    });
    expect(['ok', 'fail']).toContain(resolved.outcome);
  });

  it('leaves schedule and fact effects for their owners, in the resolved event', () => {
    for (let i = 0; i < 60; i++) {
      const out = run([state({}), open('scene.test'), made('scene.test', 'c1')], `s${i}`);
      const resolved = pay(out.at(-1));
      if (resolved.outcome === 'ok') {
        expect(resolved.narrationKey).toBe('n.ok');
        expect(resolved.effects).toEqual([
          { fact: 'fact.did_it', visibility: 'private' },
          { schedule: 'event.later', delay_weeks: [1, 2] },
        ]);
        expect(out.some((e) => pay(e).path === 'player.rep.boss' && pay(e).value === 5)).toBe(true);
        return;
      }
    }
    throw new Error('no ok outcome in 60 seeds');
  });

  it('rolls outcomes in proportion to their probabilities, and outcome result defaults to ok', () => {
    let ok = 0;
    const runs = 1500;
    for (let i = 0; i < runs; i++) {
      const out = run([state({}), open('scene.test'), made('scene.test', 'c1')], `p${i}`);
      const resolved = pay(out.at(-1));
      if (resolved.outcome === 'ok') ok += 1;
      else expect(resolved).toMatchObject({ outcome: 'fail', narrationKey: 'n.fail' });
    }
    expect(ok / runs).toBeGreaterThan(0.55);
    expect(ok / runs).toBeLessThan(0.65);
    const only = run([state({}), open('scene.test'), made('scene.test', 'c2')]);
    expect(only.map((e) => e.type)).toEqual(['choice.resolved']);
    expect(pay(only[0])).toEqual({
      sceneId: 'scene.test',
      choiceId: 'c2',
      outcome: 'ok',
      narrationKey: 'n.only',
    });
  });

  it('a scene with no choices accepts the continue choice', () => {
    const out = run([state({}), open('scene.talk'), made('scene.talk', CONTINUE_CHOICE)]);
    expect(out.map((e) => e.type)).toEqual(['choice.resolved']);
    expect(pay(out[0])).toMatchObject({ outcome: 'ok' });
    expect(
      run([state({}), open('scene.talk'), made('scene.talk', 'c1')]).map((e) => pay(e).reason),
    ).toEqual(['unknown_choice']);
  });
});

describe('choice: rejecting', () => {
  const reason = (given: { type: string; payload: unknown }[]) => pay(run(given).at(-1)).reason;

  it('a scene that is not open, or already answered', () => {
    expect(reason([state({}), made('scene.test', 'c2')])).toBe('not_open');
    expect(
      reason([state({}), open('scene.test'), made('scene.test', 'c2'), made('scene.test', 'c2')]),
    ).toBe('not_open');
  });

  it('an unknown choice', () => {
    expect(reason([state({}), open('scene.test'), made('scene.test', 'zzz')])).toBe(
      'unknown_choice',
    );
  });

  it('an unmet requirement, including a missing variable', () => {
    expect(
      reason([state({ 'skill.negotiation': 20 }), open('scene.test'), made('scene.test', 'c1')]),
    ).toBe('requirement');
    const noSkill = {
      type: 'sim.stateChanged',
      payload: { full: true, vars: { 'player.energy': 100 } },
    };
    expect(reason([noSkill, open('scene.test'), made('scene.test', 'c1')])).toBe('requirement');
  });

  it('a cost the player cannot afford, and the scene stays open for another choice', () => {
    const poor = [state({ 'player.energy': 5 }), open('scene.test'), made('scene.test', 'c1')];
    expect(reason(poor)).toBe('cost');
    const out = run([...poor, made('scene.test', 'c2')]);
    expect(pay(out.at(-1))).toMatchObject({ choiceId: 'c2', outcome: 'ok' });
  });

  it('a rejection changes nothing and applies no deltas', () => {
    const out = run([
      state({ 'skill.negotiation': 1 }),
      open('scene.test'),
      made('scene.test', 'c1'),
    ]);
    expect(out.map((e) => e.type)).toEqual(['choice.rejected']);
  });
});

describe('choice: expiry and contract', () => {
  it('an expired scene resolves as ignored, once', () => {
    const out = run([
      open('scene.test'),
      { type: 'scene.expired', payload: { sceneId: 'scene.test' } },
    ]);
    expect(out.map((e) => e.type)).toEqual(['choice.resolved']);
    expect(pay(out[0])).toEqual({ sceneId: 'scene.test', choiceId: '', outcome: 'ignored' });
    const twice = run([
      open('scene.test'),
      { type: 'scene.expired', payload: { sceneId: 'scene.test' } },
      { type: 'scene.expired', payload: { sceneId: 'scene.test' } },
    ]);
    expect(twice).toHaveLength(1);
  });

  it('declares what it uses', () => {
    expect(manifest.emits).toEqual(['sim.applyDelta', 'choice.resolved', 'choice.rejected']);
    expect(() => choiceModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
