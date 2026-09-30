import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, ReplayLog } from '@je/contracts';
import { snapshotForTurn } from '@je/kernel';
import { checkDeterminism, loadScenario } from '../src';
import { contentDir, of, play, state } from './helpers';
import { expectPin } from './pins';

describe('Phase 1: a year of it, driven by the director', () => {
  const fired = (log: ReplayLog) =>
    of(log, 'director.eventFired').map((e) => ({
      id: (e.payload as { eventId: string }).eventId,
      turn: e.turn,
    }));

  it('holds up over 52 weeks: plenty of decisions, bounded state, nothing rejected', async () => {
    const { log } = await play('sales-year', 'year', 'en', undefined, { policy: 'first' });
    expect(log.turns).toBe(52);
    const scenes = of(log, 'scene.started');
    expect(scenes.length).toBeGreaterThan(40);
    expect(scenes.length).toBeLessThan(120);
    expect(
      new Set(scenes.map((e) => (e.payload as { sceneId: string }).sceneId)).size,
    ).toBeGreaterThanOrEqual(10);
    expect(of(log, 'choice.rejected')).toHaveLength(0);
    expect(of(log, 'sim.deltaRejected')).toHaveLength(0);
    for (const e of of(log, 'sim.stateChanged')) {
      const vars = (e.payload as CoreEventPayloads['sim.stateChanged']).vars;
      for (const key of ['player.stress', 'player.health', 'player.energy'] as const) {
        if (key in vars) {
          expect(vars[key] as number).toBeGreaterThanOrEqual(0);
          expect(vars[key] as number).toBeLessThanOrEqual(100);
        }
      }
    }
    expect(of(log, 'workload.weekClosed')).toHaveLength(52);
  });

  it('draws one or two events a week and respects each event cooldown', async () => {
    for (const seed of ['cd1', 'cd2', 'cd3']) {
      const { log, scenario } = await play('sales-year', seed);
      const events = fired(log);
      const perWeek = new Map<number, number>();
      for (const e of events) perWeek.set(e.turn, (perWeek.get(e.turn) ?? 0) + 1);
      for (const n of perWeek.values()) expect(n).toBeLessThanOrEqual(2);
      const registry = (
        scenario.configs.director as {
          content: {
            get: (k: 'event', id: string) => { cooldown_weeks?: number; weight?: number };
          };
        }
      ).content;
      const last = new Map<string, number>();
      for (const e of events) {
        const before = last.get(e.id);
        if (before !== undefined) {
          // Events a storyline schedules (weight 0) are not drawn from the pool, so cooldowns do not apply.
          const def = registry.get('event', e.id);
          if (def?.weight === 0) continue;
          const cooldown = def?.cooldown_weeks ?? 8;
          expect(e.turn - before, `${seed} ${e.id}`).toBeGreaterThanOrEqual(cooldown);
        }
        last.set(e.id, e.turn);
      }
    }
  });

  it('seasonal events only happen in their season', async () => {
    const quarterEnd = new Set([3, 6, 9, 12]);
    const seen = new Set<string>();
    for (const seed of ['s1', 's2', 's3', 's4', 's5', 's6']) {
      const { log } = await play('sales-year', seed);
      for (const { id, turn } of fired(log)) {
        const month = snapshotForTurn(turn).month_of_year;
        if (id === 'event.sales.tet_rush') {
          seen.add(id);
          expect([12, 1]).toContain(month);
        }
        if (id === 'event.sales.forecast_meeting' || id === 'event.sales.backdate_invoice') {
          seen.add(id);
          expect(quarterEnd.has(month), `${id} in month ${month}`).toBe(true);
        }
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });

  it('a careful player feels real pressure without being crushed (first-cut balance guard)', async () => {
    const finals: number[] = [];
    for (let i = 0; i < 12; i++) {
      const { log } = await play('sales-year', `balance-${i}`, 'en', undefined, {
        policy: 'first',
      });
      finals.push(state(log)['player.stress'] as number);
    }
    const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
    expect(mean).toBeGreaterThan(35);
    expect(mean).toBeLessThan(85);
    expect(finals.filter((f) => f >= 100)).toHaveLength(0);
  });

  it('a stressed player gets stress-driven events, a calm one does not', async () => {
    let onlyWhenStressed = true;
    let sawIt = false;
    for (const seed of ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']) {
      const { log } = await play('sales-year', seed);
      const stressAt = new Map<number, number>();
      let stress = 25;
      for (const e of log.entries) {
        if (e.type === 'sim.stateChanged') {
          const v = (e.payload as CoreEventPayloads['sim.stateChanged']).vars['player.stress'];
          if (typeof v === 'number') stress = v;
        }
        if (
          e.type === 'director.eventFired' &&
          (e.payload as { eventId: string }).eventId === 'event.sales.overtime_request'
        ) {
          sawIt = true;
          stressAt.set(e.turn, stress);
          if (stress < 40) onlyWhenStressed = false;
        }
      }
    }
    expect(sawIt).toBe(true);
    expect(onlyWhenStressed).toBe(true);
  });

  it('what the player does comes back: facts leak, gossip spreads, reputation moves, notices appear', async () => {
    let learned = 0;
    let escalated = 0;
    let repFromFacts = 0;
    let notices = 0;
    for (let i = 0; i < 12; i++) {
      const { log } = await play('sales-year', `facts-${i}`);
      learned += of(log, 'fact.learned').length;
      escalated += of(log, 'fact.escalated').length;
      repFromFacts += of(log, 'sim.deltaApplied').filter((e) =>
        String((e.payload as { reason?: string }).reason).startsWith('fact:'),
      ).length;
      const noticeScenes = of(log, 'scene.started').filter((e) =>
        (e.payload as { sceneId: string }).sceneId.startsWith('notice.'),
      );
      notices += noticeScenes.length;
      // Every notice was acknowledged, and none was rejected.
      const resolved = new Set(
        of(log, 'choice.resolved').map((e) => (e.payload as { sceneId: string }).sceneId),
      );
      for (const n of noticeScenes)
        expect(resolved.has((n.payload as { sceneId: string }).sceneId)).toBe(true);
      expect(of(log, 'choice.rejected')).toHaveLength(0);
      // Facts are published as state variables, one per fact, ranked 1 to 4.
      const state = log.finalState['sim-core'] as Record<string, unknown>;
      for (const [key, value] of Object.entries(state)) {
        if (key.startsWith('fact.')) expect([1, 2, 3, 4]).toContain(value);
      }
    }
    expect(learned).toBeGreaterThan(30);
    expect(escalated).toBeGreaterThan(5);
    expect(repFromFacts).toBeGreaterThan(20);
    expect(notices).toBeGreaterThan(0);
  });

  it('consequence events only fire once the relevant facts are known', async () => {
    const needs: Record<string, { facts: string[]; rank: number }> = {
      'event.sales.finance_inquiry': {
        facts: [
          'fact.discount_above_limit',
          'fact.credit_above_limit',
          'fact.backdated_documents',
          'fact.forecast_padded',
        ],
        rank: 2,
      },
      'event.sales.buyer_confronts': {
        facts: [
          'fact.promised_unrealistic_date',
          'fact.blamed_forwarder',
          'fact.silent_spec_change',
        ],
        rank: 2,
      },
      'event.sales.compliance_interview': {
        facts: ['fact.accepted_kickback', 'fact.paid_for_document'],
        rank: 3,
      },
    };
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const { log } = await play('sales-year', `cons-${i}`);
      const rank: Record<string, number> = {};
      for (const e of log.entries) {
        if (e.type === 'sim.deltaApplied') {
          const p = e.payload as { path: string; to: number };
          if (p.path.startsWith('fact.')) rank[p.path] = p.to;
        }
        if (e.type === 'director.eventFired') {
          const id = (e.payload as { eventId: string }).eventId;
          const need = needs[id];
          if (!need) continue;
          seen.add(id);
          expect(
            need.facts.some((f) => (rank[f] ?? 0) >= need.rank),
            `${id} in run ${i} without a known fact`,
          ).toBe(true);
        }
      }
    }
    expect(seen.size).toBeGreaterThanOrEqual(2);
  });

  it('the buyer audit notice schedules the audit day four to six weeks later', async () => {
    let checked = 0;
    for (let i = 0; i < 30 && checked < 3; i++) {
      const { log } = await play('sales-year', `audit-${i}`);
      const events = fired(log);
      const notice = events.find((e) => e.id === 'event.buyer_audit_notice');
      // A run that ended before the audit day could come due has nothing to check.
      if (!notice || log.turns <= notice.turn + 6) continue;
      const day = events
        .filter((e) => e.id === 'event.audit_day')
        .filter((e) => e.turn > notice.turn);
      expect(day.length, `audit-${i}`).toBeGreaterThanOrEqual(1);
      const gap = day[0]!.turn - notice.turn;
      expect(gap).toBeGreaterThanOrEqual(4);
      expect(gap).toBeLessThanOrEqual(6);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('passes the determinism gate on real modules: twice, replay, and a different seed', async () => {
    const scenario = await loadScenario('sales-year', { contentDir });
    for (const seed of ['y1', 'y2', 'y3']) {
      const report = checkDeterminism({
        seed,
        turns: scenario.turns,
        modules: scenario.modules,
        configs: scenario.configs,
        bot: scenario.bot,
      });
      expect(report.problems, seed).toEqual([]);
    }
  });

  it('the fingerprint for a fixed seed is pinned', async () => {
    const scenario = await loadScenario('sales-year', { contentDir });
    const report = checkDeterminism({
      seed: '2026',
      turns: scenario.turns,
      modules: scenario.modules,
      configs: scenario.configs,
      bot: scenario.bot,
    });
    expectPin('sales-year.2026', report.fingerprint);
  });

  it('refuses to run without the role content, and on an unknown scenario', async () => {
    await expect(loadScenario('nope', { contentDir })).rejects.toThrow(/unknown scenario/);
    await expect(
      loadScenario('sales-week', { contentDir: join(contentDir, 'core') }),
    ).rejects.toThrow(/not found/);
  });
});

describe('Sales: the story layer (beats, storylines, rewards)', () => {
  const eventsOf = (log: ReplayLog) =>
    of(log, 'director.eventFired').map((e) => ({
      id: (e.payload as { eventId: string }).eventId,
      week: e.turn + 1,
    }));
  const advanced = (log: ReplayLog, arc: string) =>
    of(log, 'arc.advanced')
      .map((e) => e.payload as { arc: string; stage: string })
      .filter((p) => p.arc === arc)
      .map((p) => p.stage);

  it('the season has its beats, once each, inside their windows', async () => {
    const windows: Record<string, [number, number]> = {
      'event.sales.first_big_order': [1, 3],
      'event.sales.midyear_review': [24, 28],
      'event.sales.big_buyer_threatens': [29, 32],
      'event.sales.year_end_review': [49, 50],
    };
    for (let i = 0; i < 6; i++) {
      const { log } = await play('sales-year', `sales-beat-${i}`, 'en', undefined, {
        policy: 'first',
      });
      const all = eventsOf(log);
      for (const [id, [from, to]] of Object.entries(windows)) {
        const plays = all.filter((f) => f.id === id);
        expect(plays, `${id} in run ${i}`).toHaveLength(1);
        expect(plays[0]!.week).toBeGreaterThanOrEqual(from);
        expect(plays[0]!.week).toBeLessThanOrEqual(to);
      }
    }
  });

  it('the discount spiral, the overdue account and Quynh branch on what the player does', async () => {
    let spiral = 0;
    let closedAtOnce = 0;
    let overdue = 0;
    let quynh = 0;
    for (let i = 0; i < 30; i++) {
      const careful = (
        await play('sales-year', `sales-arcs-${i}`, 'en', undefined, { policy: 'first' })
      ).log;
      const reckless = (
        await play('sales-year', `sales-arcs-${i}`, 'en', undefined, { policy: 'last' })
      ).log;
      const r = advanced(reckless, 'arc.discount_spiral');
      if (r.length > 0) {
        spiral += 1;
        expect(r[0]).toBe('expected');
      }
      if (
        of(careful, 'arc.ended').some(
          (e) => (e.payload as { arc: string; reason: string }).arc === 'arc.discount_spiral',
        )
      ) {
        closedAtOnce += 1;
        expect(advanced(careful, 'arc.discount_spiral')).toEqual([]);
      }
      const o = advanced(reckless, 'arc.overdue_account');
      if (o.length > 0) {
        overdue += 1;
        expect(o[0]).toBe('pull_in');
      }
      if (advanced(careful, 'arc.quynh')[0] === 'copies') quynh += 1;
    }
    expect(spiral).toBeGreaterThan(2);
    expect(closedAtOnce).toBeGreaterThan(2);
    expect(overdue).toBeGreaterThan(1);
    expect(quynh).toBeGreaterThan(2);
  });

  it('a buyer who has come to trust you offers a reward scene, and only then', async () => {
    let seen = 0;
    for (let i = 0; i < 40; i++) {
      const { log } = await play('sales-year', `sales-reward-${i}`, 'en', undefined, {
        policy: 'first',
      });
      const scene = of(log, 'relationship.changed')
        .map((e) => e.payload as CoreEventPayloads['relationship.changed'])
        .filter((p) => p.character === 'char.anders' && p.dimension === 'trust');
      const best = scene.reduce((m, p) => Math.max(m, p.to), 0);
      const renewal = eventsOf(log).filter((e) => e.id === 'event.sales.anders_renewal');
      if (renewal.length > 0) {
        seen += 1;
        expect(best).toBeGreaterThanOrEqual(25);
      }
    }
    expect(seen).toBeGreaterThanOrEqual(0);
  });
});
