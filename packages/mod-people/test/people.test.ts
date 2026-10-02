import { describe, expect, it } from 'vitest';
import type { Person, PersonRequest, WorldSeeds } from '@je/contracts';
import {
  assembleLibrary,
  generatePerson,
  moneyPressure,
  summarisePeople,
  violations,
} from '../src';
import { loadLibrary, rawLibrary } from './library';

const seeds: WorldSeeds = { world_seed: 'world-1', run_seed: 'run-1' };
const library = loadLibrary();
const make = (
  department: string,
  n: number,
  extra: Partial<PersonRequest> = {},
  s: WorldSeeds = seeds,
): Person[] =>
  Array.from({ length: n }, (_, i) =>
    generatePerson(
      library,
      {
        department,
        event_id: `test-${department}-${extra.story_function ?? 'any'}`,
        counter: i,
        ...extra,
      },
      { seeds: s, created_turn: 0 },
    ),
  );
const mean = (xs: readonly number[]): number =>
  xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);

describe('the people library', () => {
  it('validates with no errors and records which tables are still unverified', () => {
    const result = assembleLibrary(rawLibrary());
    expect(result.diagnostics.filter((d) => d.severity === 'error')).toEqual([]);
    expect(result.diagnostics.some((d) => d.code === 'table.unverified')).toBe(true);
    expect(result.library?.archetypes.length).toBeGreaterThanOrEqual(12);
    expect(result.library?.quirks.length).toBeGreaterThanOrEqual(30);
  });

  it('catches a broken reference, a bad probability row and a missing text', () => {
    const raw = rawLibrary();
    const quirks = raw.quirks as {
      id: string;
      incompatible_with?: string[];
      name: { en: string; vi: string };
    }[];
    quirks[0]!.incompatible_with = ['no_such_quirk'];
    quirks[1]!.name = { en: 'x', vi: '' };
    const tables = raw.tables as { marital_by_age: { rows: Record<string, number | string>[] } };
    tables.marital_by_age.rows[0]!.single = 0.2;
    const codes = assembleLibrary(raw)
      .diagnostics.filter((d) => d.severity === 'error')
      .map((d) => d.code);
    expect(codes).toContain('quirk.incompatible');
    expect(codes).toContain('text.missing');
    expect(codes).toContain('table.sum');
  });
});

