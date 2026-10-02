import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, PlayerProfile } from '@je/contracts';
import { DEFAULT_WORLD_SETTINGS, PERSONAS } from '@je/contracts';
import type { Run } from '@je/kernel';
import { HR_ROLE, SALES_ROLE, createGameHost } from '../src/host';
import {
  deleteSlot,
  listSlots,
  makeSave,
  parseSave,
  readSlot,
  restoreGame,
  saveFileName,
  writeSlot,
  type SlotStorage,
} from '../src/saves';

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
const files = readFiles();
const profile: PlayerProfile = { name: 'Lan', ...PERSONAS.parent };

/**
 * Plays n weeks, always taking the first choice of every scene, like a careful person. Choices are
 * made between turns (the client does the same), which is what makes a game replayable from its inputs.
 */
function play(run: Run, weeks: number): void {
  const pending: { sceneId: string; choiceId: string }[] = [];
  run.observe((e) => {
    if (e.type === 'scene.started') {
      const p = e.payload as CoreEventPayloads['scene.started'];
      pending.push({ sceneId: p.sceneId, choiceId: p.choices[0]!.id });
    }
  });
  for (let i = 0; i < weeks; i++) {
    run.advanceTurn();
    for (let guard = 0; guard < 8 && pending.length > 0; guard++) {
      for (const choice of pending.splice(0)) run.submit('choice.made', choice);
    }
  }
}
const vars = (run: Run) => run.snapshot()['sim-core'] as Record<string, number | string>;

function memory(): SlotStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

describe('the player profile in a game', () => {
  it('changes the start: name, money pressure, stress and skills; and the same profile always gives the same game', async () => {
    const plain = await createGameHost({ files, seed: 'p1', roleId: HR_ROLE });
    const withProfile = await createGameHost({ files, seed: 'p1', roleId: HR_ROLE, profile });
    const again = await createGameHost({ files, seed: 'p1', roleId: HR_ROLE, profile });
    expect(vars(plain.run)['player.name']).toBeUndefined();
    expect(vars(withProfile.run)['player.name']).toBe('Lan');
    expect(vars(withProfile.run)['profile.money_pressure']).toBe(50);
    expect(vars(withProfile.run)['player.stress'] as number).toBeGreaterThan(
      vars(plain.run)['player.stress'] as number,
    );
    expect(withProfile.run.snapshot()).toEqual(again.run.snapshot());
  });

  it('an unprofiled game is untouched by the feature', async () => {
    const a = await createGameHost({ files, seed: 'same', roleId: SALES_ROLE });
    const b = await createGameHost({ files, seed: 'same', roleId: SALES_ROLE });
    expect(a.run.snapshot()).toEqual(b.run.snapshot());
    expect(vars(a.run)['profile.money_pressure']).toBeUndefined();
  });
});

describe('saving and loading', () => {
  const settings = { ...DEFAULT_WORLD_SETTINGS };

  it('a loaded game is exactly where the player stopped, with the profile', async () => {
    const host = await createGameHost({ files, seed: 'save-1', roleId: HR_ROLE, profile });
    play(host.run, 14);
    const save = makeSave(
      {
        seed: 'save-1',
        roleId: HR_ROLE,
        title: 'HR',
        locale: 'en',
        profile,
        settings,
        run: host.run,
      },
      '2026-10-02T12:00:00Z',
      'test',
    );
    expect(save.turn).toBe(14);
    expect(save.inputs.length).toBeGreaterThan(3);

    const restored = await restoreGame(files, save);
    expect(restored.run.turn).toBe(14);
    expect(restored.run.snapshot()).toEqual(host.run.snapshot());
    expect(vars(restored.run)['player.name']).toBe('Lan');
  });

  it('survives being written to text and read back, and keeps playing in step with the original', async () => {
    const host = await createGameHost({ files, seed: 'save-2', roleId: SALES_ROLE });
    play(host.run, 9);
    const text = JSON.stringify(
      makeSave(
        {
          seed: 'save-2',
          roleId: SALES_ROLE,
          title: 'Sales',
          locale: 'en',
          settings,
          run: host.run,
        },
        'now',
      ),
    );
    const parsed = parseSave(text);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const restored = await restoreGame(files, parsed.save);
    // Both play the next weeks the same way, so both end in the same state.
    play(host.run, 6);
    play(restored.run, 6);
    expect(restored.run.snapshot()).toEqual(host.run.snapshot());
  });

  it('can be loaded in the other language and reaches the same state', async () => {
    const host = await createGameHost({ files, seed: 'save-3', roleId: HR_ROLE, profile });
    play(host.run, 11);
    const save = makeSave(
      {
        seed: 'save-3',
        roleId: HR_ROLE,
        title: 'HR',
        locale: 'en',
        profile,
        settings,
        run: host.run,
      },
      'now',
    );
    const vi = await restoreGame(files, save, 'vi');
    expect(vars(vi.run)).toEqual(vars(host.run));
  });

  it('refuses a damaged or foreign file without crashing', () => {
    for (const text of [
      '',
      'not json',
      '{}',
      JSON.stringify({ format: 99 }),
      JSON.stringify({ format: 1, seed: 'x', roleId: 'oops', locale: 'en', turn: 1, inputs: [] }),
      JSON.stringify({
        format: 1,
        seed: 'x',
        roleId: 'role.a',
        locale: 'en',
        turn: 1,
        inputs: [{ type: 1 }],
      }),
    ]) {
      expect(parseSave(text).ok, text).toBe(false);
    }
  });

  it('keeps four slots in storage, lists them, and deletes them', async () => {
    const storage = memory();
    const host = await createGameHost({ files, seed: 'save-4', roleId: HR_ROLE, profile });
    play(host.run, 4);
    const save = makeSave(
      {
        seed: 'save-4',
        roleId: HR_ROLE,
        title: 'HR',
        locale: 'vi',
        profile,
        settings,
        run: host.run,
      },
      'now',
    );
    writeSlot(storage, '2', save);
    expect(readSlot(storage, '2')).toEqual(save);
    expect(readSlot(storage, '1')).toBeUndefined();
    expect(listSlots(storage).map((s) => [s.slot, s.save !== undefined])).toEqual([
      ['auto', false],
      ['1', false],
      ['2', true],
      ['3', false],
    ]);
    storage.setItem('jobex.save.3', 'garbage');
    expect(readSlot(storage, '3')).toBeUndefined();
    deleteSlot(storage, '2');
    expect(readSlot(storage, '2')).toBeUndefined();
    expect(saveFileName(save)).toBe('jobex-lan-week4.json');
  });
});
