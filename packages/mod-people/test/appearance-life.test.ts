import { describe, expect, it } from 'vitest';
import type { Person, WorldSeeds } from '@je/contracts';
import { generationStream } from '@je/kernel';
import {
  applyLifeEvent,
  assembleLibrary,
  generateHousehold,
  generatePerson,
  lifeEventChances,
  liveOneYear,
  violations,
  visibleTells,
} from '../src';
import { loadLibrary, rawLibrary } from './library';

const seeds: WorldSeeds = { world_seed: 'w', run_seed: 'r' };
const library = loadLibrary();
const context = { seeds, created_turn: 0 };
const people = (n: number, department = 'production', extra = {}): Person[] =>
  Array.from({ length: n }, (_, i) =>
    generatePerson(
      library,
      { department, event_id: `al-${department}`, counter: i, ...extra },
      context,
    ),
  );
const mean = (xs: readonly number[]): number =>
  xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);

describe('appearance', () => {
  const all = people(3000);

  it('every generated person has a full, valid appearance, drawn from the library', () => {
    for (const p of all) {
      const a = p.appearance!;
      expect(a).toBeDefined();
      for (const [trait, options] of Object.entries(library.appearance.traits)) {
        const value = (a as unknown as Record<string, string>)[trait]!;
        const ok =
          options.some((o) => o.id === value) || (trait === 'hair_colour' && value === 'grey');
        expect(ok, `${trait}=${value}`).toBe(true);
      }
      expect(a.skin_tone).toBeGreaterThanOrEqual(1);
      expect(a.skin_tone).toBeLessThanOrEqual(5);
    }
  });

  it('makes sense for the person: only men have beards, hair greys and glasses grow with age', () => {
    const nonMenWithBeards = all.filter(
      (p) => p.origin.gender !== 'male' && p.appearance!.facial_hair !== 'none',
    );
    expect(nonMenWithBeards).toHaveLength(0);
    const young = all.filter((p) => p.origin.age_at_creation < 30);
    const old = all.filter((p) => p.origin.age_at_creation >= 50);
    const greyShare = (xs: Person[]): number =>
      xs.filter((p) => p.appearance!.hair_colour === 'grey').length / xs.length;
    const glassesShare = (xs: Person[]): number =>
      xs.filter((p) => p.appearance!.glasses).length / xs.length;
    expect(greyShare(old)).toBeGreaterThan(greyShare(young) + 0.3);
    expect(glassesShare(old)).toBeGreaterThan(glassesShare(young));
  });

  it('is independent of temperament and does not change the rest of a person (own stream)', () => {
    // No trait correlates with integrity beyond sampling noise: compare the means across two build groups.
    const heavy = all.filter((p) => p.appearance!.build === 'heavy');
    const slim = all.filter((p) => p.appearance!.build === 'slim');
    expect(
      Math.abs(
        mean(heavy.map((p) => p.origin.temperament.integrity)) -
          mean(slim.map((p) => p.origin.temperament.integrity)),
      ),
    ).toBeLessThan(3);
    // Removing the appearance from a person leaves exactly what a library without appearance would have drawn.
    const again = people(5);
    expect(again.map((p) => ({ ...p, appearance: undefined }))).toEqual(
      all.slice(0, 5).map((p) => ({ ...p, appearance: undefined })),
    );
  });

  it('children look like their parents more than strangers do', () => {
    const heads = people(1200).filter((p) => p.life.children > 0 && p.life.marital === 'married');
    let same = 0;
    let total = 0;
    let strangerSame = 0;
    const households = heads.map((p) => generateHousehold(library, p, context));
    for (let i = 0; i < households.length; i++) {
      const h = households[i]!;
      const stranger = households[(i + 7) % households.length]!.person;
      for (const c of h.children) {
        for (const trait of ['face', 'build', 'hair_style'] as const) {
          total += 1;
          const parentValues = [h.person.appearance![trait], h.spouse!.appearance![trait]];
          if (parentValues.includes(c.appearance![trait])) same += 1;
          if (stranger.appearance![trait] === c.appearance![trait]) strangerSame += 1;
        }
      }
    }
    expect(total).toBeGreaterThan(300);
    expect(same / total).toBeGreaterThan(strangerSame / total + 0.15);
  });

  it('shows tells of state, never of character', () => {
    const p = all[0]!;
    expect(visibleTells(p, { stress: 90, health: 40 })).toEqual(
      expect.arrayContaining(['tired_eyes', 'drawn_face']),
    );
    expect(visibleTells(p, { stress: 10, health: 95 })).not.toContain('tired_eyes');
    const bareFace = { ...p, appearance: { ...p.appearance!, face: 'square', build: 'heavy' } };
    expect(visibleTells(bareFace, { stress: 20, health: 90 })).toEqual(
      visibleTells(p, { stress: 20, health: 90 }),
    );
  });

  it('the library validator catches a trait with no option for some person', () => {
    const raw = rawLibrary();
    const appearance = raw.appearance as { traits: { facial_hair: { genders?: string[] }[] } };
    appearance.traits.facial_hair = appearance.traits.facial_hair.filter(
      (o) => !(o.genders ?? []).includes('female'),
    );
    const codes = assembleLibrary(raw)
      .diagnostics.filter((d) => d.severity === 'error')
      .map((d) => d.code);
    expect(codes).toContain('appearance.coverage');
  });
});

