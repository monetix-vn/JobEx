import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  Detector,
  Effect,
  Ending,
  EventDraft,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';
import { VarStore } from '@je/rules';

export const manifest: ModuleManifest = {
  id: 'risk',
  version: '0.1.0',
  priority: 36,
  consumes: [
    'sim.stateChanged',
    'clock.ticked',
    'turn.phaseStarted',
    'fact.learned',
    'fact.escalated',
    'choice.resolved',
  ],
  emits: [
    'risk.auditStarted',
    'risk.detected',
    'risk.scapegoated',
    'knowledge.escalate',
    'sim.applyDelta',
    'run.endRequested',
  ],
  contractsVersion: CONTRACTS_VERSION,
};

export interface RiskConfig {
  content: ContentView;
  /** How good each detector is, 0 to 1. */
  strengths?: Partial<Record<Detector, number>>;
  /** Weeks of the year when the internal audit is in the building. Default: each quarter end. */
  auditWeeks?: number[];
  /** Base weekly chance scale for the everyday detectors. Default 0.02. */
  detectBase?: number;
  /** Chance scale for the internal audit during an audit week. Default 0.25. */
  auditFactor?: number;
  /** No ending can happen before this week. Default 8. */
  minTurnsBeforeEnding?: number;
  /** An ending condition must hold this many weeks in a row (burnout is immediate). Default 2. */
  graceWeeks?: number;
}

const DEFAULT_STRENGTHS: Record<Detector, number> = {
  finance: 0.6,
  internal_audit: 0.7,
  qc: 0.5,
  buyer: 0.4,
  boss: 0.4,
  staff: 0.5,
};
const DEFAULT_AUDIT_WEEKS = [12, 25, 38, 51];
const PRIVATE = 1;
const PUBLIC = 4;
const SERIOUS = 7;
const GRAVE = 9;
/** A fact at this rank or above is out: at least a rumor. */
const OUT = 3;

const clamp = (n: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, n));

