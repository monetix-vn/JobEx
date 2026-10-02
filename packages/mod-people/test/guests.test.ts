import { describe, expect, it } from 'vitest';
import type { GuestRequest, Person } from '@je/contracts';
import { createGuestPort, generatePerson } from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const seeds = { world_seed: 'w', run_seed: 'r' };
const ask = (n: number, over: Partial<GuestRequest> = {}): GuestRequest => ({
  sceneId: `scene.s${n}`,
  slot: 'colleague',
  story_function: 'tempter',
  turn: n,
  ...over,
});
const meet = (reuseChance?: number, roster?: Person[], run = 'r') => {
  const port = createGuestPort({
    library,
    seeds: { ...seeds, run_seed: run },
    department: 'qc',
    ...(reuseChance === undefined ? {} : { reuseChance }),
    ...(roster ? { roster } : {}),
  });
  return Array.from({ length: 12 }, (_, i) => port.appear(ask(i)));
};

describe('the guest port', () => {
  it('is deterministic: the same run meets the same people in the same order', () => {
    expect(meet().map((p) => p.id)).toEqual(meet().map((p) => p.id));
    expect(meet(0, undefined, 'r2').map((p) => p.origin)).not.toEqual(meet(0).map((p) => p.origin));
  });

  it("draws from the requested department, defaulting to the player's own", () => {
    const port = createGuestPort({ library, seeds, department: 'qc' });
    expect(port.appear(ask(1)).life.department).toBe('qc');
    expect(port.appear(ask(2, { department: 'dept.production' })).life.department).toBe(
      'production',
    );
  });

  it('colleagues recur: people already met come back, and a new person is drawn otherwise', () => {
    expect(new Set(meet(1).map((p) => p.id)).size).toBe(1);
    expect(new Set(meet(0).map((p) => p.id)).size).toBe(12);
  });

  it("prefers the world's roster, skipping people who are gone or retired", () => {
    const base = (id: string, status?: Person['status']): Person => ({
      ...generatePerson(
        library,
        { department: 'qc', event_id: id, counter: 0 },
        { seeds, created_turn: 0 },
      ),
      ...(status ? { status } : {}),
    });
    const active = base('a');
    const roster = [active, base('b', 'gone'), base('c', 'retired')];
    const port = createGuestPort({
      library,
      seeds,
      department: 'qc',
      roster,
      rosterChance: 1,
      reuseChance: 0,
    });
    expect(port.appear(ask(1)).id).toBe(active.id);
    // the only active person has been met, so the next guest is a new one
    expect(port.appear(ask(2)).id).not.toBe(active.id);
  });
});
