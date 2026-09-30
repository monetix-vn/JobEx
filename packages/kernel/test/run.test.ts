import { describe, expect, it } from 'vitest';
import type { Envelope } from '@je/contracts';
import { ContractViolation, Run, canonicalize } from '../src';
import { makeModule } from './helpers';

describe('Run: delivery', () => {
  it('walks turn phases in order every turn', () => {
    const phases: string[] = [];
    const watcher = makeModule('watcher', {
      consumes: ['turn.phaseStarted'],
      handlers: () => ({
        'turn.phaseStarted': (e) => void phases.push((e.payload as { phase: string }).phase),
      }),
    });
    const run = new Run({ seed: 's', modules: [watcher] });
    run.runTurns(2);
    expect(phases).toEqual([
      ...['start', 'plan', 'resolve', 'consequence', 'end'],
      ...['start', 'plan', 'resolve', 'consequence', 'end'],
    ]);
    expect(run.turn).toBe(2);
  });

  it('delivers to subscribers by module priority, then module id', () => {
    const order: string[] = [];
    const listener = (id: string, priority: number) =>
      makeModule(id, {
        priority,
        consumes: ['clock.ticked'],
        handlers: () => ({ 'clock.ticked': () => void order.push(id) }),
      });
    const run = new Run({
      seed: 's',
      modules: [
        listener('zeta', 5),
        listener('alpha', 5),
        listener('first', 1),
        listener('last', 9),
      ],
    });
    run.advanceTurn();
    expect(order).toEqual(['first', 'alpha', 'zeta', 'last']);
  });

  it('processes events in publish order and records the causal chain', () => {
    const a = makeModule('a', {
      consumes: ['run.started'],
      emits: ['a.done'],
      handlers: () => ({ 'run.started': () => [{ type: 'a.done', payload: { n: 1 } }] }),
    });
    const b = makeModule('b', {
      consumes: ['a.done'],
      emits: ['b.done'],
      handlers: () => ({ 'a.done': () => [{ type: 'b.done', payload: {} }] }),
    });
    const run = new Run({ seed: 's', modules: [b, a] });
    run.start();
    const byType = (t: string): Envelope => run.entries.find((e) => e.type === t) as Envelope;
    expect(byType('a.done').causedBy).toBe(byType('run.started').id);
    expect(byType('b.done').causedBy).toBe(byType('a.done').id);
    expect(byType('b.done').source).toBe('b');
    const ids = run.entries.map((e) => Number(e.id.slice(1)));
    expect(ids).toEqual([...ids].sort((x, y) => x - y));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every envelope the run id, turn and event version', () => {
    const run = new Run({ seed: 's', runId: 'r1', modules: [] });
    run.runTurns(3);
    const ticks = run.entries.filter((e) => e.type === 'clock.ticked');
    expect(ticks.map((e) => e.turn)).toEqual([0, 1, 2]);
    expect(ticks.every((e) => e.runId === 'r1' && e.v === 1 && e.source === 'kernel')).toBe(true);
  });
});

describe('Run: contract enforcement', () => {
  it('rejects a module that emits an event it did not declare', () => {
    const bad = makeModule('bad', {
      consumes: ['run.started'],
      emits: [],
      handlers: () => ({ 'run.started': () => [{ type: 'sneaky.event', payload: {} }] }),
    });
    const run = new Run({ seed: 's', modules: [bad] });
    expect(() => run.start()).toThrow(ContractViolation);
  });

  it('rejects a handler for an event the manifest does not consume', () => {
    const bad = makeModule('bad', {
      consumes: [],
      handlers: () => ({ 'clock.ticked': () => undefined }),
    });
    expect(() => new Run({ seed: 's', modules: [bad] })).toThrow(ContractViolation);
  });

  it('rejects duplicate module ids and mismatched contract versions', () => {
    expect(() => new Run({ seed: 's', modules: [makeModule('x'), makeModule('x')] })).toThrow(
      /duplicate/,
    );
    const old = makeModule('old');
    old.manifest.contractsVersion = 0;
    expect(() => new Run({ seed: 's', modules: [old] })).toThrow(/contracts v0/);
  });

  it('freezes envelopes so handlers cannot corrupt the log', () => {
    const vandal = makeModule('vandal', {
      consumes: ['clock.ticked'],
      handlers: () => ({
        'clock.ticked': (e) => {
          (e.payload as { turn: number }).turn = 999;
        },
      }),
    });
    const run = new Run({ seed: 's', modules: [vandal] });
    expect(() => run.advanceTurn()).toThrow(/module vandal failed/);
    expect(
      (run.entries.find((e) => e.type === 'clock.ticked')?.payload as { turn: number }).turn,
    ).toBe(0);
  });

  it('stops a runaway event cycle instead of hanging', () => {
    const loop = makeModule('loop', {
      consumes: ['ping'],
      emits: ['ping'],
      handlers: () => ({ ping: () => [{ type: 'ping', payload: {} }] }),
    });
    const run = new Run({ seed: 's', modules: [loop] });
    run.start();
    expect(() => run.submit('ping', {})).toThrow(/message storm/);
  });

  it('only accepts plain serializable payloads', () => {
    const run = new Run({ seed: 's', modules: [] });
    run.start();
    const envelope = run.submit('x', { when: { toJSON: () => 'iso' }, gone: undefined });
    expect(envelope.payload).toEqual({ when: 'iso' });
  });
});

