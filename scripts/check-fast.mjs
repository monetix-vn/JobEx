/* global process, console */
// `pnpm check:fast`: checks only what you changed and what depends on it, and prints only failures.
//   format, lint on the changed files; types (whole program, fast); dependency boundaries;
//   tests of the affected packages; content validation when content changed.
import { existsSync } from 'node:fs';
import { affected, readWorkspace } from './lib/affected.mjs';
import { changedFiles, q, report, run } from './lib/run.mjs';

const PRETTIER = /\.(ts|tsx|js|mjs|json|html|yml)$/;
const LINTABLE = /\.(ts|tsx|js|mjs)$/;

const files = changedFiles().filter((f) => existsSync(f));
if (files.length === 0) {
  console.log('nothing changed since the last commit');
  process.exit(0);
}

const scope = affected(files, readWorkspace('.'));
const steps = [];
const pretty = files.filter((f) => PRETTIER.test(f) && !f.endsWith('pnpm-lock.yaml'));
if (pretty.length > 0) steps.push(['format', `npx prettier --check ${pretty.map(q).join(' ')}`]);
const lintable = files.filter((f) => LINTABLE.test(f));
if (lintable.length > 0) steps.push(['lint', `npx eslint ${lintable.map(q).join(' ')}`]);
steps.push(['types', 'npx tsc --noEmit -p tsconfig.json']);
steps.push(['boundaries', 'npx tsx tools/boundary-check/src/cli.ts']);

const testDirs = scope.everything
  ? []
  : scope.dirs.map((d) => `${d}/test`).filter((d) => existsSync(d));
if (scope.everything || testDirs.length > 0) {
  steps.push([
    scope.everything ? 'tests (everything)' : `tests (${scope.dirs.join(', ')})`,
    `npx vitest run --reporter=dot ${testDirs.map(q).join(' ')}`,
  ]);
}
if (scope.content || scope.everything) {
  steps.push(['content', 'npx tsx tools/pack-validator/src/cli.ts content --strict']);
}

let failed = 0;
for (const [label, command] of steps) {
  if (!report(label, run(command))) failed += 1;
}
console.log(failed === 0 ? '\nall good' : `\n${failed} step(s) failed`);
process.exit(failed === 0 ? 0 : 1);
