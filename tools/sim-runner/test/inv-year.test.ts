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

describe('Investment Banking Analyst: the sixth job, in another company, same engine', () => {
  it('starts as the planner with the job’s own tasks and skills', async () => {
    const { log } = await play('inv-year', 'inv-0', 'en', undefined, { policy: 'first' });
    const s = state(log);
    expect(s['player.role']).toBe('role.inv.analyst');
    expect(s['skill.modelling']).toBe(45);
    const plans = of(log, 'workload.weekPlanned').map(
      (e) => e.payload as CoreEventPayloads['workload.weekPlanned'],
    );
    expect(plans[0]!.tasks.map((t) => t.task)).toEqual([
      'task.build_models',
      'task.pitch_decks',
      'task.client_requests',
    ]);
  });

  it('meets only investment-banking events (and none of the cookware ones)', async () => {
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      const { log } = await play('inv-year', `inv-iso-${i}`, 'en', undefined, {
        policy: 'first',
      });
      for (const f of fired(log)) seen.add(f.id);
    }
    expect(
      [...seen].some((id) =>
        /^event\.(qc|sales|fin|prod|purch|buyer_audit_notice|audit_day)/.test(id),
      ),
    ).toBe(false);
    expect([...seen].filter((id) => id.startsWith('event.inv.')).length).toBeGreaterThan(12);
  });

  it('plays a full year in either language, with no rejected choices', async () => {
    for (const locale of ['en', 'vi'] as const) {
      const { log } = await play('inv-year', 'inv-year-1', locale, undefined, {
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
      const { log } = await play('inv-year', `inv-bal-${i}`, 'en', undefined, {
        policy: 'first',
      });
      expect(finished).toContain(endingOf(log));
      finals.push(state(log)['player.stress'] as number);
      const decisions = of(log, 'choice.resolved').length;
      expect(decisions).toBeGreaterThan(25);
      expect(decisions).toBeLessThan(90);
    }
    const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
    expect(mean).toBeGreaterThan(25);
    expect(mean).toBeLessThan(85);
  });

  it('a reckless player is caught before the year ends (first-cut balance guard)', async () => {
    let early = 0;
    const weeks: number[] = [];
    for (let i = 0; i < 20; i++) {
      const { log } = await play('inv-year', `inv-rk-${i}`, 'en', undefined, {
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
      'event.inv.first_week': [1, 3],
      'event.inv.midyear_review': [24, 28],
      'event.inv.market_twist': [29, 32],
      'event.inv.compliance_review': [41, 44],
      'event.inv.bonus_review': [49, 50],
    };
    for (let i = 0; i < 6; i++) {
      const { log } = await play('inv-year', `inv-beat-${i}`, 'en', undefined, {
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

  it('The Tip escalates for the shortcut-taker and ends at once for the careful', async () => {
    let escalated = 0;
    let closed = 0;
    for (let i = 0; i < 30; i++) {
      const reckless = (await play('inv-year', `inv-pr-${i}`, 'en', undefined, { policy: 'last' }))
        .log;
      const s = advanced(reckless, 'arc.the_tip');
      if (s.length > 0) {
        escalated += 1;
        expect(s[0]).toBe('trade');
      }
      const careful = (await play('inv-year', `inv-pr-${i}`, 'en', undefined, { policy: 'first' }))
        .log;
      const ended = of(careful, 'arc.ended')
        .map((e) => e.payload as { arc: string; reason: string })
        .filter((p) => p.arc === 'arc.the_tip');
      // The careful choice usually closes the story at once; one time in five it goes badly anyway.
      if (ended.length > 0 && advanced(careful, 'arc.the_tip').length === 0) closed += 1;
    }
    expect(escalated).toBeGreaterThan(5);
    expect(closed).toBeGreaterThan(5);
  });

  it('consequence scenes come only to those who earned them', async () => {
    const needs: Record<string, string> = {
      'event.prod.sang_asks_records': 'fact.bypassed_guard',
      'event.prod.scapegoat_meeting': 'fact.blamed_operator',
    };
    for (let i = 0; i < 40; i++) {
      const { log } = await play('inv-year', `inv-cons-${i}`);
      const rank: Record<string, number> = {};
      for (const e of log.entries) {
        if (e.type === 'sim.deltaApplied') {
          const p = e.payload as { path: string; to: number };
          if (p.path.startsWith('fact.')) rank[p.path] = p.to;
        }
        if (e.type === 'director.eventFired') {
          const fact = needs[(e.payload as { eventId: string }).eventId];
          if (fact) expect(rank[fact] ?? 0, `run ${i}`).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it('is deterministic and replays identically, like every other scenario', async () => {
    const scenario = await loadScenario('inv-year', { contentDir });
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
    const a = await play('inv-year', 'replayme', 'en', undefined, { policy: 'last' });
    expect(replay(a.log, a.scenario.modules, { configs: a.scenario.configs }).ok).toBe(true);
    expectPin(
      'inv-year.2026',
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
