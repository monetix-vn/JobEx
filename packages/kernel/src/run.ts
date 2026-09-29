import {
  CONTRACTS_VERSION,
  ENGINE_VERSION,
  EVENT_VERSIONS,
  TURN_PHASES,
  type CoreEventType,
  type Envelope,
  type EventDraft,
  type Handler,
  type Module,
  type ModuleInstance,
  type Ports,
  type RecordedInput,
  type ReplayLog,
  type TurnPhase,
} from '@je/contracts';
import type { ContentSourcePort, StoragePort, TelemetryPort } from '@je/contracts';
import { cloneJson, deepFreeze } from './canonical';
import { WorldClock } from './clock';
import { SeededRandom } from './rng';

export const KERNEL_SOURCE = 'kernel';
export const CLIENT_SOURCE = 'client';
const MAX_MESSAGES_PER_DRAIN = 200_000;

export class ContractViolation extends Error {
  override name = 'ContractViolation';
}

export interface RunOptions {
  seed: string;
  runId?: string;
  modules: readonly Module[];
  /** Per-module configuration keyed by module id. */
  configs?: Record<string, unknown>;
  telemetry?: TelemetryPort;
  storage?: StoragePort;
  content?: ContentSourcePort;
}

export type PhaseHook = (phase: TurnPhase, run: Run) => void;

interface Subscriber {
  moduleId: string;
  handler: Handler;
}

const NULL_TELEMETRY: TelemetryPort = { record: () => undefined };

/**
 * One simulation run. It owns the bus, the world clock, the seeded RNG streams and the module
 * host. A run is a seed plus the player inputs; everything else is derived, so the same seed and
 * inputs always produce a byte-identical log.
 *
 * Delivery order: turn phase, then module priority (then module id), then event id (publish
 * order). Handlers are synchronous and pure over their own state.
 */
export class Run {
  readonly seed: string;
  readonly runId: string;
  readonly entries: Envelope[] = [];
  readonly inputs: RecordedInput[] = [];

  private seq = 0;
  private queue: Envelope[] = [];
  private head = 0;
  private readonly clock = new WorldClock();
  private readonly random: SeededRandom;
  private readonly modules: { module: Module; instance: ModuleInstance }[];
  private readonly subscribers = new Map<string, Subscriber[]>();
  private readonly emitsByModule = new Map<string, Set<string>>();
  private readonly observers = new Set<(envelope: Envelope) => void>();
  private phase: TurnPhase | 'idle' = 'idle';
  private started = false;
  private ended = false;
  private turnsRun = 0;

  constructor(options: RunOptions) {
    this.seed = options.seed;
    this.runId = options.runId ?? `run-${options.seed}`;
    this.random = new SeededRandom(options.seed);

    const ports: Ports = {
      random: this.random,
      clock: this.clock,
      telemetry: options.telemetry ?? NULL_TELEMETRY,
      ...(options.storage ? { storage: options.storage } : {}),
      ...(options.content ? { content: options.content } : {}),
    };

    const ordered = [...options.modules].sort(
      (a, b) =>
        a.manifest.priority - b.manifest.priority || compareIds(a.manifest.id, b.manifest.id),
    );
    const seen = new Set<string>();
    this.modules = ordered.map((module) => {
      const { manifest } = module;
      if (seen.has(manifest.id)) throw new ContractViolation(`duplicate module id ${manifest.id}`);
      seen.add(manifest.id);
      if (manifest.contractsVersion !== CONTRACTS_VERSION) {
        throw new ContractViolation(
          `module ${manifest.id} targets contracts v${manifest.contractsVersion}, kernel has v${CONTRACTS_VERSION}`,
        );
      }
      const instance = module.createModule({
        moduleId: manifest.id,
        rng: this.random.stream(manifest.id),
        clock: this.clock,
        ports,
        config: options.configs?.[manifest.id],
      });
      this.emitsByModule.set(manifest.id, new Set(manifest.emits));
      for (const [type, handler] of Object.entries(instance.handlers)) {
        if (!manifest.consumes.includes(type)) {
          throw new ContractViolation(
            `module ${manifest.id} handles ${type} but does not declare it`,
          );
        }
        const list = this.subscribers.get(type) ?? [];
        list.push({ moduleId: manifest.id, handler });
        this.subscribers.set(type, list);
      }
      return { module, instance };
    });
  }

  get turn(): number {
    return this.clock.now().turn;
  }

