import { describe, expect, it } from 'vitest';
import type { ContentView, Person, Scene } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { narrativeModule } from '../src';

const scene: Scene = {
  id: 'scene.c',
  location: 'loc.qc_lab',
  guests: [{ slot: 'x', story_function: 'mentor' }],
  lines: [{ speaker: 'guest:x', text_key: 'c.l1' }],
  choices: [
    {
      id: 'c1',
      text_key: 'c.c1',
      cost: { hours: 3, energy: 10 },
      outcomes: [{ p: 1, narration_key: 'n' }],
    },
    {
      id: 'c2',
      text_key: 'c.c2',
      requires: { gte: ['skill.analysis', 30] },
      outcomes: [{ p: 1, narration_key: 'n' }],
    },
    { id: 'c3', text_key: 'c.c3', cost: { energy: 50 }, outcomes: [{ p: 1, narration_key: 'n' }] },
  ],
};
const strings: Record<string, string> = {
  'c.l1': 'Hello',
  'c.c1': 'Properly',
  'c.c2': 'Analyse',
  'c.c3': 'Push',
  'ui.continue': 'Continue',
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'scene' && id === scene.id ? scene : undefined) as never,
  all: (() => []) as never,
  text: (_l, key) => strings[key],
};
const person = {
  id: 'person.t#1',
  origin: { name: { family: 'N', middle: '', given: 'Hung' }, quirks: [], voice: [] },
  life: { department: 'qc' },
  appearance: {
    build: 'sturdy',
    height: 'tall',
    skin_tone: 4,
    face: 'oval',
    hair_style: 'bun',
    hair_colour: 'grey',
    facial_hair: 'none',
    glasses: true,
    mark: 'none',
    seed: 1,
  },
} as unknown as Person;

const play = (vars: Record<string, number>) =>
  runFixture(narrativeModule, {
    turn: 1,
    config: {
      content,
      script: { '1': ['scene.c'] },
      guests: { appear: () => person, character: () => person },
    },
    given: [
      { type: 'sim.stateChanged', payload: { full: true, vars } },
      { type: 'turn.phaseStarted', payload: { phase: 'plan' } },
    ],
    expect: [],
  }).find((e) => e.type === 'scene.started')!.payload as {
    choices: { id: string; disabled?: boolean; cost?: object; blocked?: object }[];
    people: { look?: object }[];
  };

describe('narrative: what the screen needs to show a choice', () => {
  it('tells the cost of each choice, only when there is one', () => {
    const { choices } = play({ 'skill.analysis': 50, 'player.energy': 80 });
    expect(choices[0]!.cost).toEqual({ hours: 3, energy: 10 });
    expect(choices[1]!.cost).toBeUndefined();
    expect(choices[2]!.cost).toEqual({ energy: 50 });
    expect(choices.every((c) => !c.disabled && !c.blocked)).toBe(true);
  });

  it('says which requirement is missing, with how much is needed', () => {
    const { choices } = play({ 'skill.analysis': 10, 'player.energy': 80 });
    expect(choices[1]).toMatchObject({
      disabled: true,
      blocked: { kind: 'requirement', path: 'skill.analysis', need: 30 },
    });
  });

  it('blocks a choice the player has no energy for, and says how much it needs', () => {
    const { choices } = play({ 'skill.analysis': 50, 'player.energy': 20 });
    expect(choices[0]!.disabled).toBeFalsy();
    expect(choices[2]).toMatchObject({ disabled: true, blocked: { kind: 'energy', need: 50 } });
  });

  it('sends how to draw each guest, appearance traits only', () => {
    const { people } = play({ 'player.energy': 80 });
    expect(people[0]!.look).toEqual({
      skin_tone: 4,
      hair_style: 'bun',
      hair_colour: 'grey',
      facial_hair: 'none',
      glasses: true,
      build: 'sturdy',
    });
  });
});
