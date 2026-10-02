import type { Transport } from '@je/client-web';
import type { Locale, Module, PlayerProfile, RecordedInput } from '@je/contracts';
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
import { profileEffects } from '@je/mod-people';
import { educationModule } from '@je/mod-education';
import { knowledgeModule } from '@je/mod-knowledge';
import { narrativeModule } from '@je/mod-narrative';
import { riskModule } from '@je/mod-risk';
import { simCoreModule } from '@je/mod-sim-core';
import { socialModule } from '@je/mod-social';
import { relationshipsModule } from '@je/mod-relationships';
import { closeModule } from '@je/mod-close';
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

export const SALES_ROLE = 'role.sales.export.specialist';
export const QC_ROLE = 'role.qc.specialist';
export const FIN_ROLE = 'role.fin.accountant';
export const PROD_ROLE = 'role.prod.planner';
export const PURCH_ROLE = 'role.purch.buyer';
export const INV_ROLE = 'role.inv.analyst';
export const IT_ROLE = 'role.it.admin';
export const MKT_ROLE = 'role.mkt.brand';
export const FPA_ROLE = 'role.fpa.analyst';
export const SUP_ROLE = 'role.prod.supervisor';
export const HR_ROLE = 'role.hr.hrbp';

export interface GameHostOptions {
  /** Content pack files by path relative to the content root, e.g. "core/manifest.json". */
  files: Record<string, string>;
  seed: string;
  /** Which job the player has. Default: the sales specialist. */
  roleId?: string;
  locale?: Locale;
  turns?: number;
  /** Who the player is (age, background, money and home); it sets the start of the run. */
  profile?: PlayerProfile;
}

export interface GameHost {
  run: Run;
  transport: Transport;
  turns: number;
  modules: Module[];
  configs: Record<string, unknown>;
}

/**
 * Phase 1: the real modules on the real content, for one job (sales or QC). The director draws one
 * or two events a week from the pool (by season, stress, cooldown and weight) and plays scheduled
 * consequences when they come due. Scenes never time out here: a person plays at their own pace.
 */
export async function createGameHost(options: GameHostOptions): Promise<GameHost> {
  const roleId = options.roleId ?? SALES_ROLE;
  const { registry, diagnostics } = await loadContent(memorySource(options.files));
  if (!registry || hasErrors(diagnostics)) {
    throw new Error(`content is invalid:\n${formatDiagnostics(diagnostics)}`);
  }
  const turns = options.turns ?? 52;
  const modules: Module[] = [
    contentModule,
    simCoreModule,
    workloadModule,
    closeModule,
    choiceModule,
    directorModule,
    knowledgeModule,
    relationshipsModule,
    socialModule,
    riskModule,
    narrativeModule,
    educationModule,
  ];
  const configs = {
    'mod-content': { registry },
    'sim-core': {
      content: registry,
      roleId,
      ...(options.profile ? { start: profileEffects(options.profile) } : {}),
    },
    workload: { content: registry, roleId },
    close: { content: registry, roleId },
    choice: { content: registry },
    director: { content: registry },
    knowledge: { content: registry },
    social: { content: registry, leakPerSeverity: 0 },
    relationships: { content: registry },
    risk: { content: registry },
    education: { content: registry, locale: options.locale ?? 'en' },
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

/** The sales specialist game; kept for callers that do not choose a job. */
export const createSalesHost = (options: GameHostOptions): Promise<GameHost> =>
  createGameHost({ ...options, roleId: options.roleId ?? SALES_ROLE });

export interface PlayableRole {
  id: string;
  title: string;
  blurb: string;
  department: string;
  departmentTitle: string;
}

/** The jobs a player can pick: roles that have a blurb, with their text in the given language. */
export async function listPlayableRoles(
  files: Record<string, string>,
  locale: Locale,
): Promise<PlayableRole[]> {
  const { registry, diagnostics } = await loadContent(memorySource(files));
  if (!registry || hasErrors(diagnostics)) {
    throw new Error(`content is invalid:\n${formatDiagnostics(diagnostics)}`);
  }
  return registry
    .all('role')
    .filter((r) => r.blurb_key)
    .sort((a, b) =>
      a.department < b.department ? -1 : a.department > b.department ? 1 : a.id < b.id ? -1 : 1,
    )
    .map((r) => ({
      id: r.id,
      title: registry.text(locale, r.title_key) ?? r.id,
      blurb: registry.text(locale, r.blurb_key!) ?? '',
      department: r.department,
      departmentTitle: registry.text(locale, `${r.department}.title`) ?? r.department,
    }));
}
