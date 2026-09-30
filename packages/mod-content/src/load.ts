import { LOCALES, PACK_FOLDERS } from '@je/contracts';
import type { ContentSourcePort, Locale, PackKind } from '@je/contracts';
import type { Diagnostic } from './diagnostics';

export type RawKind = 'manifest' | 'locale' | PackKind;

export interface RawFile {
  kind: RawKind;
  /** Path relative to the content root. */
  file: string;
  locale?: Locale;
  data: unknown;
}

export interface RawPack {
  dir: string;
  files: RawFile[];
}

export interface RawContent {
  packs: RawPack[];
  diagnostics: Diagnostic[];
}

/** Reads every file from a source and sorts it into packs. Only parses; validation comes next. */
export async function loadRawPacks(source: ContentSourcePort): Promise<RawContent> {
  const diagnostics: Diagnostic[] = [];
  const byDir = new Map<string, RawFile[]>();
  const paths = (await source.list()).map((p) => p.replace(/\\/g, '/')).sort();

  for (const file of paths) {
    // Notes for authors (README.md, guides) may sit next to the content; they are not content.
    if (file.endsWith('.md')) continue;
    const parts = file.split('/');
    const dir = parts[0] as string;
    if (parts.length < 2) {
      diagnostics.push({
        severity: 'info',
        code: 'file.ignored',
        message: 'not inside a pack folder',
        file,
      });
      continue;
    }
    const rest = parts.slice(1);
    const classified = classify(rest);
    if (!classified) {
      diagnostics.push({
        severity: 'warning',
        code: 'file.ignored',
        message:
          'unrecognised location or extension; expected manifest.json, locale/<lang>.json or <kind>/*.json',
        file,
      });
      continue;
    }
    let data: unknown;
    try {
      data = JSON.parse(await source.read(file));
    } catch (error) {
      diagnostics.push({
        severity: 'error',
        code: 'json.parse',
        message: error instanceof Error ? error.message : String(error),
        file,
      });
      continue;
    }
    const list = byDir.get(dir) ?? [];
    list.push({ ...classified, file, data });
    byDir.set(dir, list);
  }

  const packs = [...byDir.entries()].map(([dir, files]) => ({ dir, files }));
  return { packs, diagnostics };
}

function classify(rest: string[]): Pick<RawFile, 'kind' | 'locale'> | undefined {
  const name = rest[rest.length - 1] as string;
  if (!name.endsWith('.json')) return undefined;
  if (rest.length === 1 && name === 'manifest.json') return { kind: 'manifest' };
  if (rest.length === 2 && rest[0] === 'locale') {
    const lang = name.slice(0, -'.json'.length);
    return (LOCALES as readonly string[]).includes(lang)
      ? { kind: 'locale', locale: lang as Locale }
      : undefined;
  }
  if (rest.length === 2 && Object.prototype.hasOwnProperty.call(PACK_FOLDERS, rest[0] as string)) {
    return { kind: PACK_FOLDERS[rest[0] as keyof typeof PACK_FOLDERS] };
  }
  return undefined;
}

/** In-memory source for tests, tools and the browser. Paths use forward slashes. */
export function memorySource(files: Record<string, string>): ContentSourcePort {
  return {
    list: async () => Object.keys(files),
    read: async (path) => {
      const text = files[path];
      if (text === undefined) throw new Error(`no such file: ${path}`);
      return text;
    },
  };
}
