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
  ['people library', 'people:validate'],
  ['determinism', 'sim:determinism'],
  ['smoke', 'sim:smoke'],
  ['sales year', 'sim:sales'],
  ['qc year', 'sim:qc'],
  ['fin year', 'sim:fin'],
  ['prod year', 'sim:prod'],
  ['purch year', 'sim:purch'],
  ['inv year', 'sim:inv'],
  ['it year', 'sim:it'],
  ['mkt year', 'sim:mkt'],
  ['fpa year', 'sim:fpa'],
  ['sup year', 'sim:sup'],
  ['hr year', 'sim:hr'],
  ['web build', 'build:web'],
];

let failed = 0;
for (const [label, script] of STEPS) {
  if (!report(label, run(`${pnpm} run ${script}`), 60)) failed += 1;
}
console.log(failed === 0 ? '\nCI would pass' : `\n${failed} step(s) failed`);
process.exit(failed === 0 ? 0 : 1);
