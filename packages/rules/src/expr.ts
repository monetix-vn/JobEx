import type { Expr, ExprValue } from '@je/contracts';

/**
 * Safe expression evaluator for content conditions and effects (plan section 9.1).
 *
 * Expressions are JSON trees interpreted by a fixed table of operators. Nothing here compiles or
 * executes code from content: no eval, no Function, no property access on arbitrary objects.
 *
 *   literal        5, true, null
 *   variable       "world.month_of_year"        (a bare string is a variable path)
 *   call           { "gte": ["world.month_of_year", 3] }
 *   string literal { "lit": "text" }
 */

export type Scope = (path: string) => ExprValue | undefined;

export type ErrorCode =
  | 'UNKNOWN_VAR'
  | 'UNKNOWN_OP'
  | 'ARITY'
  | 'TYPE'
  | 'DIV_ZERO'
  | 'MALFORMED'
  | 'TOO_DEEP'
  | 'TOO_LARGE';

export class ExpressionError extends Error {
  override name = 'ExpressionError';
  constructor(
    readonly code: ErrorCode,
    message: string,
    readonly path: string = '$',
  ) {
    super(`${message} at ${path}`);
  }
}

export interface Limits {
  maxDepth: number;
  maxNodes: number;
}
export const DEFAULT_LIMITS: Limits = { maxDepth: 24, maxNodes: 500 };

interface OpSpec {
  min: number;
  max: number;
  /** Lazy operators receive unevaluated arguments (short-circuit). */
  lazy?: boolean;
}

const N = Number.POSITIVE_INFINITY;
const OPS: Record<string, OpSpec> = {
  lit: { min: 1, max: 1 },
  var: { min: 1, max: 2 },
  all: { min: 0, max: N, lazy: true },
  any: { min: 0, max: N, lazy: true },
  not: { min: 1, max: 1 },
  if: { min: 3, max: 3, lazy: true },
  eq: { min: 2, max: 2 },
  neq: { min: 2, max: 2 },
  gt: { min: 2, max: 2 },
  gte: { min: 2, max: 2 },
  lt: { min: 2, max: 2 },
  lte: { min: 2, max: 2 },
  in: { min: 2, max: N },
  add: { min: 1, max: N },
  sub: { min: 2, max: 2 },
  mul: { min: 1, max: N },
  div: { min: 2, max: 2 },
  mod: { min: 2, max: 2 },
  min: { min: 1, max: N },
  max: { min: 1, max: N },
  clamp: { min: 3, max: 3 },
  abs: { min: 1, max: 1 },
  neg: { min: 1, max: 1 },
  floor: { min: 1, max: 1 },
  ceil: { min: 1, max: 1 },
  round: { min: 1, max: 1 },
};

export const OPERATORS: readonly string[] = Object.keys(OPS);

