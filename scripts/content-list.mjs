/* global process, console */
// `pnpm content:list [--role qc|sales|any] [--facts] [--tag pressure]`
// The event library at a glance: every event with its job, weight, cooldown, choices and trigger.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const root = opt('dir') ?? 'content';
const SHORT = {
  'role.sales.export.specialist': 'sales',
  'role.qc.specialist': 'qc',
  'role.fin.accountant': 'fin',
  'role.prod.planner': 'prod',
  'role.purch.buyer': 'purch',
};
const ALIAS = {
  'player.stress': 'stress',
  'player.energy': 'energy',
  'player.health': 'health',
  'player.cash_vnd': 'cash',
  'world.month_of_year': 'month',
  'world.quarter': 'quarter',
  'world.week_of_year': 'week',
  'world.turn': 'turn',
};
const SYMBOL = { gte: '>=', gt: '>', lte: '<=', lt: '<', eq: '=', neq: '!=' };

const readAll = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    : [];

/** Turns an expression tree back into the plain condition text used when authoring. */
export function render(expr) {
  if (expr === undefined) return 'always';
  if (typeof expr === 'number' || typeof expr === 'boolean') return String(expr);
  if (typeof expr === 'string') return ALIAS[expr] ?? expr.replace(/^player\./, '');
  const [op, arg] = Object.entries(expr)[0];
  if (op === 'var') return render(arg[0]);
  if (op === 'all') return arg.map(render).join(' and ');
  if (op === 'any') return `(${arg.map(render).join(' or ')})`;
  if (op === 'in') return `${render(arg[0])} in ${arg.slice(1).join(' ')}`;
  if (SYMBOL[op]) return `${render(arg[0])} ${SYMBOL[op]} ${render(arg[1])}`;
  return JSON.stringify(expr);
}

const sceneOf = () => {
  const scenes = new Map();
  for (const dir of readdirSync(root)) {
    for (const s of readAll(join(root, dir, 'scenes'))) scenes.set(s.id, s);
  }
  return (event) => scenes.get(event.scene) ?? { choices: [] };
};

const events = [];
const facts = [];
for (const pack of readdirSync(root)) {
  events.push(...readAll(join(root, pack, 'events')));
  facts.push(...readAll(join(root, pack, 'facts')));
}
const lookup = sceneOf();

if (args.includes('--facts')) {
  for (const f of facts.sort((a, b) => b.severity - a.severity)) {
    console.log(`${String(f.severity).padStart(2)}  ${f.id}  [${f.category}]`);
  }
  console.log(`\n${facts.length} facts`);
} else {
  const role = opt('role');
  const tag = opt('tag');
  const shown = events.filter((e) => {
    const short = e.role ? (SHORT[e.role] ?? e.role) : 'any';
    return (!role || short === role) && (!tag || (e.tags ?? []).includes(tag));
  });
  for (const e of shown) {
    const short = e.role ? (SHORT[e.role] ?? e.role) : 'any';
    const choices = lookup(e).choices?.length ?? 0;
    console.log(
      `${e.id}  ${short}  w${e.weight} cd${e.cooldown_weeks}w  ${choices} choices  [${(e.tags ?? []).join(', ')}]`,
    );
    console.log(`    when: ${render(e.when)}`);
  }
  const by = {};
  for (const e of shown) {
    const short = e.role ? (SHORT[e.role] ?? e.role) : 'any';
    by[short] = (by[short] ?? 0) + 1;
  }
  console.log(
    `\n${shown.length} events (${Object.entries(by)
      .map(([k, n]) => `${k} ${n}`)
      .join(', ')})`,
  );
}
