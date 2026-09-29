import { describe, expect, it } from 'vitest';
import {
  ALL_SCHEMAS,
  CONTRACTS_VERSION,
  ENGINE_VERSION,
  EVENT_VERSIONS,
  PACK_FOLDERS,
  PACK_LAYERS,
  PACK_SCHEMAS,
  SCHEMA_IDS,
  TURN_PHASES,
  WEEKS_PER_YEAR,
} from '../src';

describe('contracts', () => {
  it('versions every core event type and names them noun.pastVerb style', () => {
    for (const [type, version] of Object.entries(EVENT_VERSIONS)) {
      expect(version).toBeGreaterThanOrEqual(1);
      expect(type).toMatch(/^[a-z]+\.[a-z][A-Za-z]*$/);
    }
  });

  it('has stable constants', () => {
    expect(CONTRACTS_VERSION).toBe(1);
    expect(ENGINE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(WEEKS_PER_YEAR).toBe(52);
    expect(TURN_PHASES).toEqual(['start', 'plan', 'resolve', 'consequence', 'end']);
    expect(PACK_LAYERS).toEqual(['core', 'region', 'industry', 'arcs', 'mods']);
  });

  it('publishes one schema per pack kind, all with unique ids', () => {
    const ids = (ALL_SCHEMAS as { $id: string }[]).map((s) => s.$id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const kind of Object.values(PACK_FOLDERS)) {
      expect((PACK_SCHEMAS[kind] as { $id: string }).$id).toBe(SCHEMA_IDS[kind]);
    }
  });
});
