import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { join } from 'node:path';
import type { World } from '@je/contracts';
import { parseWorld } from '@je/mod-people';

/**
 * The save host (ADR 0004): a tiny local server that keeps worlds in a folder, so the game page can save to disk.
 * It listens on this computer only, refuses requests from other websites (by origin and by a required header),
 * accepts only valid worlds, never overwrites without a backup, and never deletes (deleted worlds go to .trash).
 */
export const SAVE_HOST_VERSION = 1;
const ID = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const MAX_BODY = 20_000_000;

function allowedOrigin(origin: string | undefined): boolean {
  if (origin === undefined) return true; // not a browser (curl, tests)
  if (origin === 'null') return true; // the page opened from a file
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error('body too large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(
  res: ServerResponse,
  origin: string | undefined,
  status: number,
  body: unknown,
): void {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...(origin !== undefined
      ? {
          'access-control-allow-origin': origin,
          'access-control-allow-headers': 'content-type, x-jobex',
          'access-control-allow-methods': 'GET, PUT, DELETE, OPTIONS',
          vary: 'origin',
        }
      : {}),
  });
  res.end(JSON.stringify(body));
}

function atomicWrite(file: string, text: string): void {
  if (existsSync(file)) {
    try {
      writeFileSync(`${file}.bak`, readFileSync(file));
    } catch {
      /* a failed backup must not block a save, but the write below still goes through the temp file */
    }
  }
  const temp = `${file}.tmp`;
  writeFileSync(temp, text, 'utf8');
  renameSync(temp, file);
}

function loreText(world: World): string {
  const lines = [
    `# ${world.name}`,
    '',
    `World seed: ${world.world_seed}. Year ${world.year}. ${world.people.length} people.`,
    '',
  ];
  let year = -1;
  for (const l of world.lore) {
    if (l.year !== year) {
      year = l.year;
      lines.push(`## Year ${year}`);
    }
    lines.push(`- ${l.en}`);
  }
  return `${lines.join('\n')}\n`;
}

export function createSaveHost(root: string): Server {
  mkdirSync(root, { recursive: true });
  return createServer((req, res) => {
    const origin = req.headers.origin as string | undefined;
    void handle(req, res, root, origin).catch((error: unknown) => {
      send(res, origin, 500, { error: error instanceof Error ? error.message : String(error) });
    });
  });
}

async function handle(
  req: IncomingMessage,
  res: ServerResponse,
  root: string,
  origin: string | undefined,
): Promise<void> {
  if (!allowedOrigin(origin)) return send(res, undefined, 403, { error: 'origin not allowed' });
  if (req.method === 'OPTIONS') return send(res, origin, 204, {});
  // A custom header forces a browser preflight, so another website cannot write here by a plain form or request.
  if (req.headers['x-jobex'] !== '1')
    return send(res, origin, 403, { error: 'missing x-jobex header' });
  const path = (req.url ?? '/').split('?')[0]!.split('/').filter(Boolean);

  if (req.method === 'GET' && path.length === 1 && path[0] === 'ping') {
    return send(res, origin, 200, { ok: true, version: SAVE_HOST_VERSION, dir: root });
  }
  if (path[0] !== 'worlds') return send(res, origin, 404, { error: 'not found' });

  if (req.method === 'GET' && path.length === 1) {
    const list = readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory() && ID.test(d.name))
      .flatMap((d) => {
        const file = join(root, d.name, 'world.json');
        if (!existsSync(file)) return [];
        const parsed = parseWorld(readFileSync(file, 'utf8'));
        if (!parsed.ok) return [];
        const w = parsed.world;
        return [
          {
            id: w.id,
            name: w.name,
            year: w.year,
            runs: w.runs.length,
            people: w.people.length,
            updated: statSync(file).mtime.toISOString(),
          },
        ];
      })
      .sort((a, b) => (a.updated < b.updated ? 1 : -1));
    return send(res, origin, 200, { worlds: list });
  }

  const id = path[1];
  if (id === undefined || !ID.test(id))
    return send(res, origin, 400, { error: 'invalid world id' });
  const dir = join(root, id);

  if (path.length === 2) {
    const file = join(dir, 'world.json');
    if (req.method === 'GET') {
      if (!existsSync(file)) return send(res, origin, 404, { error: 'no such world' });
      const parsed = parseWorld(readFileSync(file, 'utf8'));
      return parsed.ok
        ? send(res, origin, 200, parsed.world)
        : send(res, origin, 422, { error: parsed.error });
    }
    if (req.method === 'PUT') {
      const parsed = parseWorld(await readBody(req));
      if (!parsed.ok) return send(res, origin, 400, { error: parsed.error });
      if (parsed.world.id !== id)
        return send(res, origin, 400, { error: 'the world id does not match the address' });
      mkdirSync(join(dir, 'runs'), { recursive: true });
      atomicWrite(file, JSON.stringify(parsed.world));
      writeFileSync(join(dir, 'lore.md'), loreText(parsed.world), 'utf8');
      return send(res, origin, 200, { ok: true });
    }
    if (req.method === 'DELETE') {
      if (!existsSync(dir)) return send(res, origin, 404, { error: 'no such world' });
      const trash = join(root, '.trash');
      mkdirSync(trash, { recursive: true });
      renameSync(dir, join(trash, `${id}-${Date.now()}`));
      return send(res, origin, 200, { ok: true, movedTo: '.trash' });
    }
  }

  if (path.length === 4 && path[2] === 'runs') {
    const name = path[3]!;
    if (!ID.test(name)) return send(res, origin, 400, { error: 'invalid run name' });
    if (!existsSync(join(dir, 'world.json')))
      return send(res, origin, 404, { error: 'no such world' });
    const file = join(dir, 'runs', `${name}.json`);
    if (req.method === 'GET') {
      if (!existsSync(file)) return send(res, origin, 404, { error: 'no such run' });
      return send(res, origin, 200, JSON.parse(readFileSync(file, 'utf8')) as unknown);
    }
    if (req.method === 'PUT') {
      const text = await readBody(req);
      try {
        JSON.parse(text);
      } catch {
        return send(res, origin, 400, { error: 'the run is not valid JSON' });
      }
      mkdirSync(join(dir, 'runs'), { recursive: true });
      atomicWrite(file, text);
      return send(res, origin, 200, { ok: true });
    }
  }
  return send(res, origin, 404, { error: 'not found' });
}