/**
 * Detection, audits, blame and endings. While a deed is still private, the evidence it left
 * (`traces` on the fact) can be found: everyday detectors (finance, QC, the buyer, the boss) have a
 * small chance each week, and the internal audit looks hard but only in audit weeks. A finding
 * makes the fact known to witnesses through the ledger. When something serious gets out, the boss
 * may pin it on the player, more likely when the boss thinks little of them. The run can end: burnout
 * at zero health, a public scandal that reaches the authorities, or losing the job. All rolls use
 * this module's own RNG stream. Facts and reputation are read from the state mirror.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<RiskConfig> | undefined;
  if (!config?.content) throw new Error('mod-risk needs config.content');
  const { content } = config;
  const strengths = { ...DEFAULT_STRENGTHS, ...config.strengths };
  const auditWeeks = config.auditWeeks ?? DEFAULT_AUDIT_WEEKS;
  const detectBase = config.detectBase ?? 0.02;
  const auditFactor = config.auditFactor ?? 0.25;
  const minTurns = config.minTurnsBeforeEnding ?? 8;
  const grace = config.graceWeeks ?? 2;

  const world = new VarStore();
  const considered = new Set<string>();
  const blamed = new Set<string>();
  let endRequested: Ending | undefined;
  let strikes = 0;

  const rank = (factId: string): number => world.number(factId, 0);

  const scapegoat = (factId: string): EventDraft[] => {
    if (considered.has(factId)) return [];
    considered.add(factId);
    const severity = content.get('fact', factId)?.severity ?? 1;
    if (severity < 6) return [];
    const boss = world.number('player.rep.boss', 50);
    const chance = clamp(0.15 + 0.04 * severity + (50 - boss) / 200, 0, 0.75);
    if (!host.rng.chance(chance)) return [];
    blamed.add(factId);
    return [
      { type: 'risk.scapegoated', payload: { factId } },
      {
        type: 'sim.applyDelta',
        payload: { path: 'player.rep.boss', value: -6, reason: `risk:scapegoat:${factId}` },
      },
      {
        type: 'sim.applyDelta',
        payload: { path: 'player.stress', value: 5, reason: `risk:scapegoat:${factId}` },
      },
    ];
  };

  /** The ending the current situation calls for, if any. */
  const verdict = (): Ending | undefined => {
    const boss = world.number('player.rep.boss', 50);
    let serious = 0;
    let grave = 0;
    let scandal = false;
    for (const fact of content.all('fact')) {
      const r = rank(fact.id);
      if (r >= PUBLIC && fact.severity >= SERIOUS) serious += 1;
      if (r >= PUBLIC && fact.severity >= GRAVE) grave += 1;
      if (r >= OUT && fact.severity >= 6) scandal = true;
    }
    if (world.number('player.health', 100) <= 0) return 'burnout';
    if (grave >= 1 && boss <= 30) return 'prosecuted';
    // Being let go takes a scandal: a low standing alone is a bad year, not a firing.
    if ((scandal && boss <= 10) || (serious >= 2 && boss <= 25)) return 'fired';
    return undefined;
  };

  const ending = (turn: number): Ending | undefined => {
    if (turn < minTurns) return undefined;
    const now = verdict();
    if (!now) {
      strikes = 0;
      return undefined;
    }
    strikes += 1;
    return now === 'burnout' || strikes >= grace ? now : undefined;
  };

  return {
    handlers: {
      'sim.stateChanged': (env) => {
        world.apply(env.payload as CoreEventPayloads['sim.stateChanged']);
      },

      'fact.learned': (env) => {
        const p = env.payload as CoreEventPayloads['fact.learned'];
        return p.visibility === 'private' ? undefined : scapegoat(p.factId);
      },

      'fact.escalated': (env) => {
        const p = env.payload as CoreEventPayloads['fact.escalated'];
        return scapegoat(p.factId);
      },

      'clock.ticked': (env) => {
        const clock = env.payload as CoreEventPayloads['clock.ticked'];
        const audit = auditWeeks.includes(clock.week_of_year);
        const drafts: EventDraft[] = [];
        if (audit) drafts.push({ type: 'risk.auditStarted', payload: { turn: clock.turn } });

        const hidden = content
          .all('fact')
          .filter((f) => rank(f.id) === PRIVATE && (f.traces?.length ?? 0) > 0)
          .sort((a, b) => (a.id < b.id ? -1 : 1));
        for (const fact of hidden) {
          let found: { detector: Detector; trace: string } | undefined;
          for (const trace of fact.traces ?? []) {
            for (const detector of trace.detectors) {
              if (detector === 'internal_audit' && !audit) continue;
              const scale = detector === 'internal_audit' ? auditFactor : detectBase;
              if (host.rng.chance(trace.visibility * strengths[detector] * scale)) {
                found = { detector, trace: trace.type };
                break;
              }
            }
            if (found) break;
          }
          if (!found) continue;
          drafts.push(
            {
              type: 'risk.detected',
              payload: {
                factId: fact.id,
                detector: found.detector,
                trace: found.trace,
                audit: found.detector === 'internal_audit',
              },
            },
            {
              type: 'knowledge.escalate',
              payload: { factId: fact.id, to: 'witnessed', reason: `detected:${found.detector}` },
            },
          );
        }
        return drafts;
      },

      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        if (endRequested) return;
        // A choice can end the run itself: accepting a promotion, handing in a resignation.
        const chosen = ((p.effects ?? []) as Effect[]).find((e) => 'ending' in e);
        if (!chosen || !('ending' in chosen)) return;
        endRequested = chosen.ending;
        return [{ type: 'run.endRequested', payload: { ending: chosen.ending, reason: 'choice' } }];
      },

      'turn.phaseStarted': (env) => {
        const { phase } = env.payload as CoreEventPayloads['turn.phaseStarted'];
        if (phase !== 'end' || endRequested) return;
        const result = ending(host.clock.now().turn);
        if (!result) return;
        endRequested = result;
        return [{ type: 'run.endRequested', payload: { ending: result, reason: 'risk' } }];
      },
    },
    snapshot: () => ({
      considered: [...considered].sort(),
      scapegoated: [...blamed].sort(),
      ending: endRequested ?? null,
      strikes,
    }),
  };
}

export const riskModule: Module = { manifest, createModule };
