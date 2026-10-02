import type {
  ClockSnapshot,
  CoreEventPayloads,
  Envelope,
  PerceptionUpdatedPayload,
  QuirkNoticedPayload,
  SceneTerm,
  StateValue,
} from '@je/contracts';
import type { Impression } from './impressions';

export interface ClientScene {
  sceneId: string;
  location: string;
  lines: CoreEventPayloads['scene.started']['lines'];
  choices: CoreEventPayloads['scene.started']['choices'];
  /** Set once the scene has been resolved (or ignored). */
  outcome?: CoreEventPayloads['choice.resolved']['outcome'];
  chosen?: string;
  /** Resolved narration text, shown once the scene has ended. */
  narration?: string;
  /** Glossary words in this scene, tappable, with their definitions. */
  terms?: SceneTerm[];
  /** Narration of the scene just before this one, so the outcome stays readable. */
  previousNarration?: string;
}

export interface ClientState {
  clock?: ClockSnapshot;
  map?: CoreEventPayloads['map.loaded'];
  scene?: ClientScene;
  /** Mirror of sim-core's variables, for the status strip. */
  vars: Record<string, StateValue>;
  /** The end-of-run review, once the run has ended. */
  debrief?: CoreEventPayloads['debrief.ready'];
  ended: boolean;
  /** People met so far (in the order met), and how they feel about the player. */
  cast: CastMember[];
  feelings: Record<string, { trust: number; loyalty: number; owed: number }>;
  /** What the player believes about each guest (by person id): traits learned over time, never the true numbers. */
  impressions: Record<string, Impression>;
}

export interface CastMember {
  character: string;
  name: string;
  title: string;
  /** A person drawn from the world: `character` is their person id. */
  guest?: boolean;
}

export const initialState: ClientState = {
  ended: false,
  vars: {},
  cast: [],
  feelings: {},
  impressions: {},
};

/** Pure reducer: the client's view is derived entirely from bus messages. */
export function reduce(state: ClientState, envelope: Envelope): ClientState {
  switch (envelope.type) {
    case 'clock.ticked':
      return { ...state, clock: envelope.payload as ClockSnapshot };
    case 'map.loaded':
      return { ...state, map: envelope.payload as CoreEventPayloads['map.loaded'] };
    case 'scene.started': {
      const p = envelope.payload as CoreEventPayloads['scene.started'];
      const known = new Map(state.cast.map((m) => [m.character, m]));
      // Names come in the player's language each time, so a later scene refreshes them.
      for (const person of p.people ?? []) known.set(person.character, person);
      return {
        ...state,
        cast: [...known.values()],
        scene: {
          sceneId: p.sceneId,
          location: p.location,
          lines: p.lines,
          choices: p.choices,
          ...(p.terms && p.terms.length > 0 ? { terms: p.terms } : {}),
          ...(state.scene?.narration ? { previousNarration: state.scene.narration } : {}),
        },
      };
    }
    case 'choice.resolved': {
      const p = envelope.payload as CoreEventPayloads['choice.resolved'];
      if (state.scene?.sceneId !== p.sceneId) return state;
      return { ...state, scene: { ...state.scene, outcome: p.outcome, chosen: p.choiceId } };
    }
    case 'sim.stateChanged': {
      const p = envelope.payload as CoreEventPayloads['sim.stateChanged'];
      return { ...state, vars: p.full ? { ...p.vars } : { ...state.vars, ...p.vars } };
    }
    case 'scene.ended': {
      const p = envelope.payload as CoreEventPayloads['scene.ended'];
      if (state.scene?.sceneId !== p.sceneId || p.narration === undefined) return state;
      return { ...state, scene: { ...state.scene, narration: p.narration } };
    }
    case 'relationship.changed': {
      const p = envelope.payload as CoreEventPayloads['relationship.changed'];
      const now = state.feelings[p.character] ?? { trust: 0, loyalty: 0, owed: 0 };
      return {
        ...state,
        feelings: { ...state.feelings, [p.character]: { ...now, [p.dimension]: p.to } },
      };
    }
    case 'perception.updated': {
      const p = envelope.payload as PerceptionUpdatedPayload;
      const now = state.impressions[p.person_id] ?? { axes: {}, quirks: [] };
      return {
        ...state,
        impressions: {
          ...state.impressions,
          [p.person_id]: {
            ...now,
            axes: { ...now.axes, [p.axis]: { estimate: p.estimate, confidence: p.confidence } },
          },
        },
      };
    }
    case 'perception.quirkNoticed': {
      const p = envelope.payload as QuirkNoticedPayload;
      const now = state.impressions[p.person_id] ?? { axes: {}, quirks: [] };
      const name = p.name ?? { en: p.quirk, vi: p.quirk };
      return {
        ...state,
        impressions: {
          ...state.impressions,
          [p.person_id]: { ...now, quirks: [...now.quirks, name] },
        },
      };
    }
    case 'debrief.ready':
      return { ...state, debrief: envelope.payload as CoreEventPayloads['debrief.ready'] };
    case 'run.ended':
      return { ...state, ended: true };
    default:
      return state;
  }
}
