import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { hasErrors, loadContent } from '@je/mod-content';
import { directorySource } from '../src';

const repoRoot = join(import.meta.dirname, '..', '..', '..');
const contentDir = join(repoRoot, 'content');
const cli = join(repoRoot, 'tools', 'pack-validator', 'src', 'cli.ts');
const run = (...args: string[]) =>
  spawnSync(process.execPath, ['--import', 'tsx', cli, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

const temps: string[] = [];
afterEach(() => {
  while (temps.length) rmSync(temps.pop()!, { recursive: true, force: true });
});
function copyOfContent(): string {
  const dir = mkdtempSync(join(tmpdir(), 'je-content-'));
  temps.push(dir);
  cpSync(contentDir, dir, { recursive: true });
  return dir;
}

describe('pack validator', () => {
  it('reads packs from disk and validates the shipped content cleanly', async () => {
    const { registry, diagnostics } = await loadContent(directorySource(contentDir));
    expect(hasErrors(diagnostics)).toBe(false);
    expect(registry?.counts()).toEqual({
      role: 6,
      event: 100,
      scene: 100,
      offer: 3,
      fact: 88,
      term: 38,
      character: 12,
      arc: 9,
    });
  });

  it('CLI exits 0 on the shipped content, even with --strict', () => {
    const result = run(contentDir, '--strict');
    expect(result.stdout).toContain('0 error(s), 0 warning(s)');
    expect(result.status).toBe(0);
  });

  it('CLI exits 1 and names the broken file when a translation is missing', () => {
    const dir = copyOfContent();
    writeFileSync(join(dir, 'industry-cookware', 'locale', 'vi.json'), '{}');
    const result = run(dir);
    expect(result.status).toBe(1);
    expect(result.stdout).toContain('locale.missing');
    expect(result.stdout).toMatch(
      /text key "role\.sales\.export\.specialist\.title" .* missing in vi/,
    );
    expect(result.stdout).toContain('industry-cookware/');
  });

  it('CLI exits 1 for an unknown reference and for invalid JSON', () => {
    const dir = copyOfContent();
    writeFileSync(
      join(dir, 'industry-cookware', 'events', 'bad.json'),
      JSON.stringify({ id: 'event.bad', scene: 'scene.nope' }),
    );
    expect(run(dir).stdout).toContain('ref.missing');
    writeFileSync(join(dir, 'industry-cookware', 'events', 'bad.json'), '{ not json');
    const parse = run(dir);
    expect(parse.status).toBe(1);
    expect(parse.stdout).toContain('json.parse');
  });

  it('--strict turns warnings into failures', () => {
    const dir = copyOfContent();
    writeFileSync(
      join(dir, 'industry-cookware', 'events', 'never.json'),
      JSON.stringify({ id: 'event.never', scene: 'scene.audit_day', weight: 0 }),
    );
    expect(run(dir).status).toBe(0);
    const strict = run(dir, '--strict');
    expect(strict.status).toBe(1);
    expect(strict.stdout).toContain('event.unreachable');
  });

  it('shows usage without a directory', () => {
    expect(run().status).toBe(2);
  });
});
