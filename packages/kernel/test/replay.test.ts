import { describe, expect, it } from 'vitest';
import type { Module, ReplayLog } from '@je/contracts';
import { Run, assertFixture, canonicalize, fingerprint, replay, runFixture } from '../src';
import { makeModule } from './helpers';

/** A tiny game: a coin flip each week, and the player can bet, which changes a counter. */
function coinGame(): Module {
  return makeModule('coin', {
    consumes: ['clock.ticked', 'bet.placed'],
    emits: ['coin.flipped', 'bet.settled'],
    handlers: (host) => {
      let heads = 0;
      return {
        'clock.ticked': () => {
          const head = host.rng.chance(0.5);
          if (head) heads += 1;
          return [{ type: 'coin.flipped', payload: { head, heads } }];
        },
        'bet.placed': (e) => [
          {
            type: 'bet.settled',
            payload: { won: host.rng.chance(0.5), stake: (e.payload as { stake: number }).stake },
          },
        ],
      };
    },
    snapshot: () => ({ ok: true }),
  });
}

function recordedRun(): ReplayLog {
  const run = new Run({ seed: 'replay-me', modules: [coinGame()] });
  run.start();
  run.submit('bet.placed', { stake: 1 });
  run.runTurns(30, (phase, r) => {
    if (phase === 'resolve' && r.turn % 7 === 3) r.submit('bet.placed', { stake: r.turn });
  });
  run.submit('bet.placed', { stake: 99 });
  run.end();
  return run.exportLog();
}

describe('replay', () => {
  it('reproduces a run with player inputs exactly', () => {
    const log = recordedRun();
    expect(log.inputs.length).toBeGreaterThan(3);
    const result = replay(log, [coinGame()]);
    expect(result.ok).toBe(true);
    expect(canonicalize(result.log)).toBe(canonicalize(log));
  });

  it('survives a JSON round trip (saving the log to disk)', () => {
    const log = recordedRun();
    const loaded = JSON.parse(JSON.stringify(log)) as ReplayLog;
    expect(replay(loaded, [coinGame()]).ok).toBe(true);
  });

  it('detects a tampered message and reports where', () => {
    const log = JSON.parse(JSON.stringify(recordedRun())) as ReplayLog;
    const index = log.entries.findIndex((e) => e.type === 'coin.flipped');
    (log.entries[index]!.payload as { head: boolean }).head = !(
      log.entries[index]!.payload as { head: boolean }
    ).head;
    const result = replay(log, [coinGame()]);
    expect(result.ok).toBe(false);
    expect(result.firstMismatch).toBe(index);
  });

  it('detects a changed input', () => {
    const log = JSON.parse(JSON.stringify(recordedRun())) as ReplayLog;
    (log.inputs[0]!.payload as { stake: number }).stake = 500;
    expect(replay(log, [coinGame()]).ok).toBe(false);
  });

  it('refuses a different module set or version', () => {
    const log = recordedRun();
    expect(replay(log, []).reason).toMatch(/module set differs/);
    const newer = coinGame();
    newer.manifest.version = '2.0.0';
    expect(replay(log, [newer]).ok).toBe(false);
  });

  it('fingerprints are stable and sensitive', () => {
    const a = canonicalize(recordedRun());
    expect(fingerprint(a)).toBe(fingerprint(canonicalize(recordedRun())));
    expect(fingerprint(a)).not.toBe(fingerprint(a + ' '));
  });
});

describe('fixtures', () => {
  const echo = makeModule('echo', {
    consumes: ['clock.ticked'],
    emits: ['echo.said'],
    handlers: () => ({
      'clock.ticked': (e) => [
        { type: 'echo.said', payload: { turn: (e.payload as { turn: number }).turn } },
      ],
    }),
  });

  it('runs a module alone: given these events, expect these events', () => {
    assertFixture(echo, {
      turn: 4,
      given: [
        { type: 'clock.ticked', payload: { turn: 4 } },
        { type: 'unrelated', payload: {} },
      ],
      expect: [{ type: 'echo.said', payload: { turn: 4 } }],
    });
  });

  it('fails with a readable message on mismatch', () => {
    expect(() =>
      assertFixture(echo, {
        name: 'x',
        given: [{ type: 'clock.ticked', payload: { turn: 1 } }],
        expect: [],
      }),
    ).toThrow(/fixture x failed/);
  });

  it('rejects emitting an undeclared event', () => {
    const bad = makeModule('bad', {
      consumes: ['a'],
      handlers: () => ({ a: () => [{ type: 'oops', payload: {} }] }),
    });
    expect(() => runFixture(bad, { given: [{ type: 'a', payload: {} }], expect: [] })).toThrow(
      /undeclared/,
    );
  });
});
