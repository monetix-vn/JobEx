import type { EducationLevel, Gender, HiringPath } from './people';

/** The player's profile (docs/design/PROFILE-AND-TIME.md): who they are and what is at stake at home. */
export const EXPERIENCES = ['none', 'some', 'veteran', 'switcher'] as const;
export type Experience = (typeof EXPERIENCES)[number];

export const MONEY_SITUATIONS = ['comfortable', 'tight', 'in_debt', 'sending_home'] as const;
export type MoneySituation = (typeof MONEY_SITUATIONS)[number];

export const DEPENDENT_KINDS = ['none', 'partner', 'children', 'parents', 'several'] as const;
export type DependentKind = (typeof DEPENDENT_KINDS)[number];

export interface PlayerProfile {
  name: string;
  age: number;
  gender: Gender;
  education: EducationLevel;
  experience: Experience;
  money: MoneySituation;
  dependents: DependentKind;
  hiring_path: HiringPath;
  /** The quick-start persona this came from, if any. */
  persona?: string;
}

export const PERSONA_IDS = [
  'fresh_graduate',
  'parent',
  'career_switcher',
  'owner_relative',
] as const;
export type PersonaId = (typeof PERSONA_IDS)[number];

/** Ready-made players for first-time play and classrooms. The name is left for the player to type. */
export const PERSONAS: Record<PersonaId, Omit<PlayerProfile, 'name'>> = {
  fresh_graduate: {
    age: 23,
    gender: 'female',
    education: 'university',
    experience: 'none',
    money: 'sending_home',
    dependents: 'none',
    hiring_path: 'applied_cold',
    persona: 'fresh_graduate',
  },
  parent: {
    age: 36,
    gender: 'male',
    education: 'college',
    experience: 'some',
    money: 'tight',
    dependents: 'children',
    hiring_path: 'recommended',
    persona: 'parent',
  },
  career_switcher: {
    age: 41,
    gender: 'female',
    education: 'university',
    experience: 'switcher',
    money: 'comfortable',
    dependents: 'partner',
    hiring_path: 'applied_cold',
    persona: 'career_switcher',
  },
  owner_relative: {
    age: 28,
    gender: 'male',
    education: 'university',
    experience: 'some',
    money: 'comfortable',
    dependents: 'none',
    hiring_path: 'owner_relative',
    persona: 'owner_relative',
  },
};

/**
 * What a profile changes at the start of a run: variables to set, amounts to add, and one amount added to
 * every job skill the role defines. Computed by `profileEffects` in `mod-people`; applied by sim-core.
 */
export interface StartAdjustments {
  set: Record<string, number | string>;
  add: Record<string, number>;
  skill_all: number;
}
