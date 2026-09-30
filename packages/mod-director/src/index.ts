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
  emits: ['director.eventFired', 'arc.started', 'arc.advanced', 'arc.ended'],
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
 *
 * Beats: an event with a `beat` window (in weeks, 1 is the first week of the run) is a fixed episode of the season. The first week inside its
 * window where it is eligible (role, condition) it plays, once, ahead of the random pool, at most
 * one beat a week; beats never come from the pool. Everything else stays random.
 *
 * Storylines (content kind `arc`): an event tagged with an arc starts it (`arc.started`); an
 * `{ arc, stage }` effect on an event or a resolved choice moves it to that stage, queueing the
 * stage's event after its delay (`arc.advanced`), or ends it for stage "end". An arc also ends
 * once its last stage's event has played. Ended arcs ignore later effects.
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
  const playedBeats = new Set<string>();
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

  const arcs = new Map<string, { status: 'active' | 'ended'; stage?: string }>();

  const schedule = (effects: readonly Effect[] | undefined, turn: number): EventDraft[] => {
    const drafts: EventDraft[] = [];
    for (const effect of effects ?? []) {
      if ('schedule' in effect) {
        const delay = host.rng.int(effect.delay_weeks[0], effect.delay_weeks[1]);
        scheduled.push({ eventId: effect.schedule, due: turn + delay });
      } else if ('arc' in effect) {
        const arc = content.get('arc', effect.arc);
        const state = arcs.get(effect.arc);
        if (!arc || state?.status === 'ended') continue;
        if (effect.stage === 'end') {
          arcs.set(effect.arc, { status: 'ended', stage: 'end' });
          drafts.push({ type: 'arc.ended', payload: { arc: effect.arc, reason: 'end' } });
          continue;
        }
        const stage = arc.stages.find((s) => s.id === effect.stage);
        if (!stage) continue;
        const [min, max] = stage.delay_weeks ?? [1, 1];
        const due = turn + host.rng.int(min, max);
        arcs.set(effect.arc, { status: 'active', stage: stage.id });
        scheduled.push({ eventId: stage.event, due });
        drafts.push({
          type: 'arc.advanced',
          payload: { arc: arc.id, stage: stage.id, eventId: stage.event, due },
        });
      }
    }
    scheduled.sort((a, b) => a.due - b.due || (a.eventId < b.eventId ? -1 : 1));
    return drafts;
  };

  const fire = (event: GameEvent, turn: number): EventDraft[] => {
    lastFired[event.id] = turn;
    fired += 1;
    const drafts: EventDraft[] = [
      { type: 'director.eventFired', payload: { eventId: event.id, tags: event.tags ?? [] } },
    ];
    if (event.arc && !arcs.has(event.arc) && content.get('arc', event.arc)) {
      arcs.set(event.arc, { status: 'active' });
      drafts.push({ type: 'arc.started', payload: { arc: event.arc, eventId: event.id } });
    }
    drafts.push(...schedule(event.effects, turn));
    // An arc is over once its last stage has played.
    for (const arc of content.all('arc')) {
      const last = arc.stages[arc.stages.length - 1];
      if (last?.event === event.id && arcs.get(arc.id)?.status === 'active') {
        arcs.set(arc.id, { status: 'ended', stage: last.id });
        drafts.push({ type: 'arc.ended', payload: { arc: arc.id, reason: 'finished' } });
      }
    }
    return drafts;
  };

  return {
    handlers: {
      'sim.stateChanged': (env) => {
        world.apply(env.payload as CoreEventPayloads['sim.stateChanged']);
      },

      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        return schedule(p.effects, host.clock.now().turn);
      },

      'turn.phaseStarted': (env) => {
        const { phase } = env.payload as CoreEventPayloads['turn.phaseStarted'];
        if (phase !== 'plan') return;
        const turn = host.clock.now().turn;
        const drafts: EventDraft[] = [];
        const taken = new Set<string>();
        let played = 0;

        // 1. Scheduled events that have come due, in due order.
        const due = scheduled.filter((s) => s.due <= turn);
        scheduled = scheduled.filter((s) => s.due > turn);
        for (const item of due) {
          const event = content.get('event', item.eventId);
          if (!event || taken.has(event.id)) continue;
          taken.add(event.id);
          drafts.push(...fire(event, turn));
          played += 1;
        }

        // 2. The season's fixed episodes: at most one beat a week, earliest window first.
        const beat = content
          .all('event')
          .filter((e) => e.beat && !playedBeats.has(e.id) && !taken.has(e.id))
          .filter((e) => turn + 1 >= e.beat!.from_week && turn + 1 <= e.beat!.to_week)
          .filter((e) => e.role === undefined || e.role === world.get('player.role'))
          .filter(holds)
          .sort((a, b) => a.beat!.from_week - b.beat!.from_week || (a.id < b.id ? -1 : 1))[0];
        if (beat) {
          playedBeats.add(beat.id);
          taken.add(beat.id);
          drafts.push(...fire(beat, turn));
          played += 1;
        }

        // 3. Fill the rest of the week from the pool, by weight, without replacement.
        const wanted = host.rng.int(minPerWeek, maxPerWeek);
        const pool = content
          .all('event')
          .filter((e) => !taken.has(e.id) && !e.beat && (e.weight ?? 1) > 0)
          .filter((e) => e.role === undefined || e.role === world.get('player.role'))
          .filter((e) => {
            const last = lastFired[e.id];
            return last === undefined || turn - last >= (e.cooldown_weeks ?? defaultCooldown);
          })
          .filter(holds)
          .sort((a, b) => (a.id < b.id ? -1 : 1));
        for (let slot = played; slot < wanted && pool.length > 0; slot++) {
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
          drafts.push(...fire(picked!, turn));
          played += 1;
        }
        return drafts;
      },
    },
    snapshot: () => ({
      fired,
      playedBeats: [...playedBeats].sort(),
      lastFired: Object.fromEntries(Object.entries(lastFired).sort()),
      scheduled: scheduled.map((s) => ({ ...s })),
      arcs: Object.fromEntries([...arcs.entries()].sort(([a], [b]) => (a < b ? -1 : 1))),
    }),
  };
}

export const directorModule: Module = { manifest, createModule };
