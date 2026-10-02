// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import type { PlayerProfile, WorldSettings } from '@je/contracts';
import { mountProfileForm } from '../src';

afterEach(() => {
  document.body.replaceChildren();
  document.head.replaceChildren();
});

function open(options: Partial<Parameters<typeof mountProfileForm>[1]> = {}) {
  const root = document.createElement('div');
  document.body.append(root);
  const started: { profile: PlayerProfile; settings: WorldSettings }[] = [];
  const form = mountProfileForm(root, {
    onStart: (profile, settings) => started.push({ profile, settings }),
    ...options,
  });
  return { root, started, form };
}
const field = (root: HTMLElement, key: string): HTMLInputElement | HTMLSelectElement =>
  root.querySelector(`[data-field="${key}"]`) as HTMLInputElement | HTMLSelectElement;
const click = (root: HTMLElement, selector: string): void =>
  (root.querySelector(selector) as HTMLElement).click();

describe('the profile and settings screens', () => {
  it('shows the four quick-start people and fills every field when one is picked', () => {
    const { root } = open();
    expect(root.querySelectorAll('[data-persona]').length).toBe(4);
    click(root, '[data-persona="parent"]');
    expect(field(root, 'age').value).toBe('36');
    expect(field(root, 'money').value).toBe('tight');
    expect(field(root, 'dependents').value).toBe('children');
    expect(root.querySelector('[data-persona="parent"]')?.getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('starts with what was typed and chosen, and names the player "You" when no name is given', () => {
    const { root, started } = open();
    click(root, '[data-persona="fresh_graduate"]');
    const name = field(root, 'name') as HTMLInputElement;
    name.value = 'Lan';
    name.dispatchEvent(new Event('input'));
    const money = field(root, 'money') as HTMLSelectElement;
    money.value = 'in_debt';
    money.dispatchEvent(new Event('change'));
    click(root, '[data-action="start"]');
    expect(started).toHaveLength(1);
    expect(started[0]!.profile).toMatchObject({
      name: 'Lan',
      age: 23,
      money: 'in_debt',
      education: 'university',
    });
    // A hand-edited field means it is no longer exactly a persona.
    expect(started[0]!.profile.persona).toBeUndefined();

    const second = open();
    click(second.root, '[data-action="start"]');
    expect(second.started[0]!.profile.name).toBe('You');
  });

  it('offers the full year now and marks the shorter years as coming soon, and lets the player choose how time runs', () => {
    const { root, started } = open();
    const length = root.querySelector('[data-setting="year_weeks"]') as HTMLSelectElement;
    const options = [...length.options];
    expect(options.map((o) => o.disabled)).toEqual([false, true, true]);
    expect(options[1]!.textContent).toContain('coming soon');
    const mode = root.querySelector('[data-setting="time_mode"]') as HTMLSelectElement;
    mode.value = 'thoughtful';
    mode.dispatchEvent(new Event('change'));
    click(root, '[data-action="start"]');
    expect(started[0]!.settings).toMatchObject({
      time_mode: 'thoughtful',
      year_weeks: 52,
      intensity: 'standard',
    });
  });

  it('"Surprise me" uses the random source it is given, so it is repeatable', () => {
    const make = () => {
      let i = 0;
      const seq = [0.1, 0.9, 0.3, 0.7, 0.2, 0.6, 0.4, 0.8];
      return () => seq[i++ % seq.length]!;
    };
    const a = open({ random: make() });
    click(a.root, '[data-surprise]');
    click(a.root, '[data-action="start"]');
    const b = open({ random: make() });
    click(b.root, '[data-surprise]');
    click(b.root, '[data-action="start"]');
    expect(a.started[0]!.profile).toEqual(b.started[0]!.profile);
  });

  it('shows what the profile changes, in Vietnamese too, and can go back and switch language', () => {
    const langs: string[] = [];
    let backs = 0;
    const { root } = open({
      locale: 'vi',
      describeEffects: () => ({ stress: 7, pressure: 50, boss: 4 }),
      onBack: () => (backs += 1),
      onLocaleChange: (l) => langs.push(l),
    });
    expect(root.textContent).toContain('Bạn là ai?');
    expect(root.textContent).toContain('căng thẳng +7');
    expect(root.textContent).toContain('+4');
    click(root, '[data-action="back"]');
    click(root, '[data-lang="en"]');
    expect(backs).toBe(1);
    expect(langs).toEqual(['en']);
  });

  it('cleans up after itself', () => {
    const { root, form } = open();
    expect(document.head.querySelectorAll('style')).toHaveLength(1);
    form.dispose();
    expect(root.childElementCount).toBe(0);
    expect(document.head.querySelectorAll('style')).toHaveLength(0);
  });
});
