import { describe, expect, it } from 'vitest';
import type { Person, PersonCreatedPayload, PersonRequest } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { manifest, peopleModule } from '../src';
import { loadLibrary } from './library';

const library = loadLibrary();
const seeds = { world_seed: 'w', run_seed: 'r' };
const ask = (department: string, counter: number): { type: string; payload: PersonRequest } => ({
  type: 'person.requested',
  payload: { department, event_id: 'hire', counter },
});
const run = (given: ReturnType<typeof ask>[], runSeed = 'r'): Person[] =>
  runFixture(peopleModule, {
    seed: 'module-fixture',
    config: { library, seeds: { ...seeds, run_seed: runSeed } },
    given,
    expect: [],
  }).map((e) => (e.payload as PersonCreatedPayload).person);

describe('mod-people as a module', () => {
  it('declares only what it uses', () => {
    expect(manifest.consumes).toEqual(['person.requested']);
    expect(manifest.emits).toEqual(['person.created']);
  });

  it('answers each request with one created person, in order', () => {
    const people = run([ask('hr', 0), ask('it', 1), ask('hr', 2)]);
    expect(people.map((p) => p.life.department)).toEqual(['hr', 'it', 'hr']);
    expect(new Set(people.map((p) => p.id)).size).toBe(3);
  });

  it('is deterministic, and a new run seed in the same world gives different people', () => {
    expect(run([ask('hr', 0), ask('hr', 1)])).toEqual(run([ask('hr', 0), ask('hr', 1)]));
    expect(run([ask('hr', 0)], 'r2')).not.toEqual(run([ask('hr', 0)]));
  });

  it('refuses to start without a library and seeds', () => {
    expect(() =>
      runFixture(peopleModule, { seed: 's', config: {}, given: [ask('hr', 0)], expect: [] }),
    ).toThrow(/needs config/);
  });
});
