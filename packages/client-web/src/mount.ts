import type { Envelope } from '@je/contracts';
import type { ClientScene } from './state';
import { initialState, reduce, type ClientState } from './state';
import { actedLine, impressionLine } from './impressions';
import { UI_LOCALES, UI_STRINGS, type UiLocale, type UiStrings } from './strings';
import { GUI_STRINGS, pathLabel } from './gui-strings';
import { cells, portrait, lookFromName, stage } from './pixel';
import { STYLE } from './style';
import { topTrait } from './impressions';

export { STYLE };

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
  /** Called from the debrief when the player wants to play again (usually: pick a job). */
  onRestart?: () => void;
}

export interface ClientHandle {
  state(): ClientState;
  dispose(): void;
}

export function el<K extends keyof HTMLElementTagNameMap>(
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
  castHidden: boolean;
  toggleCast(): void;
  /** The person card that is open (by person id). */
  openPerson: string | undefined;
  togglePerson(id: string): void;
}

/** How a person feels, in words, from their trust (-100 to 100). */
function feelingOf(trust: number, t: UiStrings): string {
  return trust >= 20
    ? t.debrief.feelings.trusts
    : trust <= -20
      ? t.debrief.feelings.wary
      : t.debrief.feelings.neutral;
}

/** The month-end close checklist, for jobs that have one (variables `close.<step>`). */
function closeView(state: ClientState, t: UiStrings): HTMLElement | undefined {
  const steps = Object.keys(state.vars)
    .filter((k) => k.startsWith('close.') && k !== 'close.open')
    .sort();
  if (steps.length === 0) return undefined;
  const box = el('div', 'je-close');
  const due = state.vars['close.open'] === 1 ? ` (${t.close.due})` : '';
  box.append(el('b', '', `${t.close.title}${due}: `));
  const list = el('ul', 'je-close-list');
  for (const key of steps) {
    const id = key.slice('close.'.length);
    const value = state.vars[key];
    const status = value === 2 ? t.close.done : value === 1 ? t.close.rushed : t.close.open;
    const item = el('li', 'je-step', `${t.close.steps[id] ?? id}: ${status}`);
    item.dataset.step = id;
    item.dataset.state = String(value);
    list.append(item);
  }
  box.append(list);
  return box;
}

/** The people met so far and how they feel about the player; a button hides or shows the list. */
function castView(state: ClientState, t: UiStrings, ui: Ui, locale: UiLocale): HTMLElement {
  const g = GUI_STRINGS[locale];
  const box = el('div', 'je-cast');
  const toggle = el('button', 'je-cast-toggle', ui.castHidden ? t.castShow : t.castHide);
  toggle.setAttribute('type', 'button');
  toggle.addEventListener('click', () => ui.toggleCast());
  box.append(el('b', '', `${t.cast} `), toggle);
  if (ui.castHidden) return box;
  const list = el('ul', 'je-cast-list');
  for (const person of state.cast) {
    const trust = state.feelings[person.character]?.trust ?? 0;
    if (!person.guest) {
      // A scripted character: name, role, and how they feel about the player.
      const item = el(
        'li',
        'je-person je-plain',
        `${person.name} (${person.title}) - ${feelingOf(trust, t)}`,
      );
      item.dataset.character = person.character;
      list.append(item);
      continue;
    }
    // A person with hidden traits: a face, one trait the player is surest of, and how they feel; tap for the rest.
    const open = ui.openPerson === person.character;
    const impression = state.impressions[person.character];
    const item = el('li', 'je-person je-card');
    item.dataset.character = person.character;
    item.dataset.guest = 'true';
    item.dataset.open = String(open);
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', String(open));
    item.append(portrait(person.look ?? lookFromName(person.name), person.character));
    const body = el('div', 'je-body');
    body.append(el('div', 'je-who', person.name), el('div', 'je-sub', person.title));
    const tags = el('div', 'je-tags');
    const feel = trust >= 20 ? 'good' : trust <= -20 ? 'bad' : 'none';
    const feelTag = el(
      'span',
      'je-tag',
      trust >= 20 ? g.person.feelsGood : trust <= -20 ? g.person.feelsBad : g.person.feelsNone,
    );
    feelTag.dataset.feel = feel;
    tags.append(feelTag);
    const top = topTrait(impression, locale);
    if (top) tags.append(el('span', 'je-tag', `${top.word} ${top.mark}`));
    body.append(tags);
    if (open) {
      const detail = [
        feelingOf(trust, t),
        actedLine(state.acted[person.character], locale),
        impressionLine(impression, locale),
      ]
        .filter(Boolean)
        .join('. ');
      body.append(el('div', 'je-more', detail));
    }
    item.append(body);
    const flip = (): void => ui.togglePerson(person.character);
    item.addEventListener('click', flip);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
    list.append(item);
  }
  box.append(list);
  return box;
}

