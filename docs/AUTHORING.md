# Authoring dialogue and events

For the rules and tone a new event must follow, read `content/industry-cookware/events/README.md` first.

You do not edit the JSON content by hand. Write a scene in a YAML file (English and Vietnamese side
by side), import it, and the tool writes the scene, its event and all the text, then validates the
whole pack. A mistake changes nothing.

```bash
pnpm author content-src/my-scenes.yml --dry-run   # check only, changes nothing
pnpm author content-src/my-scenes.yml             # import + validate
pnpm content:list --role qc                       # the event library: every event and its trigger
pnpm content:list --facts                         # every fact, most severe first
```

Start from `content-src/examples/qc-example.yml`. One file can hold many entries separated by `---`.
Importing an entry again updates it in place.

## A scene (becomes a scene + an event + text in both languages)

```yaml
scene: qc.rush_release # <job prefix>.<name>; prefix qc or sales picks the job
role: qc # optional: qc | sales | fin | prod | purch | inv | hr | sup | fpa | mkt | it | any, or a full role id
place: qc_lab # qc_lab, meeting_room, sales_office, factory_floor, finance_office
tags: [quality, pressure]
weight: 1 # how likely, relative to other events
cooldown: 12 # weeks before it can come again
when: [turn >= 6, stress < 90] # all must hold
when_any: [month in 3 6 9 12] # optional: at least one must hold
beat: 24-28 # optional: makes it a fixed episode, see "Beats" below
terms: [coa] # glossary chips shown with the scene
lines:
  - { who: boss, en: "...", vi: "..." }
choices: # c1 by the book, c2 legitimate compromise, c3 shortcut
  - en: "..."
    vi: "..."
    cost: { hours: 3 }
    requires: [skill.analysis >= 30]
    outcomes:
      - p: 0.8 # probabilities must add up to 1
        en: "What happens"
        vi: "..."
        effects: [rep.boss +2, stress -1]
      - p: 0.2
        ok: false # a failed outcome
        en: "..."
        vi: "..."
```

Keep c1/c2/c3 in that order: the simulated players used in the balance tests rely on it (first =
careful, last = reckless).

### Conditions

`stress >= 40`, `energy < 20`, `cash > 5000000`, `month in 3 6 9 12`, `turn >= 8`, `rep.boss <= 0`,
`fact.accepted_kickback >= 2`, `skill.analysis >= 30`. Operators: `>= > <= < = !=`. Aliases: stress,
energy, health, cash, month, quarter, week, turn, `rep.<who>`. Anything else is used as a full
variable name. For something the list cannot say, use `when_raw:` with the JSON expression.

### Effects

`rel khoa trust +5` (trust, loyalty or owed) · `favor khoa +1` (favours they owe you) · `rep.boss +5` · `stress +3` · `cash -800000` · `delta company.audit_readiness -5` ·
`end promoted` / `end walked_away` (ends the run with that ending: accepting a promotion, resigning) · `close bank_rec +2` (finance month-end close step: 2 done properly, 1 rushed) · `fact accepted_kickback private` (private, witnessed, rumor, public) · `schedule event.qc.x 4-6`.

## Another company (pack) and events for several jobs

A job in a different company lives in its own pack, e.g. `content/industry-securities` (copy a
`manifest.json`, layer `industry`, `depends_on: [core]`). Import into it with
`pnpm author file.yml --pack industry-securities`. An event can be limited to one job (`role`) or a few
(`roles: [..]` in JSON; the shared cookware audit events use it), so jobs in different companies never
meet each other's events.

## The month-end close (finance)

A role with `close_steps` (for example `bank_rec`, `ar_aging`, `accruals`, `cutoff`) gets a visible
checklist in the game. In the last three weeks of each month the variable `close.open` is 1, so write
step scenes with `when: [close.open = 1, close.bank_rec = 0]` and effects `close bank_rec +2`
(proper), `close bank_rec +1` (rushed) or none (skipped). When the month rolls over the close is
scored: 75% or more of the points gives the boss +2, under 40% costs -3, each open step adds 1 stress,
then all steps reset. `pnpm author` accepts these lines; the engine is `packages/mod-close`.

## Beats (the spine of the season)

A scene with `beat: 24-28` is a fixed episode: it plays once, in the first week of that window (weeks
count from 1) where its `when` holds, and never from the random pool. A beat whose condition never
holds inside the window is skipped, so keep beat conditions rare. At most one beat plays per week;
everything else stays random. Use beats for the premiere (1-3), midseason twist (about 26-30),
crisis (about 40-44) and finale (49-52). Examples: `content-src/qc-cast.yml`, `content-src/qc-beats.yml`.

## A fact (something the player did that can come back)