function hasOwn(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isPrimitive(value: unknown): value is ExprValue {
  return (
    value === null ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  );
}

/** Splits an expression node into [operator, args], or throws MALFORMED. */
function parseCall(node: object, path: string): [string, unknown[]] {
  if (Array.isArray(node))
    throw new ExpressionError('MALFORMED', 'arrays are not expressions', path);
  const keys = Object.keys(node);
  if (keys.length !== 1) {
    throw new ExpressionError('MALFORMED', 'an operator object needs exactly one key', path);
  }
  const op = keys[0] as string;
  if (!hasOwn(OPS, op)) throw new ExpressionError('UNKNOWN_OP', `unknown operator "${op}"`, path);
  const spec = OPS[op] as OpSpec;
  const raw = (node as Record<string, unknown>)[op];
  // `lit` takes its value directly, everything else takes an argument list.
  const args = op === 'lit' ? [raw] : raw;
  if (!Array.isArray(args)) {
    throw new ExpressionError('MALFORMED', `"${op}" needs an argument list`, `${path}.${op}`);
  }
  if (args.length < spec.min || args.length > spec.max) {
    throw new ExpressionError('ARITY', `"${op}" got ${args.length} arguments`, `${path}.${op}`);
  }
  return [op, args];
}

export function evaluate(
  expr: Expr,
  scope: Scope | Readonly<Record<string, ExprValue>>,
  limits: Limits = DEFAULT_LIMITS,
): ExprValue {
  const lookup: Scope =
    typeof scope === 'function' ? scope : (path) => (hasOwn(scope, path) ? scope[path] : undefined);
  const counter = { nodes: 0 };
  return run(expr, lookup, limits, counter, '$', 0);
}

function run(
  node: unknown,
  scope: Scope,
  limits: Limits,
  counter: { nodes: number },
  path: string,
  depth: number,
): ExprValue {
  if (++counter.nodes > limits.maxNodes) {
    throw new ExpressionError('TOO_LARGE', `more than ${limits.maxNodes} nodes`, path);
  }
  if (depth > limits.maxDepth) {
    throw new ExpressionError('TOO_DEEP', `deeper than ${limits.maxDepth}`, path);
  }
  if (typeof node === 'string') return readVar(node, undefined, scope, path);
  if (isPrimitive(node)) return node;
  if (typeof node !== 'object' || node === undefined) {
    throw new ExpressionError('MALFORMED', 'not a JSON expression', path);
  }

  const [op, args] = parseCall(node, path);
  const sub = (i: number): ExprValue =>
    run(args[i], scope, limits, counter, `${path}.${op}[${i}]`, depth + 1);
  const evalAll = (): ExprValue[] => args.map((_, i) => sub(i));
  const num = (v: ExprValue, i: number): number => {
    if (typeof v !== 'number' || Number.isNaN(v)) {
      throw new ExpressionError('TYPE', `"${op}" expects numbers`, `${path}.${op}[${i}]`);
    }
    return v;
  };
  const nums = (): number[] => evalAll().map(num);
  const bool = (v: ExprValue, i: number): boolean => {
    if (typeof v !== 'boolean') {
      throw new ExpressionError('TYPE', `"${op}" expects booleans`, `${path}.${op}[${i}]`);
    }
    return v;
  };
  const ordered = (cmp: (a: number, b: number) => boolean): boolean => {
    const [a, b] = nums() as [number, number];
    return cmp(a, b);
  };

  switch (op) {
    case 'lit': {
      const value = args[0];
      if (!isPrimitive(value)) {
        throw new ExpressionError('TYPE', '"lit" holds a number, string, boolean or null', path);
      }
      return value;
    }
    case 'var': {
      const name = args[0];
      if (typeof name !== 'string') {
        throw new ExpressionError('TYPE', '"var" expects a path string', `${path}.var[0]`);
      }
      const fallback = args.length === 2 ? args[1] : undefined;
      if (fallback !== undefined && !isPrimitive(fallback)) {
        throw new ExpressionError('TYPE', '"var" default must be a literal', `${path}.var[1]`);
      }
      return readVar(name, fallback, scope, path);
    }
    case 'all': {
      for (let i = 0; i < args.length; i++) if (!bool(sub(i), i)) return false;
      return true;
    }
    case 'any': {
      for (let i = 0; i < args.length; i++) if (bool(sub(i), i)) return true;
      return false;
    }
    case 'not':
      return !bool(sub(0), 0);
    case 'if':
      return bool(sub(0), 0) ? sub(1) : sub(2);
    case 'eq': {
      const [a, b] = evalAll();
      return a === b;
    }
    case 'neq': {
      const [a, b] = evalAll();
      return a !== b;
    }
    case 'gt':
      return ordered((a, b) => a > b);
    case 'gte':
      return ordered((a, b) => a >= b);
    case 'lt':
      return ordered((a, b) => a < b);
    case 'lte':
      return ordered((a, b) => a <= b);
    case 'in': {
      const [needle, ...haystack] = evalAll();
      return haystack.includes(needle as ExprValue);
    }
    case 'add':
      return nums().reduce((a, b) => a + b, 0);
    case 'sub': {
      const [a, b] = nums() as [number, number];
      return a - b;
    }
    case 'mul':
      return nums().reduce((a, b) => a * b, 1);
    case 'div': {
      const [a, b] = nums() as [number, number];
      if (b === 0) throw new ExpressionError('DIV_ZERO', 'division by zero', path);
      return a / b;
    }
    case 'mod': {
      const [a, b] = nums() as [number, number];
      if (b === 0) throw new ExpressionError('DIV_ZERO', 'modulo by zero', path);
      return a % b;
    }
    case 'min':
      return Math.min(...nums());
    case 'max':
      return Math.max(...nums());
    case 'clamp': {
      const [x, lo, hi] = nums() as [number, number, number];
      return Math.min(Math.max(x, lo), hi);
    }
    case 'abs':
      return Math.abs(num(sub(0), 0));
    case 'neg':
      return -num(sub(0), 0);
    case 'floor':
      return Math.floor(num(sub(0), 0));
    case 'ceil':
      return Math.ceil(num(sub(0), 0));
    case 'round':
      return Math.round(num(sub(0), 0));
    default:
      throw new ExpressionError('UNKNOWN_OP', `unknown operator "${op}"`, path);
  }
}

function readVar(
  name: string,
  fallback: ExprValue | undefined,
  scope: Scope,
  path: string,
): ExprValue {
  const value = scope(name);
  if (value !== undefined) return value;
  if (fallback !== undefined) return fallback;
  throw new ExpressionError('UNKNOWN_VAR', `unknown variable "${name}"`, path);
}

export interface Issue {
  code: ErrorCode;
  message: string;
  path: string;
}

/** Static check, no scope needed: shape, operators, arity, limits. Never throws. */
export function validate(expr: unknown, limits: Limits = DEFAULT_LIMITS): Issue[] {
  const issues: Issue[] = [];
  const counter = { nodes: 0 };
  const walk = (node: unknown, path: string, depth: number): void => {
    if (++counter.nodes > limits.maxNodes) {
      if (counter.nodes === limits.maxNodes + 1) {
        issues.push({ code: 'TOO_LARGE', message: `more than ${limits.maxNodes} nodes`, path });
      }
      return;
    }
    if (depth > limits.maxDepth) {
      issues.push({ code: 'TOO_DEEP', message: `deeper than ${limits.maxDepth}`, path });
      return;
    }
    if (isPrimitive(node)) return;
    if (typeof node !== 'object' || node === undefined) {
      issues.push({ code: 'MALFORMED', message: 'not a JSON expression', path });
      return;
    }
    try {
      const [op, args] = parseCall(node, path);
      if (op === 'lit') {
        if (!isPrimitive(args[0])) {
          issues.push({
            code: 'TYPE',
            message: '"lit" holds a number, string, boolean or null',
            path,
          });
        }
        return;
      }
      if (op === 'var') {
        if (typeof args[0] !== 'string') {
          issues.push({
            code: 'TYPE',
            message: '"var" expects a path string',
            path: `${path}.var[0]`,
          });
        }
        return;
      }
      args.forEach((arg, i) => walk(arg, `${path}.${op}[${i}]`, depth + 1));
    } catch (error) {
      if (error instanceof ExpressionError) {
        issues.push({ code: error.code, message: error.message, path });
      } else {
        throw error;
      }
    }
  };
  walk(expr, '$', 0);
  return issues;
}

/** Every variable path an expression reads (bare strings and `var`), sorted and unique. */
export function collectVars(expr: unknown): string[] {
  const found = new Set<string>();
  const walk = (node: unknown, depth: number): void => {
    if (depth > DEFAULT_LIMITS.maxDepth) return;
    if (typeof node === 'string') {
      found.add(node);
      return;
    }
    if (isPrimitive(node) || typeof node !== 'object' || node === undefined) return;
    const keys = Object.keys(node);
    if (Array.isArray(node) || keys.length !== 1) return;
    const op = keys[0] as string;
    const raw = (node as Record<string, unknown>)[op];
    if (op === 'lit') return;
    if (op === 'var') {
      if (Array.isArray(raw) && typeof raw[0] === 'string') found.add(raw[0]);
      return;
    }
    if (Array.isArray(raw)) raw.forEach((child) => walk(child, depth + 1));
  };
  walk(expr, 0);
  return [...found].sort();
}
