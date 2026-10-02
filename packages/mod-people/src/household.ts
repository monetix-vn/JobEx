import { PERSON_VALUES, TEMPERAMENT_AXES } from '@je/contracts';
import type {
  Gender,
  PeopleLibrary,
  Person,
  PersonValue,
  Temperament,
  WeightedName,
} from '@je/contracts';
import { generationStream } from '@je/kernel';
import type { SeededStream } from '@je/kernel';
import { generatePerson, type GenerationContext } from './generate';

/** How strongly a child's temperament follows the parents' average (the rest regresses to 50 plus chance). */
export const HERITABILITY = 0.45;

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

function normal(s: SeededStream, mean: number, sd: number): number {
  const u1 = Math.max(1e-12, s.next());
  return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * s.next());
}

function pickWeighted<T>(s: SeededStream, items: readonly T[], weightOf: (item: T) => number): T {
  let total = 0;
  for (const item of items) total += Math.max(0, weightOf(item));
  let r = s.next() * total;
  for (const item of items) {
    r -= Math.max(0, weightOf(item));
    if (r <= 0) return item;
  }
  return items[items.length - 1] as T;
}

/** A child's temperament: regressed towards 50 from the parents' mean, plus the child's own variation. */
export function inheritTemperament(
  a: Temperament,
  b: Temperament,
  s: SeededStream,
  spread = 14,
): Temperament {
  const out = {} as Temperament;
  for (const axis of TEMPERAMENT_AXES) {
    const parents = (a[axis] + b[axis]) / 2;
    out[axis] = Math.round(clamp(normal(s, 50 + HERITABILITY * (parents - 50), spread), 0, 100));
  }
  return out;
}

function inheritValues(parentValues: readonly PersonValue[], s: SeededStream): PersonValue[] {
  const pool = [...PERSON_VALUES];
  const chosen: PersonValue[] = [];
  const count = s.chance(0.4) ? 3 : 2;
  for (let i = 0; i < count; i++) {
    const v = pickWeighted(s, pool, (value) => (parentValues.includes(value) ? 3 : 1));
    chosen.push(v);
    pool.splice(pool.indexOf(v), 1);
  }
  return chosen;
}

function weightedNameFor(s: SeededStream, list: readonly WeightedName[], older: boolean): string {
  return pickWeighted(s, list, (n) => n.weight * (older ? (n.older ?? 1) : (n.younger ?? 1))).name;
}

export interface Household {
  /** The person, with family links filled in. */
  person: Person;
  spouse?: Person;
  children: Person[];
  /** Parents who depend on the person's income (not every parent). */
  parents: Person[];
  /** Everyone, person first. */
  everyone: Person[];
}

const idOf = (person: Person, role: string, n: number): string => `${person.id}/${role}${n}`;

/**
 * Builds the household around a person from their own life state: a spouse when married or partnered
 * (age gap and mix from the data tables), the number of children the life state says, with ages that fit
 * the parent's age, sex ratio at birth, inherited temperament and values, and the father's family name;
 * and parents when dependents say someone is supported. Deterministic from the person's seed.
 */
