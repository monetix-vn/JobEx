import { describe, expect, it } from 'vitest';
import type {
  EventDraft,
  GuestAppearedPayload,
  Person,
  PersonActedPayload,
  Temperament,
} from '@je/contracts';
import { TEMPERAMENT_AXES } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { appraisalManifest, appraisalModule, appraise, generatePerson } from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const base: Person = generatePerson(
  library,
  { department: 'qc', event_id: 'ap', counter: 1 },
  { seeds: { world_seed: 'w', run_seed: 'r' }, created_turn: 0 },
);
const flat = Object.fromEntries(TEMPERAMENT_AXES.map((a) => [a, 50])) as Temperament;
const who = (t: Partial<Temperament>, values: Person['origin']['values'] = ['craft', 'freedom']) =>
  ({
    ...base,
    origin: { ...base.origin, temperament: { ...flat, ...t }, values },
  }) as Person;

describe('appraisal: how one scene moves a guest', () => {
  it('a principled person rewards the careful way and punishes the shortcut', () => {
    const p = who({ integrity: 90 });
    expect(appraise(p, 'mentor', 1, 1)).toBeGreaterThan(0);
    expect(appraise(p, 'mentor', 3, 1)).toBeLessThan(0);
  });

  it('a tempter who gains from the shortcut likes it more if they do not mind bending rules', () => {
    const loose = who({ integrity: 15 });
    const strict = who({ integrity: 90 });
    expect(appraise(loose, 'tempter', 3, 1)).toBeGreaterThan(0);
    expect(appraise(strict, 'tempter', 3, 1)).toBeLessThan(appraise(loose, 'tempter', 3, 1));
  });

  it('cares more about fairness when it is one of their values, and is softened by warmth', () => {
    const plain = who({ integrity: 80 }, ['craft', 'freedom']);
    const fair = who({ integrity: 80 }, ['fairness', 'freedom']);
    expect(appraise(fair, 'mentor', 3, 1)).toBeLessThan(appraise(plain, 'mentor', 3, 1));
    expect(appraise(who({ integrity: 80, warmth: 95 }), 'mentor', 3, 1)).toBeGreaterThan(
      appraise(who({ integrity: 80, warmth: 5 }), 'mentor', 3, 1),
    );
  });

  it('the first impression counts most; someone who knows you has a settled view', () => {
    const p = who({ integrity: 90 });
    expect(Math.abs(appraise(p, 'mentor', 3, 1))).toBeGreaterThan(
      Math.abs(appraise(p, 'mentor', 3, 6)),
    );
  });
});

const appears = (sceneId: string, p: Person, fn = 'tempter') => ({
  type: 'guest.appeared',
  payload: { sceneId, slot: 'x', story_function: fn, person: p } satisfies GuestAppearedPayload,
});
const resolved = (sceneId: string, choiceId: string, effects: unknown[] = []) => ({
  type: 'choice.resolved',
  payload: { sceneId, choiceId, outcome: 'ok', effects },
});
const run = (given: { type: string; payload: unknown }[], seed = 's'): EventDraft[] =>
  runFixture(appraisalModule, { seed, given, expect: [] });
const acted = (out: EventDraft[]) =>
  out.filter((e) => e.type === 'person.acted').map((e) => e.payload as PersonActedPayload);
const deed = [{ fact: 'fact.bent', visibility: 'private' }];

describe('appraisal: what a guest does about it', () => {
  it('declares only what it uses', () => {
    expect(appraisalManifest.consumes).toEqual(['guest.appeared', 'choice.resolved']);
    expect(appraisalManifest.emits).toEqual([
      'relationship.changed',
      'knowledge.escalate',
      'sim.applyDelta',
      'person.acted',
    ]);
  });

  it('announces how trust changed, for the person, and nothing for an ignored scene', () => {
    const p = who({ integrity: 90 });
    const out = run([appears('s1', p), resolved('s1', 'c1')]);
    const rel = out.find((e) => e.type === 'relationship.changed')!.payload as {
      character: string;
      dimension: string;
      from: number;
      to: number;
    };
    expect(rel).toMatchObject({ character: p.id, dimension: 'trust', from: 0 });
    expect(rel.to).toBeGreaterThan(0);
    const ignored = run([
      appears('s1', p),
      { type: 'choice.resolved', payload: { sceneId: 's1', choiceId: '', outcome: 'ignored' } },
    ]);
    expect(ignored).toEqual([]);
  });

  it('a high-integrity witness may tell others about a shortcut, which makes the deed a rumour', () => {
    const p = who({ integrity: 95 });
    let reported = 0;
    for (let i = 0; i < 40; i++) {
      const out = run([appears('s1', p), resolved('s1', 'c3', deed)], `seed${i}`);
      if (acted(out).some((a) => a.action === 'reported')) {
        reported++;
        const esc = out.find((e) => e.type === 'knowledge.escalate')!.payload;
        expect(esc).toMatchObject({ factId: 'fact.bent', to: 'rumor' });
        expect(acted(out)[0]!.visible).toBe(false);
      }
    }
    expect(reported).toBeGreaterThan(5);
    expect(reported).toBeLessThan(40);
  });

  it('a person who does not mind bending rules and likes you keeps it to themselves', () => {
    // first scene earns trust (a favour done by the tempter's wish), then a deed is witnessed
    const p = who({ integrity: 20, warmth: 70 });
    const out = run([
      appears('s1', p),
      resolved('s1', 'c3', deed),
      appears('s2', p),
      resolved('s2', 'c3', deed),
    ]);
    expect(acted(out).some((a) => a.action === 'covers')).toBe(true);
    expect(out.some((e) => e.type === 'knowledge.escalate')).toBe(false);
  });

  it('a person you have crossed who is rough or impulsive runs you down', () => {
    const p = who({ integrity: 85, impulsivity: 80, warmth: 20 });
    const out = run(
      Array.from({ length: 6 }, (_, i) => [
        appears(`s${i}`, p, 'mentor'),
        resolved(`s${i}`, 'c3'),
      ]).flat(),
    );
    const bad = acted(out).filter((a) => a.action === 'badmouths');
    expect(bad.length).toBeGreaterThan(0);
    expect(bad.every((a) => a.visible)).toBe(true);
    expect(
      out.some(
        (e) =>
          e.type === 'sim.applyDelta' &&
          (e.payload as { path: string; value: number }).path === 'player.rep.staff' &&
          (e.payload as { value: number }).value < 0,
      ),
    ).toBe(true);
  });

  it('a warm person you have helped vouches for you', () => {
    const p = who({ integrity: 85, warmth: 85 });
    const out = run(
      Array.from({ length: 6 }, (_, i) => [
        appears(`s${i}`, p, 'mentor'),
        resolved(`s${i}`, 'c1'),
      ]).flat(),
    );
    expect(acted(out).some((a) => a.action === 'vouches')).toBe(true);
  });

  it('is deterministic for a seed', () => {
    const given = [appears('s1', who({ integrity: 95 })), resolved('s1', 'c3', deed)];
    expect(run(given)).toEqual(run(given));
  });
});
