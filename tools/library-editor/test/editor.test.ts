import { cpSync, existsSync, mkdtempSync, readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createEditorServer, readRaw } from '../src/server';

const repoLibrary = join(import.meta.dirname, '..', '..', '..', 'library');
const dir = mkdtempSync(join(tmpdir(), 'je-library-'));
cpSync(repoLibrary, dir, { recursive: true });

const server = createEditorServer(
  dir,
  join(repoLibrary, '..', 'docs', 'design', 'GENERATOR-GUIDE.md'),
);
let base = '';
beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

const post = async (path: string, body: unknown): Promise<Record<string, unknown>> =>
  (await (
    await fetch(base + path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  ).json()) as Record<string, unknown>;

describe('the library editor server', () => {
  it('serves the page and the library with no errors', async () => {
    const page = await (await fetch(base + '/')).text();
    expect(page).toContain('People Library Editor');
    const lib = (await (await fetch(base + '/api/library')).json()) as {
      raw: Record<string, unknown>;
      diagnostics: { severity: string }[];
    };
    expect(Object.keys(lib.raw).sort()).toEqual([
      'archetypes',
      'departments',
      'names',
      'quirks',
      'tables',
    ]);
    expect(lib.diagnostics.filter((d) => d.severity === 'error')).toEqual([]);
  });

  it('serves the guide (the whitepaper) so authors can read it in the editor', async () => {
    const guide = (await (await fetch(base + '/api/guide')).json()) as { markdown: string };
    expect(guide.markdown).toContain('The people generator: a guide and whitepaper');
    expect(guide.markdown).toContain('Fairness rules');
  });

  it('validates a draft and reports a mistake without saving it', async () => {
    const raw = readRaw(dir) as unknown as { quirks: { incompatible_with?: string[] }[] };
    raw.quirks[0]!.incompatible_with = ['nope'];
    const r = (await post('/api/validate', raw)) as { diagnostics: { code: string }[] };
    expect(r.diagnostics.map((d) => d.code)).toContain('quirk.incompatible');
    const saved = (await post('/api/save', raw)) as { ok: boolean };
    expect(saved.ok).toBe(false);
    const onDisk = JSON.parse(readFileSync(join(dir, 'quirks.json'), 'utf8')) as {
      incompatible_with?: string[];
    }[];
    expect(onDisk[0]!.incompatible_with ?? []).not.toContain('nope');
  });

  it('saves a valid edit, keeps a backup, and the new quirk is used by the preview', async () => {
    const raw = readRaw(dir) as unknown as { quirks: Record<string, unknown>[] };
    raw.quirks.push({
      id: 'whistles_while_working',
      name: { en: 'Whistles while working', vi: 'Huýt sáo khi làm việc' },
      weight: 5,
      tags: ['mood'],
      voice: ['cheerful'],
    });
    const saved = (await post('/api/save', raw)) as { ok: boolean };
    expect(saved.ok).toBe(true);
    expect(existsSync(join(dir, 'quirks.json.bak'))).toBe(true);
    expect(
      JSON.parse(readFileSync(join(dir, 'quirks.json'), 'utf8')).some(
        (q: { id: string }) => q.id === 'whistles_while_working',
      ),
    ).toBe(true);
    const preview = (await post('/api/preview', { raw, department: 'hr', n: 400, seed: 's' })) as {
      summary: { quirks: Record<string, number>; count: number };
      sample: unknown[];
    };
    expect(preview.summary.count).toBe(400);
    expect(preview.summary.quirks['whistles_while_working']).toBeGreaterThan(0.05);
    expect(preview.sample.length).toBe(12);
  });

  it('previews an unsaved draft and refuses an invalid one, and only accepts the five library parts', async () => {
    const raw = readRaw(dir) as unknown as {
      departments: { department: string; female_share: number }[];
    };
    raw.departments.find((d) => d.department === 'it')!.female_share = 0.9;
    const p = (await post('/api/preview', { raw, department: 'it', n: 600, seed: 'x' })) as {
      summary: { female_share: number };
    };
    expect(p.summary.female_share).toBeGreaterThan(0.85);
    raw.departments[0]!.female_share = 7;
    const bad = (await post('/api/preview', { raw, department: 'it', n: 10 })) as { error: string };
    expect(bad.error).toMatch(/fix the errors/);
    const none = await fetch(base + '/api/save', {
      method: 'POST',
      body: JSON.stringify({ archetypes: [] }),
    });
    expect(none.status).toBe(400);
  });
});
