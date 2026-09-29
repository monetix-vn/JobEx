import type { RandomPort, RandomStream } from '@je/contracts';

/** xmur3-style string hash to an unsigned 32-bit integer. Integer math only, so it is portable. */
export function hashString(input: string): number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Each stream's seed depends only on the run seed and the stream id. */
export function deriveStreamSeed(runSeed: string, streamId: string): number {
  return hashString(`${runSeed}::${streamId}`);
}

/** mulberry32: small, fast, good enough for game randomness, identical on every JS engine. */
export class SeededStream implements RandomStream {
  private a: number;

  constructor(seed: number) {
    this.a = seed | 0;
  }

  next(): number {
    this.a = (this.a + 0x6d2b79f5) | 0;
    let t = Math.imul(this.a ^ (this.a >>> 15), 1 | this.a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
      throw new RangeError(`invalid int range [${min}, ${max}]`);
    }
    return min + Math.floor(this.next() * (max - min + 1));
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(items: readonly T[]): T {
    if (items.length === 0) throw new RangeError('cannot pick from an empty list');
    return items[this.int(0, items.length - 1)] as T;
  }

  state(): number {
    return this.a >>> 0;
  }
}

export class SeededRandom implements RandomPort {
  private readonly streams = new Map<string, SeededStream>();

  constructor(private readonly runSeed: string) {}

  stream(id: string): SeededStream {
    let s = this.streams.get(id);
    if (!s) {
      s = new SeededStream(deriveStreamSeed(this.runSeed, id));
      this.streams.set(id, s);
    }
    return s;
  }
}
