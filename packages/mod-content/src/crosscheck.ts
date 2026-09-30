import { LOCALES, type Effect, type PackKind } from '@je/contracts';
import { collectVars, evaluate, ExpressionError, validate as validateExpr } from '@je/rules';
import type { Diagnostic } from './diagnostics';
import type { RegistryData } from './registry';

const SLUG = /^[a-z][a-z0-9_]*$/;
const REL_PATH = /^rel\.([a-z][a-z0-9_]*)\.(trust|loyalty|owed)$/;
const VAR_PATH = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/;

export interface Origin {
  pack: string;
  file: string;
  pointer: string;
}

function scheduleTargets(effects: readonly Effect[] | undefined): string[] {
  return (effects ?? []).flatMap((e) => ('schedule' in e ? [e.schedule] : []));
}

/** Reference integrity, text keys in every locale, expressions, and reachability. */
export function crossCheck(
  items: RegistryData['items'],
  locales: RegistryData['locales'],
  origins: Map<string, Origin>,
  push: (d: Diagnostic) => void,
): void {
  const at = (kind: PackKind, id: string): Pick<Diagnostic, 'file' | 'path'> => {
    const o = origins.get(`${kind}:${id}`);
    return o ? { file: o.file, path: o.pointer } : {};
  };
  const requireRef = (
    from: PackKind,
    fromId: string,
    kind: PackKind,
    id: string,
    field: string,
  ): void => {
    if (!items[kind].has(id)) {
      push({
        severity: 'error',
        code: 'ref.missing',
        message: `${from} "${fromId}" ${field} references unknown ${kind} "${id}"`,
        ...at(from, fromId),
      });
    }
  };
  const textKeys: { key: string; by: string; kind: PackKind }[] = [];
  const useKey = (key: string, by: string, kind: PackKind): void =>
    void textKeys.push({ key, by, kind });

  const checkExpr = (kind: PackKind, id: string, field: string, expr: unknown): void => {
    for (const issue of validateExpr(expr)) {
      push({
        severity: 'error',
        code: 'expr.invalid',
        message: `${kind} "${id}" ${field}: ${issue.message} (${issue.path})`,
        ...at(kind, id),
      });
    }
    for (const name of collectVars(expr)) {
      if (!VAR_PATH.test(name)) {
        push({
          severity: 'error',
          code: 'expr.bad_var',
          message: `${kind} "${id}" ${field}: "${name}" is not a valid variable path; use {"lit": "..."} for string literals`,
          ...at(kind, id),
        });
      }
    }
  };
  const checkEffects = (
    kind: PackKind,
    id: string,
    effects: readonly Effect[] | undefined,
    field: string,
  ): void => {
    for (const target of scheduleTargets(effects))
      requireRef(kind, id, 'event', target, `${field} schedule`);
    for (const effect of effects ?? []) {
      if ('delta' in effect && effect.delta.startsWith('rel.')) {
        const match = REL_PATH.exec(effect.delta);
        if (!match) {
          push({
            severity: 'error',
            code: 'rel.bad_path',
            message: `${kind} "${id}" ${field}: "${effect.delta}" must look like rel.<character>.trust|loyalty|owed`,
            ...at(kind, id),
          });
        } else {
          requireRef(kind, id, 'character', `char.${match[1]}`, `${field} relationship`);
          usedCharacters.add(`char.${match[1]}`);
        }
      }
      if ('arc' in effect) {
        requireRef(kind, id, 'arc', effect.arc, `${field} arc`);
        const arc = items.arc.get(effect.arc);
        const stage = arc?.stages.find((s) => s.id === effect.stage);
        if (stage) {
          scheduled.add(stage.event);
          reachedStages.add(`${arc!.id}#${stage.id}`);
        } else if (arc && effect.stage !== 'end') {
          push({
            severity: 'error',
            code: 'arc.bad_stage',
            message: `${kind} "${id}" ${field}: arc "${arc.id}" has no stage "${effect.stage}" (use one of its stages, or "end")`,
            ...at(kind, id),
          });
        }
      }
      if ('fact' in effect) {
        requireRef(kind, id, 'fact', effect.fact, `${field} fact`);
        producedFacts.add(effect.fact);
      }
    }
  };

  const scheduled = new Set<string>();
  const reachedStages = new Set<string>();
  const usedScenes = new Set<string>();
  const producedFacts = new Set<string>();
  const usedTerms = new Set<string>();
  const usedCharacters = new Set<string>();

  for (const role of items.role.values()) {
    useKey(role.title_key, role.id, 'role');
    if (role.blurb_key) useKey(role.blurb_key, role.id, 'role');
    if (role.reports_to) requireRef('role', role.id, 'role', role.reports_to, 'reports_to');
    for (const offer of role.dark_offers ?? [])
      requireRef('role', role.id, 'offer', offer, 'dark_offers');
  }

  for (const arc of items.arc.values()) {
    useKey(arc.title_key, arc.id, 'arc');
    const seen = new Set<string>();
    for (const stage of arc.stages) {
      requireRef('arc', arc.id, 'event', stage.event, `stage ${stage.id}`);
      if (stage.id === 'end' || seen.has(stage.id)) {
        push({
          severity: 'error',
          code: 'arc.bad_stage_id',
          message: `arc "${arc.id}" stage id "${stage.id}" is ${stage.id === 'end' ? 'reserved' : 'used twice'}`,
          ...at('arc', arc.id),
        });
      }
      seen.add(stage.id);
    }
  }

  for (const event of items.event.values()) {
    requireRef('event', event.id, 'scene', event.scene, 'scene');
    if (event.arc) requireRef('event', event.id, 'arc', event.arc, 'arc');
    if (event.beat && event.beat.from_week > event.beat.to_week) {
      push({
        severity: 'error',
        code: 'event.bad_beat',
        message: `event "${event.id}" beat window is backwards (from_week ${event.beat.from_week} is after to_week ${event.beat.to_week})`,
        ...at('event', event.id),
      });
    }
    if (event.role) requireRef('event', event.id, 'role', event.role, 'role');
    usedScenes.add(event.scene);
    if (event.when !== undefined) checkExpr('event', event.id, 'when', event.when);
    checkEffects('event', event.id, event.effects, 'effects');
    for (const t of scheduleTargets(event.effects)) scheduled.add(t);
  }

  for (const scene of items.scene.values()) {
    scene.lines.forEach((line) => useKey(line.text_key, scene.id, 'scene'));
    for (const who of [...(scene.cast ?? []), ...scene.lines.map((l) => l.speaker)]) {
      if (!who.startsWith('char:')) continue;
      const slug = who.slice('char:'.length);
      requireRef('scene', scene.id, 'character', `char.${slug}`, 'cast');
      usedCharacters.add(`char.${slug}`);
    }
    for (const termId of scene.terms ?? []) {
      requireRef('scene', scene.id, 'term', termId, 'terms');
      usedTerms.add(termId);
    }
    const choiceIds = new Set<string>();
    for (const choice of scene.choices ?? []) {
      if (choiceIds.has(choice.id)) {
        push({
          severity: 'error',
          code: 'scene.duplicate_choice',
          message: `scene "${scene.id}" has two choices with id "${choice.id}"`,
          ...at('scene', scene.id),
        });
      }
      choiceIds.add(choice.id);
      useKey(choice.text_key, scene.id, 'scene');
      if (choice.requires !== undefined)
        checkExpr('scene', scene.id, `choice ${choice.id} requires`, choice.requires);
      const total = choice.outcomes.reduce((sum, o) => sum + o.p, 0);
      if (Math.abs(total - 1) > 0.001) {
        push({
          severity: 'error',
          code: 'scene.probability',
          message: `scene "${scene.id}" choice "${choice.id}" outcome probabilities sum to ${total}, expected 1`,
          ...at('scene', scene.id),
        });
      }
      for (const outcome of choice.outcomes) {
        useKey(outcome.narration_key, scene.id, 'scene');
        checkEffects('scene', scene.id, outcome.effects, `choice ${choice.id} outcome`);
        for (const t of scheduleTargets(outcome.effects)) scheduled.add(t);
      }
    }
  }

  for (const offer of items.offer.values()) useKey(offer.justification_key, offer.id, 'offer');
  for (const fact of items.fact.values()) {
    useKey(fact.text_key, fact.id, 'fact');
    if (fact.lesson_key) useKey(fact.lesson_key, fact.id, 'fact');
  }
  for (const person of items.character.values()) {
    useKey(person.name_key, person.id, 'character');
    useKey(person.title_key, person.id, 'character');
    if (!SLUG.test(person.id.slice('char.'.length))) {
      push({
        severity: 'error',
        code: 'character.bad_id',
        message: `character "${person.id}" must be char.<lower_snake_case>`,
        ...at('character', person.id),
      });
    }
  }
  for (const term of items.term.values()) {
    useKey(term.term_key, term.id, 'term');
    useKey(term.definition_key, term.id, 'term');
  }

  for (const { key, by, kind } of textKeys) {
    for (const locale of LOCALES) {
      if (!locales[locale].has(key)) {
        push({
          severity: 'error',
          code: 'locale.missing',
          message: `text key "${key}" (used by ${by}) is missing in ${locale}`,
          ...at(kind, by),
        });
      }
    }
  }

  // Reachability: an event nothing schedules whose condition can never hold will never fire.
  for (const event of items.event.values()) {
    const neverPicked = !event.beat && (event.weight === 0 || alwaysFalse(event.when));
    if (neverPicked && !scheduled.has(event.id)) {
      push({
        severity: 'warning',
        code: 'event.unreachable',
        message: `event "${event.id}" can never fire: no event schedules it and its condition is always false or its weight is 0`,
        ...at('event', event.id),
      });
    }
  }
  for (const fact of items.fact.values()) {
    if (!producedFacts.has(fact.id)) {
      push({
        severity: 'warning',
        code: 'fact.unused',
        message: `fact "${fact.id}" is never produced by any effect`,
        ...at('fact', fact.id),
      });
    }
  }
  for (const term of items.term.values()) {
    if (!usedTerms.has(term.id)) {
      push({
        severity: 'warning',
        code: 'term.unused',
        message: `glossary term "${term.id}" is not used by any scene`,
        ...at('term', term.id),
      });
    }
  }
  for (const arc of items.arc.values()) {
    arc.stages.slice(1).forEach((stage) => {
      if (!reachedStages.has(`${arc.id}#${stage.id}`)) {
        push({
          severity: 'warning',
          code: 'arc.stage_unreachable',
          message: `arc "${arc.id}" stage "${stage.id}" is never reached: no effect moves the arc to it`,
          ...at('arc', arc.id),
        });
      }
    });
  }
  for (const person of items.character.values()) {
    if (!usedCharacters.has(person.id)) {
      push({
        // The cast is planned ahead of the scenes that use it, so this is only a note.
        severity: 'info',
        code: 'character.unused',
        message: `character "${person.id}" is not used by any scene or relationship effect yet`,
        ...at('character', person.id),
      });
    }
  }
  for (const scene of items.scene.values()) {
    if (!usedScenes.has(scene.id)) {
      push({
        severity: 'warning',
        code: 'scene.unused',
        message: `scene "${scene.id}" is not used by any event`,
        ...at('scene', scene.id),
      });
    }
  }
}

/** True only when the expression is constant and evaluates to false. */
function alwaysFalse(expr: unknown): boolean {
  if (expr === undefined) return false;
  // An expression that reads any variable is not constant, even with a default.
  if (collectVars(expr).length > 0) return false;
  try {
    return evaluate(expr as never, {}) === false;
  } catch (error) {
    if (error instanceof ExpressionError) return false;
    throw error;
  }
}
