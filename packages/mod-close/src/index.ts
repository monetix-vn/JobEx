import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  EventDraft,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';
import { snapshotForTurn } from '@je/kernel';

export const manifest: ModuleManifest = {
  id: 'close',
  version: '0.1.0',
  priority: 26,
  consumes: ['run.started', 'clock.ticked', 'sim.deltaApplied'],
  emits: ['sim.applyDelta', 'close.completed'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface CloseConfig {
  content: ContentView;
  roleId: string;
  /** The close is open for this many weeks before a month ends. Default 3. */
  windowWeeks?: number;
}

/**
 * The month-end close, for jobs that have one (a role with `close_steps`, e.g. finance). Each
 * step is a variable `close.<step>`: 0 open, 1 done in a hurry, 2 done properly; scenes set them
 * with ordinary delta effects. `close.open` is 1 during the last weeks of a month, so scenes can
 * ask for the close then. When the month rolls over, the close is scored (how many points of the
 * possible were earned): a good close helps the boss's opinion, a poor one costs it, every step
 * left open adds stress, then everything resets for the next month. Jobs without `close_steps`
 * get nothing from this module. It never draws random numbers and never reads the locale.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<CloseConfig> | undefined;
  if (!config?.content || !config.roleId) {
    throw new Error('mod-close needs config.content and config.roleId');
  }
  const role = config.content.get('role', config.roleId);
  if (!role) throw new Error(`mod-close: unknown role "${config.roleId}"`);
  const steps = role.close_steps ?? [];
  const windowWeeks = config.windowWeeks ?? 3;

  const values = new Map<string, number>(steps.map((s) => [s, 0]));
  let open = 0;
  let lastMonth: number | undefined;

  const set = (path: string, value: number, reason: string): EventDraft => ({
    type: 'sim.applyDelta',
    payload: { path, value, mode: 'set', reason },
  });
  const add = (path: string, value: number, reason: string): EventDraft => ({
    type: 'sim.applyDelta',
    payload: { path, value, reason },
  });

  /** How good the close was, from 0 to 1. */
  const score = (): number =>
    steps.length === 0
      ? 0
      : steps.reduce((sum, s) => sum + (values.get(s) ?? 0), 0) / (2 * steps.length);

  const finish = (month: number): EventDraft[] => {
    const result = score();
    const left = steps.filter((s) => (values.get(s) ?? 0) === 0).length;
    const drafts: EventDraft[] = [
      {
        type: 'close.completed',
        payload: {
          month,
          steps: Object.fromEntries(steps.map((s) => [s, values.get(s) ?? 0])),
          score: Math.round(result * 100) / 100,
        },
      },
    ];
    const reason = `close:${month}`;
    if (result >= 0.75) drafts.push(add('player.rep.boss', 2, reason));
    else if (result < 0.4) drafts.push(add('player.rep.boss', -3, reason));
    if (left > 0) drafts.push(add('player.stress', left, reason));
    for (const step of steps) {
      if ((values.get(step) ?? 0) !== 0) drafts.push(set(`close.${step}`, 0, reason));
    }
    return drafts;
  };

  return {
    handlers: {
      'run.started': () => {
        if (steps.length === 0) return;
        return [...steps.map((s) => set(`close.${s}`, 0, 'start')), set('close.open', 0, 'start')];
      },

      'clock.ticked': (env) => {
        if (steps.length === 0) return;
        const { turn, month_of_year: month } = env.payload as CoreEventPayloads['clock.ticked'];
        const drafts: EventDraft[] = [];
        if (lastMonth !== undefined && month !== lastMonth) drafts.push(...finish(lastMonth));
        lastMonth = month;
        const closing = snapshotForTurn(turn + windowWeeks).month_of_year !== month;
        if (closing !== (open === 1)) {
          open = closing ? 1 : 0;
          drafts.push(set('close.open', open, 'window'));
        }
        return drafts;
      },

      'sim.deltaApplied': (env) => {
        const p = env.payload as CoreEventPayloads['sim.deltaApplied'];
        if (!p.path.startsWith('close.')) return;
        const step = p.path.slice('close.'.length);
        if (values.has(step)) values.set(step, Math.min(2, Math.max(0, p.to)));
      },
    },
    snapshot: () => ({
      steps,
      values: Object.fromEntries([...values.entries()]),
      open,
      lastMonth: lastMonth ?? null,
    }),
  };
}

export const closeModule: Module = { manifest, createModule };
