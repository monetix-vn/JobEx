import type { BilingualText, LoreEntry, PeopleLibrary, Person, WorldSeeds } from '@je/contracts';
import { generationStream } from '@je/kernel';
import { generatePerson } from './generate';

/**
 * The career ladder every department shares (IDENTITY-ENGINE 7). The numbers are first drafts, not data from a
 * source: a practitioner should review the steps, the tenure and the shares before anyone calls them realistic.
 */
export interface LadderStep {
  id: string;
  name: BilingualText;
  /** Years in the job before a person can be considered for this step. */
  min_tenure: number;
  /** Performance (0 to 100) a person needs to be considered for this step. */
  min_performance: number;
  /** Pay at this step compared with the first step. */
  income_mult: number;
  /** Share of a department's people this step has room for. */
  share: number;
}

export const LADDER: readonly LadderStep[] = [
  {
    id: 'staff',
    name: { en: 'Staff', vi: 'Nhân viên' },
    min_tenure: 0,
    min_performance: 0,
    income_mult: 1,
    share: 0.55,
  },
  {
    id: 'senior',
    name: { en: 'Senior', vi: 'Chuyên viên chính' },
    min_tenure: 2,
    min_performance: 55,
    income_mult: 1.25,
    share: 0.25,
  },
  {
    id: 'lead',
    name: { en: 'Team lead', vi: 'Trưởng nhóm' },
    min_tenure: 4,
    min_performance: 62,
    income_mult: 1.6,
    share: 0.12,
  },
  {
    id: 'manager',
    name: { en: 'Manager', vi: 'Trưởng phòng' },
    min_tenure: 7,
    min_performance: 68,
    income_mult: 2.2,
    share: 0.06,
  },
  {
    id: 'head',
    name: { en: 'Head of department', vi: 'Giám đốc bộ phận' },
    min_tenure: 10,
    min_performance: 72,
    income_mult: 3,
    share: 0.02,
  },
];

/** Departments with no career of their own in this world (outsiders, households, the retired). */
const NO_LADDER = new Set(['external', 'household', 'retired']);

/** The name of a step in a language; an unknown step falls back to the last one. */
export function stepName(step: number, locale: 'en' | 'vi'): string {
  return (LADDER[Math.min(Math.max(0, step), LADDER.length - 1)] as LadderStep).name[locale];
}

