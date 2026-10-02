import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { join } from 'node:path';
import type { Person } from '@je/contracts';
import { assembleLibrary, generatePerson, summarisePeople, type RawLibrary } from '@je/mod-people';
import { EDITOR_HTML } from './ui';

/** The library lives in one JSON file per part; the editor edits exactly these. */
export const LIBRARY_FILES = ['archetypes', 'quirks', 'names', 'departments', 'tables'] as const;

export function readRaw(dir: string): RawLibrary {
  const out: Record<string, unknown> = {};
  for (const name of LIBRARY_FILES)
    out[name] = JSON.parse(readFileSync(join(dir, `${name}.json`), 'utf8'));
  return out as unknown as RawLibrary;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > 8_000_000) {
        reject(new Error('body too large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown, type = 'application/json'): void {
  res.writeHead(status, { 'content-type': `${type}; charset=utf-8`, 'cache-control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : String(body));
}

/** Keeps only the five known parts of a posted library, so nothing else can ever be written. */
function pickRaw(body: unknown): RawLibrary | undefined {
  if (typeof body !== 'object' || body === null) return undefined;
  const raw = body as Record<string, unknown>;
  if (!LIBRARY_FILES.every((f) => f in raw)) return undefined;
  return Object.fromEntries(LIBRARY_FILES.map((f) => [f, raw[f]])) as unknown as RawLibrary;
}

/**
 * The attribute library editor server: offline, local, one page. It never touches anything outside the
 * library folder, and it refuses to save a library that has validation errors. Saves keep a `.bak` copy.
 */
export function createEditorServer(libraryDir: string): Server {
  return createServer((req, res) => {
    void handle(req, res, libraryDir).catch((error: unknown) => {
      send(res, 500, { error: error instanceof Error ? error.message : String(error) });
    });
  });
}

async function handle(req: IncomingMessage, res: ServerResponse, dir: string): Promise<void> {
  const url = (req.url ?? '/').split('?')[0];
  if (req.method === 'GET' && url === '/') return send(res, 200, EDITOR_HTML, 'text/html');
  if (req.method === 'GET' && url === '/api/library') {
    const raw = readRaw(dir);
    return send(res, 200, { raw, diagnostics: assembleLibrary(raw).diagnostics });
  }
  if (req.method !== 'POST') return send(res, 404, { error: 'not found' });
  const body: unknown = JSON.parse(await readBody(req));

  if (url === '/api/validate') {
    const raw = pickRaw(body);
    if (!raw) return send(res, 400, { error: 'expected the five library parts' });
    return send(res, 200, { diagnostics: assembleLibrary(raw).diagnostics });
  }
  if (url === '/api/save') {
    const raw = pickRaw(body);
    if (!raw) return send(res, 400, { error: 'expected the five library parts' });
    const { diagnostics } = assembleLibrary(raw);
    if (diagnostics.some((d) => d.severity === 'error')) {
      return send(res, 200, { ok: false, diagnostics });
    }
    mkdirSync(dir, { recursive: true });
    for (const name of LIBRARY_FILES) {
      const file = join(dir, `${name}.json`);
      try {
        copyFileSync(file, `${file}.bak`);
      } catch {
        /* first save: nothing to back up */
      }
      writeFileSync(file, `${JSON.stringify(raw[name], null, 2)}\n`, 'utf8');
    }
    return send(res, 200, { ok: true, diagnostics });
  }
  if (url === '/api/preview') {
    const request = body as {
      raw?: unknown;
      department?: string;
      n?: number;
      function?: string;
      seed?: string;
    };
    const raw = pickRaw(request.raw);
    if (!raw) return send(res, 400, { error: 'expected the five library parts' });
    const { library, diagnostics } = assembleLibrary(raw);
    if (!library) {
      const first = diagnostics.find((d) => d.severity === 'error');
      return send(res, 200, {
        error: `fix the errors first: ${first?.message ?? 'invalid library'}`,
      });
    }
    const department = request.department ?? 'production';
    const target = library.departments.find((d) => d.department === department);
    if (!target) return send(res, 200, { error: `unknown department "${department}"` });
    const n = Math.max(1, Math.min(3000, Math.floor(request.n ?? 500)));
    const seeds = { world_seed: 'editor-world', run_seed: request.seed ?? 'editor' };
    const people: Person[] = [];
    for (let i = 0; i < n; i++) {
      people.push(
        generatePerson(
          library,
          {
            department,
            event_id: `editor-${department}`,
            counter: i,
            ...(request.function ? { story_function: request.function } : {}),
          },
          { seeds, created_turn: 0 },
        ),
      );
    }
    const sample = people.slice(0, 12).map((p) => ({
      name:
        [p.origin.name.family, p.origin.name.middle, p.origin.name.given]
          .filter(Boolean)
          .join(' ') + ` (${p.origin.gender[0]}, ${p.origin.age_at_creation})`,
      archetype:
        library.archetypes.find((a) => a.id === p.origin.archetype)?.name.en ?? p.origin.archetype,
      quirks: p.origin.quirks
        .map((id) => library.quirks.find((q) => q.id === id)?.name.en ?? id)
        .join('; '),
      values: p.origin.values.join(', '),
      life: `${p.life.marital}, ${p.life.children} child(ren), income ${Math.round(p.life.income_vnd / 1e6)}M, debt ${Math.round(p.life.debt_vnd / 1e6)}M`,
    }));
    return send(res, 200, { summary: summarisePeople(people), target, sample });
  }
  return send(res, 404, { error: 'not found' });
}
