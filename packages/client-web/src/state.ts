import type {
  ClockSnapshot,
  CoreEventPayloads,
  Envelope,
  PerceptionUpdatedPayload,
  PersonLook,
  PersonActedPayload,
  PersonAction,
  QuirkNoticedPayload,
  SceneTerm,
  StateValue,
} from '@je/contracts';
import type { Impression } from './impressions';

/** One number that moved because of a choice (path as in the simulation, or "hours" for time spent). */
export interface Change {
  path: string;
  delta: number;
}

const TRACKED = (path: string): boolean =>
  path === 'player.stress' ||
  path === 'player.energy' ||
  path === 'player.health' ||
  path === 'player.cash_vnd' ||
  path === 'profile.money_pressure' ||
  path.startsWith('player.rep.');

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
  /** Named people in the scene, with how to draw them. */
  people?: CoreEventPayloads['scene.started']['people'];
  /** Narration of the scene just before this one, so the outcome stays readable. */
  previousNarration?: string;
  /** What the choice changed, shown with the outcome. */
  changes?: Change[];
  /** What the previous scene's choice changed, shown with its narration. */
  previousChanges?: Change[];
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
  /** What a guest has visibly done about the player (vouched, ran them down), latest last, by person id. */
  acted: Record<string, PersonAction[]>;
  /** True from a choice being resolved until its scene ends: number changes in this window belong to the choice. */
  collecting: boolean;
  changes: Change[];
  /** Paths that just changed, so the screen can flash them once. */
  flash: string[];
}

export interface CastMember {
  character: string;
  name: string;
  title: string;
  /** A person drawn from the world: `character` is their person id. */
  guest?: boolean;
  /** How to draw them. */
  look?: PersonLook;
}

export const initialState: ClientState = {
  ended: false,
  vars: {},
  cast: [],
  feelings: {},
  impressions: {},
  acted: {},
  collecting: false,
  changes: [],
  flash: [],
};

/** Pure reducer: the client's view is derived entirely from bus messages. */
export function reduce(state: ClientState, envelope: Envelope): ClientState {
  switch (envelope.type) {
    case 'clock.ticked':
      return {
        ...state,
        clock: envelope.payload as ClockSnapshot,
        collecting: false,
        ...(state.flash.length > 0 ? { flash: [] } : {}),
      };
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
        collecting: false,
        changes: [],
        ...(state.flash.length > 0 ? { flash: [] } : {}),
        scene: {
          sceneId: p.sceneId,
          location: p.location,
          lines: p.lines,
          choices: p.choices,
          ...(p.terms && p.terms.length > 0 ? { terms: p.terms } : {}),
          ...(p.people && p.people.length > 0 ? { people: p.people } : {}),
          ...(state.scene?.narration ? { previousNarration: state.scene.narration } : {}),
          ...(state.scene?.narration && state.scene.changes && state.scene.changes.length > 0
            ? { previousChanges: state.scene.changes }
            : {}),
        },
      };
    }
    case 'choice.resolved': {
      const p = envelope.payload as CoreEventPayloads['choice.resolved'];
      if (state.scene?.sceneId !== p.sceneId) return state;
      const hours = p.cost?.hours ?? 0;
      return {
        ...state,
        collecting: true,
        changes: hours > 0 ? [{ path: 'hours', delta: hours }] : [],
        scene: { ...state.scene, outcome: p.outcome, chosen: p.choiceId },
      };
    }
    case 'sim.stateChanged': {
      const p = envelope.payload as CoreEventPayloads['sim.stateChanged'];
      const vars = p.full ? { ...p.vars } : { ...state.vars, ...p.vars };
      if (p.full) return { ...state, vars };
      // What moved: only numbers worth showing, and only against a value we already had.
      const moved: Change[] = [];
      for (const [path, value] of Object.entries(p.vars)) {
        const before = state.vars[path];
        if (
          TRACKED(path) &&
          typeof value === 'number' &&
          typeof before === 'number' &&
          value !== before
        )
          moved.push({ path, delta: value - before });
      }
      if (moved.length === 0) return { ...state, vars };
      const changes = state.collecting
        ? [
            ...state.changes.filter((c) => !moved.some((m) => m.path === c.path)),
            ...moved.map((m) => ({
              ...m,
              delta: m.delta + (state.changes.find((c) => c.path === m.path)?.delta ?? 0),
            })),
          ].filter((c) => c.delta !== 0)
        : state.changes;
      return {
        ...state,
        vars,
        changes,
        flash: moved.map((m) => m.path),
        ...(state.collecting && state.scene ? { scene: { ...state.scene, changes } } : {}),
      };
    }
    case 'scene.ended': {
      const p = envelope.payload as CoreEventPayloads['scene.ended'];
      // Numbers settle just after the scene ends, so the window for "what this choice changed" stays open
      // until the next scene or the next week.
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
    case 'person.acted': {
      const p = envelope.payload as PersonActedPayload;
      if (!p.visible) return state;
      return {
        ...state,
        acted: { ...state.acted, [p.person_id]: [...(state.acted[p.person_id] ?? []), p.action] },
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
