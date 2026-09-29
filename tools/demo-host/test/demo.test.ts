// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { mount } from '@je/client-web';
import { replay } from '@je/kernel';
import { stubModules } from '@je/mod-stubs';
import { createInProcessHost } from '../src/host';

afterEach(() => document.body.replaceChildren());

describe('client shell on a live in-process run (bus messages only)', () => {
  it('shows the map and status from the start, including messages sent before it mounted', () => {
    const { run, transport } = createInProcessHost('demo-test');
    run.advanceTurn();
    const root = document.createElement('div');
    document.body.append(root);
    mount(root, transport); // late mount: history is replayed
    expect(root.querySelectorAll('.je-tile')).toHaveLength(12 * 8);
    expect(root.querySelector('.je-status')?.textContent).toContain('Week 1');
  });

  it('plays a scene end to end: scene appears, a click resolves it, the run stays replayable', () => {
    const { run, transport } = createInProcessHost('demo-test');
    const root = document.createElement('div');
    document.body.append(root);
    mount(root, transport);

    let clicked = false;
    for (let week = 0; week < 52 && !clicked; week++) {
      run.advanceTurn();
      const button = root.querySelector('[data-choice="a"]') as HTMLButtonElement | null;
      if (button) {
        button.click();
        clicked = true;
      }
    }
    expect(clicked).toBe(true);
    expect(root.querySelectorAll('[data-choice]')).toHaveLength(0);
    expect(root.querySelector('.je-outcome')?.textContent).toMatch(/worked out|did not go well/);
    expect(run.inputs).toHaveLength(1);
    expect(run.inputs[0]?.type).toBe('choice.made');

    run.runTurns(5);
    run.end();
    expect(replay(run.exportLog(), stubModules).ok).toBe(true);
    expect(root.querySelector('.je-status')?.textContent).toContain('Run ended');
  });
});
