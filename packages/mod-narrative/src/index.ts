import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  EventDraft,
  GuestAppearedPayload,
  GuestPort,
  Locale,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  Person,
  PersonActedPayload,
  Scene,
} from '@je/contracts';
import { PERCEPTION_EVENTS, PERSON_ACTED } from '@je/contracts';
import { ExpressionError, VarStore, evaluate } from '@je/rules';

export const manifest: ModuleManifest = {
  id: 'narrative',
  version: '0.1.0',
  priority: 40,
  consumes: [
    'sim.stateChanged',
    'clock.ticked',
    'turn.phaseStarted',
    'director.eventFired',
    'fact.learned',
    'fact.escalated',
    'risk.auditStarted',
    'risk.detected',
    'risk.scapegoated',
    'choice.resolved',
    PERSON_ACTED,
  ],
  emits: ['scene.started', 'scene.ended', 'scene.expired', PERCEPTION_EVENTS.guestAppeared],
  contractsVersion: CONTRACTS_VERSION,
};

export interface NarrativeConfig {
  content: ContentView;
  locale?: Locale;
  /** Scenes to start at the plan phase of a given turn, e.g. { "0": ["scene.a", "scene.b"] }. */
  script?: Record<string, string[]>;
  /** A scene left unanswered this many turns expires as ignored. */
  patienceTurns?: number;
  /** Supplies the people who step into scenes that name guests. Without it, a guest is "someone from the team". */
  guests?: GuestPort;
}

/** How a colleague is named in text: the given name, or the full name (family, middle, given) when asked. */
export function guestNames(person: Person): { short: string; full: string } {
  const n = person.origin.name;
  return { short: n.given, full: [n.family, n.middle, n.given].filter(Boolean).join(' ') };
}

const CONTINUE_CHOICE = '__continue';

