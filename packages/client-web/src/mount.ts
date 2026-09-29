import type { Envelope } from '@je/contracts';
import { initialState, reduce, type ClientState } from './state';
import { UI_LOCALES, UI_STRINGS, type UiLocale, type UiStrings } from './strings';

/** The client's only connection to the simulation: messages in, commands out. */
export interface Transport {
  subscribe(listener: (envelope: Envelope) => void): () => void;
  send(type: string, payload: unknown): void;
}

export interface MountOptions {
  /** Language of the shell's own labels. Scene text is already translated. Default "en". */
  locale?: UiLocale;
  /** Called when the player picks another language; the host decides how to switch. */
  onLocaleChange?: (locale: UiLocale) => void;
}

export interface ClientHandle {
  state(): ClientState;
  dispose(): void;
}

const STYLE = `
.je{font-family:ui-monospace,Menlo,Consolas,monospace;background:#1b1b2f;color:#eee;max-width:560px;margin:0 auto;padding:12px;image-rendering:pixelated}
.je-status{display:flex;justify-content:space-between;border:3px solid #eee;padding:4px 8px;margin-bottom:8px}
.je-langs{display:flex;gap:4px}
.je-lang{font:inherit;color:#eee;background:#33335a;border:2px solid #eee;padding:0 6px;cursor:pointer}
.je-lang[aria-pressed="true"]{background:#ffd166;color:#111}
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

function statsLine(vars: ClientState['vars'], t: UiStrings): string {
  return t.stats
    .flatMap(([path, label]) => {
      const value = vars[path];
      return typeof value === 'number' ? [`${label} ${value.toLocaleString('en-US')}`] : [];
    })
    .join('  |  ');
}

/** Standing with each group, shown once the simulation has reported it. */
function repsLine(vars: ClientState['vars'], t: UiStrings): string {
  const parts = t.reps.flatMap(([path, label]) => {
    const value = vars[path];
    return typeof value === 'number' ? [`${label} ${Math.round(value)}`] : [];
  });
  return parts.length > 0 ? `${t.reputation}: ${parts.join('  |  ')}` : '';
}

/** Draws the state. Text goes in through textContent only, never innerHTML. */
function render(
  root: HTMLElement,
  state: ClientState,
  send: Transport['send'],
  locale: UiLocale,
  onLocaleChange: MountOptions['onLocaleChange'],
): void {
  const t = UI_STRINGS[locale];
  const view = el('div', 'je');

  const status = el('div', 'je-status');
  const clock = state.clock;
  status.append(
    el('span', '', clock ? `${t.year} ${clock.year + 1}` : `${t.year} -`),
    el('span', '', clock ? `${t.week} ${clock.week_of_year + 1}` : `${t.week} -`),
    el('span', '', state.ended ? t.runEnded : ''),
  );
  if (onLocaleChange) {
    const langs = el('span', 'je-langs');
    langs.setAttribute('role', 'group');
    langs.setAttribute('aria-label', t.language);
    for (const code of UI_LOCALES) {
      const button = el('button', 'je-lang', code.toUpperCase());
      button.type = 'button';
      button.dataset.lang = code;
      button.setAttribute('aria-pressed', String(code === locale));
      button.addEventListener('click', () => {
        if (code !== locale) onLocaleChange(code);
      });
      langs.append(button);
    }
    status.append(langs);
  }
  view.append(status);

  const stats = statsLine(state.vars, t);
  if (stats) view.append(el('div', 'je-stats', stats));
  const reps = repsLine(state.vars, t);
  if (reps) view.append(el('div', 'je-stats je-reps', reps));

  if (state.map) {
    const map = el('div', 'je-map');
    map.setAttribute('role', 'img');
    map.setAttribute('aria-label', t.mapLabel);
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
    dialogue.append(el('div', 'je-line', t.idle));
  } else {
    if (scene.previousNarration && !scene.outcome)
      dialogue.append(el('div', 'je-previous', scene.previousNarration));
    for (const line of scene.lines) {
      const row = el('div', 'je-line');
      if (line.speaker) row.append(el('b', '', `${line.speaker}: `));
      row.append(document.createTextNode(line.text));
      dialogue.append(row);
    }
    if (scene.outcome) {
      dialogue.append(el('div', 'je-outcome', scene.narration ?? t.outcome[scene.outcome]));
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
export function mount(
  root: HTMLElement,
  transport: Transport,
  options: MountOptions = {},
): ClientHandle {
  const locale = options.locale ?? 'en';
  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.append(style);

  let state = initialState;
  const draw = (): void =>
    render(
      root,
      state,
      (type, payload) => transport.send(type, payload),
      locale,
      options.onLocaleChange,
    );
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
