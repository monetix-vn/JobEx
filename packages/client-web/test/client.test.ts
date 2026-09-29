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

  it('dispose stops listening and clears the view', () => {
    const { root, handle, listeners, push } = setup();
    handle.dispose();
    expect(listeners.size).toBe(0);
    push(scene);
    expect(root.childElementCount).toBe(0);
    expect(document.head.querySelector('style')).toBeNull();
  });
});
