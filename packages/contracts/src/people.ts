/**
 * People vocabulary (ADR 0003): the Person model, the attribute library and the data tables it reads.
 * Types and constants only; the logic lives in `mod-people`.
 */

/** Six temperament axes, each 0 to 100. Independent of gender and age by design. */
export const TEMPERAMENT_AXES = [
  'caution',
  'ambition',
  'warmth',
  'integrity',
  'resilience',
  'impulsivity',
] as const;
export type TemperamentAxis = (typeof TEMPERAMENT_AXES)[number];
export type Temperament = Record<TemperamentAxis, number>;

/** What a person cares about; each person has two or three. */
export const PERSON_VALUES = [
  'security',
  'status',
  'fairness',
  'loyalty',
  'freedom',
  'family',
  'money',
  'craft',
] as const;
export type PersonValue = (typeof PERSON_VALUES)[number];

export const GENDERS = ['female', 'male', 'non_binary'] as const;
export type Gender = (typeof GENDERS)[number];

export const REGIONS = ['north', 'centre', 'south'] as const;
export type Region = (typeof REGIONS)[number];

export const SETTLEMENTS = ['rural', 'urban'] as const;
export type Settlement = (typeof SETTLEMENTS)[number];

export const EDUCATION_LEVELS = [
  'lower_secondary',
  'upper_secondary',
  'vocational',
  'college',
  'university',
  'postgraduate',
] as const;
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const MARITAL_STATUSES = ['single', 'partnered', 'married', 'divorced', 'widowed'] as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];

export const HOUSING = ['with_family', 'rent', 'own'] as const;
export type Housing = (typeof HOUSING)[number];

/** How a person got their job; it sets who expects what of them. */
export const HIRING_PATHS = [
  'applied_cold',
  'internal_transfer',
  'recommended',
  'owner_relative',
] as const;
export type HiringPath = (typeof HIRING_PATHS)[number];

/** Who is making this person's choices. */
export type Controller = 'human' | 'auto';

export interface PersonName {
  family: string;
  middle: string;
  given: string;
}

/** Fixed at creation. */
export interface PersonOrigin {
  gender: Gender;
  /** Age in whole years when created (the birth turn is `created_turn` minus age in weeks). */
  age_at_creation: number;
  region: Region;
  settlement: Settlement;
  /** 'in_school' for children who have not finished school. */
  education: EducationLevel | 'in_school';
  hiring_path: HiringPath;
  temperament: Temperament;
  values: PersonValue[];
  quirks: string[];
  archetype: string;
  name: PersonName;
  /** Speech tags used to pick text variants (derived from the archetype and the quirks). */
  voice: string[];
}

/** Changes slowly: yearly or by life events. Money is in VND per month or in total. */
export interface PersonLife {
  department: string;
  ladder_step: number;
  tenure_years: number;
  performance: number;
  income_vnd: number;
  debt_vnd: number;
  savings_vnd: number;
  marital: MaritalStatus;
  children: number;
  /** People who depend on this person's income. */
  dependents: number;
  housing: Housing;
  health: number;
}

/** Links to the people closest to a person; filled in when a household is generated. */
export interface FamilyLinks {
  spouse?: string;
  children: string[];
  parents: string[];
}

/**
 * How a person looks, as traits (never pixels). A sprite renderer composes layers from these later.
 * Independent of temperament by design; it comes from its own seeded stream.
 */
export interface Appearance {
  build: string;
  height: string;
  /** 1 (lightest) to 5 (deepest) within the range found in the library's population. */
  skin_tone: number;
  face: string;
  hair_style: string;
  hair_colour: string;
  facial_hair: string;
  glasses: boolean;
  mark: string;
  seed: number;
}

