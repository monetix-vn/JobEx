import { PERSON_VALUES, TEMPERAMENT_AXES, WORLD_FORMAT } from '@je/contracts';
import type {
  Archetype,
  Gender,
  HiringPath,
  LoreEntry,
  MaritalStatus,
  PeopleLibrary,
  Person,
  PersonName,
  PersonValue,
  RunSummary,
  Temperament,
  World,
  WorldSettings,
} from '@je/contracts';
import { generationStream } from '@je/kernel';
import { drawAppearance } from './appearance';
import { generatePerson } from './generate';
import { liveOneYear } from './life';
import { reviewLadder } from './ladder';

/** Share of the staff in each department for the cookware factory (a game parameter; tune in the editor later). */
export const COOKWARE_MIX: Record<string, number> = {
  production: 40,
  logistics: 8,
  sales_export: 8,
  qc: 6,
  finance: 5,
  purchasing: 4,
  maintenance: 5,
  hr: 3,
  it: 3,
  marketing: 3,
  management: 3,
  fpa: 2,
};

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const WORLD_SEEDS_SCOPE = 'world';

export interface NewWorldOptions {
  id: string;
  name: string;
  worldSeed: string;
  settings: WorldSettings;
  createdAt: string;
}

export function createWorld(options: NewWorldOptions): World {
  return {
    format: WORLD_FORMAT,
    id: options.id,
    name: options.name,
    world_seed: options.worldSeed,
    settings: options.settings,
    created_at: options.createdAt,
    year: 0,
    runs: [],
    people: [],
    lore: [],
  };
}

/** The age a person has in a given world year. */
export function ageOf(person: Person, worldYear: number): number {
  return person.origin.age_at_creation + Math.max(0, worldYear - (person.created_year ?? 0));
}

/** The seed for the next run in a world: derived from the world seed, so the same world gives the same sequence of runs. */
export function nextRunSeed(world: World): string {
  return `${world.world_seed}/run${world.runs.length + 1}`;
}

/**
 * Makes sure a world has a staff of the given size around the player (tier A: the people the player works with).
 * Existing people are kept; only the missing ones are generated, deterministically from the world seed.
 */
export function ensureRoster(
  library: PeopleLibrary,
  world: World,
  count = 50,
  mix: Record<string, number> = COOKWARE_MIX,
): World {
  const staff = world.people.filter(
    (p) => !p.legacy && p.controller === 'auto' && p.id.startsWith('person.staff'),
  );
  if (staff.length >= count) return world;
  const departments = Object.keys(mix).filter((d) =>
    library.departments.some((x) => x.department === d),
  );
  const total = departments.reduce((s, d) => s + (mix[d] ?? 0), 0);
  const seeds = { world_seed: world.world_seed, run_seed: WORLD_SEEDS_SCOPE };
  const added: Person[] = [];
  for (let i = staff.length; i < count; i++) {
    const s = generationStream(seeds, 'roster', world.id, i);
    let r = s.next() * total;
    let department = departments[departments.length - 1]!;
    for (const d of departments) {
      r -= mix[d] ?? 0;
      if (r <= 0) {
        department = d;
        break;
      }
    }
    const person = generatePerson(
      library,
      { department, event_id: 'staff', counter: i },
      { seeds, created_turn: 0 },
    );
    added.push({ ...person, created_year: world.year, status: 'active' });
  }
  return { ...world, people: [...world.people, ...added] };
}

/** How the protagonist of a run came out, as personality: from what they did, not from what they said. */
export function temperamentFromRun(summary: RunSummary): Temperament {
  const dark = summary.facts.filter((f) => f.severity >= 3);
  const good = summary.facts.filter((f) => f.severity <= 2);
  const darkWeight = dark.reduce((s, f) => s + f.severity * (1 + f.level * 0.3), 0);
  const promoted = summary.ending === 'promoted';
  const walked = summary.ending === 'walked_away';
  const caught = summary.ending === 'fired' || summary.ending === 'prosecuted';
  const staff = summary.reputation['player.rep.staff'] ?? 50;
  const boss = summary.reputation['player.rep.boss'] ?? 50;
  const t: Temperament = {
    integrity: clamp(Math.round(64 - darkWeight * 0.9 + good.length * 3), 5, 95),
    ambition: clamp(Math.round(48 + (promoted ? 20 : 0) - (walked ? 15 : 0) + dark.length), 5, 95),
    resilience: clamp(Math.round(82 - summary.stress * 0.6), 5, 95),
    warmth: clamp(Math.round(50 + (staff - 50) * 0.5 + (boss - 50) * 0.2), 5, 95),
    caution: clamp(Math.round(52 + (caught ? -12 : 4) - dark.length), 5, 95),
    impulsivity: clamp(Math.round(48 + dark.length * 3 - (promoted ? 6 : 0)), 5, 95),
  };
  for (const axis of TEMPERAMENT_AXES) t[axis] = Math.round(t[axis]);
  return t;
}

