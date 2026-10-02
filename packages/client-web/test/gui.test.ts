// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import type { Envelope } from '@je/contracts';
import { initialState, mount, reduce, type ClientState, type Transport } from '../src';

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

const fakeTransport = () => {
  const listeners = new Set<(e: Envelope) => void>();
  const sent: { type: string; payload: unknown }[] = [];
  const transport: Transport = {
    subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    send: (type, payload) => void sent.push({ type, payload }),
  };
  return { transport, sent, push: (e: Envelope) => listeners.forEach((l) => l(e)) };
};

const vars = (v: Record<string, number | string>) =>
  env('sim.stateChanged', { full: true, vars: v });
const change = (v: Record<string, number | string>) =>
  env('sim.stateChanged', { full: false, vars: v });
const scene = (id: string, extra: object = {}) =>
  env('scene.started', {
    sceneId: id,
    location: 'loc.qc_lab',
    lines: [{ speaker: 'Boss', text: 'Can you tidy the log?' }],
    choices: [{ id: 'c1', label: 'Show the gaps' }],
    ...extra,
  });
const resolved = (id: string, cost?: object) =>
  env('choice.resolved', { sceneId: id, choiceId: 'c1', outcome: 'ok', ...(cost ? { cost } : {}) });
const run = (events: Envelope[]): ClientState => events.reduce(reduce, initialState);

afterEach(() => document.body.replaceChildren());

describe('what a choice changed', () => {
  const start = [
    vars({ 'player.stress': 30, 'player.cash_vnd': 0, 'player.rep.boss': 50 }),
    scene('s1'),
  ];

  it('collects the numbers that move after a choice, with the hours it cost', () => {
    const s = run([
      ...start,
      resolved('s1', { hours: 3, energy: 10 }),
      change({ 'player.stress': 33 }),
      change({ 'player.rep.boss': 47, 'player.cash_vnd': -200000 }),
      env('scene.ended', { sceneId: 's1', narration: 'It went fine.' }),
    ]);
    expect(s.scene?.changes).toEqual([
      { path: 'hours', delta: 3 },
      { path: 'player.stress', delta: 3 },
      { path: 'player.rep.boss', delta: -3 },
      { path: 'player.cash_vnd', delta: -200000 },
    ]);
  });

  it('ignores numbers that are not shown, and numbers that move when no choice was made', () => {
    const s = run([...start, change({ 'player.stress': 31, 'fact.x': 1 })]);
    expect(s.changes).toEqual([]);
    expect(s.flash).toEqual(['player.stress']);
    const t = run([...start, resolved('s1'), change({ 'fact.x': 2, 'world.turn': 5 })]);
    expect(t.scene?.changes ?? []).toEqual([]);
  });

  it('keeps them for the next scene and stops collecting at the next week', () => {
    const s = run([
      ...start,
      resolved('s1'),
      change({ 'player.stress': 35 }),
      env('scene.ended', { sceneId: 's1', narration: 'Done.' }),
      scene('s2'),
    ]);
    expect(s.scene?.previousChanges).toEqual([{ path: 'player.stress', delta: 5 }]);
    expect(s.changes).toEqual([]);
    const later = run([
      ...start,
      resolved('s1'),
      env('clock.ticked', { turn: 1, year: 0, week_of_year: 1, month_of_year: 1, quarter: 1 }),
      change({ 'player.stress': 40 }),
    ]);
    expect(later.scene?.changes ?? []).toEqual([]);
    expect(later.flash).toEqual(['player.stress']);
  });
});

