// Writer-friendly authoring: one YAML entry per scene (English and Vietnamese side by side) becomes
// the scene, its event and its text keys in the content pack. Facts and glossary terms work the same
// way. Importing the same entry again updates it in place. Pure compile functions plus one writer.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

const ROLE_BY_PREFIX = {
  sales: 'role.sales.export.specialist',
  qc: 'role.qc.specialist',
  fin: 'role.fin.accountant',
  prod: 'role.prod.planner',
  purch: 'role.purch.buyer',
  inv: 'role.inv.analyst',
  hr: 'role.hr.hrbp',
};
const ROLE_SHORTCUTS = { ...ROLE_BY_PREFIX };
const VARIABLE_ALIASES = {
  stress: 'player.stress',
  energy: 'player.energy',
  health: 'player.health',
  cash: 'player.cash_vnd',
  month: 'world.month_of_year',
  quarter: 'world.quarter',
  week: 'world.week_of_year',
  turn: 'world.turn',
};
const COMPARE = {
  '>=': 'gte',
  '>': 'gt',
  '<=': 'lte',
  '<': 'lt',
  '=': 'eq',
  '==': 'eq',
  '!=': 'neq',
};

const NUMBER = /^[+-]?\d+(\.\d+)?$/;
const num = (text) => Number(String(text).replace(/^\+/, ''));

/** "rep.boss" -> "player.rep.boss", "stress" -> "player.stress"; dotted engine paths pass through. */
export function resolveVariable(name) {
  if (VARIABLE_ALIASES[name]) return VARIABLE_ALIASES[name];
  if (name.startsWith('rep.')) return `player.${name}`;
  return name;
}

/** Facts and skills may not exist yet, so conditions on them read 0 until they do. */
function variable(path) {
  return /^(fact|skill|rel|close)\./.test(path) ? { var: [path, 0] } : path;
}

/**
 * One condition line: "stress >= 40", "month in 3 6 9 12", "fact.came_clean < 2", "rep.boss <= 10".
 * Returns an expression tree for the rules engine.
 */
export function compileCondition(line) {
  const text = String(line).trim();
  const inMatch = /^(\S+)\s+in\s+(.+)$/.exec(text);
  if (inMatch) {
    const values = inMatch[2].split(/[\s,]+/).filter(Boolean);
    if (values.length === 0 || !values.every((v) => NUMBER.test(v))) {
      throw new Error(`condition "${text}": "in" needs numbers, like: month in 3 6 9 12`);
    }
    return { in: [variable(resolveVariable(inMatch[1])), ...values.map(num)] };
  }
  const match = /^(\S+)\s*(>=|<=|!=|==|>|<|=)\s*(\S+)$/.exec(text);
  if (!match) {
    throw new Error(`condition "${text}" is not understood; write it like: stress >= 40`);
  }
  const [, name, op, value] = match;
  if (!NUMBER.test(value)) {
    throw new Error(`condition "${text}": the value must be a number`);
  }
  return { [COMPARE[op]]: [variable(resolveVariable(name)), num(value)] };
}

function compileConditions(all, any) {
  const parts = (all ?? []).map(compileCondition);
  if (any && any.length > 0) parts.push({ any: any.map(compileCondition) });
  if (parts.length === 0) return undefined;
  return parts.length === 1 ? parts[0] : { all: parts };
}

/**
 * One effect line: "rep.boss +5", "stress -3", "cash +3000000", "delta company.audit_readiness -5",
 * "fact accepted_kickback private", "schedule event.qc.recall_review 4-6".
 */
