import type {
  LifeEvent,
  LifeEventModifier,
  PeopleLibrary,
  Person,
  PersonLife,
} from '@je/contracts';
import type { SeededStream } from '@je/kernel';
import { violations } from './generate';

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

function modifierFactor(
  person: Person,
  modifiers: readonly LifeEventModifier[] | undefined,
): number {
  let factor = 1;
  for (const m of modifiers ?? []) {
    const value = person.origin.temperament[m.axis];
    if ((m.above !== undefined && value > m.above) || (m.below !== undefined && value < m.below)) {
      factor *= m.mult;
    }
  }
  return factor;
}

function meetsRequirements(person: Person, event: LifeEvent): boolean {
  const r = event.requires;
  if (!r) return true;
  if (r.marital_in && !r.marital_in.includes(person.life.marital)) return false;
  if (r.min_children !== undefined && person.life.children < r.min_children) return false;
  if (r.max_children !== undefined && person.life.children > r.max_children) return false;
  if (r.gender_in && !r.gender_in.includes(person.origin.gender)) return false;
  return true;
}

/** The chance this year of each life event that could happen to this person now, after age, state and traits. */
export function lifeEventChances(
  library: PeopleLibrary,
  person: Person,
  age: number = person.origin.age_at_creation,
): { id: string; p: number }[] {
  const out: { id: string; p: number }[] = [];
  for (const event of library.life_events) {
    if (!meetsRequirements(person, event)) continue;
    const row = event.hazard.find((h) => h.age_from <= age && age <= h.age_to);
    if (!row) continue;
    out.push({ id: event.id, p: clamp(row.p * modifierFactor(person, event.modifiers), 0, 0.95) });
  }
  return out;
}

const round = (v: number, step: number): number => Math.round(v / step) * step;

/** The person after a life event: a new object; the old one is not touched. */
export function applyLifeEvent(person: Person, event: LifeEvent): Person {
  const e = event.effects;
  const l: PersonLife = { ...person.life };
  const income = Math.max(1, l.income_vnd);
  if (e.marital) l.marital = e.marital;
  if (e.children_add) l.children = clamp(l.children + e.children_add, 0, 8);
  if (e.dependents_add) l.dependents = l.dependents + e.dependents_add;
  l.dependents = Math.max(l.children, l.dependents);
  if (e.debt_months)
    l.debt_vnd = Math.max(0, round(l.debt_vnd + e.debt_months * income, 1_000_000));
  if (e.savings_months)
    l.savings_vnd = Math.max(0, round(l.savings_vnd + e.savings_months * income, 1_000_000));
  if (e.health_add) l.health = clamp(Math.round(l.health + e.health_add), 5, 100);
  if (e.income_pct)
    l.income_vnd = Math.max(3_000_000, round(l.income_vnd * (1 + e.income_pct / 100), 100_000));
  return { ...person, life: l };
}

export interface YearResult {
  person: Person;
  /** The ids of the events that happened, in the order they were applied. */
  events: string[];
}

/**
 * One year of life for one person: each possible event is drawn once, in library order, from the given
 * stream; after each event the requirements are checked again (someone cannot marry and divorce in the same
 * year). The result is validated; an event that would make the person contradictory is skipped.
 */
export function liveOneYear(
  library: PeopleLibrary,
  person: Person,
  age: number,
  stream: SeededStream,
): YearResult {
  let current = person;
  const events: string[] = [];
  for (const event of library.life_events) {
    const chance = lifeEventChances(library, current, age).find((c) => c.id === event.id);
    if (!chance || stream.next() >= chance.p) continue;
    const next = applyLifeEvent(current, event);
    if (violations({ ...next, origin: { ...next.origin, age_at_creation: age } }).length > 0)
      continue;
    current = next;
    events.push(event.id);
  }
  return { person: current, events };
}
