import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, Envelope, ReplayLog } from '@je/contracts';
import { canonicalize, replay, snapshotForTurn } from '@je/kernel';
import {
  SALES_WEEK_SCENES,
  checkDeterminism,
  loadScenario,
  modulesForLog,
  runHeadless,
} from '../src';

const contentDir = join(import.meta.dirname, '..', '..', '..', 'content');

async function play(name: string, seed: string, locale: 'en' | 'vi' = 'en', turns?: number) {
  const scenario = await loadScenario(name, { contentDir, locale, ...(turns ? { turns } : {}) });
  const log = runHeadless({
    seed,
    turns: scenario.turns,
    modules: scenario.modules,
    configs: scenario.configs,
    bot: scenario.bot,
  });
  return { scenario, log };
}
const of = (log: ReplayLog, type: string): Envelope[] => log.entries.filter((e) => e.type === type);
const state = (log: ReplayLog) => log.finalState['sim-core'] as Record<string, number | string>;

describe('Phase 1 block A: one Sales Specialist week, played end to end', () => {
  it('runs the three pressure scenes in order, one at a time, each resolved and ended', async () => {
    const { log } = await play('sales-week', 'week-1');
    const started = of(log, 'scene.started').map((e) => (e.payload as { sceneId: string }).sceneId);
    expect(started).toEqual([...SALES_WEEK_SCENES]);
    expect(of(log, 'choice.resolved')).toHaveLength(3);
    expect(of(log, 'scene.ended')).toHaveLength(3);
    expect(of(log, 'choice.rejected')).toHaveLength(0);

    // Strictly one scene at a time: a scene never starts while another is open.
    let openScenes = 0;
    for (const e of log.entries) {
      if (e.type === 'scene.started') expect(++openScenes).toBe(1);
      if (e.type === 'scene.ended') openScenes -= 1;
    }
    expect(openScenes).toBe(0);
  });

  it('every message in a scene is causally linked back to the player choice', async () => {
    const { log } = await play('sales-week', 'week-1');
    const byId = new Map(log.entries.map((e) => [e.id, e]));
    const applied = of(log, 'sim.deltaApplied');
    expect(applied.length).toBeGreaterThan(3);
    for (const e of applied) {
      const cmd = byId.get(e.causedBy!)!;
      expect(cmd.type).toBe('sim.applyDelta');
      const cause = byId.get(cmd.causedBy!)!;
      if (cmd.source === 'choice') expect(cause.type).toBe('choice.made');
      else expect(cause.type).toBe('turn.phaseStarted');
    }
  });

  it('choices change the state through sim-core, and the state stays inside its limits', async () => {
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f']) {
      const { log } = await play('sales-week', seed);
      const s = state(log);
      for (const key of [
        'player.stress',
        'player.energy',
        'player.health',
        'player.rep.boss',
        'player.rep.buyer',
      ]) {
        expect(s[key], `${seed} ${key}`).toBeGreaterThanOrEqual(0);
        expect(s[key], `${seed} ${key}`).toBeLessThanOrEqual(100);
      }
      expect(s['world.turn']).toBe(3);
    }
    // Different seeds give different weeks.
    const outcomes = new Set<string>();
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f']) {
      const { log } = await play('sales-week', seed);
      outcomes.add(JSON.stringify(state(log)));
    }
    expect(outcomes.size).toBeGreaterThan(1);
  });

  it('the week costs hours: choices raise the workload beyond the ordinary week', async () => {
    const { log } = await play('sales-week', 'week-1');
    const [first, second] = of(log, 'workload.weekClosed').map(
      (e) => e.payload as CoreEventPayloads['workload.weekClosed'],
    );
    expect(first!.extraHours).toBeGreaterThan(0);
    expect(second!.extraHours).toBe(0);
  });

  it('dark and honest paths are both offered, and the dark payoff is real', async () => {
    const paths = new Set<string>();
    let paidOut = false;
    for (let i = 0; i < 80; i++) {
      const { log } = await play('sales-week', `dark-${i}`);
      for (const e of of(log, 'choice.resolved')) {
        const p = e.payload as CoreEventPayloads['choice.resolved'];
        paths.add(`${p.sceneId}/${p.choiceId}`);
        if (p.sceneId.endsWith('forecast_meeting') && p.choiceId === 'c2')
          paidOut = state(log)['player.cash_vnd'] === 3000000;
      }
    }
    expect(paths.has('scene.sales.forecast_meeting/c1')).toBe(true);
    expect(paths.has('scene.sales.forecast_meeting/c2')).toBe(true);
    expect(paths.has('scene.sales.rfq_discount/c3')).toBe(true);
    expect(paidOut).toBe(true);
  });

  it('effects owned by other modules are reported, not lost', async () => {
    let facts = 0;
    for (let i = 0; i < 40; i++) {
      const { log } = await play('sales-week', `facts-${i}`);
      for (const e of of(log, 'choice.resolved')) {
        facts += ((e.payload as CoreEventPayloads['choice.resolved']).effects ?? []).filter(
          (x) => 'fact' in x,
        ).length;
      }
    }
    expect(facts).toBeGreaterThan(0);
  });

  it('is deterministic and replays identically, including the recorded choices', async () => {
    const a = await play('sales-week', 'det');
    const b = await play('sales-week', 'det');
    expect(canonicalize(a.log)).toBe(canonicalize(b.log));
    expect(a.log.inputs).toHaveLength(3);
    const result = replay(a.log, a.scenario.modules, { configs: a.scenario.configs });
    expect(result.ok, result.reason).toBe(true);
    expect(modulesForLog(a.log).map((m) => m.manifest.id)).toEqual(
      a.scenario.modules.map((m) => m.manifest.id),
    );
  });

  it('language changes the words, never the simulation', async () => {
    const en = await play('sales-week', 'lang');
    const vi = await play('sales-week', 'lang', 'vi');
    expect(state(vi.log)).toEqual(state(en.log));
    expect(of(vi.log, 'choice.resolved').map((e) => e.payload)).toEqual(
      of(en.log, 'choice.resolved').map((e) => e.payload),
    );
    const text = (log: ReplayLog) =>
      (of(log, 'scene.started')[0]!.payload as CoreEventPayloads['scene.started']).lines[0]!.text;
    expect(text(en.log)).toContain('PO 4471');
    expect(text(vi.log)).toContain('PO 4471');
    expect(text(vi.log)).not.toBe(text(en.log));
    expect(
      (of(vi.log, 'scene.started')[0]!.payload as CoreEventPayloads['scene.started']).lines[0]!
        .speaker,
    ).toBe('Sếp');
  });

  it('rejects a choice the player cannot make and leaves the scene open', async () => {
    const scenario = await loadScenario('sales-week', { contentDir });
    // Weak analysis skill: the honest forecast needs skill.analysis >= 30.
    const registry = scenario.configs['sim-core'] as {
      content: { get: (k: 'role', id: string) => { start_state: Record<string, number> } };
    };
    const role = registry.content.get('role', 'role.sales.export.specialist');
    const original = role.start_state['skill.analysis'];
    role.start_state['skill.analysis'] = 10;
    try {
      const { Run } = await import('@je/kernel');
      const run = new Run({ seed: 'weak', modules: scenario.modules, configs: scenario.configs });
      run.start();
      run.advanceTurn((phase, r) => {
        if (phase !== 'plan') return;
        // First scene: shipment. Answer it, then try the honest forecast when it opens.
        r.submit('choice.made', { sceneId: 'scene.sales.shipment_pull_in', choiceId: 'c3' });
        r.submit('choice.made', { sceneId: 'scene.sales.rfq_discount', choiceId: 'c3' });
        const forecast = of(r.exportLog(), 'scene.started').at(-1)!
          .payload as CoreEventPayloads['scene.started'];
        expect(forecast.sceneId).toBe('scene.sales.forecast_meeting');
        expect(forecast.choices.find((c) => c.id === 'c1')!.disabled).toBe(true);
        expect(forecast.choices.find((c) => c.id === 'c2')!.disabled).toBe(false);
        r.submit('choice.made', { sceneId: forecast.sceneId, choiceId: 'c1' });
        expect(of(r.exportLog(), 'choice.rejected').at(-1)!.payload).toEqual({
          sceneId: 'scene.sales.forecast_meeting',
          choiceId: 'c1',
          reason: 'requirement',
        });
        // Still open: another choice works.
        r.submit('choice.made', { sceneId: forecast.sceneId, choiceId: 'c3' });
      });
      expect(of(run.exportLog(), 'scene.ended')).toHaveLength(3);
    } finally {
      role.start_state['skill.analysis'] = original as number;
    }
  });
});

