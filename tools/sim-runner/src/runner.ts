import type { CoreEventPayloads, Envelope, Module, ReplayLog, TurnPhase } from '@je/contracts';
import { Run, SeededRandom, canonicalize, fingerprint, replay, type PhaseHook } from '@je/kernel';
import { choiceModule } from '@je/mod-choice';
import { contentModule } from '@je/mod-content';
import { directorModule } from '@je/mod-director';
import { narrativeModule } from '@je/mod-narrative';
import { simCoreModule } from '@je/mod-sim-core';
import { stubModules } from '@je/mod-stubs';
import { toyModule } from '@je/mod-toy';
import { workloadModule } from '@je/mod-workload';

export const WEEKS_PER_RUN = 52;

const KNOWN: readonly Module[] = [
  ...stubModules,
  toyModule,
  contentModule,
  simCoreModule,
  workloadModule,
  choiceModule,
  directorModule,
  narrativeModule,
];

/** Picks the module set a recorded log was made with, so `replay <file>` needs no flags. */
export function modulesForLog(log: ReplayLog): Module[] {
  return log.modules.map(({ id, version }) => {
    const found = KNOWN.find((m) => m.manifest.id === id && m.manifest.version === version);
    if (!found) throw new Error(`unknown module ${id}@${version}; add it to the runner's registry`);
    return found;
  });
}

export interface BotOptions {
  /** Phases after which the bot answers open scenes. */
  phases?: readonly TurnPhase[];
  /** Chance of answering each open scene on a pass. */
  answerRate?: number;
}

/**
 * A seeded, scripted stand-in for a player. It answers open scenes with a random enabled choice,
 * and its own RNG stream never touches the modules' streams. By default it answers about three
 * scenes in four, in the consequence phase only.
 */
export function createBot(
  seed: string,
  options: BotOptions = {},
): { hook: PhaseHook; observe: (e: Envelope) => void } {
  const phases = options.phases ?? ['consequence'];
  const rate = options.answerRate ?? 0.75;
  const rng = new SeededRandom(seed).stream('sim-runner.bot');
  const pending = new Map<string, string[]>();
  return {
    observe(envelope) {
      if (envelope.type === 'scene.started') {
        const p = envelope.payload as CoreEventPayloads['scene.started'];
        pending.set(
          p.sceneId,
          p.choices.filter((c) => !c.disabled).map((c) => c.id),
        );
      } else if (envelope.type === 'choice.resolved') {
        pending.delete((envelope.payload as CoreEventPayloads['choice.resolved']).sceneId);
      }
    },
    hook(phase, run) {
      if (!phases.includes(phase)) return;
      // Answering a scene can start the next queued one, so keep going until a pass does nothing.
      for (let pass = 0; pass < 20; pass++) {
        let acted = false;
        for (const [sceneId, choices] of [...pending.entries()].sort()) {
          if (choices.length === 0 || !rng.chance(rate)) continue;
          run.submit('choice.made', { sceneId, choiceId: rng.pick(choices) });
          acted = true;
        }
        if (!acted) break;
      }
    },
  };
}

export interface HeadlessOptions {
  seed: string;
  turns?: number;
  modules?: readonly Module[];
  configs?: Record<string, unknown>;
  bot?: BotOptions;
}

export function runHeadless(options: HeadlessOptions): ReplayLog {
  const { seed, turns = WEEKS_PER_RUN, modules = stubModules, configs } = options;
  const run = new Run({ seed, modules, ...(configs ? { configs } : {}) });
  const bot = createBot(seed, options.bot);
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

/** The determinism gate: same seed twice, a replay from the log, and a different seed. */
export function checkDeterminism(options: HeadlessOptions): CheckReport {
  const modules = options.modules ?? stubModules;
  const problems: string[] = [];
  const first = runHeadless(options);
  const second = runHeadless(options);
  const a = canonicalize(first);
  if (a !== canonicalize(second))
    problems.push('two runs from the same seed produced different logs');

  const replayed = replay(first, modules, options.configs ? { configs: options.configs } : {});
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
