import type { Envelope } from '@je/contracts';
import { initialState, reduce, type ClientState } from './state';

/** The client's only connection to the simulation: messages in, commands out. */
export interface Transport {
  subscribe(listener: (envelope: Envelope) => void): () => void;
  send(type: string, payload: unknown): void;
}

export interface ClientHandle {
  state(): ClientState;
  dispose(): void;
}

const OUTCOME_TEXT = {
  ok: 'It worked out.',
  fail: 'It did not go well.',
  ignored: 'You let it pass.',
} as const;

const STYLE = `
.je{font-family:ui-monospace,Menlo,Consolas,monospace;background:#1b1b2f;color:#eee;max-width:560px;margin:0 auto;padding:12px;image-rendering:pixelated}
.je-status{display:flex;justify-content:space-between;border:3px solid #eee;padding:4px 8px;margin-bottom:8px}
.je-stats{border:3px solid #eee;padding:4px 8px;margin-bottom:8px;font-size:.9em}
.je-map{display:grid;gap:0;border:3px solid #eee;margin-bottom:8px}
.je-tile{aspect-ratio:1;background:#3a3a55}
.je-tile[data-tile="#"]{background:#111}
.je-tile[data-tile="d"]{background:#8a5a2b}
.je-tile[data-tile="m"]{background:#4e7d4e}
.je-dialogue{border:3px solid #eee;background:#0d0d1a;padding:8px;min-height:96px}
.je-previous{border-left:3px solid #ffd166;padding-left:8px;margin-bottom:8px;color:#bbb;font-style:italic}
.je-line b{color:#ffd166}
.je-choice{display:block;width:100%;text-align:left;margin-top:6px;padding:6px;font:inherit;color:#eee;background:#33335a;border:2px solid #eee;cursor:pointer}
.je-choice:hover,.je-choice:focus{background:#4a4a80}
.je-choice:disabled{opacity:.45;cursor:not-allowed}
`;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const STAT_LABELS: [string, string][] = [
  ['player.stress', 'Stress'],
  ['player.energy', 'Energy'],
  ['player.health', 'Health'],
  ['player.cash_vnd', 'Bonus (VND)'],
];

function statsLine(vars: ClientState['vars']): string {
  return STAT_LABELS.flatMap(([path, label]) => {
    const value = vars[path];
    return typeof value === 'number' ? [`${label} ${value.toLocaleString('en-US')}`] : [];
  }).join('  |  ');
}

/** Draws the state. Text goes in through textContent only, never innerHTML. */
function render(root: HTMLElement, state: ClientState, send: Transport['send']): void {
  const view = el('div', 'je');

  const status = el('div', 'je-status');
  const clock = state.clock;
  status.append(
    el('span', '', clock ? `Year ${clock.year + 1}` : 'Year -'),
    el('span', '', clock ? `Week ${clock.week_of_year + 1}` : 'Week -'),
    el('span', '', state.ended ? 'Run ended' : ''),
  );
  view.append(status);

  const stats = statsLine(state.vars);
  if (stats) view.append(el('div', 'je-stats', stats));

  if (state.map) {
    const map = el('div', 'je-map');
    map.setAttribute('role', 'img');
    map.setAttribute('aria-label', 'Office map');
    map.style.gridTemplateColumns = `repeat(${state.map.width}, 1fr)`;
    for (const row of state.map.tiles) {
      for (const tile of row) {
        const cell = el('div', 'je-tile');
        cell.dataset.tile = tile;
        map.append(cell);
      }
    }
    view.append(map);
  }

  const dialogue = el('div', 'je-dialogue');
  dialogue.setAttribute('aria-live', 'polite');
  const scene = state.scene;
  if (!scene) {
    dialogue.append(el('div', 'je-line', 'Nothing needs your attention yet.'));
  } else {
    if (scene.previousNarration && !scene.outcome)
      dialogue.append(el('div', 'je-previous', scene.previousNarration));
    for (const line of scene.lines) {
      const row = el('div', 'je-line');
      row.append(el('b', '', `${line.speaker}: `), document.createTextNode(line.text));
      dialogue.append(row);
    }
    if (scene.outcome) {
      dialogue.append(el('div', 'je-outcome', scene.narration ?? OUTCOME_TEXT[scene.outcome]));
    } else {
      for (const choice of scene.choices) {
        const button = el('button', 'je-choice', choice.label);
        button.type = 'button';
        button.dataset.choice = choice.id;
        button.disabled = choice.disabled === true;
        button.addEventListener('click', () =>
          send('choice.made', { sceneId: scene.sceneId, choiceId: choice.id }),
        );
        dialogue.append(button);
      }
    }
  }
  view.append(dialogue);
  root.replaceChildren(view);
}

/** Mounts the client shell. It runs from bus messages only and holds no rules. */
export function mount(root: HTMLElement, transport: Transport): ClientHandle {
  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.append(style);

  let state = initialState;
  const draw = (): void => render(root, state, (type, payload) => transport.send(type, payload));
  draw();
  const unsubscribe = transport.subscribe((envelope) => {
    const next = reduce(state, envelope);
    if (next !== state) {
      state = next;
      draw();
    }
  });
  return {
    state: () => state,
    dispose() {
      unsubscribe();
      style.remove();
      root.replaceChildren();
    },
  };
}