describe('Phase 1: a year of it, driven by the director', () => {
  const fired = (log: ReplayLog) =>
    of(log, 'director.eventFired').map((e) => ({
      id: (e.payload as { eventId: string }).eventId,
      turn: e.turn,
    }));

  it('holds up over 52 weeks: plenty of decisions, bounded state, nothing rejected', async () => {
    const { log } = await play('sales-year', 'year');
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
          content: { get: (k: 'event', id: string) => { cooldown_weeks?: number } };
        }
      ).content;
      const last = new Map<string, number>();
      for (const e of events) {
        const before = last.get(e.id);
        if (before !== undefined) {
          const cooldown = registry.get('event', e.id)?.cooldown_weeks ?? 8;
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

  it('a bot-played year has real pressure without being hopeless (first-cut balance guard)', async () => {
    const finals: number[] = [];
    for (let i = 0; i < 12; i++) {
      const { log } = await play('sales-year', `balance-${i}`);
      finals.push(state(log)['player.stress'] as number);
    }
    const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
    expect(mean).toBeGreaterThan(40);
    expect(mean).toBeLessThan(85);
    expect(finals.filter((f) => f >= 100)).toHaveLength(0);
    expect(finals.filter((f) => f < 10)).toHaveLength(0);
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

  it('the buyer audit notice schedules the audit day four to six weeks later', async () => {
    let checked = 0;
    for (let i = 0; i < 30 && checked < 3; i++) {
      const { log } = await play('sales-year', `audit-${i}`);
      const events = fired(log);
      const notice = events.find((e) => e.id === 'event.buyer_audit_notice');
      if (!notice) continue;
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
    expect(report.fingerprint).toBe('1960eaa590db33');
  });

  it('refuses to run without the role content, and on an unknown scenario', async () => {
    await expect(loadScenario('nope', { contentDir })).rejects.toThrow(/unknown scenario/);
    await expect(
      loadScenario('sales-week', { contentDir: join(contentDir, 'core') }),
    ).rejects.toThrow(/not found/);
  });
});
