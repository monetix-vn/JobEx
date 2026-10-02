import type { GuestPort, PeopleLibrary, Person, WorldSeeds } from '@je/contracts';
import { generationStream } from '@je/kernel';
import { generatePerson, type GeneratorOptions } from './generate';
import { personForCharacter } from './character';

export interface GuestPortConfig {
  library: PeopleLibrary;
  seeds: WorldSeeds;
  /** Department of the player's job (`qc`, not `dept.qc`); used when a scene does not name one. */
  department: string;
  /** People already in the world. Guests are drawn from them first, so colleagues recur across runs. */
  roster?: readonly Person[];
  /** Chance that a guest is someone the player already met this run, from the same department. */
  reuseChance?: number;
  /** Chance that a new guest comes from the roster rather than being generated, when the roster has someone. */
  rosterChance?: number;
  options?: GeneratorOptions;
}

const bare = (department: string): string => department.replace(/^dept\./, '');

/**
 * Supplies the people who step into scenes. Colleagues recur: a guest is often someone already met this run,
 * otherwise someone from the world's roster, otherwise a new person drawn for the scene. Every choice comes from
 * a seeded stream keyed by the scene, the slot and a running counter, so the same run always meets the same people.
 */
export function createGuestPort(config: GuestPortConfig): GuestPort {
  const reuseChance = config.reuseChance ?? 0.35;
  const rosterChance = config.rosterChance ?? 0.7;
  const met = new Map<string, Person>();
  const characters = new Map<string, Person>();
  let counter = 0;

  return {
    character(request) {
      let person = characters.get(request.characterId);
      if (!person) {
        person = personForCharacter(config.library, config.seeds, request, config.options);
        characters.set(request.characterId, person);
      }
      return person;
    },
    appear(request) {
      const department = bare(request.department ?? config.department);
      if (request.preferred) {
        const asked = met.get(request.preferred);
        if (asked) return asked;
      }
      const key = `${request.sceneId}:${request.slot}`;
      const s = generationStream(config.seeds, 'guest', key, counter);
      const n = counter++;

      const remembered = [...met.values()].filter((p) => p.life.department === department);
      if (remembered.length > 0 && s.chance(reuseChance)) return s.pick(remembered);

      const pool = (config.roster ?? []).filter(
        (p) =>
          p.life.department === department &&
          p.status !== 'gone' &&
          p.status !== 'retired' &&
          !met.has(p.id),
      );
      let person: Person;
      if (pool.length > 0 && s.chance(rosterChance)) {
        person = s.pick(pool);
      } else {
        person = generatePerson(
          config.library,
          {
            department,
            story_function: request.story_function,
            event_id: `guest.${key}`,
            counter: n,
          },
          {
            seeds: config.seeds,
            created_turn: request.turn,
            ...(config.options ? { options: config.options } : {}),
          },
        );
      }
      met.set(person.id, person);
      return person;
    },
  };
}
