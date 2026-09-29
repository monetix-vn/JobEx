// @vitest-environment jsdom
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@je/client-web';
import { replay } from '@je/kernel';
import { createSalesHost } from '../src/host';

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

describe('the Sales Specialist week, played through the client shell', () => {
  it('a person can play the three scenes by clicking, and the stats respond', async () => {
    const { run, transport } = await createSalesHost({
      files: readFiles(),
      seed: 'human',
      turns: 4,
    });
    const root = document.createElement('div');
    document.body.append(root);
    mount(root, transport);

    expect(root.querySelector('.je-stats')?.textContent).toContain('Stress 25');
    run.advanceTurn();

    const seen: string[] = [];
    for (let guard = 0; guard < 6; guard++) {
      const line = root.querySelector('.je-line')?.textContent ?? '';
      const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-choice]')].filter(
        (b) => !b.disabled,
      );
      if (buttons.length === 0) break;
      seen.push(line);
      buttons.at(-1)!.click(); // the last enabled choice
      // The outcome is readable right after the click: on the next scene, or on this one if last.
      const outcome = root.querySelector('.je-previous, .je-outcome')?.textContent ?? '';
      expect(outcome.length).toBeGreaterThan(10);
    }
    expect(seen).toHaveLength(3);
    expect(seen[0]).toContain('PO 4471');
    expect(seen[1]).toContain('RFQ');
    expect(seen[2]).toContain('forecast');
    expect(run.inputs).toHaveLength(3);
    expect(root.querySelector('.je-stats')?.textContent).toMatch(/Energy \d+/);

    run.runTurns(3);
    run.end();
    expect(root.querySelector('.je-status')?.textContent).toContain('Run ended');
  });

  it('a played run replays identically from its log', async () => {
    const { run, modules, configs } = await createSalesHost({
      files: readFiles(),
      seed: 'replayable',
      turns: 4,
    });
    run.advanceTurn((phase, r) => {
      if (phase !== 'plan') return;
      r.submit('choice.made', { sceneId: 'scene.sales.shipment_pull_in', choiceId: 'c2' });
      r.submit('choice.made', { sceneId: 'scene.sales.rfq_discount', choiceId: 'c2' });
      r.submit('choice.made', { sceneId: 'scene.sales.forecast_meeting', choiceId: 'c3' });
    });
    run.runTurns(3);
    run.end();
    const log = run.exportLog();
    expect(log.inputs).toHaveLength(3);
    const result = replay(log, modules, { configs });
    expect(result.ok, result.reason).toBe(true);
  });

  it('refuses to start on invalid content', async () => {
    await expect(
      createSalesHost({ files: { 'core/manifest.json': '{ nope' }, seed: 's' }),
    ).rejects.toThrow(/content is invalid/);
  });
});
