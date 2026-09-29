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
  weight?: number;
  cooldown_weeks?: number;
  arc?: string;
  scene: string;
  effects?: Effect[];
}

export interface Outcome {
  p: number;
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