function nearestArchetype(library: PeopleLibrary, t: Temperament): Archetype {
  let best = library.archetypes[0]!;
  let bestDistance = Infinity;
  for (const a of library.archetypes) {
    let d = 0;
    for (const axis of TEMPERAMENT_AXES) {
      const mean = a.temperament[axis]?.[0] ?? 50;
      d += (t[axis] - mean) ** 2;
    }
    if (d < bestDistance) {
      bestDistance = d;
      best = a;
    }
  }
  return best;
}

function valuesFromRun(summary: RunSummary, t: Temperament): PersonValue[] {
  const out: PersonValue[] = [];
  const p = summary.profile;
  if (p && (p.money === 'in_debt' || p.money === 'tight' || p.money === 'sending_home'))
    out.push('money');
  if (p && p.dependents !== 'none') out.push('family');
  if (t.integrity >= 65) out.push('fairness');
  if (t.ambition >= 65) out.push('status');
  if (t.warmth >= 62) out.push('loyalty');
  for (const v of PERSON_VALUES) {
    if (out.length >= 3) break;
    if (!out.includes(v) && (v === 'security' || v === 'craft')) out.push(v);
  }
  return [...new Set(out)].slice(0, 3);
}

function quirksFromRun(library: PeopleLibrary, t: Temperament, summary: RunSummary): string[] {
  const wanted =
    t.integrity < 38
      ? ['bends_the_rules_for_friends', 'keeps_score']
      : t.integrity >= 68
        ? ['quotes_the_policy', 'admits_mistakes']
        : t.caution > 60
          ? ['double_checks_everything', 'keeps_a_notebook']
          : ['networks_constantly', 'works_late_to_be_seen'];
  const chosen: string[] = [];
  for (const id of wanted) {
    const q = library.quirks.find((x) => x.id === id);
    if (!q) continue;
    const clash = chosen.some(
      (c) =>
        q.incompatible_with?.includes(c) ||
        library.quirks.find((x) => x.id === c)?.incompatible_with?.includes(id),
    );
    if (!clash) chosen.push(id);
  }
  if (
    summary.stress >= 80 &&
    !chosen.includes('apologises_too_much') &&
    !chosen.includes('says_what_others_avoid')
  )
    chosen.push('apologises_too_much');
  return chosen.slice(0, 3);
}

function nameFrom(text: string): PersonName {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { family: '', middle: '', given: 'You' };
  if (parts.length === 1) return { family: '', middle: '', given: parts[0]! };
  return {
    family: parts[0]!,
    middle: parts.slice(1, -1).join(' '),
    given: parts[parts.length - 1]!,
  };
}

/** Turns the player's character into a Person of the world, so they live on after the run as an autonomous person. */
export function personFromProtagonist(
  library: PeopleLibrary,
  world: World,
  summary: RunSummary,
): Person {
  const profile = summary.profile;
  const runNo = world.runs.length + 1;
  const t = temperamentFromRun(summary);
  const dept =
    library.departments.find((d) => d.department === summary.department) ?? library.departments[0]!;
  const gender: Gender = profile?.gender ?? 'female';
  const age = profile?.age ?? Math.round(dept.age_mean);
  const marital: MaritalStatus =
    profile?.dependents === 'partner' ||
    profile?.dependents === 'children' ||
    profile?.dependents === 'several'
      ? 'married'
      : 'single';
  const children =
    profile?.dependents === 'children' ? 2 : profile?.dependents === 'several' ? 2 : 0;
  const income =
    Math.round((dept.income_base_vnd * (summary.ending === 'promoted' ? 1.5 : 1.1)) / 100000) *
    100000;
  const money = profile?.money ?? 'tight';
  const debtMonths = { comfortable: 0, tight: 3, in_debt: 14, sending_home: 2 }[money];
  const savingsMonths = { comfortable: 8, tight: 1, in_debt: 0, sending_home: 1 }[money];
  const id = `person.protagonist#${runNo}`;
  const appearanceSeeds = { world_seed: world.world_seed, run_seed: WORLD_SEEDS_SCOPE };
  return {
    id,
    seed: runNo,
    created_turn: summary.weeks,
    created_year: world.year,
    status: 'active',
    controller: 'auto',
    legacy: { run_no: runNo, ending: summary.ending, title: summary.role_id },
    origin: {
      gender,
      age_at_creation: age,
      region: 'south',
      settlement: 'urban',
      education: profile?.education ?? 'university',
      hiring_path: (profile?.hiring_path ?? 'applied_cold') as HiringPath,
      temperament: t,
      values: valuesFromRun(summary, t),
      quirks: quirksFromRun(library, t, summary),
      archetype: nearestArchetype(library, t).id,
      name: nameFrom(profile?.name ?? 'You'),
      voice: [],
    },
    life: {
      department: dept.department,
      ladder_step: summary.ending === 'promoted' ? 2 : 1,
      tenure_years: 1,
      performance: clamp(
        Math.round(70 - summary.facts.filter((f) => f.severity >= 3).length * 4),
        20,
        95,
      ),
      income_vnd: Math.max(3_000_000, income),
      debt_vnd: debtMonths * income,
      savings_vnd: savingsMonths * income,
      marital,
      children,
      dependents:
        profile?.dependents === 'none' || !profile
          ? 0
          : Math.max(children, profile.dependents === 'several' ? 4 : 1),
      housing: marital === 'married' ? 'rent' : 'with_family',
      health: clamp(Math.round(95 - summary.stress * 0.3), 30, 100),
    },
    appearance: drawAppearance(library.appearance, { id, gender, age }, appearanceSeeds),
  };
}

