import type {
  Appearance,
  Locale,
  PeopleLibrary,
  Person,
  PlayerProfile,
  TemperamentAxis,
  RunSummary,
  World,
} from '@je/contracts';
import type { Run } from '@je/kernel';
import type { Impression } from '@je/client-web';
import { formatDiagnostics, hasErrors, loadContent, memorySource } from '@je/mod-content';
import { ageOf, assembleLibrary, type RawLibrary } from '@je/mod-people';

/* ------------------------------------------------------------------ the people library in the page */

/** Builds the people library from the bundled library files (keyed by file name, like a source port). */
export function libraryFromFiles(files: Record<string, string>): PeopleLibrary {
  const read = (name: string): unknown => JSON.parse(files[name] ?? 'null');
  const raw: RawLibrary = {
    archetypes: read('archetypes.json'),
    quirks: read('quirks.json'),
    names: read('names.json'),
    departments: read('departments.json'),
    tables: read('tables.json'),
    appearance: read('appearance.json'),
    life_events: read('life_events.json'),
  };
  const { library, diagnostics } = assembleLibrary(raw);
  if (!library) {
    throw new Error(
      `the people library is invalid: ${diagnostics
        .filter((d) => d.severity === 'error')
        .map((d) => d.message)
        .join('; ')}`,
    );
  }
  return library;
}

/* ------------------------------------------------------------------ what a finished run tells the world */

/** The protagonist of a finished run, as the world needs to know them: what they did, how it ended, where they stand. */
export async function summariseRun(
  files: Record<string, string>,
  run: Pick<Run, 'turn' | 'snapshot'>,
  roleId: string,
  ending: string,
  profile?: PlayerProfile,
): Promise<RunSummary> {
  const { registry, diagnostics } = await loadContent(memorySource(files));
  if (!registry || hasErrors(diagnostics))
    throw new Error(`content is invalid:\n${formatDiagnostics(diagnostics)}`);
  const vars = run.snapshot()['sim-core'] as Record<string, number | string>;
  const role = registry.get('role', roleId);
  const facts = Object.entries(vars)
    .filter(([path, value]) => path.startsWith('fact.') && typeof value === 'number' && value >= 1)
    .map(([path, value]) => {
      const fact = registry.get('fact', path);
      return {
        id: path.replace(/^fact\./, ''),
        severity: fact?.severity ?? 3,
        level: Math.min(3, Number(value)),
      };
    });
  const reputation = Object.fromEntries(
    Object.entries(vars).filter(
      ([path, value]) => path.startsWith('player.rep.') && typeof value === 'number',
    ) as [string, number][],
  );
  return {
    role_id: roleId,
    department: (role?.department ?? 'dept.production')
      .replace(/^dept\./, '')
      .replace('sales_export', 'sales_export'),
    ...(profile ? { profile } : {}),
    ending,
    weeks: run.turn,
    stress: Number(vars['player.stress'] ?? 30),
    facts,
    reputation,
  };
}

/* ------------------------------------------------------------------ the people the player can see (never their true traits) */

const BUILD: Record<Locale, Record<string, string>> = {
  en: { slim: 'slim', average: 'average build', sturdy: 'sturdy', heavy: 'heavy-set' },
  vi: { slim: 'dáng gầy', average: 'dáng vừa', sturdy: 'dáng chắc', heavy: 'dáng đậm' },
};
const HEIGHT: Record<Locale, Record<string, string>> = {
  en: { short: 'short', average: 'medium height', tall: 'tall' },
  vi: { short: 'thấp', average: 'cao vừa', tall: 'cao' },
};
const HAIR: Record<Locale, Record<string, string>> = {
  en: {
    grey: 'grey hair',
    black: 'dark hair',
    dark_brown: 'dark brown hair',
    brown: 'brown hair',
    dyed_red: 'dyed red hair',
    dyed_light: 'light dyed hair',
  },
  vi: {
    grey: 'tóc bạc',
    black: 'tóc đen',
    dark_brown: 'tóc nâu sẫm',
    brown: 'tóc nâu',
    dyed_red: 'tóc nhuộm đỏ',
    dyed_light: 'tóc nhuộm sáng',
  },
};

/** A short description of how someone looks. Appearance never says anything about character. */
export function describeLook(a: Appearance | undefined, locale: Locale): string {
  if (!a) return '';
  const parts = [HEIGHT[locale][a.height], BUILD[locale][a.build], HAIR[locale][a.hair_colour]];
  if (a.glasses) parts.push(locale === 'vi' ? 'đeo kính' : 'glasses');
  if (a.facial_hair !== 'none') parts.push(locale === 'vi' ? 'có râu' : 'facial hair');
  return parts.filter(Boolean).join(', ');
}

