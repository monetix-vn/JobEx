import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  EventDraft,
  Locale,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  Scene,
} from '@je/contracts';
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
  ],
  emits: ['scene.started', 'scene.ended', 'scene.expired'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface NarrativeConfig {
  content: ContentView;
  locale?: Locale;
  /** Scenes to start at the plan phase of a given turn, e.g. { "0": ["scene.a", "scene.b"] }. */
  script?: Record<string, string[]>;
  /** A scene left unanswered this many turns expires as ignored. */
  patienceTurns?: number;
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
    active: null as { sceneId: string; startedTurn: number } | null,
  };
  /** Text of notice scenes waiting in the queue, by their synthetic scene id. */
  const notices = new Map<string, string>();

  const text = (key: string): string => content.text(locale, key) ?? `[${key}]`;
  const speakerName = (speaker: string): string => {
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
    const sceneId = state.queue.shift();
    if (sceneId === undefined) return [];
    const noticeText = notices.get(sceneId);
    if (noticeText !== undefined) {
      notices.delete(sceneId);
      state.active = { sceneId, startedTurn: host.clock.now().turn };
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
    state.active = { sceneId, startedTurn: host.clock.now().turn };
    const glossary = (scene.terms ?? []).flatMap((id) => {
      const term = content.get('term', id);
      return term ? [{ id, term: text(term.term_key), definition: text(term.definition_key) }] : [];
    });
    const choices =
      scene.choices && scene.choices.length > 0
        ? scene.choices.map((c, i) => ({
            id: c.id,
            label: text(c.text_key),
            disabled: !available(scene, i),
          }))
        : [{ id: CONTINUE_CHOICE, label: text('ui.continue') }];
    return [
      {
        type: 'scene.started',
        payload: {
          sceneId,
          location: scene.location,
          lines: scene.lines.map((l) => ({
            speaker: speakerName(l.speaker),
            text: text(l.text_key),
          })),
          choices,
          ...(glossary.length > 0 ? { terms: glossary } : {}),
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
        const { eventId } = env.payload as CoreEventPayloads['director.eventFired'];
        const event = content.get('event', eventId);
        if (!event) return;
        state.queue.push(event.scene);
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
        state.active = null;
        return [
          {
            type: 'scene.ended',
            payload: {
              sceneId: p.sceneId,
              ...(p.narrationKey ? { narration: text(p.narrationKey) } : {}),
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
