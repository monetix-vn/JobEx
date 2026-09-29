import type { ClockPort, Ports, RandomStream } from './ports';
import type { Envelope, EventDraft } from './events';

/** Every mod-* package exports the same three things: manifest, createModule, a test harness. */

export interface ModuleManifest {
  id: string;
  version: string;
  /** Lower runs first among subscribers of the same event. */
  priority: number;
  consumes: string[];
  emits: string[];
  contractsVersion: number;
}

export interface ModuleHost {
  moduleId: string;
  /** This module's own stream: adding a feature elsewhere never shuffles its rolls. */
  rng: RandomStream;
  clock: ClockPort;
  ports: Ports;
  /** Opaque per-module configuration supplied by the composition root. */
  config: unknown;
}

export type Handler = (envelope: Envelope) => EventDraft[] | void;

export interface ModuleInstance {
  /** Keys must be a subset of manifest.consumes. */
  handlers: Record<string, Handler>;
  /** JSON-serializable view of owned state; nobody else may mutate it. */
  snapshot(): unknown;
}

export interface Module {
  manifest: ModuleManifest;
  createModule(host: ModuleHost): ModuleInstance;
}
