/* global console, process */
// `pnpm pin:update`: re-pins the golden fingerprints in tools/sim-runner/test/pins.json after an
// intended behaviour change, and shows what moved. Review the result: a pin should only change when
// you meant to change behaviour.
import { readFileSync } from 'node:fs';
import { q, run, tail } from './lib/run.mjs';

const FILE = 'tools/sim-runner/test/pins.json';
const before = JSON.parse(readFileSync(FILE, 'utf8'));

const tests = run(`npx vitest run --no-file-parallelism ${q('tools/sim-runner')}`, {
  env: { UPDATE_PINS: '1' },
});
if (!tests.ok) {
  console.log('the sim-runner tests fail for a reason other than a pin:\n');
  console.log(tail(tests.output));
  process.exit(1);
}

const after = JSON.parse(readFileSync(FILE, 'utf8'));
const moved = Object.keys({ ...before, ...after }).filter((k) => before[k] !== after[k]);
console.log(
  moved.length === 0
    ? 'pins already up to date'
    : moved.map((k) => `${k}: ${before[k] ?? '(new)'} -> ${after[k]}`).join('\n'),
);