  get currentPhase(): TurnPhase | 'idle' {
    return this.phase;
  }

  /** Called for every message as it is published (history is replayed to late observers). */
  observe(fn: (envelope: Envelope) => void): () => void {
    for (const envelope of this.entries) fn(envelope);
    this.observers.add(fn);
    return () => this.observers.delete(fn);
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    this.publish(
      'run.started',
      {
        seed: this.seed,
        modules: this.modules.map((m) => ({
          id: m.module.manifest.id,
          version: m.module.manifest.version,
        })),
      },
      KERNEL_SOURCE,
    );
    this.drain();
  }

  /** Runs one turn (one week) through all phases. `hook` runs after each phase has settled. */
  advanceTurn(hook?: PhaseHook): void {
    this.start();
    if (this.ended) throw new Error('run has ended');
    for (const phase of TURN_PHASES) {
      this.phase = phase;
      if (phase === 'start') this.publish('clock.ticked', this.clock.now(), KERNEL_SOURCE);
      this.publish('turn.phaseStarted', { phase }, KERNEL_SOURCE);
      this.drain();
      hook?.(phase, this);
    }
    this.phase = 'idle';
    this.clock.advance();
    this.turnsRun += 1;
  }

  runTurns(count: number, hook?: PhaseHook): void {
    for (let i = 0; i < count; i++) this.advanceTurn(hook);
  }

  /** External input (a player command). Recorded, because a run is a seed plus these inputs. */
  submit(type: string, payload: unknown): Envelope {
    if (!this.started) throw new Error('run has not started');
    if (this.ended) throw new Error('run has ended');
    const cloned = cloneJson(payload);
    this.inputs.push({ turn: this.turn, phase: this.phase, type, payload: cloned });
    const envelope = this.publish(type, cloned, CLIENT_SOURCE);
    this.drain();
    return envelope;
  }

  end(): void {
    this.start();
    if (this.ended) return;
    this.publish('run.ended', { turn: this.turn }, KERNEL_SOURCE);
    this.drain();
    this.ended = true;
  }

  snapshot(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const { module, instance } of this.modules) {
      out[module.manifest.id] = cloneJson(instance.snapshot());
    }
    return out;
  }

  exportLog(): ReplayLog {
    return {
      contractsVersion: CONTRACTS_VERSION,
      engineVersion: ENGINE_VERSION,
      seed: this.seed,
      runId: this.runId,
      turns: this.turnsRun,
      modules: this.modules.map((m) => ({
        id: m.module.manifest.id,
        version: m.module.manifest.version,
      })),
      inputs: this.inputs,
      entries: this.entries,
      finalState: this.snapshot(),
    };
  }

  private publish(
    type: string,
    payload: unknown,
    source: string,
    causedBy?: string,
    v?: number,
  ): Envelope {
    this.seq += 1;
    const envelope: Envelope = {
      id: `e${this.seq}`,
      type,
      v: v ?? EVENT_VERSIONS[type as CoreEventType] ?? 1,
      runId: this.runId,
      turn: this.turn,
      ...(causedBy ? { causedBy } : {}),
      source,
      payload: cloneJson(payload),
    };
    deepFreeze(envelope);
    this.entries.push(envelope);
    this.queue.push(envelope);
    for (const observer of this.observers) observer(envelope);
    return envelope;
  }

  private drain(): void {
    let delivered = 0;
    while (this.head < this.queue.length) {
      if (++delivered > MAX_MESSAGES_PER_DRAIN) {
        throw new Error('message storm: modules keep emitting events in a cycle');
      }
      const envelope = this.queue[this.head++] as Envelope;
      for (const sub of this.subscribers.get(envelope.type) ?? []) {
        let drafts: EventDraft[] | void;
        try {
          drafts = sub.handler(envelope);
        } catch (cause) {
          throw new Error(`module ${sub.moduleId} failed on ${envelope.type} (${envelope.id})`, {
            cause,
          });
        }
        for (const draft of drafts ?? []) {
          if (!this.emitsByModule.get(sub.moduleId)?.has(draft.type)) {
            throw new ContractViolation(
              `module ${sub.moduleId} emitted undeclared event ${draft.type}`,
            );
          }
          this.publish(draft.type, draft.payload, sub.moduleId, envelope.id, draft.v);
        }
      }
    }
    this.queue = [];
    this.head = 0;
  }
}

function compareIds(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
