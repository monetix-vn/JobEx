import type { Detector, Effect, FactVisibility } from './packs';

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
  /** True when the player cannot pick it now (requirement or cost not met). */
  disabled?: boolean;
}

export type StateValue = number | string | boolean;

/** How a run can end. "completed" means the player got through the period. */
export const ENDINGS = [
  'completed',
  'fired',
  'prosecuted',
  'burnout',
  'promoted',
  'walked_away',
] as const;
export type Ending = (typeof ENDINGS)[number];

export interface SceneTerm {
  id: string;
  term: string;
  definition: string;
}

export interface DebriefEntry {
  turn: number;
  kind: 'choice' | 'spread' | 'detected' | 'audit' | 'scapegoated' | 'ending';
  text: string;
}

export interface DebriefPerson {
  character: string;
  name: string;
  title: string;
  trust: number;
  loyalty: number;
  /** Favours they owe you; negative if you owe them. */
  owed: number;
}

export interface DebriefArc {
  arc: string;
  title: string;
  /** closed: you steered it to an end or it played out; open: it was still going when the run ended. */
  status: 'closed' | 'open';
}

export interface ScenePerson {
  character: string;
  name: string;
  title: string;
  /** Set on a person drawn from the world (a guest): `character` is then their person id. */
  guest?: boolean;
}

export interface SceneLine {
  speaker: string;
  text: string;
}

export interface CoreEventPayloads {
  'run.started': { seed: string; modules: { id: string; version: string }[] };
  /** A module asks for the run to end (after the current turn). The kernel does it. */
  'run.endRequested': { ending: Ending; reason: string };
  'run.ended': { turn: number; ending?: Ending };
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
    /** Glossary terms the player can tap, with their definitions already in the player's language. */
    terms?: SceneTerm[];
    /** Named characters in this scene, with name and title in the player's language. */
    people?: ScenePerson[];
  };
  /** Command from the player (client). */
  'choice.made': { sceneId: string; choiceId: string };
  'choice.resolved': {
    sceneId: string;
    choiceId: string;
    outcome: 'ok' | 'fail' | 'ignored';
    narrationKey?: string;
    cost?: Record<string, number>;
    /** Effects the resolver did not apply itself (schedule, fact); other modules consume these. */
    effects?: Effect[];
  };
  'choice.rejected': {
    sceneId: string;
    choiceId: string;
    reason: 'not_open' | 'unknown_choice' | 'requirement' | 'cost';
  };
  'scene.expired': { sceneId: string };
  'scene.ended': { sceneId: string; narration?: string };
  /** Command to the state owner (sim-core). Add by default, or set. */
  'sim.applyDelta': { path: string; value: number; mode?: 'add' | 'set'; reason?: string };
  'sim.deltaApplied': { path: string; from: number; to: number; reason?: string };
  'sim.deltaRejected': { path: string; reason: 'unknown_path' };
  /** Full state on init, then only the variables that changed. */
  'sim.stateChanged': { full: boolean; vars: Record<string, StateValue> };
  /** Command to the knowledge ledger: make a fact better known. It never goes backwards. */
  'knowledge.escalate': { factId: string; to: FactVisibility; reason?: string };
  'fact.learned': {
    factId: string;
    visibility: FactVisibility;
    /** "player", the roles who were in the scene, and "everyone" once public. */
    knownBy: string[];
    sceneId?: string;
  };
  'fact.escalated': { factId: string; from: FactVisibility; to: FactVisibility; knownBy: string[] };
  /** The month-end close for a month is over: how each step was done (0 open, 1 rushed, 2 proper). */
  'close.completed': { month: number; steps: Record<string, number>; score: number };
  /** A storyline began, because an event tagged with it fired. */
  'arc.started': { arc: string; eventId: string };
  /** A storyline moved to a stage; its event comes due at `due` (a turn number). */
  'arc.advanced': { arc: string; stage: string; eventId: string; due: number };
  'arc.ended': { arc: string; reason: 'end' | 'finished' };
  /** How a named person now feels about the player (`rel.<slug>.<dimension>` changed). */
  'relationship.changed': {
    character: string;
    dimension: 'trust' | 'loyalty' | 'owed';
    from: number;
    to: number;
    reason?: string;
  };
  'risk.auditStarted': { turn: number };
  /** `audit` is true when the internal audit itself found it (not just someone during an audit week). */
  'risk.detected': { factId: string; detector: Detector; trace: string; audit: boolean };
  'risk.scapegoated': { factId: string };
  /** The end-of-run review: what you did, what came back, and what it teaches. */
  'debrief.ready': {
    ending: Ending;
    title: string;
    body: string;
    weeks: number;
    stats: Record<string, number>;
    timeline: DebriefEntry[];
    lessons: { factId: string; fact: string; lesson: string }[];
    terms: SceneTerm[];
    /** Named people the player's choices moved, with how they feel at the end. */
    people: DebriefPerson[];
    /** Storylines that were started, and whether they were closed or left open. */
    arcs: DebriefArc[];
  };
  'workload.weekPlanned': {
    turn: number;
    demandHours: number;
    backlogHours: number;
    capacityHours: number;
    tasks: { task: string; count: number; hours: number }[];
  };
  'workload.weekClosed': {
    turn: number;
    demandHours: number;
    extraHours: number;
    capacityHours: number;
    doneHours: number;
    backlogHours: number;
    overloadHours: number;
    stressDelta: number;
  };
}

export type CoreEventType = keyof CoreEventPayloads;

export const EVENT_VERSIONS: Record<CoreEventType, number> = {
  'run.started': 1,
  'run.ended': 1,
  'run.endRequested': 1,
  'clock.ticked': 1,
  'turn.phaseStarted': 1,
  'content.loaded': 1,
  'map.loaded': 1,
  'sim.weekSettled': 1,
  'director.eventFired': 1,
  'scene.started': 1,
  'choice.made': 1,
  'choice.resolved': 1,
  'choice.rejected': 1,
  'scene.expired': 1,
  'scene.ended': 1,
  'sim.applyDelta': 1,
  'sim.deltaApplied': 1,
  'sim.deltaRejected': 1,
  'sim.stateChanged': 1,
  'knowledge.escalate': 1,
  'fact.learned': 1,
  'fact.escalated': 1,
  'relationship.changed': 1,
  'close.completed': 1,
  'arc.started': 1,
  'arc.advanced': 1,
  'arc.ended': 1,
  'risk.auditStarted': 1,
  'risk.detected': 1,
  'risk.scapegoated': 1,
  'debrief.ready': 1,
  'workload.weekPlanned': 1,
  'workload.weekClosed': 1,
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
