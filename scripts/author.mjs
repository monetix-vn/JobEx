/* global process, console */
// `pnpm author <file.yml> [more.yml] [--pack industry-cookware] [--dry-run]`
// Imports scenes, facts and glossary terms written in YAML, then validates the whole pack.
import { readFileSync } from 'node:fs';
import { applyEntries, parseEntries } from './lib/author.mjs';
import { q, run, tail } from './lib/run.mjs';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = args.includes('--dry-run');
const files = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--pack'));

if (files.length === 0) {
  console.error('usage: pnpm author <file.yml> [more.yml] [--pack industry-cookware] [--dry-run]');
  console.error('See docs/AUTHORING.md, and content-src/example-scene.yml for a template.');
  process.exit(2);
}

try {
  const entries = files.flatMap((file) => parseEntries(readFileSync(file, 'utf8'), file));
  if (dryRun) {
    // Compile into a throwaway copy so nothing in content/ changes.
    const { mkdtempSync, cpSync, rmSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const tmp = mkdtempSync(join(tmpdir(), 'je-author-'));
    try {
      cpSync('content', join(tmp, 'content'), { recursive: true });
      const report = applyEntries(entries, { root: tmp, pack: flag('pack') });
      console.log(report.map((l) => `would have ${l}`).join('\n'));
      const check = run(
        `npx tsx tools/pack-validator/src/cli.ts ${q(join(tmp, 'content'))} --strict`,
      );
      console.log(check.ok ? 'the pack would validate cleanly' : tail(check.output));
      process.exit(check.ok ? 0 : 1);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }
  const report = applyEntries(entries, { pack: flag('pack') });
  console.log(report.join('\n'));
  const check = run('npx tsx tools/pack-validator/src/cli.ts content --strict');
  console.log(
    check.ok
      ? '\nvalidation: ok (0 errors, 0 warnings)'
      : `\nvalidation found problems:\n${tail(check.output, 30)}`,
  );
  process.exit(check.ok ? 0 : 1);
} catch (error) {
  console.error(error.message);
  console.error('\nNothing was changed.');
  process.exit(1);
}
