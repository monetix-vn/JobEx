#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Person, PeopleLibrary } from '@je/contracts';
import { assembleLibrary, generatePerson, summarisePeople, type RawLibrary } from '@je/mod-people';

const args = process.argv.slice(2);
const command = args[0] ?? 'help';
const opt = (name: string, fallback?: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const dir = resolve(opt('library', 'library') as string);
const read = (name: string): unknown => JSON.parse(readFileSync(join(dir, name), 'utf8'));

function load(): { library?: PeopleLibrary; ok: boolean } {
  const raw: RawLibrary = {
    archetypes: read('archetypes.json'),
    quirks: read('quirks.json'),
    names: read('names.json'),
    departments: read('departments.json'),
    tables: read('tables.json'),
  };
  const { library, diagnostics } = assembleLibrary(raw);
  const shown = diagnostics.filter((d) => d.severity !== 'info' || args.includes('--verbose'));
  for (const d of shown)
    console.log(
      `${d.severity.toUpperCase().padEnd(7)} ${d.code}${d.where ? ` [${d.where}]` : ''}: ${d.message}`,
    );
  const errors = diagnostics.filter((d) => d.severity === 'error').length;
  const warnings = diagnostics.filter((d) => d.severity === 'warning').length;
  const unverified = diagnostics.filter((d) => d.code === 'table.unverified').length;
  console.log(
    `library: ${errors} error(s), ${warnings} warning(s), ${unverified} table(s) not yet verified against their source`,
  );
  return {
    ...(library ? { library } : {}),
    ok: errors === 0 && !(args.includes('--strict') && warnings > 0),
  };
}

const pct = (x: number): string => `${(x * 100).toFixed(1)}%`;
const row = (label: string, values: Record<string, number>, fmt = pct): string =>
  `  ${label}: ${Object.entries(values)
    .filter(([, v]) => v > 0.0005)
    .map(([k, v]) => `${k} ${fmt(v)}`)
    .join(', ')}`;

function describe(p: Person, library: PeopleLibrary): string {
  const n = p.origin.name;
  const archetype =
    library.archetypes.find((a) => a.id === p.origin.archetype)?.name.en ?? p.origin.archetype;
  const quirks = p.origin.quirks
    .map((id) => library.quirks.find((q) => q.id === id)?.name.en ?? id)
    .join('; ');
  return `${[n.family, n.middle, n.given].filter(Boolean).join(' ')} (${p.origin.gender[0]}, ${p.origin.age_at_creation}) ${archetype}; ${quirks}; values: ${p.origin.values.join('/')}; ${p.life.marital}, ${p.life.children} child(ren), debt ${Math.round(p.life.debt_vnd / 1e6)}M`;
}

if (command === 'validate') {
  const { ok } = load();
  process.exitCode = ok ? 0 : 1;
} else if (command === 'generate') {
  const { library, ok } = load();
  if (!library || !ok) process.exit(1);
  const n = Number(opt('n', '200'));
  const department = opt('department', opt('company', 'production')) as string;
  const seeds = {
    world_seed: opt('world', 'workbench-world') as string,
    run_seed: opt('seed', 'workbench-run') as string,
  };
  const story = opt('function');
  const people: Person[] = [];
  const started = performance.now();
  for (let i = 0; i < n; i++) {
    people.push(
      generatePerson(
        library,
        {
          department,
          event_id: `workbench-${department}`,
          counter: i,
          ...(story ? { story_function: story } : {}),
        },
        { seeds, created_turn: 0 },
      ),
    );
  }
  const ms = performance.now() - started;
  const s = summarisePeople(people);
  const dept = library.departments.find((d) => d.department === department)!;
  console.log(
    `\n${n} people for "${department}" in ${ms.toFixed(0)} ms (world "${seeds.world_seed}", run "${seeds.run_seed}")`,
  );
  console.log(
    `  women ${pct(s.female_share)} (department target ${pct(dept.female_share)}); age ${s.age_mean.toFixed(1)} +/- ${s.age_sd.toFixed(1)} (target ${dept.age_mean} +/- ${dept.age_sd})`,
  );
  console.log(row('education', s.education));
  console.log(row('marital', s.marital));
  console.log(row('married by age band', s.married_by_band));
  console.log(
    `  children ${s.children_mean.toFixed(2)}, dependents ${s.dependents_mean.toFixed(2)}, money pressure ${s.money_pressure_mean.toFixed(1)}`,
  );
  console.log(row('temperament mean', s.temperament_mean, (v) => v.toFixed(0)));
  console.log(row('archetypes', s.archetypes));
  const topQuirks = Object.fromEntries(
    Object.entries(s.quirks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8),
  );
  console.log(row('top quirks', topQuirks));
  console.log(`  distinct full names: ${s.names_distinct} of ${n}`);
  console.log('\nsample:');
  for (const p of people.slice(0, Number(opt('sample', '8'))))
    console.log(`  - ${describe(p, library)}`);
} else {
  console.log(`people workbench
  pnpm people:validate [--strict] [--verbose] [--library <dir>]
  pnpm people:generate --n 200 --department hr [--function tempter] [--world W] [--seed R] [--sample 8]`);
}