/** The end-of-run review, replacing the map and dialogue. */
function debriefView(
  d: NonNullable<ClientState['debrief']>,
  t: UiStrings,
  onRestart: MountOptions['onRestart'],
): HTMLElement {
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
  if (d.people.length > 0) {
    box.append(el('h3', '', t.debrief.people));
    const list = el('ul', 'je-people');
    for (const person of d.people) {
      const feeling = feelingOf(person.trust, t);
      const favour =
        person.owed > 0 ? `, ${t.debrief.owesYou}` : person.owed < 0 ? `, ${t.debrief.youOwe}` : '';
      list.append(
        el(
          'li',
          '',
          `${person.name} (${person.title}): ${feeling} (${t.debrief.trust} ${person.trust})${favour}`,
        ),
      );
    }
    box.append(list);
  }
  if (d.arcs.length > 0) {
    box.append(el('h3', '', t.debrief.arcs));
    const list = el('ul', 'je-arcs');
    for (const arc of d.arcs) {
      const status = arc.status === 'closed' ? t.debrief.arcClosed : t.debrief.arcOpen;
      list.append(el('li', '', `${arc.title}: ${status}`));
    }
    box.append(list);
  }
  const standing = [...statsLine(d.stats, t).split('  |  '), repsLine(d.stats, t)].filter(Boolean);
  if (standing.length > 0) {
    box.append(el('h3', '', t.debrief.standing));
    box.append(el('p', 'je-final', standing.join('  |  ')));
  }
  if (onRestart) {
    const again = el('button', 'je-again', t.playAgain);
    again.type = 'button';
    again.addEventListener('click', onRestart);
    box.append(again);
  }
  return box;
}

/** A VND amount for the result strip: 250000 becomes 250k, 1500000 becomes 1.5M. */
function money(v: number): string {
  const a = Math.abs(v);
  return a >= 1_000_000
    ? `${Math.round(a / 100_000) / 10}M`
    : a >= 1000
      ? `${Math.round(a / 1000)}k`
      : String(a);
}

/** The bar colour: how worrying a value is, for a stat where high is bad, or where high is good. */
function toneOf(value: number, highIsBad: boolean): 'good' | 'mid' | 'bad' {
  const worry = highIsBad ? value : 100 - value;
  return worry >= 70 ? 'bad' : worry >= 40 ? 'mid' : 'good';
}