export function compileEffect(line) {
  const words = String(line).trim().split(/\s+/);
  const [head, ...rest] = words;
  if (head === 'fact') {
    const [name, visibility] = rest;
    if (!name || !['private', 'witnessed', 'rumor', 'public'].includes(visibility ?? '')) {
      throw new Error(
        `effect "${line}": write it like: fact accepted_kickback private (private, witnessed, rumor or public)`,
      );
    }
    return { fact: name.startsWith('fact.') ? name : `fact.${name}`, visibility };
  }
  if (head === 'rel' || head === 'favor') {
    // rel khoa trust +5   |   favor khoa +1 (favours the person owes you; negative if you owe them)
    const [who, ...more] = rest;
    const dimension = head === 'favor' ? 'owed' : more.shift();
    const amount = more[0];
    if (
      !who ||
      !['trust', 'loyalty', 'owed'].includes(dimension ?? '') ||
      !NUMBER.test(amount ?? '')
    ) {
      throw new Error(
        `effect "${line}": write it like: rel khoa trust +5 (trust, loyalty or owed) or favor khoa +1`,
      );
    }
    return { delta: `rel.${who.replace(/^char[.:]/, '')}.${dimension}`, value: num(amount) };
  }
  if (head === 'end') {
    // end promoted | end walked_away   (ends the run with that ending)
    const [ending] = rest;
    if (!['promoted', 'walked_away'].includes(ending ?? '')) {
      throw new Error(`effect "${line}": write it like: end promoted (or: end walked_away)`);
    }
    return { ending };
  }
  if (head === 'close') {
    // close bank_rec +2   (2 done properly, 1 done in a hurry; finance month-end close)
    const [step, amount] = rest;
    if (!/^[a-z][a-z0-9_]*$/.test(step ?? '') || !NUMBER.test(amount ?? '')) {
      throw new Error(`effect "${line}": write it like: close bank_rec +2 (2 proper, 1 rushed)`);
    }
    return { delta: `close.${step}`, value: num(amount) };
  }
  if (head === 'arc') {
    // arc hamper favour   (move the storyline to a stage; "end" ends it)
    const [name, stage] = rest;
    if (!name || !/^[a-z][a-z0-9_]*$/.test(stage ?? '')) {
      throw new Error(`effect "${line}": write it like: arc hamper favour (or: arc hamper end)`);
    }
    return { arc: name.startsWith('arc.') ? name : `arc.${name}`, stage };
  }
  if (head === 'schedule') {
    const [target, range] = rest;
    const match = /^(\d+)-(\d+)$/.exec(range ?? '');
    if (!target || !match)
      throw new Error(`effect "${line}": write it like: schedule event.qc.x 4-6`);
    return { schedule: target, delay_weeks: [Number(match[1]), Number(match[2])] };
  }
  const path = head === 'delta' ? rest[0] : head;
  const amount = head === 'delta' ? rest[1] : rest[0];
  if (!path || amount === undefined || !NUMBER.test(amount)) {
    throw new Error(`effect "${line}" is not understood; write it like: rep.boss +5`);
  }
  return { delta: resolveVariable(path), value: num(amount) };
}

function need(problems, where, value, what) {
  if (typeof value !== 'string' || value.trim() === '') problems.push(`${where}: missing ${what}`);
}

