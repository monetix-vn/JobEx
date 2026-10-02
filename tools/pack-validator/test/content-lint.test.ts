import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { ContentView, Effect, Scene } from '@je/contracts';
import { loadContent } from '@je/mod-content';
import { directorySource } from '../src';

/**
 * Content quality rules that the schema cannot express: the writing conventions in
 * content/industry-cookware/events/README.md, checked on the real packs.
 */
const contentDir = join(import.meta.dirname, '..', '..', '..', 'content');
const { registry } = await loadContent(directorySource(contentDir));
const content = registry as unknown as ContentView;
const scenes = content.all('scene') as Scene[];
const interactive = scenes.filter((s) => (s.choices?.length ?? 0) > 0);
const effectsOf = (scene: Scene, choiceId: string): Effect[] =>
  (scene.choices?.find((c) => c.id === choiceId)?.outcomes ?? []).flatMap((o) => o.effects ?? []);
const makesFact = (effects: Effect[]) => effects.some((e) => 'fact' in e);

describe('content lint', () => {
  it('the content loads', () => {
    expect(registry).toBeDefined();
    expect(interactive.length).toBeGreaterThan(80);
  });

  it('every scene offers two or three choices, numbered c1, c2, c3 in order', () => {
    const bad = interactive
      .filter((s) => {
        const ids = s.choices!.map((c) => c.id);
        return ids.length < 2 || ids.length > 3 || ids.some((id, i) => id !== `c${i + 1}`);
      })
      .map((s) => s.id);
    expect(bad).toEqual([]);
  });

  it('every fact that matters teaches something: severity 3 and up has a lesson', () => {
    const bad = content
      .all('fact')
      .filter((f) => f.severity >= 3 && !f.lesson_key)
      .map((f) => f.id);
    expect(bad).toEqual([]);
  });

  it('every dark scene (tagged "dark") leaves a fact on its shortcut (c3), so it can come back', () => {
    const bad = content
      .all('event')
      .filter((e) => (e.tags ?? []).includes('dark'))
      .filter((e) => !makesFact(effectsOf(content.get('scene', e.scene) as Scene, 'c3')))
      .map((e) => e.id);
    expect(bad).toEqual([]);
  });

  it('a by-the-book choice (c1) never plants a serious fact', () => {
    const bad: string[] = [];
    for (const s of interactive) {
      for (const e of effectsOf(s, 'c1')) {
        if ('fact' in e && (content.get('fact', e.fact)?.severity ?? 0) >= 6) bad.push(s.id);
      }
    }
    expect(bad).toEqual([]);
  });

  it('the shortcut of a dark scene can go wrong at once: c3 has a failed outcome', () => {
    const bad = content
      .all('event')
      .filter((e) => (e.tags ?? []).includes('dark'))
      .filter((e) => {
        const scene = content.get('scene', e.scene) as Scene;
        return !scene.choices?.[2]?.outcomes.some((o) => o.result === 'fail');
      })
      .map((e) => e.id);
    expect(bad).toEqual([]);
  });

  it('no text is left as a placeholder, empty, or with stray spacing, in either language', () => {
    const problems: string[] = [];
    for (const locale of ['en', 'vi'] as const) {
      const keys = new Set<string>();
      for (const s of scenes) {
        s.lines.forEach((l) => keys.add(l.text_key));
        for (const c of s.choices ?? []) {
          keys.add(c.text_key);
          c.outcomes.forEach((o) => keys.add(o.narration_key));
        }
      }
      for (const key of keys) {
        const text = content.text(locale, key) ?? '';
        if (text.trim().length < 3) problems.push(`${locale} ${key}: empty`);
        if (/TODO|lorem|\[[a-z_.]+\]/i.test(text)) problems.push(`${locale} ${key}: placeholder`);
        if (/ {2}|\s$|^\s/.test(text)) problems.push(`${locale} ${key}: spacing`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('every job has enough to play: scenes per role, and a beat or two', () => {
    const events = content.all('event');
    for (const [role, min] of [
      ['role.sales.export.specialist', 25],
      ['role.qc.specialist', 30],
      ['role.fin.accountant', 30],
      ['role.prod.planner', 25],
      ['role.purch.buyer', 18],
      ['role.inv.analyst', 18],
    ] as const) {
      const mine = events.filter((e) => e.role === role);
      expect(mine.length, role).toBeGreaterThanOrEqual(min);
      expect(mine.filter((e) => e.beat).length, `${role} beats`).toBeGreaterThanOrEqual(4);
    }
  });
});
