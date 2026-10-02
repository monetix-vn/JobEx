import { EDUCATION_LEVELS, GENDERS, TEMPERAMENT_AXES } from '@je/contracts';
import type {
  Archetype,
  DepartmentProfile,
  EducationLevel,
  Gender,
  HiringPath,
  Housing,
  MaritalStatus,
  PeopleLibrary,
  Person,
  PersonRequest,
  PersonValue,
  Quirk,
  Region,
  Temperament,
  WeightedName,
  WorldSeeds,
} from '@je/contracts';
import { PERSON_VALUES } from '@je/contracts';
import { deriveSeed, generationStream } from '@je/kernel';
import { drawAppearance } from './appearance';
import type { SeededStream } from '@je/kernel';

export interface GeneratorOptions {
  /** Share of non-binary people when the request does not fix a gender. Default 0 (no reliable data). */
  non_binary_rate?: number;
  /** Year used to decide whether a name leans older or younger. Default 2026. */
  current_year?: number;
}

export interface GenerationContext {
  seeds: WorldSeeds;
  created_turn: number;
  options?: GeneratorOptions;
}

const MAX_ATTEMPTS = 24;
const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const round = (v: number): number => Math.round(v);

/** Box-Muller normal draw from a uniform stream. */
function normal(s: SeededStream, mean: number, sd: number): number {
  const u1 = Math.max(1e-12, s.next());
  const u2 = s.next();
  return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function pickWeighted<T>(s: SeededStream, items: readonly T[], weightOf: (item: T) => number): T {
  let total = 0;
  for (const item of items) total += Math.max(0, weightOf(item));
  if (total <= 0) return s.pick(items);
  let r = s.next() * total;
  for (const item of items) {
    r -= Math.max(0, weightOf(item));
    if (r <= 0) return item;
  }
  return items[items.length - 1] as T;
}

function poisson(s: SeededStream, mean: number): number {
  if (mean <= 0) return 0;
  const limit = Math.exp(-mean);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= s.next();
  } while (p > limit && k < 12);
  return k - 1;
}

function lognormal(s: SeededStream, median: number, sigma: number): number {
  return median * Math.exp(normal(s, 0, sigma));
}

const bandRow = <R extends { age_from: number; age_to: number; gender?: string }>(
  rows: readonly R[],
  age: number,
  gender: Gender,
): R => {
  const fits = (r: R): boolean => r.age_from <= age && age <= r.age_to;
  const exact = rows.find((r) => fits(r) && r.gender === gender);
  const any = rows.find((r) => fits(r) && (r.gender === 'any' || r.gender === undefined));
  const nearest = [...rows].sort(
    (a, b) => Math.abs(a.age_from - age) - Math.abs(b.age_from - age),
  )[0] as R;
  return exact ?? any ?? nearest;
};

/** What this person worries about with money: 0 (comfortable) to 100 (cornered). Pure function of life state. */
export function moneyPressure(life: Person['life']): number {
  const income = Math.max(1, life.income_vnd);
  const debtMonths = life.debt_vnd / income;
  const savingsMonths = life.savings_vnd / income;
  const raw = 18 + debtMonths * 2.2 + life.dependents * 9 - savingsMonths * 2.5;
  return clamp(round(raw), 0, 100);
}

/**
 * Draws one person. The same seeds, event id and counter always give the same person (ADR 0003). A draw
 * that contradicts itself is thrown away and the next sub-seed is tried, up to a limit, so the result is
 * always valid.
 */
export function generatePerson(
  library: PeopleLibrary,
  request: PersonRequest,
  context: GenerationContext,
): Person {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const stream = generationStream(
      context.seeds,
      'person',
      request.event_id,
      request.counter * 1000 + attempt,
    );
    const person = draw(library, request, context, stream, attempt);
    if (violations(person).length === 0) return person;
  }
  throw new Error(`could not generate a valid person for ${request.event_id} #${request.counter}`);
}

