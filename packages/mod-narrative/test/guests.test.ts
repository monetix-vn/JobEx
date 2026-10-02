import { describe, expect, it } from 'vitest';
import type { ContentView, GuestRequest, Person, Scene } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { narrativeModule } from '../src';

const scene: Scene = {
  id: 'scene.g',
  location: 'loc.room',
  guests: [{ slot: 'colleague', story_function: 'tempter', department: 'dept.production' }],
  lines: [
    { speaker: 'guest:colleague', text_key: 'g.l1' },
    { speaker: 'role:boss', text_key: 'g.l2' },
  ],
  choices: [{ id: 'c1', text_key: 'g.c1', outcomes: [{ p: 1, narration_key: 'g.n1' }] }],
};
const strings: Record<string, string> = {
  'g.l1': 'A favour, please. Just between us.',
  'g.l2': '{colleague.full} is waiting for your answer.',
  'g.c1': 'Help {colleague}',
  'g.n1': '{colleague} thanks you.',
  'speaker.boss': 'Boss',
  'ui.guest.someone': 'Someone from the team',
  'ui.continue': 'Continue',
  'ui.notice.acted.vouches': '{name} put in a good word for you.',
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'scene' && id === scene.id
      ? scene
      : kind === 'event' && id === 'event.g'
        ? { id: 'event.g', scene: scene.id }
        : undefined) as never,
  all: (() => []) as never,
  text: (_locale, key) => strings[key],
};
const person = {
  id: 'person.test#1',
  origin: { name: { family: 'Nguyen', middle: 'Van', given: 'Hung' }, quirks: [] },
  life: { department: 'production' },
} as unknown as Person;

const plan = { type: 'turn.phaseStarted', payload: { phase: 'plan' } };
const resolved = {
  type: 'choice.resolved',
  payload: { sceneId: 'scene.g', choiceId: 'c1', outcome: 'ok', narrationKey: 'g.n1' },
};
const play = (
  guests?: { appear(r: GuestRequest): Person },
  given: { type: string; payload: unknown }[] = [plan],
) =>
  runFixture(narrativeModule, {
    turn: 3,
    config: { content, script: { '3': ['scene.g'] }, ...(guests ? { guests } : {}) },
    given,
    expect: [],
  });

describe('narrative: guests from the world', () => {
  it('asks the port for the guest, announces them, and fills their name into the text', () => {
    const asked: GuestRequest[] = [];
    const out = play({
      appear: (r) => {
        asked.push(r);
        return person;
      },
    });
    expect(asked).toEqual([
      {
        sceneId: 'scene.g',
        slot: 'colleague',
        story_function: 'tempter',
        department: 'dept.production',
        turn: 3,
      },
    ]);
    expect(out.map((e) => e.type)).toEqual(['guest.appeared', 'scene.started']);
    expect((out[0]!.payload as { person: Person }).person).toBe(person);
    const p = out[1]!.payload as {
      lines: { speaker: string; text: string }[];
      choices: { label: string }[];
      people: { character: string; name: string; guest?: boolean }[];
    };
    expect(p.lines[0]!.speaker).toBe('Nguyen Van Hung');
    expect(p.lines[1]!.text).toBe('Nguyen Van Hung is waiting for your answer.');
    expect(p.choices[0]!.label).toBe('Help Hung');
    expect(p.people).toEqual([
      { character: 'person.test#1', name: 'Nguyen Van Hung', title: 'production', guest: true },
    ]);
  });

  it('uses the guest name in the narration once the choice resolves', () => {
    const out = play({ appear: () => person }, [plan, resolved]);
    const ended = out.find((e) => e.type === 'scene.ended')!.payload as { narration: string };
    expect(ended.narration).toBe('Hung thanks you.');
  });

  it('without a port a guest is "someone from the team" and nothing is announced', () => {
    const out = play();
    expect(out.map((e) => e.type)).toEqual(['scene.started']);
    const p = out[0]!.payload as { lines: { speaker: string }[]; choices: { label: string }[] };
    expect(p.choices[0]!.label).toBe('Help Someone from the team');
    expect(p.lines[0]!.speaker).toBe('Someone from the team');
  });
});

describe('narrative: a scene someone asked for', () => {
  it('gives the person who wanted it the first guest slot', () => {
    const asked: GuestRequest[] = [];
    const out = play(
      {
        appear: (r) => {
          asked.push(r);
          return person;
        },
      },
      [
        {
          type: 'director.eventFired',
          payload: { eventId: 'event.g', tags: [], person_id: 'person.test#1' },
        },
      ],
    );
    expect(asked[0]!.preferred).toBe('person.test#1');
    expect(out.map((e) => e.type)).toEqual(['guest.appeared', 'scene.started']);
    expect((out[1]!.payload as { sceneId: string }).sceneId).toBe('scene.g');
  });
});

describe('narrative: what guests visibly do', () => {
  const acted = (visible: boolean) => ({
    type: 'person.acted',
    payload: { person_id: 'p', name: 'Hung', action: 'vouches', sceneId: 's', visible },
  });
  it('shows a notice for something the player could see, and nothing for what happens out of sight', () => {
    const seen = play(undefined, [acted(true)]);
    const p = seen[0]!.payload as { lines: { text: string }[] };
    expect(p.lines[0]!.text).toBe('Hung put in a good word for you.');
    expect(play(undefined, [acted(false)])).toEqual([]);
  });
});