/** Compiles a `scene:` entry into { scene, event, en, vi }. Throws one error listing every problem. */
export function compileScene(entry) {
  const problems = [];
  const match = /^([a-z]+)\.([a-z][a-z0-9_]*)$/.exec(entry.scene ?? '');
  if (!match)
    throw new Error(`scene id "${entry.scene}" must look like sales.new_thing or qc.new_thing`);
  const [, prefix, key] = match;
  const sid = `scene.${prefix}.${key}`;
  const here = `scene ${entry.scene}`;
  const en = {};
  const vi = {};
  const both = (textKey, where, source) => {
    need(problems, where, source?.en, 'English text (en)');
    need(problems, where, source?.vi, 'Vietnamese text (vi)');
    en[textKey] = String(source?.en ?? '').trim();
    vi[textKey] = String(source?.vi ?? '').trim();
  };

  const lines = entry.lines ?? [];
  if (lines.length === 0) problems.push(`${here}: needs at least one line`);
  const speakers = [];
  const sceneLines = lines.map((line, i) => {
    need(
      problems,
      `${here} line ${i + 1}`,
      line.who,
      'who (a role like boss, or a character like char:khoa)',
    );
    both(`${sid}.l${i + 1}`, `${here} line ${i + 1}`, line);
    const speaker = String(line.who).startsWith('char:') ? String(line.who) : `role:${line.who}`;
    speakers.push(speaker);
    return { speaker, text_key: `${sid}.l${i + 1}` };
  });

  const choices = entry.choices ?? [];
  if (choices.length === 0) problems.push(`${here}: needs at least one choice`);
  const sceneChoices = choices.map((choice, ci) => {
    const cid = `c${ci + 1}`;
    const cwhere = `${here} choice ${ci + 1}`;
    both(`${sid}.${cid}`, cwhere, choice);
    const outcomes = choice.outcomes ?? [];
    if (outcomes.length === 0) problems.push(`${cwhere}: needs at least one outcome`);
    const results = outcomes.map((o) => (o.ok === false || o.result === 'fail' ? 'fail' : 'ok'));
    const total = outcomes.reduce((sum, o) => sum + Number(o.p ?? 0), 0);
    if (outcomes.length > 0 && Math.abs(total - 1) > 0.001) {
      problems.push(
        `${cwhere}: outcome probabilities add up to ${Math.round(total * 1000) / 1000}, they must add up to 1`,
      );
    }
    const compiled = outcomes.map((o, oi) => {
      const owhere = `${cwhere} outcome ${oi + 1}`;
      const dupes = results.filter((r) => r === results[oi]).length > 1;
      const name = dupes ? `${results[oi]}${oi + 1}` : results[oi];
      both(`${sid}.${cid}.${name}`, owhere, o);
      let effects;
      try {
        effects = (o.effects ?? []).map(compileEffect);
      } catch (error) {
        problems.push(`${owhere}: ${error.message}`);
      }
      return {
        p: Number(o.p),
        ...(results[oi] === 'fail' ? { result: 'fail' } : {}),
        narration_key: `${sid}.${cid}.${name}`,
        ...(effects && effects.length > 0 ? { effects } : {}),
      };
    });
    let requires;
    try {
      requires = compileConditions(choice.requires, undefined);
    } catch (error) {
      problems.push(`${cwhere}: ${error.message}`);
    }
    return {
      id: cid,
      text_key: `${sid}.${cid}`,
      ...(choice.cost ? { cost: choice.cost } : {}),
      ...(requires ? { requires } : {}),
      outcomes: compiled,
    };
  });

  let beat;
  if (entry.beat !== undefined) {
    const span = /^(\d+)(?:-(\d+))?$/.exec(String(entry.beat));
    if (
      !span ||
      Number(span[1]) < 1 ||
      Number(span[2] ?? span[1]) > 52 ||
      Number(span[1]) > Number(span[2] ?? span[1])
    ) {
      problems.push(`${here}: beat must be a week or a window of weeks inside 1-52, like 24-28`);
    } else {
      beat = { from_week: Number(span[1]), to_week: Number(span[2] ?? span[1]) };
    }
  }
  let when;
  try {
    when = entry.when_raw ?? compileConditions(entry.when, entry.when_any);
  } catch (error) {
    problems.push(`${here}: ${error.message}`);
  }
  const terms = (entry.terms ?? []).map((t) => (String(t).startsWith('term.') ? t : `term.${t}`));
  const role =
    entry.role === 'any'
      ? undefined
      : (ROLE_SHORTCUTS[entry.role] ?? entry.role ?? ROLE_BY_PREFIX[prefix]);

  if (problems.length > 0) throw new Error(problems.join('\n'));
  return {
    file: `${prefix}-${key.replace(/_/g, '-')}.json`,
    prefix,
    scene: {
      id: sid,
      location: `loc.${entry.place ?? 'meeting_room'}`,
      cast: [...new Set(speakers)],
      lines: sceneLines,
      choices: sceneChoices,
      ...(terms.length > 0 ? { terms } : {}),
    },
    event: {
      id: `event.${prefix}.${key}`,
      ...(role ? { role } : {}),
      ...(entry.arc
        ? { arc: String(entry.arc).startsWith('arc.') ? entry.arc : `arc.${entry.arc}` }
        : {}),
      tags: entry.tags ?? ['pressure'],
      ...(when ? { when } : {}),
      ...(beat ? { beat } : {}),
      weight: entry.weight ?? 1,
      cooldown_weeks: entry.cooldown ?? 12,
      scene: sid,
    },
    en,
    vi,
  };
}

