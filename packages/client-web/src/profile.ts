import {
  DEFAULT_WORLD_SETTINGS,
  DEPENDENT_KINDS,
  EDUCATION_LEVELS,
  EXPERIENCES,
  GENDERS,
  HIRING_PATHS,
  INTENSITIES,
  MONEY_SITUATIONS,
  PERSONAS,
  PERSONA_IDS,
} from '@je/contracts';
import type { PlayerProfile, WorldSettings } from '@je/contracts';
import { PROFILE_STRINGS } from './profile-strings';
import { STYLE, el } from './mount';
import { UI_LOCALES, UI_STRINGS, type UiLocale } from './strings';

/** Which world the new game belongs to. */
export type WorldChoice = { kind: 'new'; name: string } | { kind: 'continue'; id: string };

export interface ProfileFormOptions {
  locale?: UiLocale;
  /** The job being started (shown as a heading line). */
  jobTitle?: string;
  /** Starting values (for example when going back from the game). */
  initial?: { profile?: PlayerProfile; settings?: WorldSettings };
  /** Source of randomness for "Surprise me" (the page passes Math.random; packages may not use it). */
  random?: () => number;
  /** Shows what the profile changes at the start (computed by the host from the simulation's own rules). */
  describeEffects?: (profile: PlayerProfile) => { stress: number; pressure: number; boss: number };
  /** Worlds kept by the save host; undefined means the world section is not shown. */
  worlds?: { id: string; name: string; year: number; runs: number; people: number }[];
  /** False when no save host is running: the form says so instead of offering worlds. */
  hostAvailable?: boolean;
  onStart: (profile: PlayerProfile, settings: WorldSettings, world?: WorldChoice) => void;
  onBack?: () => void;
  onLocaleChange?: (locale: UiLocale) => void;
}

const DEFAULT_PROFILE: PlayerProfile = {
  name: '',
  age: 30,
  gender: 'female',
  education: 'university',
  experience: 'some',
  money: 'tight',
  dependents: 'none',
  hiring_path: 'applied_cold',
};

