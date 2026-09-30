import Ajv, { type ValidateFunction } from 'ajv';
import {
  ALL_SCHEMAS,
  ENGINE_VERSION,
  LOCALES,
  PACK_LAYERS,
  SCHEMA_IDS,
  type Effect,
  type Locale,
  type PackKind,
  type PackManifest,
} from '@je/contracts';
import { collectVars, evaluate, ExpressionError, validate as validateExpr } from '@je/rules';
import type { Diagnostic } from './diagnostics';
import { hasErrors } from './diagnostics';
import { loadRawPacks, type RawContent, type RawFile, type RawPack } from './load';
import { ContentRegistry, type ContentTypes, type RegistryData } from './registry';
import { semverAtLeast } from './semver';
import type { ContentSourcePort } from '@je/contracts';

export interface BuildResult {
  /** Present only when there are no errors. */
  registry?: ContentRegistry;
  diagnostics: Diagnostic[];
}

const VAR_PATH = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/;
const KINDS: PackKind[] = ['role', 'event', 'scene', 'offer', 'fact', 'term'];

interface Origin {
  pack: string;
  file: string;
  pointer: string;
}

function makeAjv(): Ajv {
  const ajv = new Ajv({ allErrors: true, strict: true });
  for (const schema of ALL_SCHEMAS) ajv.addSchema(schema);
  return ajv;
}

/** Loads packs from a source, then validates and merges them. */
export async function loadContent(
  source: ContentSourcePort,
  engineVersion = ENGINE_VERSION,
): Promise<BuildResult> {
  const raw = await loadRawPacks(source);
  const built = buildRegistry(raw, engineVersion);
  return { ...built, diagnostics: [...raw.diagnostics, ...built.diagnostics] };
}

export function buildRegistry(raw: RawContent, engineVersion = ENGINE_VERSION): BuildResult {
  const diagnostics: Diagnostic[] = [];
  const push = (d: Diagnostic): void => void diagnostics.push(d);
  const ajv = makeAjv();
  const validators = new Map<string, ValidateFunction>();
  const validatorFor = (id: string): ValidateFunction => {
    let v = validators.get(id);
    if (!v) {
      v = ajv.getSchema(id);
      if (!v) throw new Error(`schema not registered: ${id}`);
      validators.set(id, v);
    }
    return v;
  };
  const schemaErrors = (validator: ValidateFunction, file: string, pointer: string): void => {
    for (const e of validator.errors ?? []) {
      const extra =
        e.params && 'additionalProperty' in e.params
          ? ` "${String(e.params.additionalProperty)}"`
          : '';
      push({
        severity: 'error',
        code: 'schema.invalid',
        message: `${e.message ?? 'invalid'}${extra}`,
        file,
        path: `${pointer}${e.instancePath}`,
      });
    }
  };

  // 1. Manifests: present, schema-valid, unique, compatible with this engine.
  const packs: { pack: RawPack; manifest: PackManifest }[] = [];
  const seenIds = new Set<string>();
  for (const pack of raw.packs) {
    const file = pack.files.find((f) => f.kind === 'manifest');
    if (!file) {
      push({
        severity: 'error',
        code: 'pack.no_manifest',
        message: `pack folder "${pack.dir}" has no manifest.json`,
        file: pack.dir,
      });
      continue;
    }
    const validator = validatorFor(SCHEMA_IDS.manifest);
    if (!validator(file.data)) {
      schemaErrors(validator, file.file, '');
      continue;
    }
    const manifest = file.data as PackManifest;
    if (manifest.id !== pack.dir) {
      push({
        severity: 'warning',
        code: 'pack.id_mismatch',
        message: `manifest id "${manifest.id}" differs from folder "${pack.dir}"`,
        file: file.file,
      });
    }
    if (seenIds.has(manifest.id)) {
      push({
        severity: 'error',
        code: 'pack.duplicate',
        message: `pack id "${manifest.id}" is defined twice`,
        file: file.file,
      });
      continue;
    }
    seenIds.add(manifest.id);
    if (!semverAtLeast(engineVersion, manifest.engine_min_version)) {
      push({
        severity: 'error',
        code: 'pack.engine_too_old',
        message: `needs engine >= ${manifest.engine_min_version}, have ${engineVersion}`,
        file: file.file,
        path: '/engine_min_version',
      });
    }
    packs.push({ pack, manifest });
  }

  // 2. Dependencies and layer order (core < region < industry < arcs < mods).
  const rank = (m: PackManifest): number => PACK_LAYERS.indexOf(m.layer);
  const byId = new Map(packs.map((p) => [p.manifest.id, p]));
  for (const { manifest, pack } of packs) {
    for (const dep of manifest.depends_on ?? []) {
      const target = byId.get(dep);
      const file = `${pack.dir}/manifest.json`;
      if (!target) {
        push({
          severity: 'error',
          code: 'pack.missing_dependency',
          message: `"${manifest.id}" depends on unknown pack "${dep}"`,
          file,
        });
      } else if (rank(target.manifest) > rank(manifest)) {
        push({
          severity: 'error',
          code: 'pack.layer_order',
          message: `"${manifest.id}" (${manifest.layer}) cannot depend on "${dep}" (${target.manifest.layer}), a later layer`,
          file,
        });
      }
    }
  }
  const ordered = orderPacks(packs, rank, push);

  // 3. Items and locale strings, merged in layer order so later layers override earlier ones.
  const items = {
    role: new Map(),
    event: new Map(),
    scene: new Map(),
    offer: new Map(),
    fact: new Map(),
    term: new Map(),
  } as RegistryData['items'];
  const origins = new Map<string, Origin>();
  const owner = new Map<string, { pack: string; rank: number }>();
  const locales: RegistryData['locales'] = { vi: new Map(), en: new Map() };

  for (const { pack, manifest } of ordered) {
    const seenInPack = new Set<string>();
    for (const file of pack.files) {
      if (file.kind === 'manifest') continue;
      if (file.kind === 'locale') {
        readLocale(file, validatorFor(SCHEMA_IDS.locale), locales, schemaErrors);
        continue;
      }
      const kind = file.kind;
      const validator = validatorFor(SCHEMA_IDS[kind]);
      const list = Array.isArray(file.data) ? file.data : [file.data];
      list.forEach((entry, index) => {
        const pointer = Array.isArray(file.data) ? `/${index}` : '';
        if (!validator(entry)) {
          schemaErrors(validator, file.file, pointer);
          return;
        }
        const id = (entry as { id: string }).id;
        const key = `${kind}:${id}`;
        if (seenInPack.has(key)) {
          push({
            severity: 'error',
            code: 'content.duplicate',
            message: `${kind} "${id}" is defined twice in pack "${manifest.id}"`,
            file: file.file,
            path: pointer,
          });
          return;
        }
        seenInPack.add(key);
        const previous = owner.get(key);
        if (previous && previous.rank === rank(manifest)) {
          push({
            severity: 'error',
            code: 'content.conflict',
            message: `${kind} "${id}" is defined by both "${previous.pack}" and "${manifest.id}" in the same layer`,
            file: file.file,
            path: pointer,
          });
          return;
        }
        if (previous) {
          push({
            severity: 'info',
            code: 'content.override',
            message: `${kind} "${id}" from "${previous.pack}" is overridden by "${manifest.id}"`,
            file: file.file,
            path: pointer,
          });
        }
        owner.set(key, { pack: manifest.id, rank: rank(manifest) });
        origins.set(key, { pack: manifest.id, file: file.file, pointer });
        (items[kind] as Map<string, unknown>).set(id, entry);
      });
    }
  }

  crossCheck(items, locales, origins, push);

  const data: RegistryData = { packs: ordered.map((p) => p.manifest), items, locales };
  return hasErrors(diagnostics)
    ? { diagnostics }
    : { registry: new ContentRegistry(data), diagnostics };
}

