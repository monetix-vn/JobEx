#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ReplayLog } from '@je/contracts';
import { fingerprint, canonicalize, replay } from '@je/kernel';
import { stubModules } from '@je/mod-stubs';
import { toyModule } from '@je/mod-toy';
import {
  checkDeterminism,
  modulesForLog,
  runHeadless,
  WEEKS_PER_RUN,
  type BotOptions,
  type HeadlessOptions,
} from './runner';
import { loadScenario } from './scenario';

const USAGE = `sim-runner: headless simulation runs

  run    --seed <s> [--weeks 52] [--toy] [--out log.json]   run and summarise (stub modules)
  replay <log.json>                                         re-run a log, demand identical output
  check  --seed <s> [--weeks 52] [--toy]                    determinism gate (exit 1 on failure)

  --policy random|first|last   how the test player chooses: random, careful, or reckless

  Add --scenario sales-week|sales-year|qc-year [--content content] [--locale vi|en] to any command to run
  the real Phase 1 modules on the content packs instead of the stubs.`;

function parseFlags(args: string[]): { flags: Map<string, string>; rest: string[] } {
  const flags = new Map<string, string>();
  const rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i] as string;
    if (!arg.startsWith('--')) {
      rest.push(arg);
    } else if (arg === '--toy') {
      flags.set('toy', 'true');
    } else {
      flags.set(arg.slice(2), args[++i] ?? '');
    }
  }
  return { flags, rest };
}

function summarise(log: ReplayLog): string {
  const count = (type: string): number => log.entries.filter((e) => e.type === type).length;
  const outcomes = (o: string): number =>
    log.entries.filter(
      (e) => e.type === 'choice.resolved' && (e.payload as { outcome: string }).outcome === o,
    ).length;
  const lines = [
    `seed ${log.seed}, ${log.turns} weeks (${(log.turns / 52).toFixed(1)} years), ${log.entries.length} messages`,
    `modules: ${log.modules.map((m) => m.id).join(', ')}`,
    `scenes ${count('scene.started')}, player choices ${log.inputs.length}, ok ${outcomes('ok')}, fail ${outcomes('fail')}, ignored ${outcomes('ignored')}`,
  ];
  const sim = log.finalState['sim-core'] as Record<string, unknown> | undefined;
  if (sim) {
    const keys = [
      'player.stress',
      'player.health',
      'player.cash_vnd',
      'player.rep.boss',
      'player.rep.buyer',
    ];
    lines.push(`final state: ${keys.map((k) => `${k}=${String(sim[k] ?? 0)}`).join(', ')}`);
  }
  lines.push(`fingerprint ${fingerprint(canonicalize(log))}`);
  return lines.join('\n');
}

async function options(flags: Map<string, string>): Promise<HeadlessOptions> {
  const seed = flags.get('seed') ?? 'default';
  const scenario = flags.get('scenario');
  if (scenario) {
    const s = await loadScenario(scenario, {
      contentDir: resolve(flags.get('content') ?? 'content'),
      locale: flags.get('locale') === 'vi' ? 'vi' : 'en',
      ...(flags.has('weeks') ? { turns: Number(flags.get('weeks')) } : {}),
    });
    const policy = flags.get('policy');
    const bot: BotOptions =
      policy === 'first' || policy === 'last' || policy === 'random' ? { ...s.bot, policy } : s.bot;
    return { seed, turns: s.turns, modules: s.modules, configs: s.configs, bot };
  }
  return {
    seed,
    turns: Number(flags.get('weeks') ?? WEEKS_PER_RUN),
    modules: flags.has('toy') ? [...stubModules, toyModule] : stubModules,
  };
}

async function main(argv: string[]): Promise<number> {
  const [command, ...args] = argv;
  const { flags, rest } = parseFlags(args);

  switch (command) {
    case 'run': {
      const log = runHeadless(await options(flags));
      console.log(summarise(log));
      const out = flags.get('out');
      if (out) writeFileSync(out, JSON.stringify(log));
      return 0;
    }
    case 'replay': {
      const file = rest[0];
      if (!file) break;
      const log = JSON.parse(readFileSync(file, 'utf8')) as ReplayLog;
      const opts = flags.has('scenario') ? await options(flags) : undefined;
      const result = replay(
        log,
        opts?.modules ?? modulesForLog(log),
        opts?.configs ? { configs: opts.configs } : {},
      );
      console.log(
        result.ok
          ? `OK: replay is identical (${log.entries.length} messages)`
          : `FAIL: ${result.reason}`,
      );
      return result.ok ? 0 : 1;
    }
    case 'check': {
      const opts = await options(flags);
      const report = checkDeterminism(opts);
      if (report.ok) {
        console.log(`OK: ${opts.turns}-week run is deterministic and replays identically`);
        console.log(`    ${report.entries} messages, fingerprint ${report.fingerprint}`);
        return 0;
      }
      for (const problem of report.problems) console.error(`FAIL: ${problem}`);
      return 1;
    }
    default:
  }
  console.error(USAGE);
  return 2;
}

process.exitCode = await main(process.argv.slice(2));