describe('Run: determinism', () => {
  const roller = () =>
    makeModule('roller', {
      consumes: ['clock.ticked'],
      emits: ['rolled'],
      handlers: (host) => ({
        'clock.ticked': () => [{ type: 'rolled', payload: { value: host.rng.int(1, 1_000_000) } }],
      }),
    });
  const rolls = (run: Run): unknown[] =>
    run.entries.filter((e) => e.type === 'rolled').map((e) => e.payload);

  it('same seed gives an identical log; a different seed does not', () => {
    const go = (seed: string): Run => {
      const run = new Run({ seed, modules: [roller()] });
      run.runTurns(52);
      run.end();
      return run;
    };
    expect(canonicalize(go('a').exportLog())).toBe(canonicalize(go('a').exportLog()));
    expect(rolls(go('a'))).not.toEqual(rolls(go('b')));
  });

  it('adding a module does not shuffle another module’s rolls', () => {
    const noisy = makeModule('noisy', {
      consumes: ['clock.ticked'],
      emits: ['noise'],
      handlers: (host) => ({
        'clock.ticked': () => [{ type: 'noise', payload: { v: host.rng.next() } }],
      }),
    });
    const alone = new Run({ seed: 's', modules: [roller()] });
    const together = new Run({ seed: 's', modules: [noisy, roller()] });
    alone.runTurns(20);
    together.runTurns(20);
    expect(rolls(together)).toEqual(rolls(alone));
  });

  it('records inputs with turn and phase and needs a started run', () => {
    const run = new Run({ seed: 's', modules: [] });
    expect(() => run.submit('choice.made', {})).toThrow(/not started/);
    run.start();
    run.submit('choice.made', { sceneId: 'a', choiceId: 'b' });
    run.advanceTurn((phase, r) => {
      if (phase === 'plan') r.submit('choice.made', { sceneId: 'c', choiceId: 'd' });
    });
    expect(run.inputs.map((i) => [i.turn, i.phase])).toEqual([
      [0, 'idle'],
      [0, 'plan'],
    ]);
  });

  it('cannot advance after the run ended', () => {
    const run = new Run({ seed: 's', modules: [] });
    run.end();
    expect(() => run.advanceTurn()).toThrow(/ended/);
    expect(() => run.submit('x', {})).toThrow(/ended/);
  });
});

describe('Run: modules can end the run', () => {
  const quitter = (atTurn: number) =>
    makeModule('quitter', {
      consumes: ['turn.phaseStarted', 'clock.ticked'],
      emits: ['run.endRequested'],
      handlers: (host) => ({
        'turn.phaseStarted': (e) => {
          const phase = (e.payload as { phase: string }).phase;
          return phase === 'end' && host.clock.now().turn === atTurn
            ? [{ type: 'run.endRequested', payload: { ending: 'fired', reason: 'test' } }]
            : undefined;
        },
      }),
    });

  it('finishes the turn it was asked in, then ends with the requested ending', () => {
    const run = new Run({ seed: 's', modules: [quitter(3)] });
    run.runTurns(10);
    expect(run.isEnded).toBe(true);
    expect(run.turn).toBe(4);
    const ended = run.entries.filter((e) => e.type === 'run.ended');
    expect(ended).toHaveLength(1);
    expect(ended[0]!.payload).toEqual({ turn: 4, ending: 'fired' });
    expect(run.exportLog().turns).toBe(4);
    expect(() => run.advanceTurn()).toThrow(/ended/);
  });

  it('a run nobody ends has no ending on run.ended, and end() stays idempotent', () => {
    const run = new Run({ seed: 's', modules: [] });
    run.runTurns(2);
    run.end();
    run.end();
    const ended = run.entries.filter((e) => e.type === 'run.ended');
    expect(ended).toHaveLength(1);
    expect(ended[0]!.payload).toEqual({ turn: 2 });
  });

  it('only the first request counts', () => {
    const twice = makeModule('twice', {
      consumes: ['clock.ticked'],
      emits: ['run.endRequested'],
      handlers: () => ({
        'clock.ticked': () => [
          { type: 'run.endRequested', payload: { ending: 'burnout', reason: 'a' } },
          { type: 'run.endRequested', payload: { ending: 'fired', reason: 'b' } },
        ],
      }),
    });
    const run = new Run({ seed: 's', modules: [twice] });
    run.runTurns(3);
    expect(run.entries.find((e) => e.type === 'run.ended')!.payload).toEqual({
      turn: 1,
      ending: 'burnout',
    });
  });

  it('an ended run replays identically', async () => {
    const { replay } = await import('../src');
    const run = new Run({ seed: 's', modules: [quitter(2)] });
    run.runTurns(10);
    expect(replay(run.exportLog(), [quitter(2)]).ok).toBe(true);
  });
});
