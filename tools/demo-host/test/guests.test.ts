import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, Person } from '@je/contracts';
import type { Run } from '@je/kernel';
import { createGameHost, QC_ROLE, SALES_ROLE, type PeopleSource } from '../src/host';
import { impressionsFromSnapshot, libraryFromFiles } from '../src/world-bridge';

const contentRoot = join(import.meta.dirname, '..', '..', '..', 'content');
function readFiles(): Record<string, string> {
  const files: Record<string, string> = {};
  const walk = (dir: string, prefix: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      if (statSync(full).isDirectory()) walk(full, rel);
      else files[rel] = readFileSync(full, 'utf8');
    }
  };
  walk(contentRoot, '');
  return files;
}
const libraryDir = join(import.meta.dirname, '..', '..', '..', 'library');
const library = libraryFromFiles(
  Object.fromEntries(
    readdirSync(libraryDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => [f, readFileSync(join(libraryDir, f), 'utf8')]),
  ),
);
const people: PeopleSource = { library };

/** Plays a year, always taking the first open choice, and returns the run. */
async function playYear(seed: string, source?: PeopleSource, roleId = QC_ROLE): Promise<Run> {
  const { run } = await createGameHost({
    files: readFiles(),
    seed,
    roleId,
    ...(source ? { people: source } : {}),
  });
  let pending: { sceneId: string; choiceId: string } | undefined;
  run.observe((e) => {
    if (e.type === 'scene.started') {
      const p = e.payload as CoreEventPayloads['scene.started'];
      const open = p.choices.find((c) => !c.disabled);
      pending = open ? { sceneId: p.sceneId, choiceId: open.id } : undefined;
    }
  });
  for (let week = 0; week < 52 && !run.isEnded; week++) {
    run.advanceTurn();
    for (let guard = 0; guard < 6 && pending && !run.isEnded; guard++) {
      const answer = pending;
      pending = undefined;
      run.submit('choice.made', answer);
    }
  }
  return run;
}
const of = (run: Run, type: string) => run.exportLog().entries.filter((e) => e.type === type);

describe('generated people in the game', () => {
  it('guests step into scenes, and the player learns about them over a year', async () => {
    const run = await playYear('guests-1', people);
    const appeared = of(run, 'guest.appeared')
      .map((e) => (e.payload as { person: Person }).person)
      .filter((p) => !p.id.startsWith('char.'));
    expect(appeared.length).toBeGreaterThan(0);
    // colleagues recur, and they come from the player's own department by default
    expect(appeared.every((p) => p.life.department === 'qc')).toBe(true);
    const updates = of(run, 'perception.updated');
    expect(updates.length).toBeGreaterThanOrEqual(appeared.length);

    // the scene text carries the guest's name, never a raw {placeholder}
    const scenes = of(run, 'scene.started').map(
      (e) => e.payload as CoreEventPayloads['scene.started'],
    );
    const guestScenes = scenes.filter((s) =>
      s.people?.some((p) => p.guest && !p.character.startsWith('char.')),
    );
    expect(guestScenes.length).toBe(appeared.length);
    for (const s of guestScenes) {
      expect(JSON.stringify(s)).not.toMatch(/\{(colleague|rival)/);
      const guest = s.people!.find((p) => p.guest && !p.character.startsWith('char.'))!;
      expect(
        s.lines.some(
          (l) => l.speaker === guest.name || l.text.includes(guest.name.split(' ').pop()!),
        ),
      ).toBe(true);
    }

    const impressions = impressionsFromSnapshot(run.snapshot()['perception'], library);
    expect(Object.keys(impressions).length).toBeGreaterThan(0);
    // each guest judges the player: trust moves for the guest's person id, and some of them act on it
    const trust = of(run, 'relationship.changed').filter((e) =>
      String((e.payload as { character: string }).character).startsWith('person.'),
    );
    expect(trust.length).toBeGreaterThan(0);
    // the player is shown no true numbers anywhere in what the client receives
    expect(JSON.stringify(of(run, 'perception.updated'))).not.toContain('temperament');
  });

  it('the fixed characters have a person underneath: the player learns them and they judge the player', async () => {
    const run = await playYear('guests-chars', people);
    const chars = of(run, 'guest.appeared')
      .map((e) => (e.payload as { person: Person }).person)
      .filter((p) => p.id.startsWith('char.'));
    expect(chars.length).toBeGreaterThan(0);
    // a fixed character keeps the same person all run
    expect(new Set(chars.map((p) => JSON.stringify(p))).size).toBe(
      new Set(chars.map((p) => p.id)).size,
    );
    const learned = of(run, 'perception.updated').filter((e) =>
      String((e.payload as { person_id: string }).person_id).startsWith('char.'),
    );
    expect(learned.length).toBeGreaterThan(0);
    // their view of the player moves through the same state as the scripted feelings
    const appraised = of(run, 'sim.deltaApplied').filter((e) =>
      String((e.payload as { reason?: string }).reason ?? '').startsWith('appraisal:'),
    );
    expect(appraised.length).toBeGreaterThan(0);
    // and the cast list shows them as people with impressions, still under their fixed names
    const scenes = of(run, 'scene.started').map(
      (e) => e.payload as CoreEventPayloads['scene.started'],
    );
    expect(
      scenes.some((sc) => sc.people?.some((q) => q.character.startsWith('char.') && q.guest)),
    ).toBe(true);
  });

  it('is deterministic: the same seed meets the same people and learns the same things', async () => {
    const a = await playYear('guests-2', people, SALES_ROLE);
    const b = await playYear('guests-2', people, SALES_ROLE);
    expect(a.exportLog()).toEqual(b.exportLog());
    const c = await playYear('guests-3', people, SALES_ROLE);
    expect(of(c, 'guest.appeared')).not.toEqual(of(a, 'guest.appeared'));
  });

  it('draws guests from the roster of a world when there is one', async () => {
    const roster = (await playYear('guests-1', people))
      .exportLog()
      .entries.filter((e) => e.type === 'guest.appeared')
      .map((e) => (e.payload as { person: Person }).person);
    const run = await playYear('guests-4', { library, worldSeed: 'w', roster });
    const ids = new Set(roster.map((p) => p.id));
    const met = of(run, 'guest.appeared').map((e) => (e.payload as { person: Person }).person.id);
    expect(met.some((id) => ids.has(id))).toBe(true);
  });

  it('without a people source nothing changes: guests are "someone" and nothing is learned', async () => {
    const run = await playYear('guests-1');
    expect(of(run, 'guest.appeared')).toHaveLength(0);
    expect(of(run, 'perception.updated')).toHaveLength(0);
  });
});
