import type { ClockSnapshot } from './events';

/** Ports for infrastructure. Modules never call the browser or network directly (plan section 3). */

export interface RandomStream {
  /** Uniform float in [0, 1). */
  next(): number;
  /** Uniform integer in [min, max], inclusive. */
  int(min: number, max: number): number;
  chance(p: number): boolean;
  pick<T>(items: readonly T[]): T;
  /** Opaque, serializable position in the stream. */
  state(): number;
}

export interface RandomPort {
  /** One independent stream per id, derived from the run seed. */
  stream(id: string): RandomStream;
}

export interface ClockPort {
  now(): ClockSnapshot;
}

export interface StoragePort {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  keys(prefix?: string): Promise<string[]>;
}

export interface TelemetryPort {
  record(name: string, data: Record<string, unknown>): void;
}

export interface ContentSourcePort {
  /** Relative, forward-slash paths of every file, e.g. "core/manifest.json". */
  list(): Promise<string[]>;
  read(path: string): Promise<string>;
}

export interface Ports {
  random: RandomPort;
  clock: ClockPort;
  telemetry: TelemetryPort;
  storage?: StoragePort;
  content?: ContentSourcePort;
}
