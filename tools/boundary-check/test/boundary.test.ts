import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { checkWorkspace, extractSpecifiers } from '../src';

const repoRoot = join(import.meta.dirname, '..', '..', '..');

describe('the real workspace', () => {
  it('has no boundary violations', () => {
    expect(checkWorkspace(repoRoot)).toEqual([]);
  });
});

describe('import extraction', () => {
  it('finds static, re-export, side-effect, dynamic and require specifiers', () => {
    const src = `
      import a from 'one';
      import { b,
        c } from "two";
      import type { D } from '@je/three';
      export * from './four';
      export { e } from 'five';
      import 'six';
      const x = await import('seven');
      const y = require('eight');
      // import z from 'commented-out';
      const s = "import q from 'in-a-string'";
    `;
    expect(extractSpecifiers(src).sort()).toEqual([
      './four',
      '@je/three',
      'eight',
      'five',
      'one',
      'seven',
      'six',
      'two',
    ]);
  });
});

describe('a forbidden import fails the check', () => {
  const dirs: string[] = [];
  afterEach(() => {
    while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
  });

  /** Builds a throwaway workspace: every package gets an index, README and a test. */
  function workspace(files: Record<string, string>): string {
    const root = mkdtempSync(join(tmpdir(), 'je-boundary-'));
    dirs.push(root);
    const base: Record<string, string> = {};
    for (const [dir, name] of [
      ['packages/contracts', 'contracts'],
      ['packages/kernel', 'kernel'],
      ['packages/rules', 'rules'],
      ['packages/mod-a', 'mod-a'],
      ['packages/mod-b', 'mod-b'],
      ['packages/client-web', 'client-web'],
    ] as const) {
      base[`${dir}/package.json`] = JSON.stringify({ name: `@je/${name}` });
      base[`${dir}/src/index.ts`] = name.startsWith('mod-')
        ? 'export const manifest = 1; export const createModule = 2;'
        : 'export {};';
      base[`${dir}/README.md`] = '# x';
      base[`${dir}/test/x.test.ts`] = 'export {};';
    }
    for (const [path, text] of Object.entries({ ...base, ...files })) {
      const full = join(root, path);
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, text);
    }
    return root;
  }
  const rules = (root: string) => checkWorkspace(root).map((v) => `${v.rule}:${v.package}`);

  it('passes a clean workspace', () => {
    const root = workspace({
      'packages/mod-a/src/index.ts':
        "import { x } from '@je/kernel'; import '@je/contracts'; export const manifest = x; export const createModule = x;",
      'packages/kernel/src/index.ts': "import '@je/contracts'; export {};",
    });
    expect(checkWorkspace(root)).toEqual([]);
  });

  it('module importing another module', () => {
    const root = workspace({
      'packages/mod-a/src/index.ts':
        "import '@je/mod-b'; export const manifest = 1; export const createModule = 1;",
    });
    expect(rules(root)).toContain('import.forbidden:@je/mod-a');
  });

  it('module importing the client', () => {
    const root = workspace({
      'packages/mod-a/src/index.ts':
        "import '@je/client-web'; export const manifest = 1; export const createModule = 1;",
    });
    expect(rules(root)).toContain('import.forbidden:@je/mod-a');
  });

  it('kernel importing a module, and contracts importing anything', () => {
    const root = workspace({
      'packages/kernel/src/index.ts': "import '@je/mod-a'; export {};",
      'packages/contracts/src/index.ts': "import '@je/kernel'; export {};",
    });
    expect(rules(root)).toEqual(
      expect.arrayContaining(['import.forbidden:@je/kernel', 'import.forbidden:@je/contracts']),
    );
  });

  it('client importing module internals', () => {
    const root = workspace({
      'packages/client-web/src/index.ts': "import '@je/mod-a'; export {};",
    });
    expect(rules(root)).toContain('import.forbidden:@je/client-web');
  });

  it('deep imports into another package', () => {
    const root = workspace({
      'packages/mod-a/src/index.ts':
        "import '@je/kernel/src/run'; export const manifest = 1; export const createModule = 1;",
    });
    expect(rules(root)).toContain('import.deep:@je/mod-a');
  });

  it('relative imports that leave the package', () => {
    const root = workspace({
      'packages/mod-a/src/index.ts':
        "import '../../mod-b/src/index'; export const manifest = 1; export const createModule = 1;",
    });
    expect(rules(root)).toContain('import.escape:@je/mod-a');
  });

  it('node built-ins and unlisted npm packages inside browser-safe packages', () => {
    const root = workspace({
      'packages/kernel/src/index.ts': "import 'node:fs'; import 'lodash'; export {};",
    });
    expect(rules(root)).toEqual(
      expect.arrayContaining(['import.builtin:@je/kernel', 'import.external:@je/kernel']),
    );
  });

  it('forbidden or unlisted entries in package.json', () => {
    const root = workspace({
      'packages/mod-a/package.json': JSON.stringify({
        name: '@je/mod-a',
        dependencies: { '@je/mod-b': '*', lodash: '*' },
      }),
    });
    expect(rules(root)).toEqual(
      expect.arrayContaining(['dependency.forbidden:@je/mod-a', 'dependency.external:@je/mod-a']),
    );
  });

  it('structure: a package with no README, tests or module exports, and an uncovered layer', () => {
    const root = workspace({
      'packages/mod-a/src/index.ts': 'export {};',
      'packages/mystery/package.json': JSON.stringify({ name: '@je/mystery' }),
    });
    rmSync(join(root, 'packages/mod-a/README.md'));
    rmSync(join(root, 'packages/mod-a/test'), { recursive: true });
    expect(rules(root)).toEqual(
      expect.arrayContaining([
        'structure.readme:@je/mod-a',
        'structure.tests:@je/mod-a',
        'module.shape:@je/mod-a',
        'layer.unknown:@je/mystery',
      ]),
    );
  });

  it('tools may import any package public API', () => {
    const root = workspace({
      'tools/runner/package.json': JSON.stringify({
        name: '@je/runner',
        dependencies: { '@je/mod-a': '*', '@je/kernel': '*' },
      }),
      'tools/runner/src/index.ts':
        "import '@je/mod-a'; import '@je/kernel'; import 'node:fs'; import 'lodash'; export {};",
    });
    expect(checkWorkspace(root)).toEqual([]);
  });

  it('the CLI exits 1 on a violation and 0 when clean', () => {
    const cli = join(repoRoot, 'tools', 'boundary-check', 'src', 'cli.ts');
    const run = (dir: string) =>
      spawnSync(process.execPath, ['--import', 'tsx', cli, dir], {
        cwd: repoRoot,
        encoding: 'utf8',
      });
    const bad = workspace({
      'packages/mod-a/src/index.ts':
        "import '@je/mod-b'; export const manifest = 1; export const createModule = 1;",
    });
    const failed = run(bad);
    expect(failed.status).toBe(1);
    expect(failed.stderr).toContain('import.forbidden');
    expect(run(repoRoot).status).toBe(0);
  });
});
