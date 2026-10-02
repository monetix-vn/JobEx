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
