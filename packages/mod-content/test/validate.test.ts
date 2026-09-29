import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { Run } from '@je/kernel';
import {
  contentModule,
  formatDiagnostic,
  hasErrors,
  loadContent,
  memorySource,
  semverAtLeast,
  type Diagnostic,
} from '../src';

const j = (value: unknown): string => JSON.stringify(value);

const scene = (extra: object = {}) => ({
  id: 'scene.a',
  location: 'loc.room',
  lines: [{ speaker: 'x', text_key: 'k.line' }],
  ...extra,
});
const event = (extra: object = {}) => ({ id: 'event.a', scene: 'scene.a', ...extra });
const locale = { 'k.line': 'hi' };

/** A minimal valid pack, with overrides per file path. */
function pack(overrides: Record<string, string | null> = {}): Record<string, string> {
  const files: Record<string, string> = {
    'core/manifest.json': j({
      id: 'core',
      version: '1.0.0',
      layer: 'core',
      engine_min_version: '0.1.0',
    }),
    'core/scenes/a.json': j(scene()),
    'core/events/a.json': j(event()),
    'core/locale/en.json': j(locale),
    'core/locale/vi.json': j(locale),
  };
  for (const [path, text] of Object.entries(overrides)) {
    if (text === null) delete files[path];
    else files[path] = text;
  }
  return files;
}

const load = (files: Record<string, string>) => loadContent(memorySource(files));
const codes = (ds: Diagnostic[], severity?: string): string[] =>
  ds.filter((d) => !severity || d.severity === severity).map((d) => d.code);

describe('valid packs', () => {
  it('load into a registry with merged content', async () => {
    const { registry, diagnostics } = await load(pack());
    expect(hasErrors(diagnostics)).toBe(false);
    expect(registry?.get('scene', 'scene.a')?.location).toBe('loc.room');
    expect(registry?.text('vi', 'k.line')).toBe('hi');
    expect(registry?.counts()).toEqual({ role: 0, event: 1, scene: 1, offer: 0 });
  });

  it('the real content directory validates with zero errors and zero warnings', async () => {
    const root = join(import.meta.dirname, '..', '..', '..', 'content');
    const files: Record<string, string> = {};
    const walk = (dir: string, prefix: string): void => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        const rel = prefix ? `${prefix}/${name}` : name;
        if (statSync(full).isDirectory()) walk(full, rel);
        else files[rel] = readFileSync(full, 'utf8');
      }
    };
    walk(root, '');
    const { registry, diagnostics } = await load(files);
    expect(diagnostics.filter((d) => d.severity !== 'info').map(formatDiagnostic)).toEqual([]);
    expect(registry?.packs.map((p) => p.id)).toEqual(['core', 'industry-cookware']);
    expect(registry?.get('role', 'role.sales.export.specialist')?.reports_to).toBe(
      'role.sales.export.manager',
    );
  });
});

describe('broken packs give clear errors', () => {
  it('reports unparseable JSON with the file name', async () => {
    const { diagnostics } = await load(pack({ 'core/scenes/a.json': '{ nope' }));
    const d = diagnostics.find((x) => x.code === 'json.parse');
    expect(d?.file).toBe('core/scenes/a.json');
    expect(d?.severity).toBe('error');
  });

  it('reports schema violations with file and path, including typos', async () => {
    const { diagnostics, registry } = await load(
      pack({ 'core/scenes/a.json': j(scene({ lines: [{ speeker: 'x', text_key: 'k' }] })) }),
    );
    expect(registry).toBeUndefined();
    const bad = diagnostics.filter((d) => d.code === 'schema.invalid');
    expect(bad.some((d) => d.file === 'core/scenes/a.json' && d.message.includes('speeker'))).toBe(
      true,
    );
    expect(bad.some((d) => d.message.includes('required') && d.path?.startsWith('/lines/0'))).toBe(
      true,
    );
  });

  it('reports an unknown reference', async () => {
    const { diagnostics } = await load(
      pack({ 'core/events/a.json': j(event({ scene: 'scene.missing' })) }),
    );
    const d = diagnostics.find((x) => x.code === 'ref.missing');
    expect(d?.message).toContain('scene "scene.missing"');
    expect(d?.file).toBe('core/events/a.json');
  });

  it('reports a schedule effect pointing at a missing event', async () => {
    const eff = { effects: [{ schedule: 'event.ghost', delay_weeks: [1, 2] }] };
    const { diagnostics } = await load(pack({ 'core/events/a.json': j(event(eff)) }));
    expect(codes(diagnostics, 'error')).toContain('ref.missing');
  });

  it('reports a text key missing in one language', async () => {
    const { diagnostics } = await load(pack({ 'core/locale/vi.json': j({}) }));
    const d = diagnostics.find((x) => x.code === 'locale.missing');
    expect(d?.message).toContain('"k.line"');
    expect(d?.message).toContain('vi');
    expect(diagnostics.filter((x) => x.code === 'locale.missing')).toHaveLength(1);
  });

  it('reports invalid expressions and bad variable paths', async () => {
    const bad = pack({
      'core/events/a.json': j(event({ when: { all: [{ nope: [1] }, { gte: ['Has Space', 1] }] } })),
    });
    const { diagnostics } = await load(bad);
    expect(codes(diagnostics, 'error')).toEqual(
      expect.arrayContaining(['expr.invalid', 'expr.bad_var']),
    );
  });

  it('reports outcome probabilities that do not sum to 1 and duplicate choice ids', async () => {
    const choice = (id: string, p: number) => ({
      id,
      text_key: 'k.line',
      outcomes: [{ p, narration_key: 'k.line' }],
    });
    const s = scene({ choices: [choice('c1', 0.5), choice('c1', 1)] });
    const { diagnostics } = await load(pack({ 'core/scenes/a.json': j(s) }));
    expect(codes(diagnostics, 'error')).toEqual(
      expect.arrayContaining(['scene.probability', 'scene.duplicate_choice']),
    );
  });

  it('reports a missing manifest, duplicate pack ids and an engine that is too old', async () => {
    expect(codes((await load(pack({ 'core/manifest.json': null }))).diagnostics)).toContain(
      'pack.no_manifest',
    );
    const dup = pack({
      'other/manifest.json': j({
        id: 'core',
        version: '1.0.0',
        layer: 'core',
        engine_min_version: '0.1.0',
      }),
    });
    expect(codes((await load(dup)).diagnostics)).toContain('pack.duplicate');
    const old = pack({
      'core/manifest.json': j({
        id: 'core',
        version: '1.0.0',
        layer: 'core',
        engine_min_version: '9.0.0',
      }),
    });
    expect(codes((await load(old)).diagnostics)).toContain('pack.engine_too_old');
  });

  it('reports duplicate ids inside a pack', async () => {
    const { diagnostics } = await load(pack({ 'core/scenes/b.json': j(scene()) }));
    expect(codes(diagnostics)).toContain('content.duplicate');
  });
});

