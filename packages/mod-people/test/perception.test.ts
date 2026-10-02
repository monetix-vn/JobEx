import { describe, expect, it } from 'vitest';
import type {
  EventDraft,
  GuestAppearedPayload,
  PerceptionUpdatedPayload,
  Person,
  QuirkNoticedPayload,
  TemperamentAxis,
} from '@je/contracts';
import { TEMPERAMENT_AXES } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { confidenceOf, generatePerson, perceptionManifest, perceptionModule } from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const seeds = { world_seed: 'w', run_seed: 'r' };
const person: Person = generatePerson(
  library,
  { department: 'qc', event_id: 'p', counter: 1 },
  { seeds, created_turn: 0 },
);
const appears = (sceneId: string, p = person, fn = 'tempter') => ({
  type: 'guest.appeared',
  payload: { sceneId, slot: 'x', story_function: fn, person: p } satisfies GuestAppearedPayload,
});
const resolved = (sceneId: string) => ({
  type: 'choice.resolved',
  payload: { sceneId, choiceId: 'c1', outcome: 'ok' },
});
const run = (given: { type: string; payload: unknown }[], seed = 's'): EventDraft[] =>
  runFixture(perceptionModule, { seed, config: { library }, given, expect: [] });
const updates = (out: EventDraft[]) =>
  out
    .filter((e) => e.type === 'perception.updated')
    .map((e) => e.payload as PerceptionUpdatedPayload);
const scenes = (n: number, p = person) =>
  Array.from({ length: n }, (_, i) => [appears(`s${i}`, p), resolved(`s${i}`)]).flat();

describe('perception', () => {
  it('declares only what it uses', () => {
    expect(perceptionManifest.consumes).toEqual(['guest.appeared', 'choice.resolved']);
    expect(perceptionManifest.emits).toEqual(['perception.updated', 'perception.quirkNoticed']);
  });

  it('shows one reading when a guest appears and another when the scene resolves', () => {
    const u = updates(run([appears('s1'), resolved('s1')]));
    expect(u).toHaveLength(2);
    expect(u.every((x) => x.person_id === person.id)).toBe(true);
    // a scene that has resolved is forgotten: resolving it again shows nothing
    expect(updates(run([appears('s1'), resolved('s1'), resolved('s1')]))).toHaveLength(2);
  });

  it('never announces the true numbers, only a noisy estimate with a confidence', () => {
    const out = run(scenes(6));
    for (const x of updates(out)) {
      expect(x.estimate).toBeGreaterThanOrEqual(0);
      expect(x.estimate).toBeLessThanOrEqual(100);
      expect(x.confidence).toBe(confidenceOf(x.observations));
    }
    expect(JSON.stringify(out)).not.toContain('temperament');
  });

  it('grows more sure with every look and settles near the truth', () => {
    const last = new Map<TemperamentAxis, PerceptionUpdatedPayload>();
    for (const x of updates(run(scenes(120)))) last.set(x.axis, x);
    const seen = [...last.values()].filter((x) => x.observations >= 10);
    expect(seen.length).toBeGreaterThan(0);
    for (const x of seen) {
      expect(Math.abs(x.estimate - person.origin.temperament[x.axis])).toBeLessThan(15);
      expect(x.confidence).toBeGreaterThan(60);
    }
    expect(confidenceOf(0)).toBe(0);
    expect(confidenceOf(1)).toBeLessThan(confidenceOf(4));
  });

  it('a stand-out trait gives itself away more often than the rest', () => {
    const flat = Object.fromEntries(TEMPERAMENT_AXES.map((a) => [a, 50]));
    const extreme: Person = {
      ...person,
      origin: {
        ...person.origin,
        temperament: { ...flat, integrity: 98 } as Person['origin']['temperament'],
      },
    };
    const u = updates(run(scenes(40, extreme)));
    expect(u.filter((x) => x.axis === 'integrity').length / u.length).toBeGreaterThan(0.4);
  });

  it('notices each quirk at most once, with its name', () => {
    const quirks = library.quirks.slice(0, 2).map((q) => q.id);
    const withQuirks = { ...person, origin: { ...person.origin, quirks } };
    const noticed = run(scenes(60, withQuirks))
      .filter((e) => e.type === 'perception.quirkNoticed')
      .map((e) => e.payload as QuirkNoticedPayload);
    expect(noticed.map((n) => n.quirk).sort()).toEqual([...quirks].sort());
    expect(noticed.every((n) => n.name?.en && n.name.vi)).toBe(true);
  });

  it('is deterministic for a seed', () => {
    expect(run(scenes(3))).toEqual(run(scenes(3)));
  });
});
