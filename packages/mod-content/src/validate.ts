import Ajv, { type ValidateFunction } from 'ajv';
import {
  ALL_SCHEMAS,
  ENGINE_VERSION,
  PACK_LAYERS,
  SCHEMA_IDS,
  type Locale,
  type PackKind,
  type PackManifest,
} from '@je/contracts';
import type { Diagnostic } from './diagnostics';
import { hasErrors } from './diagnostics';
import { loadRawPacks, type RawContent, type RawFile, type RawPack } from './load';
import { ContentRegistry, type ContentTypes, type RegistryData } from './registry';
import { semverAtLeast } from './semver';
import type { ContentSourcePort } from '@je/contracts';
import { crossCheck, type Origin } from './crosscheck';
import { orderPacks } from './order';

export interface BuildResult {
  /** Present only when there are no errors. */
  registry?: ContentRegistry;
  diagnostics: Diagnostic[];
}

const KINDS: PackKind[] = ['role', 'event', 'scene', 'offer', 'fact', 'term', 'character'];

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
    character: new Map(),
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

export { KINDS as CONTENT_KINDS };
export type { ContentTypes };
