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
const T: Scene = {
  id: 'scene.t',
  location: 'loc.room',
  terms: ['term.po', 'term.ghost'],
  lines: [{ speaker: 'role:boss', text_key: 'b.l1' }],
};
const B: Scene = {
  id: 'scene.b',
  location: 'loc.hall',
  lines: [{ speaker: 'role:boss', text_key: 'b.l1' }],
};
const event: GameEvent = { id: 'event.pick_b', scene: 'scene.b' };
const kickback = {
  id: 'fact.fee',
  category: 'integrity',
  severity: 8,
  text_key: 'fact.fee',
} as const;
const scenes = new Map([A, B, T].map((s) => [s.id, s]));
const po = { id: 'term.po', term_key: 'po.t', definition_key: 'po.d' };
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
    'fact.fee': 'the fee you took',
    'po.t': 'PO',
    'po.d': 'Purchase order: the formal request to buy.',
    'detector.finance': 'Finance',
    'ui.notice.audit': 'Internal audit is in the building this week.',
    'ui.notice.detected': '{detector} found out about {fact}.',
    'ui.notice.scapegoat': 'Your boss points at you over {fact}.',
    'ui.notice.rumor': 'People are talking about {fact}.',
    'ui.notice.public': 'Everyone knows now: {fact}.',
  },
  vi: { 'a.l1': 'Xin chào', 'speaker.boss': 'Sếp', 'ui.continue': 'Tiếp tục' },
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'scene'
      ? scenes.get(id)
      : kind === 'event' && id === event.id
        ? event
        : kind === 'fact' && id === kickback.id
          ? kickback
          : kind === 'term' && id === po.id
            ? po
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

describe('narrative: notices when word gets around', () => {
  const escalated = (to: string) => ({
    type: 'fact.escalated',
    payload: { factId: 'fact.fee', from: 'witnessed', to, knownBy: ['player'] },
  });
  const notice = (out: EventDraft[]) =>
    out.find((e) => e.type === 'scene.started')!.payload as {
      sceneId: string;
      lines: { speaker: string; text: string }[];
      choices: { id: string; label: string }[];
    };

  it('plays a one-line notice when a fact becomes a rumor or public', () => {
    const rumor = notice(play([escalated('rumor')], { script: {} }));
    expect(rumor.sceneId).toBe('notice.fact.fee.rumor');
    expect(rumor.lines).toEqual([
      { speaker: '', text: 'People are talking about the fee you took.' },
    ]);
    expect(rumor.choices).toEqual([{ id: '__continue', label: 'Continue' }]);
    expect(notice(play([escalated('public')], { script: {} })).lines[0]!.text).toBe(
      'Everyone knows now: the fee you took.',
    );
  });

  it('a fact learned in public gets a notice; a private or witnessed one does not', () => {
    const learned = (visibility: string) => ({
      type: 'fact.learned',
      payload: { factId: 'fact.fee', visibility, knownBy: ['player'] },
    });
    expect(play([learned('public')], { script: {} }).map((e) => e.type)).toEqual(['scene.started']);
    expect(play([learned('private')], { script: {} })).toEqual([]);
    expect(play([learned('witnessed')], { script: {} })).toEqual([]);
    expect(play([escalated('witnessed')], { script: {} })).toEqual([]);
  });

  it('a notice queues behind scenes already waiting, then ends like any scene', () => {
    // Queue at plan time: scene.a (on screen), scene.b (waiting). The notice joins behind them.
    const beforeNotice = play([plan, escalated('rumor'), resolved('scene.a')]);
    expect(started(beforeNotice).map((s) => s.sceneId)).toEqual(['scene.a', 'scene.b']);
    const all = play([plan, escalated('rumor'), resolved('scene.a'), resolved('scene.b')]);
    expect(started(all).map((s) => s.sceneId)).toEqual([
      'scene.a',
      'scene.b',
      'notice.fact.fee.rumor',
    ]);
    const closed = play([
      plan,
      escalated('rumor'),
      resolved('scene.a'),
      resolved('scene.b'),
      resolved('notice.fact.fee.rumor'),
    ]);
    const ended = closed
      .filter((e) => e.type === 'scene.ended')
      .map((e) => (e.payload as { sceneId: string }).sceneId);
    expect(ended).toEqual(['scene.a', 'scene.b', 'notice.fact.fee.rumor']);
  });

  it('ignores a fact that content does not define', () => {
    const ghost = {
      type: 'fact.escalated',
      payload: { factId: 'fact.ghost', from: 'private', to: 'public', knownBy: [] },
    };
    expect(play([ghost], { script: {} })).toEqual([]);
  });
});

describe('narrative: glossary terms and risk notices', () => {
  const shown = (out: EventDraft[]) =>
    out
      .filter((e) => e.type === 'scene.started')
      .map(
        (e) =>
          e.payload as never as {
            sceneId: string;
            lines: { text: string }[];
            terms?: { id: string; term: string; definition: string }[];
          },
      );

  it('sends the glossary terms of a scene with their definitions, skipping unknown ones', () => {
    const [scene] = shown(play([plan], { script: { '0': ['scene.t'] } }));
    expect(scene!.terms).toEqual([
      { id: 'term.po', term: 'PO', definition: 'Purchase order: the formal request to buy.' },
    ]);
  });

  it('a scene without terms carries none', () => {
    expect(shown(play([plan]))[0]!.terms).toBeUndefined();
  });

  it('plays a notice when an audit starts, something is detected, or the boss blames the player', () => {
    const line = (event: { type: string; payload: unknown }) =>
      shown(play([event], { script: {} }))[0]!.lines[0]!.text;
    expect(line({ type: 'risk.auditStarted', payload: { turn: 12 } })).toBe(
      'Internal audit is in the building this week.',
    );
    expect(
      line({
        type: 'risk.detected',
        payload: { factId: 'fact.fee', detector: 'finance', trace: 'payment', audit: false },
      }),
    ).toBe('Finance found out about the fee you took.');
    expect(line({ type: 'risk.scapegoated', payload: { factId: 'fact.fee' } })).toBe(
      'Your boss points at you over the fee you took.',
    );
  });

  it('two audits in a year are two separate notices, and unknown facts are ignored', () => {
    const out = play(
      [
        { type: 'risk.auditStarted', payload: { turn: 12 } },
        { type: 'risk.auditStarted', payload: { turn: 25 } },
      ],
      { script: {} },
    );
    expect(shown(out)).toHaveLength(1); // the second waits behind the first
    const both = play(
      [
        { type: 'risk.auditStarted', payload: { turn: 12 } },
        { type: 'risk.auditStarted', payload: { turn: 25 } },
        {
          type: 'choice.resolved',
          payload: { sceneId: 'notice.risk.audit.1', choiceId: '__continue', outcome: 'ok' },
        },
      ],
      { script: {} },
    );
    expect(shown(both).map((s) => s.sceneId)).toEqual([
      'notice.risk.audit.1',
      'notice.risk.audit.2',
    ]);
    expect(
      play(
        [
          {
            type: 'risk.detected',
            payload: { factId: 'fact.nope', detector: 'qc', trace: 'x', audit: false },
          },
        ],
        {
          script: {},
        },
      ),
    ).toEqual([]);
  });
});

describe('narrative: contract', () => {
  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toEqual(['scene.started', 'scene.ended', 'scene.expired']);
    expect(() => narrativeModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
