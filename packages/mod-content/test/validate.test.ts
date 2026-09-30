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
    expect(registry?.counts()).toEqual({
      role: 0,
      event: 1,
      scene: 1,
      offer: 0,
      fact: 0,
      term: 0,
      character: 0,
      arc: 0,
    });
  });

  it('ignores markdown notes placed next to the content, without a warning', async () => {
    const { diagnostics } = await load({ ...pack(), 'p/events/README.md': '# notes' });
    expect(diagnostics.filter((d) => d.code === 'file.ignored')).toEqual([]);
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

describe('facts', () => {
  const fact = (extra: object = {}) => ({
    id: 'fact.took_fee',
    category: 'integrity',
    severity: 7,
    text_key: 'k.fact',
    consequences: { witnessed: { boss: -4 }, public: { boss: -9, buyer: -5 } },
    ...extra,
  });
  const choiceWith = (effects: object[]) => ({
    choices: [
      { id: 'c1', text_key: 'k.line', outcomes: [{ p: 1, narration_key: 'k.line', effects }] },
    ],
  });
  const withFact = (extra: Record<string, string | null> = {}) =>
    pack({
      'core/facts/f.json': j(fact()),
      'core/locale/en.json': j({ ...locale, 'k.fact': 'the fee you took' }),
      'core/locale/vi.json': j({ ...locale, 'k.fact': 'khoản phí bạn đã nhận' }),
      'core/scenes/a.json': j(
        scene(choiceWith([{ fact: 'fact.took_fee', visibility: 'private' }])),
      ),
      ...extra,
    });

  it('loads a fact, its consequences and its text', async () => {
    const { registry, diagnostics } = await load(withFact());
    expect(diagnostics.filter((d) => d.severity !== 'info')).toEqual([]);
    expect(registry?.get('fact', 'fact.took_fee')?.consequences?.public).toEqual({
      boss: -9,
      buyer: -5,
    });
    expect(registry?.text('vi', 'k.fact')).toBe('khoản phí bạn đã nhận');
  });

  it('rejects an effect that produces a fact nobody defined', async () => {
    const files = withFact({
      'core/scenes/a.json': j(scene(choiceWith([{ fact: 'fact.ghost', visibility: 'private' }]))),
    });
    const { diagnostics } = await load(files);
    const d = diagnostics.find((x) => x.code === 'ref.missing');
    expect(d?.message).toContain('fact "fact.ghost"');
  });

  it('warns about a fact that no effect ever produces', async () => {
    const { diagnostics } = await load(withFact({ 'core/scenes/a.json': j(scene()) }));
    expect(diagnostics.find((d) => d.code === 'fact.unused')?.message).toContain('fact.took_fee');
  });

  it('requires the fact text in both languages', async () => {
    const { diagnostics } = await load(withFact({ 'core/locale/vi.json': j(locale) }));
    expect(diagnostics.find((d) => d.code === 'locale.missing')?.message).toContain('"k.fact"');
  });

  it('rejects an unknown reputation group, a bad severity and stray fields', async () => {
    const bad = (extra: object) => load(withFact({ 'core/facts/f.json': j(fact(extra)) }));
    expect(
      codes((await bad({ consequences: { public: { mayor: -5 } } })).diagnostics, 'error'),
    ).toContain('schema.invalid');
    expect(codes((await bad({ severity: 11 })).diagnostics, 'error')).toContain('schema.invalid');
    expect(codes((await bad({ colour: 'red' })).diagnostics, 'error')).toContain('schema.invalid');
  });

  it('an event condition that reads a fact with a default is not called unreachable', async () => {
    const files = withFact({
      'core/events/a.json': j(event({ when: { gte: [{ var: ['fact.took_fee', 0] }, 2] } })),
    });
    const { diagnostics } = await load(files);
    expect(codes(diagnostics, 'warning')).not.toContain('event.unreachable');
  });
});

describe('glossary terms, lessons and traces', () => {
  const term = (extra: object = {}) => ({
    id: 'term.dso',
    term_key: 'k.term',
    definition_key: 'k.def',
    ...extra,
  });
  const base = (extra: Record<string, string | null> = {}) =>
    pack({
      'core/terms/t.json': j(term()),
      'core/scenes/a.json': j(scene({ terms: ['term.dso'] })),
      'core/locale/en.json': j({ ...locale, 'k.term': 'DSO', 'k.def': 'Days sales outstanding.' }),
      'core/locale/vi.json': j({
        ...locale,
        'k.term': 'DSO',
        'k.def': 'Số ngày thu tiền bình quân.',
      }),
      ...extra,
    });

  it('loads terms and the scenes that reference them', async () => {
    const { registry, diagnostics } = await load(base());
    expect(diagnostics.filter((d) => d.severity !== 'info')).toEqual([]);
    expect(registry?.get('scene', 'scene.a')?.terms).toEqual(['term.dso']);
    expect(registry?.text('vi', 'k.def')).toContain('thu tiền');
  });

  it('rejects a scene that references an undefined term', async () => {
    const { diagnostics } = await load(
      base({ 'core/scenes/a.json': j(scene({ terms: ['term.ghost'] })) }),
    );
    expect(diagnostics.find((d) => d.code === 'ref.missing')?.message).toContain(
      'term "term.ghost"',
    );
  });

  it('warns about a term no scene uses, and needs its text in both languages', async () => {
    const unused = await load(base({ 'core/scenes/a.json': j(scene()) }));
    expect(unused.diagnostics.find((d) => d.code === 'term.unused')?.message).toContain('term.dso');
    const untranslated = await load(base({ 'core/locale/vi.json': j(locale) }));
    const missing = untranslated.diagnostics.filter((d) => d.code === 'locale.missing');
    expect(missing.map((d) => d.message).join(' ')).toContain('"k.def"');
  });

  const fact = (extra: object = {}) => ({
    id: 'fact.took_fee',
    category: 'integrity',
    severity: 7,
    text_key: 'k.fact',
    lesson_key: 'k.lesson',
    traces: [{ type: 'payment', visibility: 0.5, detectors: ['finance', 'internal_audit'] }],
    ...extra,
  });
  const withFact = (
    extra: object = {},
    locales: Record<string, string> = { 'k.fact': 'f', 'k.lesson': 'l' },
  ) =>
    pack({
      'core/facts/f.json': j(fact(extra)),
      'core/scenes/a.json': j({
        ...scene(),
        choices: [
          {
            id: 'c1',
            text_key: 'k.line',
            outcomes: [
              {
                p: 1,
                narration_key: 'k.line',
                effects: [{ fact: 'fact.took_fee', visibility: 'private' }],
              },
            ],
          },
        ],
      }),
      'core/locale/en.json': j({ ...locale, ...locales }),
      'core/locale/vi.json': j({ ...locale, ...locales }),
    });

  it('accepts a fact with a lesson and traces, and requires the lesson text', async () => {
    const ok = await load(withFact());
    expect(ok.diagnostics.filter((d) => d.severity !== 'info')).toEqual([]);
    expect(ok.registry?.get('fact', 'fact.took_fee')?.traces?.[0]?.detectors).toEqual([
      'finance',
      'internal_audit',
    ]);
    const noLesson = await load(withFact({}, { 'k.fact': 'f' }));
    expect(noLesson.diagnostics.find((d) => d.code === 'locale.missing')?.message).toContain(
      '"k.lesson"',
    );
  });

  it('rejects a bad trace: unknown detector, empty detectors, visibility out of range', async () => {
    const bad = (trace: object) => load(withFact({ traces: [trace] }));
    const errs = async (t: object) => codes((await bad(t)).diagnostics, 'error');
    expect(await errs({ type: 'payment', visibility: 0.5, detectors: ['police'] })).toContain(
      'schema.invalid',
    );
    expect(await errs({ type: 'payment', visibility: 0.5, detectors: [] })).toContain(
      'schema.invalid',
    );
    expect(await errs({ type: 'payment', visibility: 2, detectors: ['qc'] })).toContain(
      'schema.invalid',
    );
    expect(await errs({ type: 'gossip', visibility: 0.5, detectors: ['qc'] })).toContain(
      'schema.invalid',
    );
  });
});

describe('characters and relationships', () => {
  const person = {
    id: 'char.ann',
    name_key: 'k.ann',
    title_key: 'k.ann.title',
    department: 'qc',
    home_group: 'boss',
    start: { trust: 10 },
  };
  const texts = { ...locale, 'k.ann': 'Ann', 'k.ann.title': 'Lead' };
  const withCast = (extra: object = {}, outcomeEffects: unknown[] = []) =>
    pack({
      'core/characters/c.json': j([person]),
      'core/locale/en.json': j(texts),
      'core/locale/vi.json': j(texts),
      'core/scenes/a.json': j(
        scene({
          cast: ['char:ann'],
          lines: [{ speaker: 'char:ann', text_key: 'k.line' }],
          choices: [
            {
              id: 'c1',
              text_key: 'k.line',
              outcomes: [{ p: 1, narration_key: 'k.line', effects: outcomeEffects }],
            },
          ],
          ...extra,
        }),
      ),
    });

  it('loads a character used in a scene and by a relationship effect', async () => {
    const { registry, diagnostics } = await load(
      withCast({}, [{ delta: 'rel.ann.trust', value: 3 }]),
    );
    expect(hasErrors(diagnostics)).toBe(false);
    expect(registry?.get('character', 'char.ann')?.department).toBe('qc');
    expect(codes(diagnostics, 'warning')).not.toContain('character.unused');
  });

  it('rejects an unknown speaker, an unknown character in an effect and a malformed path', async () => {
    const speaker = await load(withCast({ cast: ['char:nobody'] }));
    expect(codes(speaker.diagnostics, 'error')).toContain('ref.missing');
    const unknown = await load(withCast({}, [{ delta: 'rel.nobody.trust', value: 1 }]));
    expect(codes(unknown.diagnostics, 'error')).toContain('ref.missing');
    const bad = await load(withCast({}, [{ delta: 'rel.ann.charm', value: 1 }]));
    expect(codes(bad.diagnostics, 'error')).toContain('rel.bad_path');
  });

  it('needs the name and title in both languages, and only notes an unused character', async () => {
    const missing = await load(
      pack({
        'core/characters/c.json': j([person]),
        'core/locale/en.json': j(texts),
      }),
    );
    expect(codes(missing.diagnostics, 'error')).toContain('locale.missing');
    const unused = await load(
      pack({
        'core/characters/c.json': j([person]),
        'core/locale/en.json': j(texts),
        'core/locale/vi.json': j(texts),
      }),
    );
    expect(hasErrors(unused.diagnostics)).toBe(false);
    expect(codes(unused.diagnostics, 'info')).toContain('character.unused');
    expect(codes(unused.diagnostics, 'warning')).not.toContain('character.unused');
  });
});

describe('arcs', () => {
  const arc = {
    id: 'arc.story',
    title_key: 'k.arc',
    stages: [
      { id: 'one', event: 'event.a' },
      { id: 'two', event: 'event.b', delay_weeks: [1, 3] },
    ],
  };
  const texts = { ...locale, 'k.arc': 'Story' };
  const outcome = (effects: unknown[]) =>
    scene({
      choices: [
        { id: 'c1', text_key: 'k.line', outcomes: [{ p: 1, narration_key: 'k.line', effects }] },
      ],
    });
  const build = (effects: unknown[] = [{ arc: 'arc.story', stage: 'two' }], arcOverride = arc) =>
    pack({
      'core/arcs/s.json': j([arcOverride]),
      'core/locale/en.json': j(texts),
      'core/locale/vi.json': j(texts),
      'core/scenes/a.json': j(outcome(effects)),
      'core/scenes/b.json': j(scene({ id: 'scene.b' })),
      'core/events/a.json': j([
        event({ arc: 'arc.story' }),
        { id: 'event.b', scene: 'scene.b', weight: 0 },
      ]),
    });

  it('loads an arc whose stages are reached by a choice effect, with no warnings', async () => {
    const { registry, diagnostics } = await load(build());
    expect(hasErrors(diagnostics)).toBe(false);
    expect(codes(diagnostics, 'warning')).toEqual([]);
    expect(registry?.get('arc', 'arc.story')?.stages).toHaveLength(2);
  });

  it('rejects unknown events, arcs and stages, reserved or repeated stage ids', async () => {
    const badEvent = { ...arc, stages: [{ id: 'one', event: 'event.gone' }] };
    expect(codes((await load(build([], badEvent))).diagnostics, 'error')).toContain('ref.missing');
    expect(
      codes((await load(build([{ arc: 'arc.nope', stage: 'two' }]))).diagnostics, 'error'),
    ).toContain('ref.missing');
    expect(
      codes((await load(build([{ arc: 'arc.story', stage: 'three' }]))).diagnostics, 'error'),
    ).toContain('arc.bad_stage');
    const reserved = { ...arc, stages: [{ id: 'end', event: 'event.a' }] };
    expect(codes((await load(build([], reserved))).diagnostics, 'error')).toContain(
      'arc.bad_stage_id',
    );
    const twice = { ...arc, stages: [arc.stages[0]!, arc.stages[0]!] };
    expect(codes((await load(build([], twice))).diagnostics, 'error')).toContain(
      'arc.bad_stage_id',
    );
  });

  it('warns about a stage nothing leads to, and accepts "end" as a stage', async () => {
    const unreachable = await load(build([]));
    expect(codes(unreachable.diagnostics, 'warning')).toContain('arc.stage_unreachable');
    const ended = await load(build([{ arc: 'arc.story', stage: 'end' }]));
    expect(codes(ended.diagnostics, 'error')).toEqual([]);
  });

  it('an event that names an unknown arc is an error', async () => {
    const files = build();
    files['core/events/a.json'] = j([
      event({ arc: 'arc.nope' }),
      { id: 'event.b', scene: 'scene.b', weight: 0 },
    ]);
    expect(codes((await load(files)).diagnostics, 'error')).toContain('ref.missing');
  });
});

describe('roles in events and the job picker', () => {
  const role = {
    id: 'role.t.one',
    department: 'dept.t',
    level: 1,
    title_key: 'k.title',
    blurb_key: 'k.blurb',
  };
  const base = (extra: Record<string, string | null> = {}) =>
    pack({
      'core/roles/r.json': j(role),
      'core/events/a.json': j(event({ role: 'role.t.one' })),
      'core/locale/en.json': j({ ...locale, 'k.title': 'T', 'k.blurb': 'B' }),
      'core/locale/vi.json': j({ ...locale, 'k.title': 'T', 'k.blurb': 'B' }),
      ...extra,
    });

  it('accepts an event limited to a defined role, and a role with a blurb', async () => {
    const { registry, diagnostics } = await load(base());
    expect(diagnostics.filter((d) => d.severity !== 'info')).toEqual([]);
    expect(registry?.get('event', 'event.a')?.role).toBe('role.t.one');
  });

  it('rejects an event limited to a role nobody defined', async () => {
    const { diagnostics } = await load(
      base({ 'core/events/a.json': j(event({ role: 'role.ghost' })) }),
    );
    expect(diagnostics.find((d) => d.code === 'ref.missing')?.message).toContain(
      'role "role.ghost"',
    );
  });

  it('needs the blurb text in both languages', async () => {
    const { diagnostics } = await load(
      base({ 'core/locale/vi.json': j({ ...locale, 'k.title': 'T' }) }),
    );
    expect(diagnostics.find((d) => d.code === 'locale.missing')?.message).toContain('"k.blurb"');
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
      counts: { role: 0, event: 1, scene: 1, offer: 0, fact: 0, term: 0, character: 0, arc: 0 },
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