describe('life events', () => {
  const stream = (n: number) => generationStream(seeds, 'life', 'test', n);

  it('has the events a working life needs, and the validator accepts them', () => {
    expect(library.life_events.length).toBeGreaterThanOrEqual(12);
    const ids = library.life_events.map((e) => e.id);
    for (const id of ['marriage', 'child_born', 'divorce', 'serious_illness', 'loan_taken'])
      expect(ids).toContain(id);
  });

  it('chances follow age and state: marriage peaks in the late twenties, only the married can divorce, illness grows with age', () => {
    const base = people(1, 'production')[0]!;
    const single = {
      ...base,
      life: { ...base.life, marital: 'single' as const, children: 0, dependents: 0 },
    };
    const married = { ...base, life: { ...base.life, marital: 'married' as const } };
    const p = (person: Person, id: string, age: number): number =>
      lifeEventChances(library, person, age).find((c) => c.id === id)?.p ?? 0;
    expect(p(single, 'marriage', 27)).toBeGreaterThan(p(single, 'marriage', 22));
    expect(p(single, 'marriage', 27)).toBeGreaterThan(p(single, 'marriage', 40));
    expect(p(single, 'divorce', 30)).toBe(0);
    expect(p(married, 'divorce', 30)).toBeGreaterThan(0);
    expect(p(married, 'marriage', 30)).toBe(0);
    expect(p(married, 'serious_illness', 60)).toBeGreaterThan(p(married, 'serious_illness', 25));
    // Traits matter: a fragile person is likelier to fall ill.
    const fragile = {
      ...married,
      origin: { ...married.origin, temperament: { ...married.origin.temperament, resilience: 20 } },
    };
    const hardy = {
      ...married,
      origin: { ...married.origin, temperament: { ...married.origin.temperament, resilience: 80 } },
    };
    expect(p(fragile, 'serious_illness', 50)).toBeGreaterThan(p(hardy, 'serious_illness', 50));
  });

  it('applying an event changes the life state and leaves the old person alone', () => {
    const base = people(1, 'hr')[0]!;
    const before = JSON.stringify(base);
    const illness = library.life_events.find((e) => e.id === 'serious_illness')!;
    const after = applyLifeEvent(base, illness);
    expect(after.life.health).toBeLessThan(base.life.health);
    expect(after.life.debt_vnd).toBeGreaterThanOrEqual(base.life.debt_vnd);
    expect(JSON.stringify(base)).toBe(before);
    const baby = applyLifeEvent(
      { ...base, life: { ...base.life, marital: 'married', children: 1, dependents: 1 } },
      library.life_events.find((e) => e.id === 'child_born')!,
    );
    expect(baby.life.children).toBe(2);
    expect(baby.life.dependents).toBeGreaterThanOrEqual(2);
  });

  it('a cohort ages sensibly over twenty years: valid people, rising marriage, and the same result for the same seed', () => {
    const cohort = people(600, 'production', { age_range: [20, 22] });
    const run = (seedN: number): Person[] =>
      cohort.map((p, i) => {
        let current = p;
        const s = stream(seedN * 10000 + i);
        for (let year = 0; year < 20; year++) {
          current = liveOneYear(library, current, p.origin.age_at_creation + year, s).person;
        }
        return current;
      });
    const aged = run(1);
    for (const p of aged)
      expect(
        violations({
          ...p,
          origin: { ...p.origin, age_at_creation: p.origin.age_at_creation + 20 },
        }),
        p.id,
      ).toEqual([]);
    const marriedBefore = cohort.filter((p) => p.life.marital === 'married').length / cohort.length;
    const marriedAfter = aged.filter((p) => p.life.marital === 'married').length / aged.length;
    expect(marriedAfter).toBeGreaterThan(marriedBefore + 0.3);
    expect(marriedAfter).toBeGreaterThan(0.6);
    const withChildren = aged.filter((p) => p.life.children > 0).length / aged.length;
    expect(withChildren).toBeGreaterThan(0.4);
    expect(run(1)).toEqual(aged);
    expect(run(2)).not.toEqual(aged);
  });

  it('the validator catches a broken life event', () => {
    const raw = rawLibrary();
    const events = raw.life_events as {
      id: string;
      hazard: { age_from: number; age_to: number; p: number }[];
      effects: Record<string, unknown>;
    }[];
    events[0]!.hazard.push({ age_from: 20, age_to: 30, p: 0.5 });
    events[1]!.effects = { teleport: 5 };
    const codes = assembleLibrary(raw)
      .diagnostics.filter((d) => d.severity === 'error')
      .map((d) => d.code);
    expect(codes).toContain('life_event.hazard');
    expect(codes).toContain('life_event.effects');
  });
});
