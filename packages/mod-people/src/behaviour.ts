import { CONTRACTS_VERSION, PERCEPTION_EVENTS } from '@je/contracts';
import type {
  CoreEventPayloads,
  EventDraft,
  GuestAppearedPayload,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  Person,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'behaviour',
  version: '0.1.0',
  priority: 47,
  consumes: [PERCEPTION_EVENTS.guestAppeared, 'relationship.changed', 'turn.phaseStarted'],
  emits: ['director.eventFired'],
  contractsVersion: CONTRACTS_VERSION,
};

/** What someone can set out to do about the player. Each one is a scene they bring. */
export const WANTS = ['asks_favour', 'complains', 'claims_credit'] as const;
export type Want = (typeof WANTS)[number];

const EVENT_OF: Record<Want, string> = {
  asks_favour: 'event.gen.colleague_favour',
  complains: 'event.gen.colleague_complaint',
  claims_credit: 'event.gen.colleague_credit',
};

/** The first week anyone brings something, and the least gap between two such scenes (director pacing). */
const FIRST_WEEK = 6;
const MIN_GAP_WEEKS = 3;
/** Chance in an eligible week that anyone acts at all; and how strong a want must be to count. */
const ACT_CHANCE = 0.3;
const THRESHOLD = 0.55;
/** Softmax temperature: how strictly the strongest want wins. Impulsive people are less predictable. */
const TEMPERATURE = 0.12;

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Debt and income as a pressure from 0 to 1: a year or more of pay owed is the worst. */
export function debtPressure(person: Person): number {
  return clamp(person.life.debt_vnd / Math.max(1, person.life.income_vnd * 12), 0, 1);
}

/**
 * How much a person wants each thing right now, from 0 to 1, from who they are (temperament, money) and how they feel
 * about the player (trust, from -100 to 100). Someone in debt who bends rules asks for favours; someone fragile who
 * trusts you brings you their troubles; an ambitious, cold one who does not trust you takes credit.
 */
export function wantsOf(person: Person, trust: number): Record<Want, number> {
  const t = person.origin.temperament;
  const warm = trust > 0 ? trust / 100 : 0;
  const bad = trust < 0 ? -trust / 100 : 0;
  return {
    asks_favour:
      0.55 * ((100 - t.integrity) / 100) +
      0.8 * debtPressure(person) +
      0.3 * warm +
      0.15 * (t.impulsivity / 100),
    complains: 0.7 * ((100 - t.resilience) / 100) + 0.45 * warm + 0.15 * (t.caution / 100),
    claims_credit:
      0.8 * (t.ambition / 100) +
      0.45 * ((100 - t.warmth) / 100) +
      0.35 * ((100 - t.integrity) / 100) +
      0.4 * bad,
  };
}

/**
 * What people do when the player is not looking. Once a week, people the player has met may decide to bring them
 * something: the strongest wants (above a threshold, chosen with a seeded softmax) become a scene, played through
 * the director's event path with that person as the guest. Pacing: nothing before week six, at most one scene
 * every three weeks, and most weeks nobody acts.
 */
export function createBehaviourModule(host: ModuleHost): ModuleInstance {
  const known = new Map<string, Person>();
  const trust = new Map<string, number>();
  let lastAt = -MIN_GAP_WEEKS;

  return {
    handlers: {
      [PERCEPTION_EVENTS.guestAppeared]: (env) => {
        const p = env.payload as GuestAppearedPayload;
        // Fixed characters have scripted scenes; only people who are not written into scenes by name bring their own.
        if (!p.person.id.startsWith('char.')) known.set(p.person.id, p.person);
      },
      'relationship.changed': (env) => {
        const p = env.payload as CoreEventPayloads['relationship.changed'];
        if (p.dimension === 'trust' && known.has(p.character)) trust.set(p.character, p.to);
      },
      'turn.phaseStarted': (env) => {
        const { phase } = env.payload as CoreEventPayloads['turn.phaseStarted'];
        if (phase !== 'plan') return;
        const turn = host.clock.now().turn;
        if (turn < FIRST_WEEK || turn - lastAt < MIN_GAP_WEEKS || known.size === 0) return;
        if (host.rng.next() >= ACT_CHANCE) return;

        const options: { id: string; want: Want; u: number; tau: number }[] = [];
        for (const person of [...known.values()].sort((a, b) => (a.id < b.id ? -1 : 1))) {
          const wants = wantsOf(person, trust.get(person.id) ?? 0);
          for (const want of WANTS) {
            if (wants[want] >= THRESHOLD)
              options.push({
                id: person.id,
                want,
                u: wants[want],
                tau: TEMPERATURE + 0.2 * (person.origin.temperament.impulsivity / 100),
              });
          }
        }
        if (options.length === 0) return;
        const weights = options.map((o) => Math.exp(o.u / o.tau - 1 / o.tau));
        let r = host.rng.next() * weights.reduce((a, b) => a + b, 0);
        let pick = options[options.length - 1]!;
        for (let i = 0; i < options.length; i++) {
          r -= weights[i]!;
          if (r <= 0) {
            pick = options[i]!;
            break;
          }
        }
        lastAt = turn;
        const draft: EventDraft = {
          type: 'director.eventFired',
          payload: { eventId: EVENT_OF[pick.want], tags: ['people', 'wanted'], person_id: pick.id },
        };
        return [draft];
      },
    },
    snapshot: () => ({ known: [...known.keys()].sort(), lastAt }),
  };
}

export const behaviourModule: Module = { manifest, createModule: createBehaviourModule };
