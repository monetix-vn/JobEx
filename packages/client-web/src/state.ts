import type { ClockSnapshot, CoreEventPayloads, Envelope } from '@je/contracts';

export interface ClientScene {
  sceneId: string;
  location: string;
  lines: CoreEventPayloads['scene.started']['lines'];
  choices: CoreEventPayloads['scene.started']['choices'];
  /** Set once the scene has been resolved (or ignored). */
  outcome?: CoreEventPayloads['choice.resolved']['outcome'];
  chosen?: string;
}

export interface ClientState {
  clock?: ClockSnapshot;
  map?: CoreEventPayloads['map.loaded'];
  scene?: ClientScene;
  ended: boolean;
}

export const initialState: ClientState = { ended: false };

/** Pure reducer: the client's view is derived entirely from bus messages. */
export function reduce(state: ClientState, envelope: Envelope): ClientState {
  switch (envelope.type) {
    case 'clock.ticked':
      return { ...state, clock: envelope.payload as ClockSnapshot };
    case 'map.loaded':
      return { ...state, map: envelope.payload as CoreEventPayloads['map.loaded'] };
    case 'scene.started': {
      const p = envelope.payload as CoreEventPayloads['scene.started'];
      return {
        ...state,
        scene: { sceneId: p.sceneId, location: p.location, lines: p.lines, choices: p.choices },
      };
    }
    case 'choice.resolved': {
      const p = envelope.payload as CoreEventPayloads['choice.resolved'];
      if (state.scene?.sceneId !== p.sceneId) return state;
      return { ...state, scene: { ...state.scene, outcome: p.outcome, chosen: p.choiceId } };
    }
    case 'run.ended':
      return { ...state, ended: true };
    default:
      return state;
  }
}
