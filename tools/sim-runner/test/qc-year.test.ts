import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, ReplayLog } from '@je/contracts';
import { replay } from '@je/kernel';
import { checkDeterminism, loadScenario } from '../src';
import { contentDir, of, play, state } from './helpers';
import { expectPin } from './pins';

const fired = (log: ReplayLog): string[] =>
  of(log, 'director.eventFired').map((e) => (e.payload as { eventId: string }).eventId);
const endingOf = (log: ReplayLog): string =>
  ((of(log, 'run.ended')[0]!.payload as { ending?: string }).ending ?? 'completed') as string;
const debriefOf = (log: ReplayLog) =>
  of(log, 'debrief.ready').map((e) => e.payload as CoreEventPayloads['debrief.ready']);

describe('QC Specialist: the same engine, a different job', () => {
  it('starts as the QC specialist with that job’s own skills and workload', async () => {
    const { log } = await play('qc-year', 'qc-0', 'en', undefined, { policy: 'first' });
    const s = state(log);
    expect(s['player.role']).toBe('role.qc.specialist');
    expect(s['skill.inspection']).toBe(40);
    expect(s['player.salary_vnd']).toBe(13000000);
    const plans = of(log, 'workload.weekPlanned').map(
      (e) => e.payload as CoreEventPayloads['workload.weekPlanned'],
    );
    expect(plans[0]!.tasks.map((t) => t.task)).toEqual([
      'task.incoming_inspection',
      'task.batch_release',
      'task.customer_complaint',
    ]);
  });

  it('each job only meets its own events, plus the ones meant for everybody', async () => {
    const sales = new Set<string>();
    const qc = new Set<string>();
    for (let i = 0; i < 6; i++) {
      for (const id of fired(
        (await play('sales-year', `iso-${i}`, 'en', undefined, { policy: 'first' })).log,
      ))
        sales.add(id);
      for (const id of fired(
        (await play('qc-year', `iso-${i}`, 'en', undefined, { policy: 'first' })).log,
      ))
        qc.add(id);
    }
    expect([...sales].some((id) => id.startsWith('event.qc.'))).toBe(false);
    expect([...qc].some((id) => id.startsWith('event.sales.'))).toBe(false);
    expect(sales.size).toBeGreaterThan(8);
    expect(qc.size).toBeGreaterThan(6);
  });

  it('plays a varied year of QC decisions in either language, with no rejected choices', async () => {
    for (const locale of ['en', 'vi'] as const) {
      const { log } = await play('qc-year', 'qc-year-1', locale, undefined, { policy: 'first' });
      expect(log.turns).toBe(52);
      const scenes = of(log, 'scene.started').map(
        (e) => (e.payload as { sceneId: string }).sceneId,
      );
      expect(scenes.filter((id) => id.startsWith('scene.qc.')).length).toBeGreaterThan(30);
      expect(
        new Set(scenes.filter((id) => id.startsWith('scene.qc.'))).size,
      ).toBeGreaterThanOrEqual(8);
      expect(of(log, 'choice.rejected')).toHaveLength(0);
      expect(of(log, 'sim.deltaRejected')).toHaveLength(0);
    }
  });

  it('a careful player feels real pressure without being crushed (first-cut balance guard)', async () => {
    const finals: number[] = [];
    for (let i = 0; i < 12; i++) {
      const { log } = await play('qc-year', `qc-bal-${i}`, 'en', undefined, { policy: 'first' });
      expect(endingOf(log)).toBe('completed');
      finals.push(state(log)['player.stress'] as number);
    }
    const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
    expect(mean).toBeGreaterThan(25);
    expect(mean).toBeLessThan(85);
  });

  it('a reckless player is caught and does not finish the year (first-cut balance guard)', async () => {
    let early = 0;
    const weeks: number[] = [];
    for (let i = 0; i < 20; i++) {
      const { log } = await play('qc-year', `qc-rk-${i}`, 'en', undefined, { policy: 'last' });
      if (endingOf(log) !== 'completed') {
        early += 1;
        weeks.push(log.turns);
      }
      expect(debriefOf(log)).toHaveLength(1);
    }
    weeks.sort((a, b) => a - b);
    expect(early).toBeGreaterThanOrEqual(18);
    expect(weeks[Math.floor(weeks.length / 2)]).toBeGreaterThan(8);
  });

  it('the consequences come back: audit findings only once a QC deed is known, compliance only for the worst', async () => {
    const needs: Record<string, { facts: string[]; rank: number }> = {
      'event.qc.audit_findings': {
        facts: [
          'rounded_result',
          'backdated_calibration',
          'filled_records',
          'retested_until_pass',
          'accepted_on_supplier_word',
          'ignored_shortcut',
          'unauthorized_adjustment',
          'downplayed_defect',
        ].map((f) => `fact.${f}`),
        rank: 2,
      },
      'event.qc.compliance_interview': {
        facts: ['fact.accepted_supplier_gift', 'fact.delayed_recall_notice'],
        rank: 3,
      },
    };
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const { log } = await play('qc-year', `qc-cons-${i}`);
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
            `${id} in run ${i}`,
          ).toBe(true);
        }
      }
    }
    expect(seen.has('event.qc.audit_findings')).toBe(true);
  });

  it('the debrief is about the QC job: its lessons and vocabulary, not sales', async () => {
    let checked = 0;
    for (let i = 0; i < 12 && checked < 3; i++) {
      const { log } = await play('qc-year', `qc-rk-${i}`, 'en', undefined, { policy: 'last' });
      const d = debriefOf(log)[0]!;
      if (d.ending === 'completed') continue;
      checked += 1;
      expect(d.lessons.length).toBeGreaterThan(0);
      const qcFacts = d.lessons.every(
        (l) => !['fact.discount_above_limit', 'fact.accepted_kickback'].includes(l.factId),
      );
      expect(qcFacts).toBe(true);
      expect(d.terms.length).toBeGreaterThan(0);
      for (const line of [
        d.title,
        d.body,
        ...d.timeline.map((e) => e.text),
        ...d.lessons.map((l) => l.lesson),
      ]) {
        expect(line).not.toMatch(/\[[a-z_.]+\]|\{\w+\}/);
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('named people appear by name in both languages and remember what you did', async () => {
    let seen = 0;
    for (let i = 0; i < 8; i++) {
      const en = (await play('qc-year', `qc-rel-${i}`, 'en', 6, { policy: 'first' })).log;
      const vi = (await play('qc-year', `qc-rel-${i}`, 'vi', 6, { policy: 'first' })).log;
      const premiere = (log: ReplayLog) =>
        of(log, 'scene.started')
          .map((e) => e.payload as CoreEventPayloads['scene.started'])
          .find((p) => p.sceneId === 'scene.qc.first_day_walkthrough');
      const scene = premiere(en);
      if (!scene) continue;
      seen += 1;
      expect(scene.lines.map((l) => l.speaker)).toEqual(['Mr Khoa', 'Minh']);
      expect(premiere(vi)!.lines.map((l) => l.speaker)).toEqual(['Anh Khoa', 'Minh']);
      // Starting values are seeded, then the careful choice raises trust in Khoa and Minh.
      const s = state(en);
      expect(s['rel.khoa.trust']).toBeGreaterThan(10);
      expect(s['rel.minh.trust']).toBeGreaterThan(15);
      const changes = of(en, 'relationship.changed').map(
        (e) => e.payload as CoreEventPayloads['relationship.changed'],
      );
      expect(changes.some((c) => c.character === 'char.khoa' && c.dimension === 'trust')).toBe(
        true,
      );
    }
    expect(seen).toBeGreaterThan(4);
  });

  it('the Hamper storyline escalates for the shortcut-taker and ends at once for the careful', async () => {
    const arcEvents = (
      log: ReplayLog,
    ): { type: string; arc?: string; stage?: string; reason?: string }[] =>
      log.entries
        .filter((e) => e.type.startsWith('arc.'))
        .map((e) => ({
          ...(e.payload as { arc?: string; stage?: string; reason?: string }),
          type: e.type,
        }))
        .filter((e) => e.arc === 'arc.the_hamper');
    const stagesOf = (log: ReplayLog) =>
      arcEvents(log)
        .filter((e) => e.type === 'arc.advanced')
        .map((e) => e.stage as string);
    let escalated = 0;
    let careful = 0;
    for (let i = 0; i < 40; i++) {
      const reckless = (
        await play('qc-year', `qc-hamper-${i}`, 'en', undefined, { policy: 'last' })
      ).log;
      const stages = stagesOf(reckless);
      if (stages.length > 0) {
        escalated += 1;
        // The arc only ever moves forward through its stages.
        const order = ['favour', 'money', 'threat'];
        expect(stages.map((s) => order.indexOf(s))).toEqual(
          [...stages.map((s) => order.indexOf(s))].sort((a, b) => a - b),
        );
        expect(stages[0]).toBe('favour');
      }
      const good = (await play('qc-year', `qc-hamper-${i}`, 'en', undefined, { policy: 'first' }))
        .log;
      const events = arcEvents(good);
      if (events.some((e) => e.type === 'arc.started')) {
        careful += 1;
        expect(events.some((e) => e.type === 'arc.ended' && e.reason === 'end')).toBe(true);
        expect(stagesOf(good)).toEqual([]);
      }
    }
    expect(escalated).toBeGreaterThan(5);
    expect(careful).toBeGreaterThan(5);
  });

  it('is deterministic and replays identically, like every other scenario', async () => {
    const scenario = await loadScenario('qc-year', { contentDir });
    for (const seed of ['q1', 'q2']) {
      const report = checkDeterminism({
        seed,
        turns: scenario.turns,
        modules: scenario.modules,
        configs: scenario.configs,
        bot: scenario.bot,
      });
      expect(report.problems, seed).toEqual([]);
    }
    const a = await play('qc-year', 'replayme', 'en', undefined, { policy: 'last' });
    expect(replay(a.log, a.scenario.modules, { configs: a.scenario.configs }).ok).toBe(true);
    expectPin(
      'qc-year.2026',
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
