import type { Locale, Module } from '@je/contracts';
import { choiceModule } from '@je/mod-choice';
import { contentModule, formatDiagnostics, hasErrors, loadContent } from '@je/mod-content';
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

/** The scenes repeat every `everyWeeks` weeks from week 0. */
function salesScript(turns: number, everyWeeks: number): Record<string, string[]> {
  const script: Record<string, string[]> = {};
  for (let turn = 0; turn < turns; turn += everyWeeks)
    script[String(turn)] = [...SALES_WEEK_SCENES];
  return script;
}

/**
 * Real Phase 1 block A modules on real content, for one Sales Specialist.
 *   sales-week: the three scenes in week 0, then quiet weeks (default 4 weeks).
 *   sales-year: the three scenes every fourth week for a year.
 */
export async function loadScenario(name: string, options: ScenarioOptions): Promise<Scenario> {
  const shape =
    name === 'sales-week'
      ? { turns: 4, every: Number.POSITIVE_INFINITY }
      : name === 'sales-year'
        ? { turns: 52, every: 4 }
        : undefined;
  if (!shape) throw new Error(`unknown scenario "${name}" (try sales-week or sales-year)`);

  const { registry, diagnostics } = await loadContent(directorySource(options.contentDir));
  if (!registry || hasErrors(diagnostics)) {
    throw new Error(`content is invalid:\n${formatDiagnostics(diagnostics)}`);
  }
  if (!registry.get('role', SALES_ROLE)) {
    throw new Error(`role "${SALES_ROLE}" not found in ${options.contentDir}`);
  }
  const turns = options.turns ?? shape.turns;
  return {
    modules: [contentModule, simCoreModule, workloadModule, choiceModule, narrativeModule],
    configs: {
      'mod-content': { registry },
      'sim-core': { content: registry, roleId: SALES_ROLE },
      workload: { content: registry, roleId: SALES_ROLE },
      choice: { content: registry },
      narrative: {
        content: registry,
        locale: options.locale ?? 'en',
        script: salesScript(turns, shape.every),
        patienceTurns: 1,
      },
    },
    turns,
    bot: { phases: ['plan', 'resolve', 'consequence'], answerRate: 0.9 },
  };
}