export function generateHousehold(
  library: PeopleLibrary,
  person: Person,
  context: GenerationContext,
): Household {
  const stream = generationStream(context.seeds, 'household', person.id, person.seed);
  const age = person.origin.age_at_creation;
  const gap = library.tables.spouse_age_gap.rows[0]!;
  const maleShare = library.tables.birth_sex_ratio.rows[0]!.male_share;

  let spouse: Person | undefined;
  if (person.life.marital === 'married' || person.life.marital === 'partnered') {
    const spouseGender: Gender =
      person.origin.gender === 'male'
        ? 'female'
        : person.origin.gender === 'female'
          ? 'male'
          : stream.chance(0.5)
            ? 'male'
            : 'female';
    const olderBy =
      person.origin.gender === 'female' ? gap.husband_older_mean : -gap.husband_older_mean;
    const spouseAge = clamp(Math.round(normal(stream, age + olderBy, gap.spread)), 20, 75);
    const made = generatePerson(
      library,
      {
        department: 'external',
        age_range: [spouseAge, spouseAge],
        gender: spouseGender,
        event_id: `${person.id}/spouse`,
        counter: 0,
      },
      context,
    );
    spouse = {
      ...made,
      id: idOf(person, 'spouse', 0),
      origin: {
        ...made.origin,
        region: person.origin.region,
        settlement: person.origin.settlement,
      },
      life: {
        ...made.life,
        marital: person.life.marital,
        children: Math.min(
          person.life.children,
          Math.max(0, Math.floor((spouseAge - 18) / 2) + (spouseAge >= 30 ? 1 : 0)),
        ),
        housing: person.life.housing,
        dependents: Math.min(
          person.life.children,
          Math.max(0, Math.floor((spouseAge - 18) / 2) + (spouseAge >= 30 ? 1 : 0)),
        ),
      },
    };
  }

  const father =
    person.origin.gender === 'male'
      ? person
      : spouse?.origin.gender === 'male'
        ? spouse
        : undefined;
  const familyName = (father ?? person).origin.name.family;
  const other = spouse ?? person;

  const childAges = childAgesFor(person.life.children, age, stream);
  const children: Person[] = childAges.map((childAge, i) => {
    const gender: Gender = stream.chance(maleShare) ? 'male' : 'female';
    const older = 2026 - childAge < 1985;
    const parentA = person.origin;
    const parentB = other.origin;
    const given = weightedNameFor(stream, library.names.given[gender], older);
    const middle = weightedNameFor(stream, library.names.middle[gender], older);
    const inheritedQuirk = [...parentA.quirks, ...parentB.quirks].filter(() =>
      stream.chance(0.12),
    )[0];
    const quirkPool = library.quirks.filter((q) => q.id !== inheritedQuirk);
    const quirks = [
      ...(inheritedQuirk ? [inheritedQuirk] : []),
      pickWeighted(stream, quirkPool, (q) => q.weight).id,
    ].slice(0, 2);
    return {
      id: idOf(person, 'child', i),
      seed: person.seed + i + 1,
      created_turn: context.created_turn,
      controller: 'auto',
      origin: {
        gender,
        age_at_creation: childAge,
        region: person.origin.region,
        settlement: person.origin.settlement,
        education: 'in_school',
        hiring_path: 'applied_cold',
        temperament: inheritTemperament(parentA.temperament, parentB.temperament, stream),
        values: inheritValues([...parentA.values, ...parentB.values], stream),
        quirks: [...new Set(quirks)],
        archetype: stream.chance(0.5) ? parentA.archetype : parentB.archetype,
        name: { family: familyName, middle, given },
        voice: [],
      },
      life: {
        department: 'household',
        ladder_step: 0,
        tenure_years: 0,
        performance: 0,
        income_vnd: 0,
        debt_vnd: 0,
        savings_vnd: 0,
        marital: 'single',
        children: 0,
        dependents: 0,
        housing: person.life.housing,
        health: Math.round(clamp(normal(stream, 94, 4), 60, 100)),
      },
    };
  });

  const supportedParents = Math.max(0, person.life.dependents - person.life.children);
  const parents: Person[] = [];
  for (let i = 0; i < Math.min(2, supportedParents); i++) {
    const parentAge = clamp(Math.round(age + 24 + normal(stream, 0, 4)), age + 18, 90);
    const made = generatePerson(
      library,
      {
        department: 'external',
        age_range: [parentAge, parentAge],
        gender:
          i === 0
            ? stream.chance(0.7)
              ? 'female'
              : 'male'
            : parents[0]!.origin.gender === 'female'
              ? 'male'
              : 'female',
        event_id: `${person.id}/parent`,
        counter: i,
      },
      context,
    );
    parents.push({
      ...made,
      id: idOf(person, 'parent', i),
      origin: {
        ...made.origin,
        region: person.origin.region,
        settlement: person.origin.settlement,
        name: {
          ...made.origin.name,
          family:
            i === 0 && made.origin.gender === 'male'
              ? person.origin.name.family
              : made.origin.name.family,
        },
      },
      life: {
        ...made.life,
        department: 'retired',
        income_vnd: Math.max(0, Math.round(made.life.income_vnd * 0.3)),
        housing: 'with_family',
      },
    });
  }

  const linked: Person = {
    ...person,
    family: {
      ...(spouse ? { spouse: spouse.id } : {}),
      children: children.map((c) => c.id),
      parents: parents.map((p) => p.id),
    },
  };
  const everyone = [linked, ...(spouse ? [spouse] : []), ...children, ...parents];
  return { person: linked, ...(spouse ? { spouse } : {}), children, parents, everyone };
}

/** Child ages that fit a parent of the given age: spaced two or three years apart, the eldest not older than parent-20. */
function childAgesFor(count: number, parentAge: number, s: SeededStream): number[] {
  if (count <= 0) return [];
  const oldest = Math.max(0, parentAge - 20);
  const ages: number[] = [];
  let age = Math.min(
    oldest,
    Math.max(0, Math.round(normal(s, Math.min(oldest, (parentAge - 20) * 0.55), 3))),
  );
  for (let i = 0; i < count; i++) {
    ages.push(Math.max(0, age));
    age = Math.max(0, age - (2 + Math.floor(s.next() * 3)));
  }
  return ages.sort((a, b) => b - a);
}