export interface Person {
  id: string;
  /** The seed this person was drawn from (the first attempt that passed validation). */
  seed: number;
  created_turn: number;
  controller: Controller;
  origin: PersonOrigin;
  life: PersonLife;
  /** Always present on generated people; optional so older saves still load. */
  appearance?: Appearance;
  family?: FamilyLinks;
  /** World year this person was created in (0 for the first run); age grows from it. */
  created_year?: number;
  /** active people live and age; others are kept in the world but no longer simulated. */
  status?: 'active' | 'retired' | 'gone';
  /** Set on a character the player once controlled; the world keeps them as an autonomous person. */
  legacy?: { run_no: number; ending: string; title: string };
}

/** What a caller (the director or a story arc) asks the generator for. */
export interface PersonRequest {
  department: string;
  age_range?: [number, number];
  gender?: Gender;
  /** A story function (complainant, accused, tempter, rival, mentor...) that biases the archetype. */
  story_function?: string;
  hiring_path?: HiringPath;
  /** Event or arc that asked, and a counter, so the same ask always yields the same person. */
  event_id: string;
  counter: number;
}

/** ---- The library (data) ---- */

export interface BilingualText {
  en: string;
  vi: string;
}

export interface Archetype {
  id: string;
  name: BilingualText;
  weight: number;
  /** Mean and spread for each axis; missing axes use 50 and 18. */
  temperament: Partial<Record<TemperamentAxis, [number, number]>>;
  /** Extra weight on values (default 1). */
  value_affinity?: Partial<Record<PersonValue, number>>;
  /** Extra weight on quirks by id (default 1). */
  quirk_affinity?: Record<string, number>;
  /** Multiplier on this archetype's weight for a story function (default 1). */
  function_bias?: Record<string, number>;
  /** Speech tags this archetype contributes. */
  voice?: string[];
}

export interface Quirk {
  id: string;
  name: BilingualText;
  weight: number;
  tags: string[];
  /** Quirk ids that cannot appear together with this one. */
  incompatible_with?: string[];
  /** Small shifts applied to temperament when the quirk is present. */
  temperament_shift?: Partial<Record<TemperamentAxis, number>>;
  voice?: string[];
}

export interface WeightedName {
  name: string;
  weight: number;
  /** Lean towards people born before 1985 (older) or after (younger); 1 is neutral. */
  older?: number;
  younger?: number;
}

export interface NameLibrary {
  family: WeightedName[];
  middle: Record<Gender, WeightedName[]>;
  given: Record<Gender, WeightedName[]>;
}

/** A data table with its provenance. Rows are numbers or weights keyed by short ids. */
export interface DataTable<Row = Record<string, number | string>> {
  id: string;
  source: string;
  year: number;
  /** False until a person has checked the numbers against the named source. */
  verified: boolean;
  note?: string;
  rows: Row[];
}

export interface DepartmentProfile {
  department: string;
  female_share: number;
  age_mean: number;
  age_sd: number;
  age_min: number;
  age_max: number;
  min_education: EducationLevel;
  /** Median monthly income in VND for the department's first ladder step. */
  income_base_vnd: number;
}

/** One option of an appearance trait, with the people it can apply to. */
export interface AppearanceOption {
  id: string;
  weight: number;
  genders?: Gender[];
  age_from?: number;
  age_to?: number;
}

export interface AppearanceLibrary {
  /** Trait name (build, height, face, hair_style, hair_colour, facial_hair, mark) to its options. */
  traits: Record<string, AppearanceOption[]>;
  /** Share of people with grey hair, by age band. */
  grey_by_age: { age_from: number; age_to: number; share: number }[];
  /** Share of people who wear glasses, by age band. */
  glasses_by_age: { age_from: number; age_to: number; share: number }[];
  /** Skin tone weights for 1 to 5 (a game parameter, not a measurement). */
  skin_tone_weights: number[];
  /** Chance a child takes a trait from a parent instead of drawing a new one. */
  resemblance: number;
}

/** What a life event changes. Amounts of money are in months of the person's income. */
export interface LifeEventEffects {
  marital?: MaritalStatus;
  children_add?: number;
  dependents_add?: number;
  debt_months?: number;
  savings_months?: number;
  health_add?: number;
  income_pct?: number;
}

