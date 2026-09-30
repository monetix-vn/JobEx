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
  type BotOptions,
} from '../src';

const contentDir = join(import.meta.dirname, '..', '..', '..', 'content');

async function play(
  name: string,
  seed: string,
  locale: 'en' | 'vi' = 'en',
  turns?: number,
  bot?: Partial<BotOptions>,
) {
  const scenario = await loadScenario(name, { contentDir, locale, ...(turns ? { turns } : {}) });
  const log = runHeadless({
    seed,
    turns: scenario.turns,
    modules: scenario.modules,
    configs: scenario.configs,
    bot: { ...scenario.bot, ...bot },
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

describe('Phase 1 block C: detection, endings and the debrief', () => {
  const endingOf = (log: ReplayLog): string =>
    ((of(log, 'run.ended')[0]!.payload as { ending?: string }).ending ?? 'completed') as string;
  const debriefOf = (log: ReplayLog) =>
    of(log, 'debrief.ready').map((e) => e.payload as CoreEventPayloads['debrief.ready']);

  async function batch(policy: 'first' | 'last' | 'random', n: number) {
    const counts: Record<string, number> = {};
    const early: number[] = [];
    for (let i = 0; i < n; i++) {
      const { log } = await play('sales-year', `${policy}-${i}`, 'en', undefined, { policy });
      const ending = endingOf(log);
      counts[ending] = (counts[ending] ?? 0) + 1;
      if (ending !== 'completed') early.push(log.turns);
    }
    early.sort((a, b) => a - b);
    return { counts, early, median: early[Math.floor(early.length / 2)] };
  }

  it('a careful player finishes the year; a reckless one does not (first-cut balance guard)', async () => {
    const careful = await batch('first', 20);
    expect(careful.counts.completed).toBeGreaterThanOrEqual(19);
    const reckless = await batch('last', 20);
    expect(reckless.early.length).toBeGreaterThanOrEqual(19);
    expect(reckless.median).toBeGreaterThan(8);
    expect(reckless.median).toBeLessThan(40);
    expect(
      Object.keys(reckless.counts).every((k) =>
        ['fired', 'prosecuted', 'burnout', 'completed'].includes(k),
      ),
    ).toBe(true);
  });

  it('an early ending stops the run there, says so on run.ended, and every run gets exactly one debrief', async () => {
    let early = 0;
    for (let i = 0; i < 10; i++) {
      const { log } = await play('sales-year', `last-${i}`, 'en', undefined, { policy: 'last' });
      const requested = of(log, 'run.endRequested');
      const debriefs = debriefOf(log);
      expect(debriefs).toHaveLength(1);
      expect(debriefs[0]!.ending).toBe(endingOf(log));
      expect(debriefs[0]!.weeks).toBe(log.turns);
      expect(of(log, 'run.ended')).toHaveLength(1);
      expect(log.entries.at(-1)!.type).toBe('debrief.ready');
      if (requested.length > 0) {
        early += 1;
        expect(log.turns).toBeLessThan(52);
        expect(requested[0]!.source).toBe('risk');
        // Nothing happens after the run ended, apart from the debrief itself.
        const endedIndex = log.entries.findIndex((e) => e.type === 'run.ended');
        expect(log.entries.slice(endedIndex + 1).map((e) => e.type)).toEqual(['debrief.ready']);
      }
    }
    expect(early).toBeGreaterThan(5);
  });

  it('the debrief tells the story: what you did, what came back, what it teaches, the words you met', async () => {
    let checked = 0;
    for (let i = 0; i < 12 && checked < 4; i++) {
      const { log } = await play('sales-year', `last-${i}`, 'en', undefined, { policy: 'last' });
      const d = debriefOf(log)[0]!;
      if (d.ending === 'completed') continue;
      checked += 1;
      expect(d.title.length).toBeGreaterThan(5);
      expect(d.body.length).toBeGreaterThan(20);
      expect(d.timeline.length).toBeGreaterThan(2);
      expect(d.timeline.at(-1)!.kind).toBe('ending');
      expect(d.timeline.map((e) => e.turn)).toEqual(
        [...d.timeline.map((e) => e.turn)].sort((a, b) => a - b),
      );
      expect(d.timeline.some((e) => e.kind === 'choice')).toBe(true);
      expect(d.lessons.length).toBeGreaterThan(0);
      expect(d.terms.length).toBeGreaterThan(0);
      expect(d.stats['player.rep.boss']).toBeLessThanOrEqual(50);
      for (const line of [
        d.title,
        d.body,
        ...d.timeline.map((e) => e.text),
        ...d.lessons.map((l) => l.lesson),
      ]) {
        expect(line, 'text should be resolved, not a missing key').not.toMatch(
          /\[[a-z_.]+\]|\{\w+\}/,
        );
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('the debrief follows the language, and is otherwise identical', async () => {
    const en = await play('sales-year', 'last-3', 'en', undefined, { policy: 'last' });
    const vi = await play('sales-year', 'last-3', 'vi', undefined, { policy: 'last' });
    const a = debriefOf(en.log)[0]!;
    const b = debriefOf(vi.log)[0]!;
    expect(b.ending).toBe(a.ending);
    expect(b.weeks).toBe(a.weeks);
    expect(b.stats).toEqual(a.stats);
    expect(b.timeline.map((e) => [e.turn, e.kind])).toEqual(
      a.timeline.map((e) => [e.turn, e.kind]),
    );
    expect(b.title).not.toBe(a.title);
    expect(b.title).toMatch(/[ạảãàáâấầẩẫậăắằẳẵặđèéêếềểễệìíòóôốồổỗộơớờởỡợùúưứừửữựỳýỵ]/i);
  });

  it('detectors find hidden deeds: audits, reports, and the same consequences as any other way of getting out', async () => {
    let audits = 0;
    let found = 0;
    let inAudit = 0;
    let scapegoated = 0;
    for (let i = 0; i < 30; i++) {
      const { log } = await play('sales-year', `risk-${i}`);
      audits += of(log, 'risk.auditStarted').length;
      for (const e of of(log, 'risk.detected')) {
        found += 1;
        const p = e.payload as CoreEventPayloads['risk.detected'];
        if (p.audit) {
          inAudit += 1;
          expect(p.detector).toBe('internal_audit');
        }
        // The ledger made it known, because risk asked it to.
        const asked = log.entries.find(
          (x) =>
            x.causedBy === e.causedBy &&
            x.type === 'knowledge.escalate' &&
            (x.payload as { factId: string }).factId === p.factId,
        );
        expect(asked, p.factId).toBeDefined();
        expect((asked!.payload as { reason: string }).reason).toBe('detected:' + p.detector);
      }
      scapegoated += of(log, 'risk.scapegoated').length;
    }
    expect(audits).toBeGreaterThan(5);
    expect(found).toBeGreaterThan(10);
    expect(inAudit).toBeGreaterThan(0);
    expect(scapegoated).toBeGreaterThan(0);
  });

  it('audit weeks come at the quarter ends and each one shows the player a notice', async () => {
    const { log } = await play('sales-year', 'first-0', 'en', undefined, { policy: 'first' });
    const weeks = of(log, 'risk.auditStarted').map((e) => snapshotForTurn(e.turn).week_of_year);
    expect(weeks).toEqual([12, 25, 38, 51]);
    const notices = of(log, 'scene.started').filter((e) =>
      (e.payload as { sceneId: string }).sceneId.startsWith('notice.risk.audit'),
    );
    expect(notices).toHaveLength(4);
  });

  it('glossary words ride along with scenes that have them, and every term resolves', async () => {
    const { log } = await play('sales-year', 'first-1', 'en', undefined, { policy: 'first' });
    const withTerms = of(log, 'scene.started').filter(
      (e) => ((e.payload as CoreEventPayloads['scene.started']).terms?.length ?? 0) > 0,
    );
    expect(withTerms.length).toBeGreaterThan(10);
    for (const e of withTerms) {
      for (const t of (e.payload as CoreEventPayloads['scene.started']).terms!) {
        expect(t.term).not.toMatch(/^\[/);
        expect(t.definition.length).toBeGreaterThan(20);
      }
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
    expect(report.fingerprint).toBe('1f186d98234314');
  });

  it('refuses to run without the role content, and on an unknown scenario', async () => {
    await expect(loadScenario('nope', { contentDir })).rejects.toThrow(/unknown scenario/);
    await expect(
      loadScenario('sales-week', { contentDir: join(contentDir, 'core') }),
    ).rejects.toThrow(/not found/);
  });
});