function draw(
  library: PeopleLibrary,
  request: PersonRequest,
  context: GenerationContext,
  s: SeededStream,
  attempt: number,
): Person {
  const department = library.departments.find((d) => d.department === request.department);
  if (!department) throw new Error(`unknown department "${request.department}"`);
  const options = context.options ?? {};

  const gender = pickGender(s, department, request, options);
  const age = pickAge(s, department, request);
  const birthYear = (options.current_year ?? 2026) - age;
  const region = pickWeighted(s, library.tables.region_weights.rows, (r) => r.weight)
    .region as Region;
  const urbanShare =
    library.tables.settlement_by_region.rows.find((r) => r.region === region)?.urban_share ?? 0.37;
  const settlement = s.chance(urbanShare) ? 'urban' : 'rural';
  const education = pickEducation(s, library, department, age, gender);
  const hiringPath: HiringPath =
    request.hiring_path ??
    (pickWeighted(s, library.tables.hiring_paths.rows, (r) => r.weight).path as HiringPath);

  const archetype = pickWeighted(
    s,
    library.archetypes,
    (a) =>
      a.weight * (request.story_function ? (a.function_bias?.[request.story_function] ?? 1) : 1),
  );
  const values = pickValues(s, archetype);
  const quirks = pickQuirks(s, library.quirks, archetype);
  const temperament = drawTemperament(s, archetype, quirks, library.quirks);

  const name = pickName(s, library, gender, birthYear);
  const voice = [
    ...new Set([
      ...(archetype.voice ?? []),
      ...quirks.flatMap((id) => library.quirks.find((q) => q.id === id)?.voice ?? []),
    ]),
  ].slice(0, 5);

  const life = drawLife(s, library, department, {
    age,
    gender,
    education,
    region,
    settlement,
    quirks,
  });

  const seed = deriveSeed(
    context.seeds.world_seed,
    context.seeds.run_seed,
    'person',
    request.event_id,
    request.counter * 1000 + attempt,
  );
  const id = `person.${request.event_id}#${request.counter}`;
  return {
    id,
    seed,
    created_turn: context.created_turn,
    controller: 'auto',
    origin: {
      gender,
      age_at_creation: age,
      region,
      settlement,
      education,
      hiring_path: hiringPath,
      temperament,
      values,
      quirks,
      archetype: archetype.id,
      name,
      voice,
    },
    life,
    appearance: drawAppearance(library.appearance, { id, gender, age }, context.seeds),
  };
}

function pickGender(
  s: SeededStream,
  d: DepartmentProfile,
  request: PersonRequest,
  options: GeneratorOptions,
): Gender {
  if (request.gender) return request.gender;
  const nb = options.non_binary_rate ?? 0;
  if (nb > 0 && s.chance(nb)) return 'non_binary';
  return s.chance(d.female_share) ? 'female' : 'male';
}

function pickAge(s: SeededStream, d: DepartmentProfile, request: PersonRequest): number {
  let lo = d.age_min;
  let hi = d.age_max;
  if (request.age_range) {
    const [from, to] = request.age_range;
    if (Math.max(lo, from) <= Math.min(hi, to)) {
      lo = Math.max(lo, from);
      hi = Math.min(hi, to);
    } else {
      lo = from;
      hi = to;
    }
  }
  for (let i = 0; i < 16; i++) {
    const age = round(normal(s, d.age_mean, d.age_sd));
    if (age >= lo && age <= hi) return age;
  }
  return round(clamp(d.age_mean, lo, hi));
}

function pickEducation(
  s: SeededStream,
  library: PeopleLibrary,
  d: DepartmentProfile,
  age: number,
  gender: Gender,
): EducationLevel {
  const row = bandRow(library.tables.education_by_age.rows, age, gender);
  const floor = EDUCATION_LEVELS.indexOf(d.min_education);
  const allowed = EDUCATION_LEVELS.filter((_, i) => i >= floor);
  return pickWeighted(
    s,
    allowed,
    (level) => (row as unknown as Record<string, number>)[level] ?? 0,
  );
}

