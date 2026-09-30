import { describe, expect, it } from 'vitest';
import type { Character, ContentView, EventDraft, Fact } from '@je/contracts';
import { runFixture } from '@je/kernel';
import { manifest, relationshipsModule, type RelationshipsConfig } from '../src';

const khoa: Character = {
  id: 'char.khoa',
  name_key: 'n',
  title_key: 't',
  department: 'qc',
  home_group: 'boss',
  start: { trust: 10, loyalty: 5 },
};
const lan: Character = {
  id: 'char.lan',
  name_key: 'n',
  title_key: 't',
  department: 'production',
  home_group: 'production',
};
const fact: Fact = {
  id: 'fact.bent',
  category: 'integrity',
  severity: 3,
  text_key: 't',
  consequences: { witnessed: { boss: -6, production: -3 }, public: { boss: -10 } },
};
const people = [khoa, lan];
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'fact' && id === fact.id ? fact : undefined) as never,
  all: ((kind: string) => (kind === 'character' ? people : [])) as never,
  text: () => undefined,
};

const tick = (turn: number) => ({
  type: 'clock.ticked',
  payload: { turn, year: 0, week_of_year: turn, month_of_year: 1, quarter: 1 },
});
const run = (given: { type: string; payload: unknown }[], cfg: Partial<RelationshipsConfig> = {}) =>
  runFixture(relationshipsModule, { seed: 'rel', config: { content, ...cfg }, given, expect: [] });
const deltas = (out: EventDraft[]) =>
  out
    .filter((e) => e.type === 'sim.applyDelta')
    .map((e) => e.payload as { path: string; value: number; mode?: string; reason: string });
const applied = (path: string, from: number, to: number, reason?: string) => ({
  type: 'sim.deltaApplied',
  payload: { path, from, to, ...(reason ? { reason } : {}) },
});

describe('relationships', () => {
  it('declares itself between knowledge and social-adjacent modules', () => {
    expect(manifest).toMatchObject({ id: 'relationships', priority: 32 });
  });

  it('seeds only the starting values that are not zero, in a stable order', () => {
    const out = run([{ type: 'run.started', payload: {} }]);
    expect(deltas(out)).toEqual([
      { path: 'rel.khoa.trust', value: 10, mode: 'set', reason: 'start' },
      { path: 'rel.khoa.loyalty', value: 5, mode: 'set', reason: 'start' },
    ]);
  });

  it('announces a change to a person, and ignores unrelated variables', () => {
    const out = run([
      applied('rel.lan.trust', 0, 8, 'scene'),
      applied('player.stress', 25, 30),
      applied('rel.lan.owed', 0, 1),
    ]);
    expect(out.map((e) => e.payload)).toEqual([
      { character: 'char.lan', dimension: 'trust', from: 0, to: 8, reason: 'scene' },
      { character: 'char.lan', dimension: 'owed', from: 0, to: 1 },
    ]);
  });

  it('what a person’s group learns becomes trust, once per level', () => {
    const learned = {
      type: 'fact.learned',
      payload: { factId: 'fact.bent', visibility: 'witnessed', knownBy: ['player'] },
    };
    const first = deltas(run([learned]));
    expect(first).toEqual([
      { path: 'rel.khoa.trust', value: -3, reason: 'fact:fact.bent:witnessed' },
      { path: 'rel.lan.trust', value: -2, reason: 'fact:fact.bent:witnessed' },
    ]);
    const again = deltas(
      run([
        learned,
        {
          type: 'fact.escalated',
          payload: { factId: 'fact.bent', from: 'private', to: 'witnessed', knownBy: [] },
        },
        {
          type: 'fact.escalated',
          payload: { factId: 'fact.bent', from: 'witnessed', to: 'public', knownBy: [] },
        },
      ]),
    );
    expect(again.map((d) => [d.path, d.value])).toEqual([
      ['rel.khoa.trust', -3],
      ['rel.lan.trust', -2],
      ['rel.khoa.trust', -5],
    ]);
  });

  it('trust and loyalty drift back towards the start every few weeks, never past it', () => {
    const moved = [applied('rel.khoa.trust', 10, 20), applied('rel.lan.trust', 0, -3)];
    expect(deltas(run([...moved, tick(3)]))).toEqual([]);
    expect(deltas(run([...moved, tick(4)]))).toEqual([
      { path: 'rel.khoa.trust', value: -1, reason: 'drift' },
      { path: 'rel.lan.trust', value: 1, reason: 'drift' },
    ]);
    expect(deltas(run([applied('rel.khoa.trust', 10, 10), tick(4)]))).toEqual([]);
    expect(deltas(run([...moved, tick(4)], { driftEveryWeeks: 0 }))).toEqual([]);
  });

  it('refuses to start without content', () => {
    expect(() => runFixture(relationshipsModule, { seed: 's', given: [], expect: [] })).toThrow(
      /needs config.content/,
    );
  });
});
