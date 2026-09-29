/** Shared message vocabulary. Types and constants only: no logic (plan section 3). */

export const CONTRACTS_VERSION = 1;
export const ENGINE_VERSION = '0.1.0';

export const WEEKS_PER_YEAR = 52;

/** Order in which the kernel walks a turn. Within a phase: module priority, then event id. */
export const TURN_PHASES = ['start', 'plan', 'resolve', 'consequence', 'end'] as const;
export type TurnPhase = (typeof TURN_PHASES)[number];

/** Message envelope shared by all events and commands. */
export interface Envelope<T = unknown> {
  /** Unique and monotonic per run. */
  id: string;
  /** e.g. "choice.resolved" */
  type: string;
  /** Schema version of this type. */
  v: number;
  runId: string;
  /** World-clock week. */
  turn: number;
  /** Parent event id: the causal chain used by the debrief. */
  causedBy?: string;
  /** Emitting module id ("kernel" for kernel events, "client" for player input). */
  source: string;
  payload: T;
}

/** What a module returns from a handler; the kernel wraps it into an Envelope. */
export interface EventDraft<T = unknown> {
  type: string;
  payload: T;
  v?: number;
}

export interface ClockSnapshot {
  turn: number;
  year: number;
  week_of_year: number;
  month_of_year: number;
  quarter: number;
}

export interface SceneChoice {
  id: string;
  label: string;
}

export interface SceneLine {
  speaker: string;
  text: string;
}

export interface CoreEventPayloads {
  'run.started': { seed: string; modules: { id: string; version: string }[] };
  'run.ended': { turn: number };
  'clock.ticked': ClockSnapshot;
  'turn.phaseStarted': { phase: TurnPhase };
  'content.loaded': { packs: { id: string; version: string }[]; counts: Record<string, number> };
  'map.loaded': { width: number; height: number; tiles: string[] };
  'sim.weekSettled': { turn: number; cash: number; stress: number };
  'director.eventFired': { eventId: string; tags: string[] };
  'scene.started': {
    sceneId: string;
    location: string;
    lines: SceneLine[];
    choices: SceneChoice[];
  };
  /** Command from the player (client). */
  'choice.made': { sceneId: string; choiceId: string };
  'choice.resolved': { sceneId: string; choiceId: string; outcome: 'ok' | 'fail' | 'ignored' };
}

export type CoreEventType = keyof CoreEventPayloads;

export const EVENT_VERSIONS: Record<CoreEventType, number> = {
  'run.started': 1,
  'run.ended': 1,
  'clock.ticked': 1,
  'turn.phaseStarted': 1,
  'content.loaded': 1,
  'map.loaded': 1,
  'sim.weekSettled': 1,
  'director.eventFired': 1,
  'scene.started': 1,
  'choice.made': 1,
  'choice.resolved': 1,
};

export type EnvelopeOf<K extends CoreEventType> = Envelope<CoreEventPayloads[K]>;

/** Player input as recorded in the replay log: a run is a seed plus these choices. */
export interface RecordedInput {
  turn: number;
  /** "idle" means submitted between turns. */
  phase: TurnPhase | 'idle';
  type: string;
  payload: unknown;
}

export interface ReplayLog {
  contractsVersion: number;
  engineVersion: string;
  seed: string;
  runId: string;
  turns: number;
  modules: { id: string; version: string }[];
  inputs: RecordedInput[];
  entries: Envelope[];
  /** JSON-serializable snapshot per module at the end of the run. */
  finalState: Record<string, unknown>;
}
