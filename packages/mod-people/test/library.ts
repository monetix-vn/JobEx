import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { assembleLibrary, type RawLibrary } from '../src';

const dir = join(import.meta.dirname, '..', '..', '..', 'library');
const read = (name: string): unknown => JSON.parse(readFileSync(join(dir, name), 'utf8'));

export const rawLibrary = (): RawLibrary => ({
  archetypes: read('archetypes.json'),
  quirks: read('quirks.json'),
  names: read('names.json'),
  departments: read('departments.json'),
  tables: read('tables.json'),
  appearance: read('appearance.json'),
  life_events: read('life_events.json'),
});

export function loadLibrary() {
  const result = assembleLibrary(rawLibrary());
  if (!result.library) {
    throw new Error(
      result.diagnostics
        .filter((d) => d.severity === 'error')
        .map((d) => d.message)
        .join('\n'),
    );
  }
  return result.library;
}
