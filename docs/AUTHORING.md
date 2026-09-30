# Authoring dialogue and events

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
role: qc # optional: qc | sales | any, or a full role id
place: qc_lab # qc_lab, meeting_room, sales_office, factory_floor, finance_office
tags: [quality, pressure]
weight: 1 # how likely, relative to other events
cooldown: 12 # weeks before it can come again
when: [turn >= 6, stress < 90] # all must hold
when_any: [month in 3 6 9 12] # optional: at least one must hold
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

`rep.boss +5` · `stress +3` · `cash -800000` · `delta company.audit_readiness -5` ·
`fact accepted_kickback private` (private, witnessed, rumor, public) · `schedule event.qc.x 4-6`.

## A fact (something the player did that can come back)

```yaml
fact: signed_untested_coa
severity: 4 # 1 minor .. 5 career-ending
category: integrity
en: "You signed a certificate for a lot that was not fully tested."
vi: "..."
lesson: { en: "...", vi: "..." } # shown in the debrief
witnessed: { production: -2 } # reputation change once witnessed
public: { boss: -6, buyer: -8 } # and once public
```

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
