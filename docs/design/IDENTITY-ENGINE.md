# Design: the identity engine (profile, career ladder, generated characters, behaviour)

Status: PROPOSAL (2026-10-02), asked for by the owner: a player profile (sex, background, age) and a career
ladder that affect each other, a mechanic where everything the player chooses affects scenes, story, lore and
stats, and a generator of new characters (seed plus a library of attributes) that are created on events, saved,
affected by the player, and act on the player by probability, following the same profile algorithm as the
player. This document recommends the algorithms and asks the questions we need answered. No code yet.
It builds on `docs/design/PROFILE-AND-TIME.md` (the player-facing side of the profile).

## 1. The one idea that makes it all fit: everyone is a Person

The player and every non-player character are the **same kind of thing**: a `Person`. The only difference is
who makes the choices (a human, or the behaviour algorithm). Every rule below is written once and applies to
both, which is exactly what the owner asked ("those characters follow the algo of the profile like the main
player").

A Person has four layers, from the slowest-changing to the fastest.

| Layer | What it holds | Changes how fast |
| ----- | ------------- | ---------------- |
| **Origin** | Seed, birth year, gender, region and family background, education, temperament, values, quirks, voice | Never (fixed at creation) |
| **Life state** | Career (company, department, ladder step, tenure, performance), money (income, debt, savings), home (partner, children, parents, housing), health, energy, stress | Slowly: yearly or by life events |
| **Memory** | Facts about what they did and what was done to them; feelings about each other person (trust, loyalty, favours, fear, affection); grudges and debts; what they know (gossip) | Every week, from the event log |
| **Intent** | Current goals derived from the other layers (get promoted, pay the debt, stay safe, take revenge, leave) | Every week, recomputed |

Origin and Life state are the "profile". Memory is what the game already does (facts, relationships, gossip),
extended to every person. Intent is new, and it is what makes characters act on their own.

## 2. The attribute library (data, not code)

Everything the generator and the behaviour algorithm use lives in content packs as data, validated like the
rest of the content, in English and Vietnamese:

- **Temperament axes** (a small set, 0 to 100): caution, ambition, warmth, integrity, resilience, impulsivity.
  Six numbers are enough to produce recognisably different people without becoming a personality test.
- **Values** (what they care about, pick two or three): security, status, fairness, loyalty, freedom, family,
  money, craft.
- **Quirks** (about 60 to start): short tags such as `keeps_a_notebook`, `never_says_no_to_the_boss`,
  `gossips`, `clicks_first`, `proud_of_the_old_way`, `sends_messages_at_night`. A quirk carries hooks (see 6)
  and text pools (lines and mannerisms).
- **Backgrounds:** education, region, family situation, how they got the job, with their effects on starting
  skills, money and trust.
- **Life events:** marriage, child, illness in the family, loan, windfall, move, bereavement, scandal, with
  hazard rates by age and state (see 7).
- **Name and voice libraries** (Vietnamese and English), including forms of address by age and gender.
- **Archetypes** (about 12): soft starting points such as "ambitious climber", "tired veteran", "idealist
  newcomer", "quiet fixer", "charming operator". An archetype only shifts the odds; it never fixes a person.

Rule for fairness: **personality axes are independent of gender and age.** Age and gender change life
state (for example dependents, energy, how others treat the person), never the temperament numbers.
Correlations are allowed only where real life creates them (age to dependents and savings).

## 3. Generating a new character (recommended algorithm)

Characters are generated on events: a hire, a transfer, a visitor, a complainant, a new buyer contact.
The director (or a story arc) asks for a person; the generator answers deterministically.

1. **Request.** The caller says what it needs: `{role or department, age range, relation to the player, story
   function}`. Story functions are things like complainant, accused, tempter, rival, mentor, favour-seeker,
   whistleblower. (See 8: this is how arcs stop depending on fixed named people.)
2. **Seed.** `characterSeed = hash(runSeed, eventId, counter)`. Same run, same event, same person. The result
   is written to the log as a `person.created` event, so replays reproduce it exactly.
3. **Demographics.** Sample age, gender and region from the company's distribution for that department
   (adjustable per company, so a securities firm and a factory differ).
4. **Background.** Sample education, family situation and how they got the job, **conditioned on age**
   (a 24-year-old rarely has three children).
5. **Temperament and values.** Start from an archetype chosen by weighted draw (weights shifted by the
   requested story function: a tempter is more likely to start low in integrity and high in ambition), then
   add noise per axis. Pick values with the archetype's affinities.
6. **Quirks.** Draw two or three from the library, rejecting incompatible pairs (for example
   `never_says_no_to_the_boss` with `blunt_to_a_fault`).
7. **Life state.** Derive income from role and step, money and home from age and background by rules, then
   add one or two open life threads (a loan, a sick parent) from the hazard tables.
8. **Intent.** Compute starting goals from values, money pressure and ambition.
9. **Name and voice.** Draw a name and pick a voice sheet (speech tags used to select text variants).
10. **Validate, then persist.** Reject and redraw (with the next sub-seed) if the person is contradictory or
    too similar to someone already in the company. Save to the people store and emit the creation event.

**Persistence.** The truth stays the event log (seed plus inputs gives the same world). The "database" is a
materialised view of that log, one row per Person plus their memory and relationships, for saves, browsing
the cast, a dossier screen and, later, sharing a world. This keeps replay and determinism, which CI checks.

**Hybrid cast.** The existing named people (Khoa, Lan, Oanh, Kien and so on) become **anchors**: authored,
fixed, richly written. Generated people fill the large middle: colleagues, new hires, visitors, rivals.
Anchors follow the same Person schema, so everything below applies to them too.

## 4. Appraisal: how a choice changes how others feel (the core "everything affects everything" rule)

Today a choice moves a fixed number for a named person. The recommended rule makes the **observer's
identity** part of the result:

`feeling change = base effect of the action  x  how well the action matches the observer's values  x  how well they know`

Each action is tagged (honest, rule_breaking, generous, loyal, ruthless, protective, selfish). Each observer
has values and temperament. So the same shortcut:

- costs trust with a fair-minded colleague,
- raises trust with a pragmatic boss who wanted the number,
- earns fear and a lasting favour from a cautious person who owed a debt,
- and may become a gossip item that reaches others, weighted by how much the carrier gossips.

This single rule is what lets one player choice ripple differently through a generated cast without anyone
hand-writing the matrix. Facts stay as they are (severity, traces, detectors, consequences); appraisal adds
who reacts and how.

## 5. Behaviour: what generated people do to and with the player (recommended algorithm)

Every week, for each active person near the player (and a cheaper pass for everyone else), the world picks
at most one action per person using a **utility-based, seeded choice**:

1. **Candidate actions** come from a library: ask a favour, offer a gift, share a warning, gossip, complain,
   report, take credit, sabotage, support, tempt, ask for a loan, flirt, quit, ask for a reference, and so on.
   Each action has *preconditions* (relationship thresholds, state such as money pressure, available
   opportunity), a *base weight*, *trait modifiers* (integrity lowers the weight of tempt, ambition raises
   take credit), *context modifiers* (month, audit week, recent events) and a *cooldown*.
2. **Utility.** For each candidate, `utility = base weight x trait modifiers x context modifiers x
   (how much their intent wants it) - (risk they perceive)`. Perceived risk uses caution and what they
   know about the player (a player known to report things is less often asked for favours).
3. **Selection.** Softmax over the utilities with a temperature set by impulsivity: cautious people mostly
   pick the top action, impulsive people less predictably. A seeded draw makes it reproducible.
4. **Target.** Pick the target by relationship and opportunity (the player, or another person).
5. **Surfacing.** The director decides whether an action becomes **a scene** (it touches the player, is
   rare enough, fits the week's pacing, at most a few per week) or happens **off screen** (becomes a rumour or
   a fact the player may learn). People act on each other too, so the world moves without the player.
6. **Consequences** flow back as events: relationship changes by appraisal, facts, rumours, new intents.

Example: a colleague with high money pressure, low integrity and a relationship of trust with the player
has a rising weight on "ask for a favour" and then "ask the player to cover for me". A new hire with high
integrity and a wary boss may instead "report" something the player did.

## 6. How the profile and the ladder feed each other

| From | To | How |
| ---- | -- | --- |
| Age, dependents, money | Hours, energy, stress | Free hours and recovery change; the same job overhead hurts more |
| Money pressure | Temptation weights | Cash offers pull harder (for the player and for generated people) |
| Ambition, values | Ladder pursuit | Ambitious people chase steps and take shortcuts sooner; family-valuing people turn down relocations |
| Integrity record (facts) | Ladder eligibility | Serious private facts block steps; clean records earn sponsors |
| Reputation, sponsors | Ladder chances | A sponsor (someone senior who trusts you) is needed for the next step |
| Gender, age, background | How others treat you | Only through scenes and relationship starting points, never through hidden stat penalties |
| Life events | Everything | A child, an illness or a loan changes money, hours and intent, and creates scenes |
| Ladder step | Scenes available | New pressures, new people, new temptations at each step |

Because the player and generated people share these rules, a rival colleague with a mortgage and a sponsor
**competes with the player for the same promotion**, which is where the ladder becomes a story.

## 7. The career ladder and life events (for everyone)

**Ladder.** Each department has steps (for example staff, senior, lead, manager, head). A step has
requirements: tenure, performance, reputation with the boss, no disqualifying facts, a sponsor, and a
vacancy. Movement can be up, sideways (another department), out (another company or leaving), or down.
At each review cycle the world evaluates every candidate with the same function, using performance
(skill, effort, luck, context) and the company's situation (growth, freeze, layoffs). Promotions, exits and
vacancies create new events, new generated people (replacements) and new story. The existing "manager
offer" beats become the player's view of this engine rather than hand-placed events.

**Life events.** Each person has hazard rates per year by age and state (marriage, child, family illness,
loan, windfall, relocation, bereavement). When one fires, it changes life state, can trigger a scene for
anyone near them, and is stored in memory and lore ("Mai got married in March"). The player's
"when will you marry?" style moments (see the profile doc, section 8) are the player's side of the same system.

## 8. Story and lore: from fixed casts to roles that people fill

Today an arc has named people (The Complaint: Ngoc and Vinh). The recommended direction:

- Arc scenes are written against **story functions** (complainant, accused, boss, witness) with text pools and
  constraints, not names. The generator casts them from the current company (an existing person who fits, or
  a newly generated one). So The Complaint can happen to different people in different runs.
- Anchors stay for what must be unique (the boss, the inspector, the owner's family).
- **Lore** is the readable record of the run: a growing "who is who and what happened" book built from
  facts, life events, relationships and gossip, shown in the cast panel and the debrief. It is derived from
  the log, so it needs no extra authoring.
- Text uses voice sheets and quirk pools so a generated person sounds like themselves, and uses the right
  forms of address (anh, chị, em, ông, bà) from age and gender.

## 9. Modules (design view, no code)

New modules, each communicating by events like the existing ones: **identity** (people store, generation,
appraisal), **life** (life events and life state), **ladder** (careers, reviews, vacancies), **behaviour**
(propensities and action selection). The existing relationships, social, risk and director modules are
extended, not replaced. All randomness comes from the seeded generator, so CI replay still holds.

## 10. Risks and how we handle them

- **Generic characters.** Mitigation: a rich quirk and voice library, anchors for key roles, and pacing so only
  a few generated people matter at a time.
- **Content cost.** Text pools and scene slots multiply authoring. Mitigation: author the library once; reuse
  across all jobs; offline AI drafts reviewed by people (no free-form AI at runtime unless you decide so).
- **Balance.** More moving parts make balance harder. Mitigation: the existing balance bots extend to
  measure profile, ladder and behaviour (careful, random, reckless across personas).
- **Stereotypes and ethics.** Independent personality axes, bias shown through scenes with real options,
  practitioner review, and an opt-in realism level.
- **Cost of simulating everyone.** Full simulation only for people near the player; a cheap yearly pass for
  the rest.

## 11. Suggested build order

1. **Person schema and the people store** for the player first (profile screens from the profile doc), plus
   appraisal (section 4) applied to existing anchors.
2. **The generator** (section 3) for a small set of story functions, and arcs rewritten to cast roles.
3. **Behaviour** (section 5) for generated people near the player, with a short action library.
4. **Life events** (section 7) and the **ladder** (section 7) for the player and then everyone.
5. **Lore book, dossier screen and database projection.**
6. Multi-year play, if you want it (question 1).

## 12. Questions for the owner

Critical (they change the architecture):

1. **How long is a game?** One year per job (as now), or a multi-year career (5 to 10 years) where the ladder,
   marriage, children and moving between departments and companies really play out? The ladder and life
   events need years to mean anything. Recommendation: a multi-year career mode, with the one-year job as the
   short mode.
2. **Does the world persist across runs?** Each run is a fresh world (simplest, replayable), or a career
   carries people, reputation and lore forward, or a shared "world seed" for a class?
3. **How many people?** Roughly how big should the cast around the player be (for example 15 to 25 active
   people, 100 or more in the company)?
4. **Are anchors (Lan, Khoa, Oanh...) fixed, or may the generator replace them over time** (retirement, leaving)?
5. **Runtime AI text.** Dialogue from authored pools only (deterministic, offline, reviewed), or may an AI model
   write lines while playing (richer, but unreviewed and not reproducible unless cached)? Recommendation:
   authored pools, with AI used offline to expand them.

Design questions (they shape the content):

6. **Relationships with the player:** friendships and rivalries yes. What about romance, marriage and family?
   Does the player choose a partner, and how deep should it go (it affects money, hours and ending)?
7. **Can characters die, be fired, be arrested, quit,** and does the world replace them? How dark may that be?
8. **Hidden or visible?** Can the player see other people's profiles (a dossier), or learn them over time
   (what you discover through scenes)? Recommendation: learn over time, with a dossier that fills in.
9. **Gender and age mix** in generated people: realistic per industry (including imbalance, which is a
   realistic pressure), or evenly balanced by default?
10. **Vietnamese cultural depth:** family obligation, hierarchy, Tet gifts, forms of address, regional
    differences. How far should the identity system model them?
11. **Where is the database?** In the browser on the device (simplest, private), a local file, or a server
    (needed for classes, sharing and teacher dashboards)?
12. **Authoring tools:** do you want an editor for the attribute library (quirks, backgrounds, life events)
    so non-programmers can extend it?
13. **Order of work:** profile and ladder for the player first, or the generator first?
