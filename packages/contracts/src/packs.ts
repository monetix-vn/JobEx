/** Content pack shapes, version 0 (plan section 9.3). JSON Schemas for these live in schemas.ts. */

export type ExprValue = number | string | boolean | null;
/** A bare string is a variable path; use {"lit": "text"} for a string literal. */
export type Expr = ExprValue | { [op: string]: unknown };

export const PACK_LAYERS = ['core', 'region', 'industry', 'arcs', 'mods'] as const;
export type PackLayer = (typeof PACK_LAYERS)[number];

/** Folder name inside a pack to content kind. */
export const PACK_FOLDERS = {
  roles: 'role',
  events: 'event',
  scenes: 'scene',
  offers: 'offer',
  facts: 'fact',
  terms: 'term',
  characters: 'character',
} as const;
export type PackKind = (typeof PACK_FOLDERS)[keyof typeof PACK_FOLDERS];
export const LOCALES = ['vi', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export interface PackManifest {
  id: string;
  version: string;
  layer: PackLayer;
  engine_min_version: string;
  depends_on?: string[];
  description?: string;
}

export interface ScheduleEffect {
  schedule: string;
  delay_weeks: [number, number];
}
export interface DeltaEffect {
  delta: string;
  value: number;
}
export interface FactEffect {
  fact: string;
  visibility: 'private' | 'witnessed' | 'public' | 'rumor';
}
export type Effect = ScheduleEffect | DeltaEffect | FactEffect;

export interface Role {
  id: string;
  department: string;
  level: number;
  title_key: string;
  /** One or two sentences shown when the player picks a job. Roles without one are not playable. */
  blurb_key?: string;
  /** Weekly hours the listed tasks do not cover (meetings, email, admin). Sets how busy the job is. */
  overhead_hours?: number;
  reports_to?: string;
  kpis?: { id: string; weight: number }[];
  weekly_demand?: { task: string; per_week: [number, number]; effort_h: number }[];
  approval_limits?: Record<string, number>;
  skills?: string[];
  start_state?: Record<string, number>;
  dark_offers?: string[];
}

export interface GameEvent {
  id: string;
  tags?: string[];
  when?: Expr;
  /** Only this role can get the event. Omit for events any role can meet. */
  role?: string;
  weight?: number;
  cooldown_weeks?: number;
  arc?: string;
  scene: string;
  effects?: Effect[];
}

export interface Outcome {
  p: number;
  /** How the client and analytics classify this outcome. Defaults to "ok". */
  result?: 'ok' | 'fail';
  narration_key: string;
  effects?: Effect[];
}

export interface Choice {
  id: string;
  text_key: string;
  cost?: Record<string, number>;
  requires?: Expr;
  outcomes: Outcome[];
}

export interface Scene {
  id: string;
  location: string;
  /** Glossary terms the player can tap while reading this scene. */
  terms?: string[];
  cast?: string[];
  lines: { speaker: string; text_key: string }[];
  choices?: Choice[];
}

export interface Offer {
  id: string;
  from: string;
  payoff: Record<string, number>;
  pressure: { deadline_weeks: number; threat: string };
  justification_key: string;
  traces?: { type: string; visibility: number; detectors: string[] }[];
  ratchet?: { leverage_delta: number; exit_cost: number };
  educational_note?: string;
}

export type LocaleFile = Record<string, string>;

/** How well known a fact is, from only the player to everyone. Order matters. */
export const FACT_VISIBILITIES = ['private', 'witnessed', 'rumor', 'public'] as const;
export type FactVisibility = (typeof FACT_VISIBILITIES)[number];

/** Groups whose opinion of the player the simulation tracks: `player.rep.<group>`. */
export const REPUTATION_GROUPS = ['boss', 'buyer', 'finance', 'production', 'qc', 'cs'] as const;
export type ReputationGroup = (typeof REPUTATION_GROUPS)[number];

/** Who can notice something the player did, and so uncover it. */
export const DETECTORS = ['finance', 'internal_audit', 'qc', 'buyer', 'boss'] as const;
export type Detector = (typeof DETECTORS)[number];

/** Evidence a deed leaves behind, and who might find it. */
export interface Trace {
  type: 'document' | 'message' | 'payment' | 'witness' | 'record';
  /** 0 to 1: how easy it is to find if someone looks. */
  visibility: number;
  detectors: Detector[];
}

/** A glossary entry: a piece of workplace vocabulary the player can tap to understand. */
export interface Term {
  id: string;
  term_key: string;
  definition_key: string;
}

/**
 * Something the player did that others may come to know. A fact carries its own consequences:
 * reputation changes applied when it becomes known to witnesses, and again when it becomes public.
 */
export interface Fact {
  id: string;
  category: 'integrity' | 'favor' | 'conflict' | 'performance' | 'other';
  /** 1 to 10. Also sets how quickly word gets around. */
  severity: number;
  /** Short noun phrase for notices and the debrief, e.g. "the fee you accepted from a buyer". */
  text_key: string;
  /** What this teaches, for the debrief. */
  lesson_key?: string;
  /** Evidence left behind: what detectors (audits, finance, QC...) can find while it is private. */
  traces?: Trace[];
  consequences?: {
    witnessed?: Partial<Record<ReputationGroup, number>>;
    public?: Partial<Record<ReputationGroup, number>>;
  };
}

/** What we track between the player and one named person, each from -100 to 100. */
export const RELATIONSHIP_DIMENSIONS = ['trust', 'loyalty', 'owed'] as const;
export type RelationshipDimension = (typeof RELATIONSHIP_DIMENSIONS)[number];

/**
 * A named, recurring person. Scenes put them in the cast as `char:<slug>` (the id without `char.`);
 * how they feel about the player lives in state as `rel.<slug>.<dimension>`.
 */
export interface Character {
  id: string;
  name_key: string;
  title_key: string;
  department: string;
  /** The reputation group this person belongs to; what their group learns, they tend to learn. */
  home_group?: ReputationGroup;
  /** Short tags that steer writing, e.g. proud, risk_averse. */
  traits?: string[];
  /** Where the relationship starts; anything left out starts at 0. */
  start?: Partial<Record<RelationshipDimension, number>>;
}

export interface ContentTypes {
  role: Role;
  event: GameEvent;
  scene: Scene;
  offer: Offer;
  fact: Fact;
  term: Term;
  character: Character;
}

/** Read-only view of validated, merged content. Modules depend on this, never on mod-content. */
export interface ContentView {
  get<K extends PackKind>(kind: K, id: string): ContentTypes[K] | undefined;
  all<K extends PackKind>(kind: K): ContentTypes[K][];
  text(locale: Locale, key: string): string | undefined;
}
