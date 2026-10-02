import type {
  DependentKind,
  EducationLevel,
  Experience,
  HiringPath,
  MoneySituation,
  PlayerProfile,
  StartAdjustments,
} from '@je/contracts';

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

const EDUCATION_SKILL: Record<EducationLevel, number> = {
  lower_secondary: -6,
  upper_secondary: -4,
  vocational: -2,
  college: 0,
  university: 3,
  postgraduate: 5,
};
const EXPERIENCE_SKILL: Record<Experience, number> = {
  none: -6,
  some: 0,
  veteran: 8,
  switcher: -3,
};
const EXPERIENCE_BACKBONE: Record<Experience, number> = {
  none: -2,
  some: 0,
  veteran: 4,
  switcher: 6,
};
const MONEY_STRESS: Record<MoneySituation, number> = {
  comfortable: 0,
  tight: 2,
  in_debt: 5,
  sending_home: 3,
};
const MONEY_PRESSURE: Record<MoneySituation, number> = {
  comfortable: 15,
  tight: 35,
  in_debt: 60,
  sending_home: 45,
};
const DEPENDENT_COUNT: Record<DependentKind, number> = {
  none: 0,
  partner: 1,
  children: 2,
  parents: 2,
  several: 4,
};
const DEPENDENT_STRESS: Record<DependentKind, number> = {
  none: 0,
  partner: 1,
  children: 3,
  parents: 3,
  several: 5,
};
const DEPENDENT_PRESSURE: Record<DependentKind, number> = {
  none: 0,
  partner: 5,
  children: 15,
  parents: 12,
  several: 25,
};
const HIRING_BOSS_TRUST: Record<HiringPath, number> = {
  applied_cold: 0,
  internal_transfer: 2,
  recommended: 4,
  owner_relative: 6,
};
const HIRING_STAFF_TRUST: Record<HiringPath, number> = {
  applied_cold: 0,
  internal_transfer: 0,
  recommended: 0,
  owner_relative: -4,
};

/** Age shapes standing and nerve, not ability: the same skills, a different place in the workplace. */
function ageBackbone(age: number): number {
  return age < 25 ? -4 : age < 35 ? 0 : age < 45 ? 4 : 8;
}

/**
 * What a player profile does at the start of a run. Deterministic and small on purpose: who you are changes
 * your pressures (stress, money pressure, standing) and your starting skills a little, never your worth.
 * Gender changes nothing here (it will choose forms of address in the text and the optional workplace scenes).
 */
export function profileEffects(profile: PlayerProfile): StartAdjustments {
  const moneyPressure = clamp(
    MONEY_PRESSURE[profile.money] + DEPENDENT_PRESSURE[profile.dependents],
    0,
    100,
  );
  return {
    set: {
      'player.name': profile.name.trim().slice(0, 40) || 'You',
      'profile.age': clamp(Math.round(profile.age), 18, 70),
      'profile.dependents': DEPENDENT_COUNT[profile.dependents],
      'profile.in_debt': profile.money === 'in_debt' ? 1 : 0,
      'profile.money_pressure': moneyPressure,
    },
    add: {
      'player.stress': MONEY_STRESS[profile.money] + DEPENDENT_STRESS[profile.dependents],
      'skill.backbone': ageBackbone(profile.age) + EXPERIENCE_BACKBONE[profile.experience],
      'player.rep.boss': HIRING_BOSS_TRUST[profile.hiring_path],
      'player.rep.staff': HIRING_STAFF_TRUST[profile.hiring_path],
    },
    skill_all: EDUCATION_SKILL[profile.education] + EXPERIENCE_SKILL[profile.experience],
  };
}
