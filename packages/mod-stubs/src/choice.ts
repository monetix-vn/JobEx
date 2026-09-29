import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  CoreEventPayloads,
  EventDraft,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'stub-choice',
  version: '0.1.0',
  priority: 30,
  consumes: ['run.started', 'clock.ticked', 'director.eventFired', 'choice.made'],
  emits: ['map.loaded', 'scene.started', 'choice.resolved'],
  contractsVersion: CONTRACTS_VERSION,
};

const MAP = [
  '############',
  '#..........#',
  '#.dd....dd.#',
  '#..........#',
  '#....mm....#',
  '#..........#',
  '#.dd....dd.#',
  '######..####',
];
/** A scene left unanswered this many turns resolves as ignored. */
const PATIENCE_TURNS = 3;

/** Stand-in for narrative runtime and choice resolver, playing one demo scene template. */
export function createModule(host: ModuleHost): ModuleInstance {
  const state = { scenes: 0, pending: {} as Record<string, number> };
  return {
    handlers: {
      'run.started': () => [
        { type: 'map.loaded', payload: { width: 12, height: MAP.length, tiles: MAP } },
      ],
      'clock.ticked': (env) => {
        const { turn } = env.payload as CoreEventPayloads['clock.ticked'];
        const drafts: EventDraft[] = [];
        for (const sceneId of Object.keys(state.pending).sort()) {
          if (turn - (state.pending[sceneId] as number) >= PATIENCE_TURNS) {
            delete state.pending[sceneId];
            drafts.push({
              type: 'choice.resolved',
              payload: { sceneId, choiceId: '', outcome: 'ignored' },
            });
          }
        }
        return drafts;
      },
      'director.eventFired': () => {
        state.scenes += 1;
        const sceneId = `scene.stub_${state.scenes}`;
        state.pending[sceneId] = host.clock.now().turn;
        return [
          {
            type: 'scene.started',
            payload: {
              sceneId,
              location: 'loc.meeting_room',
              lines: [
                { speaker: 'Boss', text: 'The buyer wants the shipment moved up by a week.' },
                { speaker: 'Boss', text: 'Can your team make it work?' },
              ],
              choices: [
                { id: 'a', label: 'Commit and push the team' },
                { id: 'b', label: 'Ask for more time' },
              ],
            },
          },
        ];
      },
      'choice.made': (env) => {
        const { sceneId, choiceId } = env.payload as CoreEventPayloads['choice.made'];
        if (!(sceneId in state.pending)) return;
        delete state.pending[sceneId];
        const outcome = host.rng.chance(choiceId === 'a' ? 0.7 : 0.4) ? 'ok' : 'fail';
        return [{ type: 'choice.resolved', payload: { sceneId, choiceId, outcome } }];
      },
    },
    snapshot: () => ({ scenes: state.scenes, pending: { ...state.pending } }),
  };
}

export const choiceModule: Module = { manifest, createModule };
