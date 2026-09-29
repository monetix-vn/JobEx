import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  Effect,
  EventDraft,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';
import { ExpressionError, VarStore, evaluate } from '@je/rules';

export const manifest: ModuleManifest = {
  id: 'choice',
  version: '0.1.0',
  priority: 30,
  consumes: ['sim.stateChanged', 'scene.started', 'scene.expired', 'choice.made'],
  emits: ['sim.applyDelta', 'choice.resolved', 'choice.rejected'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface ChoiceConfig {
  content: ContentView;
}

/** Id of the synthetic choice offered when a scene has no choices of its own. */
export const CONTINUE_CHOICE = '__continue';

/**
 * Outcome tables, skill checks and costs. The authority on whether a choice can be made: it checks
 * the requirement and the energy cost against the state mirror, rolls the outcome from its own RNG
 * stream, applies numeric deltas through sim-core, and reports the rest (schedule, fact effects)
 * in `choice.resolved` for the modules that own them.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<ChoiceConfig> | undefined;
  if (!config?.content) throw new Error('mod-choice needs config.content');
  const { content } = config;

  const world = new VarStore();
  const open = new Set<string>();

  const reject = (
    sceneId: string,
    choiceId: string,
    reason: CoreEventPayloads['choice.rejected']['reason'],
  ): EventDraft[] => [{ type: 'choice.rejected', payload: { sceneId, choiceId, reason } }];

  return {
    handlers: {
      'sim.stateChanged': (env) => {
        world.apply(env.payload as CoreEventPayloads['sim.stateChanged']);
      },

      'scene.started': (env) => {
        open.add((env.payload as CoreEventPayloads['scene.started']).sceneId);
      },

      'scene.expired': (env) => {
        const { sceneId } = env.payload as CoreEventPayloads['scene.expired'];
        if (!open.delete(sceneId)) return;
        return [
          { type: 'choice.resolved', payload: { sceneId, choiceId: '', outcome: 'ignored' } },
        ];
      },

      'choice.made': (env) => {
        const { sceneId, choiceId } = env.payload as CoreEventPayloads['choice.made'];
        if (!open.has(sceneId)) return reject(sceneId, choiceId, 'not_open');
        const scene = content.get('scene', sceneId);
        const choices = scene?.choices ?? [];

        if (choices.length === 0) {
          if (choiceId !== CONTINUE_CHOICE) return reject(sceneId, choiceId, 'unknown_choice');
          open.delete(sceneId);
          return [{ type: 'choice.resolved', payload: { sceneId, choiceId, outcome: 'ok' } }];
        }

        const choice = choices.find((c) => c.id === choiceId);
        if (!choice) return reject(sceneId, choiceId, 'unknown_choice');

        if (choice.requires !== undefined) {
          try {
            if (evaluate(choice.requires, world.scope) !== true)
              return reject(sceneId, choiceId, 'requirement');
          } catch (error) {
            if (error instanceof ExpressionError) return reject(sceneId, choiceId, 'requirement');
            throw error;
          }
        }
        const energyCost = choice.cost?.energy ?? 0;
        if (energyCost > world.number('player.energy')) return reject(sceneId, choiceId, 'cost');

        // Roll the outcome table with this module's own stream.
        const roll = host.rng.next();
        let cumulative = 0;
        let picked = choice.outcomes[choice.outcomes.length - 1]!;
        for (const outcome of choice.outcomes) {
          cumulative += outcome.p;
          if (roll < cumulative) {
            picked = outcome;
            break;
          }
        }

        open.delete(sceneId);
        const reason = `${sceneId}/${choiceId}`;
        const drafts: EventDraft[] = [];
        if (energyCost > 0) {
          drafts.push({
            type: 'sim.applyDelta',
            payload: { path: 'player.energy', value: -energyCost, reason },
          });
        }
        const deferred: Effect[] = [];
        for (const effect of picked.effects ?? []) {
          if ('delta' in effect) {
            drafts.push({
              type: 'sim.applyDelta',
              payload: { path: effect.delta, value: effect.value, reason },
            });
          } else {
            deferred.push(effect);
          }
        }
        drafts.push({
          type: 'choice.resolved',
          payload: {
            sceneId,
            choiceId,
            outcome: picked.result ?? 'ok',
            narrationKey: picked.narration_key,
            ...(choice.cost ? { cost: choice.cost } : {}),
            ...(deferred.length > 0 ? { effects: deferred } : {}),
          },
        });
        return drafts;
      },
    },
    snapshot: () => ({ open: [...open].sort() }),
  };
}

export const choiceModule: Module = { manifest, createModule };