/** How many people a step has room for in a department of this size. Steps 0 to 2 always have room for one. */
export function capacityOf(step: number, headcount: number): number {
  const s = LADDER[step];
  if (!s) return 0;
  return Math.max(step <= 2 ? 1 : 0, Math.round(headcount * s.share));
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const fullName = (p: Person): string =>
  [p.origin.name.family, p.origin.name.middle, p.origin.name.given].filter(Boolean).join(' ');
const ageIn = (p: Person, year: number): number =>
  p.origin.age_at_creation + Math.max(0, year - (p.created_year ?? 0));
const isActive = (p: Person): boolean => p.status !== 'retired' && p.status !== 'gone';

export interface LadderResult {
  people: Person[];
  lore: LoreEntry[];
}

/**
 * One year of careers for everyone in a world. Everybody is judged by the same function: performance drifts with
 * temperament and chance, and each department fills its vacancies from the step below, best score first (performance,
 * ambition, tenure and a seeded dash of luck, who knows whom). A promotion frees the step it came from, so vacancies chain
 * downwards. Someone ambitious who is passed over may leave, and everyone who leaves or retires is replaced by a new hire.
 */
export function reviewLadder(
  library: PeopleLibrary,
  input: readonly Person[],
  year: number,
  seeds: WorldSeeds,
  retiredThisYear: readonly Person[] = [],
): LadderResult {
  const lore: LoreEntry[] = [];
  const byId = new Map(input.map((p) => [p.id, p]));
  const departments = [...new Set(input.map((p) => p.life.department))]
    .filter((d) => !NO_LADDER.has(d))
    .sort();
  const hires: Person[] = [];

  for (const department of departments) {
    const stream = generationStream(seeds, 'ladder', department, year);
    const members = (): Person[] =>
      [...byId.values()].filter((p) => p.life.department === department && isActive(p));

    // Yearly drift in tenure and performance, for everyone, in id order.
    const start = members().length;
    for (const p of members().sort((a, b) => (a.id < b.id ? -1 : 1))) {
      const t = p.origin.temperament;
      const drift =
        (t.resilience - 50) / 25 +
        (t.caution - 50) / 40 +
        (stream.next() - 0.5) * 8 +
        (60 - p.life.performance) / 15;
      byId.set(p.id, {
        ...p,
        life: {
          ...p.life,
          tenure_years: p.life.tenure_years + 1,
          performance: clamp(Math.round(p.life.performance + drift), 20, 98),
        },
      });
    }

    // Vacancies are filled from the top: a promotion frees the step below for the next round.
    for (let step = LADDER.length - 1; step >= 1; step--) {
      const rung = LADDER[step] as LadderStep;
      const now = members();
      const vacancies =
        capacityOf(step, now.length) - now.filter((p) => p.life.ladder_step === step).length;
      if (vacancies <= 0) continue;
      const scored = now
        .filter(
          (p) =>
            p.life.ladder_step === step - 1 &&
            p.life.tenure_years >= rung.min_tenure &&
            p.life.performance >= rung.min_performance &&
            ageIn(p, year) <= 60,
        )
        .map((p) => ({
          p,
          score:
            p.life.performance * 0.5 +
            p.origin.temperament.ambition * 0.35 +
            p.life.tenure_years * 1.5 +
            stream.next() * 10,
        }))
        .sort((a, b) => b.score - a.score || (a.p.id < b.p.id ? -1 : 1));
      const chosen = scored.slice(0, vacancies);
      for (const { p } of chosen) {
        const before = LADDER[p.life.ladder_step] as LadderStep;
        byId.set(p.id, {
          ...p,
          life: {
            ...p.life,
            ladder_step: step,
            income_vnd:
              Math.round((p.life.income_vnd * rung.income_mult) / before.income_mult / 100_000) *
              100_000,
          },
        });
        const who = fullName(p);
        lore.push({
          year,
          kind: 'promotion',
          person: p.id,
          en: `${who} was promoted to ${rung.name.en} in ${department.replace(/_/g, ' ')}.`,
          vi: `${who} được thăng chức ${rung.name.vi} ở bộ phận ${department.replace(/_/g, ' ')}.`,
        });
      }
      // The best of those passed over feels it; an ambitious one may leave, which opens a place below.
      const runnerUp = scored[vacancies];
      if (runnerUp && runnerUp.p.origin.temperament.ambition >= 60) {
        const who = fullName(runnerUp.p);
        const leaves = runnerUp.p.origin.temperament.ambition >= 70 && stream.next() < 0.35;
        if (leaves) {
          byId.set(runnerUp.p.id, { ...runnerUp.p, status: 'gone' });
          lore.push({
            year,
            kind: 'left',
            person: runnerUp.p.id,
            en: `${who} was passed over for ${rung.name.en} and left for another company.`,
            vi: `${who} không được chọn làm ${rung.name.vi} và chuyển sang công ty khác.`,
          });
        } else {
          lore.push({
            year,
            kind: 'passed_over',
            person: runnerUp.p.id,
            en: `${who} was passed over for ${rung.name.en}.`,
            vi: `${who} không được chọn làm ${rung.name.vi}.`,
          });
        }
      }
    }

    // Replace everyone who left or retired, so a department keeps its size.
    const missing = Math.max(
      0,
      start -
        members().length +
        retiredThisYear.filter((p) => p.life.department === department).length,
    );
    for (let k = 0; k < missing; k++) {
      const hire = generatePerson(
        library,
        { department, age_range: [22, 32], event_id: `hire.y${year}.${department}`, counter: k },
        { seeds, created_turn: 0 },
      );
      const person: Person = {
        ...hire,
        created_year: year,
        life: { ...hire.life, ladder_step: 0, tenure_years: 0 },
      };
      hires.push(person);
      lore.push({
        year,
        kind: 'hired',
        person: person.id,
        en: `${fullName(person)} joined ${department.replace(/_/g, ' ')}.`,
        vi: `${fullName(person)} vào làm ở bộ phận ${department.replace(/_/g, ' ')}.`,
      });
    }
  }

  return { people: [...input.map((p) => byId.get(p.id) as Person), ...hires], lore };
}