function readLocale(
  file: RawFile,
  validator: ValidateFunction,
  locales: RegistryData['locales'],
  schemaErrors: (v: ValidateFunction, file: string, pointer: string) => void,
): void {
  if (!validator(file.data)) {
    schemaErrors(validator, file.file, '');
    return;
  }
  const target = locales[file.locale as Locale];
  for (const [key, text] of Object.entries(file.data as Record<string, string>))
    target.set(key, text);
}

/** Layer rank first, then dependencies, then id, so the order is stable. Cycles are reported. */
function orderPacks(
  packs: { pack: RawPack; manifest: PackManifest }[],
  rank: (m: PackManifest) => number,
  push: (d: Diagnostic) => void,
): { pack: RawPack; manifest: PackManifest }[] {
  const pending = [...packs].sort(
    (a, b) => rank(a.manifest) - rank(b.manifest) || (a.manifest.id < b.manifest.id ? -1 : 1),
  );
  const done = new Set<string>();
  const known = new Set(packs.map((p) => p.manifest.id));
  const out: typeof packs = [];
  while (pending.length > 0) {
    const index = pending.findIndex((p) =>
      (p.manifest.depends_on ?? []).every((d) => done.has(d) || !known.has(d)),
    );
    if (index === -1) {
      push({
        severity: 'error',
        code: 'pack.cycle',
        message: `dependency cycle among: ${pending.map((p) => p.manifest.id).join(', ')}`,
      });
      out.push(...pending);
      break;
    }
    const [next] = pending.splice(index, 1);
    done.add((next as (typeof packs)[number]).manifest.id);
    out.push(next as (typeof packs)[number]);
  }
  return out;
}

function scheduleTargets(effects: readonly Effect[] | undefined): string[] {
  return (effects ?? []).flatMap((e) => ('schedule' in e ? [e.schedule] : []));
}

/** Reference integrity, text keys in every locale, expressions, and reachability. */
function crossCheck(
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
      if ('fact' in effect) {
        requireRef(kind, id, 'fact', effect.fact, `${field} fact`);
        producedFacts.add(effect.fact);
      }
    }
  };

  const scheduled = new Set<string>();
  const usedScenes = new Set<string>();
  const producedFacts = new Set<string>();
  const usedTerms = new Set<string>();

  for (const role of items.role.values()) {
    useKey(role.title_key, role.id, 'role');
    if (role.reports_to) requireRef('role', role.id, 'role', role.reports_to, 'reports_to');
    for (const offer of role.dark_offers ?? [])
      requireRef('role', role.id, 'offer', offer, 'dark_offers');
  }

  for (const event of items.event.values()) {
    requireRef('event', event.id, 'scene', event.scene, 'scene');
    usedScenes.add(event.scene);
    if (event.when !== undefined) checkExpr('event', event.id, 'when', event.when);
    checkEffects('event', event.id, event.effects, 'effects');
    for (const t of scheduleTargets(event.effects)) scheduled.add(t);
  }

  for (const scene of items.scene.values()) {
    scene.lines.forEach((line) => useKey(line.text_key, scene.id, 'scene'));
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
    const neverPicked = event.weight === 0 || alwaysFalse(event.when);
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

export { KINDS as CONTENT_KINDS };
export type { ContentTypes };
