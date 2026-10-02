import { EDUCATION_LEVELS, MARITAL_STATUSES, TEMPERAMENT_AXES } from '@je/contracts';
import type { Person } from '@je/contracts';
import { moneyPressure } from './generate';

export interface PeopleSummary {
  count: number;
  female_share: number;
  non_binary_share: number;
  age_mean: number;
  age_sd: number;
  education: Record<string, number>;
  marital: Record<string, number>;
  /** Married share by age band (18-24, 25-34, 35-44, 45-54, 55+), for the real-world comparison. */
  married_by_band: Record<string, number>;
  children_mean: number;
  dependents_mean: number;
  money_pressure_mean: number;
  temperament_mean: Record<string, number>;
  temperament_sd: Record<string, number>;
  archetypes: Record<string, number>;
  quirks: Record<string, number>;
  names_distinct: number;
}

const mean = (xs: readonly number[]): number =>
  xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs: readonly number[]): number => {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};
const share = (
  people: readonly Person[],
  pick: (p: Person) => string,
  keys: readonly string[],
): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const k of keys) out[k] = 0;
  for (const p of people) out[pick(p)] = (out[pick(p)] ?? 0) + 1;
  for (const k of Object.keys(out)) out[k] = (out[k] ?? 0) / Math.max(1, people.length);
  return out;
};
const band = (age: number): string =>
  age < 25 ? '18-24' : age < 35 ? '25-34' : age < 45 ? '35-44' : age < 55 ? '45-54' : '55+';

/** Distributions of a generated group, used by the workbench and the distribution tests. */
export function summarisePeople(people: readonly Person[]): PeopleSummary {
  const ages = people.map((p) => p.origin.age_at_creation);
  const married: Record<string, number> = {};
  const total: Record<string, number> = {};
  for (const p of people) {
    const b = band(p.origin.age_at_creation);
    total[b] = (total[b] ?? 0) + 1;
    if (p.life.marital === 'married') married[b] = (married[b] ?? 0) + 1;
  }
  const archetypes = share(people, (p) => p.origin.archetype, []);
  const quirks: Record<string, number> = {};
  for (const p of people)
    for (const q of p.origin.quirks) quirks[q] = (quirks[q] ?? 0) + 1 / Math.max(1, people.length);
  const tm: Record<string, number> = {};
  const ts: Record<string, number> = {};
  for (const axis of TEMPERAMENT_AXES) {
    const xs = people.map((p) => p.origin.temperament[axis]);
    tm[axis] = mean(xs);
    ts[axis] = sd(xs);
  }
  return {
    count: people.length,
    female_share:
      people.filter((p) => p.origin.gender === 'female').length / Math.max(1, people.length),
    non_binary_share:
      people.filter((p) => p.origin.gender === 'non_binary').length / Math.max(1, people.length),
    age_mean: mean(ages),
    age_sd: sd(ages),
    education: share(people, (p) => p.origin.education, EDUCATION_LEVELS),
    marital: share(people, (p) => p.life.marital, MARITAL_STATUSES),
    married_by_band: Object.fromEntries(
      Object.keys(total).map((b) => [b, (married[b] ?? 0) / (total[b] ?? 1)]),
    ),
    children_mean: mean(people.map((p) => p.life.children)),
    dependents_mean: mean(people.map((p) => p.life.dependents)),
    money_pressure_mean: mean(people.map((p) => moneyPressure(p.life))),
    temperament_mean: tm,
    temperament_sd: ts,
    archetypes,
    quirks,
    names_distinct: new Set(
      people.map((p) => `${p.origin.name.family} ${p.origin.name.middle} ${p.origin.name.given}`),
    ).size,
  };
}