/** The new-game screens: who you are, what is at stake at home, and how the year runs. Text goes in through textContent only. */
export function mountProfileForm(
  root: HTMLElement,
  options: ProfileFormOptions,
): { dispose(): void } {
  const locale = options.locale ?? 'en';
  const t = PROFILE_STRINGS[locale];
  const ui = UI_STRINGS[locale];
  const profile: PlayerProfile = { ...DEFAULT_PROFILE, ...(options.initial?.profile ?? {}) };
  const settings: WorldSettings = {
    ...DEFAULT_WORLD_SETTINGS,
    ...(options.initial?.settings ?? {}),
  };

  const style = document.createElement('style');
  style.textContent = `${STYLE}
.je-form h3{margin:14px 0 4px;color:#ffd166;font-size:1em;text-transform:uppercase;letter-spacing:1px}
.je-form p{margin:4px 0;color:#bbb}
.je-field{display:grid;grid-template-columns:150px 1fr;gap:6px;align-items:center;margin:6px 0}
.je-field input,.je-field select{box-sizing:border-box;font:inherit;color:#eee;background:#0d0d1a;border:3px solid #eee;padding:3px 6px;width:100%;border-radius:0}
.je-personas{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.je-persona{font:inherit;text-align:left;color:#eee;background:#33335a;border:3px solid #eee;padding:6px;cursor:pointer}
.je-persona b{display:block;color:#ffd166}
.je-persona span{font-size:.85em;color:#bbb}
.je-persona[aria-pressed="true"]{background:#4a4a80;border-color:#ffd166}
.je-effects{border:3px solid #ffd166;padding:6px 8px;margin-top:10px}
.je-actions{display:flex;gap:8px;margin-top:12px}
.je-soon{color:#888}`;
  document.head.append(style);

  const view = el('div', 'je je-form');
  const status = el('div', 'je-status');
  status.append(el('span', '', options.jobTitle ?? t.title));
  if (options.onLocaleChange) {
    const langs = el('span', 'je-langs');
    langs.setAttribute('role', 'group');
    langs.setAttribute('aria-label', ui.language);
    for (const code of UI_LOCALES) {
      const button = el('button', 'je-lang', code.toUpperCase());
      button.type = 'button';
      button.dataset.lang = code;
      button.setAttribute('aria-pressed', String(code === locale));
      button.addEventListener('click', () => {
        if (code !== locale) options.onLocaleChange?.(code);
      });
      langs.append(button);
    }
    status.append(langs);
  }
  view.append(status, el('h3', '', t.title), el('p', '', t.intro));

  // Quick start personas
  view.append(el('h3', '', t.quickStart));
  const personas = el('div', 'je-personas');
  const personaButtons: HTMLButtonElement[] = [];
  const effects = el('div', 'je-effects');
  const fields: Record<string, HTMLInputElement | HTMLSelectElement> = {};

  const refresh = (): void => {
    for (const [key, input] of Object.entries(fields)) {
      const value = (profile as unknown as Record<string, string | number | undefined>)[key];
      if (value !== undefined) input.value = String(value);
    }
    personaButtons.forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.persona === profile.persona)),
    );
    effects.replaceChildren();
    if (options.describeEffects) {
      const e = options.describeEffects(profile);
      effects.append(
        el('b', '', t.effectsTitle),
        el(
          'div',
          '',
          t.effectsIntro
            .replace('{stress}', String(e.stress))
            .replace('{pressure}', String(e.pressure))
            .replace('{boss}', `${e.boss >= 0 ? '+' : ''}${e.boss}`),
        ),
      );
    }
  };
  const apply = (next: Omit<PlayerProfile, 'name'> | PlayerProfile): void => {
    const name = profile.name;
    Object.assign(profile, next);
    delete (profile as { persona?: string }).persona;
    if ('persona' in next && next.persona) profile.persona = next.persona;
    profile.name = name;
    refresh();
  };

  for (const id of PERSONA_IDS) {
    const info = t.personas[id]!;
    const button = el('button', 'je-persona');
    button.type = 'button';
    button.dataset.persona = id;
    button.append(el('b', '', info.name), el('span', '', info.blurb));
    button.addEventListener('click', () => apply(PERSONAS[id]));
    personaButtons.push(button);
    personas.append(button);
  }
  const surprise = el('button', 'je-persona');
  surprise.type = 'button';
  surprise.dataset.surprise = 'true';
  surprise.append(el('b', '', t.random));
  surprise.addEventListener('click', () => {
    const rnd = options.random ?? ((): number => 0.5);
    const pick = <T>(items: readonly T[]): T =>
      items[Math.min(items.length - 1, Math.floor(rnd() * items.length))] as T;
    apply({
      age: 22 + Math.floor(rnd() * 34),
      gender: pick(GENDERS.filter((g) => g !== 'non_binary')),
      education: pick(EDUCATION_LEVELS),
      experience: pick(EXPERIENCES),
      money: pick(MONEY_SITUATIONS),
      dependents: pick(DEPENDENT_KINDS),
      hiring_path: pick(HIRING_PATHS),
    });
  });
  personas.append(surprise);
  view.append(personas);

  // Fields
  const field = (key: string, label: string, input: HTMLInputElement | HTMLSelectElement): void => {
    input.dataset.field = key;
    fields[key] = input;
    const row = el('label', 'je-field');
    row.append(el('span', '', label), input);
    view.append(row);
  };
  const select = (
    key: string,
    values: readonly string[],
    names: Record<string, string>,
  ): HTMLSelectElement => {
    const s = document.createElement('select');
    for (const v of values) {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = names[v] ?? v;
      s.append(o);
    }
    s.addEventListener('change', () => {
      (profile as unknown as Record<string, string>)[key] = s.value;
      delete (profile as { persona?: string }).persona;
      refresh();
    });
    return s;
  };

  view.append(el('h3', '', t.labels.name));
  const name = document.createElement('input');
  name.type = 'text';
  name.maxLength = 40;
  name.placeholder = t.placeholderName;
  name.value = profile.name;
  name.addEventListener('input', () => {
    profile.name = name.value;
  });
  field('name', t.labels.name, name);
  const age = document.createElement('input');
  age.type = 'number';
  age.min = '18';
  age.max = '65';
  age.addEventListener('input', () => {
    profile.age = Math.min(65, Math.max(18, Math.round(Number(age.value) || 30)));
    delete (profile as { persona?: string }).persona;
    refresh();
  });
  field('age', t.labels.age, age);
  field('gender', t.labels.gender, select('gender', GENDERS, t.gender));
  field('education', t.labels.education, select('education', EDUCATION_LEVELS, t.education));
  field('experience', t.labels.experience, select('experience', EXPERIENCES, t.experience));
  field('money', t.labels.money, select('money', MONEY_SITUATIONS, t.money));
  field('dependents', t.labels.dependents, select('dependents', DEPENDENT_KINDS, t.dependents));
  field('hiring_path', t.labels.hiring, select('hiring_path', HIRING_PATHS, t.hiring));
  view.append(effects);

  // Settings
  view.append(el('h3', '', t.settings), el('p', '', t.settingsIntro));
  const timeMode = document.createElement('select');
  for (const mode of ['thoughtful', 'steady'] as const) {
    const o = document.createElement('option');
    o.value = mode;
    o.textContent = t.timeModes[mode] ?? mode;
    timeMode.append(o);
  }
  timeMode.value = settings.time_mode === 'thoughtful' ? 'thoughtful' : 'steady';
  timeMode.dataset.setting = 'time_mode';
  timeMode.addEventListener('change', () => {
    settings.time_mode = timeMode.value as WorldSettings['time_mode'];
  });
  const timeRow = el('label', 'je-field');
  timeRow.append(el('span', '', t.timeMode), timeMode);
  view.append(timeRow);

  const length = document.createElement('select');
  for (const weeks of ['52', '26', '12']) {
    const o = document.createElement('option');
    o.value = weeks;
    o.textContent =
      weeks === '52'
        ? (t.yearLengths[weeks] ?? weeks)
        : `${t.yearLengths[weeks] ?? weeks} (${t.comingSoon})`;
    o.disabled = weeks !== '52';
    length.append(o);
  }
  length.value = '52';
  length.dataset.setting = 'year_weeks';
  const lengthRow = el('label', 'je-field');
  lengthRow.append(el('span', '', t.yearLength), length);
  view.append(lengthRow);

  const intensity = document.createElement('select');
  for (const level of INTENSITIES) {
    const o = document.createElement('option');
    o.value = level;
    o.textContent = t.intensities[level] ?? level;
    intensity.append(o);
  }
  intensity.value = settings.intensity;
  intensity.dataset.setting = 'intensity';
  intensity.addEventListener('change', () => {
    settings.intensity = intensity.value as WorldSettings['intensity'];
  });
  const intensityRow = el('label', 'je-field');
  intensityRow.append(el('span', '', t.intensity), intensity);
  view.append(intensityRow);

  // World
  let worldChoice: WorldChoice | undefined;
  let worldName = t.world.newNameDefault;
  if (options.hostAvailable === false) {
    view.append(el('h3', '', t.world.title), el('p', '', t.world.noHost));
  } else if (options.hostAvailable === true) {
    view.append(el('h3', '', t.world.title), el('p', '', t.world.intro));
    worldChoice = { kind: 'new', name: worldName };
    const choose = (choice: WorldChoice, input: HTMLInputElement): void => {
      worldChoice = choice;
      for (const radio of view.querySelectorAll<HTMLInputElement>('[data-world-radio]'))
        radio.checked = radio === input;
    };
    const makeRadio = (value: string, checked: boolean): HTMLInputElement => {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'world';
      radio.checked = checked;
      radio.dataset.worldRadio = value;
      radio.style.width = 'auto';
      return radio;
    };
    const newRow = el('label', 'je-field');
    const newRadio = makeRadio('new', true);
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.maxLength = 40;
    nameInput.value = worldName;
    nameInput.dataset.worldName = 'true';
    nameInput.addEventListener('input', () => {
      worldName = nameInput.value;
      choose({ kind: 'new', name: worldName.trim() || t.world.newNameDefault }, newRadio);
    });
    newRadio.addEventListener('change', () =>
      choose({ kind: 'new', name: worldName.trim() || t.world.newNameDefault }, newRadio),
    );
    const newLabel = el('span', '', t.world.newWorld);
    newLabel.prepend(newRadio, document.createTextNode(' '));
    newRow.append(newLabel, nameInput);
    view.append(newRow);
    for (const w of options.worlds ?? []) {
      const row = el('label', 'je-field');
      const radio = makeRadio(w.id, false);
      radio.addEventListener('change', () => choose({ kind: 'continue', id: w.id }, radio));
      const label = el('span', '', `${t.world.continue}: ${w.name}`);
      label.prepend(radio, document.createTextNode(' '));
      row.append(
        label,
        el(
          'span',
          '',
          t.world.summary
            .replace('{year}', String(w.year))
            .replace('{runs}', String(w.runs))
            .replace('{people}', String(w.people)),
        ),
      );
      view.append(row);
    }
  }

  // Actions
  const actions = el('div', 'je-actions');
  const start = el('button', 'je-again', t.start);
  start.type = 'button';
  start.dataset.action = 'start';
  start.addEventListener('click', () => {
    const final: PlayerProfile = {
      ...profile,
      name: profile.name.trim() || t.nameDefault,
    };
    options.onStart(final, { ...settings, year_weeks: 52 }, worldChoice);
  });
  actions.append(start);
  if (options.onBack) {
    const back = el('button', 'je-lang', t.back);
    back.type = 'button';
    back.dataset.action = 'back';
    back.addEventListener('click', () => options.onBack?.());
    actions.append(back);
  }
  view.append(actions);

  root.replaceChildren(view);
  refresh();
  return {
    dispose() {
      style.remove();
      root.replaceChildren();
    },
  };
}
