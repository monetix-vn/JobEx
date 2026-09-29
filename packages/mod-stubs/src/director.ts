import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  CoreEventPayloads,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'stub-director',
  version: '0.1.0',
  priority: 20,
  consumes: ['sim.weekSettled'],
  emits: ['director.eventFired'],
  contractsVersion: CONTRACTS_VERSION,
};

/** Stand-in for the event director: pressure raises the chance of an event, with a cooldown. */
export function createModule(host: ModuleHost): ModuleInstance {
  const state = { cooldown: 0, fired: 0 };
  return {
    handlers: {
      'sim.weekSettled': (env) => {
        const { stress } = env.payload as CoreEventPayloads['sim.weekSettled'];
        if (state.cooldown > 0) {
          state.cooldown -= 1;
          return;
        }
        if (!host.rng.chance(0.25 + stress / 400)) return;
        state.fired += 1;
        state.cooldown = 2;
        return [
          {
            type: 'director.eventFired',
            payload: { eventId: `event.stub_${state.fired}`, tags: ['stub', 'pressure'] },
          },
        ];
      },
    },
    snapshot: () => ({ ...state }),
  };
}

export const directorModule: Module = { manifest, createModule };
