import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';
import { VarStore } from '@je/rules';

export const manifest: ModuleManifest = {
  id: 'workload',
  version: '0.1.0',
  priority: 20,
  consumes: ['clock.ticked', 'sim.stateChanged', 'turn.phaseStarted', 'choice.resolved'],
  emits: ['workload.weekPlanned', 'workload.weekClosed', 'sim.applyDelta'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface WorkloadConfig {
  content: ContentView;
  roleId: string;
  /** Working hours available per week. */
  capacityHours?: number;
  /** Hours a week that the role's listed tasks do not cover: meetings, email, admin. */
  overheadHours?: number;
}

const DEFAULT_CAPACITY = 45;
const DEFAULT_OVERHEAD = 24;
/** A week at or below this share of capacity lets the player recover. */
const RELAXED_SHARE = 0.9;
const HIGH_STRESS = 80;
const round1 = (n: number): number => Math.round(n * 10) / 10;

interface Task {
  task: string;
  count: number;
  hours: number;
}

/**
 * Demand, capacity, stress and health. Each week the role's demand is sampled (own RNG stream),
 * choices that cost hours add to it, and the week closes by turning overload into stress.
 * Unfinished work carries over as backlog.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<WorkloadConfig> | undefined;
  if (!config?.content || !config.roleId) {
    throw new Error('mod-workload needs config.content and config.roleId');
  }
  const role = config.content.get('role', config.roleId);
  if (!role) throw new Error(`mod-workload: unknown role "${config.roleId}"`);
  const capacity = config.capacityHours ?? DEFAULT_CAPACITY;
  const overhead = config.overheadHours ?? DEFAULT_OVERHEAD;
  const demandSpec = role.weekly_demand ?? [];

  const world = new VarStore();
  const state = { backlog: 0, demand: 0, extra: 0, tasks: [] as Task[] };

  return {
    handlers: {
      'sim.stateChanged': (env) => {
        world.apply(env.payload as CoreEventPayloads['sim.stateChanged']);
      },

      'clock.ticked': () => {
        state.tasks = demandSpec.map((d) => {
          const count = host.rng.int(d.per_week[0], d.per_week[1]);
          return { task: d.task, count, hours: round1(count * d.effort_h) };
        });
        state.demand = round1(overhead + state.tasks.reduce((sum, t) => sum + t.hours, 0));
        state.extra = 0;
      },

      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        if (p.outcome !== 'ignored' && p.cost?.hours)
          state.extra = round1(state.extra + p.cost.hours);
      },

      'turn.phaseStarted': (env) => {
        const { phase } = env.payload as CoreEventPayloads['turn.phaseStarted'];
        const turn = host.clock.now().turn;
        if (phase === 'plan') {
          return [
            {
              type: 'workload.weekPlanned',
              payload: {
                turn,
                demandHours: state.demand,
                backlogHours: state.backlog,
                capacityHours: capacity,
                tasks: state.tasks,
              },
            },
          ];
        }
        if (phase !== 'consequence') return;

        const total = round1(state.demand + state.extra + state.backlog);
        const overload = round1(Math.max(0, total - capacity));
        const done = round1(Math.min(total, capacity));
        const stressDelta =
          overload > 0
            ? Math.min(10, Math.round(overload * 0.6))
            : total <= capacity * RELAXED_SHARE
              ? -2
              : 0;
        const drafts: ReturnType<NonNullable<ModuleInstance['handlers'][string]>> = [
          {
            type: 'sim.applyDelta',
            payload: { path: 'player.stress', value: stressDelta, reason: 'workload' },
          },
        ];
        if (world.number('player.stress') + stressDelta > HIGH_STRESS) {
          drafts.push({
            type: 'sim.applyDelta',
            payload: { path: 'player.health', value: -2, reason: 'workload.burnout' },
          });
        }
        state.backlog = overload;
        drafts.push({
          type: 'workload.weekClosed',
          payload: {
            turn,
            demandHours: state.demand,
            extraHours: state.extra,
            capacityHours: capacity,
            doneHours: done,
            backlogHours: state.backlog,
            overloadHours: overload,
            stressDelta,
          },
        });
        return drafts;
      },
    },
    snapshot: () => ({ ...state, tasks: state.tasks.map((t) => ({ ...t })) }),
  };
}

export const workloadModule: Module = { manifest, createModule };