function pickValues(s: SeededStream, archetype: Archetype): PersonValue[] {
  const pool = [...PERSON_VALUES];
  const count = s.chance(0.4) ? 3 : 2;
  const chosen: PersonValue[] = [];
  for (let i = 0; i < count; i++) {
    const v = pickWeighted(s, pool, (value) => archetype.value_affinity?.[value] ?? 1);
    chosen.push(v);
    pool.splice(pool.indexOf(v), 1);
  }
  return chosen;
}

function pickQuirks(s: SeededStream, quirks: readonly Quirk[], archetype: Archetype): string[] {
  const count = s.chance(0.3) ? 3 : 2;
  const chosen: Quirk[] = [];
  for (let i = 0; i < count; i++) {
    const pool = quirks.filter(
      (q) =>
        !chosen.includes(q) &&
        !chosen.some(
          (c) => c.incompatible_with?.includes(q.id) || q.incompatible_with?.includes(c.id),
        ),
    );
    if (pool.length === 0) break;
    chosen.push(pickWeighted(s, pool, (q) => q.weight * (archetype.quirk_affinity?.[q.id] ?? 1)));
  }
  return chosen.map((q) => q.id);
}

function drawTemperament(
  s: SeededStream,
  archetype: Archetype,
  quirkIds: readonly string[],
  quirks: readonly Quirk[],
): Temperament {
  const out = {} as Temperament;
  for (const axis of TEMPERAMENT_AXES) {
    const [mean, sd] = archetype.temperament[axis] ?? [50, 18];
    let value = normal(s, mean, sd);
    for (const id of quirkIds)
      value += quirks.find((q) => q.id === id)?.temperament_shift?.[axis] ?? 0;
    out[axis] = round(clamp(value, 0, 100));
  }
  return out;
}

function weightedNameFor(s: SeededStream, list: readonly WeightedName[], older: boolean): string {
  return pickWeighted(s, list, (n) => n.weight * (older ? (n.older ?? 1) : (n.younger ?? 1))).name;
}

function pickName(
  s: SeededStream,
  library: PeopleLibrary,
  gender: Gender,
  birthYear: number,
): Person['origin']['name'] {
  const older = birthYear < 1985;
  const family = pickWeighted(s, library.names.family, (n) => n.weight).name;
  const noMiddle = s.chance(0.06);
  const middle = noMiddle ? '' : weightedNameFor(s, library.names.middle[gender], older);
  const given = weightedNameFor(s, library.names.given[gender], older);
  return { family, middle, given };
}

interface LifeContext {
  age: number;
  gender: Gender;
  education: EducationLevel;
  region: Region;
  settlement: 'rural' | 'urban';
  quirks: readonly string[];
}

