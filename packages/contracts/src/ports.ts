import type { Person } from './people';
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

/** A request for the person underneath a fixed character. */
export interface CharacterRequest {
  characterId: string;
  /** The department written in the character's file; it may not be one the people library knows. */
  department: string;
  /** Writers' notes on the character (methodical, tired...); they nudge the person's temperament. */
  traits?: string[];
  turn: number;
}

/** A request for a person to appear in a scene (see `Scene.guests`). */
export interface GuestRequest {
  sceneId: string;
  slot: string;
  story_function: string;
  department?: string;
  /** A person who asked for this scene (already met this run); they take the slot if they can. */
  preferred?: string;
  turn: number;
}

/**
 * Supplies the people who appear in scenes. The implementation must be deterministic for a given run:
 * the same sequence of requests gives the same people, so a replay reproduces the same scenes.
 */
export interface GuestPort {
  appear(request: GuestRequest): Person;
  /**
   * The person underneath a fixed, named character (their id is the character's id). The same person is returned
   * every time within a run, so a character keeps their traits.
   */
  character(request: CharacterRequest): Person;
}
