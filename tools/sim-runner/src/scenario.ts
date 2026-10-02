import type { Locale, Module } from '@je/contracts';
import { choiceModule } from '@je/mod-choice';
import { contentModule, formatDiagnostics, hasErrors, loadContent } from '@je/mod-content';
import { directorModule } from '@je/mod-director';
import { educationModule } from '@je/mod-education';
import { knowledgeModule } from '@je/mod-knowledge';
import { narrativeModule } from '@je/mod-narrative';
import { riskModule } from '@je/mod-risk';
import { simCoreModule } from '@je/mod-sim-core';
import { socialModule } from '@je/mod-social';
import { relationshipsModule } from '@je/mod-relationships';
import { closeModule } from '@je/mod-close';
import { workloadModule } from '@je/mod-workload';
import { directorySource } from '@je/pack-validator';
import type { BotOptions } from './runner';

export const SALES_ROLE = 'role.sales.export.specialist';
export const QC_ROLE = 'role.qc.specialist';
export const FIN_ROLE = 'role.fin.accountant';
export const PROD_ROLE = 'role.prod.planner';
export const PURCH_ROLE = 'role.purch.buyer';

/** The three pressure scenes of the Sales Specialist's week (Monday, Wednesday, Friday). */
export const SALES_WEEK_SCENES = [
  'scene.sales.shipment_pull_in',
  'scene.sales.rfq_discount',
  'scene.sales.forecast_meeting',
] as const;

export interface Scenario {
  modules: Module[];
  configs: Record<string, unknown>;
  turns: number;
  bot: BotOptions;
}

export interface ScenarioOptions {
  contentDir: string;
  locale?: Locale;
  /** Override the scenario's default number of weeks. */
  turns?: number;
}

/** The three scenes in week 0 only. */
function salesScript(): Record<string, string[]> {
  return { '0': [...SALES_WEEK_SCENES] };
}

/** Scenarios by name: which job, how long, and whether the director (not a script) picks events. */
const SCENARIOS: Record<string, { roleId: string; turns: number; directed: boolean }> = {
  'sales-week': { roleId: SALES_ROLE, turns: 4, directed: false },
  'sales-year': { roleId: SALES_ROLE, turns: 52, directed: true },
  'qc-year': { roleId: QC_ROLE, turns: 52, directed: true },
  'fin-year': { roleId: FIN_ROLE, turns: 52, directed: true },
  'prod-year': { roleId: PROD_ROLE, turns: 52, directed: true },
  'purch-year': { roleId: PURCH_ROLE, turns: 52, directed: true },
};

/**
 * Real Phase 1 modules on real content, for one Sales Specialist.
 *   sales-week: the three pressure scenes scripted into week 0, then quiet weeks (4 weeks).
 *   sales-year, qc-year: the director draws one or two events a week, for that job, for a year.
 * Both track what the player did as facts, let word get around (knowledge and social), run real
 * detection, audits and endings (risk), and end with a debrief (education).
 */
export async function loadScenario(name: string, options: ScenarioOptions): Promise<Scenario> {
  const shape = SCENARIOS[name];
  if (!shape)
    throw new Error(`unknown scenario "${name}" (try ${Object.keys(SCENARIOS).join(', ')})`);

  const { registry, diagnostics } = await loadContent(directorySource(options.contentDir));
  if (!registry || hasErrors(diagnostics)) {
    throw new Error(`content is invalid:
${formatDiagnostics(diagnostics)}`);
  }
  if (!registry.get('role', shape.roleId)) {
    throw new Error(`role "${shape.roleId}" not found in ${options.contentDir}`);
  }
  const turns = options.turns ?? shape.turns;
  return {
    modules: [
      contentModule,
      simCoreModule,
      workloadModule,
      closeModule,
      choiceModule,
      ...(shape.directed ? [directorModule] : []),
      knowledgeModule,
      relationshipsModule,
      socialModule,
      riskModule,
      narrativeModule,
      educationModule,
    ],
    configs: {
      'mod-content': { registry },
      'sim-core': { content: registry, roleId: shape.roleId },
      workload: { content: registry, roleId: shape.roleId },
      close: { content: registry, roleId: shape.roleId },
      choice: { content: registry },
      ...(shape.directed ? { director: { content: registry } } : {}),
      knowledge: { content: registry },
      // Real detectors (risk) replace social's stand-in leak.
      social: { content: registry, leakPerSeverity: 0 },
      relationships: { content: registry },
      risk: { content: registry },
      education: { content: registry, locale: options.locale ?? 'en' },
      narrative: {
        content: registry,
        locale: options.locale ?? 'en',
        script: shape.directed ? {} : salesScript(),
        patienceTurns: 1,
      },
    },
    turns,
    bot: { phases: ['plan', 'resolve', 'consequence'], answerRate: 0.9 },
  };
}
