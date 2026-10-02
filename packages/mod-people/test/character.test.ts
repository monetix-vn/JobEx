import { describe, expect, it } from 'vitest';
import { createGuestPort, personForCharacter } from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const seeds = { world_seed: 'w', run_seed: 'r' };
const khoa = {
  characterId: 'char.khoa',
  department: 'qc',
  traits: ['methodical', 'fair', 'tired'],
  turn: 0,
};

describe('the person under a fixed character', () => {
  it('uses the character id, the character department, and is deterministic', () => {
    const a = personForCharacter(library, seeds, khoa);
    expect(a.id).toBe('char.khoa');
    expect(a.life.department).toBe('qc');
    expect(personForCharacter(library, seeds, khoa)).toEqual(a);
    expect(personForCharacter(library, { ...seeds, run_seed: 'r2' }, khoa).origin).not.toEqual(
      a.origin,
    );
  });

  it("the writers' notes shift temperament in every run, whatever else varies", () => {
    let careful = 0;
    let plain = 0;
    for (let i = 0; i < 30; i++) {
      const s = { ...seeds, run_seed: `run${i}` };
      careful += personForCharacter(library, s, { ...khoa, traits: ['by_the_book', 'risk_averse'] })
        .origin.temperament.caution;
      plain += personForCharacter(library, s, { ...khoa, traits: [] }).origin.temperament.caution;
    }
    expect(careful / 30).toBeGreaterThan(plain / 30 + 20);
    const loose = personForCharacter(library, seeds, {
      ...khoa,
      traits: ['thinks_rules_are_for_others'],
    });
    const base = personForCharacter(library, seeds, { ...khoa, traits: [] });
    expect(loose.origin.temperament.integrity).toBeLessThan(base.origin.temperament.integrity);
    for (const v of Object.values(loose.origin.temperament)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it('maps departments the library does not know (supplier, audit, ...) and survives unknown ones', () => {
    for (const department of ['supplier', 'audit', 'sales', 'board', 'nonsense']) {
      const p = personForCharacter(library, seeds, {
        ...khoa,
        characterId: `char.${department}`,
        department,
      });
      expect(library.departments.some((d) => d.department === p.life.department)).toBe(true);
    }
  });

  it('the guest port gives the same person for the same character all run', () => {
    const port = createGuestPort({ library, seeds, department: 'qc' });
    expect(port.character(khoa)).toBe(port.character({ ...khoa, turn: 9 }));
  });
});
