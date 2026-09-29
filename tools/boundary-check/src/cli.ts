#!/usr/bin/env tsx
import { resolve } from 'node:path';
import { checkWorkspace } from './check';

const root = resolve(process.argv[2] ?? process.cwd());
const violations = checkWorkspace(root);

if (violations.length === 0) {
  console.log('boundary check: OK (no forbidden imports or dependencies)');
} else {
  for (const v of violations) {
    console.error(`${v.rule}  ${v.package}${v.file ? `  ${v.file}` : ''}\n    ${v.message}`);
  }
  console.error(`\nboundary check: ${violations.length} violation(s)`);
  process.exitCode = 1;
}
