import type { Transport } from '@je/client-web';
import type { Locale, Module, RecordedInput } from '@je/contracts';
import { Run } from '@je/kernel';
import { choiceModule } from '@je/mod-choice';
import {
  contentModule,
  formatDiagnostics,
  hasErrors,
  loadContent,
  memorySource,
} from '@je/mod-content';
import { directorModule } from '@je/mod-director';
import { narrativeModule } from '@je/mod-narrative';
import { simCoreModule } from '@je/mod-sim-core';
import { stubModules } from '@je/mod-stubs';
import { workloadModule } from '@je/mod-workload';

/**
 * Composition root: builds an in-process run (stage 0 in the scaling path) and exposes it to the
 * client as a Transport. Moving the run into a Worker or onto a server only changes this file.
 */
function toTransport(run: Run): Transport {
  return {
    subscribe: (listener) => run.observe(listener),
    send: (type, payload) => {
      run.submit(type, payload);
    },
  };
}

/** Phase 0 demo: the stub modules. */
export function createInProcessHost(seed: string): { run: Run; transport: Transport } {
  const run = new Run({ seed, modules: stubModules });
  run.start();
  return { run, transport: toTransport(run) };
}

const SALES_ROLE = 'role.sales.export.specialist';

export interface SalesHostOptions {
  /** Content pack files by path relative to the content root, e.g. "core/manifest.json". */
  files: Record<string, string>;
  seed: string;
  locale?: Locale;
  turns?: number;
}

export interface SalesHost {
  run: Run;
  transport: Transport;
  turns: number;
  modules: Module[];
  configs: Record<string, unknown>;
}

/**
 * Phase 1: the real modules on the real content, for one Sales Specialist. The director draws one
 * or two events a week from the pool (by season, stress, cooldown and weight) and plays scheduled
 * consequences when they come due. Scenes never time out here: a person plays at their own pace.
 */
export async function createSalesHost(options: SalesHostOptions): Promise<SalesHost> {
  const { registry, diagnostics } = await loadContent(memorySource(options.files));
  if (!registry || hasErrors(diagnostics)) {
    throw new Error(`content is invalid:\n${formatDiagnostics(diagnostics)}`);
  }
  const turns = options.turns ?? 52;
  const modules: Module[] = [
    contentModule,
    simCoreModule,
    workloadModule,
    choiceModule,
    directorModule,
    narrativeModule,
  ];
  const configs = {
    'mod-content': { registry },
    'sim-core': { content: registry, roleId: SALES_ROLE },
    workload: { content: registry, roleId: SALES_ROLE },
    choice: { content: registry },
    director: { content: registry },
    narrative: {
      content: registry,
      locale: options.locale ?? 'en',
      patienceTurns: Number.MAX_SAFE_INTEGER,
    },
  };
  const run = new Run({ seed: options.seed, modules, configs });
  run.start();
  return { run, transport: toTransport(run), turns, modules, configs };
}

/**
 * Brings a fresh run to the same point as an earlier one by replaying its recorded player inputs.
 * The simulation does not depend on language, so this is how the game switches language without
 * losing progress: the new run reaches the identical state, with its scenes in the new language.
 * Only inputs made between turns ("idle") can be replayed this way, which is all a person makes.
 */
export function fastForward(run: Run, inputs: readonly RecordedInput[], turns: number): void {
  const inject = (turn: number): void => {
    for (const input of inputs) {
      if (input.turn === turn) run.submit(input.type, input.payload);
    }
  };
  if (inputs.some((input) => input.phase !== 'idle')) {
    throw new Error('fastForward can only replay inputs made between turns');
  }
  for (let turn = 0; turn < turns; turn++) {
    inject(turn);
    run.advanceTurn();
  }
  inject(turns);
}
