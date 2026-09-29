import { CONTRACTS_VERSION, FACT_VISIBILITIES } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  EventDraft,
  FactVisibility,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'social',
  version: '0.1.0',
  priority: 33,
  consumes: ['fact.learned', 'fact.escalated', 'clock.ticked'],
  emits: ['sim.applyDelta', 'knowledge.escalate'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface SocialConfig {
  content: ContentView;
  /** Weekly chance that word spreads one step, per point of fact severity. Default 0.02. */
  gossipPerSeverity?: number;
  /**
   * Weekly chance, per point of severity, that something the player got away with comes out to the
   * people who were there. A stand-in for detectors and audits (mod-risk). Default 0.0015.
   */
  leakPerSeverity?: number;
}

const rank = (v: FactVisibility): number => FACT_VISIBILITIES.indexOf(v) + 1;
const MAX_STEP_CHANCE = 0.5;
/** Rumors turn public faster than a secret turns into a rumor. */
const RUMOR_BOOST = 1.5;

/**
 * Who thinks what of the player, and how word gets around. When a fact becomes known to witnesses
 * or public, its content-defined reputation consequences are sent to sim-core. Each week, facts
 * that others know but that are not yet public may spread one step (witnessed to rumor to
 * public), with a chance that grows with severity, using this module's own RNG stream.
 * Something the player got away with can also leak to the people who were there, at a small
 * weekly chance (a stand-in until mod-risk adds real detectors). Reputation itself stays in
 * sim-core; social only sends deltas.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<SocialConfig> | undefined;
  if (!config?.content) throw new Error('mod-social needs config.content');
  const { content } = config;
  const perSeverity = config.gossipPerSeverity ?? 0.02;
  const leakPerSeverity = config.leakPerSeverity ?? 0.0015;

  const known = new Map<string, FactVisibility>();
  const applied = new Map<string, Set<'witnessed' | 'public'>>();

  const consequences = (factId: string, level: 'witnessed' | 'public'): EventDraft[] => {
    const done = applied.get(factId) ?? new Set();
    if (done.has(level)) return [];
    done.add(level);
    applied.set(factId, done);
    const deltas = content.get('fact', factId)?.consequences?.[level] ?? {};
    return Object.entries(deltas)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .filter(([, value]) => value !== 0)
      .map(([group, value]) => ({
        type: 'sim.applyDelta',
        payload: {
          path: `player.rep.${group}`,
          value: value as number,
          reason: `fact:${factId}:${level}`,
        },
      }));
  };

  /** Applies the consequences of every level the fact has now reached, in order. */
  const reach = (factId: string, visibility: FactVisibility): EventDraft[] => {
    known.set(factId, visibility);
    const drafts: EventDraft[] = [];
    if (rank(visibility) >= rank('witnessed')) drafts.push(...consequences(factId, 'witnessed'));
    if (visibility === 'public') drafts.push(...consequences(factId, 'public'));
    return drafts;
  };

  return {
    handlers: {
      'fact.learned': (env) => {
        const p = env.payload as CoreEventPayloads['fact.learned'];
        return reach(p.factId, p.visibility);
      },

      'fact.escalated': (env) => {
        const p = env.payload as CoreEventPayloads['fact.escalated'];
        return reach(p.factId, p.to);
      },

      'clock.ticked': () => {
        const drafts: EventDraft[] = [];
        const candidates = [...known.entries()]
          .filter(([, v]) => v !== 'public')
          .sort(([a], [b]) => (a < b ? -1 : 1));
        for (const [factId, visibility] of candidates) {
          const severity = content.get('fact', factId)?.severity ?? 1;
          if (visibility === 'private') {
            if (host.rng.chance(leakPerSeverity * severity)) {
              drafts.push({
                type: 'knowledge.escalate',
                payload: { factId, to: 'witnessed', reason: 'leak' },
              });
            }
            continue;
          }
          const base = Math.min(MAX_STEP_CHANCE, perSeverity * severity);
          const chance = visibility === 'rumor' ? Math.min(0.75, base * RUMOR_BOOST) : base;
          if (!host.rng.chance(chance)) continue;
          drafts.push({
            type: 'knowledge.escalate',
            payload: {
              factId,
              to: visibility === 'witnessed' ? 'rumor' : 'public',
              reason: 'gossip',
            },
          });
        }
        return drafts;
      },
    },
    snapshot: () => ({
      known: Object.fromEntries([...known.entries()].sort(([a], [b]) => (a < b ? -1 : 1))),
      applied: Object.fromEntries(
        [...applied.entries()]
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([id, set]) => [id, [...set].sort()]),
      ),
    }),
  };
}

export const socialModule: Module = { manifest, createModule };