describe('layers and dependencies', () => {
  const industry = (extra: Record<string, unknown> = {}) =>
    j({
      id: 'ind',
      version: '1.0.0',
      layer: 'industry',
      engine_min_version: '0.1.0',
      depends_on: ['core'],
      ...extra,
    });

  it('lets a later layer override an earlier one and orders packs by layer', async () => {
    const files = pack({
      'ind/manifest.json': industry(),
      'ind/scenes/a.json': j(scene({ location: 'loc.override' })),
      'ind/locale/en.json': j({}),
      'ind/locale/vi.json': j({}),
    });
    const { registry, diagnostics } = await load(files);
    expect(registry?.get('scene', 'scene.a')?.location).toBe('loc.override');
    expect(registry?.packs.map((p) => p.id)).toEqual(['core', 'ind']);
    expect(codes(diagnostics, 'info')).toContain('content.override');
  });

  it('rejects two packs defining the same id in the same layer', async () => {
    const files = pack({
      'core2/manifest.json': j({
        id: 'core2',
        version: '1.0.0',
        layer: 'core',
        engine_min_version: '0.1.0',
      }),
      'core2/scenes/a.json': j(scene()),
    });
    expect(codes((await load(files)).diagnostics, 'error')).toContain('content.conflict');
  });

  it('reports missing dependencies, dependencies on a later layer, and cycles', async () => {
    const missing = pack({ 'ind/manifest.json': industry({ depends_on: ['nope'] }) });
    expect(codes((await load(missing)).diagnostics)).toContain('pack.missing_dependency');

    const backwards = pack({
      'core/manifest.json': j({
        id: 'core',
        version: '1.0.0',
        layer: 'core',
        engine_min_version: '0.1.0',
        depends_on: ['ind'],
      }),
      'ind/manifest.json': industry(),
    });
    expect(codes((await load(backwards)).diagnostics)).toContain('pack.layer_order');

    const cyc = pack({
      'a/manifest.json': j({
        id: 'a',
        version: '1.0.0',
        layer: 'mods',
        engine_min_version: '0.1.0',
        depends_on: ['b'],
      }),
      'b/manifest.json': j({
        id: 'b',
        version: '1.0.0',
        layer: 'mods',
        engine_min_version: '0.1.0',
        depends_on: ['a'],
      }),
    });
    expect(codes((await load(cyc)).diagnostics)).toContain('pack.cycle');
  });
});

describe('warnings', () => {
  it('flags an event that can never fire and a scene nothing uses', async () => {
    const files = pack({
      'core/events/a.json': j(event({ when: false })),
      'core/scenes/unused.json': j(scene({ id: 'scene.unused' })),
    });
    const { diagnostics, registry } = await load(files);
    expect(registry).toBeDefined();
    expect(codes(diagnostics, 'warning')).toEqual(
      expect.arrayContaining(['event.unreachable', 'scene.unused']),
    );
  });

  it('does not flag a zero-weight event that another event schedules', async () => {
    const files = pack({
      'core/events/a.json': j([
        event({ effects: [{ schedule: 'event.b', delay_weeks: [1, 2] }] }),
        event({ id: 'event.b', weight: 0 }),
      ]),
    });
    expect(codes((await load(files)).diagnostics, 'warning')).not.toContain('event.unreachable');
  });
});

describe('module and helpers', () => {
  it('mod-content announces loaded content when a run starts', async () => {
    const { registry } = await load(pack());
    const run = new Run({
      seed: 's',
      modules: [contentModule],
      configs: { 'mod-content': { registry } },
    });
    run.start();
    const loaded = run.entries.find((e) => e.type === 'content.loaded');
    expect(loaded?.payload).toEqual({
      packs: [{ id: 'core', version: '1.0.0' }],
      counts: { role: 0, event: 1, scene: 1, offer: 0 },
    });
  });

  it('refuses to start without a registry', () => {
    expect(() => new Run({ seed: 's', modules: [contentModule] })).toThrow(/registry/);
  });

  it('compares versions', () => {
    expect(semverAtLeast('0.2.0', '0.1.9')).toBe(true);
    expect(semverAtLeast('0.1.0', '0.1.0')).toBe(true);
    expect(semverAtLeast('1.0.0', '1.0.1')).toBe(false);
    expect(semverAtLeast('x', '1.0.0')).toBe(false);
  });
});
