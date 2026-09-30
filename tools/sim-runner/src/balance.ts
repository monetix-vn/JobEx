import type { CoreEventPayloads, ReplayLog } from '@je/contracts';
import { runHeadless, type BotOptions } from './runner';
import { loadScenario } from './scenario';

export type Policy = NonNullable<BotOptions['policy']>;

export interface PolicyStats {
  policy: Policy;
  runs: number;
  /** How many runs ended each way: completed, promoted, fired, prosecuted, burnout, walked_away. */
  endings: Record<string, number>;
  /** Weeks played: smallest, median, largest. */
  weeks: [number, number, number];
  /** Choices the player made in a run: smallest, mean, largest. */
  decisions: [number, number, number];
  /** Stress at the end of the run, mean. */
  stress: number;
  /** Share of runs in which each storyline started, by arc id. */
  arcs: Record<string, number>;
}

const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? 0;
};

function endingOf(log: ReplayLog): string {
  const ended = log.entries.find((e) => e.type === 'run.ended');
  return (ended?.payload as CoreEventPayloads['run.ended'] | undefined)?.ending ?? 'completed';
}

/** Plays a scenario many times with one test policy and summarises how the runs went. */
export async function balanceStats(
  scenarioName: string,
  policy: Policy,
  runs: number,
  contentDir: string,
): Promise<PolicyStats> {
  const scenario = await loadScenario(scenarioName, { contentDir });
  const endings: Record<string, number> = {};
  const arcs: Record<string, number> = {};
  const weeks: number[] = [];
  const decisions: number[] = [];
  let stress = 0;
  for (let i = 0; i < runs; i++) {
    const log = runHeadless({
      seed: `balance-${i}`,
      turns: scenario.turns,
      modules: scenario.modules,
      configs: scenario.configs,
      bot: { ...scenario.bot, policy },
    });
    const ending = endingOf(log);
    endings[ending] = (endings[ending] ?? 0) + 1;
    weeks.push(log.turns);
    decisions.push(log.entries.filter((e) => e.type === 'choice.resolved').length);
    const sim = log.finalState['sim-core'] as Record<string, number> | undefined;
    stress += sim?.['player.stress'] ?? 0;
    for (const e of log.entries) {
      if (e.type === 'arc.started') {
        const arc = (e.payload as { arc: string }).arc;
        arcs[arc] = (arcs[arc] ?? 0) + 1;
      }
    }
  }
  const mean = decisions.reduce((a, b) => a + b, 0) / runs;
  return {
    policy,
    runs,
    endings,
    weeks: [Math.min(...weeks), median(weeks), Math.max(...weeks)],
    decisions: [Math.min(...decisions), Math.round(mean * 10) / 10, Math.max(...decisions)],
    stress: Math.round((stress / runs) * 10) / 10,
    arcs: Object.fromEntries(
      Object.entries(arcs)
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([id, n]) => [id, Math.round((n / runs) * 100) / 100]),
    ),
  };
}

/** A markdown section for one scenario: one row per test policy. */
export async function balanceMarkdown(
  scenarioName: string,
  runs: number,
  contentDir: string,
): Promise<string> {
  const lines = [
    `### ${scenarioName}`,
    '',
    '| Player | Endings | Weeks (min/median/max) | Decisions (min/mean/max) | Final stress | Storylines started |',
    '| ------ | ------- | ---------------------- | ------------------------ | ------------ | ------------------ |',
  ];
  const names: Record<Policy, string> = { first: 'careful', random: 'random', last: 'reckless' };
  for (const policy of ['first', 'random', 'last'] as Policy[]) {
    const s = await balanceStats(scenarioName, policy, runs, contentDir);
    const endings = Object.entries(s.endings)
      .sort(([, a], [, b]) => b - a)
      .map(([k, n]) => `${k} ${n}`)
      .join(', ');
    const arcs = Object.entries(s.arcs)
      .map(([id, share]) => `${id.replace('arc.', '')} ${Math.round(share * 100)}%`)
      .join(', ');
    lines.push(
      `| ${names[policy]} | ${endings} | ${s.weeks.join(' / ')} | ${s.decisions.join(' / ')} | ${s.stress} | ${arcs || '-'} |`,
    );
  }
  return lines.join('\n');
}