/**
 * Plays scenes: one at a time, the rest queue. Scenes start from a turn script or when the director
 * fires an event that names one. Text is resolved here (locale lookup), so the client only draws.
 * The scene ends when its choice resolves; the resolved narration is shown with `scene.ended`.
 * When word about something the player did starts going round (a fact becomes a rumor or public),
 * it also plays a short notice scene, so the player sees the consequence arrive.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<NarrativeConfig> | undefined;
  if (!config?.content) throw new Error('mod-narrative needs config.content');
  const { content } = config;
  const locale = config.locale ?? 'en';
  const script = config.script ?? {};
  const patience = config.patienceTurns ?? 1;

  const world = new VarStore();
  const state = {
    queue: [] as string[],
    active: null as {
      sceneId: string;
      startedTurn: number;
      /** Names of the scene's guests by slot, to fill `{slot}` and `{slot.full}` in its text. */
      guests: Record<string, { short: string; full: string }>;
    } | null,
  };
  /** Text of notice scenes waiting in the queue, by their synthetic scene id. */
  const notices = new Map<string, string>();

  const text = (key: string): string => content.text(locale, key) ?? `[${key}]`;
  const fill = (line: string, guests: Record<string, { short: string; full: string }>): string =>
    line.replace(/{([a-z][a-z0-9_]*)(.full)?}/g, (whole, slot: string, full?: string) => {
      const guest = guests[slot];
      return guest ? (full ? guest.full : guest.short) : whole;
    });
  const speakerName = (
    speaker: string,
    guests: Record<string, { short: string; full: string }> = {},
  ): string => {
    if (speaker.startsWith('guest:')) return guests[speaker.slice('guest:'.length)]?.full ?? '';
    if (speaker.startsWith('char:')) {
      const person = content.get('character', `char.${speaker.slice('char:'.length)}`);
      return (person && content.text(locale, person.name_key)) ?? speaker.slice('char:'.length);
    }
    const name = speaker.replace(/^role:/, '');
    return content.text(locale, `speaker.${name}`) ?? name;
  };

  const available = (scene: Scene, choiceIndex: number): boolean => {
    const requires = scene.choices?.[choiceIndex]?.requires;
    if (requires === undefined) return true;
    try {
      return evaluate(requires, world.scope) === true;
    } catch (error) {
      if (error instanceof ExpressionError) return false;
      throw error;
    }
  };

  let noticeCount = 0;
  /** Queues a one-line notice scene and starts it if nothing else is on screen. */
  const queueNotice = (sceneId: string, line: string): EventDraft[] => {
    notices.set(sceneId, line);
    state.queue.push(sceneId);
    return startNext();
  };

  const notice = (factId: string, visibility: 'rumor' | 'public'): EventDraft[] => {
    const fact = content.get('fact', factId);
    if (!fact) return [];
    const line = text(`ui.notice.${visibility}`).replace('{fact}', text(fact.text_key));
    return queueNotice(`notice.${factId}.${visibility}`, line);
  };

  const riskNotice = (
    kind: string,
    template: string,
    values: Record<string, string>,
  ): EventDraft[] => {
    noticeCount += 1;
    const line = text(template).replace(
      /\{(\w+)\}/g,
      (whole, name: string) => values[name] ?? whole,
    );
    return queueNotice(`notice.risk.${kind}.${noticeCount}`, line);
  };

  const startNext = (): EventDraft[] => {
    if (state.active) return [];
    const entry = state.queue.shift();
    if (entry === undefined) return [];
    // A scene someone asked for is queued as "scene@person", so the right person takes the first guest slot.
    const [sceneId, actor] = entry.split('@') as [string, string | undefined];
    const noticeText = notices.get(sceneId);
    if (noticeText !== undefined) {
      notices.delete(sceneId);
      state.active = { sceneId, startedTurn: host.clock.now().turn, guests: {} };
      return [
        {
          type: 'scene.started',
          payload: {
            sceneId,
            location: 'loc.notice',
            lines: [{ speaker: '', text: noticeText }],
            choices: [{ id: CONTINUE_CHOICE, label: text('ui.continue') }],
          },
        },
      ];
    }
    const scene = content.get('scene', sceneId);
    if (!scene) throw new Error(`mod-narrative: unknown scene "${sceneId}"`);
    const turn = host.clock.now().turn;
    const drafts: EventDraft[] = [];
    const guestNamesBySlot: Record<string, { short: string; full: string }> = {};
    const guestPeople: { character: string; name: string; title: string; guest: true }[] = [];
    let preferred = actor;
    for (const guest of scene.guests ?? []) {
      if (!config.guests) {
        const someone = text('ui.guest.someone');
        guestNamesBySlot[guest.slot] = { short: someone, full: someone };
        continue;
      }
      const person = config.guests.appear({
        sceneId,
        slot: guest.slot,
        story_function: guest.story_function,
        ...(guest.department ? { department: guest.department } : {}),
        ...(preferred ? { preferred } : {}),
        turn,
      });
      preferred = undefined;
      guestNamesBySlot[guest.slot] = guestNames(person);
      const department = person.life.department;
      guestPeople.push({
        character: person.id,
        name: guestNamesBySlot[guest.slot]!.full,
        title: content.text(locale, `dept.${department}.title`) ?? department.replace(/_/g, ' '),
        guest: true,
      });
      drafts.push({
        type: PERCEPTION_EVENTS.guestAppeared,
        payload: {
          sceneId,
          slot: guest.slot,
          story_function: guest.story_function,
          person,
        } satisfies GuestAppearedPayload,
      });
    }
    state.active = { sceneId, startedTurn: turn, guests: guestNamesBySlot };
    const glossary = (scene.terms ?? []).flatMap((id) => {
      const term = content.get('term', id);
      return term ? [{ id, term: text(term.term_key), definition: text(term.definition_key) }] : [];
    });
    const named = [
      ...new Set([...(scene.cast ?? []), ...scene.lines.map((l) => l.speaker)]),
    ].flatMap((who) => {
      if (!who.startsWith('char:')) return [];
      const id = `char.${who.slice('char:'.length)}`;
      const person = content.get('character', id);
      return person
        ? [{ character: id, name: text(person.name_key), title: text(person.title_key) }]
        : [];
    });
    if (config.guests) {
      for (const who of named) {
        const character = content.get('character', who.character)!;
        const person = config.guests.character({
          characterId: who.character,
          department: character.department,
          ...(character.traits ? { traits: character.traits } : {}),
          turn,
        });
        drafts.push({
          type: PERCEPTION_EVENTS.guestAppeared,
          payload: {
            sceneId,
            slot: who.character,
            story_function: 'colleague',
            person,
            display_name: who.name,
          } satisfies GuestAppearedPayload,
        });
      }
    }
    const people = [
      ...named.map((n) => (config.guests ? { ...n, guest: true as const } : n)),
      ...guestPeople,
    ];
    const choices =
      scene.choices && scene.choices.length > 0
        ? scene.choices.map((c, i) => ({
            id: c.id,
            label: fill(text(c.text_key), guestNamesBySlot),
            disabled: !available(scene, i),
          }))
        : [{ id: CONTINUE_CHOICE, label: text('ui.continue') }];
    return [
      ...drafts,
      {
        type: 'scene.started',
        payload: {
          sceneId,
          location: scene.location,
          lines: scene.lines.map((l) => ({
            speaker: speakerName(l.speaker, guestNamesBySlot),
            text: fill(text(l.text_key), guestNamesBySlot),
          })),
          choices,
          ...(glossary.length > 0 ? { terms: glossary } : {}),
          ...(people.length > 0 ? { people } : {}),
        },
      },
    ];
  };

  return {
    handlers: {
      'sim.stateChanged': (env) => {
        world.apply(env.payload as CoreEventPayloads['sim.stateChanged']);
      },

      'clock.ticked': (env) => {
        const { turn } = env.payload as CoreEventPayloads['clock.ticked'];
        const active = state.active;
        if (active && turn - active.startedTurn >= patience) {
          return [{ type: 'scene.expired', payload: { sceneId: active.sceneId } }];
        }
      },

      'turn.phaseStarted': (env) => {
        const { phase } = env.payload as CoreEventPayloads['turn.phaseStarted'];
        if (phase !== 'plan') return;
        state.queue.push(...(script[String(host.clock.now().turn)] ?? []));
        return startNext();
      },

      'director.eventFired': (env) => {
        const { eventId, person_id } = env.payload as CoreEventPayloads['director.eventFired'];
        const event = content.get('event', eventId);
        if (!event) return;
        state.queue.push(person_id ? `${event.scene}@${person_id}` : event.scene);
        return startNext();
      },

      'fact.learned': (env) => {
        const p = env.payload as CoreEventPayloads['fact.learned'];
        return p.visibility === 'public' ? notice(p.factId, 'public') : undefined;
      },

      'fact.escalated': (env) => {
        const p = env.payload as CoreEventPayloads['fact.escalated'];
        return p.to === 'rumor' || p.to === 'public' ? notice(p.factId, p.to) : undefined;
      },

      [PERSON_ACTED]: (env) => {
        const p = env.payload as PersonActedPayload;
        if (!p.visible) return;
        return riskNotice(p.action, `ui.notice.acted.${p.action}`, { name: p.name });
      },

      'risk.auditStarted': () => riskNotice('audit', 'ui.notice.audit', {}),

      'risk.detected': (env) => {
        const p = env.payload as CoreEventPayloads['risk.detected'];
        const fact = content.get('fact', p.factId);
        if (!fact) return;
        return riskNotice('detected', 'ui.notice.detected', {
          detector: text(`detector.${p.detector}`),
          fact: text(fact.text_key),
        });
      },

      'risk.scapegoated': (env) => {
        const p = env.payload as CoreEventPayloads['risk.scapegoated'];
        const fact = content.get('fact', p.factId);
        if (!fact) return;
        return riskNotice('scapegoat', 'ui.notice.scapegoat', { fact: text(fact.text_key) });
      },

      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        if (state.active?.sceneId !== p.sceneId) return;
        const guests = state.active.guests;
        state.active = null;
        return [
          {
            type: 'scene.ended',
            payload: {
              sceneId: p.sceneId,
              ...(p.narrationKey ? { narration: fill(text(p.narrationKey), guests) } : {}),
            },
          },
          ...startNext(),
        ];
      },
    },
    snapshot: () => ({
      queue: [...state.queue],
      active: state.active ? { ...state.active } : null,
    }),
  };
}

export const narrativeModule: Module = { manifest, createModule };
