import { join } from 'node:path';
import type { Envelope, ReplayLog } from '@je/contracts';
import { loadScenario, runHeadless, type BotOptions } from '../src';

/** Shared by the integration tests: play a scenario headlessly and read its log. */
export const contentDir = join(import.meta.dirname, '..', '..', '..', 'content');

export async function play(
  name: string,
  seed: string,
  locale: 'en' | 'vi' = 'en',
  turns?: number,
  bot?: Partial<BotOptions>,
) {
  const scenario = await loadScenario(name, { contentDir, locale, ...(turns ? { turns } : {}) });
  const log = runHeadless({
    seed,
    turns: scenario.turns,
    modules: scenario.modules,
    configs: scenario.configs,
    bot: { ...scenario.bot, ...bot },
  });
  return { scenario, log };
}
export const of = (log: ReplayLog, type: string): Envelope[] =>
  log.entries.filter((e) => e.type === type);
export const state = (log: ReplayLog) =>
  log.finalState['sim-core'] as Record<string, number | string>;
