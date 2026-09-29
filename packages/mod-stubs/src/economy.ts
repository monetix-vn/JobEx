import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  CoreEventPayloads,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'stub-economy',
  version: '0.1.0',
  priority: 10,
  consumes: ['clock.ticked', 'turn.phaseStarted', 'choice.resolved'],
  emits: ['sim.weekSettled'],
  contractsVersion: CONTRACTS_VERSION,
};

/** Stand-in for sim-core and workload: cash and stress drift each week, choices nudge them. */
export function createModule(host: ModuleHost): ModuleInstance {
  const state = { cash: 1000, stress: 20 };
  const clamp = (v: number): number => Math.min(100, Math.max(0, v));
  return {
    handlers: {
      'clock.ticked': () => {
        state.cash += host.rng.int(40, 80);
        state.stress = clamp(state.stress + host.rng.int(-2, 3));
      },
      'turn.phaseStarted': (env) => {
        const { phase } = env.payload as CoreEventPayloads['turn.phaseStarted'];
        if (phase !== 'resolve') return;
        return [
          {
            type: 'sim.weekSettled',
            payload: { turn: host.clock.now().turn, cash: state.cash, stress: state.stress },
          },
        ];
      },
      'choice.resolved': (env) => {
        const { outcome } = env.payload as CoreEventPayloads['choice.resolved'];
        if (outcome === 'ok') {
          state.stress = clamp(state.stress - 3);
          state.cash += 25;
        } else if (outcome === 'fail') {
          state.stress = clamp(state.stress + 6);
        } else {
          state.stress = clamp(state.stress + 2);
        }
      },
    },
    snapshot: () => ({ ...state }),
  };
}

export const economyModule: Module = { manifest, createModule };
