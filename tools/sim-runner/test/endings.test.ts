import { describe, expect, it } from 'vitest';
import type { CoreEventPayloads, ReplayLog } from '@je/contracts';
import { snapshotForTurn } from '@je/kernel';
import { of, play } from './helpers';

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
