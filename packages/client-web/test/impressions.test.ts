// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import type { Envelope } from '@je/contracts';
import {
  impressionLine,
  initialState,
  mount,
  reduce,
  sureWord,
  traitWord,
  type Transport,
} from '../src';

let n = 0;
const env = (type: string, payload: unknown): Envelope => ({
  id: `e${++n}`,
  type,
  v: 1,
  runId: 'r',
  turn: 0,
  source: 'test',
  payload,
});

const guestScene = env('scene.started', {
  sceneId: 'scene.g',
  location: 'loc.room',
  lines: [{ speaker: 'Nguyen Van Hung', text: 'A favour?' }],
  choices: [{ id: 'c1', label: 'Yes' }],
  people: [{ character: 'person.x#1', name: 'Nguyen Van Hung', title: 'QC', guest: true }],
});
const seen = (axis: string, estimate: number, confidence: number) =>
  env('perception.updated', {
    person_id: 'person.x#1',
    axis,
    estimate,
    confidence,
    observations: 1,
  });

afterEach(() => document.body.replaceChildren());

describe('impressions in the client', () => {
  it('turns estimates into words and confidence into how sure the player is', () => {
    expect(traitWord('integrity', 20, 'en')).toBe('bends the rules');
    expect(traitWord('integrity', 50, 'en')).toBe('mostly by the book');
    expect(traitWord('integrity', 90, 'vi')).toBe('rất nguyên tắc');
    expect(sureWord(10, 'en')).toBe('a guess');
    expect(sureWord(50, 'en')).toBe('an impression');
    expect(sureWord(80, 'vi')).toBe('khá chắc');
  });

  it('keeps the latest reading per trait and the quirks noticed, in both languages', () => {
    let state = reduce(initialState, guestScene);
    state = reduce(state, seen('warmth', 80, 29));
    state = reduce(state, seen('warmth', 70, 42));
    state = reduce(state, seen('caution', 20, 29));
    state = reduce(
      state,
      env('perception.quirkNoticed', {
        person_id: 'person.x#1',
        quirk: 'q',
        name: { en: 'taps the desk', vi: 'gõ ngón tay lên bàn' },
      }),
    );
    expect(state.cast).toEqual([
      { character: 'person.x#1', name: 'Nguyen Van Hung', title: 'QC', guest: true },
    ]);
    const imp = state.impressions['person.x#1']!;
    expect(imp.axes.warmth).toEqual({ estimate: 70, confidence: 42 });
    expect(Object.keys(imp.axes).sort()).toEqual(['caution', 'warmth']);
    expect(impressionLine(imp, 'en')).toBe(
      'What you make of them: warm (an impression), takes risks (a guess). You have noticed: taps the desk.',
    );
    expect(impressionLine(imp, 'vi')).toContain('gõ ngón tay lên bàn');
  });

  it('says so when the player has seen nothing yet', () => {
    expect(impressionLine(undefined, 'en')).toBe('You do not know them well yet.');
  });

  it('shows a guest in the cast panel with how they feel, what they did, and what the player has worked out', () => {
    const listeners = new Set<(e: Envelope) => void>();
    const transport: Transport = {
      subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)),
      send: () => undefined,
    };
    const root = document.createElement('div');
    document.body.append(root);
    mount(root, transport);
    const feel = env('relationship.changed', {
      character: 'person.x#1',
      dimension: 'trust',
      from: 0,
      to: 30,
    });
    const quiet = env('person.acted', {
      person_id: 'person.x#1',
      name: 'N',
      action: 'reported',
      sceneId: 's',
      visible: false,
    });
    const loud = env('person.acted', {
      person_id: 'person.x#1',
      name: 'N',
      action: 'vouches',
      sceneId: 's',
      visible: true,
    });
    for (const e of [guestScene, seen('integrity', 15, 60), feel, quiet, loud])
      listeners.forEach((l) => l(e));
    const item = root.querySelector<HTMLElement>('.je-person[data-guest="true"]')!;
    // closed: name, role, how they feel, and the one trait the player is surest of
    expect(item.textContent).toBe('Nguyen Van HungQCfriendlybends the rules !');
    item.click();
    const open = root.querySelector<HTMLElement>('.je-person[data-guest="true"]')!;
    expect(open.textContent).toContain(
      'trusts you. has spoken well of you. What you make of them: bends the rules (fairly sure).',
    );
    expect(open.textContent).not.toContain('reported');
  });
});
