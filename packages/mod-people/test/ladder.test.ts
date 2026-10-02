import { describe, expect, it } from 'vitest';
import { DEFAULT_WORLD_SETTINGS } from '@je/contracts';
import type { Person, Temperament } from '@je/contracts';
import { TEMPERAMENT_AXES } from '@je/contracts';
import {
  LADDER,
  advanceWorldYear,
  capacityOf,
  createWorld,
  ensureRoster,
  generatePerson,
  reviewLadder,
  stepName,
} from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const seeds = { world_seed: 'w', run_seed: 'ladder' };
const flat = Object.fromEntries(TEMPERAMENT_AXES.map((a) => [a, 50])) as Temperament;

function person(
  id: string,
  over: Partial<Person['life']> = {},
  t: Partial<Temperament> = {},
): Person {
  const base = generatePerson(
    library,
    { department: 'qc', event_id: id, counter: 0 },
    { seeds, created_turn: 0 },
  );
  return {
    ...base,
    id,
    created_year: 0,
    origin: { ...base.origin, age_at_creation: 35, temperament: { ...flat, ...t } },
    life: {
      ...base.life,
      department: 'qc',
      ladder_step: 0,
      tenure_years: 5,
      performance: 80,
      ...over,
    },
  };
}
const team = (): Person[] => [
  person('person.a', { ladder_step: 1, tenure_years: 6, performance: 75 }, { ambition: 50 }),
  person('person.b', { ladder_step: 0, tenure_years: 4, performance: 90 }, { ambition: 80 }),
  person('person.c', { ladder_step: 0, tenure_years: 3, performance: 60 }, { ambition: 30 }),
  person('person.d', { ladder_step: 0, tenure_years: 1, performance: 50 }),
  person('person.e', { ladder_step: 0, tenure_years: 1, performance: 50 }),
  person('person.f', { ladder_step: 0, tenure_years: 1, performance: 50 }),
];

