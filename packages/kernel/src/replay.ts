import type { Module, RecordedInput, ReplayLog, TurnPhase } from '@je/contracts';
import { CONTRACTS_VERSION } from '@je/contracts';
import { canonicalize } from './canonical';
import { Run, type RunOptions } from './run';

export interface ReplayResult {
  ok: boolean;
  /** Index of the first differing log entry, when the logs diverge. */
  firstMismatch?: number;
  reason?: string;
  log: ReplayLog;
}

export type ReplayOptions = Pick<RunOptions, 'configs' | 'telemetry' | 'storage' | 'content'>;

/** Feeds a recorded run's seed and inputs through fresh modules and returns the resulting log. */
export function rerun(
  recorded: ReplayLog,
  modules: readonly Module[],
  options: ReplayOptions = {},
): ReplayLog {
  const run = new Run({ ...options, seed: recorded.seed, runId: recorded.runId, modules });
  run.start();
  const inject = (turn: number, phase: TurnPhase | 'idle'): void => {
    for (const input of recorded.inputs) {
      if (input.turn === turn && input.phase === phase) run.submit(input.type, input.payload);
    }
  };
  for (let turn = 0; turn < recorded.turns; turn++) {
    inject(turn, 'idle');
    run.advanceTurn((phase) => inject(turn, phase));
  }
  inject(recorded.turns, 'idle');
  run.end();
  return run.exportLog();
}

/** Re-runs a recorded log and checks every message and the final state match exactly. */
export function replay(
  recorded: ReplayLog,
  modules: readonly Module[],
  options: ReplayOptions = {},
): ReplayResult {
  const fail = (reason: string, log: ReplayLog, firstMismatch?: number): ReplayResult => ({
    ok: false,
    reason,
    log,
    ...(firstMismatch === undefined ? {} : { firstMismatch }),
  });

  if (recorded.contractsVersion !== CONTRACTS_VERSION) {
    return fail(
      `log is contracts v${recorded.contractsVersion}, kernel has v${CONTRACTS_VERSION}`,
      recorded,
    );
  }
  const wanted = canonicalize(recorded.modules);
  const have = canonicalize(
    [...modules]
      .sort(
        (a, b) =>
          a.manifest.priority - b.manifest.priority || (a.manifest.id < b.manifest.id ? -1 : 1),
      )
      .map((m) => ({ id: m.manifest.id, version: m.manifest.version })),
  );
  if (wanted !== have)
    return fail(`module set differs: log has ${wanted}, replay has ${have}`, recorded);

  const log = rerun(recorded, modules, options);
  const length = Math.max(log.entries.length, recorded.entries.length);
  for (let i = 0; i < length; i++) {
    if (canonicalize(log.entries[i]) !== canonicalize(recorded.entries[i])) {
      return fail(`entry ${i} differs`, log, i);
    }
  }
  if (canonicalize(log.finalState) !== canonicalize(recorded.finalState)) {
    return fail('final module state differs', log);
  }
  return { ok: true, log };
}

export type { RecordedInput };