function drawLife(
  s: SeededStream,
  library: PeopleLibrary,
  d: DepartmentProfile,
  c: LifeContext,
): Person['life'] {
  const maxTenure = Math.max(0, c.age - 18);
  const tenure = clamp(round(normal(s, Math.max(0, (c.age - 22) * 0.45), 3)), 0, maxTenure);
  const step = clamp(round((c.age - 22) / 6 + normal(s, 0, 0.8)), 0, 4);
  const eduFactor = {
    lower_secondary: 0.9,
    upper_secondary: 0.95,
    vocational: 1,
    college: 1,
    university: 1.1,
    postgraduate: 1.25,
  }[c.education];
  const income =
    round(lognormal(s, d.income_base_vnd * (1 + 0.28 * step) * eduFactor, 0.12) / 100000) * 100000;

  const marRow = bandRow(
    library.tables.marital_by_age.rows,
    c.age,
    c.gender === 'non_binary' ? 'female' : c.gender,
  );
  const marital = pickWeighted(
    s,
    ['single', 'partnered', 'married', 'divorced', 'widowed'] as MaritalStatus[],
    (m) => (marRow as unknown as Record<string, number>)[m] ?? 0,
  );
  const childRow = bandRow(library.tables.children_by_age.rows, c.age, 'female');
  const mean = marital === 'married' ? childRow.married_mean : childRow.other_mean;
  const children = marital === 'single' && c.age < 22 ? 0 : clamp(poisson(s, mean), 0, 5);
  const parentsDepend =
    c.age >= 33 &&
    (c.settlement === 'rural' || c.quirks.includes('sends_money_home')) &&
    s.chance(0.35)
      ? 1 + (s.chance(0.3) ? 1 : 0)
      : 0;
  const homeSupport = c.quirks.includes('sends_money_home') && parentsDepend === 0 ? 1 : 0;
  const dependents = children + parentsDepend + homeSupport;

  const housing = pickHousing(s, c.age, marital);
  const debtChance = clamp(
    0.3 + (housing === 'own' ? 0.35 : 0) + (c.quirks.includes('gambles_a_little') ? 0.25 : 0),
    0,
    0.9,
  );
  const debt = s.chance(debtChance)
    ? round(lognormal(s, income * (housing === 'own' ? 36 : 6), 0.6) / 1000000) * 1000000
    : 0;
  const savings =
    round(lognormal(s, income * clamp(1 + tenure * 0.25, 1, 8), 0.7) / 1000000) * 1000000;
  const health = round(clamp(normal(s, 86 - Math.max(0, c.age - 40) * 0.6, 7), 30, 100));
  const performance = round(clamp(normal(s, 60, 12), 20, 98));

  return {
    department: d.department,
    ladder_step: step,
    tenure_years: tenure,
    performance,
    income_vnd: Math.max(3000000, income),
    debt_vnd: debt,
    savings_vnd: savings,
    marital,
    children,
    dependents,
    housing,
    health,
  };
}

function pickHousing(s: SeededStream, age: number, marital: MaritalStatus): Housing {
  const settled = (marital === 'married' || marital === 'partnered') && age > 32;
  const table: [Housing, number][] = settled
    ? [
        ['own', 0.45],
        ['rent', 0.45],
        ['with_family', 0.1],
      ]
    : age < 28 && marital === 'single'
      ? [
          ['with_family', 0.55],
          ['rent', 0.45],
          ['own', 0],
        ]
      : [
          ['rent', 0.6],
          ['own', 0.25],
          ['with_family', 0.15],
        ];
  return pickWeighted(s, table, (x) => x[1])[0];
}

/** Reasons a draw is contradictory. Empty means valid. */
export function violations(person: Person): string[] {
  const out: string[] = [];
  const { origin, life } = person;
  const age = origin.age_at_creation;
  if ((life.marital === 'married' || life.marital === 'partnered') && age < 20)
    out.push('too young to be married');
  if (life.marital === 'widowed' && age < 25) out.push('too young to be widowed');
  if (life.children > 0 && age < 20) out.push('too young to have children');
  if (life.children > 0 && life.children > Math.floor((age - 18) / 2) + (age >= 30 ? 1 : 0))
    out.push('more children than the age allows');
  if (life.tenure_years > Math.max(0, age - 16)) out.push('tenure longer than the working life');
  const earner = age >= 18 && life.department !== 'household' && life.department !== 'retired';
  if (earner && life.income_vnd <= 0) out.push('no income');
  if (life.dependents < life.children) out.push('dependents fewer than children');
  for (const axis of TEMPERAMENT_AXES) {
    const v = origin.temperament[axis];
    if (v < 0 || v > 100) out.push(`temperament ${axis} out of range`);
  }
  if (new Set(origin.quirks).size !== origin.quirks.length) out.push('repeated quirk');
  if (origin.values.length < 2 || new Set(origin.values).size !== origin.values.length)
    out.push('values invalid');
  if (!(GENDERS as readonly string[]).includes(origin.gender)) out.push('unknown gender');
  return out;
}
