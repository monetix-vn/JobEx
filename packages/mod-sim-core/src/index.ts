import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  EventDraft,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  StateValue,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'sim-core',
  version: '0.1.0',
  priority: 10,
  consumes: ['run.started', 'clock.ticked', 'sim.applyDelta'],
  emits: ['sim.stateChanged', 'sim.deltaApplied', 'sim.deltaRejected'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface SimCoreConfig {
  content: ContentView;
  roleId: string;
  /** Company variables (paths under `company.`) layered over the defaults. */
  company?: Record<string, number>;
}

/** Only these namespaces may be created on demand by a delta; anything else is rejected. */
const OPEN_NAMESPACES = ['player.', 'company.', 'skill.', 'fact.'];
const PERCENT_LIMITS = [
  /^player\.(stress|energy|health)$/,
  /^player\.rep\./,
  /^company\.audit_readiness$/,
];
const WEEKLY_ENERGY = 100;

const DEFAULTS: Record<string, StateValue> = {
  'player.stress': 25,
  'player.energy': WEEKLY_ENERGY,
  'player.health': 100,
  'player.salary_vnd': 0,
  'company.audit_readiness': 50,
  // Reputation starts neutral so both gains and losses register.
  'player.rep.boss': 50,
  'player.rep.buyer': 50,
  'player.rep.production': 50,
  'player.rep.qc': 50,
};

/** Reputation created on demand starts neutral, like the seeded ones. */
const initialFor = (path: string): number => (path.startsWith('player.rep.') ? 50 : 0);

const clamp = (path: string, value: number): number =>
  PERCENT_LIMITS.some((re) => re.test(path)) ? Math.min(100, Math.max(0, value)) : value;

/**
 * Owns player and company state. Everyone else changes it by sending `sim.applyDelta` and reads
 * it through `sim.stateChanged`; nobody mutates it directly.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<SimCoreConfig> | undefined;
  if (!config?.content || !config.roleId) {
    throw new Error('mod-sim-core needs config.content and config.roleId');
  }
  const role = config.content.get('role', config.roleId);
  if (!role) throw new Error(`mod-sim-core: unknown role "${config.roleId}"`);

  const vars = new Map<string, StateValue>();
  const changed = (paths: string[]): EventDraft => ({
    type: 'sim.stateChanged',
    payload: { full: false, vars: Object.fromEntries(paths.sort().map((p) => [p, vars.get(p)])) },
  });

  return {
    handlers: {
      'run.started': () => {
        for (const [path, value] of Object.entries(DEFAULTS)) vars.set(path, value);
        for (const [path, value] of Object.entries(config.company ?? {})) {
          vars.set(path.startsWith('company.') ? path : `company.${path}`, value);
        }
        vars.set('player.role', role.id);
        vars.set('player.level', role.level);
        // Bare keys are player variables; dotted keys (e.g. skill.negotiation) are full paths.
        for (const [key, value] of Object.entries(role.start_state ?? {})) {
          vars.set(key.includes('.') ? key : `player.${key}`, value);
        }
        return [
          {
            type: 'sim.stateChanged',
            payload: { full: true, vars: Object.fromEntries([...vars.entries()].sort()) },
          },
        ];
      },

      'clock.ticked': (env) => {
        const clock = env.payload as CoreEventPayloads['clock.ticked'];
        vars.set('world.turn', clock.turn);
        vars.set('world.year', clock.year);
        vars.set('world.week_of_year', clock.week_of_year);
        vars.set('world.month_of_year', clock.month_of_year);
        vars.set('world.quarter', clock.quarter);
        vars.set('player.energy', WEEKLY_ENERGY);
        return [
          changed([
            'world.turn',
            'world.year',
            'world.week_of_year',
            'world.month_of_year',
            'world.quarter',
            'player.energy',
          ]),
        ];
      },

      'sim.applyDelta': (env) => {
        const { path, value, mode, reason } = env.payload as CoreEventPayloads['sim.applyDelta'];
        const current = vars.get(path);
        const creatable = OPEN_NAMESPACES.some((ns) => path.startsWith(ns));
        if (
          (current === undefined && !creatable) ||
          (current !== undefined && typeof current !== 'number')
        ) {
          return [{ type: 'sim.deltaRejected', payload: { path, reason: 'unknown_path' } }];
        }
        const from = typeof current === 'number' ? current : initialFor(path);
        const to = clamp(path, mode === 'set' ? value : from + value);
        vars.set(path, to);
        return [
          {
            type: 'sim.deltaApplied',
            payload: { path, from, to, ...(reason ? { reason } : {}) },
          },
          changed([path]),
        ];
      },
    },
    snapshot: () => Object.fromEntries([...vars.entries()].sort()),
  };
}

export const simCoreModule: Module = { manifest, createModule };
