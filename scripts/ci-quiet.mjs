/* global process, console */
// `pnpm run ci:quiet`: the same steps as CI, one line each, output only for failures.
import { report, run } from './lib/run.mjs';

const pnpm = process.env.npm_execpath ? `node "${process.env.npm_execpath}"` : 'pnpm';
const STEPS = [
  ['format', 'format:check'],
  ['lint', 'lint'],
  ['types', 'typecheck'],
  ['boundaries', 'check:boundaries'],
  ['tests', 'test -- --reporter=dot'],
  ['content', 'validate:packs'],
  ['determinism', 'sim:determinism'],
  ['smoke', 'sim:smoke'],
  ['sales year', 'sim:sales'],
  ['web build', 'build:web'],
];

let failed = 0;
for (const [label, script] of STEPS) {
  if (!report(label, run(`${pnpm} run ${script}`), 60)) failed += 1;
}
console.log(failed === 0 ? '\nCI would pass' : `\n${failed} step(s) failed`);
process.exit(failed === 0 ? 0 : 1);