/** Compiles a `fact:` entry into { fact, en, vi }. */
export function compileFact(entry) {
  const problems = [];
  const name = String(entry.fact ?? '').replace(/^fact\./, '');
  if (!/^[a-z][a-z0-9_]*$/.test(name))
    throw new Error(`fact name "${entry.fact}" must be lower snake_case`);
  const id = `fact.${name}`;
  const en = {};
  const vi = {};
  need(problems, `fact ${name}`, entry.en, 'English label (en)');
  need(problems, `fact ${name}`, entry.vi, 'Vietnamese label (vi)');
  en[id] = String(entry.en ?? '');
  vi[id] = String(entry.vi ?? '');
  const fact = {
    id,
    category: entry.category ?? 'integrity',
    severity: entry.severity,
    text_key: id,
  };
  if (entry.lesson) {
    need(problems, `fact ${name} lesson`, entry.lesson.en, 'English lesson');
    need(problems, `fact ${name} lesson`, entry.lesson.vi, 'Vietnamese lesson');
    fact.lesson_key = `lesson.${name}`;
    en[fact.lesson_key] = String(entry.lesson.en ?? '');
    vi[fact.lesson_key] = String(entry.lesson.vi ?? '');
  }
  if (entry.traces) fact.traces = entry.traces;
  const consequences = {};
  if (entry.witnessed) consequences.witnessed = entry.witnessed;
  if (entry.public) consequences.public = entry.public;
  if (Object.keys(consequences).length > 0) fact.consequences = consequences;
  if (problems.length > 0) throw new Error(problems.join('\n'));
  return { fact, en, vi };
}

/** Compiles a `term:` entry into { term, en, vi }. */
export function compileTerm(entry) {
  const problems = [];
  const name = String(entry.term ?? '').replace(/^term\./, '');
  if (!/^[a-z][a-z0-9_]*$/.test(name))
    throw new Error(`term name "${entry.term}" must be lower snake_case`);
  for (const lang of ['en', 'vi']) {
    need(problems, `term ${name} (${lang})`, entry[lang]?.term, 'term');
    need(problems, `term ${name} (${lang})`, entry[lang]?.definition, 'definition');
  }
  if (problems.length > 0) throw new Error(problems.join('\n'));
  const id = `term.${name}`;
  return {
    term: { id, term_key: `${id}.term`, definition_key: `${id}.def` },
    en: { [`${id}.term`]: entry.en.term, [`${id}.def`]: entry.en.definition },
    vi: { [`${id}.term`]: entry.vi.term, [`${id}.def`]: entry.vi.definition },
  };
}

/** Compiles an `arc:` entry (recognised by its `stages`) into { arc, en, vi }. */
export function compileArc(entry) {
  const problems = [];
  const slug = String(entry.arc ?? '').replace(/^arc\./, '');
  if (!/^[a-z][a-z0-9_]*$/.test(slug))
    throw new Error(`arc "${entry.arc}" must be lower snake_case`);
  const id = `arc.${slug}`;
  need(problems, `arc ${slug} title`, entry.title?.en, 'English title');
  need(problems, `arc ${slug} title`, entry.title?.vi, 'Vietnamese title');
  const stages = (entry.stages ?? []).map((stage, i) => {
    const where = `arc ${slug} stage ${i + 1}`;
    need(problems, where, stage.id, 'id');
    need(problems, where, stage.event, 'event (e.g. qc.hung_favour)');
    let delay;
    if (stage.delay !== undefined) {
      const match = /^(\d+)(?:-(\d+))?$/.exec(String(stage.delay));
      if (!match) problems.push(`${where}: delay must look like 2 or 2-4 (weeks)`);
      else delay = [Number(match[1]), Number(match[2] ?? match[1])];
    }
    const event = String(stage.event ?? '');
    return {
      id: stage.id,
      event: event.startsWith('event.') ? event : `event.${event}`,
      ...(delay ? { delay_weeks: delay } : {}),
    };
  });
  if (stages.length === 0) problems.push(`arc ${slug}: needs at least one stage`);
  if (problems.length > 0) throw new Error(problems.join('\n'));
  return {
    arc: { id, title_key: `${id}.title`, stages },
    en: { [`${id}.title`]: entry.title.en },
    vi: { [`${id}.title`]: entry.title.vi },
  };
}

/** Compiles a `char:` entry into { character, en, vi }. */
export function compileCharacter(entry) {
  const problems = [];
  const slug = String(entry.char ?? '').replace(/^char[.:]/, '');
  if (!/^[a-z][a-z0-9_]*$/.test(slug))
    throw new Error(`character "${entry.char}" must be lower snake_case`);
  const id = `char.${slug}`;
  need(problems, `char ${slug}`, entry.department, 'department');
  for (const lang of ['en', 'vi']) {
    need(problems, `char ${slug} (${lang})`, entry[lang]?.name, 'name');
    need(problems, `char ${slug} (${lang})`, entry[lang]?.title, 'title');
  }
  if (problems.length > 0) throw new Error(problems.join('\n'));
  return {
    character: {
      id,
      name_key: `${id}.name`,
      title_key: `${id}.title`,
      department: entry.department,
      ...(entry.group ? { home_group: entry.group } : {}),
      ...(entry.traits ? { traits: entry.traits } : {}),
      ...(entry.start ? { start: entry.start } : {}),
    },
    en: { [`${id}.name`]: entry.en.name, [`${id}.title`]: entry.en.title },
    vi: { [`${id}.name`]: entry.vi.name, [`${id}.title`]: entry.vi.title },
  };
}

