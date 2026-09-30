/* global process, console */
// Small helpers shared by the dev scripts: run a command quietly, list changed files.
import { spawnSync } from 'node:child_process';

/** Quote one argument for the shell (paths here contain spaces on Windows). */
export const q = (arg) => `"${String(arg).replace(/"/g, '\\"')}"`;

/** Runs a shell command, capturing output. Returns { ok, seconds, output }. */
export function run(command, options = {}) {
  const started = Date.now();
  const result = spawnSync(command, {
    shell: true,
    encoding: 'utf8',
    cwd: options.cwd,
    env: { ...process.env, FORCE_COLOR: '0', ...options.env },
    maxBuffer: 64 * 1024 * 1024,
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  return { ok: result.status === 0, seconds: (Date.now() - started) / 1000, output };
}

// Terminal colour codes, built without a control character in a regex literal.
const ANSI = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g');

/** The last `n` lines of some output, for showing why a step failed. */
export function tail(text, n = 40) {
  return text.replace(ANSI, '').split(/\r?\n/).slice(-n).join('\n').trim();
}

/** Prints one line for a step and, only if it failed, the end of its output. */
export function report(label, result, detail = 40) {
  if (result.ok) {
    console.log(`ok    ${label} (${result.seconds.toFixed(1)}s)`);
    return true;
  }
  console.log(`FAIL  ${label} (${result.seconds.toFixed(1)}s)`);
  console.log(tail(result.output, detail));
  return false;
}

/** Files changed in the working tree (or staged), relative to the repo root, that still exist. */
export function changedFiles({ staged = false } = {}) {
  const lines = (command) =>
    run(command)
      .output.split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  const names = staged
    ? lines('git diff --cached --name-only --diff-filter=ACMR')
    : [
        ...lines('git diff --name-only HEAD --diff-filter=ACMR'),
        ...lines('git ls-files --others --exclude-standard'),
      ];
  return [...new Set(names)];
}
