import { describe, expect, it } from 'vitest';
import type {
  Arc,
  Character,
  ContentView,
  EventDraft,
  Fact,
  Locale,
  Scene,
  Term,
} from '@je/contracts';
import { Run, runFixture } from '@je/kernel';
import { educationModule, manifest, type EducationConfig } from '../src';

const fee: Fact = {
  id: 'fact.fee',
  category: 'integrity',
  severity: 9,
  text_key: 'f.fee',
  lesson_key: 'l.fee',
};
const pad: Fact = {
  id: 'fact.pad',
  category: 'integrity',
  severity: 6,
  text_key: 'f.pad',
  lesson_key: 'l.pad',
};
const honest: Fact = {
  id: 'fact.honest',
  category: 'integrity',
  severity: 2,
  text_key: 'f.honest',
};
const facts = [fee, pad, honest];
const scene: Scene = {
  id: 'scene.a',
  location: 'loc.x',
  terms: ['term.kickback', 'term.po'],
  lines: [{ speaker: 'a', text_key: 'k' }],
  choices: [{ id: 'c1', text_key: 'c.take', outcomes: [{ p: 1, narration_key: 'n' }] }],
};
const terms: Term[] = ['term.kickback', 'term.po', 'term.unseen'].map((id) => ({
  id,
  term_key: `${id}.t`,
  definition_key: `${id}.d`,
}));
const khoa: Character = {
  id: 'char.khoa',
  name_key: 'khoa.n',
  title_key: 'khoa.t',
  department: 'qc',
};
const minh: Character = {
  id: 'char.minh',
  name_key: 'minh.n',
  title_key: 'minh.t',
  department: 'qc',
};
const hamper: Arc = {
  id: 'arc.hamper',
  title_key: 'arc.hamper.t',
  stages: [{ id: 'gift', event: 'event.gift' }],
};
const strings: Record<Locale, Record<string, string>> = {
  en: {
    'f.fee': 'the fee you took',
    'f.pad': 'the padded forecast',
    'f.honest': 'the honest answer',
    'l.fee': 'Gifts from buyers are a conflict of interest.',
    'l.pad': 'Forecasts feed real decisions.',
    'c.take': 'Accept the fee',
    'debrief.choice': 'You chose: {choice}',
    'debrief.spread.witnessed': 'Someone who was there knows: {fact}',
    'debrief.spread.rumor': 'Word got around: {fact}',
    'debrief.spread.public': 'It became public: {fact}',
    'debrief.detected': '{detector} caught: {fact}',
    'debrief.detected_audit': '{detector} caught it in the audit: {fact}',
    'debrief.scapegoat': 'Your boss blamed you for {fact}',
    'detector.finance': 'Finance',
    'ending.completed.title': 'You made it through the year.',
    'ending.completed.body': 'Nothing caught up with you.',
    'ending.fired.title': 'You were let go.',
    'ending.fired.body': 'The company parted ways with you.',
    'term.kickback.t': 'Kickback',
    'term.kickback.d': 'A payment to win business.',
    'term.po.t': 'PO',
    'term.po.d': 'Purchase order.',
    'khoa.n': 'Mr Khoa',
    'khoa.t': 'QC Manager',
    'minh.n': 'Minh',
    'minh.t': 'Lab technician',
    'arc.hamper.t': 'The hamper',
  },
  vi: {
    'f.fee': 'khoản phí bạn nhận',
    'debrief.choice': 'Bạn đã chọn: {choice}',
    'c.take': 'Nhận khoản phí',
    'ending.fired.title': 'Bạn bị cho thôi việc.',
  },
};
const content: ContentView = {
  get: ((kind: string, id: string) =>
    kind === 'fact'
      ? facts.find((f) => f.id === id)
      : kind === 'term'
        ? terms.find((t) => t.id === id)
        : kind === 'scene' && id === scene.id
          ? scene
          : kind === 'character'
            ? [khoa, minh].find((c) => c.id === id)
            : kind === 'arc'
              ? [hamper].find((a) => a.id === id)
              : undefined) as never,
  all: (() => []) as never,
  text: (locale, key) => strings[locale][key],
};

