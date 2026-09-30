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
.je-terms{margin-top:8px;font-size:.9em}
.je-terms-hint{color:#999;margin-right:6px}
.je-term{font:inherit;color:#9ad1ff;background:none;border:0;border-bottom:1px dashed #9ad1ff;margin-right:8px;padding:0;cursor:pointer}
.je-term[aria-expanded="true"]{color:#111;background:#9ad1ff}
.je-definition{margin-top:6px;padding:6px;border:2px solid #9ad1ff;background:#13233a}
.je-debrief{border:3px solid #eee;background:#0d0d1a;padding:10px}
.je-debrief h2,.je-debrief h3{margin:10px 0 6px;font-size:1em;color:#ffd166}
.je-debrief h2{font-size:1.15em;margin-top:0}
.je-debrief ol,.je-debrief ul{margin:0;padding-left:20px}
.je-debrief li{margin-bottom:4px}
.je-entry-ending{color:#ffd166}
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

/** Shell-only interaction state: which glossary word is open. It is never sent to the simulation. */
interface Ui {
  openTerm: string | undefined;
  toggleTerm(key: string): void;
}

/** The end-of-run review, replacing the map and dialogue. */
function debriefView(d: NonNullable<ClientState['debrief']>, t: UiStrings): HTMLElement {
  const box = el('div', 'je-debrief');
  box.append(el('h2', '', d.title), el('p', '', d.body));

  if (d.timeline.length > 0) {
    box.append(el('h3', '', t.debrief.story));
    const list = el('ol', 'je-timeline');
    for (const entry of d.timeline) {
      const item = el(
        'li',
        `je-entry je-entry-${entry.kind}`,
        `${t.debrief.week} ${entry.turn + 1}: ${entry.text}`,
      );
      list.append(item);
    }
    box.append(list);
  }
  if (d.lessons.length > 0) {
    box.append(el('h3', '', t.debrief.lessons));
    const list = el('ul', 'je-lessons');
    for (const lesson of d.lessons) list.append(el('li', '', `${lesson.fact}: ${lesson.lesson}`));
    box.append(list);
  }
  if (d.terms.length > 0) {
    box.append(el('h3', '', t.debrief.terms));
    const list = el('ul', 'je-glossary');
    for (const term of d.terms) list.append(el('li', '', `${term.term}: ${term.definition}`));
    box.append(list);
  }
  const standing = [...statsLine(d.stats, t).split('  |  '), repsLine(d.stats, t)].filter(Boolean);
  if (standing.length > 0) {
    box.append(el('h3', '', t.debrief.standing));
    box.append(el('p', 'je-final', standing.join('  |  ')));
  }
  return box;
}

/** Draws the state. Text goes in through textContent only, never innerHTML. */
function render(
  root: HTMLElement,
  state: ClientState,
  send: Transport['send'],
  locale: UiLocale,
  onLocaleChange: MountOptions['onLocaleChange'],
  ui: Ui,
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

  if (state.debrief) {
    view.append(debriefView(state.debrief, t));
    root.replaceChildren(view);
    return;
  }

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
    if (scene.terms && scene.terms.length > 0) {
      const box = el('div', 'je-terms');
      box.append(el('span', 'je-terms-hint', t.termsHint));
      let open: (typeof scene.terms)[number] | undefined;
      for (const term of scene.terms) {
        const key = `${scene.sceneId}:${term.id}`;
        const isOpen = ui.openTerm === key;
        if (isOpen) open = term;
        const chip = el('button', 'je-term', term.term);
        chip.type = 'button';
        chip.dataset.term = term.id;
        chip.setAttribute('aria-expanded', String(isOpen));
        chip.addEventListener('click', () => ui.toggleTerm(key));
        box.append(chip);
      }
      if (open) box.append(el('div', 'je-definition', open.definition));
      dialogue.append(box);
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
  const ui: Ui = {
    openTerm: undefined,
    toggleTerm(key) {
      ui.openTerm = ui.openTerm === key ? undefined : key;
      draw();
    },
  };
  const draw = (): void =>
    render(
      root,
      state,
      (type, payload) => transport.send(type, payload),
      locale,
      options.onLocaleChange,
      ui,
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
