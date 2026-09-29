import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { ruleFor, type LayerRule } from './rules';

export interface Violation {
  rule: string;
  package: string;
  file?: string;
  message: string;
}

interface Pkg {
  dir: 'packages' | 'tools';
  folder: string;
  root: string;
  name: string;
  short: string;
  manifest: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    je?: { moduleBundle?: boolean };
  };
}

const SCOPE = '@je/';
const SOURCE_FILE = /\.(ts|tsx|js|mjs|cjs)$/;
const BUILTINS = new Set(builtinModules.flatMap((m) => [m, `node:${m}`]));

const IMPORT_PATTERNS = [
  /(?:^|;)\s*(?:import|export)\b[^;'"]*?\bfrom\s*['"]([^'"]+)['"]/gms,
  /(?:^|;)\s*import\s*['"]([^'"]+)['"]/gm,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
];

export function extractSpecifiers(source: string): string[] {
  const found = new Set<string>();
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of source.matchAll(pattern)) found.add(match[1] as string);
  }
  return [...found];
}

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SOURCE_FILE.test(name)) out.push(full);
  }
  return out;
}

function readPackages(root: string): Pkg[] {
  const out: Pkg[] = [];
  for (const dir of ['packages', 'tools'] as const) {
    const base = join(root, dir);
    if (!existsSync(base)) continue;
    for (const folder of readdirSync(base).sort()) {
      const pkgRoot = join(base, folder);
      const manifestPath = join(pkgRoot, 'package.json');
      if (!existsSync(manifestPath)) continue;
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Pkg['manifest'] & {
        name?: string;
      };
      const name = manifest.name ?? folder;
      out.push({
        dir,
        folder,
        root: pkgRoot,
        name,
        short: name.startsWith(SCOPE) ? name.slice(SCOPE.length) : name,
        manifest,
      });
    }
  }
  return out;
}

function packageOf(specifier: string): string {
  const parts = specifier.split('/');
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : (parts[0] as string);
}

/** Checks every workspace package under `root` against the layer rules. */
export function checkWorkspace(root: string): Violation[] {
  const violations: Violation[] = [];
  const packages = readPackages(root);
  const workspaceShortNames = new Map(
    packages.filter((p) => p.dir === 'packages').map((p) => [p.short, p]),
  );

  for (const pkg of packages) {
    const rule = ruleFor(pkg.dir, pkg.short);
    const add = (v: Omit<Violation, 'package'>): void =>
      void violations.push({ package: pkg.name, ...v });
    if (!rule) {
      add({
        rule: 'layer.unknown',
        message: `no boundary rule covers ${pkg.dir}/${pkg.folder}; add one in tools/boundary-check/src/rules.ts`,
      });
      continue;
    }

    checkStructure(pkg, add);

    // Declared dependencies.
    for (const [dep, section] of declared(pkg)) {
      if (dep.startsWith(SCOPE)) {
        const problem = internalProblem(rule, dep.slice(SCOPE.length), workspaceShortNames);
        if (problem)
          add({
            rule: 'dependency.forbidden',
            message: `package.json ${section} lists ${dep}: ${problem}`,
          });
      } else if (
        section === 'dependencies' &&
        pkg.dir === 'packages' &&
        !rule.externals.includes(dep)
      ) {
        add({
          rule: 'dependency.external',
          message: `package.json depends on "${dep}"; ${pkg.short} may only use: ${rule.externals.join(', ') || 'nothing external'}`,
        });
      }
    }

    // Imports in source and tests.
    for (const area of ['src', 'test'] as const) {
      for (const file of walk(join(pkg.root, area))) {
        const shown = relative(root, file).split(sep).join('/');
        const specifiers = extractSpecifiers(readFileSync(file, 'utf8'));
        for (const spec of specifiers) {
          checkImport(pkg, rule, area, file, shown, spec, workspaceShortNames, add);
        }
      }
    }
  }
  return violations;
}

function* declared(pkg: Pkg): Generator<[string, string]> {
  for (const dep of Object.keys(pkg.manifest.dependencies ?? {})) yield [dep, 'dependencies'];
  for (const dep of Object.keys(pkg.manifest.devDependencies ?? {})) yield [dep, 'devDependencies'];
}

function internalProblem(
  rule: LayerRule,
  target: string,
  known: Map<string, Pkg>,
): string | undefined {
  if (!known.has(target)) {
    return rule.mayImport === 'any-package'
      ? undefined
      : `${target} is not a package under packages/`;
  }
  if (rule.mayImport === 'any-package') return undefined;
  if (rule.mayImport.includes(target)) return undefined;
  return `${rule.layer} may only import ${rule.mayImport.join(', ') || 'nothing'}`;
}

function checkImport(
  pkg: Pkg,
  rule: LayerRule,
  area: 'src' | 'test',
  file: string,
  shown: string,
  spec: string,
  known: Map<string, Pkg>,
  add: (v: Omit<Violation, 'package'>) => void,
): void {
  if (spec.startsWith('.')) {
    const target = resolve(dirname(file), spec);
    if (target !== pkg.root && !target.startsWith(pkg.root + sep)) {
      add({
        rule: 'import.escape',
        file: shown,
        message: `relative import "${spec}" leaves the package; import its public API by name`,
      });
    }
    return;
  }
  if (BUILTINS.has(spec)) {
    if (!rule.nodeBuiltins && area === 'src') {
      add({
        rule: 'import.builtin',
        file: shown,
        message: `"${spec}": ${rule.layer} code is browser-safe; use a port instead of Node built-ins`,
      });
    }
    return;
  }
  const base = packageOf(spec);
  if (base.startsWith(SCOPE)) {
    const target = base.slice(SCOPE.length);
    if (spec !== base) {
      add({
        rule: 'import.deep',
        file: shown,
        message: `"${spec}" reaches into ${base} internals; import "${base}" (its public API)`,
      });
    }
    if (target === pkg.short) return;
    const problem = internalProblem(rule, target, known);
    if (problem)
      add({ rule: 'import.forbidden', file: shown, message: `imports ${base}: ${problem}` });
    return;
  }
  if (area === 'src' && pkg.dir === 'packages' && !rule.externals.includes(base)) {
    add({
      rule: 'import.external',
      file: shown,
      message: `imports "${base}"; ${pkg.short} may only use: ${rule.externals.join(', ') || 'nothing external'}`,
    });
  }
}

function checkStructure(pkg: Pkg, add: (v: Omit<Violation, 'package'>) => void): void {
  if (pkg.dir !== 'packages') return;
  const indexPath = join(pkg.root, 'src', 'index.ts');
  if (!existsSync(indexPath))
    add({ rule: 'structure.index', message: 'missing src/index.ts (the public API)' });
  if (!existsSync(join(pkg.root, 'README.md')))
    add({ rule: 'structure.readme', message: 'missing README.md stating what the package owns' });
  if (!existsSync(join(pkg.root, 'test')) || walk(join(pkg.root, 'test')).length === 0) {
    add({ rule: 'structure.tests', message: 'missing tests under test/' });
  }
  if (pkg.short.startsWith('mod-') && !pkg.manifest.je?.moduleBundle && existsSync(indexPath)) {
    const text = readFileSync(indexPath, 'utf8');
    for (const name of ['manifest', 'createModule']) {
      if (!new RegExp(`\\b${name}\\b`).test(text)) {
        add({
          rule: 'module.shape',
          file: `${pkg.dir}/${pkg.folder}/src/index.ts`,
          message: `mod-* packages must export "${name}" from index.ts`,
        });
      }
    }
  }
}
