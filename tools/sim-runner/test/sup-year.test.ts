import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, ReplayLog } from '@je/contracts';
import { replay } from '@je/kernel';
import { checkDeterminism, loadScenario } from '../src';
import { contentDir, of, play, state } from './helpers';
import { expectPin } from './pins';

const endingOf = (log: ReplayLog): string =>
  ((of(log, 'run.ended')[0]!.payload as { ending?: string }).ending ?? 'completed') as string;
const fired = (log: ReplayLog) =>
  of(log, 'director.eventFired').map((e) => ({
    id: (e.payload as { eventId: string }).eventId,
    week: e.turn + 1,
  }));
const advanced = (log: ReplayLog, arc: string) =>
  of(log, 'arc.advanced')
    .map((e) => e.payload as { arc: string; stage: string })
    .filter((p) => p.arc === arc)
    .map((p) => p.stage);
const debriefOf = (log: ReplayLog) =>
  of(log, 'debrief.ready').map((e) => e.payload as CoreEventPayloads['debrief.ready']);
const finished = ['completed', 'promoted'];

describe('Production Line Supervisor: job eight, same engine, same engine', () => {
  it('starts as the line supervisor with the job’s own tasks and skills', async () => {
    const { log } = await play('sup-year', 'sup-0', 'en', undefined, { policy: 'first' });
    const s = state(log);
    expect(s['player.role']).toBe('role.prod.supervisor');
    expect(s['skill.leadership']).toBe(40);
    const plans = of(log, 'workload.weekPlanned').map(
      (e) => e.payload as CoreEventPayloads['workload.weekPlanned'],
    );
    expect(plans[0]!.tasks.map((t) => t.task)).toEqual([
      'task.shift_handover',
      'task.line_supervision',
      'task.attendance_and_roster',
    ]);
  });

  it('meets only line supervisor events and the ones meant for everybody', async () => {
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      const { log } = await play('sup-year', `sup-iso-${i}`, 'en', undefined, {
        policy: 'first',
      });
      for (const f of fired(log)) seen.add(f.id);
    }
    expect([...seen].some((id) => /^event\.(qc|sales|fin|prod|purch|hr)\./.test(id))).toBe(false);
    expect([...seen].filter((id) => id.startsWith('event.sup.')).length).toBeGreaterThan(12);
  });

  it('plays a full year in either language, with no rejected choices', async () => {
    for (const locale of ['en', 'vi'] as const) {
      const { log } = await play('sup-year', 'sup-year-1', locale, undefined, {
        policy: 'first',
      });
      expect(log.turns).toBeGreaterThanOrEqual(51);
      expect(of(log, 'choice.rejected')).toHaveLength(0);
      expect(of(log, 'sim.deltaRejected')).toHaveLength(0);
    }
  });

  it('a careful player finishes or is promoted, under real pressure (first-cut balance guard)', async () => {
    const finals: number[] = [];
    for (let i = 0; i < 12; i++) {
      const { log } = await play('sup-year', `sup-bal-${i}`, 'en', undefined, {
        policy: 'first',
      });
      expect(finished).toContain(endingOf(log));
      finals.push(state(log)['player.stress'] as number);
      const decisions = of(log, 'choice.resolved').length;
      expect(decisions).toBeGreaterThan(25);
      expect(decisions).toBeLessThan(90);
    }
    const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
    expect(mean).toBeGreaterThan(15);
    expect(mean).toBeLessThan(85);
  });

  it('a reckless player is caught before the year ends (first-cut balance guard)', async () => {
    let early = 0;
    const weeks: number[] = [];
    for (let i = 0; i < 20; i++) {
      const { log } = await play('sup-year', `sup-rk-${i}`, 'en', undefined, {
        policy: 'last',
      });
      if (!finished.includes(endingOf(log))) {
        early += 1;
        weeks.push(log.turns);
      }
      expect(debriefOf(log)).toHaveLength(1);
    }
    weeks.sort((a, b) => a - b);
    expect(early).toBeGreaterThanOrEqual(18);
    expect(weeks[Math.floor(weeks.length / 2)]).toBeGreaterThan(8);
  });

  it('the season has its beats, once each, inside their windows', async () => {
    const windows: Record<string, [number, number]> = {
      'event.sup.first_week': [1, 3],
      'event.sup.midyear_review': [24, 28],
      'event.sup.rush_order_twist': [29, 32],
      'event.sup.safety_inspection': [41, 44],
      'event.sup.year_end_review': [49, 50],
    };
    for (let i = 0; i < 6; i++) {
      const { log } = await play('sup-year', `sup-beat-${i}`, 'en', undefined, {
        policy: 'first',
      });
      const all = fired(log);
      for (const [id, [from, to]] of Object.entries(windows)) {
        const plays = all.filter((f) => f.id === id);
        expect(plays, `${id} in run ${i}`).toHaveLength(1);
        expect(plays[0]!.week).toBeGreaterThanOrEqual(from);
        expect(plays[0]!.week).toBeLessThanOrEqual(to);
      }
    }
  });

  it('The Hand storyline starts for careful and reckless players alike', async () => {
    let careful = 0;
    let reckless = 0;
    for (let i = 0; i < 30; i++) {
      const c = (await play('sup-year', `sup-pr-${i}`, 'en', undefined, { policy: 'first' })).log;
      if (advanced(c, 'arc.the_hand').length > 0) careful += 1;
      const r = (await play('sup-year', `sup-pr-${i}`, 'en', undefined, { policy: 'last' })).log;
      if (advanced(r, 'arc.the_hand').length > 0) reckless += 1;
    }
    expect(careful).toBeGreaterThan(5);
    expect(reckless).toBeGreaterThan(5);
  });

  it('consequence scenes come only to those who earned them', async () => {
    const needs: Record<string, string[]> = {
      'event.sup.sang_asks_injury': [
        'fact.hid_injury',
        'fact.blamed_injured_worker',
        'fact.ran_above_rated_speed',
      ],
      'event.sup.blame_meeting': [
        'fact.inflated_output_count',
        'fact.forced_early_return',
        'fact.signed_false_training',
        'fact.ran_machine_past_fault',
      ],
    };
    for (let i = 0; i < 40; i++) {
      const { log } = await play('sup-year', `sup-cons-${i}`);
      const rank: Record<string, number> = {};
      for (const e of log.entries) {
        if (e.type === 'sim.deltaApplied') {
          const p = e.payload as { path: string; to: number };
          if (p.path.startsWith('fact.')) rank[p.path] = p.to;
        }
        if (e.type === 'director.eventFired') {
          const facts = needs[(e.payload as { eventId: string }).eventId];
          if (facts) {
            expect(
              facts.some((f) => (rank[f] ?? 0) >= 1),
              `run ${i}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it('is deterministic and replays identically, like every other scenario', async () => {
    const scenario = await loadScenario('sup-year', { contentDir });
    for (const seed of ['p1', 'p2']) {
      const report = checkDeterminism({
        seed,
        turns: scenario.turns,
        modules: scenario.modules,
        configs: scenario.configs,
        bot: scenario.bot,
      });
      expect(report.problems, seed).toEqual([]);
    }
    const a = await play('sup-year', 'replayme', 'en', undefined, { policy: 'last' });
    expect(replay(a.log, a.scenario.modules, { configs: a.scenario.configs }).ok).toBe(true);
    expectPin(
      'sup-year.2026',
      checkDeterminism({
        seed: '2026',
        turns: scenario.turns,
        modules: scenario.modules,
        configs: scenario.configs,
        bot: scenario.bot,
      }).fingerprint,
    );
  });
});