/** What the player has worked out about people so far this run, from the perception module's snapshot. */
export function impressionsFromSnapshot(
  snapshot: unknown,
  library: PeopleLibrary,
): Record<string, Impression> {
  const rows =
    (
      snapshot as {
        impressions?: {
          id: string;
          axes: { axis: TemperamentAxis; estimate: number; confidence: number }[];
          quirks: string[];
        }[];
      } | null
    )?.impressions ?? [];
  return Object.fromEntries(
    rows.map((r) => [
      r.id,
      {
        axes: Object.fromEntries(
          r.axes.map((a) => [a.axis, { estimate: a.estimate, confidence: a.confidence }]),
        ),
        quirks: r.quirks.flatMap((q) => {
          const quirk = library.quirks.find((x) => x.id === q);
          return quirk ? [quirk.name] : [];
        }),
      },
    ]),
  );
}

export interface DossierEntry {
  id: string;
  name: string;
  /** The person's job title is not known to the player; the department is, from working with them. */
  department: string;
  /** "about 30s": the player judges age roughly. */
  ageBand: string;
  look: string;
  /** Characters the player controlled in earlier runs; the player knows what they did. */
  legacy?: string;
  retired: boolean;
}

/**
 * What the player may see of the people in a world. Temperament, values and quirks are not shown: the player
 * learns them over time (perception), and an earlier protagonist is remembered by what they did.
 */
export function dossierOf(
  world: World,
  locale: Locale,
  departmentName: (id: string) => string,
): DossierEntry[] {
  return world.people
    .filter((p) => p.status !== 'gone')
    .map((p) => entryOf(p, world.year, locale, departmentName))
    .sort(
      (a, b) => (a.legacy ? 0 : 1) - (b.legacy ? 0 : 1) || a.name.localeCompare(b.name, locale),
    );
}

function entryOf(
  p: Person,
  year: number,
  locale: Locale,
  departmentName: (id: string) => string,
): DossierEntry {
  const n = p.origin.name;
  const age = ageOf(p, year);
  const decade = Math.floor(age / 10) * 10;
  return {
    id: p.id,
    name: [n.family, n.middle, n.given].filter(Boolean).join(' '),
    department: departmentName(p.life.department),
    ageBand: locale === 'vi' ? `khoảng ${decade} tuổi` : `about ${decade}s`,
    look: describeLook(p.appearance, locale),
    ...(p.legacy
      ? {
          legacy:
            locale === 'vi'
              ? `Nhân vật bạn từng điều khiển (lần chơi ${p.legacy.run_no}): ${p.legacy.ending.replace('_', ' ')}`
              : `A character you once played (run ${p.legacy.run_no}): ${p.legacy.ending.replace('_', ' ')}`,
        }
      : {}),
    retired: p.status === 'retired',
  };
}

/* ------------------------------------------------------------------ the save host */

export interface WorldListing {
  id: string;
  name: string;
  year: number;
  runs: number;
  people: number;
  updated: string;
}

/** A small client for the local save host. Every call fails soft: no host means no worlds, and the game still plays. */
export class SaveHostClient {
  constructor(private readonly base = 'http://127.0.0.1:5190') {}

  private async call(path: string, init: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(this.base + path, {
        ...init,
        headers: { 'x-jobex': '1', 'content-type': 'application/json', ...(init.headers ?? {}) },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async available(): Promise<boolean> {
    try {
      const r = await this.call('/ping', {}, 800);
      return r.ok;
    } catch {
      return false;
    }
  }

  async list(): Promise<WorldListing[]> {
    const r = await this.call('/worlds');
    return ((await r.json()) as { worlds: WorldListing[] }).worlds;
  }

  async get(id: string): Promise<World> {
    const r = await this.call(`/worlds/${id}`);
    if (!r.ok)
      throw new Error(
        ((await r.json()) as { error?: string }).error ?? `could not read world ${id}`,
      );
    return (await r.json()) as World;
  }

  async put(world: World): Promise<void> {
    const r = await this.call(
      `/worlds/${world.id}`,
      { method: 'PUT', body: JSON.stringify(world) },
      15000,
    );
    if (!r.ok)
      throw new Error(
        ((await r.json()) as { error?: string }).error ?? 'the world could not be saved',
      );
  }

  async putRun(worldId: string, name: string, body: unknown): Promise<void> {
    const r = await this.call(
      `/worlds/${worldId}/runs/${name}`,
      { method: 'PUT', body: JSON.stringify(body) },
      15000,
    );
    if (!r.ok) throw new Error('the run could not be saved');
  }

  async remove(id: string): Promise<void> {
    await this.call(`/worlds/${id}`, { method: 'DELETE' });
  }
}

/** A readable, safe world id from a name ("My Factory!" becomes "my-factory"), made unique among the existing ids. */
export function worldIdFrom(name: string, existing: readonly string[]): string {
  const base =
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'world';
  let id = base;
  for (let i = 2; existing.includes(id); i++) id = `${base}-${i}`;
  return id;
}
