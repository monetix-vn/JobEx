import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Envelope, ReplayLog } from '@je/contracts';
import { canonicalize, replay } from '@je/kernel';
import { stubModules } from '@je/mod-stubs';
import { toyModule } from '@je/mod-toy';
import { checkDeterminism, modulesForLog, runHeadless } from '../src';
import { expectPin } from './pins';

/** What the original modules did, ignoring ids (which shift when another module adds events). */
function projection(log: ReplayLog, exclude: string): unknown[] {
  return log.entries
    .filter((e: Envelope) => e.source !== exclude)
    .map(({ type, source, turn, v, payload }) => ({
      type,
      source,
      turn,
      v,
      // run.started lists the loaded modules, which legitimately differs.
      payload: type === 'run.started' ? { seed: (payload as { seed: string }).seed } : payload,
    }));
}

describe('Phase 0 gate: a headless 1-year run', () => {
  const log = runHeadless({ seed: 'gate', turns: 52 });

  it('completes: 52 weeks, a real run with events, scenes and player choices', () => {
    expect(log.turns).toBe(52);
    const types = new Set(log.entries.map((e) => e.type));
    for (const t of [
      'run.started',
      'clock.ticked',
      'sim.weekSettled',
      'director.eventFired',
      'scene.started',
      'choice.made',
      'choice.resolved',
      'run.ended',
    ]) {
      expect(types.has(t), t).toBe(true);
    }
    expect(log.entries.filter((e) => e.type === 'clock.ticked')).toHaveLength(52);
    expect(log.inputs.length).toBeGreaterThan(0);
    expect(log.entries.at(-1)?.type).toBe('run.ended');
    // Both answered and expired scenes occur, so both code paths are exercised.
    const outcomes = new Set(
      log.entries
        .filter((e) => e.type === 'choice.resolved')
        .map((e) => (e.payload as { outcome: string }).outcome),
    );
    expect(outcomes.has('ignored')).toBe(true);
    expect([...outcomes].some((o) => o === 'ok' || o === 'fail')).toBe(true);
  });

  it('replays identically from the seed and recorded choices', () => {
    const result = replay(log, stubModules);
    expect(result.ok, result.reason).toBe(true);
    expect(canonicalize(result.log)).toBe(canonicalize(log));
  });

  it('replays identically after being saved as JSON and reloaded', () => {
    const loaded = JSON.parse(JSON.stringify(log)) as ReplayLog;
    expect(replay(loaded, modulesForLog(loaded)).ok).toBe(true);
  });

  it('two independent runs from the same seed are byte-identical', () => {
    expect(canonicalize(runHeadless({ seed: 'gate', turns: 52 }))).toBe(canonicalize(log));
  });

  it('different seeds tell different stories', () => {
    expect(canonicalize(runHeadless({ seed: 'other', turns: 52 }).entries)).not.toBe(
      canonicalize(log.entries),
    );
  });

  it('holds over many seeds and longer runs', () => {
    for (const seed of ['1', '2', '3', 'alpha', 'beta']) {
      const report = checkDeterminism({ seed, turns: 104 });
      expect(report.problems, seed).toEqual([]);
    }
  });

  it('the fingerprint for a fixed seed is pinned, so accidental behaviour changes are caught', () => {
    const report = checkDeterminism({ seed: '2026', turns: 52 });
    expect(report.ok).toBe(true);
    expectPin('stub-year.2026', report.fingerprint);
  });

  it('detects a tampered log', () => {
    const tampered = JSON.parse(JSON.stringify(log)) as ReplayLog;
    const i = tampered.entries.findIndex((e) => e.type === 'sim.weekSettled');
    (tampered.entries[i]!.payload as { cash: number }).cash += 1;
    const result = replay(tampered, stubModules);
    expect(result.ok).toBe(false);
    expect(result.firstMismatch).toBe(i);
  });
});

describe('Phase 0 gate: a new module is added without changing existing modules', () => {
  const baseline = runHeadless({ seed: 'toy', turns: 52 });
  const withToy = runHeadless({ seed: 'toy', turns: 52, modules: [...stubModules, toyModule] });

  it('the toy module takes part in the run', () => {
    const tallies = withToy.entries.filter((e) => e.type === 'toy.tallied');
    expect(tallies).toHaveLength(52);
    expect(tallies.every((e) => e.source === 'toy-tally' && e.causedBy)).toBe(true);
    expect(withToy.modules.map((m) => m.id)).toContain('toy-tally');
  });

  it('every other module behaves exactly as before: same messages, same inputs, same state', () => {
    expect(projection(withToy, 'toy-tally')).toEqual(projection(baseline, 'toy-tally'));
    expect(withToy.inputs).toEqual(baseline.inputs);
    const others = { ...(withToy.finalState as Record<string, unknown>) };
    delete others['toy-tally'];
    expect(others).toEqual(baseline.finalState);
  });

  it('the combined run replays identically too', () => {
    expect(replay(withToy, [...stubModules, toyModule]).ok).toBe(true);
    expect(replay(withToy, modulesForLog(withToy)).ok).toBe(true);
  });

  it('a log made without the toy refuses to replay with it (module set is part of the log)', () => {
    expect(replay(baseline, [...stubModules, toyModule]).ok).toBe(false);
  });
});

describe('sim-runner CLI', () => {
  const cli = join(import.meta.dirname, '..', 'src', 'cli.ts');
  const root = join(import.meta.dirname, '..', '..', '..');
  const run = (...args: string[]) =>
    spawnSync(process.execPath, ['--import', 'tsx', cli, ...args], { cwd: root, encoding: 'utf8' });

  it('check passes with exit code 0', () => {
    const result = run('check', '--seed', '9', '--weeks', '52', '--toy');
    expect(result.stdout).toContain('OK: 52-week run is deterministic');
    expect(result.status).toBe(0);
  });

  it('run writes a log that replay accepts, and replay rejects a doctored one', () => {
    const dir = mkdtempSync(join(tmpdir(), 'je-sim-'));
    try {
      const file = join(dir, 'log.json');
      execFileSync(
        process.execPath,
        ['--import', 'tsx', cli, 'run', '--seed', '5', '--out', file],
        { cwd: root },
      );
      const ok = run('replay', file);
      expect(ok.status).toBe(0);
      expect(ok.stdout).toContain('OK: replay is identical');

      const log = JSON.parse(
        execFileSync(
          process.execPath,
          [
            '-e',
            `process.stdout.write(require('fs').readFileSync(${JSON.stringify(file)},'utf8'))`,
          ],
          { encoding: 'utf8' },
        ),
      ) as ReplayLog;
      (log.entries.find((e) => e.type === 'sim.weekSettled')!.payload as { cash: number }).cash =
        -1;
      const bad = join(dir, 'bad.json');
      writeFileSync(bad, JSON.stringify(log));
      const failed = run('replay', bad);
      expect(failed.status).toBe(1);
      expect(failed.stdout).toContain('FAIL');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('prints usage and exits 2 for an unknown command', () => {
    expect(run('bogus').status).toBe(2);
  });
});
