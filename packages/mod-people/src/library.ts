import {
  EDUCATION_LEVELS,
  GENDERS,
  HIRING_PATHS,
  MARITAL_STATUSES,
  PERSON_VALUES,
  REGIONS,
  TEMPERAMENT_AXES,
} from '@je/contracts';
import type { PeopleLibrary } from '@je/contracts';

export interface LibraryDiagnostic {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  where?: string;
}

/** The raw pieces the library is assembled from (one JSON file each in `library/`). */
export interface RawLibrary {
  archetypes: unknown;
  quirks: unknown;
  names: unknown;
  departments: unknown;
  tables: unknown;
}

export interface LibraryResult {
  library?: PeopleLibrary;
  diagnostics: LibraryDiagnostic[];
}

const LIBRARY_VERSION = 1;
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/**
 * Checks the people library the way the content validator checks packs: every reference exists, every
 * probability row adds up, every age is covered, and every number is in range. Returns the typed library
 * only when there are no errors.
 */
export function assembleLibrary(raw: RawLibrary): LibraryResult {
  const diagnostics: LibraryDiagnostic[] = [];
  const err = (code: string, message: string, where?: string): void => {
    diagnostics.push({ severity: 'error', code, message, ...(where ? { where } : {}) });
  };
  const warn = (code: string, message: string, where?: string): void => {
    diagnostics.push({ severity: 'warning', code, message, ...(where ? { where } : {}) });
  };

  const archetypes = Array.isArray(raw.archetypes)
    ? (raw.archetypes as Record<string, unknown>[])
    : [];
  const quirks = Array.isArray(raw.quirks) ? (raw.quirks as Record<string, unknown>[]) : [];
  if (archetypes.length === 0) err('archetypes.empty', 'there must be at least one archetype');
  if (quirks.length === 0) err('quirks.empty', 'there must be at least one quirk');

  // Archetypes
  const archetypeIds = new Set<string>();
  const quirkIds = new Set(quirks.map((q) => String(q.id)));
  for (const a of archetypes) {
    const id = String(a.id);
    if (archetypeIds.has(id)) err('archetype.duplicate', `duplicate archetype "${id}"`, id);
    archetypeIds.add(id);
    if (!isNum(a.weight) || a.weight <= 0) err('archetype.weight', 'weight must be above 0', id);
    checkText(a.name, `archetype ${id} name`, err);
    const temperament = isRecord(a.temperament) ? a.temperament : {};
    for (const [axis, pair] of Object.entries(temperament)) {
      if (!(TEMPERAMENT_AXES as readonly string[]).includes(axis)) {
        err('archetype.axis', `unknown temperament axis "${axis}"`, id);
        continue;
      }
      if (!Array.isArray(pair) || pair.length !== 2 || !isNum(pair[0]) || !isNum(pair[1])) {
        err('archetype.axis', `axis "${axis}" must be [mean, spread]`, id);
      } else if (pair[0] < 0 || pair[0] > 100 || pair[1] <= 0 || pair[1] > 50) {
        err(
          'archetype.axis',
          `axis "${axis}" has a mean outside 0-100 or a spread outside 1-50`,
          id,
        );
      }
    }
    for (const key of Object.keys(isRecord(a.value_affinity) ? a.value_affinity : {})) {
      if (!(PERSON_VALUES as readonly string[]).includes(key)) {
        err('archetype.value', `unknown value "${key}"`, id);
      }
    }
    for (const key of Object.keys(isRecord(a.quirk_affinity) ? a.quirk_affinity : {})) {
      if (!quirkIds.has(key)) err('archetype.quirk', `unknown quirk "${key}"`, id);
    }
  }

  // Quirks
  const seenQuirk = new Set<string>();
  const incompatible = new Map<string, Set<string>>();
  for (const q of quirks) {
    const id = String(q.id);
    if (seenQuirk.has(id)) err('quirk.duplicate', `duplicate quirk "${id}"`, id);
    seenQuirk.add(id);
    if (!isNum(q.weight) || q.weight <= 0) err('quirk.weight', 'weight must be above 0', id);
    checkText(q.name, `quirk ${id} name`, err);
    for (const other of (q.incompatible_with as string[] | undefined) ?? []) {
      if (!quirkIds.has(other)) err('quirk.incompatible', `unknown quirk "${other}"`, id);
      const set = incompatible.get(id) ?? new Set<string>();
      set.add(other);
      incompatible.set(id, set);
    }
    for (const axis of Object.keys(isRecord(q.temperament_shift) ? q.temperament_shift : {})) {
      if (!(TEMPERAMENT_AXES as readonly string[]).includes(axis)) {
        err('quirk.axis', `unknown temperament axis "${axis}"`, id);
      }
    }
  }
  for (const [id, others] of incompatible) {
    for (const other of others) {
      if (!incompatible.get(other)?.has(id)) {
        warn('quirk.asymmetric', `"${id}" excludes "${other}" but not the other way round`, id);
      }
    }
  }

  // Names
  const names = isRecord(raw.names) ? raw.names : {};
  const checkNames = (list: unknown, where: string): void => {
    if (!Array.isArray(list) || list.length === 0) {
      err('names.empty', 'needs at least one name', where);
      return;
    }
    for (const n of list as Record<string, unknown>[]) {
      if (typeof n.name !== 'string' || n.name.trim() === '')
        err('names.name', 'a name is empty', where);
      if (!isNum(n.weight) || n.weight <= 0)
        err('names.weight', `weight of "${String(n.name)}" must be above 0`, where);
    }
  };
  checkNames(names.family, 'names.family');
  for (const g of GENDERS) {
    checkNames(isRecord(names.middle) ? names.middle[g] : undefined, `names.middle.${g}`);
    checkNames(isRecord(names.given) ? names.given[g] : undefined, `names.given.${g}`);
  }

  // Departments
  const departments = Array.isArray(raw.departments)
    ? (raw.departments as Record<string, unknown>[])
    : [];
  if (departments.length === 0) err('departments.empty', 'there must be at least one department');
  const seenDept = new Set<string>();
  for (const d of departments) {
    const id = String(d.department);
    if (seenDept.has(id)) err('department.duplicate', `duplicate department "${id}"`, id);
    seenDept.add(id);
    if (!isNum(d.female_share) || d.female_share < 0 || d.female_share > 1)
      err('department.share', 'female_share must be 0 to 1', id);
    if (!isNum(d.age_sd) || d.age_sd <= 0) err('department.age', 'age_sd must be above 0', id);
    if (
      !isNum(d.age_min) ||
      !isNum(d.age_max) ||
      d.age_min < 16 ||
      d.age_max > 80 ||
      d.age_min >= d.age_max
    ) {
      err('department.age', 'age_min and age_max must satisfy 16 <= min < max <= 80', id);
    }
    if (
      isNum(d.age_mean) &&
      isNum(d.age_min) &&
      isNum(d.age_max) &&
      (d.age_mean < d.age_min || d.age_mean > d.age_max)
    ) {
      err('department.age', 'age_mean must lie between age_min and age_max', id);
    }
    if (!(EDUCATION_LEVELS as readonly string[]).includes(String(d.min_education)))
      err('department.education', `unknown education "${String(d.min_education)}"`, id);
    if (!isNum(d.income_base_vnd) || d.income_base_vnd <= 0)
      err('department.income', 'income_base_vnd must be above 0', id);
  }

  // Tables
  const tables = isRecord(raw.tables) ? raw.tables : {};
  const rowsOf = (key: string): Record<string, unknown>[] => {
    const t = tables[key];
    if (!isRecord(t) || !Array.isArray(t.rows) || t.rows.length === 0) {
      err('table.missing', `table "${key}" is missing or has no rows`, key);
      return [];
    }
    if (typeof t.source !== 'string' || t.source.trim() === '')
      err('table.source', 'every table must name its source', key);
    if (!isNum(t.year)) err('table.year', 'every table must have a year', key);
    if (t.verified !== true) {
      diagnostics.push({
        severity: 'info',
        code: 'table.unverified',
        message: 'numbers not yet checked against the source',
        where: key,
      });
    }
    return t.rows as Record<string, unknown>[];
  };
  const sums = (rows: Record<string, unknown>[], keys: readonly string[], where: string): void => {
    for (const r of rows) {
      const total = keys.reduce((s, k) => s + (isNum(r[k]) ? (r[k] as number) : 0), 0);
      if (Math.abs(total - 1) > 0.02)
        err(
          'table.sum',
          `row ${JSON.stringify(r).slice(0, 80)} adds up to ${total.toFixed(3)}, not 1`,
          where,
        );
      for (const k of keys)
        if (!isNum(r[k]) || (r[k] as number) < 0)
          err('table.value', `"${k}" must be a number, 0 or more`, where);
    }
  };
  const coverAges = (
    rows: Record<string, unknown>[],
    genders: readonly string[],
    where: string,
  ): void => {
    for (const g of genders) {
      const mine = rows.filter(
        (r) => r.gender === g || r.gender === 'any' || r.gender === undefined,
      );
      for (let age = 18; age <= 65; age++) {
        if (
          !mine.some(
            (r) => isNum(r.age_from) && isNum(r.age_to) && r.age_from <= age && age <= r.age_to,
          )
        ) {
          err('table.coverage', `no row for age ${age}, gender ${g}`, where);
          break;
        }
      }
    }
  };
  const regionRows = rowsOf('region_weights');
  for (const r of REGIONS)
    if (!regionRows.some((x) => x.region === r))
      err('table.coverage', `region ${r} missing`, 'region_weights');
  const settlementRows = rowsOf('settlement_by_region');
  for (const r of REGIONS)
    if (!settlementRows.some((x) => x.region === r))
      err('table.coverage', `region ${r} missing`, 'settlement_by_region');
  const eduRows = rowsOf('education_by_age');
  sums(eduRows, EDUCATION_LEVELS, 'education_by_age');
  coverAges(eduRows, ['female', 'male'], 'education_by_age');
  const marRows = rowsOf('marital_by_age');
  sums(marRows, MARITAL_STATUSES, 'marital_by_age');
  coverAges(marRows, ['female', 'male'], 'marital_by_age');
  const childRows = rowsOf('children_by_age');
  coverAges(childRows, ['any'], 'children_by_age');
  const sexRows = rowsOf('birth_sex_ratio');
  if (sexRows.some((r) => !isNum(r.male_share) || r.male_share <= 0.4 || r.male_share >= 0.6)) {
    err('table.value', 'male_share must be between 0.4 and 0.6', 'birth_sex_ratio');
  }
  const gapRows = rowsOf('spouse_age_gap');
  if (gapRows.some((r) => !isNum(r.husband_older_mean) || !isNum(r.spread) || r.spread <= 0)) {
    err('table.value', 'needs husband_older_mean and a spread above 0', 'spouse_age_gap');
  }
  const hireRows = rowsOf('hiring_paths');
  for (const p of HIRING_PATHS)
    if (!hireRows.some((x) => x.path === p))
      err('table.coverage', `hiring path ${p} missing`, 'hiring_paths');

  if (diagnostics.some((d) => d.severity === 'error')) return { diagnostics };
  return {
    library: {
      version: LIBRARY_VERSION,
      archetypes: archetypes as unknown as PeopleLibrary['archetypes'],
      quirks: quirks as unknown as PeopleLibrary['quirks'],
      names: raw.names as PeopleLibrary['names'],
      departments: departments as unknown as PeopleLibrary['departments'],
      tables: raw.tables as PeopleLibrary['tables'],
    },
    diagnostics,
  };
}

function checkText(
  text: unknown,
  where: string,
  err: (code: string, message: string, where?: string) => void,
): void {
  if (
    !isRecord(text) ||
    typeof text.en !== 'string' ||
    typeof text.vi !== 'string' ||
    text.en.trim() === '' ||
    text.vi.trim() === ''
  ) {
    err('text.missing', 'needs both an English and a Vietnamese text', where);
  }
}
