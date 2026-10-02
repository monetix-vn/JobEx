import { describe, expect, it } from 'vitest';
import { PERSONAS, PERSONA_IDS } from '@je/contracts';
import type { PlayerProfile } from '@je/contracts';
import { profileEffects } from '../src';

const base: PlayerProfile = {
  name: 'Lan',
  age: 30,
  gender: 'female',
  education: 'college',
  experience: 'some',
  money: 'comfortable',
  dependents: 'none',
  hiring_path: 'applied_cold',
};

describe('what a player profile changes', () => {
  it('changes nothing about ability or standing for a comfortable, ordinary start', () => {
    const e = profileEffects(base);
    expect(e.skill_all).toBe(0);
    expect(e.add['player.stress']).toBe(0);
    expect(e.add['player.rep.boss']).toBe(0);
    expect(e.set['profile.money_pressure']).toBe(15);
    expect(e.set['player.name']).toBe('Lan');
  });

  it('never depends on gender (the fairness rule)', () => {
    for (const gender of ['female', 'male', 'non_binary'] as const) {
      expect(profileEffects({ ...base, gender })).toEqual(profileEffects(base));
    }
  });

  it('money and people at home raise stress and money pressure, together', () => {
    const squeezed = profileEffects({ ...base, money: 'in_debt', dependents: 'children' });
    expect(squeezed.add['player.stress']).toBe(8);
    expect(squeezed.set['profile.money_pressure']).toBe(75);
    expect(squeezed.set['profile.in_debt']).toBe(1);
    expect(squeezed.set['profile.dependents']).toBe(2);
    const easy = profileEffects(base);
    expect(squeezed.set['profile.money_pressure']).toBeGreaterThan(
      easy.set['profile.money_pressure'] as number,
    );
  });

  it('education and experience move job skills a little; age and experience move backbone', () => {
    const fresh = profileEffects({ ...base, age: 23, education: 'university', experience: 'none' });
    const veteran = profileEffects({
      ...base,
      age: 50,
      education: 'college',
      experience: 'veteran',
    });
    expect(fresh.skill_all).toBe(-3);
    expect(veteran.skill_all).toBe(8);
    expect(veteran.add['skill.backbone']).toBeGreaterThan(fresh.add['skill.backbone'] as number);
  });

  it("an owner's relative starts trusted by the boss and a little distrusted by colleagues", () => {
    const e = profileEffects({ ...base, hiring_path: 'owner_relative' });
    expect(e.add['player.rep.boss']).toBe(6);
    expect(e.add['player.rep.staff']).toBe(-4);
  });

  it('has four personas that all produce sensible, different starts', () => {
    expect(PERSONA_IDS).toHaveLength(4);
    const pressures = PERSONA_IDS.map(
      (id) =>
        profileEffects({ name: 'x', ...PERSONAS[id] }).set['profile.money_pressure'] as number,
    );
    expect(new Set(pressures).size).toBeGreaterThanOrEqual(3);
    for (const p of pressures) expect(p).toBeGreaterThanOrEqual(0);
    for (const p of pressures) expect(p).toBeLessThanOrEqual(100);
  });

  it('trims and limits the name, and falls back to "You"', () => {
    expect(profileEffects({ ...base, name: '   ' }).set['player.name']).toBe('You');
    expect(
      String(profileEffects({ ...base, name: 'x'.repeat(100) }).set['player.name']),
    ).toHaveLength(40);
  });
});