export interface LifeEventHazard {
  age_from: number;
  age_to: number;
  /** Chance per year for someone this old who meets the requirements. */
  p: number;
}

/** A trait that raises or lowers the chance: above (or below) a level the chance is multiplied. */
export interface LifeEventModifier {
  axis: TemperamentAxis;
  above?: number;
  below?: number;
  mult: number;
}

export interface LifeEvent {
  id: string;
  name: BilingualText;
  tags: string[];
  hazard: LifeEventHazard[];
  requires?: {
    marital_in?: MaritalStatus[];
    min_children?: number;
    max_children?: number;
    gender_in?: Gender[];
  };
  modifiers?: LifeEventModifier[];
  effects: LifeEventEffects;
}

export interface PeopleLibrary {
  version: number;
  appearance: AppearanceLibrary;
  life_events: LifeEvent[];
  archetypes: Archetype[];
  quirks: Quirk[];
  names: NameLibrary;
  departments: DepartmentProfile[];
  tables: {
    region_weights: DataTable<{ region: Region; weight: number }>;
    settlement_by_region: DataTable<{ region: Region; urban_share: number }>;
    education_by_age: DataTable<
      {
        age_from: number;
        age_to: number;
        gender: Gender | 'any';
      } & Record<EducationLevel, number>
    >;
    marital_by_age: DataTable<
      {
        age_from: number;
        age_to: number;
        gender: Gender | 'any';
      } & Record<MaritalStatus, number>
    >;
    children_by_age: DataTable<{
      age_from: number;
      age_to: number;
      married_mean: number;
      other_mean: number;
    }>;
    hiring_paths: DataTable<{ path: HiringPath; weight: number }>;
    /** Share of boys among births (the sex ratio at birth, as a share). */
    birth_sex_ratio: DataTable<{ male_share: number }>;
    /** Mean age gap, husband minus wife, and its spread. */
    spouse_age_gap: DataTable<{ husband_older_mean: number; spread: number }>;
  };
}

/** Events of the people module (ADR 0003). */
export interface PersonCreatedPayload {
  person: Person;
}

export const PERSON_EVENTS = {
  requested: 'person.requested',
  created: 'person.created',
} as const;

/** A person drawn from the world stepped into a scene. Perception learns from it; the client ignores the traits. */
export interface GuestAppearedPayload {
  sceneId: string;
  slot: string;
  story_function: string;
  person: Person;
  /** For a fixed character: the name shown to the player (it is in the player's language, so only a label). */
  display_name?: string;
}

/** What the player now believes about one trait of one person: an estimate and how sure they are. */
export interface PerceptionUpdatedPayload {
  person_id: string;
  axis: TemperamentAxis;
  /** 0 to 100, the player's best guess. */
  estimate: number;
  /** 0 to 100: how much the player has seen to go on. */
  confidence: number;
  observations: number;
}

/** The player noticed one of a person's quirks. */
export interface QuirkNoticedPayload {
  person_id: string;
  quirk: string;
  /** The quirk's name in both languages, when the library is known to the module. */
  name?: BilingualText;
}

export const PERCEPTION_EVENTS = {
  guestAppeared: 'guest.appeared',
  updated: 'perception.updated',
  quirkNoticed: 'perception.quirkNoticed',
} as const;

/**
 * What a person does after a scene, from their own traits and how they now feel about the player (M3).
 * `reported` and `covers` happen out of sight; the player only sees their effects (a rumour, or nothing).
 */
export const PERSON_ACTIONS = ['reported', 'covers', 'badmouths', 'vouches'] as const;
export type PersonAction = (typeof PERSON_ACTIONS)[number];

export interface PersonActedPayload {
  person_id: string;
  /** Family, middle and given name; not language-dependent. */
  name: string;
  action: PersonAction;
  sceneId: string;
  /** Whether the player gets to know it happened (it is shown as a notice and in the people panel). */
  visible: boolean;
}

export const PERSON_ACTED = 'person.acted';
