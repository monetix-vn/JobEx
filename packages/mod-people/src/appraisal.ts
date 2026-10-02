import { CONTRACTS_VERSION, PERCEPTION_EVENTS, PERSON_ACTED } from '@je/contracts';
import type {
  CoreEventPayloads,
  Effect,
  EventDraft,
  GuestAppearedPayload,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  PersonActedPayload,
  Person,
  PersonAction,
  PersonValue,
} from '@je/contracts';

export const appraisalManifest: ModuleManifest = {
  id: 'appraisal',
  version: '0.1.0',
  priority: 46,
  consumes: [PERCEPTION_EVENTS.guestAppeared, 'choice.resolved'],
  emits: ['relationship.changed', 'knowledge.escalate', 'sim.applyDelta', PERSON_ACTED],
  contractsVersion: CONTRACTS_VERSION,
};

type Kind = 1 | 2 | 3;
type Stakes = Record<Kind, number>;

/** How well each way of handling a scene (1 by the book, 2 a compromise, 3 the shortcut) turns out for the guest. */
const STAKES: Record<string, Stakes> = {
  tempter: { 1: -0.6, 2: 0, 3: 1 },
  rival: { 1: -0.6, 2: 0.3, 3: -1 },
  complainant: { 1: 0.6, 2: 0.3, 3: -0.8 },
  whistleblower: { 1: 1, 2: 0, 3: -1 },
  witness: { 1: 0.3, 2: 0, 3: -0.5 },
  accused: { 1: -0.5, 2: 0.2, 3: 0.8 },
  mentor: { 1: 0.3, 2: 0.2, 3: -0.3 },
};
const DEFAULT_STAKES: Stakes = { 1: 0.3, 2: 0.2, 3: -0.3 };
/** How right each way of handling a scene is, by the standards of someone who cares about rules. */
const RIGHTNESS: Record<Kind, number> = { 1: 1, 2: 0.3, 3: -1 };
const SELF_VALUES: PersonValue[] = ['money', 'status', 'security'];
const SCALE = 12;

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));
const kindOf = (choiceId: string): Kind => {
  const n = /^c(\d)$/.exec(choiceId)?.[1];
  return n === '1' ? 1 : n === '3' ? 3 : 2;
};

/** How much one scene moves a person's trust: what they think of the deed, plus what it did for them, softened by warmth. */
export function appraise(
  person: Person,
  storyFunction: string,
  kind: Kind,
  meetings: number,
): number {
  const t = person.origin.temperament;
  const cares = person.origin.values.includes('fairness') ? 1.3 : 1;
  const principled = clamp((t.integrity - 35) / 35, -0.5, 1.5) * cares;
  const selfish = 0.7 + (person.origin.values.some((v) => SELF_VALUES.includes(v)) ? 0.3 : 0);
  const stake = (STAKES[storyFunction] ?? DEFAULT_STAKES)[kind];
  let delta = SCALE * (principled * RIGHTNESS[kind] + selfish * stake);
  if (delta < 0) delta *= 1 - 0.3 * (t.warmth / 100);
  // First impressions count most; a person who knows you well has a settled view.
  delta *= 1.2 - 0.15 * Math.min(4, Math.max(0, meetings - 1));
  return Math.round(delta);
}

/**
 * Each guest judges what the player did (against their own values and how well they know the player), keeps a
 * trust score, and acts on it: a high-integrity guest may tell others what they saw, a warm one may vouch, a rough
 * one may run the player down. Their actions are seeded and come from traits, so the same person behaves the same
 * way for the same history.
 */
export function createAppraisalModule(host: ModuleHost): ModuleInstance {
  const truth = new Map<string, Person>();
  const trust = new Map<string, number>();
  const meetings = new Map<string, number>();
  const inScene = new Map<string, { id: string; fn: string }[]>();

  const actOn = (
    person: Person,
    kind: Kind,
    trustNow: number,
    facts: string[],
  ): { action: PersonAction; extra: EventDraft[] } | undefined => {
    const t = person.origin.temperament;
    const roll = host.rng.next();
    if (kind === 3 && facts.length > 0) {
      if (t.integrity >= 65 && roll < 0.25 + (trustNow < 0 ? 0.25 : 0)) {
        return {
          action: 'reported',
          extra: facts.map((factId) => ({
            type: 'knowledge.escalate',
            payload: { factId, to: 'rumor', reason: `told by ${person.id}` },
          })),
        };
      }
      if (trustNow >= 20 && t.integrity <= 45) return { action: 'covers', extra: [] };
    }
    if (trustNow <= -15 && (t.impulsivity >= 55 || t.warmth <= 40) && roll < 0.5) {
      return {
        action: 'badmouths',
        extra: [
          {
            type: 'sim.applyDelta',
            payload: { path: 'player.rep.staff', value: -2, reason: `${person.id} badmouths` },
          },
        ],
      };
    }
    if (trustNow >= 15 && t.warmth >= 50 && roll < 0.5) {
      return {
        action: 'vouches',
        extra: [
          {
            type: 'sim.applyDelta',
            payload: { path: 'player.rep.staff', value: 1, reason: `${person.id} vouches` },
          },
        ],
      };
    }
    return undefined;
  };

  return {
    handlers: {
      [PERCEPTION_EVENTS.guestAppeared]: (env) => {
        const p = env.payload as GuestAppearedPayload;
        truth.set(p.person.id, p.person);
        const list = inScene.get(p.sceneId) ?? [];
        list.push({ id: p.person.id, fn: p.story_function });
        inScene.set(p.sceneId, list);
      },
      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        const guests = inScene.get(p.sceneId);
        if (!guests || p.outcome === 'ignored') return;
        inScene.delete(p.sceneId);
        const kind = kindOf(p.choiceId);
        const facts = ((p.effects ?? []) as Effect[]).flatMap((e) =>
          'fact' in e && e.visibility !== 'public' ? [e.fact] : [],
        );
        const drafts: EventDraft[] = [];
        for (const g of guests) {
          const person = truth.get(g.id);
          if (!person) continue;
          const seen = (meetings.get(g.id) ?? 0) + 1;
          meetings.set(g.id, seen);
          const before = trust.get(g.id) ?? 0;
          const after = clamp(before + appraise(person, g.fn, kind, seen), -100, 100);
          trust.set(g.id, after);
          if (after !== before) {
            drafts.push({
              type: 'relationship.changed',
              payload: {
                character: g.id,
                dimension: 'trust',
                from: before,
                to: after,
                reason: `scene:${p.sceneId}`,
              } satisfies CoreEventPayloads['relationship.changed'],
            });
          }
          const act = actOn(person, kind, after, facts);
          if (act) {
            const n = person.origin.name;
            drafts.push({
              type: PERSON_ACTED,
              payload: {
                person_id: g.id,
                name: [n.family, n.middle, n.given].filter(Boolean).join(' '),
                action: act.action,
                sceneId: p.sceneId,
                visible: act.action === 'badmouths' || act.action === 'vouches',
              } satisfies PersonActedPayload,
            });
            drafts.push(...act.extra);
          }
        }
        return drafts;
      },
    },
    snapshot: () => ({
      people: [...trust.entries()]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([id, value]) => ({ id, trust: value, meetings: meetings.get(id) ?? 0 })),
    }),
  };
}

export const appraisalModule: Module = {
  manifest: appraisalManifest,
  createModule: createAppraisalModule,
};
