/* global process, console */
// `pnpm new:scene <key> [--pack industry-cookware] [--prefix sales]`
import { scaffoldScene } from './lib/scaffold.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const key = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));

if (!key) {
  console.error(
    'usage: pnpm new:scene <snake_case_key> [--pack industry-cookware] [--prefix sales]',
  );
  process.exit(2);
}
try {
  const files = scaffoldScene({ key, pack: flag('pack'), prefix: flag('prefix') });
  console.log(files.map((f) => `wrote ${f}`).join('\n'));
  console.log(
    '\nNext: write the text (en and vi), set costs and effects, then `pnpm validate:packs`.',
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
