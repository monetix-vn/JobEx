import { STYLE, el } from './mount';
import { UI_LOCALES, UI_STRINGS, type UiLocale } from './strings';

export interface PickableRole {
  id: string;
  title: string;
  blurb: string;
  /** Department id and its title; jobs with the same department are grouped under one heading. */
  department?: string;
  departmentTitle?: string;
}

export interface PickerOptions {
  locale?: UiLocale;
  onPick: (roleId: string) => void;
  onLocaleChange?: (locale: UiLocale) => void;
}

/** The "choose your job" screen shown before a run starts. Text goes in through textContent only. */
export function mountRolePicker(
  root: HTMLElement,
  roles: readonly PickableRole[],
  options: PickerOptions,
): { dispose(): void } {
  const locale = options.locale ?? 'en';
  const t = UI_STRINGS[locale];
  const style = document.createElement('style');
  style.textContent = STYLE;
  document.head.append(style);

  const view = el('div', 'je je-picker');
  const status = el('div', 'je-status');
  status.append(el('span', '', t.pickJob));
  if (options.onLocaleChange) {
    const langs = el('span', 'je-langs');
    langs.setAttribute('role', 'group');
    langs.setAttribute('aria-label', t.language);
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
  view.append(status, el('p', '', t.pickHint));
  let lastDept: string | undefined;
  for (const role of roles) {
    if (role.department !== undefined && role.department !== lastDept) {
      lastDept = role.department;
      const heading = el('h3', 'je-dept', role.departmentTitle ?? role.department);
      heading.dataset.dept = role.department;
      view.append(heading);
    }
    const card = el('button', 'je-job');
    card.type = 'button';
    card.dataset.role = role.id;
    card.append(el('b', '', role.title), document.createTextNode(role.blurb));
    card.addEventListener('click', () => options.onPick(role.id));
    view.append(card);
  }
  root.replaceChildren(view);

  return {
    dispose() {
      style.remove();
      root.replaceChildren();
    },
  };
}
