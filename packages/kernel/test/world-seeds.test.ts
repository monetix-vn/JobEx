import { describe, expect, it } from 'vitest';
import { DAYS_PER_YEAR, DEFAULT_WORLD_SETTINGS, WORLD_LIMITS } from '@je/contracts';
import { daysBetween, dayOfYear, deriveSeed, generationStream, snapshotForTurn } from '../src';

const seeds = { world_seed: 'world-1', run_seed: 'run-1' };

describe('world and run seeds', () => {
  it('derives the same seed from the same parts, and different seeds from different parts', () => {
    expect(deriveSeed('a', 'b', 1)).toBe(deriveSeed('a', 'b', 1));
    expect(deriveSeed('a', 'b', 1)).not.toBe(deriveSeed('a', 'b', 2));
    expect(deriveSeed('ab', 'c')).not.toBe(deriveSeed('a', 'bc'));
    expect(deriveSeed(1, 23)).not.toBe(deriveSeed(12, 3));
  });

  it('generates the same person from the same world, run, event and counter', () => {
    const draw = (s: typeof seeds, event: string, n: number) => {
      const stream = generationStream(s, 'person', event, n);
      return Array.from({ length: 10 }, () => stream.next());
    };
    expect(draw(seeds, 'e1', 0)).toEqual(draw(seeds, 'e1', 0));
    expect(draw(seeds, 'e1', 0)).not.toEqual(draw(seeds, 'e1', 1));
    expect(draw(seeds, 'e1', 0)).not.toEqual(draw(seeds, 'e2', 0));
  });

  it('a restart in the same world (new run seed) gives different people; the world seed alone is not enough', () => {
    const first = generationStream(seeds, 'person', 'hire', 0).next();
    const restarted = generationStream({ ...seeds, run_seed: 'run-2' }, 'person', 'hire', 0).next();
    const otherWorld = generationStream(
      { ...seeds, world_seed: 'world-2' },
      'person',
      'hire',
      0,
    ).next();
    expect(restarted).not.toBe(first);
    expect(otherWorld).not.toBe(first);
  });
});

describe('the day-based calendar', () => {
  it('counts days from the week the clock is on', () => {
    expect(dayOfYear(snapshotForTurn(0))).toBe(0);
    expect(dayOfYear(snapshotForTurn(2), 3)).toBe(17);
    expect(dayOfYear(snapshotForTurn(51), 6)).toBe(DAYS_PER_YEAR - 1);
    expect(daysBetween(10, 14)).toBe(28);
  });
});

describe('settings and limits', () => {
  it('has the limits the owner agreed and a steady one-year default', () => {
    expect(WORLD_LIMITS).toEqual({ nearby: 50, company: 500, world: 3000 });
    expect(DEFAULT_WORLD_SETTINGS).toEqual({
      game_length: 'one_year',
      time_mode: 'steady',
      intensity: 'standard',
      year_weeks: 52,
    });
  });
});
