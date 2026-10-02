import { CONTRACTS_VERSION, PERSON_EVENTS } from '@je/contracts';
import type {
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  PeopleLibrary,
  Person,
  PersonCreatedPayload,
  PersonRequest,
  WorldSeeds,
} from '@je/contracts';
import { generatePerson, type GeneratorOptions } from './generate';

export const manifest: ModuleManifest = {
  id: 'people',
  version: '0.1.0',
  priority: 15,
  consumes: [PERSON_EVENTS.requested],
  emits: [PERSON_EVENTS.created],
  contractsVersion: CONTRACTS_VERSION,
};

export interface PeopleConfig {
  library: PeopleLibrary;
  seeds: WorldSeeds;
  options?: GeneratorOptions;
}

/**
 * The people store. Anyone (the director, a story arc, the client) asks for a person with a
 * `person.requested` event; the module draws one from the seeded generator and announces `person.created`.
 * The store is a projection of those events: replaying the log rebuilds it exactly.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<PeopleConfig> | undefined;
  if (!config?.library || !config.seeds) {
    throw new Error('mod-people needs config.library and config.seeds');
  }
  const { library, seeds, options } = config as PeopleConfig;
  const people = new Map<string, Person>();

  return {
    handlers: {
      [PERSON_EVENTS.requested]: (env) => {
        const request = env.payload as PersonRequest;
        const person = generatePerson(library, request, {
          seeds,
          created_turn: host.clock.now().turn,
          ...(options ? { options } : {}),
        });
        people.set(person.id, person);
        return [
          { type: PERSON_EVENTS.created, payload: { person } satisfies PersonCreatedPayload },
        ];
      },
    },
    snapshot: () => ({
      people: [...people.values()].sort((a, b) => (a.id < b.id ? -1 : 1)),
    }),
  };
}

export const peopleModule: Module = { manifest, createModule };
