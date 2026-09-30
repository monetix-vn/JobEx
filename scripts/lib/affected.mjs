// Works out which workspace packages a set of changed files touches, plus everything that depends
// on them, so `pnpm check:fast` only runs what could have broken. Pure functions, unit-tested.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Files that can affect every package. */
const GLOBAL_FILES = new Set([
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  'vitest.config.ts',
  'eslint.config.js',
]);

/** Content changes matter to whatever loads or validates content. */
const CONTENT_CONSUMERS = [
  'packages/mod-content',
  'tools/pack-validator',
  'tools/sim-runner',
  'tools/demo-host',
];

export function readWorkspace(root) {
  const packages = [];
  for (const area of ['packages', 'tools']) {
    const base = join(root, area);
    if (!existsSync(base)) continue;
    for (const folder of readdirSync(base).sort()) {
      const file = join(base, folder, 'package.json');
      if (!existsSync(file)) continue;
      const json = JSON.parse(readFileSync(file, 'utf8'));
      const deps = Object.keys({ ...json.dependencies, ...json.devDependencies }).filter((d) =>
        d.startsWith('@je/'),
      );
      packages.push({ dir: `${area}/${folder}`, name: json.name, deps });
    }
  }
  return packages;
}

/** "packages/kernel/src/run.ts" -> "packages/kernel"; anything else -> undefined. */
export function packageDirOf(file) {
  const match = /^(packages|tools)\/([^/]+)\//.exec(file.replace(/\\/g, '/'));
  return match ? `${match[1]}/${match[2]}` : undefined;
}

/** The given package dirs plus every package that (transitively) depends on any of them. */
export function withDependents(packages, dirs) {
  const result = new Set(dirs);
  let grew = true;
  while (grew) {
    grew = false;
    const names = new Set(packages.filter((p) => result.has(p.dir)).map((p) => p.name));
    for (const p of packages) {
      if (!result.has(p.dir) && p.deps.some((d) => names.has(d))) {
        result.add(p.dir);
        grew = true;
      }
    }
  }
  return [...result].sort();
}

/**
 * @returns {{ everything: boolean, dirs: string[], content: boolean }}
 *   `everything`: a root config changed, so run it all.
 */
export function affected(changedFiles, packages) {
  const files = changedFiles.map((f) => f.replace(/\\/g, '/'));
  if (files.some((f) => GLOBAL_FILES.has(f))) return { everything: true, dirs: [], content: true };
  const touched = new Set();
  let content = false;
  for (const file of files) {
    const dir = packageDirOf(file);
    if (dir && packages.some((p) => p.dir === dir)) touched.add(dir);
    if (file.startsWith('content/')) {
      content = true;
      for (const c of CONTENT_CONSUMERS) touched.add(c);
    }
  }
  return { everything: false, dirs: withDependents(packages, touched), content };
}
