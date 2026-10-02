import { CONTRACTS_VERSION, PERCEPTION_EVENTS, TEMPERAMENT_AXES } from '@je/contracts';
import type {
  CoreEventPayloads,
  EventDraft,
  GuestAppearedPayload,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  PeopleLibrary,
  PerceptionUpdatedPayload,
  Person,
  QuirkNoticedPayload,
  TemperamentAxis,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'perception',
  version: '0.1.0',
  priority: 45,
  consumes: [PERCEPTION_EVENTS.guestAppeared, 'choice.resolved'],
  emits: [PERCEPTION_EVENTS.updated, PERCEPTION_EVENTS.quirkNoticed],
  contractsVersion: CONTRACTS_VERSION,
};

/** Spread of one reading: a single look at someone is a poor guide to their character. */
const NOISE = 20;
/** Chance that an observation also shows one of the person's quirks. */
const QUIRK_CHANCE = 0.25;
/** Axes that a person with this role in a scene gives away more readily. */
const FUNCTION_AXES: Record<string, TemperamentAxis[]> = {
  tempter: ['integrity', 'ambition'],
  rival: ['ambition', 'warmth'],
  mentor: ['warmth', 'caution'],
  whistleblower: ['integrity', 'resilience'],
  complainant: ['resilience', 'impulsivity'],
  witness: ['caution', 'integrity'],
  accused: ['integrity', 'resilience'],
};

interface Impression {
  /** Mean of the readings so far: the player's best guess. */
  estimate: number;
  observations: number;
}

/** 0 to 100: no more than a guess after one look, a fair picture after many. */
export function confidenceOf(observations: number): number {
  return Math.round(100 * (1 - 1 / Math.sqrt(1 + observations)));
}

/**
 * What the player believes about the people they meet (WORLD-PLAN 4.4). The module knows the truth (it reads the
 * person from `guest.appeared`) but announces only a noisy reading of one trait at a time, so the client never
 * needs, and the dossier never shows, a true number. Each time a guest is in a scene the player sees them twice:
 * when they appear and when the scene resolves. Readings average out, so confidence grows with every meeting.
 */
export function createPerceptionModule(host: ModuleHost): ModuleInstance {
  const library = (host.config as { library?: PeopleLibrary } | undefined)?.library;
  const truth = new Map<string, Person>();
  const impressions = new Map<string, Map<TemperamentAxis, Impression>>();
  const noticed = new Map<string, Set<string>>();
  /** Guests of scenes that are still open, with the role they play, in the order they appeared. */
  const inScene = new Map<string, { id: string; fn: string }[]>();

  const gauss = (): number => {
    const r = host.rng.next() + host.rng.next() + host.rng.next();
    return (r - 1.5) * 2 * NOISE;
  };

  const observe = (id: string, fn: string): EventDraft[] => {
    const person = truth.get(id);
    if (!person) return [];
    const weights = TEMPERAMENT_AXES.map((axis) => {
      const conspicuous = Math.abs(person.origin.temperament[axis] - 50) + 10;
      return conspicuous * (FUNCTION_AXES[fn]?.includes(axis) ? 2.5 : 1);
    });
    let r = host.rng.next() * weights.reduce((a, b) => a + b, 0);
    let index = 0;
    for (; index < weights.length - 1; index++) {
      r -= weights[index]!;
      if (r <= 0) break;
    }
    const axis = TEMPERAMENT_AXES[index]!;
    const reading = Math.min(100, Math.max(0, person.origin.temperament[axis] + gauss()));

    const byAxis = impressions.get(id) ?? new Map<TemperamentAxis, Impression>();
    impressions.set(id, byAxis);
    const before = byAxis.get(axis) ?? { estimate: 0, observations: 0 };
    const observations = before.observations + 1;
    const estimate = (before.estimate * before.observations + reading) / observations;
    byAxis.set(axis, { estimate, observations });
    const drafts: EventDraft[] = [
      {
        type: PERCEPTION_EVENTS.updated,
        payload: {
          person_id: id,
          axis,
          estimate: Math.round(estimate),
          confidence: confidenceOf(observations),
          observations,
        } satisfies PerceptionUpdatedPayload,
      },
    ];

    const seen = noticed.get(id) ?? new Set<string>();
    noticed.set(id, seen);
    const hidden = person.origin.quirks.filter((q) => !seen.has(q));
    const roll = host.rng.next();
    if (hidden.length > 0 && roll < QUIRK_CHANCE) {
      const quirk =
        hidden[Math.min(hidden.length - 1, Math.floor(host.rng.next() * hidden.length))]!;
      seen.add(quirk);
      drafts.push({
        type: PERCEPTION_EVENTS.quirkNoticed,
        payload: {
          person_id: id,
          quirk,
          ...(library?.quirks.find((q) => q.id === quirk)
            ? { name: library.quirks.find((q) => q.id === quirk)!.name }
            : {}),
        } satisfies QuirkNoticedPayload,
      });
    }
    return drafts;
  };

  return {
    handlers: {
      [PERCEPTION_EVENTS.guestAppeared]: (env) => {
        const p = env.payload as GuestAppearedPayload;
        truth.set(p.person.id, p.person);
        const list = inScene.get(p.sceneId) ?? [];
        list.push({ id: p.person.id, fn: p.story_function });
        inScene.set(p.sceneId, list);
        return observe(p.person.id, p.story_function);
      },
      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        const guests = inScene.get(p.sceneId);
        if (!guests) return;
        inScene.delete(p.sceneId);
        return guests.flatMap((g) => observe(g.id, g.fn));
      },
    },
    snapshot: () => ({
      impressions: [...impressions.entries()]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([id, byAxis]) => ({
          id,
          axes: [...byAxis.entries()]
            .sort(([a], [b]) => (a < b ? -1 : 1))
            .map(([axis, i]) => ({
              axis,
              estimate: Math.round(i.estimate),
              observations: i.observations,
              confidence: confidenceOf(i.observations),
            })),
          quirks: [...(noticed.get(id) ?? [])].sort(),
        })),
    }),
  };
}

export const perceptionModule: Module = { manifest, createModule: createPerceptionModule };
