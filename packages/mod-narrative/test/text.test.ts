import { describe, expect, it } from 'vitest';
import { registerOf } from '@je/contracts';
import type {
  ContentView,
  EventDraft,
  Locale,
  Person,
  Scene,
  TemperamentAxis,
} from '@je/contracts';
import { runFixture } from '@je/kernel';
import { addressOf, narrativeModule, type Viewer } from '../src';
import { capitalise, startsSentence } from '../src/address';

const person = (age: number, gender: Person['origin']['gender'], voice: string[] = []): Person =>
  ({
    id: 'person.t#1',
    origin: {
      name: { family: 'Nguyen', middle: 'Van', given: 'Hung' },
      age_at_creation: age,
      gender,
      voice,
      quirks: [],
      temperament: {} as Record<TemperamentAxis, number>,
    },
    life: { department: 'qc' },
  }) as unknown as Person;

describe('forms of address (Vietnamese)', () => {
  const me = (age: number, gender: Viewer['gender']): Viewer => ({ age, gender });
  it('peers within two years use bạn and mình; the name alone calls them', () => {
    expect(addressOf(person(31, 'male'), me(30, 'female'), 'vi')).toEqual({
      call: 'Hung',
      self: 'mình',
      you: 'bạn',
    });
  });
  it('an older man is anh and calls the player em; an older woman is chị', () => {
    expect(addressOf(person(38, 'male'), me(30, 'female'), 'vi')).toEqual({
      call: 'anh Hung',
      self: 'anh',
      you: 'em',
    });
    expect(addressOf(person(38, 'female'), me(30, 'male'), 'vi').call).toBe('chị Hung');
  });
  it('a younger colleague is em and calls the player anh or chị by the player gender', () => {
    expect(addressOf(person(24, 'female'), me(30, 'male'), 'vi')).toEqual({
      call: 'em Hung',
      self: 'em',
      you: 'anh',
    });
    expect(addressOf(person(24, 'male'), me(30, 'female'), 'vi').you).toBe('chị');
    expect(addressOf(person(24, 'male'), me(30, 'non_binary'), 'vi').you).toBe('bạn');
  });
  it('someone much older is chú or cô and calls the player cháu', () => {
    expect(addressOf(person(52, 'male'), me(30, 'male'), 'vi')).toEqual({
      call: 'chú Hung',
      self: 'chú',
      you: 'cháu',
    });
    expect(addressOf(person(52, 'female'), me(30, 'male'), 'vi').call).toBe('cô Hung');
  });
  it('a non-binary person, or no known viewer, gets the neutral forms; English never changes', () => {
    expect(addressOf(person(40, 'non_binary'), me(30, 'male'), 'vi').you).toBe('bạn');
    expect(addressOf(person(40, 'male'), undefined, 'vi').self).toBe('mình');
    expect(addressOf(person(40, 'male'), me(30, 'male'), 'en')).toEqual({
      call: 'Hung',
      self: 'I',
      you: 'you',
    });
  });
  it('knows when a word starts a sentence', () => {
    expect(startsSentence('')).toBe(true);
    expect(startsSentence('He said. ')).toBe(true);
    expect(startsSentence('He said "')).toBe(true);
    expect(startsSentence('Ask ')).toBe(false);
    expect(capitalise('anh Hung')).toBe('Anh Hung');
  });
});

describe('voice registers', () => {
  it('picks the register most of the voice tags belong to, or none', () => {
    expect(registerOf(['blunt', 'curt', 'warm'])).toBe('blunt');
    expect(registerOf(['gentle', 'cheerful'])).toBe('warm');
    expect(registerOf(['unheard_of'])).toBeUndefined();
    expect(registerOf([])).toBeUndefined();
  });
});

/* ---- variants, in a scene with one guest ---- */