const ev = (type: string, payload: unknown) => ({ type, payload });
const state = (vars: Record<string, number>) => ev('sim.stateChanged', { full: true, vars });
const choice = (withFact: boolean) =>
  ev('choice.resolved', {
    sceneId: 'scene.a',
    choiceId: 'c1',
    outcome: 'ok',
    ...(withFact ? { effects: [{ fact: 'fact.fee', visibility: 'private' }] } : {}),
  });
const learned = (factId: string, visibility: string) =>
  ev('fact.learned', { factId, visibility, knownBy: ['player'] });
const escalated = (factId: string, to: string) =>
  ev('fact.escalated', { factId, from: 'private', to, knownBy: ['player'] });
const ended = (turn = 30, ending?: string) =>
  ev('run.ended', { turn, ...(ending ? { ending } : {}) });

function debrief(given: { type: string; payload: unknown }[], cfg: Partial<EducationConfig> = {}) {
  const out: EventDraft[] = runFixture(educationModule, {
    config: { content, ...cfg },
    given,
    expect: [],
  });
  expect(out.map((e) => e.type)).toEqual(['debrief.ready']);
  return out[0]!.payload as {
    ending: string;
    title: string;
    body: string;
    weeks: number;
    stats: Record<string, number>;
    timeline: { turn: number; kind: string; text: string }[];
    lessons: { factId: string; fact: string; lesson: string }[];
    terms: { id: string; term: string; definition: string }[];
    people: {
      character: string;
      name: string;
      title: string;
      trust: number;
      loyalty: number;
      owed: number;
    }[];
    arcs: { arc: string; title: string; status: string }[];
  };
}

describe('education: the debrief', () => {
  it('a quiet run ends as completed, with an empty story and the final stats', () => {
    const d = debrief([
      state({ 'player.stress': 41.6, 'player.rep.boss': 55, 'world.turn': 3 }),
      ended(52),
    ]);
    expect(d).toMatchObject({
      ending: 'completed',
      title: 'You made it through the year.',
      weeks: 52,
    });
    expect(d.stats).toEqual({ 'player.stress': 42, 'player.rep.boss': 55 });
    expect(d.timeline).toEqual([
      { turn: 51, kind: 'ending', text: 'You made it through the year.' },
    ]);
    expect(d.lessons).toEqual([]);
    expect(d.terms).toEqual([]);
  });

  it('tells the chain from what you did to what came back, in order, with turn numbers', () => {
    const d = debrief([
      { ...choice(true), payload: (choice(true) as { payload: object }).payload },
      learned('fact.fee', 'private'),
      escalated('fact.fee', 'witnessed'),
      ev('risk.detected', {
        factId: 'fact.fee',
        detector: 'finance',
        trace: 'payment',
        audit: true,
      }),
      escalated('fact.fee', 'rumor'),
      ev('risk.scapegoated', { factId: 'fact.fee' }),
      escalated('fact.fee', 'public'),
      ended(40, 'fired'),
    ]);
    expect(d.timeline.map((e) => [e.kind, e.text])).toEqual([
      ['choice', 'You chose: Accept the fee'],
      ['spread', 'Someone who was there knows: the fee you took'],
      ['detected', 'Finance caught it in the audit: the fee you took'],
      ['spread', 'Word got around: the fee you took'],
      ['scapegoated', 'Your boss blamed you for the fee you took'],
      ['spread', 'It became public: the fee you took'],
      ['ending', 'You were let go.'],
    ]);
    expect(d.ending).toBe('fired');
    expect(d.body).toBe('The company parted ways with you.');
  });

  it('a private fact is a lesson but not a story: nobody found out', () => {
    const d = debrief([learned('fact.fee', 'private'), ended()]);
    expect(d.timeline.map((e) => e.kind)).toEqual(['ending']);
    expect(d.lessons).toEqual([
      {
        factId: 'fact.fee',
        fact: 'the fee you took',
        lesson: 'Gifts from buyers are a conflict of interest.',
      },
    ]);
  });

  it('only choices that left a mark are in the story, and plain detection is worded differently', () => {
    const d = debrief([
      choice(false),
      ev('risk.detected', {
        factId: 'fact.pad',
        detector: 'finance',
        trace: 'record',
        audit: false,
      }),
      ended(),
    ]);
    expect(d.timeline.map((e) => e.text)).toEqual([
      'Finance caught: the padded forecast',
      'You made it through the year.',
    ]);
  });

  it('lists lessons most serious first, skips facts without a lesson, and respects the limit', () => {
    const all = [
      learned('fact.pad', 'private'),
      learned('fact.honest', 'private'),
      learned('fact.fee', 'private'),
      ended(),
    ];
    expect(debrief(all).lessons.map((l) => l.factId)).toEqual(['fact.fee', 'fact.pad']);
    expect(debrief(all, { maxLessons: 1 }).lessons.map((l) => l.factId)).toEqual(['fact.fee']);
  });

  it('shows the glossary of scenes the player actually saw, in the order met, and respects the limit', () => {
    const seen = ev('scene.started', { sceneId: 'scene.a', location: 'l', lines: [], choices: [] });
    const other = ev('scene.started', {
      sceneId: 'notice.x',
      location: 'l',
      lines: [],
      choices: [],
    });
    const d = debrief([seen, other, seen, ended()]);
    expect(d.terms).toEqual([
      { id: 'term.kickback', term: 'Kickback', definition: 'A payment to win business.' },
      { id: 'term.po', term: 'PO', definition: 'Purchase order.' },
    ]);
    expect(debrief([seen, ended()], { maxTerms: 1 }).terms).toHaveLength(1);
  });

  it('writes in the configured language, and shows the key where a string is missing', () => {
    const d = debrief([choice(true), ended(10, 'fired')], { locale: 'vi' });
    expect(d.title).toBe('Bạn bị cho thôi việc.');
    expect(d.timeline[0]!.text).toBe('Bạn đã chọn: Nhận khoản phí');
    expect(d.body).toBe('[ending.fired.body]');
  });

  it('uses the ending the run was asked to end with when the kernel did not repeat it', () => {
    const d = debrief([ev('run.endRequested', { ending: 'burnout', reason: 'risk' }), ended(20)]);
    expect(d.ending).toBe('burnout');
  });
});

