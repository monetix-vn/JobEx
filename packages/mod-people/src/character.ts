import { TEMPERAMENT_AXES } from '@je/contracts';
import type {
  CharacterRequest,
  PeopleLibrary,
  Person,
  TemperamentAxis,
  WorldSeeds,
} from '@je/contracts';
import { generatePerson, type GeneratorOptions } from './generate';

/** Departments written in the fixed characters' files that the people library groups under another name. */
const DEPARTMENT_OF: Record<string, string> = {
  sales: 'sales_export',
  customer_service: 'sales_export',
  admin: 'management',
  board: 'management',
  warehouse: 'logistics',
  safety: 'maintenance',
  supplier: 'external',
  vendor: 'external',
  buyer: 'external',
  client: 'external',
  bank: 'external',
  agency: 'external',
  influencer: 'external',
  audit: 'external',
  regulator: 'external',
  labour_inspection: 'external',
  compliance: 'external',
};

/** What a writer's note says about temperament: small shifts on top of the generated person. */
const TRAIT_SHIFTS: Record<string, Partial<Record<TemperamentAxis, number>>> = {
  careful: { caution: 18 },
  careful_notebook: { caution: 15 },
  methodical: { caution: 15, impulsivity: -12 },
  meticulous: { caution: 15, impulsivity: -10 },
  thorough: { caution: 12 },
  precise: { caution: 12 },
  exact: { caution: 12 },
  by_the_book: { integrity: 18, caution: 10 },
  risk_averse: { caution: 22 },
  fair: { integrity: 15 },
  impartial: { integrity: 15 },
  honest: { integrity: 20 },
  honest_when_asked: { integrity: 10 },
  believes_in_logs: { integrity: 8, caution: 8 },
  thinks_rules_are_for_others: { integrity: -30 },
  entitled: { integrity: -12, ambition: 8 },
  pushy: { impulsivity: 12, warmth: -10 },
  impatient: { impulsivity: 15 },
  blunt: { warmth: -12 },
  dry: { warmth: -6 },
  friendly: { warmth: 18 },
  warm: { warmth: 18 },
  courteous: { warmth: 10 },
  polite: { warmth: 8 },
  generous: { warmth: 18 },
  charming: { warmth: 10, integrity: -8 },
  charismatic: { warmth: 10, ambition: 10 },
  eager: { ambition: 12 },
  ambitious: { ambition: 25 },
  driven: { ambition: 20 },
  target_driven: { ambition: 15, integrity: -6 },
  top_performer: { ambition: 15 },
  relentless: { ambition: 15, resilience: 10 },
  persistent: { resilience: 10, ambition: 6 },
  calm: { resilience: 18, impulsivity: -12 },
  relaxed: { resilience: 10, impulsivity: -8 },
  unhurried: { impulsivity: -12 },
  patient: { impulsivity: -15, resilience: 8 },
  tired: { resilience: -12 },
  overstretched: { resilience: -12 },
  overworked: { resilience: -10 },
  anxious: { resilience: -20, caution: 10 },
  frightened: { resilience: -22 },
  decisive: { impulsivity: 8, resilience: 8 },
  confident: { resilience: 10 },
  loyal_when_respected: { warmth: 6 },
  protective: { warmth: 10 },
  protective_of_crew: { warmth: 12 },
};

const clamp = (v: number): number => Math.min(100, Math.max(0, Math.round(v)));

/**
 * The person underneath a fixed character: generated like anyone else from the character's department, then nudged
 * by the writers' notes so a character written as methodical is methodical in every run, while the rest (age, family,
 * quirks, values) varies from run to run. The id is the character's id, so the client and the perception module speak
 * of the same one.
 */
export function personForCharacter(
  library: PeopleLibrary,
  seeds: WorldSeeds,
  request: CharacterRequest,
  options?: GeneratorOptions,
): Person {
  const known = new Set(library.departments.map((d) => d.department));
  const wanted = DEPARTMENT_OF[request.department] ?? request.department;
  const department = known.has(wanted) ? wanted : 'management';
  const generated = generatePerson(
    library,
    { department, event_id: request.characterId, counter: 0 },
    { seeds, created_turn: request.turn, ...(options ? { options } : {}) },
  );
  const shift: Partial<Record<TemperamentAxis, number>> = {};
  for (const trait of request.traits ?? []) {
    for (const [axis, by] of Object.entries(TRAIT_SHIFTS[trait] ?? {})) {
      shift[axis as TemperamentAxis] = (shift[axis as TemperamentAxis] ?? 0) + by;
    }
  }
  const temperament = { ...generated.origin.temperament };
  for (const axis of TEMPERAMENT_AXES)
    temperament[axis] = clamp(temperament[axis] + (shift[axis] ?? 0));
  return {
    ...generated,
    id: request.characterId,
    origin: { ...generated.origin, temperament },
  };
}