describe('the ladder', () => {
  it('has steps in order with rising pay and room that shrinks', () => {
    expect(LADDER.map((s) => s.id)).toEqual(['staff', 'senior', 'lead', 'manager', 'head']);
    for (let i = 1; i < LADDER.length; i++) {
      expect(LADDER[i]!.income_mult).toBeGreaterThan(LADDER[i - 1]!.income_mult);
      expect(LADDER[i]!.share).toBeLessThan(LADDER[i - 1]!.share);
    }
    expect(stepName(1, 'vi')).toBe('Chuyên viên chính');
    expect(stepName(99, 'en')).toBe('Head of department');
    expect(capacityOf(2, 3)).toBe(1);
    expect(capacityOf(4, 6)).toBe(0);
    expect(capacityOf(4, 60)).toBe(1);
  });

  it('is deterministic and does not touch the input', () => {
    const input = team();
    const before = JSON.stringify(input);
    const a = reviewLadder(library, input, 1, seeds);
    expect(JSON.stringify(input)).toBe(before);
    expect(reviewLadder(library, team(), 1, seeds)).toEqual(a);
  });

  it('every year adds a year of tenure for everyone and moves performance a little', () => {
    const { people } = reviewLadder(library, team(), 1, seeds);
    const a = people.find((p) => p.id === 'person.a')!;
    expect(a.life.tenure_years).toBe(7);
    expect(Math.abs(a.life.performance - 75)).toBeLessThan(15);
  });

  it('a vacancy goes to the best candidate from the step below, and the promotion raises pay', () => {
    // six people have room for one lead (step 2) and one senior; only person.a is a senior with the record for lead
    const input = team().map((p) =>
      p.id === 'person.a' ? { ...p, life: { ...p.life, tenure_years: 8, performance: 90 } } : p,
    );
    const { people, lore } = reviewLadder(library, input, 1, seeds);
    const a = people.find((p) => p.id === 'person.a')!;
    expect(a.life.ladder_step).toBe(2);
    expect(a.life.income_vnd).toBeGreaterThan(input[0]!.life.income_vnd);
    expect(
      lore.some(
        (l) => l.kind === 'promotion' && l.person === 'person.a' && l.vi.includes('Trưởng nhóm'),
      ),
    ).toBe(true);
    // the freed senior place chains down to the strongest staff member (person.b)
    expect(people.find((p) => p.id === 'person.b')!.life.ladder_step).toBe(1);
  });

  it('nobody is promoted without the tenure and the performance', () => {
    const input = team().map((p) => ({
      ...p,
      life: { ...p.life, tenure_years: 0, performance: 30 },
    }));
    const { people } = reviewLadder(library, input, 1, seeds);
    expect(people.filter((p) => p.life.ladder_step >= 2)).toHaveLength(0);
  });

  it('an ambitious runner-up is passed over and may leave; a new hire keeps the department the same size', () => {
    let left = 0;
    let passed = 0;
    for (let y = 1; y <= 60; y++) {
      const input = team().map((p) =>
        p.id === 'person.a'
          ? {
              ...p,
              origin: { ...p.origin, temperament: { ...p.origin.temperament, ambition: 85 } },
              life: { ...p.life, ladder_step: 0 },
            }
          : p.id === 'person.c'
            ? {
                ...p,
                origin: { ...p.origin, temperament: { ...p.origin.temperament, ambition: 85 } },
                life: { ...p.life, performance: 85, tenure_years: 5 },
              }
            : p.id === 'person.b'
              ? {
                  ...p,
                  origin: { ...p.origin, temperament: { ...p.origin.temperament, ambition: 85 } },
                }
              : p,
      );
      const r = reviewLadder(library, input, y, seeds);
      passed += r.lore.filter((l) => l.kind === 'passed_over').length;
      const gone = r.people.filter((p) => p.status === 'gone');
      left += gone.length;
      expect(r.people.filter((p) => p.status !== 'gone')).toHaveLength(6);
      expect(r.lore.filter((l) => l.kind === 'hired')).toHaveLength(gone.length);
      for (const hire of r.people.filter((p) => p.id.includes('hire.'))) {
        expect(hire.life.ladder_step).toBe(0);
        expect(hire.life.department).toBe('qc');
      }
    }
    expect(passed + left).toBeGreaterThan(0);
    expect(left).toBeGreaterThan(0);
  });

  it('people who retire this year are replaced', () => {
    const input = team();
    const retired = { ...input[5]!, status: 'retired' as const };
    const r = reviewLadder(library, [...input.slice(0, 5), retired], 1, seeds, [retired]);
    expect(r.people.filter((p) => p.status !== 'retired' && p.status !== 'gone')).toHaveLength(6);
  });

  it('runs inside the world year: careers move for everyone, the lore says so, and a fixed seed gives the same year', () => {
    const world = ensureRoster(
      library,
      createWorld({
        id: 'w',
        name: 'W',
        worldSeed: 'ladder-world',
        settings: DEFAULT_WORLD_SETTINGS,
        createdAt: '2026-10-03T00:00:00Z',
      }),
      50,
    );
    let w = world;
    const kinds = new Set<string>();
    for (let y = 0; y < 8; y++) {
      const next = advanceWorldYear(library, w);
      for (const l of next.lore) kinds.add(l.kind);
      w = next.world;
    }
    expect(kinds.has('promotion')).toBe(true);
    expect(
      [...kinds].every((k) =>
        [
          'life_event',
          'promotion',
          'passed_over',
          'left',
          'hired',
          'run_ended',
          'created',
        ].includes(k),
      ),
    ).toBe(true);
    expect(w.people.some((p) => p.life.ladder_step >= 2)).toBe(true);
    expect(JSON.stringify(advanceWorldYear(library, world))).toBe(
      JSON.stringify(advanceWorldYear(library, world)),
    );
    const active = w.people.filter((p) => p.status !== 'gone' && p.status !== 'retired');
    expect(active.length).toBeGreaterThanOrEqual(40);
  });
});
