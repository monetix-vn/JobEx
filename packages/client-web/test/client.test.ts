// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import type { Envelope } from '@je/contracts';
import { initialState, mount, reduce, type Transport } from '../src';

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

function fakeTransport() {
  const listeners = new Set<(e: Envelope) => void>();
  const sent: { type: string; payload: unknown }[] = [];
  const transport: Transport = {
    subscribe: (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    send: (type, payload) => void sent.push({ type, payload }),
  };
  return { transport, sent, push: (e: Envelope) => listeners.forEach((l) => l(e)), listeners };
}

const scene = env('scene.started', {
  sceneId: 'scene.1',
  location: 'loc.room',
  lines: [{ speaker: 'Boss', text: 'Move it up a week?' }],
  choices: [
    { id: 'a', label: 'Commit' },
    { id: 'b', label: 'Push back' },
  ],
});

afterEach(() => {
  document.body.replaceChildren();
  document.head.replaceChildren();
});

describe('reduce', () => {
  it('derives view state only from bus messages', () => {
    let s = initialState;
    s = reduce(
      s,
      env('clock.ticked', { turn: 55, year: 1, week_of_year: 3, month_of_year: 1, quarter: 1 }),
    );
    s = reduce(s, scene);
    expect(s.clock?.year).toBe(1);
    expect(s.scene?.sceneId).toBe('scene.1');
    expect(reduce(s, env('unknown.thing', {}))).toBe(s);
    expect(
      reduce(s, env('choice.resolved', { sceneId: 'other', choiceId: 'a', outcome: 'ok' })),
    ).toBe(s);
    expect(reduce(s, env('run.ended', { turn: 60 })).ended).toBe(true);
  });
});

describe('mount', () => {
  const setup = () => {
    const root = document.createElement('div');
    document.body.append(root);
    const t = fakeTransport();
    const handle = mount(root, t.transport);
    return { root, handle, ...t };
  };

  it('draws an empty shell before any message', () => {
    const { root } = setup();
    expect(root.textContent).toContain('Nothing needs your attention yet.');
    expect(root.querySelector('.je-status')?.textContent).toContain('Year -');
  });

  it('renders status, tile map and the demo scene from messages', () => {
    const { root, push } = setup();
    push(env('clock.ticked', { turn: 55, year: 1, week_of_year: 3, month_of_year: 1, quarter: 1 }));
    push(env('map.loaded', { width: 3, height: 2, tiles: ['#.d', '#m.'] }));
    push(scene);
    expect(root.querySelector('.je-status')?.textContent).toContain('Year 2');
    expect(root.querySelector('.je-status')?.textContent).toContain('Week 4');
    expect(root.querySelectorAll('.je-tile')).toHaveLength(6);
    expect((root.querySelectorAll('.je-tile')[2] as HTMLElement).dataset.tile).toBe('d');
    expect(root.querySelector('.je-dialogue')?.textContent).toContain('Boss: Move it up a week?');
    expect([...root.querySelectorAll('button')].map((b) => b.textContent)).toEqual([
      'Commit',
      'Push back',
    ]);
  });

  it('sends the player’s choice back as a command, and shows the outcome when resolved', () => {
    const { root, push, sent } = setup();
    push(scene);
    (root.querySelector('[data-choice="b"]') as HTMLButtonElement).click();
    expect(sent).toEqual([{ type: 'choice.made', payload: { sceneId: 'scene.1', choiceId: 'b' } }]);
    push(env('choice.resolved', { sceneId: 'scene.1', choiceId: 'b', outcome: 'fail' }));
    expect(root.querySelectorAll('button')).toHaveLength(0);
    expect(root.textContent).toContain('It did not go well.');
  });

  it('treats message text as text, never as markup', () => {
    const { root, push } = setup();
    push(
      env('scene.started', {
        sceneId: 's',
        location: 'l',
        lines: [{ speaker: '<b>x</b>', text: '<img src=x onerror="window.hacked=1">' }],
        choices: [{ id: 'a', label: '<script>1</script>' }],
      }),
    );
    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('script')).toBeNull();
    expect(root.textContent).toContain('<img src=x');
  });

  it('shows disabled choices as disabled, and the resolved narration once the scene ends', () => {
    const { root, push, sent } = setup();
    push(
      env('scene.started', {
        sceneId: 's2',
        location: 'l',
        lines: [{ speaker: 'Boss', text: 'Well?' }],
        choices: [
          { id: 'a', label: 'Open' },
          { id: 'b', label: 'Locked', disabled: true },
        ],
      }),
    );
    const locked = root.querySelector('[data-choice="b"]') as HTMLButtonElement;
    expect(locked.disabled).toBe(true);
    locked.click();
    expect(sent).toEqual([]);
    push(env('choice.resolved', { sceneId: 's2', choiceId: 'a', outcome: 'ok' }));
    expect(root.textContent).toContain('It worked out.');
    push(env('scene.ended', { sceneId: 's2', narration: 'Production squeezes the order in.' }));
    expect(root.querySelector('.je-outcome')?.textContent).toBe(
      'Production squeezes the order in.',
    );
    push(env('scene.ended', { sceneId: 'other', narration: 'ignored' }));
    expect(root.querySelector('.je-outcome')?.textContent).toBe(
      'Production squeezes the order in.',
    );
    push(
      env('scene.started', {
        sceneId: 's3',
        location: 'l',
        lines: [{ speaker: 'Boss', text: 'Next.' }],
        choices: [{ id: 'a', label: 'Go' }],
      }),
    );
    expect(root.querySelector('.je-previous')?.textContent).toBe(
      'Production squeezes the order in.',
    );
    expect(root.querySelector('.je-outcome')).toBeNull();
    push(env('choice.resolved', { sceneId: 's3', choiceId: 'a', outcome: 'ok' }));
    push(env('scene.ended', { sceneId: 's3', narration: 'Done.' }));
    expect(root.querySelector('.je-outcome')?.textContent).toBe('Done.');
    expect(root.querySelector('.je-previous')).toBeNull();
  });

  it('shows player stats from sim state, merging changes into the last full snapshot', () => {
    const { root, push } = setup();
    expect(root.querySelector('.je-stats')).toBeNull();
    push(
      env('sim.stateChanged', {
        full: true,
        vars: { 'player.stress': 25, 'player.energy': 100, 'player.health': 100 },
      }),
    );
    expect(root.querySelector('.je-stats')?.textContent).toBe(
      'Stress 25  |  Energy 100  |  Health 100',
    );
    push(
      env('sim.stateChanged', {
        full: false,
        vars: { 'player.stress': 31, 'player.cash_vnd': 3000000 },
      }),
    );
    expect(root.querySelector('.je-stats')?.textContent).toBe(
      'Stress 31  |  Energy 100  |  Health 100  |  Bonus (VND) 3,000,000',
    );
    push(env('sim.stateChanged', { full: true, vars: { 'player.stress': 5 } }));
    expect(root.querySelector('.je-stats')?.textContent).toBe('Stress 5');
  });

  it('shows standing with each group once it is known, and updates as it changes', () => {
    const { root, push } = setup();
    expect(root.querySelector('.je-reps')).toBeNull();
    push(
      env('sim.stateChanged', {
        full: true,
        vars: { 'player.rep.boss': 50, 'player.rep.buyer': 50 },
      }),
    );
    expect(root.querySelector('.je-reps')?.textContent).toBe('Standing: Boss 50  |  Buyers 50');
    push(
      env('sim.stateChanged', {
        full: false,
        vars: { 'player.rep.boss': 41.6, 'player.rep.qc': 62 },
      }),
    );
    expect(root.querySelector('.je-reps')?.textContent).toBe(
      'Standing: Boss 42  |  Buyers 50  |  QC 62',
    );
  });

  it('shows glossary words as tappable chips that reveal a definition, one at a time', () => {
    const { root, push } = setup();
    push(
      env('scene.started', {
        sceneId: 's1',
        location: 'l',
        lines: [{ speaker: 'Boss', text: 'The PO is late.' }],
        choices: [{ id: 'a', label: 'Go' }],
        terms: [
          { id: 'term.po', term: 'PO', definition: 'Purchase order.' },
          { id: 'term.dso', term: 'DSO', definition: 'Days sales outstanding.' },
        ],
      }),
    );
    const chips = () => [...root.querySelectorAll<HTMLButtonElement>('.je-term')];
    expect(chips().map((c) => c.textContent)).toEqual(['PO', 'DSO']);
    expect(root.querySelector('.je-definition')).toBeNull();
    chips()[0]!.click();
    expect(root.querySelector('.je-definition')?.textContent).toBe('Purchase order.');
    expect(chips()[0]!.getAttribute('aria-expanded')).toBe('true');
    chips()[1]!.click();
    expect(root.querySelector('.je-definition')?.textContent).toBe('Days sales outstanding.');
    expect(root.querySelectorAll('.je-definition')).toHaveLength(1);
    chips()[1]!.click();
    expect(root.querySelector('.je-definition')).toBeNull();
    // Opening a word never sends anything to the simulation.
    push(env('scene.started', { sceneId: 's2', location: 'l', lines: [], choices: [] }));
    expect(root.querySelector('.je-terms')).toBeNull();
  });

  const debrief = {
    ending: 'fired',
    title: 'You were let go.',
    body: 'The company parted ways with you.',
    weeks: 31,
    stats: { 'player.stress': 77, 'player.rep.boss': 4 },
    timeline: [
      { turn: 4, kind: 'choice', text: 'You chose: Accept the fee' },
      { turn: 19, kind: 'spread', text: 'It became public: the fee you took' },
      { turn: 31, kind: 'ending', text: 'You were let go.' },
    ],
    lessons: [
      {
        factId: 'fact.fee',
        fact: 'the fee you took',
        lesson: 'Gifts from buyers are a conflict of interest.',
      },
    ],
    terms: [{ id: 'term.kickback', term: 'Kickback', definition: 'A payment to win business.' }],
    people: [],
    arcs: [],
  };

  it('replaces the game with the debrief when the run is reviewed', () => {
    const { root, push } = setup();
    push(env('map.loaded', { width: 2, height: 1, tiles: ['#.'] }));
    push(scene);
    expect(root.querySelector('.je-map')).not.toBeNull();
    push(env('run.ended', { turn: 31, ending: 'fired' }));
    push(env('debrief.ready', debrief));
    expect(root.querySelector('.je-map')).toBeNull();
    expect(root.querySelector('.je-dialogue')).toBeNull();
    expect(root.querySelector('.je-debrief h2')?.textContent).toBe('You were let go.');
    expect(root.querySelector('.je-debrief p')?.textContent).toBe(
      'The company parted ways with you.',
    );
    expect([...root.querySelectorAll('.je-timeline li')].map((li) => li.textContent)).toEqual([
      'Week 5: You chose: Accept the fee',
      'Week 20: It became public: the fee you took',
      'Week 32: You were let go.',
    ]);
    expect(root.querySelector('.je-lessons li')?.textContent).toBe(
      'the fee you took: Gifts from buyers are a conflict of interest.',
    );
    expect(root.querySelector('.je-glossary li')?.textContent).toBe(
      'Kickback: A payment to win business.',
    );
    expect(root.querySelector('.je-final')?.textContent).toContain('Stress 77');
    expect(root.querySelector('.je-final')?.textContent).toContain('Boss 4');
    expect(root.querySelector('.je-status')?.textContent).toContain('Run ended');
  });

  it('offers a way to play again from the debrief, only when the host provides one', () => {
    const t = fakeTransport();
    const root = document.createElement('div');
    document.body.append(root);
    let restarts = 0;
    mount(root, t.transport, { onRestart: () => (restarts += 1) });
    t.push(env('debrief.ready', debrief));
    const again = root.querySelector<HTMLButtonElement>('.je-again');
    expect(again?.textContent).toBe('Choose another job');
    again!.click();
    expect(restarts).toBe(1);

    const plain = document.createElement('div');
    document.body.append(plain);
    const t2 = fakeTransport();
    mount(plain, t2.transport);
    t2.push(env('debrief.ready', debrief));
    expect(plain.querySelector('.je-again')).toBeNull();
  });

  it('the debrief is shown in the shell language, and leaves out empty sections', () => {
    const root = document.createElement('div');
    document.body.append(root);
    const t = fakeTransport();
    mount(root, t.transport, { locale: 'vi' });
    t.push(
      env('debrief.ready', { ...debrief, lessons: [], terms: [], timeline: [debrief.timeline[0]] }),
    );
    expect(root.querySelector('.je-timeline li')?.textContent).toBe(
      'Tuần 5: You chose: Accept the fee',
    );
    expect(root.textContent).toContain('Bạn đã làm gì, và điều gì quay lại');
    expect(root.querySelector('.je-lessons')).toBeNull();
    expect(root.querySelector('.je-glossary')).toBeNull();
  });

  it('the debrief names the people who remember you and the storylines, in the shell language', () => {
    const extra = {
      ...debrief,
      people: [
        {
          character: 'char.khoa',
          name: 'Mr Khoa',
          title: 'QC Manager',
          trust: 32,
          loyalty: 0,
          owed: 0,
        },
        {
          character: 'char.hung',
          name: 'Mr Hung',
          title: 'Supplier',
          trust: -25,
          loyalty: 0,
          owed: 2,
        },
        {
          character: 'char.minh',
          name: 'Minh',
          title: 'Lab technician',
          trust: 5,
          loyalty: 0,
          owed: -1,
        },
      ],
      arcs: [
        { arc: 'arc.a', title: 'The hamper', status: 'closed' as const },
        { arc: 'arc.b', title: 'Cheaper steel', status: 'open' as const },
      ],
    };
    const en = document.createElement('div');
    document.body.append(en);
    const t1 = fakeTransport();
    mount(en, t1.transport);
    t1.push(env('debrief.ready', extra));
    expect([...en.querySelectorAll('.je-people li')].map((li) => li.textContent)).toEqual([
      'Mr Khoa (QC Manager): trusts you (trust 32)',
      'Mr Hung (Supplier): wary of you (trust -25), owes you a favour',
      'Minh (Lab technician): undecided about you (trust 5), you owe a favour',
    ]);
    expect([...en.querySelectorAll('.je-arcs li')].map((li) => li.textContent)).toEqual([
      'The hamper: closed',
      'Cheaper steel: still unresolved',
    ]);
    const vi = document.createElement('div');
    document.body.append(vi);
    const t2 = fakeTransport();
    mount(vi, t2.transport, { locale: 'vi' });
    t2.push(env('debrief.ready', extra));
    expect(vi.textContent).toContain('Những người nhớ đến bạn');
    expect(vi.querySelector('.je-people li')?.textContent).toContain('tin bạn');
    expect(vi.querySelector('.je-arcs li')?.textContent).toContain('đã khép lại');
  });

  it('the cast panel lists the people met, updates how they feel, and follows the language', () => {
    const { root, push } = setup();
    expect(root.querySelector('.je-cast')).toBeNull();
    push(
      env('scene.started', {
        sceneId: 's1',
        location: 'l',
        lines: [{ speaker: 'Mr Khoa', text: 'Welcome.' }],
        choices: [{ id: 'a', label: 'Go' }],
        people: [{ character: 'char.khoa', name: 'Mr Khoa', title: 'QC Manager' }],
      }),
    );
    const row = () => [...root.querySelectorAll('.je-person')].map((li) => li.textContent);
    expect(row()).toEqual(['Mr Khoa (QC Manager) - undecided about you']);
    push(
      env('relationship.changed', { character: 'char.khoa', dimension: 'trust', from: 0, to: 25 }),
    );
    expect(row()).toEqual(['Mr Khoa (QC Manager) - trusts you']);
    push(
      env('relationship.changed', {
        character: 'char.khoa',
        dimension: 'trust',
        from: 25,
        to: -30,
      }),
    );
    expect(row()).toEqual(['Mr Khoa (QC Manager) - wary of you']);
    push(
      env('scene.started', {
        sceneId: 's2',
        location: 'l',
        lines: [{ speaker: 'Minh', text: 'Hi.' }],
        choices: [{ id: 'a', label: 'Go' }],
        people: [
          { character: 'char.minh', name: 'Minh', title: 'Lab technician' },
          { character: 'char.khoa', name: 'Mr Khoa', title: 'QC Manager' },
        ],
      }),
    );
    expect(row()).toHaveLength(2);
    expect(root.querySelector('.je-cast')?.textContent).toContain('People you know');
    const vi = document.createElement('div');
    document.body.append(vi);
    const t = fakeTransport();
    mount(vi, t.transport, { locale: 'vi' });
    t.push(
      env('scene.started', {
        sceneId: 's1',
        location: 'l',
        lines: [{ speaker: 'Anh Khoa', text: 'Chào.' }],
        choices: [{ id: 'a', label: 'Đi' }],
        people: [{ character: 'char.khoa', name: 'Anh Khoa', title: 'Trưởng phòng QC' }],
      }),
    );
    expect(vi.querySelector('.je-cast')?.textContent).toContain('Những người bạn quen');
    expect(vi.querySelector('.je-person')?.textContent).toBe(
      'Anh Khoa (Trưởng phòng QC) - chưa có ý kiến về bạn',
    );
  });

  it('shows the month-end close checklist only when the job has one, in both languages', () => {
    const { root, push } = setup();
    push(env('sim.stateChanged', { full: true, vars: { 'player.stress': 20 } }));
    expect(root.querySelector('.je-close')).toBeNull();
    push(
      env('sim.stateChanged', {
        full: false,
        vars: { 'close.bank_rec': 2, 'close.accruals': 1, 'close.cutoff': 0, 'close.open': 1 },
      }),
    );
    expect(root.querySelector('.je-close b')?.textContent).toBe('Month-end close (due now): ');
    expect([...root.querySelectorAll('.je-step')].map((li) => li.textContent)).toEqual([
      'Accruals: rushed',
      'Bank reconciliation: done properly',
      'Cut-off check: open',
    ]);
    push(env('sim.stateChanged', { full: false, vars: { 'close.open': 0, 'close.other': 2 } }));
    expect(root.querySelector('.je-close b')?.textContent).toBe('Month-end close: ');
    expect(root.textContent).toContain('other: done properly');
    const vi = document.createElement('div');
    document.body.append(vi);
    const t = fakeTransport();
    mount(vi, t.transport, { locale: 'vi' });
    t.push(env('sim.stateChanged', { full: true, vars: { 'close.bank_rec': 2, 'close.open': 1 } }));
    expect(vi.querySelector('.je-step')?.textContent).toBe('Đối chiếu ngân hàng: làm đầy đủ');
    expect(vi.querySelector('.je-close b')?.textContent).toContain('đến hạn');
  });

  it('a line without a speaker shows just its text, with no stray colon', () => {
    const { root, push } = setup();
    push(
      env('scene.started', {
        sceneId: 'notice.x',
        location: 'loc.notice',
        lines: [{ speaker: '', text: 'People are talking about the fee you took.' }],
        choices: [{ id: '__continue', label: 'Continue' }],
      }),
    );
    expect(root.querySelector('.je-line')?.textContent).toBe(
      'People are talking about the fee you took.',
    );
    expect(root.querySelector('.je-line b')).toBeNull();
  });

  it('dispose stops listening and clears the view', () => {
    const { root, handle, listeners, push } = setup();
    handle.dispose();
    expect(listeners.size).toBe(0);
    push(scene);
    expect(root.childElementCount).toBe(0);
    expect(document.head.querySelector('style')).toBeNull();
  });
});