const readJson = (path, fallback) =>
  existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback;
const writeJson = (path, value) => {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
};
const upsert = (list, item) => {
  const i = list.findIndex((x) => x.id === item.id);
  if (i >= 0) list[i] = item;
  else list.push(item);
  return i >= 0 ? 'updated' : 'added';
};

/** Parses YAML text (one or more documents) into entries. */
export function parseEntries(text, source = 'input') {
  return YAML.parseAllDocuments(text).flatMap((doc, i) => {
    if (doc.errors.length > 0)
      throw new Error(`${source}, document ${i + 1}: ${doc.errors[0].message}`);
    const value = doc.toJS();
    return value ? [value] : [];
  });
}

/**
 * Compiles every entry first (so a mistake in any of them changes nothing), then writes the content
 * files. Returns one report line per entry.
 */
export function applyEntries(entries, { root = '.', pack = 'industry-cookware' } = {}) {
  const base = join(root, 'content', pack);
  if (!existsSync(join(base, 'manifest.json'))) throw new Error(`no pack at ${base}`);

  const compiled = entries.map((entry, i) => {
    try {
      if (entry.scene) return { kind: 'scene', ...compileScene(entry), name: entry.scene };
      if (entry.fact) return { kind: 'fact', ...compileFact(entry), name: entry.fact };
      if (entry.term) return { kind: 'term', ...compileTerm(entry), name: entry.term };
      if (entry.stages) return { kind: 'arc', ...compileArc(entry), name: entry.arc };
      if (entry.char) return { kind: 'character', ...compileCharacter(entry), name: entry.char };
      throw new Error('an entry needs one of: scene, fact, term, char, arc (with stages)');
    } catch (error) {
      throw new Error(`entry ${i + 1}:\n${error.message}`);
    }
  });

  const locales = {
    en: readJson(join(base, 'locale', 'en.json'), {}),
    vi: readJson(join(base, 'locale', 'vi.json'), {}),
  };
  const report = [];
  for (const dir of ['scenes', 'events', 'facts', 'terms', 'characters', 'arcs', 'locale'])
    mkdirSync(join(base, dir), { recursive: true });

  for (const item of compiled) {
    for (const lang of ['en', 'vi']) {
      if (item.kind === 'scene') {
        // Drop the scene's old text first, so a removed line or choice does not leave stale keys.
        for (const k of Object.keys(locales[lang]))
          if (k.startsWith(`${item.scene.id}.`)) delete locales[lang][k];
      }
      Object.assign(locales[lang], item[lang]);
    }
    let how;
    if (item.kind === 'scene') {
      const sceneFile = join(base, 'scenes', item.file);
      how = existsSync(sceneFile) ? 'updated' : 'added';
      writeJson(sceneFile, item.scene);
      const eventsFile = join(base, 'events', `${item.prefix}-week.json`);
      const events = readJson(eventsFile, []);
      upsert(events, item.event);
      writeJson(eventsFile, events);
    } else if (item.kind === 'fact') {
      const file = join(base, 'facts', 'authored.json');
      const facts = readJson(file, []);
      how = upsert(facts, item.fact);
      writeJson(file, facts);
    } else if (item.kind === 'arc') {
      const file = join(base, 'arcs', 'authored.json');
      const list = readJson(file, []);
      how = upsert(list, item.arc);
      writeJson(file, list);
    } else if (item.kind === 'character') {
      const file = join(base, 'characters', 'authored.json');
      const list = readJson(file, []);
      how = upsert(list, item.character);
      writeJson(file, list);
    } else {
      const file = join(base, 'terms', 'authored.json');
      const terms = readJson(file, []);
      how = upsert(terms, item.term);
      writeJson(file, terms);
    }
    report.push(`${how} ${item.kind} ${item.name}`);
  }
  writeJson(join(base, 'locale', 'en.json'), locales.en);
  writeJson(join(base, 'locale', 'vi.json'), locales.vi);
  return report;
}
