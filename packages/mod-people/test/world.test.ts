import { describe, expect, it } from 'vitest';
import { DEFAULT_WORLD_SETTINGS, PERSONAS } from '@je/contracts';
import type { RunSummary, World } from '@je/contracts';
import {
  advanceWorldYear,
  ageOf,
  createWorld,
  ensureRoster,
  nextRunSeed,
  parseWorld,
  personFromProtagonist,
  retireProtagonist,
  temperamentFromRun,
  violations,
} from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const fresh = (): World =>
  createWorld({
    id: 'test-world',
    name: 'Test',
    worldSeed: 'ws-1',
    settings: DEFAULT_WORLD_SETTINGS,
    createdAt: '2026-10-02T00:00:00Z',
  });

const clean: RunSummary = {
  role_id: 'role.hr.hrbp',
  department: 'hr',
  profile: { name: 'Nguyễn Thị Lan', ...PERSONAS.parent },
  ending: 'promoted',
  weeks: 51,
  stress: 40,
  facts: [
    { id: 'ran_fair_process', severity: 1, level: 1 },
    { id: 'investigated_fairly', severity: 2, level: 1 },
  ],
  reputation: { 'player.rep.boss': 66, 'player.rep.staff': 62 },
};
const dark: RunSummary = {
  ...clean,
  ending: 'fired',
  stress: 85,
  facts: [
    { id: 'rigged_shortlist', severity: 6, level: 2 },
    { id: 'retaliated_against_complainant', severity: 8, level: 2 },
    { id: 'hid_injury', severity: 8, level: 1 },
  ],
  reputation: { 'player.rep.boss': 25, 'player.rep.staff': 20 },
};

describe('a world and its people', () => {
  it('makes a staff of 50 around the player, deterministically, and only adds what is missing', () => {
    const a = ensureRoster(library, fresh());
    const b = ensureRoster(library, fresh());
    expect(a.people).toHaveLength(50);
    expect(a).toEqual(b);
    const bigger = ensureRoster(library, a, 60);
    expect(bigger.people).toHaveLength(60);
    expect(bigger.people.slice(0, 50)).toEqual(a.people);
    expect(new Set(a.people.map((p) => p.id)).size).toBe(50);
    for (const p of a.people) expect(violations(p), p.id).toEqual([]);
  });

  it('follows the department mix of a cookware factory and differs between worlds', () => {
    const a = ensureRoster(library, fresh(), 400);
    const production = a.people.filter((p) => p.life.department === 'production').length / 400;
    expect(production).toBeGreaterThan(0.3);
    expect(production).toBeLessThan(0.5);
    const other = ensureRoster(library, { ...fresh(), id: 'other', world_seed: 'ws-2' }, 50);
    expect(other.people.map((p) => p.origin.name)).not.toEqual(
      ensureRoster(library, fresh()).people.map((p) => p.origin.name),
    );
  });

  it('gives each run its own seed, derived from the world seed', () => {
    const w = fresh();
    expect(nextRunSeed(w)).toBe('ws-1/run1');
    const after = retireProtagonist(library, ensureRoster(library, w), clean, nextRunSeed(w)).world;
    expect(nextRunSeed(after)).toBe('ws-1/run2');
  });
});

describe('the protagonist stays in the world', () => {
  it('becomes an autonomous person with the temperament their choices showed', () => {
    const w = ensureRoster(library, fresh());
    const good = personFromProtagonist(library, w, clean);
    const bad = personFromProtagonist(library, w, dark);
    expect(good.controller).toBe('auto');
    expect(good.legacy).toMatchObject({ run_no: 1, ending: 'promoted' });
    expect(bad.origin.temperament.integrity).toBeLessThan(good.origin.temperament.integrity - 30);
    expect(bad.origin.temperament.resilience).toBeLessThan(good.origin.temperament.resilience);
    expect(good.origin.name).toEqual({ family: 'Nguyễn', middle: 'Thị', given: 'Lan' });
    expect(violations(good)).toEqual([]);
    expect(violations(bad)).toEqual([]);
    expect(good.origin.quirks).toContain('quotes_the_policy');
    expect(bad.origin.quirks).toContain('bends_the_rules_for_friends');
  });

  it('is recorded in the world: run, person and a line of history', () => {
    const w = ensureRoster(library, fresh());
    const { world, person, lore } = retireProtagonist(library, w, dark, 'ws-1/run1');
    expect(world.runs).toEqual([
      {
        run_no: 1,
        run_seed: 'ws-1/run1',
        role_id: 'role.hr.hrbp',
        protagonist: person.id,
        ending: 'fired',
        weeks: 51,
      },
    ]);
    expect(world.people).toHaveLength(51);
    expect(lore.en).toContain('fired');
    expect(w.people).toHaveLength(50);
  });

  it('shows the temperament mapping is monotonic in the dark facts', () => {
    const levels = [0, 1, 3].map(
      (n) =>
        temperamentFromRun({
          ...clean,
          facts: Array.from({ length: n }, (_, i) => ({ id: `f${i}`, severity: 6, level: 1 })),
        }).integrity,
    );
    expect(levels[0]!).toBeGreaterThan(levels[1]!);
    expect(levels[1]!).toBeGreaterThan(levels[2]!);
  });
});

describe('a year passes in the world', () => {
  it('ages everyone, brings life events with history lines, and is deterministic', () => {
    const start = ensureRoster(library, fresh(), 200);
    const a = advanceWorldYear(library, start);
    const b = advanceWorldYear(library, start);
    expect(a).toEqual(b);
    expect(a.world.year).toBe(1);
    expect(ageOf(a.world.people[0]!, 1)).toBe(ageOf(start.people[0]!, 0) + 1);
    expect(a.lore.length).toBeGreaterThan(5);
    expect(a.lore.length).toBeLessThan(200);
    expect(a.lore[0]!.vi.length).toBeGreaterThan(5);
    expect(start.year).toBe(0);
  });

  it('keeps the world valid over thirty years and retires the old', () => {
    let w = ensureRoster(library, fresh(), 120);
    for (let i = 0; i < 30; i++) w = advanceWorldYear(library, w).world;
    expect(w.year).toBe(30);
    for (const p of w.people) {
      if (p.status === 'active') {
        const age = ageOf(p, w.year);
        expect(age).toBeLessThan(66);
        expect(violations({ ...p, origin: { ...p.origin, age_at_creation: age } }), p.id).toEqual(
          [],
        );
      }
    }
    expect(w.people.some((p) => p.status === 'retired')).toBe(true);
    expect(w.lore.filter((l) => l.kind === 'life_event').length).toBeGreaterThan(300);
  });
});

describe('reading a world file', () => {
  it('accepts a world and refuses damaged ones', () => {
    const w = ensureRoster(library, fresh());
    expect(parseWorld(JSON.stringify(w)).ok).toBe(true);
    for (const text of [
      '',
      'nope',
      '{}',
      JSON.stringify({ ...w, format: 2 }),
      JSON.stringify({ ...w, id: '../evil' }),
      JSON.stringify({ ...w, people: 'x' }),
      JSON.stringify({ ...w, people: [{ id: 1 }] }),
      JSON.stringify({ ...w, year: -1 }),
    ]) {
      expect(parseWorld(text).ok, text.slice(0, 40)).toBe(false);
    }
  });
});
