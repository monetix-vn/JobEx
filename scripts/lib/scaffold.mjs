// Scaffolds a new scene with its event and EN/VI text keys, so adding content is one command and
// no hand-written JSON. The skeleton validates as is; replace the TODO text and tune the numbers.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = /^[a-z][a-z0-9_]*$/;

/** A new scene with one of these prefixes is for that job only, unless `role` says otherwise. */
const ROLE_BY_PREFIX = {
  sales: 'role.sales.export.specialist',
  qc: 'role.qc.specialist',
  fin: 'role.fin.accountant',
  prod: 'role.prod.planner',
  purch: 'role.purch.buyer',
  inv: 'role.inv.analyst',
  mkt: 'role.mkt.brand',
  fpa: 'role.fpa.analyst',
  sup: 'role.prod.supervisor',
  hr: 'role.hr.hrbp',
};

const readJson = (path, fallback) =>
  existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback;
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

/**
 * @param {{ root?: string, pack?: string, prefix?: string, role?: string, key: string }} options
 * @returns {string[]} the files created or changed, relative to `root`
 */
export function scaffoldScene({
  root = '.',
  pack = 'industry-cookware',
  prefix = 'sales',
  role,
  key,
}) {
  if (!KEY.test(key ?? '')) throw new Error(`key must be lower snake_case, got "${key}"`);
  const base = join(root, 'content', pack);
  if (!existsSync(join(base, 'manifest.json'))) throw new Error(`no pack at ${base}`);

  const sceneId = `scene.${prefix}.${key}`;
  const eventId = `event.${prefix}.${key}`;
  const sceneFile = join(base, 'scenes', `${prefix}-${key.replace(/_/g, '-')}.json`);
  const eventsFile = join(base, 'events', `${prefix}-week.json`);
  if (existsSync(sceneFile)) throw new Error(`${sceneFile} already exists`);
  const events = readJson(eventsFile, []);
  if (events.some((e) => e.id === eventId))
    throw new Error(`${eventId} already exists in ${eventsFile}`);

  const choice = (id, hours) => ({
    id,
    text_key: `${sceneId}.${id}`,
    ...(hours ? { cost: { hours } } : {}),
    outcomes: [
      {
        p: 0.6,
        narration_key: `${sceneId}.${id}.ok`,
        effects: [{ delta: 'player.rep.boss', value: 2 }],
      },
      {
        p: 0.4,
        result: 'fail',
        narration_key: `${sceneId}.${id}.fail`,
        effects: [{ delta: 'player.stress', value: 4 }],
      },
    ],
  });
  const scene = {
    id: sceneId,
    location: 'loc.meeting_room',
    cast: ['role:boss'],
    lines: [
      { speaker: 'role:boss', text_key: `${sceneId}.l1` },
      { speaker: 'role:boss', text_key: `${sceneId}.l2` },
    ],
    choices: [choice('c1', 3), choice('c2', 1), choice('c3', 0)],
  };

  const keys = [`l1`, `l2`, ...['c1', 'c2', 'c3'].flatMap((c) => [c, `${c}.ok`, `${c}.fail`])];
  const created = [];
  mkdirSync(join(base, 'scenes'), { recursive: true });
  mkdirSync(join(base, 'events'), { recursive: true });
  writeJson(sceneFile, scene);
  created.push(sceneFile);

  const owner = role ?? ROLE_BY_PREFIX[prefix];
  events.push({
    id: eventId,
    ...(owner ? { role: owner } : {}),
    tags: ['pressure'],
    weight: 1,
    cooldown_weeks: 12,
    scene: sceneId,
  });
  writeJson(eventsFile, events);
  created.push(eventsFile);

  for (const lang of ['en', 'vi']) {
    const file = join(base, 'locale', `${lang}.json`);
    const text = readJson(file, {});
    for (const k of keys) text[`${sceneId}.${k}`] = `TODO (${lang}): ${key} ${k}`;
    writeJson(file, text);
    created.push(file);
  }
  return created.map((f) => f.replace(/\\/g, '/'));
}
