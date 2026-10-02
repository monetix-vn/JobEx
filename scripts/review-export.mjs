/* global process, console */
// `pnpm review:export [--role qc|sales|fin|prod|purch|inv|hr|all]` writes one reviewable markdown file per job into
// docs/review/: every scene with English and Vietnamese side by side, outcomes and the facts they create,
// and a checklist line for a practitioner. Send the file to someone who has done the job.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const ROLES = {
  sales: ['role.sales.export.specialist', 'Export Sales Specialist'],
  qc: ['role.qc.specialist', 'Quality Control Specialist'],
  fin: ['role.fin.accountant', 'Finance and Accounting Specialist'],
  prod: ['role.prod.planner', 'Production Planner'],
  purch: ['role.purch.buyer', 'Purchasing Buyer'],
  inv: ['role.inv.analyst', 'Investment Banking Analyst'],
  fpa: ['role.fpa.analyst', 'FP&A Analyst'],
  sup: ['role.prod.supervisor', 'Production Line Supervisor'],
  hr: ['role.hr.hrbp', 'HR Business Partner'],
};
const want = opt('role') ?? 'all';
const jobs = want === 'all' ? Object.keys(ROLES) : [want];
const root = 'content';
const readDir = (dir) =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .flatMap((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')))
    : [];
const all = (kind) => readdirSync(root).flatMap((p) => readDir(join(root, p, kind)));
const loc = (lang) =>
  Object.assign(
    {},
    ...readdirSync(root).map((p) => {
      const f = join(root, p, 'locale', `${lang}.json`);
      return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
    }),
  );
const en = loc('en');
const vi = loc('vi');
const scenes = new Map(all('scenes').map((s) => [s.id, s]));
const events = all('events');
const facts = new Map(all('facts').map((f) => [f.id, f]));
const chars = new Map(all('characters').map((c) => [c.id, c]));
const speaker = (s, t) => {
  if (s.startsWith('char:')) return t[chars.get(`char.${s.slice(5)}`)?.name_key] ?? s;
  return t[`speaker.${s.replace(/^role:/, '')}`] ?? s;
};
const summary = (effects = []) =>
  effects
    .map((e) =>
      'fact' in e
        ? `fact ${e.fact.replace('fact.', '')} (${e.visibility})`
        : 'delta' in e
          ? `${e.delta.replace('player.', '')} ${e.value > 0 ? '+' : ''}${e.value}`
          : 'arc' in e
            ? `arc ${e.arc.replace('arc.', '')}: ${e.stage}`
            : 'ending' in e
              ? `ENDING ${e.ending}`
              : '',
    )
    .filter(Boolean)
    .join(', ');

mkdirSync('docs/review', { recursive: true });
for (const job of jobs) {
  const [roleId, title] = ROLES[job];
  const mine = events.filter((e) => e.role === roleId || e.roles?.includes(roleId));
  const out = [
    `# Review pack: ${title}`,
    '',
    'AI first draft. Please read as someone who has done this job. For each scene mark: realistic? (is the',
    'pressure believable), tone (grey, not cartoonish), Vietnamese natural (not a translation). Write notes',
    'under each scene. Names and places are invented.',
    '',
    `${mine.length} scenes. Facts created are listed under each outcome.`,
    '',
  ];
  for (const e of mine) {
    const s = scenes.get(e.scene);
    if (!s) continue;
    out.push(`## ${e.id.replace('event.', '')}`, '');
    const when = e.beat
      ? `beat, weeks ${e.beat.from_week}-${e.beat.to_week}`
      : e.weight === 0
        ? 'comes from a storyline'
        : 'random';
    out.push(`*${when}${(e.tags ?? []).length ? `; tags: ${e.tags.join(', ')}` : ''}*`, '');
    for (const l of s.lines) {
      out.push(`- **${speaker(l.speaker, en)}:** ${en[l.text_key]}`);
      out.push(`  - *VI* **${speaker(l.speaker, vi)}:** ${vi[l.text_key]}`);
    }
    out.push('');
    for (const c of s.choices ?? []) {
      out.push(`**${c.id}.** ${en[c.text_key]}  `, `*VI:* ${vi[c.text_key]}`, '');
      for (const o of c.outcomes) {
        out.push(
          `- (${Math.round(o.p * 100)}%${o.result === 'fail' ? ', goes badly' : ''}) ${en[o.narration_key]}`,
        );
        out.push(`  - *VI:* ${vi[o.narration_key]}`);
        const sum = summary(o.effects);
        if (sum) out.push(`  - effects: ${sum}`);
      }
      out.push('');
    }
    out.push('Review: [ ] realistic  [ ] tone  [ ] Vietnamese natural. Notes:', '', '---', '');
  }
  const used = new Set();
  for (const e of mine) {
    for (const c of scenes.get(e.scene)?.choices ?? []) {
      for (const o of c.outcomes)
        for (const x of o.effects ?? []) if ('fact' in x) used.add(x.fact);
    }
  }
  out.push('## Lessons shown in the end-of-year review', '');
  for (const id of [...used].sort()) {
    const f = facts.get(id);
    if (!f?.lesson_key) continue;
    out.push(`- **${en[f.text_key]}** (severity ${f.severity}): ${en[f.lesson_key]}`);
    out.push(`  - *VI:* ${vi[f.lesson_key]}`);
  }
  writeFileSync(`docs/review/${job}.md`, `${out.join('\n')}\n`);
  console.log(`wrote docs/review/${job}.md (${mine.length} scenes)`);
}