/** Segmented pixel bars for the player's numbers and the standing with each group. Text for screen readers is in `.je-stats`. */
function barsView(
  state: ClientState,
  t: UiStrings,
  g: (typeof GUI_STRINGS)[UiLocale],
): HTMLElement | undefined {
  const rows: HTMLElement[] = [];
  const flash = new Set(state.flash);
  const bar = (path: string, label: string, value: number, highIsBad: boolean): HTMLElement => {
    const row = el('div', 'je-bar');
    row.dataset.path = path;
    row.dataset.tone = toneOf(value, highIsBad);
    if (flash.has(path)) row.classList.add('je-flash');
    row.append(
      el('span', 'je-lab', label),
      cells(10, Math.round(Math.min(100, Math.max(0, value)) / 10), 'je-cells'),
      el('span', 'je-val', String(Math.round(value))),
    );
    return row;
  };
  for (const [path, label] of t.stats) {
    const value = state.vars[path];
    if (typeof value !== 'number') continue;
    if (path === 'player.cash_vnd') {
      const row = el('div', 'je-bar');
      row.dataset.path = path;
      if (flash.has(path)) row.classList.add('je-flash');
      row.append(el('span', 'je-lab', label), el('span', ''), el('span', 'je-val', money(value)));
      rows.push(row);
    } else rows.push(bar(path, label, value, g.worseWhenUp.includes(path)));
  }
  const standing = t.reps.flatMap(([path, label]) => {
    const value = state.vars[path];
    return typeof value === 'number' ? [bar(path, label, value, false)] : [];
  });
  if (rows.length === 0 && standing.length === 0) return undefined;
  const box = el('div', 'je-bars');
  box.setAttribute('aria-hidden', 'true');
  box.append(...rows);
  if (standing.length > 0) {
    const group = el('div', 'je-standing');
    group.append(...standing);
    box.append(el('h4', '', t.reputation), group);
  }
  return box;
}

/** The year as 52 pixel cells and the months under them; the current week is the last filled cell. */
function yearView(state: ClientState, locale: UiLocale): HTMLElement | undefined {
  if (!state.clock) return undefined;
  const g = GUI_STRINGS[locale];
  const week = state.clock.week_of_year + 1;
  const box = el('div', 'je-year');
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', `${g.yearBar} ${state.clock.year + 1}: ${week}/52`);
  box.append(cells(52, Math.min(52, week), 'je-yearcells'));
  const months = el('div', 'je-months');
  g.months.forEach((m, i) => {
    const span = el('span', '', m);
    span.dataset.now = String(state.clock!.month_of_year === i + 1);
    months.append(span);
  });
  box.append(months);
  return box;
}

/** What a choice changed, as small coloured chips. */
function changesView(
  changes: readonly { path: string; delta: number }[],
  t: UiStrings,
  locale: UiLocale,
): HTMLElement | undefined {
  const g = GUI_STRINGS[locale];
  const labels = new Map<string, string>([...t.stats, ...t.reps]);
  const chips = changes.flatMap((c) => {
    if (c.delta === 0) return [];
    const sign = c.delta > 0 ? '+' : '-';
    let text: string;
    let good: boolean;
    if (c.path === 'hours') {
      text = `${sign}${Math.abs(Math.round(c.delta * 10) / 10)}${g.hours}`;
      good = false;
    } else {
      const label = labels.get(c.path) ?? pathLabel(c.path, locale);
      const amount =
        c.path === 'player.cash_vnd' ? money(c.delta) : String(Math.abs(Math.round(c.delta)));
      text = `${label} ${sign}${amount}`;
      good = g.worseWhenUp.includes(c.path) ? c.delta < 0 : c.delta > 0;
    }
    const chip = el('span', 'je-chip', text);
    chip.dataset.tone = c.path === 'hours' ? 'none' : good ? 'good' : 'bad';
    chip.dataset.path = c.path;
    return [chip];
  });
  if (chips.length === 0) return undefined;
  const box = el('div', 'je-changes');
  box.append(el('span', 'je-label', g.result), ...chips);
  return box;
}

/** What a choice takes, and what is missing when it cannot be picked. */
function choiceTags(
  choice: ClientScene['choices'][number],
  locale: UiLocale,
): HTMLElement | undefined {
  const g = GUI_STRINGS[locale];
  const parts: string[] = [];
  if (choice.cost?.hours) parts.push(`${choice.cost.hours}${g.hours}`);
  if (choice.cost?.energy) parts.push(`${choice.cost.energy} ${g.energy}`);
  const blocked = choice.blocked
    ? choice.blocked.kind === 'energy'
      ? g.needsEnergy(choice.blocked.need)
      : g.needsSkill(pathLabel(choice.blocked.path, locale), choice.blocked.need)
    : undefined;
  if (parts.length === 0 && !blocked) return undefined;
  const tags = el('span', 'je-tags');
  if (parts.length > 0) tags.append(document.createTextNode(`[${parts.join(' · ')}]`));
  if (blocked) {
    if (parts.length > 0) tags.append(document.createTextNode(' '));
    tags.append(el('span', 'je-blocked', `(${blocked})`));
  }
  return tags;
}