const scene: Scene = {
  id: 'scene.v',
  location: 'loc.room',
  guests: [{ slot: 'x', story_function: 'tempter' }],
  lines: [
    { speaker: 'guest:x', text_key: 'v.l1' },
    { speaker: 'role:boss', text_key: 'v.l2' },
  ],
  choices: [{ id: 'c1', text_key: 'v.c1', outcomes: [{ p: 1, narration_key: 'v.n1' }] }],
};
const base: Record<string, string> = {
  'v.l1': 'Plain one.',
  'v.l1~2': 'Plain two.',
  'v.l1@blunt': 'Blunt one.',
  'v.l1@blunt~2': 'Blunt two.',
  'v.l2': '{x.you} and {x.call}. {x.self} again.',
  'v.c1': 'Go',
  'v.n1': 'Done',
  'speaker.boss': 'Boss',
  'ui.continue': 'Continue',
  'ui.guest.someone': 'Someone',
};
const strings: Record<Locale, Record<string, string>> = {
  en: base,
  vi: { ...base, 'v.l2': '{x.you} và {x.call}. {x.self} nữa.' },
};
const contentFor = (locale: Locale, sc: Scene = scene): ContentView => ({
  get: ((kind: string, id: string) => (kind === 'scene' && id === sc.id ? sc : undefined)) as never,
  all: (() => []) as never,
  text: (l, key) => strings[l === locale ? l : locale][key],
});
const plan = { type: 'turn.phaseStarted', payload: { phase: 'plan' } };
const play = (
  voice: string[],
  seed: string,
  locale: Locale = 'en',
  viewer?: Viewer,
  age = 40,
): { text: string; draws: EventDraft[] } => {
  const out = runFixture(narrativeModule, {
    seed,
    turn: 1,
    config: {
      content: contentFor(locale),
      locale,
      script: { '1': ['scene.v'] },
      guests: { appear: () => person(age, 'male', voice), character: () => person(age, 'male') },
      ...(viewer ? { viewer } : {}),
    },
    given: [plan],
    expect: [],
  });
  const started = out.find((e) => e.type === 'scene.started')!.payload as {
    lines: { text: string }[];
  };
  return { text: started.lines.map((l) => l.text).join(' | '), draws: out };
};

describe('text variants', () => {
  it('uses a variant written for the speaker voice most of the time, and others otherwise', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) seen.add(play(['blunt'], `s${i}`).text.split(' | ')[0]!);
    expect([...seen].some((t) => t.startsWith('Blunt'))).toBe(true);
    expect([...seen].some((t) => t.startsWith('Plain'))).toBe(true);
    let blunt = 0;
    for (let i = 0; i < 100; i++) if (play(['blunt'], `t${i}`).text.startsWith('Blunt')) blunt++;
    expect(blunt).toBeGreaterThan(55);
    expect(blunt).toBeLessThan(85);
  });

  it('a voice with no variants only ever gets the plain ones', () => {
    for (let i = 0; i < 40; i++)
      expect(play(['warm'], `w${i}`).text.split(' | ')[0]).toMatch(/^Plain/);
  });

  it('is deterministic for a seed, and a text without variants draws nothing', () => {
    expect(play(['blunt'], 'a')).toEqual(play(['blunt'], 'a'));
    const second = play([], 'a').text.split(' | ')[1];
    expect(second).toBe('You and Hung. I again.');
  });

  it('the same seed gives the same choice of variant in both languages', () => {
    const pickOf = (t: string): string => (t.startsWith('Blunt') ? 'blunt' : 'plain');
    for (let i = 0; i < 20; i++) {
      expect(pickOf(play(['blunt'], `l${i}`, 'en').text)).toBe(
        pickOf(play(['blunt'], `l${i}`, 'vi').text),
      );
    }
  });

  it('fills forms of address into the text, capitalising at the start of a sentence', () => {
    const vi = play([], 'p', 'vi', { age: 30, gender: 'female' }, 40).text.split(' | ')[1];
    expect(vi).toBe('Em và anh Hung. Anh nữa.');
    const en = play([], 'p', 'en', { age: 30, gender: 'female' }).text.split(' | ')[1];
    expect(en).toBe('You and Hung. I again.');
  });
});
