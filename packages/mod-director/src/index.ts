import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  Effect,
  EventDraft,
  GameEvent,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';
import { ExpressionError, VarStore, evaluate } from '@je/rules';

export const manifest: ModuleManifest = {
  id: 'director',
  version: '0.1.0',
  priority: 35,
  consumes: ['sim.stateChanged', 'turn.phaseStarted', 'choice.resolved'],
  emits: ['director.eventFired'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface DirectorConfig {
  content: ContentView;
  /** How many events the pool supplies each week, inclusive. */
  eventsPerWeek?: [number, number];
  /** Cooldown for events that do not declare `cooldown_weeks`. */
  defaultCooldownWeeks?: number;
}

const DEFAULT_PER_WEEK: [number, number] = [1, 2];
const DEFAULT_COOLDOWN = 8;

interface Scheduled {
  eventId: string;
  due: number;
}

/**
 * Event pool and scheduler. Each week, at the plan phase, it fires events that were scheduled to
 * come due, then draws more from the pool: events whose `when` condition holds against the state
 * mirror, that are off cooldown, chosen by weight without replacement from its own RNG stream.
 * Weight 0 means "scheduled only". Effects of type `schedule` (on the event itself, or on a
 * resolved choice) queue a later event after a random delay. It only decides *what* happens; the
 * narrative module plays it and the choice module resolves it.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<DirectorConfig> | undefined;
  if (!config?.content) throw new Error('mod-director needs config.content');
  const { content } = config;
  const [minPerWeek, maxPerWeek] = config.eventsPerWeek ?? DEFAULT_PER_WEEK;
  const defaultCooldown = config.defaultCooldownWeeks ?? DEFAULT_COOLDOWN;

  const world = new VarStore();
  const lastFired: Record<string, number> = {};
  let scheduled: Scheduled[] = [];
  let fired = 0;

  const holds = (event: GameEvent): boolean => {
    if (event.when === undefined) return true;
    try {
      return evaluate(event.when, world.scope) === true;
    } catch (error) {
      // A condition that cannot be evaluated (e.g. a variable that does not exist yet) is false.
      if (error instanceof ExpressionError) return false;
      throw error;
    }
  };

  const schedule = (effects: readonly Effect[] | undefined, turn: number): void => {
    for (const effect of effects ?? []) {
      if (!('schedule' in effect)) continue;
      const delay = host.rng.int(effect.delay_weeks[0], effect.delay_weeks[1]);
      scheduled.push({ eventId: effect.schedule, due: turn + delay });
    }
    scheduled.sort((a, b) => a.due - b.due || (a.eventId < b.eventId ? -1 : 1));
  };

  const fire = (event: GameEvent, turn: number): EventDraft => {
    lastFired[event.id] = turn;
    fired += 1;
    schedule(event.effects, turn);
    return { type: 'director.eventFired', payload: { eventId: event.id, tags: event.tags ?? [] } };
  };

  return {
    handlers: {
      'sim.stateChanged': (env) => {
        world.apply(env.payload as CoreEventPayloads['sim.stateChanged']);
      },

      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        schedule(p.effects, host.clock.now().turn);
      },

      'turn.phaseStarted': (env) => {
        const { phase } = env.payload as CoreEventPayloads['turn.phaseStarted'];
        if (phase !== 'plan') return;
        const turn = host.clock.now().turn;
        const drafts: EventDraft[] = [];
        const taken = new Set<string>();

        // 1. Scheduled events that have come due, in due order.
        const due = scheduled.filter((s) => s.due <= turn);
        scheduled = scheduled.filter((s) => s.due > turn);
        for (const item of due) {
          const event = content.get('event', item.eventId);
          if (!event || taken.has(event.id)) continue;
          taken.add(event.id);
          drafts.push(fire(event, turn));
        }

        // 2. Fill the rest of the week from the pool, by weight, without replacement.
        const wanted = host.rng.int(minPerWeek, maxPerWeek);
        const pool = content
          .all('event')
          .filter((e) => !taken.has(e.id) && (e.weight ?? 1) > 0)
          .filter((e) => {
            const last = lastFired[e.id];
            return last === undefined || turn - last >= (e.cooldown_weeks ?? defaultCooldown);
          })
          .filter(holds)
          .sort((a, b) => (a.id < b.id ? -1 : 1));
        for (let slot = drafts.length; slot < wanted && pool.length > 0; slot++) {
          const total = pool.reduce((sum, e) => sum + (e.weight ?? 1), 0);
          let roll = host.rng.next() * total;
          let index = pool.length - 1;
          for (let i = 0; i < pool.length; i++) {
            roll -= pool[i]!.weight ?? 1;
            if (roll < 0) {
              index = i;
              break;
            }
          }
          const [picked] = pool.splice(index, 1);
          drafts.push(fire(picked!, turn));
        }
        return drafts;
      },
    },
    snapshot: () => ({
      fired,
      lastFired: Object.fromEntries(Object.entries(lastFired).sort()),
      scheduled: scheduled.map((s) => ({ ...s })),
    }),
  };
}

export const directorModule: Module = { manifest, createModule };
