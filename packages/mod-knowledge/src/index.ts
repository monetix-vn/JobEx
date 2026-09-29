import { CONTRACTS_VERSION, FACT_VISIBILITIES } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  Effect,
  EventDraft,
  FactVisibility,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'knowledge',
  version: '0.1.0',
  priority: 31,
  consumes: ['choice.resolved', 'knowledge.escalate'],
  emits: ['sim.applyDelta', 'fact.learned', 'fact.escalated'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface KnowledgeConfig {
  content: ContentView;
}

/** Rank of a visibility, published as the state variable named by the fact id, e.g. `fact.accepted_kickback` (0 means unknown). */
export const factRank = (visibility: FactVisibility): number =>
  FACT_VISIBILITIES.indexOf(visibility) + 1;

interface Entry {
  visibility: FactVisibility;
  firstTurn: number;
  sceneId?: string;
  witnesses: string[];
}

/**
 * The ledger of facts: what the player has done that others might come to know, and how widely it
 * is known. Facts enter from resolved choices and only ever become better known. Each change is
 * published as `fact.learned` / `fact.escalated` and as the state variable named by its id (through
 * sim-core), so content conditions can react to what is known. This module records knowledge; it
 * does not decide what anyone does about it (social and, later, risk do).
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<KnowledgeConfig> | undefined;
  if (!config?.content) throw new Error('mod-knowledge needs config.content');
  const { content } = config;

  const ledger = new Map<string, Entry>();

  const knownBy = (entry: Entry): string[] => [
    'player',
    ...entry.witnesses,
    ...(entry.visibility === 'public' ? ['everyone'] : []),
  ];

  /** Roles present in the scene where the fact arose. Private facts have no witnesses. */
  const witnessesOf = (sceneId: string | undefined): string[] =>
    (sceneId ? (content.get('scene', sceneId)?.cast ?? []) : [])
      .map((role) => role.replace(/^role:/, ''))
      .filter((role) => role !== 'player');

  const record = (
    factId: string,
    visibility: FactVisibility,
    sceneId: string | undefined,
    reason: string,
  ): EventDraft[] => {
    if (!content.get('fact', factId)) throw new Error(`mod-knowledge: unknown fact "${factId}"`);
    const existing = ledger.get(factId);
    if (existing && factRank(existing.visibility) >= factRank(visibility)) return [];

    const from = existing?.visibility;
    const entry: Entry = existing ?? {
      visibility,
      firstTurn: host.clock.now().turn,
      ...(sceneId ? { sceneId } : {}),
      witnesses: [],
    };
    entry.visibility = visibility;
    // Anyone above "private" was there when it happened, or heard about it.
    if (factRank(visibility) >= factRank('witnessed') && entry.witnesses.length === 0) {
      entry.witnesses = witnessesOf(entry.sceneId ?? sceneId);
    }
    ledger.set(factId, entry);

    const publish: EventDraft = {
      type: 'sim.applyDelta',
      payload: { path: factId, value: factRank(visibility), mode: 'set', reason },
    };
    const news: EventDraft =
      from === undefined
        ? {
            type: 'fact.learned',
            payload: {
              factId,
              visibility,
              knownBy: knownBy(entry),
              ...(entry.sceneId ? { sceneId: entry.sceneId } : {}),
            },
          }
        : {
            type: 'fact.escalated',
            payload: { factId, from, to: visibility, knownBy: knownBy(entry) },
          };
    return [publish, news];
  };

  return {
    handlers: {
      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        const drafts: EventDraft[] = [];
        for (const effect of (p.effects ?? []) as Effect[]) {
          if ('fact' in effect) {
            drafts.push(
              ...record(effect.fact, effect.visibility, p.sceneId, `${p.sceneId}/${p.choiceId}`),
            );
          }
        }
        return drafts;
      },

      'knowledge.escalate': (env) => {
        const p = env.payload as CoreEventPayloads['knowledge.escalate'];
        return record(p.factId, p.to, undefined, p.reason ?? 'escalated');
      },
    },
    snapshot: () =>
      Object.fromEntries(
        [...ledger.entries()]
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([id, e]) => [
            id,
            { visibility: e.visibility, firstTurn: e.firstTurn, knownBy: knownBy(e) },
          ]),
      ),
  };
}

export const knowledgeModule: Module = { manifest, createModule };
