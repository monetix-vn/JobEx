import { describe, expect, it } from 'vitest';
import { SeededRandom, SeededStream, deriveStreamSeed, hashString } from '../src';

describe('seeded RNG', () => {
  it('produces the same sequence for the same seed and stream id', () => {
    const a = new SeededRandom('seed-1').stream('mod-x');
    const b = new SeededRandom('seed-1').stream('mod-x');
    const run = (s: typeof a): number[] => Array.from({ length: 50 }, () => s.next());
    expect(run(a)).toEqual(run(b));
  });

  it('gives different streams different sequences', () => {
    const rng = new SeededRandom('seed-1');
    expect(rng.stream('a').next()).not.toBe(rng.stream('b').next());
    expect(deriveStreamSeed('s1', 'a')).not.toBe(deriveStreamSeed('s2', 'a'));
  });

  it('keeps stream positions independent of each other', () => {
    const solo = new SeededRandom('s').stream('a');
    const shared = new SeededRandom('s');
    const a = shared.stream('a');
    shared.stream('b').next();
    shared.stream('b').next();
    expect([a.next(), a.next()]).toEqual([solo.next(), solo.next()]);
  });

  it('is pinned to known values so the algorithm cannot change silently', () => {
    expect(hashString('job-experiment')).toBe(GOLDEN_HASH);
    const s = new SeededStream(12345);
    expect([s.next(), s.next(), s.next()]).toEqual(GOLDEN_SEQUENCE);
  });

  it('int() is inclusive, uniform enough, and validates its range', () => {
    const s = new SeededStream(99);
    const counts = new Array<number>(6).fill(0);
    for (let i = 0; i < 12000; i++) counts[s.int(1, 6) - 1]! += 1;
    for (const c of counts) expect(c).toBeGreaterThan(1600);
    for (const c of counts) expect(c).toBeLessThan(2400);
    expect(() => s.int(3, 2)).toThrow(RangeError);
    expect(() => s.int(1.5, 2)).toThrow(RangeError);
  });

  it('floats stay in [0, 1) and pick() rejects an empty list', () => {
    const s = new SeededStream(7);
    for (let i = 0; i < 1000; i++) {
      const v = s.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
    expect(() => s.pick([])).toThrow(RangeError);
    expect(s.pick(['only'])).toBe('only');
  });

  it('state() reflects position', () => {
    const s = new SeededStream(1);
    const before = s.state();
    s.next();
    expect(s.state()).not.toBe(before);
  });
});

const GOLDEN_HASH = 3391839360;
const GOLDEN_SEQUENCE = [0.9797282677609473, 0.3067522644996643, 0.484205421525985];
