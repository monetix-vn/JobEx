import { describe, expect, it } from 'vitest';
import type { ModuleHost } from '@je/contracts';
import { Run, assertFixture, runFixture } from '@je/kernel';
import { choiceModule, directorModule, economyModule, stubModules } from '../src';

const CLOCK = { now: () => ({ turn: 0, year: 0, week_of_year: 0, month_of_year: 1, quarter: 1 }) };

function fakeHost(chance: () => boolean): ModuleHost {
  return {
    moduleId: 'fake',
    rng: { next: () => 0, int: (a) => a, chance, pick: (x) => x[0]!, state: () => 0 },
    clock: CLOCK,
    ports: {} as never,
    config: undefined,
  };
}

describe('stub module fixtures (given events, expect events)', () => {
  it('economy settles the week when the resolve phase starts, and only then', () => {
    assertFixture(economyModule, {
      turn: 3,
      given: [{ type: 'turn.phaseStarted', payload: { phase: 'plan' } }],
      expect: [],
    });
    assertFixture(economyModule, {
      turn: 3,
      given: [{ type: 'turn.phaseStarted', payload: { phase: 'resolve' } }],
      expect: [{ type: 'sim.weekSettled', payload: { turn: 3, cash: 1000, stress: 20 } }],
    });
  });

  it('choice module turns a fired event into a scene, and an answer into one outcome', () => {
    const emitted = runFixture(choiceModule, {
      given: [
        { type: 'director.eventFired', payload: { eventId: 'event.stub_1', tags: [] } },
        { type: 'choice.made', payload: { sceneId: 'scene.stub_1', choiceId: 'a' } },
        { type: 'choice.made', payload: { sceneId: 'scene.stub_1', choiceId: 'a' } },
        { type: 'choice.made', payload: { sceneId: 'scene.unknown', choiceId: 'a' } },
      ],
      expect: [],
    });
    expect(emitted.map((e) => e.type)).toEqual(['scene.started', 'choice.resolved']);
    expect((emitted[1]!.payload as { sceneId: string }).sceneId).toBe('scene.stub_1');
  });

  it('director stays quiet while cooling down after an event', () => {
    let rolls = 0;
    const instance = directorModule.createModule(fakeHost(() => (rolls++, true)));
    const settle = () =>
      instance.handlers['sim.weekSettled']!({
        id: 'e',
        type: 'sim.weekSettled',
        v: 1,
        runId: 'r',
        turn: 0,
        source: 'stub-economy',
        payload: { turn: 0, cash: 0, stress: 0 },
      });
    expect(settle()).toHaveLength(1);
    expect(settle()).toBeUndefined();
    expect(settle()).toBeUndefined();
    expect(settle()).toHaveLength(1);
    expect(rolls).toBe(2);
  });
});

describe('stub set in a full run', () => {
  it('plays a year: events fire, scenes appear, unanswered scenes expire as ignored', () => {
    const run = new Run({ seed: 'stubs', modules: stubModules });
    run.start();
    run.runTurns(52);
    run.end();
    const of = (t: string) => run.entries.filter((e) => e.type === t);
    expect(of('clock.ticked')).toHaveLength(52);
    expect(of('sim.weekSettled')).toHaveLength(52);
    expect(of('director.eventFired').length).toBeGreaterThan(3);
    expect(of('scene.started')).toHaveLength(of('director.eventFired').length);
    expect(of('choice.resolved').length).toBeGreaterThan(0);
    expect(
      of('choice.resolved').every((e) => (e.payload as { outcome: string }).outcome === 'ignored'),
    ).toBe(true);
    expect(of('map.loaded')).toHaveLength(1);
  });
});
