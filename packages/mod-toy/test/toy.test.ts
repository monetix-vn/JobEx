import { describe, expect, it } from 'vitest';
import { runFixture } from '@je/kernel';
import { manifest, toyModule, type ToyTallied } from '../src';

const week = (cash: number) => ({ type: 'sim.weekSettled', payload: { turn: 0, cash, stress: 0 } });

describe('mod-toy', () => {
  it('declares only what it uses', () => {
    expect(manifest.consumes).toEqual(['sim.weekSettled']);
    expect(manifest.emits).toEqual(['toy.tallied']);
  });

  it('tallies weeks and the richest cash seen (fixture)', () => {
    const emitted = runFixture(toyModule, {
      seed: 'toy-fixture',
      given: [week(100), week(300), week(200)],
      expect: [],
    }).map((e) => e.payload as ToyTallied);
    expect(emitted.map((t) => t.weeks)).toEqual([1, 2, 3]);
    expect(emitted.map((t) => t.richestCash)).toEqual([100, 300, 300]);
    const lucky = emitted.map((t) => t.luckyWeeks);
    expect(lucky).toEqual([...lucky].sort((a, b) => a - b));
    expect(lucky[2]).toBeLessThanOrEqual(3);
  });

  it('is deterministic for a given seed', () => {
    const go = () =>
      runFixture(toyModule, {
        seed: 'same',
        given: [week(1), week(2), week(3), week(4)],
        expect: [],
      });
    expect(go()).toEqual(go());
  });
});
