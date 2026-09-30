# Writing events for JobEx: rules and vibe

For people and AI assistants adding new events, scenes, facts and glossary terms. Read this, then use
`docs/AUTHORING.md` for the file format and `content-src/examples/qc-example.yml` as the template.
Check what already exists first: `pnpm content:list --role <job>` and `pnpm content:list --facts`.

## 1. What the game is for

The player lives a week-by-week year in someone else's job and learns what that job is really like,
including the parts nobody puts in a job description: pressure from above and beside, small
compromises, and shortcuts that work until they do not. We show the dark side honestly so the player
understands it. We do not teach how to do wrong things well, and we do not preach.

## 2. The vibe

- **Plain, workplace-real.** Short lines people would actually say in a meeting or a chat. No
  melodrama, no villains. The pressure usually comes from a reasonable-sounding person with a
  deadline.
- **Grey, not cartoonish.** The shortcut is tempting because it is sensible in the moment and has a
  real benefit. The right choice costs something: time, reputation, a tense week.
- **The wrong thing is ordinary.** Rounding a number, signing a form, skipping a step, taking a gift.
  Small and deniable beats dramatic and criminal.
- **Consequences are quiet first.** Most bad choices work this time. The cost arrives later, as a
  trace, a rumour, an audit, a colleague who remembers. The debrief, not the scene, names the lesson.
- **No moralising inside the scene.** Narration states what happens, not what the player should have
  done. The lesson belongs in a fact's `lesson` text.
- **Tone is dry and a little wry.** Never mocking of the person or their job.
- **Concrete details.** Name the document, the machine, the number, the deadline ("the CoA", "the
  oven drift", "Friday's shipment"). Invent no real company, person or law.
- **Vietnamese is written for Vietnamese workplaces**: natural, correct address (anh/chị/em, sếp),
  not a word-for-word translation of the English. Both languages must say the same thing.

## 3. The rules every scene follows

1. **Three choices, in this order: c1 by the book, c2 a legitimate compromise, c3 the shortcut.**
   Simulated test players rely on it (`first` = careful, `last` = reckless). Never reorder.
2. **Every choice has a cost.** c1 usually costs hours, stress or a relationship. c2 a bit of each.
   c3 is cheap now. If c3 is better on every axis, the scene is broken.
3. **Outcomes are probabilistic and add up to 1.** Careful choices mostly work and sometimes go
   badly anyway (real life). Shortcuts mostly work and sometimes blow up at once.
4. **Shortcuts record a fact.** When c3 (or a risky c2) is a deed someone could find out about, add
   `fact <name> private`. Use `witnessed` if someone saw it. Facts are what audits, gossip and the
   ending later use. A shortcut with no fact means nothing can ever come back.
5. **The safe choice can earn a fact too** (for example declining a gift). Doing right is on the
   record, and is recognised at the end.
6. **Size effects to the world.** See the table below. Do not hand out +20 reputation or -30 stress.
7. **Trigger events sensibly.** Use `when` so the scene fits the moment (a deadline in a peak month,
   stress already high, a fact already known). Consequence events should require the fact that causes
   them, so they only appear for players who earned them.
8. **Variety.** Do not write a near-copy of an existing scene. Check `content:list` and pick a
   different pressure, person, or kind of temptation.
9. **Cooldowns prevent repeats**: 8 to 14 weeks for common events, 20 to 30 for big ones (recalls,
   compliance interviews).
10. **Each job only sees its own events** (prefix `qc.` or `sales.`, or `role: any` for shared ones).

## 4. Size guide (effects are per outcome)

| Effect             | Small | Medium | Large (rare, big moments) |
| ------------------ | ----- | ------ | ------------------------- |
| `stress`           | +1..3 | +4..6  | +8..10                    |
| `rep.<who>`        | 1..3  | 4..6   | 8..10                     |
| `cash` (VND)       | 100k  | 1M     | 5M+                       |
| `cost: { hours }`  | 1..2  | 3..4   | 6+                        |
| fact `severity` 1-10 | 1-3 minor rule bending | 4-5 real breach, 6 a scandal if it comes out | 7+ serious (two public ones can end a run), 9+ grave (prosecution) |

Reputation groups: boss, buyer, production, qc, finance, cs. Pick the ones the scene actually
involves. A typical outcome changes 2 to 4 numbers, not all of them.

Fact visibility ladder (what happens as word spreads): private, witnessed, rumor, public. Start at
`private` unless someone clearly saw it. Each `fact:` entry can define reputation hits when it becomes
`witnessed` and `public`.

## 5. Checklist for a scene

- [ ] One clear situation, in 1 to 3 short lines, with a named person who wants something.
- [ ] Three choices c1/c2/c3 a player can tell apart at a glance, each one sentence.
- [ ] c3 is tempting, not stupid; c1 is right but costs something real.
- [ ] Outcome probabilities sum to 1; failures exist for the careful path too.
- [ ] Shortcut outcomes add a fact; narration never says "you should have".
- [ ] Every text has both `en` and `vi`, meaning the same.
- [ ] New facts have a `lesson` (one or two plain sentences: what the rule is and why it exists).
- [ ] Jargon used is a glossary `terms:` entry with a one-sentence definition.
- [ ] `pnpm author <file> --dry-run` passes, then import it.
- [ ] Run `pnpm check:fast`; if a simulated year changed, `pnpm pin:update` and say so.

## 6. Example of the tone

```yaml
lines:
  - who: supplier_rep
    en: "A small gift for the lab team. By the way, our next delivery is a little late, and a light incoming check would help us both."
choices:
  - en: "Decline politely and write the offer in the gift register." # c1: right, slightly awkward
  - en: "Accept on behalf of the team and tell your manager." # c2: open compromise
  - en: "Accept the hamper and go easy on the next delivery." # c3: easy today, a fact tomorrow
```

Notice: no villain, the ask is polite, the gift is small, and the bad option is the easy one.

## 7. Content that is not allowed

- Real people, real companies, real regulators or laws presented as fact.
- Step-by-step instructions for committing fraud or evading detection. Show the temptation and the
  consequence, not a how-to.
- Violence, harassment as a joke, discrimination, or sexual content. Workplace pressure, including
  bullying, may appear only as something the player has to handle.
- Claims of realism. All content is a first draft and needs review by someone who has done the job.

## 8. Prompt for an AI assistant

> You are writing events for JobEx. Read `content/industry-cookware/events/README.md` and `docs/AUTHORING.md`. Run
> `pnpm content:list --role <job>` and avoid duplicating existing situations. Write N new scenes for
> the `<job>` role in YAML with English and Vietnamese together, following c1 by the book, c2
> legitimate compromise, c3 shortcut, with costs, probabilities summing to 1, facts for deeds that
> could be discovered, and effect sizes from the table. Include any new facts and glossary terms.
> Validate with `pnpm author <file> --dry-run`, fix every error, then import. Do not change engine
> code. Mark the content as needing practitioner review.
