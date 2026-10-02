import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  BlockedReason,
  ContentView,
  PersonLook,
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
import { VOICE_REGISTERS, registerOf, type VoiceRegister } from '@je/contracts';
import { addressOf, capitalise, startsSentence, type Viewer } from './address';

export { addressOf, type Address, type Viewer } from './address';

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
  /** The player's age and gender, for forms of address (Vietnamese "anh", "chị", "em"...). */
  viewer?: Viewer;
}

/** How to draw a person: appearance traits only. */
export function lookOf(person: Person): PersonLook | undefined {
  const a = person.appearance;
  return a
    ? {
        skin_tone: a.skin_tone,
        hair_style: a.hair_style,
        hair_colour: a.hair_colour,
        facial_hair: a.facial_hair,
        glasses: a.glasses,
        build: a.build,
      }
    : undefined;
}

/** How a colleague is named in text, and how they and the player address each other. */
export interface GuestNames {
  short: string;
  full: string;
  call: string;
  self: string;
  you: string;
  register?: VoiceRegister;
}

export function guestNames(person: Person, viewer?: Viewer, locale: Locale = 'en'): GuestNames {
  const n = person.origin.name;
  const register = registerOf(person.origin.voice ?? []);
  return {
    short: n.given,
    full: [n.family, n.middle, n.given].filter(Boolean).join(' '),
    ...addressOf(person, viewer, locale),
    ...(register ? { register } : {}),
  };
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
      /** The scene's guests by slot, to fill `{slot}`, `{slot.full}`, `{slot.call}`, `{slot.self}` and `{slot.you}`. */
      guests: Record<string, GuestNames>;
    } | null,
  };
  /** Text of notice scenes waiting in the queue, by their synthetic scene id. */
  const notices = new Map<string, string>();

  const text = (key: string): string => content.text(locale, key) ?? `[${key}]`;
  /** The text key's variants: itself and `key~2`, `key~3`..., and the ones for a voice register (`key@warm`, `key@warm~2`). */
  const variantsOf = (key: string): { plain: string[]; voiced: Map<VoiceRegister, string[]> } => {
    const chain = (base: string): string[] => {
      const out = content.text(locale, base) === undefined ? [] : [base];
      for (let n = 2; n < 12 && content.text(locale, `${base}~${n}`) !== undefined; n++)
        out.push(`${base}~${n}`);
      return out;
    };
    const voiced = new Map<VoiceRegister, string[]>();
    for (const register of VOICE_REGISTERS) {
      const keys = chain(`${key}@${register}`);
      if (keys.length > 0) voiced.set(register, keys);
    }
    return { plain: chain(key), voiced };
  };
  /** The last variant shown for each text key, so the same line is not shown twice in a row when there is a choice. */
  const lastShown = new Map<string, string>();
  /**
   * The text for a key. Without variants it is the key's text and nothing is drawn. With variants, one draw from this
   * module's own stream picks: a variant for the speaker's register when there is one (most of the time), otherwise any;
   * the one shown last time is skipped. Both languages have the same variants (the validator checks), so the draw count,
   * and with it the whole run, does not depend on the language.
   */
  const pick = (key: string, register?: VoiceRegister): string => {
    const { plain, voiced } = variantsOf(key);
    const tagged = register ? (voiced.get(register) ?? []) : [];
    const all = plain.length + [...voiced.values()].reduce((n, v) => n + v.length, 0);
    if (all <= 1) return text(plain[0] ?? key);
    const r = host.rng.next();
    let pool = plain;
    let u = r;
    if (tagged.length > 0) {
      if (r < 0.7) {
        pool = tagged;
        u = r / 0.7;
      } else u = (r - 0.7) / 0.3;
    }
    const last = lastShown.get(key);
    const fresh = pool.length > 1 ? pool.filter((k) => k !== last) : pool;
    const chosen =
      (fresh.length > 0 ? fresh : pool)[
        Math.min(Math.floor(u * (fresh.length || 1)), (fresh.length || 1) - 1)
      ] ?? key;
    lastShown.set(key, chosen);
    return text(chosen);
  };
  type Form = 'full' | 'call' | 'self' | 'you';
  const fill = (line: string, guests: Record<string, GuestNames>): string =>
    line.replace(
      /[{]([a-z][a-z0-9_]*)(?:[.](full|call|self|you))?[}]/g,
      (whole, slot: string, form: Form | undefined, offset: number) => {
        const guest = guests[slot];
        if (!guest) return whole;
        const word = form ? guest[form] : guest.short;
        return startsSentence(line.slice(0, offset)) ? capitalise(word) : word;
      },
    );
  const speakerName = (speaker: string, guests: Record<string, GuestNames> = {}): string => {
    if (speaker.startsWith('guest:')) return guests[speaker.slice('guest:'.length)]?.full ?? '';
    if (speaker.startsWith('char:')) {
      const person = content.get('character', `char.${speaker.slice('char:'.length)}`);
      return (person && content.text(locale, person.name_key)) ?? speaker.slice('char:'.length);
    }
    const name = speaker.replace(/^role:/, '');
    return content.text(locale, `speaker.${name}`) ?? name;
  };

  /** What is missing for a choice: the requirement that fails (a plain "at least" check), or energy. Undefined when nothing is. */
  const blockedBy = (scene: Scene, choiceIndex: number): BlockedReason | undefined => {
    const choice = scene.choices?.[choiceIndex];
    if (!choice) return undefined;
    const requires = choice.requires as { gte?: [unknown, unknown] } | undefined;
    if (!available(scene, choiceIndex)) {
      const [path, need] = requires?.gte ?? [];
      return typeof path === 'string' && typeof need === 'number'
        ? { kind: 'requirement', path, need }
        : undefined;
    }
    const energy = choice.cost?.energy ?? 0;
    if (energy > world.number('player.energy', Number.MAX_SAFE_INTEGER))
      return { kind: 'energy', need: energy };
    return undefined;
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
    const line = pick(template).replace(
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
    const guestNamesBySlot: Record<string, GuestNames> = {};
    const guestPeople: {
      character: string;
      name: string;
      title: string;
      guest: true;
      look?: PersonLook;
    }[] = [];
    const looks = new Map<string, PersonLook>();
    let preferred = actor;
    for (const guest of scene.guests ?? []) {
      if (!config.guests) {
        const someone = text('ui.guest.someone');
        guestNamesBySlot[guest.slot] = {
          short: someone,
          full: someone,
          call: someone,
          self: locale === 'vi' ? 'mình' : 'I',
          you: locale === 'vi' ? 'bạn' : 'you',
        };
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
      guestNamesBySlot[guest.slot] = guestNames(person, config.viewer, locale);
      const department = person.life.department;
      guestPeople.push({
        character: person.id,
        name: guestNamesBySlot[guest.slot]!.full,
        title: content.text(locale, `dept.${department}.title`) ?? department.replace(/_/g, ' '),
        guest: true,
        ...(lookOf(person) ? { look: lookOf(person)! } : {}),
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
    const sceneRegister = Object.values(guestNamesBySlot)[0]?.register;
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
        const look = lookOf(person);
        if (look) looks.set(who.character, look);
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
      ...named.map((n) =>
        config.guests
          ? {
              ...n,
              guest: true as const,
              ...(looks.get(n.character) ? { look: looks.get(n.character)! } : {}),
            }
          : n,
      ),
      ...guestPeople,
    ];
    const choices =
      scene.choices && scene.choices.length > 0
        ? scene.choices.map((c, i) => ({
            id: c.id,
            label: fill(pick(c.text_key, sceneRegister), guestNamesBySlot),
            disabled: !available(scene, i) || blockedBy(scene, i)?.kind === 'energy',
            ...(c.cost && (c.cost.hours || c.cost.energy)
              ? {
                  cost: {
                    ...(c.cost.hours ? { hours: c.cost.hours } : {}),
                    ...(c.cost.energy ? { energy: c.cost.energy } : {}),
                  },
                }
              : {}),
            ...(blockedBy(scene, i) ? { blocked: blockedBy(scene, i) } : {}),
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
            text: fill(
              pick(
                l.text_key,
                l.speaker.startsWith('guest:')
                  ? guestNamesBySlot[l.speaker.slice('guest:'.length)]?.register
                  : sceneRegister,
              ),
              guestNamesBySlot,
            ),
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
              ...(p.narrationKey
                ? {
                    narration: fill(
                      pick(p.narrationKey, Object.values(guests)[0]?.register),
                      guests,
                    ),
                  }
                : {}),
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
