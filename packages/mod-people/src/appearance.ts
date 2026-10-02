import type {
  Appearance,
  AppearanceLibrary,
  AppearanceOption,
  Gender,
  Person,
  WorldSeeds,
} from '@je/contracts';
import { deriveSeed, generationStream } from '@je/kernel';
import type { SeededStream } from '@je/kernel';

/** The traits drawn from the library option lists (the others are skin tone, grey hair and glasses). */
export const APPEARANCE_TRAITS = [
  'build',
  'height',
  'face',
  'hair_style',
  'hair_colour',
  'facial_hair',
  'mark',
] as const;
type Trait = (typeof APPEARANCE_TRAITS)[number];

const fits = (o: AppearanceOption, gender: Gender, age: number): boolean =>
  (o.genders === undefined || o.genders.includes(gender)) &&
  (o.age_from === undefined || age >= o.age_from) &&
  (o.age_to === undefined || age <= o.age_to);

function pickOption(
  s: SeededStream,
  options: readonly AppearanceOption[],
  gender: Gender,
  age: number,
): string {
  const valid = options.filter((o) => fits(o, gender, age));
  const pool = valid.length > 0 ? valid : options;
  let total = 0;
  for (const o of pool) total += o.weight;
  let r = s.next() * total;
  for (const o of pool) {
    r -= o.weight;
    if (r <= 0) return o.id;
  }
  return pool[pool.length - 1]!.id;
}

const band = <R extends { age_from: number; age_to: number }>(rows: readonly R[], age: number): R =>
  rows.find((r) => r.age_from <= age && age <= r.age_to) ?? rows[rows.length - 1]!;

function pickWeightedIndex(s: SeededStream, weights: readonly number[]): number {
  let total = 0;
  for (const w of weights) total += w;
  let r = s.next() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

export interface AppearanceParents {
  a: Appearance;
  b: Appearance;
}

/**
 * Draws how a person looks. It uses its own stream (scope appearance), so adding or changing it never
 * changes any other part of a generated person. Children resemble their parents: each trait is copied
 * from a parent with the library resemblance chance, and skin tone is the parents average with a little
 * variation. Hair turns grey with age; glasses become more common with age.
 */
export function drawAppearance(
  library: AppearanceLibrary,
  who: { id: string; gender: Gender; age: number },
  seeds: WorldSeeds,
  parents?: AppearanceParents,
): Appearance {
  const s = generationStream(seeds, 'appearance', who.id, 0);
  const out: Record<string, string> = {};
  for (const trait of APPEARANCE_TRAITS) {
    const options = library.traits[trait] ?? [];
    const copies = parents !== undefined && s.next() < library.resemblance;
    const from = copies ? (s.next() < 0.5 ? parents.a : parents.b)[trait as Trait] : undefined;
    const draw = pickOption(s, options, who.gender, who.age);
    // A copied trait must still make sense for this person (a girl does not copy a beard).
    const allowed =
      from !== undefined && options.some((o) => o.id === from && fits(o, who.gender, who.age));
    out[trait] = allowed ? from : draw;
  }
  if (s.next() < band(library.grey_by_age, who.age).share) out.hair_colour = 'grey';
  const glasses = s.next() < band(library.glasses_by_age, who.age).share;
  const drawn = pickWeightedIndex(s, library.skin_tone_weights) + 1;
  let skin = drawn;
  if (parents) {
    const mean = (parents.a.skin_tone + parents.b.skin_tone) / 2;
    skin = Math.min(
      library.skin_tone_weights.length,
      Math.max(1, Math.round(mean + (s.next() - 0.5) * 1.6)),
    );
  }
  return {
    build: out.build!,
    height: out.height!,
    skin_tone: skin,
    face: out.face!,
    hair_style: out.hair_style!,
    hair_colour: out.hair_colour!,
    facial_hair: out.facial_hair!,
    glasses,
    mark: out.mark!,
    seed: deriveSeed(seeds.world_seed, seeds.run_seed, 'appearance', who.id),
  };
}

/** Signs of a person state that anyone could see. They are fair clues for the hidden traits; never personality itself. */
export type Tell =
  'tired_eyes' | 'drawn_face' | 'neat_clothes' | 'worn_clothes' | 'fidgeting' | 'steady_gaze';

/**
 * What a person looks like today: tiredness from stress and health, grooming from money, nervous habits
 * from quirks. Appearance traits (face, build...) never feed in; they do not reveal character.
 */
export function visibleTells(person: Person, state: { stress: number; health: number }): Tell[] {
  const tells: Tell[] = [];
  if (state.stress >= 70) tells.push('tired_eyes');
  if (state.health < 55) tells.push('drawn_face');
  const debtMonths = person.life.debt_vnd / Math.max(1, person.life.income_vnd);
  if (debtMonths > 30) tells.push('worn_clothes');
  else if (person.life.savings_vnd > person.life.income_vnd * 6) tells.push('neat_clothes');
  const nervous = ['clicks_first', 'apologises_too_much', 'checks_phone_constantly'];
  if (person.origin.quirks.some((q) => nervous.includes(q))) tells.push('fidgeting');
  if (person.origin.temperament.resilience >= 70 && state.stress < 40) tells.push('steady_gaze');
  return tells;
}
