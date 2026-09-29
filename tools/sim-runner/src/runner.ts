import type { CoreEventPayloads, Envelope, Module, ReplayLog } from '@je/contracts';
import { Run, SeededRandom, canonicalize, fingerprint, replay, type PhaseHook } from '@je/kernel';
import { stubModules } from '@je/mod-stubs';
import { toyModule } from '@je/mod-toy';

export const WEEKS_PER_RUN = 52;

const KNOWN: readonly Module[] = [...stubModules, toyModule];

/** Picks the module set a recorded log was made with, so `replay <file>` needs no flags. */
export function modulesForLog(log: ReplayLog): Module[] {
  return log.modules.map(({ id, version }) => {
    const found = KNOWN.find((m) => m.manifest.id === id && m.manifest.version === version);
    if (!found) throw new Error(`unknown module ${id}@${version}; add it to the runner's registry`);
    return found;
  });
}

/**
 * A seeded, scripted stand-in for a player. It answers about three scenes in four, always in the
 * consequence phase, and its own RNG stream never touches the modules' streams.
 */
export function createBot(seed: string): { hook: PhaseHook; observe: (e: Envelope) => void } {
  const rng = new SeededRandom(seed).stream('sim-runner.bot');
  const pending = new Map<string, string[]>();
  return {
    observe(envelope) {
      if (envelope.type === 'scene.started') {
        const p = envelope.payload as CoreEventPayloads['scene.started'];
        pending.set(
          p.sceneId,
          p.choices.map((c) => c.id),
        );
      } else if (envelope.type === 'choice.resolved') {
        pending.delete((envelope.payload as CoreEventPayloads['choice.resolved']).sceneId);
      }
    },
    hook(phase, run) {
      if (phase !== 'consequence') return;
      for (const [sceneId, choices] of [...pending.entries()].sort()) {
        if (!rng.chance(0.75)) continue;
        run.submit('choice.made', { sceneId, choiceId: rng.pick(choices) });
      }
    },
  };
}

export interface HeadlessOptions {
  seed: string;
  turns?: number;
  modules?: readonly Module[];
  configs?: Record<string, unknown>;
}

export function runHeadless(options: HeadlessOptions): ReplayLog {
  const { seed, turns = WEEKS_PER_RUN, modules = stubModules, configs } = options;
  const run = new Run({ seed, modules, ...(configs ? { configs } : {}) });
  const bot = createBot(seed);
  run.observe(bot.observe);
  run.start();
  run.runTurns(turns, bot.hook);
  run.end();
  return run.exportLog();
}

export interface CheckReport {
  ok: boolean;
  fingerprint: string;
  entries: number;
  problems: string[];
}

/** The Phase 0 determinism gate: same seed twice, a replay from the log, and a different seed. */
export function checkDeterminism(options: HeadlessOptions): CheckReport {
  const modules = options.modules ?? stubModules;
  const problems: string[] = [];
  const first = runHeadless(options);
  const second = runHeadless(options);
  const a = canonicalize(first);
  if (a !== canonicalize(second))
    problems.push('two runs from the same seed produced different logs');

  const replayed = replay(first, modules);
  if (!replayed.ok) {
    problems.push(`replay from the recorded log diverged: ${replayed.reason ?? 'unknown'}`);
  }

  const other = runHeadless({ ...options, seed: `${options.seed}-other` });
  if (canonicalize(other.entries) === canonicalize(first.entries)) {
    problems.push('a different seed produced the same log; the seed is not being used');
  }
  return {
    ok: problems.length === 0,
    fingerprint: fingerprint(a),
    entries: first.entries.length,
    problems,
  };
}
