/* global process */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { affected, packageDirOf, readWorkspace, withDependents } from '../lib/affected.mjs';
import { scaffoldScene } from '../lib/scaffold.mjs';

const repo = join(import.meta.dirname, '..', '..');

describe('affected packages', () => {
  const packages = readWorkspace(repo);
  const dirs = (files) => affected(files, packages).dirs;

  it('reads the real workspace and its internal dependencies', () => {
    const kernel = packages.find((p) => p.dir === 'packages/kernel');
    expect(kernel).toMatchObject({ name: '@je/kernel', deps: ['@je/contracts'] });
    expect(packages.map((p) => p.dir)).toContain('tools/sim-runner');
  });

  it('maps a file to its package', () => {
    expect(packageDirOf('packages/kernel/src/run.ts')).toBe('packages/kernel');
    expect(packageDirOf('tools\\sim-runner\\test\\x.ts')).toBe('tools/sim-runner');
    expect(packageDirOf('README.md')).toBeUndefined();
    expect(packageDirOf('content/core/manifest.json')).toBeUndefined();
  });

  it('a change in a leaf touches the leaf and whoever depends on it, and nothing else', () => {
    const out = dirs(['packages/mod-toy/src/index.ts']);
    expect(out).toContain('packages/mod-toy');
    expect(out).toContain('tools/sim-runner'); // it composes the toy module
    expect(out).not.toContain('packages/kernel');
    expect(out).not.toContain('packages/mod-risk');
  });

  it('a change in contracts touches every package that builds on it', () => {
    const out = dirs(['packages/contracts/src/events.ts']);
    for (const dir of [
      'packages/kernel',
      'packages/mod-risk',
      'packages/client-web',
      'tools/sim-runner',
    ]) {
      expect(out).toContain(dir);
    }
  });

  it('content changes go to whatever loads content; docs change nothing', () => {
    const out = affected(['content/industry-cookware/scenes/a.json'], packages);
    expect(out.content).toBe(true);
    expect(out.dirs).toEqual(expect.arrayContaining(['packages/mod-content', 'tools/sim-runner']));
    expect(out.dirs).not.toContain('packages/mod-risk');
    expect(affected(['README.md', 'docs/STATUS.md'], packages)).toEqual({
      everything: false,
      dirs: [],
      content: false,
    });
  });

  it('a root config change means everything', () => {
    expect(affected(['tsconfig.json'], packages).everything).toBe(true);
    expect(affected(['pnpm-lock.yaml'], packages).everything).toBe(true);
  });

  it('follows dependencies transitively', () => {
    const chain = [
      { dir: 'packages/a', name: '@je/a', deps: [] },
      { dir: 'packages/b', name: '@je/b', deps: ['@je/a'] },
      { dir: 'packages/c', name: '@je/c', deps: ['@je/b'] },
      { dir: 'packages/d', name: '@je/d', deps: [] },
    ];
    expect(withDependents(chain, ['packages/a'])).toEqual([
      'packages/a',
      'packages/b',
      'packages/c',
    ]);
    expect(withDependents(chain, ['packages/d'])).toEqual(['packages/d']);
  });
});

describe('scene scaffold', () => {
  const temps = [];
  afterEach(() => {
    while (temps.length) rmSync(temps.pop(), { recursive: true, force: true });
  });
  const workspace = () => {
    const dir = mkdtempSync(join(tmpdir(), 'je-scaffold-'));
    temps.push(dir);
    cpSync(join(repo, 'content'), join(dir, 'content'), { recursive: true });
    return dir;
  };

  it('creates a scene, an event and EN/VI text, and the result validates', () => {
    const root = workspace();
    const files = scaffoldScene({ root, key: 'new_buyer_visit' });
    expect(files).toHaveLength(4);
    const scene = JSON.parse(
      readFileSync(
        join(root, 'content/industry-cookware/scenes/sales-new-buyer-visit.json'),
        'utf8',
      ),
    );
    expect(scene.id).toBe('scene.sales.new_buyer_visit');
    expect(scene.choices.map((c) => c.id)).toEqual(['c1', 'c2', 'c3']);
    const vi = JSON.parse(
      readFileSync(join(root, 'content/industry-cookware/locale/vi.json'), 'utf8'),
    );
    expect(vi['scene.sales.new_buyer_visit.c2.fail']).toContain('TODO (vi)');

    const cli = join(repo, 'tools', 'pack-validator', 'src', 'cli.ts');
    const result = spawnSync(
      process.execPath,
      ['--import', 'tsx', cli, join(root, 'content'), '--strict'],
      {
        cwd: repo,
        encoding: 'utf8',
      },
    );
    expect(result.stdout).toContain('0 error(s), 0 warning(s)');
    expect(result.status).toBe(0);
  });

  it('refuses a bad key, an existing scene and a missing pack, and changes nothing when it refuses', () => {
    const root = workspace();
    expect(() => scaffoldScene({ root, key: 'Bad Key' })).toThrow(/snake_case/);
    expect(() => scaffoldScene({ root, key: 'x', pack: 'nope' })).toThrow(/no pack/);
    scaffoldScene({ root, key: 'once' });
    const before = readFileSync(
      join(root, 'content/industry-cookware/events/sales-week.json'),
      'utf8',
    );
    expect(() => scaffoldScene({ root, key: 'once' })).toThrow(/already exists/);
    expect(
      readFileSync(join(root, 'content/industry-cookware/events/sales-week.json'), 'utf8'),
    ).toBe(before);
    expect(existsSync(join(root, 'content/industry-cookware/scenes/sales-x.json'))).toBe(false);
  });
});
