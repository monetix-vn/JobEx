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
const debriefOf = (log: ReplayLog) =>
  of(log, 'debrief.ready').map((e) => e.payload as CoreEventPayloads['debrief.ready']);
const closes = (log: ReplayLog) =>
  of(log, 'close.completed').map((e) => e.payload as CoreEventPayloads['close.completed']);

describe('Finance and Accounting: the third job, same engine', () => {
  it('starts as the accountant with the job’s own tasks, skills and close steps', async () => {
    const { log } = await play('fin-year', 'fin-0', 'en', undefined, { policy: 'first' });
    const s = state(log);
    expect(s['player.role']).toBe('role.fin.accountant');
    expect(s['skill.accounting']).toBe(40);
    expect(s['player.salary_vnd']).toBe(14000000);
    const plans = of(log, 'workload.weekPlanned').map(
      (e) => e.payload as CoreEventPayloads['workload.weekPlanned'],
    );
    expect(plans[0]!.tasks.map((t) => t.task)).toEqual([
      'task.ar_followup',
      'task.invoice_check',
      'task.month_end_close',
    ]);
    expect(Object.keys(s).filter((k) => k.startsWith('close.') && k !== 'close.open')).toHaveLength(
      4,
    );
  });

  it('meets only finance events and the ones meant for everybody', async () => {
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      for (const f of fired(
        (await play('fin-year', `fin-iso-${i}`, 'en', undefined, { policy: 'first' })).log,
      ))
        seen.add(f.id);
    }
    expect(
      [...seen].some((id) => id.startsWith('event.qc.') || id.startsWith('event.sales.')),
    ).toBe(false);
    expect([...seen].filter((id) => id.startsWith('event.fin.')).length).toBeGreaterThan(20);
  });

  it('plays a full year in either language, with no rejected choices', async () => {
    for (const locale of ['en', 'vi'] as const) {
      const { log } = await play('fin-year', 'fin-year-1', locale, undefined, { policy: 'first' });
      expect(log.turns).toBeGreaterThanOrEqual(51);
      expect(of(log, 'choice.rejected')).toHaveLength(0);
      expect(of(log, 'sim.deltaRejected')).toHaveLength(0);
    }
  });

  it('a careful player closes the books well every month and feels real pressure (first-cut balance guard)', async () => {
    const finals: number[] = [];
    let promoted = 0;
    for (let i = 0; i < 12; i++) {
      const { log } = await play('fin-year', `fin-bal-${i}`, 'en', undefined, { policy: 'first' });
      expect(['completed', 'promoted']).toContain(endingOf(log));
      if (endingOf(log) === 'promoted') promoted += 1;
      finals.push(state(log)['player.stress'] as number);
      const months = closes(log);
      expect(months.length).toBeGreaterThanOrEqual(11);
      const mean = months.reduce((a, c) => a + c.score, 0) / months.length;
      expect(mean).toBeGreaterThan(0.65);
      const decisions = of(log, 'choice.resolved').length;
      expect(decisions).toBeGreaterThan(50);
      expect(decisions).toBeLessThan(95);
    }
    const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
    expect(mean).toBeGreaterThan(25);
    expect(mean).toBeLessThan(85);
    expect(promoted).toBeGreaterThanOrEqual(8);
  });

  it('a reckless player is caught before the year ends (first-cut balance guard)', async () => {
    let early = 0;
    const weeks: number[] = [];
    for (let i = 0; i < 20; i++) {
      const { log } = await play('fin-year', `fin-rk-${i}`, 'en', undefined, { policy: 'last' });
      if (!['completed', 'promoted'].includes(endingOf(log))) {
        early += 1;
        weeks.push(log.turns);
      }
      expect(debriefOf(log)).toHaveLength(1);
    }
    weeks.sort((a, b) => a - b);
    expect(early).toBeGreaterThanOrEqual(18);
    expect(weeks[Math.floor(weeks.length / 2)]).toBeGreaterThan(8);
  });

  it('the season has its beats: each plays once, inside its window', async () => {
    const windows: Record<string, [number, number]> = {
      'event.fin.first_close': [1, 3],
      'event.fin.vy_interim': [14, 17],
      'event.fin.midyear_review': [24, 28],
      'event.fin.buyer_disputes_invoice': [29, 32],
      'event.fin.vy_fieldwork': [41, 44],
      'event.fin.year_end_review': [49, 50],
    };
    for (let i = 0; i < 6; i++) {
      const { log } = await play('fin-year', `fin-beat-${i}`, 'en', undefined, { policy: 'first' });
      const all = fired(log);
      for (const [id, [from, to]] of Object.entries(windows)) {
        const plays = all.filter((f) => f.id === id);
        expect(plays, `${id} in run ${i}`).toHaveLength(1);
        expect(plays[0]!.week).toBeGreaterThanOrEqual(from);
        expect(plays[0]!.week).toBeLessThanOrEqual(to);
      }
    }
  });

  it('close steps appear in the last weeks of a month and never outside them', async () => {
    const { log } = await play('fin-year', 'fin-window', 'en', undefined, { policy: 'first' });
    const steps = fired(log).filter((f) => f.id.startsWith('event.fin.close_'));
    expect(steps.length).toBeGreaterThan(36);
    const perMonth = new Map<number, number>();
    for (const s of steps) {
      const month = 1 + Math.floor(((s.week - 1) * 12) / 52);
      perMonth.set(month, (perMonth.get(month) ?? 0) + 1);
    }
    for (const count of perMonth.values()) expect(count).toBeLessThanOrEqual(6);
    expect(perMonth.size).toBeGreaterThanOrEqual(10);
  });

  it('The Cut-off escalates for the shortcut-taker and ends at once for the careful', async () => {
    const stages = (log: ReplayLog) =>
      of(log, 'arc.advanced')
        .map((e) => e.payload as { arc: string; stage: string })
        .filter((p) => p.arc === 'arc.the_cutoff')
        .map((p) => p.stage);
    let escalated = 0;
    let closed = 0;
    for (let i = 0; i < 30; i++) {
      const reckless = (await play('fin-year', `fin-cut-${i}`, 'en', undefined, { policy: 'last' }))
        .log;
      const s = stages(reckless);
      if (s.length > 0) {
        escalated += 1;
        expect(s[0]).toBe('followup');
      }
      const careful = (await play('fin-year', `fin-cut-${i}`, 'en', undefined, { policy: 'first' }))
        .log;
      const ended = of(careful, 'arc.ended')
        .map((e) => e.payload as { arc: string; reason: string })
        .filter((p) => p.arc === 'arc.the_cutoff');
      if (ended.length > 0) {
        closed += 1;
        expect(ended[0]!.reason).toBe('end');
        expect(stages(careful)).toEqual([]);
      }
    }
    expect(escalated).toBeGreaterThan(5);
    expect(closed).toBeGreaterThan(5);
  });

  it('consequence scenes come only to those who earned them', async () => {
    const needs: Record<string, string> = {
      'event.fin.vy_asks_receipts': 'fact.booked_personal_expense',
      'event.fin.management_letter': 'fact.backdated_invoice_entry',
      'event.fin.scapegoat_meeting': 'fact.released_reserve_to_hit_target',
    };
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const { log } = await play('fin-year', `fin-cons-${i}`);
      const rank: Record<string, number> = {};
      for (const e of log.entries) {
        if (e.type === 'sim.deltaApplied') {
          const p = e.payload as { path: string; to: number };
          if (p.path.startsWith('fact.')) rank[p.path] = p.to;
        }
        if (e.type === 'director.eventFired') {
          const id = (e.payload as { eventId: string }).eventId;
          const fact = needs[id];
          if (!fact) continue;
          seen.add(id);
          expect(rank[fact] ?? 0, `${id} in run ${i}`).toBeGreaterThanOrEqual(1);
        }
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(1);
  });

  it('the debrief shows the people who remember you and is about Finance, not QC or sales', async () => {
    let withHanh = 0;
    for (let i = 0; i < 10; i++) {
      const { log } = await play('fin-year', `fin-deb-${i}`, 'en', undefined, { policy: 'last' });
      const d = debriefOf(log)[0]!;
      if (d.people.some((p) => p.character === 'char.hanh')) withHanh += 1;
      for (const l of d.lessons) {
        expect(['fact.discount_above_limit', 'fact.accepted_kickback']).not.toContain(l.factId);
      }
      for (const line of [d.title, d.body, ...d.lessons.map((l) => l.lesson)]) {
        expect(line).not.toMatch(/\[[a-z_.]+\]|\{\w+\}/);
      }
    }
    expect(withHanh).toBeGreaterThan(5);
  });

  it('is deterministic and replays identically, like every other scenario', async () => {
    const scenario = await loadScenario('fin-year', { contentDir });
    for (const seed of ['f1', 'f2']) {
      const report = checkDeterminism({
        seed,
        turns: scenario.turns,
        modules: scenario.modules,
        configs: scenario.configs,
        bot: scenario.bot,
      });
      expect(report.problems, seed).toEqual([]);
    }
    const a = await play('fin-year', 'replayme', 'en', undefined, { policy: 'last' });
    expect(replay(a.log, a.scenario.modules, { configs: a.scenario.configs }).ok).toBe(true);
    expectPin(
      'fin-year.2026',
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