describe('the generator', () => {
  it('is deterministic: same world, run, event and counter give the same person', () => {
    expect(make('hr', 20)).toEqual(make('hr', 20));
  });

  it('gives different people for another run seed, another world, another counter', () => {
    const base = make('hr', 1)[0]!;
    expect(make('hr', 1, {}, { ...seeds, run_seed: 'run-2' })[0]).not.toEqual(base);
    expect(make('hr', 1, {}, { ...seeds, world_seed: 'world-2' })[0]).not.toEqual(base);
    expect(make('hr', 2)[1]).not.toEqual(base);
  });

  it('only produces valid people, up to the whole world of 3000 (speed is checked by the workbench)', () => {
    const people = make('sales_export', 3000);
    expect(people.every((p) => violations(p).length === 0)).toBe(true);
    expect(new Set(people.map((p) => p.id)).size).toBe(3000);
  });

  it('never combines incompatible quirks, and respects a minimum education', () => {
    const people = make('finance', 800);
    for (const p of people) {
      for (const id of p.origin.quirks) {
        const quirk = library.quirks.find((q) => q.id === id)!;
        for (const other of p.origin.quirks)
          expect(quirk.incompatible_with ?? []).not.toContain(other);
      }
      expect(['lower_secondary', 'upper_secondary', 'vocational']).not.toContain(
        p.origin.education,
      );
    }
  });

  it('follows the department: gender mix, age and plausible money', () => {
    for (const [dept, share] of [
      ['hr', 0.78],
      ['it', 0.2],
      ['finance', 0.72],
    ] as const) {
      const s = summarisePeople(make(dept, 2000));
      expect(Math.abs(s.female_share - share), dept).toBeLessThan(0.04);
    }
    const it = summarisePeople(make('it', 2000));
    expect(Math.abs(it.age_mean - 30)).toBeLessThan(1.5);
    expect(it.money_pressure_mean).toBeGreaterThan(5);
    expect(it.money_pressure_mean).toBeLessThan(80);
  });

  it('follows the marriage table by age band', () => {
    const s = summarisePeople(make('production', 4000));
    expect(s.married_by_band['25-34']).toBeGreaterThan(0.4);
    expect(s.married_by_band['25-34']).toBeLessThan(0.75);
    expect(s.married_by_band['35-44']!).toBeGreaterThan(s.married_by_band['25-34']!);
    expect(s.married_by_band['18-24']!).toBeLessThan(s.married_by_band['25-34']!);
  });

  it('keeps temperament independent of gender and age (the fairness rule)', () => {
    const people = make('production', 4000);
    const men = people.filter((p) => p.origin.gender === 'male');
    const women = people.filter((p) => p.origin.gender === 'female');
    for (const axis of [
      'caution',
      'ambition',
      'warmth',
      'integrity',
      'resilience',
      'impulsivity',
    ] as const) {
      const diff = Math.abs(
        mean(men.map((p) => p.origin.temperament[axis])) -
          mean(women.map((p) => p.origin.temperament[axis])),
      );
      expect(diff, axis).toBeLessThan(2.5);
    }
    const ages = people.map((p) => p.origin.age_at_creation);
    const integrity = people.map((p) => p.origin.temperament.integrity);
    const ma = mean(ages);
    const mi = mean(integrity);
    const cov = mean(ages.map((a, i) => (a - ma) * (integrity[i]! - mi)));
    const sda = Math.sqrt(mean(ages.map((a) => (a - ma) ** 2)));
    const sdi = Math.sqrt(mean(integrity.map((a) => (a - mi) ** 2)));
    expect(Math.abs(cov / (sda * sdi))).toBeLessThan(0.08);
  });

  it('casts by story function: tempters are less honest than whistleblowers, and hiring path is honoured', () => {
    const tempters = make('purchasing', 700, { story_function: 'tempter' });
    const whistle = make('purchasing', 700, { story_function: 'whistleblower' });
    const avg = (xs: Person[]): number => mean(xs.map((p) => p.origin.temperament.integrity));
    expect(avg(whistle) - avg(tempters)).toBeGreaterThan(12);
    const relatives = make('hr', 20, { hiring_path: 'owner_relative' });
    expect(relatives.every((p) => p.origin.hiring_path === 'owner_relative')).toBe(true);
  });

  it('gives a varied cast with real-looking names', () => {
    const people = make('hr', 300);
    const s = summarisePeople(people);
    expect(s.names_distinct).toBeGreaterThan(250);
    expect(
      people.every((p) => p.origin.name.family.length > 0 && p.origin.name.given.length > 0),
    ).toBe(true);
    expect(Object.keys(s.archetypes).length).toBeGreaterThanOrEqual(10);
  });

  it('respects an age range and a fixed gender, and money pressure follows debt and dependents', () => {
    const young = make('marketing', 100, { age_range: [22, 26], gender: 'female' });
    expect(
      young.every(
        (p) =>
          p.origin.age_at_creation >= 22 &&
          p.origin.age_at_creation <= 26 &&
          p.origin.gender === 'female',
      ),
    ).toBe(true);
    const base = young[0]!;
    const squeezed = {
      ...base.life,
      debt_vnd: base.life.income_vnd * 40,
      dependents: 4,
      savings_vnd: 0,
    };
    const easy = {
      ...base.life,
      debt_vnd: 0,
      dependents: 0,
      savings_vnd: base.life.income_vnd * 6,
    };
    expect(moneyPressure(squeezed)).toBeGreaterThan(moneyPressure(easy));
  });

  it('rejects an unknown department', () => {
    expect(() =>
      generatePerson(
        library,
        { department: 'nope', event_id: 'x', counter: 0 },
        { seeds, created_turn: 0 },
      ),
    ).toThrow(/unknown department/);
  });
});
