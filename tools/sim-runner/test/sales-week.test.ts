import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, Envelope, ReplayLog } from '@je/contracts';
import { canonicalize, replay } from '@je/kernel';
import { SALES_WEEK_SCENES, loadScenario, modulesForLog } from '../src';
import { contentDir, of, play, state } from './helpers';

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

  it('every state change traces back through causedBy to a player choice or the calendar', async () => {
    const { log } = await play('sales-week', 'week-1');
    const byId = new Map(log.entries.map((e) => [e.id, e]));
    const rootOf = (e: Envelope): Envelope => (e.causedBy ? rootOf(byId.get(e.causedBy)!) : e);
    const applied = of(log, 'sim.deltaApplied');
    expect(applied.length).toBeGreaterThan(3);
    for (const e of applied) {
      const cmd = byId.get(e.causedBy!)!;
      expect(cmd.type).toBe('sim.applyDelta');
      const root = rootOf(e);
      expect(['client', 'kernel']).toContain(root.source);
      if (cmd.source === 'choice') expect(root.type).toBe('choice.made');
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
