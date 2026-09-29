#!/usr/bin/env tsx
import { readFileSync, writeFileSync } from 'node:fs';
import type { ReplayLog } from '@je/contracts';
import { fingerprint, canonicalize, replay } from '@je/kernel';
import { stubModules } from '@je/mod-stubs';
import { toyModule } from '@je/mod-toy';
import { checkDeterminism, modulesForLog, runHeadless, WEEKS_PER_RUN } from './runner';

const USAGE = `sim-runner: headless simulation runs

  run    --seed <s> [--weeks 52] [--toy] [--out log.json]   run and summarise
  replay <log.json>                                         re-run a log, demand identical output
  check  --seed <s> [--weeks 52] [--toy]                    determinism gate (exit 1 on failure)`;

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
  return [
    `seed ${log.seed}, ${log.turns} weeks (${(log.turns / 52).toFixed(1)} years), ${log.entries.length} messages`,
    `modules: ${log.modules.map((m) => m.id).join(', ')}`,
    `scenes ${count('scene.started')}, player choices ${log.inputs.length}, ignored ${
      log.entries.filter(
        (e) =>
          e.type === 'choice.resolved' && (e.payload as { outcome: string }).outcome === 'ignored',
      ).length
    }`,
    `fingerprint ${fingerprint(canonicalize(log))}`,
  ].join('\n');
}

function main(argv: string[]): number {
  const [command, ...args] = argv;
  const { flags, rest } = parseFlags(args);
  const options = () => ({
    seed: flags.get('seed') ?? 'default',
    turns: Number(flags.get('weeks') ?? WEEKS_PER_RUN),
    modules: flags.has('toy') ? [...stubModules, toyModule] : stubModules,
  });

  switch (command) {
    case 'run': {
      const log = runHeadless(options());
      console.log(summarise(log));
      const out = flags.get('out');
      if (out) writeFileSync(out, JSON.stringify(log));
      return 0;
    }
    case 'replay': {
      const file = rest[0];
      if (!file) break;
      const log = JSON.parse(readFileSync(file, 'utf8')) as ReplayLog;
      const result = replay(log, modulesForLog(log));
      console.log(
        result.ok
          ? `OK: replay is identical (${log.entries.length} messages)`
          : `FAIL: ${result.reason}`,
      );
      return result.ok ? 0 : 1;
    }
    case 'check': {
      const report = checkDeterminism(options());
      if (report.ok) {
        console.log(`OK: ${options().turns}-week run is deterministic and replays identically`);
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

process.exitCode = main(process.argv.slice(2));
