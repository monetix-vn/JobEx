/* global process */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  applyEntries,
  compileCondition,
  compileEffect,
  compileScene,
  parseEntries,
} from '../lib/author.mjs';

const repo = join(import.meta.dirname, '..', '..');
const example = readFileSync(join(repo, 'content-src', 'examples', 'qc-example.yml'), 'utf8');
const temps = [];
afterEach(() => {
  while (temps.length > 0) rmSync(temps.pop(), { recursive: true, force: true });
});
const workspace = () => {
  const dir = mkdtempSync(join(tmpdir(), 'je-author-'));
  temps.push(dir);
  cpSync(join(repo, 'content'), join(dir, 'content'), { recursive: true });
  return dir;
};
const validate = (root) =>
  spawnSync(
    process.execPath,
    [
      '--import',
      'tsx',
      join(repo, 'tools', 'pack-validator', 'src', 'cli.ts'),
      join(root, 'content'),
      '--strict',
    ],
    { cwd: repo, encoding: 'utf8' },
  );
const json = (root, path) =>
  JSON.parse(readFileSync(join(root, 'content/industry-cookware', path), 'utf8'));

describe('conditions and effects written as plain lines', () => {
  it('compiles comparisons, aliases, lists and facts', () => {
    expect(compileCondition('stress >= 40')).toEqual({ gte: ['player.stress', 40] });
    expect(compileCondition('rep.boss <= -5')).toEqual({ lte: ['player.rep.boss', -5] });
    expect(compileCondition('month in 3 6 9 12')).toEqual({
      in: ['world.month_of_year', 3, 6, 9, 12],
    });
    expect(compileCondition('fact.came_clean < 2')).toEqual({
      lt: [{ var: ['fact.came_clean', 0] }, 2],
    });
    expect(() => compileCondition('stress is high')).toThrow(/not understood/);
  });

  it('compiles effects', () => {
    expect(compileEffect('rep.boss +5')).toEqual({ delta: 'player.rep.boss', value: 5 });
    expect(compileEffect('cash -800000')).toEqual({ delta: 'player.cash_vnd', value: -800000 });
    expect(compileEffect('fact accepted_kickback private')).toEqual({
      fact: 'fact.accepted_kickback',
      visibility: 'private',
    });
    expect(compileEffect('schedule event.qc.x 4-6')).toEqual({
      schedule: 'event.qc.x',
      delay_weeks: [4, 6],
    });
    expect(() => compileEffect('fact x secret')).toThrow(/private, witnessed/);
  });
});

describe('importing scenes, facts and terms', () => {
  it('turns the example into content that validates with no warnings', () => {
    const root = workspace();
    const report = applyEntries(parseEntries(example), { root });
    expect(report).toEqual(['added scene qc.rush_release', 'added fact signed_untested_coa']);
    const scene = json(root, 'scenes/qc-rush-release.json');
    expect(scene.choices.map((c) => c.id)).toEqual(['c1', 'c2', 'c3']);
    expect(scene.choices[0].outcomes[1].result).toBe('fail');
    expect(
      json(root, 'events/qc-week.json').find((e) => e.id === 'event.qc.rush_release'),
    ).toMatchObject({
      role: 'role.qc.specialist',
      scene: 'scene.qc.rush_release',
      when: { all: [{ gte: ['world.turn', 6] }, { lt: ['player.stress', 90] }] },
    });
    expect(json(root, 'locale/vi.json')['scene.qc.rush_release.c3.ok']).toContain('Xuất đúng hạn');
    expect(json(root, 'locale/en.json')['lesson.signed_untested_coa']).toContain(
      'personal statement',
    );
    const result = validate(root);
    expect(result.stdout).toContain('0 error(s), 0 warning(s)');
    expect(result.status).toBe(0);
  });

  it('importing again updates in place and drops text the entry no longer has', () => {
    const root = workspace();
    applyEntries(parseEntries(example), { root });
    const shorter = example.replace(/ {2}- who: qc_lead[\s\S]*?\nchoices:/, 'choices:');
    const report = applyEntries(parseEntries(shorter), { root });
    expect(report[0]).toBe('updated scene qc.rush_release');
    const events = json(root, 'events/qc-week.json').filter(
      (e) => e.id === 'event.qc.rush_release',
    );
    expect(events).toHaveLength(1);
    expect(json(root, 'locale/en.json')['scene.qc.rush_release.l2']).toBeUndefined();
    expect(validate(root).status).toBe(0);
  });

  it('reports every problem at once and changes nothing', () => {
    const root = workspace();
    const before = readFileSync(join(root, 'content/industry-cookware/locale/vi.json'), 'utf8');
    const broken = `
scene: qc.broken
lines:
  - who: boss
    en: "Hello"
choices:
  - en: "Ok"
    vi: "Được"
    outcomes:
      - p: 0.5
        en: "Fine"
        vi: "Tốt"
        effects: [rep.boss plenty]
`;
    let message = '';
    try {
      applyEntries(parseEntries(broken), { root });
    } catch (error) {
      message = error.message;
    }
    expect(message).toContain('missing Vietnamese text');
    expect(message).toContain('add up to 0.5');
    expect(message).toContain('rep.boss plenty');
    expect(readFileSync(join(root, 'content/industry-cookware/locale/vi.json'), 'utf8')).toBe(
      before,
    );
  });

  it('a mistake the compiler cannot see is caught by the validator', () => {
    const root = workspace();
    applyEntries(parseEntries(example.replace('terms: [coa]', 'terms: [no_such_term]')), { root });
    expect(validate(root).status).toBe(1);
  });

  it('imports a glossary term in both languages', () => {
    const root = workspace();
    const entry = parseEntries(`
term: lot_number
en: { term: Lot number, definition: "The code that identifies one production batch." }
vi: { term: Số lô, definition: "Mã nhận diện một lô sản xuất." }
`);
    expect(applyEntries(entry, { root })).toEqual(['added term lot_number']);
    expect(json(root, 'locale/vi.json')['term.lot_number.term']).toBe('Số lô');
  });

  it('sets the role from the prefix, or from an explicit role', () => {
    const base = parseEntries(example)[0];
    expect(compileScene(base).event.role).toBe('role.qc.specialist');
    expect(compileScene({ ...base, role: 'sales' }).event.role).toBe(
      'role.sales.export.specialist',
    );
    expect(compileScene({ ...base, role: 'any' }).event.role).toBeUndefined();
  });
});

describe('the event library listing', () => {
  it('lists events with their trigger in plain text', () => {
    const result = spawnSync(process.execPath, ['scripts/content-list.mjs', '--role', 'qc'], {
      cwd: repo,
      encoding: 'utf8',
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('event.qc.batch_fail');
    expect(result.stdout).toContain('when: turn >= 8');
    expect(result.stdout).not.toContain('event.sales.');
  });
});