```yaml
fact: signed_untested_coa
severity: 6 # 1 to 10. 1-3 minor, 4-5 real breach, 6 scandal if it gets out, 7+ serious (two public ones can end the run), 9+ grave
category: integrity
en: "You signed a certificate for a lot that was not fully tested."
vi: "..."
lesson: { en: "...", vi: "..." } # shown in the debrief
witnessed: { production: -2 } # reputation change once witnessed
public: { boss: -6, buyer: -8 } # and once public
```

## A guest (a colleague from the world, not a fixed character)

```yaml
scene: gen.colleague_favour
role: any
guests:
  - { slot: colleague, function: tempter } # function: tempter, rival, mentor, complainant, whistleblower, witness, accused
lines:
  - who: guest:colleague # a line spoken by them
    en: "A quick favour, if you can."
    vi: "Nhờ bạn một việc nhỏ."
```

`{colleague}` in any text (lines, choices, outcomes) is their first name, `{colleague.full}` the full name. The person is drawn
from the world's roster or generated (`department:` picks another department; default is the player's own), and often
recurs. Their traits are hidden: the player learns them over time. In Vietnamese avoid third-person pronouns for a guest
(their gender is not known to the text); repeat the name. Example: `content-src/guests.yml`.

### Variants, voice and forms of address (guest scenes)

A line can have other ways to say it. `variants:` lists them; a variant with `voice:` (blunt, warm, formal, hesitant or smooth) is
preferred when the speaker sounds like that, the others are used otherwise, and the one shown last time is skipped. Give both
languages the same variants.

```yaml
  - who: guest:colleague
    en: "A quick favour, if you can."
    vi: "Nhờ {colleague.you} một việc nhỏ."
    variants:
      - { voice: blunt, en: "Move it up.", vi: "Đẩy nó lên đi." }
      - { en: "Quick one: could you?", vi: "Việc nhỏ thôi: giúp {colleague.self} nhé?" }
```

In Vietnamese write `{slot.call}` for how the player refers to them ("anh Hùng"), `{slot.self}` for how they refer to themselves
and `{slot.you}` for how they address the player. They come out right whoever is older, and are capitalised at the start of
a sentence. Never write "anh" or "em" for a guest yourself.

## A character (a named person who recurs and remembers you)

```yaml
char: khoa # the id is char.khoa; scenes use it as "char:khoa"
department: qc
group: boss # optional: the reputation group they belong to (facts their group learns change their trust)
traits: [methodical, fair] # notes for writers
start: { trust: 10 } # optional starting feelings, -100..100 (trust, loyalty, owed)
en: { name: "Mr Khoa", title: "QC Manager" }
vi: { name: "Anh Khoa", title: "Trưởng phòng QC" }
```

Use them in a scene with `who: char:khoa` (shown by name, in the player's language). Change how they
feel with `rel khoa trust +4` or `favor khoa +1`, and use it in conditions as `rel.khoa.trust >= 20`.
Trust and loyalty drift back towards their start every few weeks; unused characters only get a note.
Example: `content-src/qc-cast.yml`. Vietnamese: never guess the player's gender (use "anh/chị" or rephrase).

## A storyline (arc): a multi-week story the player's choices steer

```yaml
arc: the_hamper
title: { en: "The hamper", vi: "Giỏ quà" }
stages: # the first stage is the start
  - { id: gift, event: qc.supplier_gift }
  - { id: favour, event: qc.hung_favour, delay: 3-5 } # weeks after the arc moves to this stage
  - { id: money, event: qc.hung_money, delay: 2-4 }
```

- Tag the scene that starts it with `arc: the_hamper` (on the scene entry). Later scenes use
  `weight: 0`, so they only appear when the arc brings them.
- Choices steer it with effects: `arc the_hamper favour` (move to that stage, its event comes after
  the delay) or `arc the_hamper end` (close the storyline). The arc also finishes when its last
  stage's event has played. Different choices going to different stages is how a story branches.
- Every stage after the first must be reached by some effect (the validator warns otherwise).
- Example: `content-src/qc-hamper.yml` (gift, favour, money, threat, with four endings).

## A glossary term

```yaml
term: lot_number
en: { term: Lot number, definition: "..." }
vi: { term: Số lô, definition: "..." }
```

## What the validator still checks for you

Unknown terms, scenes, roles or facts; missing text; bad expressions; unreachable events. Import
reports them and exits non-zero. Then run `pnpm check:fast`, and `pnpm pin:update` if you changed
what a simulated year does (new events shift the pinned fingerprints; that is expected).

## Several jobs in one company (departments, the picker, and importing one job at a time)

Roles carry a `department` (for example `dept.hr`); the job picker groups playable roles (those with a
`blurb_key`) under the department's `dept.<name>.title` text, so each department needs that key in both
languages. A job's scenes, characters and facts reference each other, and `pnpm author` validates the whole
pack after writing, so import a job's files together (concatenate them with `---` between files, then run
`pnpm author` on the combined file once or twice) rather than one file at a time. Reputation groups and
detectors include `staff` (the rank and file) for the people-heavy jobs.
