import { CONTRACTS_VERSION } from '@je/contracts';
import type {
  ContentView,
  CoreEventPayloads,
  DebriefEntry,
  Effect,
  Ending,
  EventDraft,
  Locale,
  Module,
  ModuleHost,
  ModuleInstance,
  ModuleManifest,
  SceneTerm,
  StateValue,
} from '@je/contracts';

export const manifest: ModuleManifest = {
  id: 'education',
  version: '0.1.0',
  priority: 50,
  consumes: [
    'sim.stateChanged',
    'scene.started',
    'choice.resolved',
    'fact.learned',
    'fact.escalated',
    'risk.detected',
    'risk.scapegoated',
    'run.endRequested',
    'run.ended',
  ],
  emits: ['debrief.ready'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface EducationConfig {
  content: ContentView;
  locale?: Locale;
  /** How many lessons and glossary terms the debrief lists at most. */
  maxLessons?: number;
  maxTerms?: number;
}

const STAT_PATHS = [
  'player.stress',
  'player.health',
  'player.cash_vnd',
  'player.rep.boss',
  'player.rep.buyer',
  'player.rep.finance',
  'player.rep.production',
  'player.rep.qc',
  'player.rep.cs',
];

const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (whole, name: string) => values[name] ?? whole);

/**
 * The end-of-run review. While the run goes on it quietly keeps notes: the choices that left a
 * mark, how each fact got around, what was detected and who was blamed. When the run ends it
 * writes the debrief in the player's language: how it ended, the chain from what you did to what
 * came back, what each thing teaches, the workplace vocabulary you met, and where you stand. It
 * teaches from the log; it never takes part in the game.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<EducationConfig> | undefined;
  if (!config?.content) throw new Error('mod-education needs config.content');
  const { content } = config;
  const locale = config.locale ?? 'en';
  const maxLessons = config.maxLessons ?? 6;
  const maxTerms = config.maxTerms ?? 12;

  const text = (key: string): string => content.text(locale, key) ?? `[${key}]`;
  const factLabel = (factId: string): string => {
    const fact = content.get('fact', factId);
    return fact ? text(fact.text_key) : factId;
  };

  const timeline: DebriefEntry[] = [];
  const facts = new Set<string>();
  const terms: string[] = [];
  const vars = new Map<string, StateValue>();
  let requested: Ending | undefined;

  const note = (turn: number, kind: DebriefEntry['kind'], line: string): void => {
    timeline.push({ turn, kind, text: line });
  };

  const spread = (turn: number, factId: string, level: string): void => {
    if (level === 'private') return;
    note(turn, 'spread', fill(text(`debrief.spread.${level}`), { fact: factLabel(factId) }));
  };

  return {
    handlers: {
      'sim.stateChanged': (env) => {
        const p = env.payload as CoreEventPayloads['sim.stateChanged'];
        if (p.full) vars.clear();
        for (const [path, value] of Object.entries(p.vars)) vars.set(path, value);
      },

      'scene.started': (env) => {
        const { sceneId } = env.payload as CoreEventPayloads['scene.started'];
        for (const id of content.get('scene', sceneId)?.terms ?? []) {
          if (!terms.includes(id)) terms.push(id);
        }
      },

      'choice.resolved': (env) => {
        const p = env.payload as CoreEventPayloads['choice.resolved'];
        if (!((p.effects ?? []) as Effect[]).some((e) => 'fact' in e)) return;
        const choice = content.get('scene', p.sceneId)?.choices?.find((c) => c.id === p.choiceId);
        if (!choice) return;
        note(env.turn, 'choice', fill(text('debrief.choice'), { choice: text(choice.text_key) }));
      },

      'fact.learned': (env) => {
        const p = env.payload as CoreEventPayloads['fact.learned'];
        facts.add(p.factId);
        spread(env.turn, p.factId, p.visibility);
      },

      'fact.escalated': (env) => {
        const p = env.payload as CoreEventPayloads['fact.escalated'];
        facts.add(p.factId);
        spread(env.turn, p.factId, p.to);
      },

      'risk.detected': (env) => {
        const p = env.payload as CoreEventPayloads['risk.detected'];
        note(
          env.turn,
          'detected',
          fill(text(p.audit ? 'debrief.detected_audit' : 'debrief.detected'), {
            detector: text(`detector.${p.detector}`),
            fact: factLabel(p.factId),
          }),
        );
      },

      'risk.scapegoated': (env) => {
        const p = env.payload as CoreEventPayloads['risk.scapegoated'];
        note(
          env.turn,
          'scapegoated',
          fill(text('debrief.scapegoat'), { fact: factLabel(p.factId) }),
        );
      },

      'run.endRequested': (env) => {
        requested = (env.payload as CoreEventPayloads['run.endRequested']).ending;
      },

      'run.ended': (env) => {
        const p = env.payload as CoreEventPayloads['run.ended'];
        const ending: Ending = p.ending ?? requested ?? 'completed';
        // `p.turn` counts completed weeks; the ending belongs to the last week actually played.
        note(Math.max(0, p.turn - 1), 'ending', text(`ending.${ending}.title`));

        const lessons = [...facts]
          .map((id) => content.get('fact', id))
          .filter((f) => f !== undefined && f.lesson_key)
          .sort((a, b) => b!.severity - a!.severity || (a!.id < b!.id ? -1 : 1))
          .slice(0, maxLessons)
          .map((f) => ({ factId: f!.id, fact: text(f!.text_key), lesson: text(f!.lesson_key!) }));

        const glossary: SceneTerm[] = terms.slice(0, maxTerms).flatMap((id) => {
          const term = content.get('term', id);
          return term
            ? [{ id, term: text(term.term_key), definition: text(term.definition_key) }]
            : [];
        });

        const stats: Record<string, number> = {};
        for (const path of STAT_PATHS) {
          const value = vars.get(path);
          if (typeof value === 'number') stats[path] = Math.round(value);
        }

        const debrief: EventDraft = {
          type: 'debrief.ready',
          payload: {
            ending,
            title: text(`ending.${ending}.title`),
            body: text(`ending.${ending}.body`),
            weeks: p.turn,
            stats,
            timeline: timeline.map((e) => ({ ...e })),
            lessons,
            terms: glossary,
          },
        };
        return [debrief];
      },
    },
    snapshot: () => ({ entries: timeline.length, facts: [...facts].sort(), terms: [...terms] }),
  };
}

export const educationModule: Module = { manifest, createModule };