describe('education: in a run', () => {
  it('produces exactly one debrief when the run ends, and none before', () => {
    const run = new Run({
      seed: 's',
      modules: [educationModule],
      configs: { education: { content } },
    });
    run.runTurns(3);
    expect(run.entries.some((e) => e.type === 'debrief.ready')).toBe(false);
    run.end();
    const made = run.entries.filter((e) => e.type === 'debrief.ready');
    expect(made).toHaveLength(1);
    expect((made[0]!.payload as { weeks: number }).weeks).toBe(3);
    expect(made[0]!.source).toBe('education');
  });

  it('lists the people your choices moved, with how they feel, and ignores seeding and drift', () => {
    const rel = (character: string, dimension: string, to: number, reason?: string) =>
      ev('relationship.changed', {
        character,
        dimension,
        from: 0,
        to,
        ...(reason ? { reason } : {}),
      });
    const d = debrief([
      rel('char.khoa', 'trust', 10, 'start'),
      rel('char.minh', 'trust', 15, 'start'),
      rel('char.minh', 'trust', 30, 'scene.a/c1'),
      rel('char.minh', 'owed', -1, 'scene.a/c1'),
      rel('char.khoa', 'trust', 9, 'drift'),
      rel('char.ghost', 'trust', 5, 'scene.a/c1'),
      ended(),
    ]);
    expect(d.people).toEqual([
      {
        character: 'char.minh',
        name: 'Minh',
        title: 'Lab technician',
        trust: 30,
        loyalty: 0,
        owed: -1,
      },
    ]);
    expect(debrief([ended()]).people).toEqual([]);
  });

  it('lists storylines as closed or still open, with their titles', () => {
    const d = debrief([ev('arc.started', { arc: 'arc.hamper', eventId: 'event.gift' }), ended()]);
    expect(d.arcs).toEqual([{ arc: 'arc.hamper', title: 'The hamper', status: 'open' }]);
    const closed = debrief([
      ev('arc.started', { arc: 'arc.hamper', eventId: 'event.gift' }),
      ev('arc.ended', { arc: 'arc.hamper', reason: 'end' }),
      ev('arc.started', { arc: 'arc.unknown', eventId: 'e' }),
      ended(),
    ]);
    expect(closed.arcs).toEqual([{ arc: 'arc.hamper', title: 'The hamper', status: 'closed' }]);
  });

  it('declares what it uses and needs content', () => {
    expect(manifest.emits).toEqual(['debrief.ready']);
    expect(() => educationModule.createModule({ config: undefined } as never)).toThrow(/config/);
  });
});
