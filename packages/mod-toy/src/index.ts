import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  CoreEventPayloads,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'toy-tally',
  version: '0.1.0',
  priority: 90,
  consumes: ['sim.weekSettled'],
  emits: ['toy.tallied'],
  contractsVersion: CONTRACTS_VERSION,
};

/** Payload of the module's own event. It is declared here, not in contracts: it is private to the toy. */
export interface ToyTallied {
  weeks: number;
  luckyWeeks: number;
  richestCash: number;
}

/**
 * Proof that a module can be added without touching any other: it listens to an existing event,
 * emits its own, and draws from its own RNG stream so nobody else's rolls change.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const state: ToyTallied = { weeks: 0, luckyWeeks: 0, richestCash: 0 };
  return {
    handlers: {
      'sim.weekSettled': (env) => {
        const { cash } = env.payload as CoreEventPayloads['sim.weekSettled'];
        state.weeks += 1;
        state.richestCash = Math.max(state.richestCash, cash);
        if (host.rng.chance(0.1)) state.luckyWeeks += 1;
        return [{ type: 'toy.tallied', payload: { ...state } satisfies ToyTallied }];
      },
    },
    snapshot: () => ({ ...state }),
  };
}

export const toyModule: Module = { manifest, createModule };
