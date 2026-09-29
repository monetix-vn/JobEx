// @vitest-environment jsdom
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { mount, type UiLocale } from '@je/client-web';
import type { CoreEventPayloads } from '@je/contracts';
import { replay, type Run } from '@je/kernel';
import { createSalesHost, fastForward } from '../src/host';

const contentRoot = join(import.meta.dirname, '..', '..', '..', 'content');
function readFiles(): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (dir: string, prefix: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      if (statSync(full).isDirectory()) walk(full, rel);
      else files[rel] = readFileSync(full, 'utf8');
    }
  };
  walk(contentRoot, '');
  return files;
}

afterEach(() => document.body.replaceChildren());

/** Clicks the first enabled choice until the current scenes are done; returns the scene texts seen. */
function playOutWeek(root: HTMLElement): string[] {
  const seen: string[] = [];
  for (let guard = 0; guard < 6; guard++) {
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-choice]')].filter(
      (b) => !b.disabled,
    );
    if (buttons.length === 0) break;
    seen.push(root.querySelector('.je-line')?.textContent ?? '');
    buttons[0]!.click();
  }
  return seen;
}

/** Answers every open scene straight on the run (no UI) with its first enabled choice. */
function answerOpenScenes(run: Run): void {
  for (let guard = 0; guard < 6; guard++) {
    const entries = run.exportLog().entries;
    const resolved = new Set(
      entries
        .filter((e) => e.type === 'choice.resolved')
        .map((e) => (e.payload as { sceneId: string }).sceneId),
    );
    const open = entries
      .filter((e) => e.type === 'scene.started')
      .map((e) => e.payload as CoreEventPayloads['scene.started'])
      .find((s) => !resolved.has(s.sceneId));
    if (!open) return;
    run.submit('choice.made', {
      sceneId: open.sceneId,
      choiceId: open.choices.find((c) => !c.disabled)!.id,
    });
  }
}

describe('the Sales Specialist, played through the client shell', () => {
  it('a person plays one or two decisions a week, the outcome stays readable, and the stats respond', async () => {
    const { run, transport } = await createSalesHost({ files: readFiles(), seed: 'human' });
    const root = document.createElement('div');
    document.body.append(root);
    mount(root, transport);
    expect(root.querySelector('.je-stats')?.textContent).toContain('Stress 25');

    const perWeek: number[] = [];
    const texts = new Set<string>();
    for (let week = 0; week < 20; week++) {
      run.advanceTurn();
      const seen = playOutWeek(root);
      perWeek.push(seen.length);
      seen.forEach((t) => texts.add(t));
      if (seen.length > 0) {
        expect(
          root.querySelector('.je-previous, .je-outcome')?.textContent?.length,
        ).toBeGreaterThan(10);
      }
    }
    const total = perWeek.reduce((a, b) => a + b, 0);
    expect(Math.max(...perWeek)).toBeLessThanOrEqual(2);
    expect(total).toBeGreaterThan(15);
    expect(texts.size).toBeGreaterThanOrEqual(8); // varied, not the same few scenes
    expect(run.inputs.length).toBe(total);
    expect(root.querySelector('.je-stats')?.textContent).toMatch(/Energy \d+/);
  });

  it('a played run replays identically from its log', async () => {
    const { run, modules, configs } = await createSalesHost({
      files: readFiles(),
      seed: 'replayable',
      turns: 8,
    });
    for (let week = 0; week < 8; week++) {
      run.advanceTurn();
      answerOpenScenes(run);
    }
    run.end();
    const log = run.exportLog();
    expect(log.inputs.length).toBeGreaterThan(5);
    const result = replay(log, modules, { configs });
    expect(result.ok, result.reason).toBe(true);
  });

  it('refuses to start on invalid content', async () => {
    await expect(
      createSalesHost({ files: { 'core/manifest.json': '{ nope' }, seed: 's' }),
    ).rejects.toThrow(/content is invalid/);
  });
});

describe('switching language mid-game keeps the game', () => {
  it('replaying the recorded choices in Vietnamese reaches the identical state, in Vietnamese', async () => {
    const en = await createSalesHost({ files: readFiles(), seed: 'switch', locale: 'en' });
    for (let week = 0; week < 10; week++) {
      en.run.advanceTurn();
      answerOpenScenes(en.run);
    }
    const vi = await createSalesHost({ files: readFiles(), seed: 'switch', locale: 'vi' });
    fastForward(vi.run, en.run.inputs, en.run.turn);

    expect(vi.run.turn).toBe(en.run.turn);
    for (const id of ['sim-core', 'director', 'workload', 'choice']) {
      expect(vi.run.snapshot()[id], id).toEqual(en.run.snapshot()[id]);
    }
    expect(vi.run.inputs).toEqual(en.run.inputs);

    const firstScene = (r: Run) =>
      r.exportLog().entries.find((e) => e.type === 'scene.started')!
        .payload as CoreEventPayloads['scene.started'];
    expect(firstScene(vi.run).sceneId).toBe(firstScene(en.run).sceneId);
    expect(firstScene(vi.run).lines[0]!.text).not.toBe(firstScene(en.run).lines[0]!.text);
    expect(firstScene(vi.run).lines[0]!.text).toMatch(
      /[ạảãàáâấầẩẫậăắằẳẵặđèéêếềểễệìíòóôốồổỗộơớờởỡợùúưứừửữựỳýỵ]/i,
    );
  });

  it('the client toggle asks the host to switch and shows the shell in Vietnamese', async () => {
    const { run, transport } = await createSalesHost({
      files: readFiles(),
      seed: 'ui',
      locale: 'vi',
    });
    const asked: UiLocale[] = [];
    const root = document.createElement('div');
    document.body.append(root);
    mount(root, transport, { locale: 'vi', onLocaleChange: (l) => asked.push(l) });
    run.advanceTurn();
    expect(root.querySelector('.je-status')?.textContent).toContain('Năm 1');
    expect(root.querySelector('.je-status')?.textContent).toContain('Tuần 1');
    expect(root.querySelector('[data-lang="vi"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('[data-lang="en"]')?.getAttribute('aria-pressed')).toBe('false');
    (root.querySelector('[data-lang="vi"]') as HTMLButtonElement).click();
    expect(asked).toEqual([]); // already Vietnamese
    (root.querySelector('[data-lang="en"]') as HTMLButtonElement).click();
    expect(asked).toEqual(['en']);
  });

  it('refuses to fast-forward inputs that were made in the middle of a turn', async () => {
    const { run } = await createSalesHost({ files: readFiles(), seed: 'x' });
    expect(() =>
      fastForward(run, [{ turn: 0, phase: 'plan', type: 'choice.made', payload: {} }], 1),
    ).toThrow(/between turns/);
  });
});
