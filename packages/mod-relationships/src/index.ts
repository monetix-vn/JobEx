import { CONTRACTS_VERSION, FACT_VISIBILITIES, RELATIONSHIP_DIMENSIONS } from '@je/contracts';
import type {
  Character,
  ContentView,
  CoreEventPayloads,
  EventDraft,
  FactVisibility,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  RelationshipDimension,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'relationships',
  version: '0.1.0',
  priority: 32,
  consumes: ['run.started', 'clock.ticked', 'fact.learned', 'fact.escalated', 'sim.deltaApplied'],
  emits: ['sim.applyDelta', 'relationship.changed'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface RelationshipsConfig {
  content: ContentView;
  /** Every this many weeks, trust and loyalty drift one point back towards where they started. Default 4. */
  driftEveryWeeks?: number;
  /** Fraction of a fact's group reputation change that the group's named people feel as trust. Default 0.5. */
  factShare?: number;
}

const REL_PATH = /^rel\.([a-z][a-z0-9_]*)\.(trust|loyalty|owed)$/;
const DRIFTS: RelationshipDimension[] = ['trust', 'loyalty'];
const rank = (v: FactVisibility): number => FACT_VISIBILITIES.indexOf(v) + 1;

const slugOf = (character: Character): string => character.id.slice('char.'.length);
const pathOf = (slug: string, dimension: RelationshipDimension): string =>
  `rel.${slug}.${dimension}`;

/**
 * How named people feel about the player: `rel.<slug>.trust|loyalty|owed`, each from -100 to 100,
 * stored by sim-core like every other variable. Scenes change them with ordinary delta effects.
 * This module seeds the starting values, lets trust and loyalty drift back towards where they
 * began, turns what a person's group learns about the player's deeds into trust, and announces
 * every change as `relationship.changed` for the debrief and the client. It never reads the locale.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<RelationshipsConfig> | undefined;
  if (!config?.content) throw new Error('mod-relationships needs config.content');
  const { content } = config;
  const driftEvery = config.driftEveryWeeks ?? 4;
  const factShare = config.factShare ?? 0.5;

  const people = (): Character[] =>
    [...content.all('character')].sort((a, b) => (a.id < b.id ? -1 : 1));
  const values = new Map<string, number>();
  const applied = new Set<string>();

  const startOf = (person: Character, dimension: RelationshipDimension): number =>
    person.start?.[dimension] ?? 0;
  const delta = (path: string, value: number, reason: string, mode?: 'set'): EventDraft => ({
    type: 'sim.applyDelta',
    payload: { path, value, reason, ...(mode ? { mode } : {}) },
  });

  /** Sends the trust changes for one fact level, once per fact and level. */
  const feel = (factId: string, level: 'witnessed' | 'public'): EventDraft[] => {
    const key = `${factId}:${level}`;
    if (applied.has(key)) return [];
    applied.add(key);
    const shifts = content.get('fact', factId)?.consequences?.[level] ?? {};
    const drafts: EventDraft[] = [];
    for (const person of people()) {
      const change = person.home_group ? (shifts[person.home_group] ?? 0) : 0;
      const trust = Math.sign(change) * Math.round(Math.abs(change) * factShare);
      if (trust !== 0) {
        drafts.push(delta(pathOf(slugOf(person), 'trust'), trust, `fact:${factId}:${level}`));
      }
    }
    return drafts;
  };

  const reach = (factId: string, visibility: FactVisibility): EventDraft[] => {
    const drafts: EventDraft[] = [];
    if (rank(visibility) >= rank('witnessed')) drafts.push(...feel(factId, 'witnessed'));
    if (visibility === 'public') drafts.push(...feel(factId, 'public'));
    return drafts;
  };

  return {
    handlers: {
      'run.started': () => {
        const drafts: EventDraft[] = [];
        for (const person of people()) {
          for (const dimension of RELATIONSHIP_DIMENSIONS) {
            const start = startOf(person, dimension);
            if (start !== 0) {
              drafts.push(delta(pathOf(slugOf(person), dimension), start, 'start', 'set'));
            }
          }
        }
        return drafts;
      },

      'clock.ticked': (env) => {
        const { turn } = env.payload as CoreEventPayloads['clock.ticked'];
        if (driftEvery <= 0 || turn % driftEvery !== 0) return [];
        const drafts: EventDraft[] = [];
        for (const person of people()) {
          for (const dimension of DRIFTS) {
            const now = values.get(pathOf(slugOf(person), dimension)) ?? startOf(person, dimension);
            const start = startOf(person, dimension);
            if (now !== start) {
              drafts.push(delta(pathOf(slugOf(person), dimension), now > start ? -1 : 1, 'drift'));
            }
          }
        }
        return drafts;
      },

      'fact.learned': (env) => {
        const p = env.payload as CoreEventPayloads['fact.learned'];
        return reach(p.factId, p.visibility);
      },

      'fact.escalated': (env) => {
        const p = env.payload as CoreEventPayloads['fact.escalated'];
        return reach(p.factId, p.to);
      },

      'sim.deltaApplied': (env) => {
        const p = env.payload as CoreEventPayloads['sim.deltaApplied'];
        const match = REL_PATH.exec(p.path);
        if (!match) return [];
        values.set(p.path, p.to);
        return [
          {
            type: 'relationship.changed',
            payload: {
              character: `char.${match[1]}`,
              dimension: match[2] as RelationshipDimension,
              from: p.from,
              to: p.to,
              ...(p.reason ? { reason: p.reason } : {}),
            },
          },
        ];
      },
    },
    snapshot: () => ({
      values: Object.fromEntries([...values.entries()].sort(([a], [b]) => (a < b ? -1 : 1))),
      applied: [...applied].sort(),
    }),
  };
}

export const relationshipsModule: Module = { manifest, createModule };
