import type { Envelope, EventDraft, Module, Ports } from '@je/contracts';
import { CONTRACTS_VERSION, EVENT_VERSIONS, type CoreEventType } from '@je/contracts';
import { canonicalize } from './canonical';
import { WorldClock } from './clock';
import { SeededRandom } from './rng';

/** Contract fixture: given these events, expect these events (plan section 3, contract tests). */
export interface Fixture {
  name?: string;
  seed?: string;
  turn?: number;
  config?: unknown;
  given: { type: string; payload: unknown }[];
  expect: { type: string; payload: unknown }[];
}

/** Runs a module alone, feeding it the `given` events in order, and returns what it emitted. */
export function runFixture(module: Module, fixture: Fixture): EventDraft[] {
  const { manifest } = module;
  const seed = fixture.seed ?? 'fixture';
  const clock = new WorldClock();
  for (let i = 0; i < (fixture.turn ?? 0); i++) clock.advance();
  const random = new SeededRandom(seed);
  const ports: Ports = { random, clock, telemetry: { record: () => undefined } };
  const instance = module.createModule({
    moduleId: manifest.id,
    rng: random.stream(manifest.id),
    clock,
    ports,
    config: fixture.config,
  });

  const emitted: EventDraft[] = [];
  fixture.given.forEach((event, i) => {
    const handler = instance.handlers[event.type];
    if (!handler) return;
    const envelope: Envelope = {
      id: `g${i + 1}`,
      type: event.type,
      v: EVENT_VERSIONS[event.type as CoreEventType] ?? 1,
      runId: 'fixture',
      turn: clock.now().turn,
      source: 'fixture',
      payload: event.payload,
    };
    for (const draft of handler(envelope) ?? []) {
      if (!manifest.emits.includes(draft.type)) {
        throw new Error(`${manifest.id} emitted undeclared event ${draft.type}`);
      }
      emitted.push({ type: draft.type, payload: draft.payload });
    }
  });
  if (manifest.contractsVersion !== CONTRACTS_VERSION) {
    throw new Error(`${manifest.id} targets contracts v${manifest.contractsVersion}`);
  }
  return emitted;
}

export function assertFixture(module: Module, fixture: Fixture): void {
  const actual = canonicalize(runFixture(module, fixture));
  const wanted = canonicalize(fixture.expect);
  if (actual !== wanted) {
    throw new Error(
      `fixture ${fixture.name ?? ''} failed\n  expected ${wanted}\n  actual   ${actual}`,
    );
  }
}
