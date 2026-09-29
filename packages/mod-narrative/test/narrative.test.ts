import { describe, expect, it } from 'vitest';
import type { ContentView, EventDraft, GameEvent, Locale, Scene } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { manifest, narrativeModule, type NarrativeConfig } from '../src';

const A: Scene = {
  id: 'scene.a',
  location: 'loc.room',
  lines: [
    { speaker: 'role:boss', text_key: 'a.l1' },
    { speaker: 'role:stranger', text_key: 'a.l2' },
  ],
  choices: [
    { id: 'c1', text_key: 'a.c1', outcomes: [{ p: 1, narration_key: 'x' }] },
    {
      id: 'c2',
      text_key: 'a.c2',
      requires: { gte: ['skill.analysis', 30] },
      outcomes: [{ p: 1, narration_key: 'x' }],
    },
  ],
};
const B: Scene = {
  id: 'scene.b',
  location: 'loc.hall',
  lines: [{ speaker: 'role:boss', text_key: 'b.l1' }],
};
const event: GameEvent = { id: 'event.pick_b', scene: 'scene.b' };
const scenes = new Map([A, B].map((s) => [s.id, s]));
const strings: Record<Locale, Record<string, string>> = {
  en: {
    'a.l1': 'Hello',
    'a.l2': 'Who are you',
    'a.c1': 'Yes',
    'a.c2': 'Analyse',
    'b.l1': 'Bye',
    'speaker.boss': 'Boss',
    'ui.continue': 'Continue',
    'n.done': 'It is done.',
  },
  vi: { 'a.l1': 'Xin chào', 'speaker.boss': 'Sếp', 'ui.continue': 'Tiếp tục' },
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'scene'
      ? scenes.get(id)
      : kind === 'event' && id === event.id
        ? event
        : undefined) as never,
  all: (() => []) as never,
  text: (locale, key) => strings[locale][key],
};

const tick = (turn: number) => ({
  type: 'clock.ticked',
  payload: { turn, year: 0, week_of_year: turn, month_of_year: 1, quarter: 1 },
});
const plan = { type: 'turn.phaseStarted', payload: { phase: 'plan' } };
const skill = (analysis: number) => ({
  type: 'sim.stateChanged',
  payload: { full: true, vars: { 'skill.analysis': analysis } },
});
const resolved = (sceneId: string, narrationKey?: string) => ({
  type: 'choice.resolved',
  payload: { sceneId, choiceId: 'c1', outcome: 'ok', ...(narrationKey ? { narrationKey } : {}) },
});

function play(
  given: { type: string; payload: unknown }[],
  cfg: Partial<NarrativeConfig> = {},
  turn = 0,
): EventDraft[] {
  return runFixture(narrativeModule, {
    turn,
    config: { content, script: { '0': ['scene.a', 'scene.b'] }, ...cfg },
    given,
    expect: [],
  });
}
const started = (out: EventDraft[]) =>
  out
    .filter((e) => e.type === 'scene.started')
    .map(
      (e) =>
        e.payload as {
          sceneId: string;
          lines: { speaker: string; text: string }[];
          choices: { id: string; label: string; disabled?: boolean }[];
        },
    );

describe('narrative: starting scenes', () => {
  it('starts the first scripted scene at the plan phase, with resolved text and speaker names', () => {
    const [scene] = started(play([skill(40), plan]));
    expect(scene!.sceneId).toBe('scene.a');
    expect(scene!.lines).toEqual([
      { speaker: 'Boss', text: 'Hello' },
      { speaker: 'stranger', text: 'Who are you' },
    ]);
    expect(scene!.choices).toEqual([
      { id: 'c1', label: 'Yes', disabled: false },
      { id: 'c2', label: 'Analyse', disabled: false },
    ]);
  });

  it('does nothing outside the plan phase or on an unscripted turn', () => {
    expect(play([{ type: 'turn.phaseStarted', payload: { phase: 'resolve' } }])).toEqual([]);
    expect(play([plan], {}, 3)).toEqual([]);
  });

  it('disables a choice whose requirement is not met (or cannot be evaluated)', () => {
    expect(started(play([skill(10), plan]))[0]!.choices.map((c) => c.disabled)).toEqual([
      false,
      true,
    ]);
    expect(started(play([plan]))[0]!.choices.map((c) => c.disabled)).toEqual([false, true]);
  });

  it('offers a continue choice for a scene without choices', () => {
    const out = play([plan, resolved('scene.a')]);
    const b = started(out)[1]!;
    expect(b.sceneId).toBe('scene.b');
    expect(b.choices).toEqual([{ id: '__continue', label: 'Continue' }]);
  });

  it('resolves text in the configured locale and shows the key when a string is missing', () => {
    const [scene] = started(play([plan], { locale: 'vi' }));
    expect(scene!.lines[0]).toEqual({ speaker: 'Sếp', text: 'Xin chào' });
    expect(scene!.lines[1]!.text).toBe('[a.l2]');
    expect(scene!.choices[0]!.label).toBe('[a.c1]');
  });

  it('fails loudly on a scripted scene that does not exist', () => {
    expect(() => play([plan], { script: { '0': ['scene.ghost'] } })).toThrow(/unknown scene/);
  });
});

describe('narrative: one scene at a time', () => {
  it('queues the second scene until the first resolves, then ends and starts in order', () => {
    const out = play([plan, resolved('scene.a', 'n.done')]);
    expect(out.map((e) => e.type)).toEqual(['scene.started', 'scene.ended', 'scene.started']);
    expect(out[1]!.payload).toEqual({ sceneId: 'scene.a', narration: 'It is done.' });
    expect(started(out).map((s) => s.sceneId)).toEqual(['scene.a', 'scene.b']);
  });

  it('ignores resolutions for scenes it is not showing', () => {
    expect(play([plan, resolved('scene.zzz')]).map((e) => e.type)).toEqual(['scene.started']);
  });

  it('ends a scene without narration when none is given', () => {
    const ended = play([plan, resolved('scene.a')]).find((e) => e.type === 'scene.ended');
    expect(ended!.payload).toEqual({ sceneId: 'scene.a' });
  });
});

describe('narrative: patience and events', () => {
  it('expires an unanswered scene after the patience window, not before', () => {
    const shown = [skill(40), plan];
    expect(play([...shown, tick(0)], {}, 0).map((e) => e.type)).toEqual(['scene.started']);
    const late = play([...shown, tick(1)], {}, 0);
    expect(late.map((e) => e.type)).toEqual(['scene.started', 'scene.expired']);
    expect(late[1]!.payload).toEqual({ sceneId: 'scene.a' });
    expect(play([...shown, tick(2)], { patienceTurns: 3 }).map((e) => e.type)).toEqual([
      'scene.started',
    ]);
  });

  it('starts the scene named by a director event, and ignores unknown events', () => {
    const fired = (eventId: string) => ({
      type: 'director.eventFired',
      payload: { eventId, tags: [] },
    });
    expect(started(play([fired('event.pick_b')], { script: {} })).map((s) => s.sceneId)).toEqual([
      'scene.b',
    ]);
    expect(play([fired('event.stub_1')], { script: {} })).toEqual([]);
  });
});

describe('narrative: contract', () => {
  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toEqual(['scene.started', 'scene.ended', 'scene.expired']);
    expect(() => narrativeModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