describe('the game screen', () => {
  const mounted = (events: Envelope[], locale: 'en' | 'vi' = 'en') => {
    const root = document.createElement('div');
    document.body.append(root);
    const t = fakeTransport();
    mount(root, t.transport, { locale });
    events.forEach(t.push);
    return { root, ...t };
  };
  const clock = env('clock.ticked', {
    turn: 5,
    year: 0,
    week_of_year: 4,
    month_of_year: 2,
    quarter: 1,
  });

  it('shows the result of a choice as chips, red for bad and green for good', () => {
    const { root } = mounted([
      vars({ 'player.stress': 30, 'player.rep.boss': 50 }),
      scene('s1'),
      resolved('s1', { hours: 2 }),
      change({ 'player.stress': 34, 'player.rep.boss': 53 }),
      env('scene.ended', { sceneId: 's1', narration: 'Fine.' }),
    ]);
    const chips = [...root.querySelectorAll<HTMLElement>('.je-chip')].map((c) => [
      c.textContent,
      c.dataset.tone,
    ]);
    expect(chips).toEqual([
      ['+2h', 'none'],
      ['Stress +4', 'bad'],
      ['Boss +3', 'good'],
    ]);
  });

  it('shows cost tags on choices, and why a blocked one is blocked, in both languages', () => {
    const choices = [
      { id: 'a', label: 'Do it properly', cost: { hours: 3, energy: 10 } },
      {
        id: 'b',
        label: 'Argue',
        disabled: true,
        blocked: { kind: 'requirement', path: 'skill.read_the_room', need: 30 },
      },
      {
        id: 'c',
        label: 'Push through',
        disabled: true,
        cost: { energy: 40 },
        blocked: { kind: 'energy', need: 40 },
      },
    ];
    const en = mounted([scene('s1', { choices })]);
    const tags = [...en.root.querySelectorAll('.je-choice')].map((b) => b.textContent);
    expect(tags).toEqual([
      'Do it properly[3h · 10 energy]',
      'Argue(needs read the room 30)',
      'Push through[40 energy] (needs 40 energy)',
    ]);
    expect(en.root.querySelectorAll('.je-blocked')).toHaveLength(2);
    document.body.replaceChildren();
    const vi = mounted([scene('s1', { choices })], 'vi');
    const viTags = [...vi.root.querySelectorAll('.je-choice')].map((b) => b.textContent);
    expect(viTags[0]).toBe('Do it properly[3giờ · 10 năng lượng]');
    expect(viTags[1]).toBe('Argue(cần đọc tình huống 30)');
  });

  it('draws the numbers as bars, keeps the plain text for screen readers, and flashes what moved', () => {
    const { root } = mounted([
      vars({
        'player.stress': 85,
        'player.energy': 40,
        'player.cash_vnd': 1500000,
        'player.rep.boss': 20,
      }),
      change({ 'player.stress': 88 }),
    ]);
    const tone = (path: string) =>
      root.querySelector<HTMLElement>(`.je-bar[data-path="${path}"]`)!.dataset.tone;
    expect(tone('player.stress')).toBe('bad');
    expect(tone('player.energy')).toBe('mid');
    expect(tone('player.rep.boss')).toBe('bad');
    expect(
      root.querySelector('.je-bar[data-path="player.stress"]')!.classList.contains('je-flash'),
    ).toBe(true);
    expect(root.querySelector('.je-bar[data-path="player.cash_vnd"] .je-val')?.textContent).toBe(
      '1.5M',
    );
    expect(root.querySelector('.je-bars')?.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.je-stats')?.textContent).toContain('Stress 88');
    // ten cells in a bar, nine of them lit for 88
    const lit = [...root.querySelectorAll('.je-bar[data-path="player.stress"] rect')].filter(
      (r) => r.getAttribute('fill') === 'currentColor',
    );
    expect(lit).toHaveLength(9);
  });

  it('shows the year as 52 cells with the current month marked', () => {
    const { root } = mounted([clock]);
    expect(root.querySelector('.je-year')?.getAttribute('aria-label')).toBe('Year 1: 5/52');
    expect(root.querySelectorAll('.je-yearcells rect')).toHaveLength(52);
    expect(root.querySelector('.je-months [data-now="true"]')?.textContent).toBe('F');
  });

  it('puts the room on stage with the people in it, drawn from their looks', () => {
    const { root } = mounted([
      scene('s1', {
        people: [
          {
            character: 'person.x#1',
            name: 'Nguyen Van Hung',
            title: 'QC',
            guest: true,
            look: {
              skin_tone: 3,
              hair_style: 'short',
              hair_colour: 'grey',
              facial_hair: 'beard',
              glasses: true,
              build: 'sturdy',
            },
          },
        ],
      }),
    ]);
    const stage = root.querySelector('.je-stage')!;
    expect(stage).not.toBeNull();
    // the named person and the other speaker (Boss) each stand in the room
    expect(stage.querySelectorAll('.je-actor')).toHaveLength(2);
    expect(stage.innerHTML).toContain('#b8b8c4'); // grey hair
  });

  it('opens and closes a person card, and a tap does not hide the scene', () => {
    const { root, push } = mounted([
      scene('s1', {
        people: [{ character: 'person.x#1', name: 'Hung', title: 'QC', guest: true }],
      }),
      env('perception.updated', {
        person_id: 'person.x#1',
        axis: 'warmth',
        estimate: 80,
        confidence: 50,
      }),
    ]);
    const card = () => root.querySelector<HTMLElement>('.je-card')!;
    expect(card().dataset.open).toBe('false');
    expect(card().textContent).toContain('warm ~');
    expect(card().textContent).not.toContain('What you make of them');
    card().click();
    expect(card().dataset.open).toBe('true');
    expect(card().textContent).toContain('What you make of them: warm (an impression)');
    expect(root.querySelector('.je-dialogue')?.textContent).toContain('Can you tidy the log?');
    push(env('clock.ticked', { turn: 1, year: 0, week_of_year: 1, month_of_year: 1, quarter: 1 }));
    expect(card().dataset.open).toBe('true');
    card().click();
    expect(card().dataset.open).toBe('false');
  });

  it('ends a run with a banner for how it ended, in the player language', () => {
    const debrief = env('debrief.ready', {
      ending: 'fired',
      title: 'You were let go.',
      body: 'b',
      weeks: 20,
      stats: {},
      timeline: [],
      lessons: [],
      terms: [],
      people: [],
      arcs: [],
    });
    const en = mounted([debrief]);
    expect(en.root.querySelector('.je-banner')?.textContent).toBe('FIRED');
    expect(en.root.querySelector<HTMLElement>('.je-banner')?.dataset.ending).toBe('fired');
    document.body.replaceChildren();
    const vi = mounted([debrief], 'vi');
    expect(vi.root.querySelector('.je-banner')?.textContent).toBe('BỊ SA THẢI');
  });
});