/** Draws the state. Text goes in through textContent only, never innerHTML. */
function render(
  root: HTMLElement,
  state: ClientState,
  send: Transport['send'],
  locale: UiLocale,
  onLocaleChange: MountOptions['onLocaleChange'],
  onRestart: MountOptions['onRestart'],
  ui: Ui,
): void {
  const t = UI_STRINGS[locale];
  const g = GUI_STRINGS[locale];
  const view = el('div', 'je je-game');

  const status = el('div', 'je-status');
  const clock = state.clock;
  const playerName = state.vars['player.name'];
  status.append(
    ...(typeof playerName === 'string' ? [el('span', 'je-name', playerName)] : []),
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
  const year = yearView(state, locale);
  if (year) view.append(year);

  const layout = el('div', 'je-layout');
  const side = el('div', 'je-side');
  const main = el('div', 'je-main');
  layout.append(main, side);
  view.append(layout);

  // Numbers: bars for the eye, plain text for screen readers.
  const bars = barsView(state, t, g);
  if (bars) side.append(bars);
  const stats = statsLine(state.vars, t);
  if (stats) side.append(el('div', 'je-stats', stats));
  const reps = repsLine(state.vars, t);
  if (reps) side.append(el('div', 'je-stats je-reps', reps));

  if (state.debrief) {
    const banner = el('div', 'je-banner', g.ending[state.debrief.ending] ?? '');
    banner.dataset.ending = state.debrief.ending;
    main.append(banner, debriefView(state.debrief, t, onRestart));
    root.replaceChildren(view);
    return;
  }
  const close = closeView(state, t);
  if (close) side.append(close);
  if (state.cast.length > 0) side.append(castView(state, t, ui, locale));

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
    main.append(map);
  }

  const scene = state.scene;
  if (scene) {
    // The room and the people in it: named people with their faces, other speakers drawn from their names.
    const seen = new Set<string>();
    const present = [
      ...(scene.people ?? []).map((p) => ({ name: p.name, ...(p.look ? { look: p.look } : {}) })),
      ...scene.lines.filter((l) => l.speaker).map((l) => ({ name: l.speaker })),
    ].filter((p) => (seen.has(p.name) ? false : (seen.add(p.name), true)));
    main.append(stage(scene.location, present));
  }

  const dialogue = el('div', 'je-dialogue');
  dialogue.setAttribute('aria-live', 'polite');
  if (!scene) {
    dialogue.append(el('div', 'je-line', t.idle));
  } else {
    if (scene.previousNarration && !scene.outcome) {
      dialogue.append(el('div', 'je-previous', scene.previousNarration));
      const before = changesView(scene.previousChanges ?? [], t, locale);
      if (before) dialogue.append(before);
    }
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
      const result = changesView(scene.changes ?? [], t, locale);
      if (result) dialogue.append(result);
    } else {
      for (const choice of scene.choices) {
        const button = el('button', 'je-choice', choice.label);
        button.type = 'button';
        button.dataset.choice = choice.id;
        button.disabled = choice.disabled === true;
        const tags = choiceTags(choice, locale);
        if (tags) button.append(tags);
        button.addEventListener('click', () =>
          send('choice.made', { sceneId: scene.sceneId, choiceId: choice.id }),
        );
        dialogue.append(button);
      }
    }
  }
  main.append(dialogue);
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
    openPerson: undefined,
    togglePerson(id) {
      ui.openPerson = ui.openPerson === id ? undefined : id;
      draw();
    },
    castHidden: false,
    toggleCast() {
      ui.castHidden = !ui.castHidden;
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
      options.onRestart,
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
