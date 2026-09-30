/* global process, console */
// `pnpm format`: formats only the files you changed. With --staged (used by the pre-commit hook) it
// formats the staged files and stages the result. Use `pnpm format:all` for a whole-repo pass.
import { existsSync } from 'node:fs';
import { changedFiles, q, run, tail } from './lib/run.mjs';

const staged = process.argv.includes('--staged');
const files = changedFiles({ staged })
  .filter((f) => /\.(ts|tsx|js|mjs|json|html|yml)$/.test(f) && !f.endsWith('pnpm-lock.yaml'))
  .filter((f) => existsSync(f));

if (files.length === 0) {
  console.log('no changed files to format');
  process.exit(0);
}
const result = run(`npx prettier --write ${files.map(q).join(' ')}`);
if (!result.ok) {
  console.log(tail(result.output));
  process.exit(1);
}
if (staged) run(`git add ${files.map(q).join(' ')}`);
console.log(`formatted ${files.length} file(s)`);
