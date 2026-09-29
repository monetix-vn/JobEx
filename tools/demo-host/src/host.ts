import type { Transport } from '@je/client-web';
import type { Locale, Module } from '@je/contracts';
import { Run } from '@je/kernel';
import { choiceModule } from '@je/mod-choice';
import {
  contentModule,
  formatDiagnostics,
  hasErrors,
  loadContent,
  memorySource,
} from '@je/mod-content';
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
const SALES_SCENES = [
  'scene.sales.shipment_pull_in',
  'scene.sales.rfq_discount',
  'scene.sales.forecast_meeting',
];

export interface SalesHostOptions {
  /** Content pack files by path relative to the content root, e.g. "core/manifest.json". */
  files: Record<string, string>;
  seed: string;
  locale?: Locale;
  /** Weeks between repeats of the three pressure scenes. */
  everyWeeks?: number;
  turns?: number;
}

/**
 * Phase 1 block A: the real modules on the real content, for one Sales Specialist. The scene
 * script mirrors tools/sim-runner's scenario (the browser build cannot import that tool).
 * Scenes never time out here: a person plays at their own pace.
 */
export async function createSalesHost(options: SalesHostOptions): Promise<{
  run: Run;
  transport: Transport;
  turns: number;
  modules: Module[];
  configs: Record<string, unknown>;
}> {
  const { registry, diagnostics } = await loadContent(memorySource(options.files));
  if (!registry || hasErrors(diagnostics)) {
    throw new Error(`content is invalid:\n${formatDiagnostics(diagnostics)}`);
  }
  const turns = options.turns ?? 52;
  const every = options.everyWeeks ?? 4;
  const script: Record<string, string[]> = {};
  for (let turn = 0; turn < turns; turn += every) script[String(turn)] = [...SALES_SCENES];

  const modules: Module[] = [
    contentModule,
    simCoreModule,
    workloadModule,
    choiceModule,
    narrativeModule,
  ];
  const configs = {
    'mod-content': { registry },
    'sim-core': { content: registry, roleId: SALES_ROLE },
    workload: { content: registry, roleId: SALES_ROLE },
    choice: { content: registry },
    narrative: {
      content: registry,
      locale: options.locale ?? 'en',
      script,
      patienceTurns: Number.MAX_SAFE_INTEGER,
    },
  };
  const run = new Run({ seed: options.seed, modules, configs });
  run.start();
  return { run, transport: toTransport(run), turns, modules, configs };
}
