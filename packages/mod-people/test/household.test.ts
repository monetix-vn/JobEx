import { describe, expect, it } from 'vitest';
import type { Person, WorldSeeds } from '@je/contracts';
import { generatePerson, generateHousehold, inheritTemperament, violations } from '../src';
import { generationStream } from '@je/kernel';
import { loadLibrary } from './library';

const seeds: WorldSeeds = { world_seed: 'w', run_seed: 'r' };
const library = loadLibrary();
const context = { seeds, created_turn: 0 };
const people = (n: number, department = 'production'): Person[] =>
  Array.from({ length: n }, (_, i) =>
    generatePerson(library, { department, event_id: `fam-${department}`, counter: i }, context),
  );
const mean = (xs: readonly number[]): number =>
  xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);

describe('households', () => {
  const heads = people(1500);
  const households = heads.map((p) => generateHousehold(library, p, context));

  it('is deterministic', () => {
    const again = heads.slice(0, 50).map((p) => generateHousehold(library, p, context));
    expect(again).toEqual(households.slice(0, 50));
  });

  it('gives married and partnered people a spouse, and the right number of children', () => {
    for (const h of households) {
      const { life } = h.person;
      const partnered = life.marital === 'married' || life.marital === 'partnered';
      expect(h.spouse !== undefined, h.person.id).toBe(partnered);
      expect(h.children.length).toBe(life.children);
      expect(h.person.family?.children).toEqual(h.children.map((c) => c.id));
      expect(h.person.family?.spouse).toBe(h.spouse?.id);
    }
  });

  it('keeps everyone plausible: no contradictions, children younger than the parent by at least 18 years', () => {
    const all = households.flatMap((h) => h.everyone);
    expect(new Set(all.map((p) => p.id)).size).toBe(all.length);
    for (const h of households) {
      for (const p of h.everyone) expect(violations(p), p.id).toEqual([]);
      for (const c of h.children) {
        expect(c.origin.age_at_creation).toBeLessThanOrEqual(h.person.origin.age_at_creation - 18);
        expect(c.origin.education).toBe('in_school');
        expect(c.life.department).toBe('household');
      }
      for (const p of h.parents) {
        expect(p.origin.age_at_creation).toBeGreaterThanOrEqual(
          h.person.origin.age_at_creation + 18,
        );
      }
    }
  });

  it('follows the spouse age gap and the male-first sex ratio at birth', () => {
    const gaps: number[] = [];
    for (const h of households) {
      if (!h.spouse) continue;
      const husbandOlder =
        h.person.origin.gender === 'male'
          ? h.person.origin.age_at_creation - h.spouse.origin.age_at_creation
          : h.spouse.origin.age_at_creation - h.person.origin.age_at_creation;
      gaps.push(husbandOlder);
    }
    expect(Math.abs(mean(gaps) - 2.5)).toBeLessThan(0.5);
    const kids = households.flatMap((h) => h.children);
    expect(kids.length).toBeGreaterThan(1000);
    const maleShare = kids.filter((k) => k.origin.gender === 'male').length / kids.length;
    expect(Math.abs(maleShare - 0.526)).toBeLessThan(0.04);
  });

  it("gives children the father's family name and the spouse the same region as the person", () => {
    for (const h of households.slice(0, 400)) {
      const father =
        h.person.origin.gender === 'male'
          ? h.person
          : h.spouse?.origin.gender === 'male'
            ? h.spouse
            : h.person;
      for (const c of h.children) expect(c.origin.name.family).toBe(father.origin.name.family);
      if (h.spouse) expect(h.spouse.origin.region).toBe(h.person.origin.region);
    }
  });

  it('inherits temperament: children of honest parents are more honest than children of dishonest parents', () => {
    const high = {
      caution: 50,
      ambition: 50,
      warmth: 50,
      integrity: 85,
      resilience: 50,
      impulsivity: 50,
    };
    const low = { ...high, integrity: 15 };
    const stream = generationStream(seeds, 'inherit', 'test', 0);
    const honest = Array.from(
      { length: 2000 },
      () => inheritTemperament(high, high, stream).integrity,
    );
    const dishonest = Array.from(
      { length: 2000 },
      () => inheritTemperament(low, low, stream).integrity,
    );
    expect(mean(honest) - mean(dishonest)).toBeGreaterThan(25);
    // Regression to the mean: a child of two extreme parents is less extreme than they are.
    expect(mean(honest)).toBeLessThan(85);
    expect(mean(dishonest)).toBeGreaterThan(15);
  });
});
