import { existsSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DEFAULT_WORLD_SETTINGS } from '@je/contracts';
import { createWorld } from '@je/mod-people';
import { createSaveHost } from '../src/server';

const root = mkdtempSync(join(tmpdir(), 'je-saves-'));
const server = createSaveHost(root);
let base = '';
beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

const H = { 'x-jobex': '1', 'content-type': 'application/json' };
const world = (id: string, extra = {}) => ({
  ...createWorld({
    id,
    name: 'My world',
    worldSeed: 'seed-1',
    settings: DEFAULT_WORLD_SETTINGS,
    createdAt: '2026-10-02T00:00:00Z',
  }),
  ...extra,
});
const put = (path: string, body: unknown, headers: Record<string, string> = H) =>
  fetch(base + path, {
    method: 'PUT',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

describe('the save host', () => {
  it('answers a ping and an empty list', async () => {
    const ping = (await (await fetch(base + '/ping', { headers: H })).json()) as {
      ok: boolean;
      version: number;
    };
    expect(ping).toMatchObject({ ok: true, version: 1 });
    const list = (await (await fetch(base + '/worlds', { headers: H })).json()) as {
      worlds: unknown[];
    };
    expect(list.worlds).toEqual([]);
  });

  it('saves a world to a folder, lists it, reads it back, and writes a readable history', async () => {
    const w = world('alpha', {
      lore: [
        { year: 0, kind: 'created', person: 'p', en: 'Something happened.', vi: 'Có chuyện.' },
      ],
    });
    expect((await put('/worlds/alpha', w)).status).toBe(200);
    expect(existsSync(join(root, 'alpha', 'world.json'))).toBe(true);
    expect(readFileSync(join(root, 'alpha', 'lore.md'), 'utf8')).toContain('Something happened.');
    const list = (await (await fetch(base + '/worlds', { headers: H })).json()) as {
      worlds: { id: string; name: string; year: number }[];
    };
    expect(list.worlds.map((x) => x.id)).toEqual(['alpha']);
    const back = (await (await fetch(base + '/worlds/alpha', { headers: H })).json()) as typeof w;
    expect(back).toEqual(w);
  });

  it('keeps a backup of the previous save and never leaves a half-written file', async () => {
    await put('/worlds/beta', world('beta', { year: 1 }));
    await put('/worlds/beta', world('beta', { year: 2 }));
    expect(JSON.parse(readFileSync(join(root, 'beta', 'world.json'), 'utf8')).year).toBe(2);
    expect(JSON.parse(readFileSync(join(root, 'beta', 'world.json.bak'), 'utf8')).year).toBe(1);
    expect(readdirSync(join(root, 'beta')).some((f) => f.endsWith('.tmp'))).toBe(false);
  });

  it('refuses a damaged world, a mismatched id and unsafe ids (no path tricks)', async () => {
    expect((await put('/worlds/gamma', 'not json')).status).toBe(400);
    expect((await put('/worlds/gamma', world('other'))).status).toBe(400);
    expect((await put('/worlds/gamma', { ...world('gamma'), format: 9 })).status).toBe(400);
    for (const bad of ['..', '%2e%2e', 'A%2fB', 'a b']) {
      const r = await fetch(`${base}/worlds/${bad}`, { headers: H });
      expect([400, 404], bad).toContain(r.status);
    }
    expect(existsSync(join(root, 'gamma'))).toBe(false);
  });

  it('keeps run saves inside the world folder', async () => {
    await put('/worlds/delta', world('delta'));
    expect((await put('/worlds/delta/runs/run1', { format: 1, turn: 5 })).status).toBe(200);
    const back = (await (await fetch(base + '/worlds/delta/runs/run1', { headers: H })).json()) as {
      turn: number;
    };
    expect(back.turn).toBe(5);
    expect((await put('/worlds/delta/runs/..%2Fescape', { x: 1 })).status).toBe(400);
    expect((await put('/worlds/nope/runs/run1', { x: 1 })).status).toBe(404);
    expect((await put('/worlds/delta/runs/bad', 'not json')).status).toBe(400);
  });

  it('moves a deleted world to .trash instead of erasing it', async () => {
    await put('/worlds/epsilon', world('epsilon'));
    const r = await fetch(base + '/worlds/epsilon', { method: 'DELETE', headers: H });
    expect(r.status).toBe(200);
    expect(existsSync(join(root, 'epsilon'))).toBe(false);
    expect(readdirSync(join(root, '.trash')).some((n) => n.startsWith('epsilon-'))).toBe(true);
  });

  it('refuses other websites, and any request without the x-jobex header', async () => {
    const foreign = await fetch(base + '/worlds', {
      headers: { ...H, origin: 'https://evil.example' },
    });
    expect(foreign.status).toBe(403);
    const noHeader = await fetch(base + '/worlds');
    expect(noHeader.status).toBe(403);
    const fileOrigin = await fetch(base + '/ping', { headers: { ...H, origin: 'null' } });
    expect(fileOrigin.status).toBe(200);
    const local = await fetch(base + '/ping', {
      headers: { ...H, origin: 'http://localhost:5173' },
    });
    expect(local.status).toBe(200);
    expect(local.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
    const preflight = await fetch(base + '/worlds/alpha', {
      method: 'OPTIONS',
      headers: { origin: 'http://localhost:5173' },
    });
    expect(preflight.status).toBe(204);
  });
});
