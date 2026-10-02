import { describe, expect, it } from 'vitest';
import type {
  EventDraft,
  GuestAppearedPayload,
  GuestRequest,
  Person,
  Temperament,
} from '@je/contracts';
import { TEMPERAMENT_AXES } from '@je/contracts';
import { SeededRandom, runFixture } from '@je/kernel';
import {
  behaviourManifest,
  behaviourModule,
  createGuestPort,
  debtPressure,
  generatePerson,
  wantsOf,
} from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const seeds = { world_seed: 'w', run_seed: 'b' };
const flat = Object.fromEntries(TEMPERAMENT_AXES.map((a) => [a, 50])) as Temperament;
const base = generatePerson(
  library,
  { department: 'qc', event_id: 'bh', counter: 1 },
  { seeds, created_turn: 0 },
);
const who = (id: string, t: Partial<Temperament>, debt = 0): Person => ({
  ...base,
  id,
  origin: { ...base.origin, temperament: { ...flat, ...t } },
  life: { ...base.life, income_vnd: 10_000_000, debt_vnd: debt },
});

describe('behaviour: what people want', () => {
  it('someone in debt who bends rules wants a favour; a fragile person who trusts you wants to complain; a cold ambitious one wants credit', () => {
    const needy = wantsOf(who('p.needy', { integrity: 15 }, 150_000_000), 20);
    const fragile = wantsOf(who('p.fragile', { resilience: 10, caution: 70 }), 40);
    const climber = wantsOf(who('p.climber', { ambition: 95, warmth: 15, integrity: 25 }), -30);
    expect(needy.asks_favour).toBeGreaterThan(0.55);
    expect(fragile.complains).toBeGreaterThan(0.55);
    expect(climber.claims_credit).toBeGreaterThan(0.55);
    // and not the other way round
    expect(needy.claims_credit).toBeLessThan(needy.asks_favour);
    expect(fragile.asks_favour).toBeLessThan(0.55);
    expect(debtPressure(who('x', {}, 500_000_000))).toBe(1);
  });

  it('a content, steady, principled person wants nothing', () => {
    const calm = wantsOf(
      who('p.calm', { integrity: 85, resilience: 80, ambition: 20, warmth: 70 }),
      0,
    );
    for (const v of Object.values(calm)) expect(v).toBeLessThan(0.55);
  });
});

const appears = (p: Person) => ({
  type: 'guest.appeared',
  payload: {
    sceneId: 's',
    slot: 'x',
    story_function: 'tempter',
    person: p,
  } satisfies GuestAppearedPayload,
});
const plan = (): { type: string; payload: unknown } => ({
  type: 'turn.phaseStarted',
  payload: { phase: 'plan' },
});
const weeks = (
  n: number,
  from = 0,
  given: { type: string; payload: unknown }[] = [],
): EventDraft[] => {
  const out: EventDraft[] = [];
  for (let t = from; t < from + n; t++)
    out.push(
      ...runFixture(behaviourModule, {
        turn: t,
        seed: 'bh',
        given: [...given, plan()],
        expect: [],
      }),
    );
  return out;
};
const needy = who('person.needy', { integrity: 10, impulsivity: 60 }, 200_000_000);

describe('behaviour: the weekly decision', () => {
  it('declares only what it uses', () => {
    expect(behaviourManifest.consumes).toEqual([
      'guest.appeared',
      'relationship.changed',
      'turn.phaseStarted',
    ]);
    expect(behaviourManifest.emits).toEqual(['director.eventFired']);
  });

  it('brings a scene with the wanting person as its guest, in the same week the world stands in', () => {
    // each fixture call is a fresh module, so give it the person in the same call and sweep the weeks
    const events = weeks(120, 6, [appears(needy)]);
    const fired = events.map((e) => e.payload as { eventId: string; person_id: string });
    expect(fired.length).toBeGreaterThan(5);
    expect(fired.every((f) => f.person_id === 'person.needy')).toBe(true);
    expect(new Set(fired.map((f) => f.eventId))).toContain('event.gen.colleague_favour');
  });

  it('does nothing with nobody known, before week six, or for a person with no wants', () => {
    expect(weeks(60, 6)).toEqual([]);
    expect(weeks(5, 0, [appears(needy)])).toEqual([]);
    const calm = who('person.calm', { integrity: 85, resilience: 80, ambition: 20, warmth: 70 });
    expect(weeks(120, 6, [appears(calm)])).toEqual([]);
  });

  it('keeps the pacing: never two scenes within three weeks, and most weeks nobody acts', () => {
    let turn = 0;
    const instance = behaviourModule.createModule({
      moduleId: 'behaviour',
      rng: new SeededRandom('pacing').stream('behaviour'),
      clock: { now: () => ({ turn }) } as never,
      ports: {} as never,
      config: undefined,
    });
    const env = (type: string, payload: unknown) =>
      ({ id: 'e', type, v: 1, runId: 'r', turn, source: 't', payload }) as never;
    instance.handlers['guest.appeared']!(env('guest.appeared', appears(needy).payload));
    const fired: number[] = [];
    for (turn = 0; turn < 200; turn++) {
      const out = instance.handlers['turn.phaseStarted']!(
        env('turn.phaseStarted', { phase: 'plan' }),
      );
      if (out && out.length > 0) fired.push(turn);
    }
    expect(fired.length).toBeGreaterThan(5);
    expect(fired.length).toBeLessThan(60);
    expect(fired[0]).toBeGreaterThanOrEqual(6);
    for (let k = 1; k < fired.length; k++)
      expect(fired[k]! - fired[k - 1]!).toBeGreaterThanOrEqual(3);
  });

  it('is deterministic', () => {
    expect(weeks(30, 6, [appears(needy)])).toEqual(weeks(30, 6, [appears(needy)]));
  });
});

describe('the guest port honours a request from a person', () => {
  it('returns the person who asked if they have been met, else draws as usual', () => {
    const port = createGuestPort({ library, seeds, department: 'qc' });
    const first = port.appear({ sceneId: 's1', slot: 'a', story_function: 'tempter', turn: 1 });
    for (let i = 2; i < 6; i++)
      port.appear({ sceneId: `s${i}`, slot: 'a', story_function: 'tempter', turn: i });
    const asked: GuestRequest = {
      sceneId: 'sx',
      slot: 'a',
      story_function: 'rival',
      preferred: first.id,
      turn: 9,
    };
    expect(port.appear(asked)).toBe(first);
    expect(port.appear({ ...asked, preferred: 'person.stranger' }).id).not.toBe('person.stranger');
  });
});