export interface RetireResult {
  world: World;
  person: Person;
  lore: LoreEntry;
}

/**
 * Ends a run in a world: the protagonist becomes an autonomous person (with the temperament their choices showed),
 * the run is recorded, and the history gets a line. The world year moves on separately (`advanceWorldYear`).
 */
export function retireProtagonist(
  library: PeopleLibrary,
  world: World,
  summary: RunSummary,
  runSeed: string,
): RetireResult {
  const person = personFromProtagonist(library, world, summary);
  const display = [person.origin.name.family, person.origin.name.middle, person.origin.name.given]
    .filter(Boolean)
    .join(' ');
  const lore: LoreEntry = {
    year: world.year,
    kind: 'run_ended',
    person: person.id,
    en: `${display} ended a year as ${summary.role_id.replace('role.', '')}: ${summary.ending.replace('_', ' ')}.`,
    vi: `${display} khép lại một năm làm việc: ${summary.ending.replace('_', ' ')}.`,
  };
  return {
    world: {
      ...world,
      runs: [
        ...world.runs,
        {
          run_no: world.runs.length + 1,
          run_seed: runSeed,
          role_id: summary.role_id,
          protagonist: person.id,
          ending: summary.ending,
          weeks: summary.weeks,
        },
      ],
      people: [...world.people, person],
      lore: [...world.lore, lore],
    },
    person,
    lore,
  };
}

/** A year passes for everyone in the world: they age, and the life events of the year happen to them. */
export function advanceWorldYear(
  library: PeopleLibrary,
  world: World,
): { world: World; lore: LoreEntry[] } {
  const year = world.year + 1;
  const seeds = { world_seed: world.world_seed, run_seed: WORLD_SEEDS_SCOPE };
  const lore: LoreEntry[] = [];
  const people = world.people.map((p) => {
    if (p.status === 'retired' || p.status === 'gone') return p;
    const age = ageOf(p, year);
    if (age >= 66) return { ...p, status: 'retired' as const };
    const stream = generationStream(seeds, 'world-year', p.id, year);
    const result = liveOneYear(library, p, age, stream);
    for (const id of result.events) {
      const event = library.life_events.find((e) => e.id === id);
      if (!event) continue;
      const n = result.person.origin.name;
      const display = [n.family, n.middle, n.given].filter(Boolean).join(' ');
      lore.push({
        year,
        kind: 'life_event',
        person: p.id,
        en: `${display}: ${event.name.en}.`,
        vi: `${display}: ${event.name.vi}.`,
      });
    }
    return result.person;
  });
  // Careers: the same review for everyone; people who retired this year are replaced by new hires.
  const retiredNow = people.filter(
    (p, i) => p.status === 'retired' && world.people[i]?.status !== 'retired',
  );
  const careers = reviewLadder(library, people, year, seeds, retiredNow);
  lore.push(...careers.lore);
  return {
    world: { ...world, year, people: careers.people, lore: [...world.lore, ...lore] },
    lore,
  };
}

export type ParsedWorld = { ok: true; world: World } | { ok: false; error: string };

/** Reads a world from text and checks its shape; it never trusts the file. */
export function parseWorld(text: string): ParsedWorld {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'not a world file (could not read it)' };
  }
  const w = raw as Partial<World> | null;
  if (typeof w !== 'object' || w === null || w.format !== WORLD_FORMAT)
    return { ok: false, error: 'unsupported world format' };
  if (typeof w.id !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(w.id))
    return { ok: false, error: 'the world has no valid id' };
  if (typeof w.name !== 'string' || typeof w.world_seed !== 'string' || w.world_seed === '')
    return { ok: false, error: 'the world has no name or seed' };
  if (typeof w.year !== 'number' || !Number.isInteger(w.year) || w.year < 0)
    return { ok: false, error: 'the world has an invalid year' };
  if (!Array.isArray(w.people) || !Array.isArray(w.runs) || !Array.isArray(w.lore))
    return { ok: false, error: 'the world is missing people, runs or lore' };
  if (w.people.length > 3000) return { ok: false, error: 'a world holds at most 3000 people' };
  for (const p of w.people as Person[]) {
    if (typeof p?.id !== 'string' || typeof p.origin !== 'object' || typeof p.life !== 'object')
      return { ok: false, error: 'a person in the world is damaged' };
  }
  return { ok: true, world: w as World };
}
