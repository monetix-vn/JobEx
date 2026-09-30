import { describe, expect, it } from 'vitest';
import type { ContentView, EventDraft, Role } from '@je/contracts';
import { snapshotForTurn } from '@je/kernel';
import { closeModule, manifest } from '../src';

const finance: Role = {
  id: 'role.fin',
  department: 'dept.finance',
  level: 1,
  title_key: 't',
  close_steps: ['bank_rec', 'accruals'],
};
const sales: Role = { id: 'role.sales', department: 'dept.sales', level: 1, title_key: 't' };
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'role' ? [finance, sales].find((r) => r.id === id) : undefined) as never,
  all: (() => []) as never,
  text: () => undefined,
};

/** A close module driven week by week on the real calendar. */
function driver(roleId = finance.id, windowWeeks?: number) {
  const instance = closeModule.createModule({
    moduleId: 'close',
    rng: undefined as never,
    clock: { now: () => snapshotForTurn(0) },
    ports: {} as never,
    config: { content, roleId, ...(windowWeeks ? { windowWeeks } : {}) },
  });
  const env = (type: string, turn: number, payload: unknown) => ({
    id: 'e',
    type,
    v: 1,
    runId: 'r',
    turn,
    source: 't',
    payload,
  });
  return {
    start: () => instance.handlers['run.started']!(env('run.started', 0, {})) ?? [],
    tick: (turn: number): EventDraft[] =>
      instance.handlers['clock.ticked']!(env('clock.ticked', turn, snapshotForTurn(turn))) ?? [],
    /** Plays a scene effect: tells the module what sim-core now holds. */
    did(path: string, to: number) {
      instance.handlers['sim.deltaApplied']!(env('sim.deltaApplied', 0, { path, from: 0, to }));
    },
    snapshot: () => instance.snapshot() as { values: Record<string, number>; open: number },
  };
}
const deltas = (out: EventDraft[]) =>
  out
    .filter((e) => e.type === 'sim.applyDelta')
    .map((e) => e.payload as { path: string; value: number; mode?: string; reason: string });
const firstWeekOfMonth = (month: number): number => {
  for (let t = 0; t < 52; t++) if (snapshotForTurn(t).month_of_year === month) return t;
  throw new Error('no such month');
};

describe('close: the month-end close', () => {
  it('declares itself between workload and choice', () => {
    expect(manifest).toMatchObject({ id: 'close', priority: 26 });
  });

  it('does nothing for a job without close steps', () => {
    const d = driver(sales.id);
    expect(d.start()).toEqual([]);
    for (let t = 0; t < 20; t++) expect(d.tick(t)).toEqual([]);
  });

  it('refuses to start without content or with an unknown role', () => {
    expect(() => closeModule.createModule({ config: undefined } as never)).toThrow(/config/);
    expect(() => driver('role.nope')).toThrow(/unknown role/);
  });

  it('starts every step open and the window shut', () => {
    expect(deltas(driver().start())).toEqual([
      { path: 'close.bank_rec', value: 0, mode: 'set', reason: 'start' },
      { path: 'close.accruals', value: 0, mode: 'set', reason: 'start' },
      { path: 'close.open', value: 0, mode: 'set', reason: 'start' },
    ]);
  });

  it('opens the window three weeks before a month ends and shuts it when the month changes', () => {
    const d = driver();
    const opens: number[] = [];
    const shuts: number[] = [];
    for (let t = 0; t < 14; t++) {
      for (const c of deltas(d.tick(t)).filter((x) => x.path === 'close.open')) {
        (c.value === 1 ? opens : shuts).push(t);
      }
    }
    const february = firstWeekOfMonth(2);
    expect(opens[0]).toBe(february - 3);
    expect(shuts[0]).toBe(february);
  });

  it('a proper close at month end helps the boss and everything resets', () => {
    const d = driver();
    d.start();
    const next = firstWeekOfMonth(2);
    for (let t = 0; t < next; t++) d.tick(t);
    d.did('close.bank_rec', 2);
    d.did('close.accruals', 2);
    const out = d.tick(next);
    expect(out.find((e) => e.type === 'close.completed')!.payload).toEqual({
      month: 1,
      steps: { bank_rec: 2, accruals: 2 },
      score: 1,
    });
    expect(deltas(out)).toContainEqual({ path: 'player.rep.boss', value: 2, reason: 'close:1' });
    expect(deltas(out).filter((x) => x.mode === 'set' && x.reason === 'close:1')).toEqual([
      { path: 'close.bank_rec', value: 0, mode: 'set', reason: 'close:1' },
      { path: 'close.accruals', value: 0, mode: 'set', reason: 'close:1' },
    ]);
  });

  it('a close left open costs the boss standing and adds stress for each open step', () => {
    const d = driver();
    d.start();
    const next = firstWeekOfMonth(2);
    for (let t = 0; t < next; t++) d.tick(t);
    const out = d.tick(next);
    expect(out.find((e) => e.type === 'close.completed')!.payload).toMatchObject({ score: 0 });
    expect(deltas(out)).toEqual(
      expect.arrayContaining([
        { path: 'player.rep.boss', value: -3, reason: 'close:1' },
        { path: 'player.stress', value: 2, reason: 'close:1' },
      ]),
    );
  });

  it('a half-done close neither pleases nor angers the boss, and leftover steps add stress', () => {
    const d = driver();
    d.start();
    const next = firstWeekOfMonth(2);
    for (let t = 0; t < next; t++) d.tick(t);
    d.did('close.bank_rec', 2);
    const out = deltas(d.tick(next));
    expect(out.some((x) => x.path === 'player.rep.boss')).toBe(false);
    expect(out).toContainEqual({ path: 'player.stress', value: 1, reason: 'close:1' });
  });
});
