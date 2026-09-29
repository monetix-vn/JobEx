import type { PackKind } from './packs';

/**
 * JSON Schema (draft-07) for pack files, version 0. Unknown fields are rejected so typos in
 * content fail loudly. Reference integrity (ids and text keys exist) is checked by the validator.
 */

const BASE = 'https://job-experiment.local/schemas/';
const idString = { type: 'string', pattern: '^[a-z][a-z0-9_]*(\\.[a-z0-9_]+)+$' };
const numberMap = { type: 'object', additionalProperties: { type: 'number' } };
const range = {
  type: 'array',
  items: { type: 'number', minimum: 0 },
  minItems: 2,
  maxItems: 2,
};
const expr = { $ref: `${BASE}expr.json` };

const exprSchema = {
  $id: `${BASE}expr.json`,
  description: 'JSON expression tree: literal, variable path (string) or single-operator object.',
  anyOf: [
    { type: 'number' },
    { type: 'string' },
    { type: 'boolean' },
    { type: 'null' },
    { type: 'object', minProperties: 1, maxProperties: 1 },
  ],
};

const effect = {
  anyOf: [
    {
      type: 'object',
      required: ['schedule', 'delay_weeks'],
      additionalProperties: false,
      properties: { schedule: idString, delay_weeks: range },
    },
    {
      type: 'object',
      required: ['delta', 'value'],
      additionalProperties: false,
      properties: { delta: { type: 'string' }, value: { type: 'number' } },
    },
    {
      type: 'object',
      required: ['fact', 'visibility'],
      additionalProperties: false,
      properties: {
        fact: idString,
        visibility: { enum: ['private', 'witnessed', 'public', 'rumor'] },
      },
    },
  ],
};

const semver = { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' };

export const manifestSchema = {
  $id: `${BASE}manifest.json`,
  type: 'object',
  required: ['id', 'version', 'layer', 'engine_min_version'],
  additionalProperties: false,
  properties: {
    id: { type: 'string', pattern: '^[a-z][a-z0-9-]*$' },
    version: semver,
    layer: { enum: ['core', 'region', 'industry', 'arcs', 'mods'] },
    engine_min_version: semver,
    depends_on: { type: 'array', items: { type: 'string' }, uniqueItems: true },
    description: { type: 'string' },
  },
};

export const roleSchema = {
  $id: `${BASE}role.json`,
  type: 'object',
  required: ['id', 'department', 'level', 'title_key'],
  additionalProperties: false,
  properties: {
    id: idString,
    department: idString,
    level: { type: 'integer', minimum: 1 },
    title_key: { type: 'string' },
    reports_to: idString,
    kpis: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'weight'],
        additionalProperties: false,
        properties: { id: idString, weight: { type: 'number', minimum: 0, maximum: 1 } },
      },
    },
    weekly_demand: {
      type: 'array',
      items: {
        type: 'object',
        required: ['task', 'per_week', 'effort_h'],
        additionalProperties: false,
        properties: {
          task: idString,
          per_week: range,
          effort_h: { type: 'number', exclusiveMinimum: 0 },
        },
      },
    },
    approval_limits: numberMap,
    skills: { type: 'array', items: { type: 'string' } },
    start_state: numberMap,
    dark_offers: { type: 'array', items: idString },
  },
};

export const eventSchema = {
  $id: `${BASE}event.json`,
  type: 'object',
  required: ['id', 'scene'],
  additionalProperties: false,
  properties: {
    id: idString,
    tags: { type: 'array', items: { type: 'string' } },
    when: expr,
    weight: { type: 'number', minimum: 0 },
    cooldown_weeks: { type: 'integer', minimum: 0 },
    arc: idString,
    scene: idString,
    effects: { type: 'array', items: effect },
  },
};

export const sceneSchema = {
  $id: `${BASE}scene.json`,
  type: 'object',
  required: ['id', 'location', 'lines'],
  additionalProperties: false,
  properties: {
    id: idString,
    location: idString,
    cast: { type: 'array', items: { type: 'string' } },
    lines: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['speaker', 'text_key'],
        additionalProperties: false,
        properties: { speaker: { type: 'string' }, text_key: { type: 'string' } },
      },
    },
    choices: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'text_key', 'outcomes'],
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          text_key: { type: 'string' },
          cost: numberMap,
          requires: expr,
          outcomes: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['p', 'narration_key'],
              additionalProperties: false,
              properties: {
                p: { type: 'number', minimum: 0, maximum: 1 },
                narration_key: { type: 'string' },
                effects: { type: 'array', items: effect },
              },
            },
          },
        },
      },
    },
  },
};

export const offerSchema = {
  $id: `${BASE}offer.json`,
  type: 'object',
  required: ['id', 'from', 'payoff', 'pressure', 'justification_key'],
  additionalProperties: false,
  properties: {
    id: idString,
    from: { type: 'string' },
    payoff: numberMap,
    pressure: {
      type: 'object',
      required: ['deadline_weeks', 'threat'],
      additionalProperties: false,
      properties: { deadline_weeks: { type: 'integer', minimum: 1 }, threat: { type: 'string' } },
    },
    justification_key: { type: 'string' },
    traces: {
      type: 'array',
      items: {
        type: 'object',
        required: ['type', 'visibility', 'detectors'],
        additionalProperties: false,
        properties: {
          type: { type: 'string' },
          visibility: { type: 'number', minimum: 0, maximum: 1 },
          detectors: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    ratchet: {
      type: 'object',
      required: ['leverage_delta', 'exit_cost'],
      additionalProperties: false,
      properties: { leverage_delta: { type: 'number' }, exit_cost: { type: 'number' } },
    },
    educational_note: { type: 'string' },
  },
};

export const localeSchema = {
  $id: `${BASE}locale.json`,
  type: 'object',
  additionalProperties: { type: 'string' },
};

export const PACK_SCHEMAS: Record<PackKind, object> = {
  role: roleSchema,
  event: eventSchema,
  scene: sceneSchema,
  offer: offerSchema,
};

export const ALL_SCHEMAS: object[] = [
  exprSchema,
  manifestSchema,
  localeSchema,
  roleSchema,
  eventSchema,
  sceneSchema,
  offerSchema,
];

export const SCHEMA_IDS = {
  manifest: manifestSchema.$id,
  locale: localeSchema.$id,
  role: roleSchema.$id,
  event: eventSchema.$id,
  scene: sceneSchema.$id,
  offer: offerSchema.$id,
} as const;
