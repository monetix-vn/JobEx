import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_WORLD_SETTINGS } from '@je/contracts';
import { createWorld, ensureRoster } from '@je/mod-people';
import { dossierOf, libraryFromFiles, worldIdFrom } from '../src/world-bridge';

const dir = join(__dirname, '..', '..', '..', 'library');
const files = Object.fromEntries(
  readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [f, readFileSync(join(dir, f), 'utf8')]),
);

describe('the world in the game page', () => {
  const library = libraryFromFiles(files);
  const world = ensureRoster(
    library,
    createWorld({
      id: 'w',
      name: 'W',
      worldSeed: 's',
      settings: DEFAULT_WORLD_SETTINGS,
      createdAt: '2026-10-02T00:00:00Z',
    }),
    12,
  );

  it('builds the people library from the bundled files and rejects a broken one', () => {
    expect(library.archetypes.length).toBeGreaterThan(0);
    expect(() => libraryFromFiles({ ...files, 'archetypes.json': '[]' })).toThrow(/invalid/);
  });

  it('shows what the player can see of people, never their hidden traits', () => {
    const entries = dossierOf(world, 'en', (id) => id);
    expect(entries).toHaveLength(12);
    const text = JSON.stringify(entries);
    for (const p of world.people) {
      for (const quirk of p.origin.quirks) expect(text).not.toContain(`"${quirk}"`);
    }
    expect(Object.keys(entries[0]!).sort()).toEqual(
      ['ageBand', 'department', 'id', 'look', 'name', 'retired'].sort(),
    );
    expect(dossierOf(world, 'vi', (id) => id)[0]!.ageBand).toMatch(/tuổi/);
  });

  it('makes a safe, unique world id from any name', () => {
    expect(worldIdFrom('My Factory!', [])).toBe('my-factory');
    expect(worldIdFrom('Nhà máy Đồng Nai', [])).toBe('nha-may-dong-nai');
    expect(worldIdFrom('!!!', [])).toBe('world');
    expect(worldIdFrom('A', ['a', 'a-2'])).toBe('a-3');
  });
});
