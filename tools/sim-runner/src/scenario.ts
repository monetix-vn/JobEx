import type { Locale, Module } from '@je/contracts';
import { choiceModule } from '@je/mod-choice';
import { contentModule, formatDiagnostics, hasErrors, loadContent } from '@je/mod-content';
import { directorModule } from '@je/mod-director';
import { narrativeModule } from '@je/mod-narrative';
import { simCoreModule } from '@je/mod-sim-core';
import { workloadModule } from '@je/mod-workload';
import { directorySource } from '@je/pack-validator';
import type { BotOptions } from './runner';

export const SALES_ROLE = 'role.sales.export.specialist';

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

/**
 * Real Phase 1 modules on real content, for one Sales Specialist.
 *   sales-week: the three pressure scenes scripted into week 0, then quiet weeks (4 weeks).
 *   sales-year: the director draws one or two events a week from the whole pool for a year.
 */
export async function loadScenario(name: string, options: ScenarioOptions): Promise<Scenario> {
  const shape =
    name === 'sales-week'
      ? { turns: 4, directed: false }
      : name === 'sales-year'
        ? { turns: 52, directed: true }
        : undefined;
  if (!shape) throw new Error(`unknown scenario "${name}" (try sales-week or sales-year)`);

  const { registry, diagnostics } = await loadContent(directorySource(options.contentDir));
  if (!registry || hasErrors(diagnostics)) {
    throw new Error(`content is invalid:
${formatDiagnostics(diagnostics)}`);
  }
  if (!registry.get('role', SALES_ROLE)) {
    throw new Error(`role "${SALES_ROLE}" not found in ${options.contentDir}`);
  }
  const turns = options.turns ?? shape.turns;
  return {
    modules: [
      contentModule,
      simCoreModule,
      workloadModule,
      choiceModule,
      ...(shape.directed ? [directorModule] : []),
      narrativeModule,
    ],
    configs: {
      'mod-content': { registry },
      'sim-core': { content: registry, roleId: SALES_ROLE },
      workload: { content: registry, roleId: SALES_ROLE },
      choice: { content: registry },
      ...(shape.directed ? { director: { content: registry } } : {}),
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
