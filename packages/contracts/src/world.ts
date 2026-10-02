/** World and settings vocabulary for the persistent world (ADR 0003 to 0005). Types and constants only. */

export const DAYS_PER_WEEK = 7;
/** The calendar's base unit is a day; the simulation still ticks weekly for now. */
export const DAYS_PER_YEAR = 52 * DAYS_PER_WEEK;

/** Hard limits agreed with the owner: people around the player, in the company, in the whole world. */
export const WORLD_LIMITS = { nearby: 50, company: 500, world: 3000 } as const;

export const GAME_LENGTHS = ['one_year', 'several_years', 'career'] as const;
export type GameLength = (typeof GAME_LENGTHS)[number];

/** How the year runs: time moves when the player ends the week, steadily, or with timed decisions. */
export const TIME_MODES = ['thoughtful', 'steady', 'pressure'] as const;
export type TimeMode = (typeof TIME_MODES)[number];

/** How explicit text may be and which themes are skipped; the simulation itself does not change. */
export const INTENSITIES = ['reduced', 'standard', 'full'] as const;
export type Intensity = (typeof INTENSITIES)[number];

/** Chosen when a world is created and changeable in the settings. */
export interface WorldSettings {
  game_length: GameLength;
  time_mode: TimeMode;
  intensity: Intensity;
  /** Weeks in a game year: a full year, a short year or a sprint. */
  year_weeks: 12 | 26 | 52;
}

export const DEFAULT_WORLD_SETTINGS: WorldSettings = {
  game_length: 'one_year',
  time_mode: 'steady',
  intensity: 'standard',
  year_weeks: 52,
};

/** A world has a seed that never changes; each run inside it has its own, so a restart differs. */
export interface WorldSeeds {
  world_seed: string;
  run_seed: string;
}

/** The three simulation tiers: weekly full detail, monthly company pass, yearly statistical pass. */
export const SIM_TIERS = ['near', 'company', 'world'] as const;
export type SimTier = (typeof SIM_TIERS)[number];

/** A line of a world history: something that happened to someone in a world year. */
export interface LoreEntry {
  year: number;
  kind: 'life_event' | 'run_ended' | 'created';
  person: string;
  en: string;
  vi: string;
}

/** One run (one playthrough with one character) inside a world. */
export interface WorldRunRecord {
  run_no: number;
  run_seed: string;
  role_id: string;
  protagonist: string;
  ending: string;
  weeks: number;
}

export const WORLD_FORMAT = 1;

/**
 * A persistent world (ADR 0004): its seed, settings, history and every person in it. A world is kept in a folder; the
 * player can continue it with a new character (a new run seed), and old characters stay in it as autonomous people.
 */
export interface World {
  format: typeof WORLD_FORMAT;
  id: string;
  name: string;
  world_seed: string;
  settings: WorldSettings;
  created_at: string;
  /** Whole years that have passed in the world (each finished run is a year). */
  year: number;
  runs: WorldRunRecord[];
  people: import('./people').Person[];
  lore: LoreEntry[];
}

/** What a finished run tells the world about its protagonist. Computed by the host from the final state. */
export interface RunSummary {
  role_id: string;
  department: string;
  profile?: import('./profile').PlayerProfile;
  ending: string;
  weeks: number;
  stress: number;
  /** Facts the protagonist left, with their severity (1 to 10) and how far they got (0 private to 3 public). */
  facts: { id: string; severity: number; level: number }[];
  reputation: Record<string, number>;
}
