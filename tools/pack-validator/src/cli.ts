#!/usr/bin/env tsx
import { resolve } from 'node:path';
import { formatDiagnostic, hasErrors, loadContent } from '@je/mod-content';
import { directorySource } from './fs-source';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const verbose = args.includes('--verbose');
const dir = args.find((a) => !a.startsWith('--'));

if (!dir) {
  console.error('usage: pack-validator <content-dir> [--strict] [--verbose]');
  process.exit(2);
}

const { registry, diagnostics } = await loadContent(directorySource(resolve(dir)));
const shown = diagnostics.filter((d) => verbose || d.severity !== 'info');
for (const d of shown) console.log(formatDiagnostic(d));

const errors = diagnostics.filter((d) => d.severity === 'error').length;
const warnings = diagnostics.filter((d) => d.severity === 'warning').length;
if (registry) {
  const counts = Object.entries(registry.counts())
    .map(([kind, n]) => `${n} ${kind}`)
    .join(', ');
  console.log(`packs: ${registry.packs.map((p) => `${p.id}@${p.version}`).join(', ')}`);
  console.log(`content: ${counts}`);
}
console.log(`${errors} error(s), ${warnings} warning(s)`);
process.exitCode = hasErrors(diagnostics) || (strict && warnings > 0) ? 1 : 0;
