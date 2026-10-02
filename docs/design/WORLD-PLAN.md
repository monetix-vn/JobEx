# Plan: the persistent world, people and dark-path engine

Status: PLAN v2 (2026-10-02, updated for decisions 12 and 13: library editor, generator first), from the owner's answers to the identity-engine questions
(`docs/design/IDENTITY-ENGINE.md`, section 12). It turns those decisions into milestones. Nothing is built
yet. Read `docs/design/PROFILE-AND-TIME.md` and `IDENTITY-ENGINE.md` first.

## 1. What the owner decided

| # | Decision |
| - | -------- |
| 1 | Game length is a setting: one year, several years or a whole career. The design must leave room for **later graphics, motion and an open-world RPG**. |
| 2 | The player can **continue an old world** (lore, progress, people) or **start over**, with **world saves**. A new run gets a **new seed**. The old protagonist stays in the world as an autonomous person following the algorithm, and can be met by the player's new character. Generated people's attributes are **hidden** from the player. |
| 3 | Scale: about **50 people around the player**, about **500 in the company** (depends on the path), **3000 in the whole world** (hard cap). |
| 4 | The old fixed people are **replaced** by the generated system (they become ordinary Persons, or recast roles). |
| 5 | Text pools are **hand-written**, plus an **algorithm that varies the text** so it is not repetitive. |
| 6 | Romance and family depth depends on the player's actions; family members are generated and follow the algorithm. |
| 7 | Darkness has **no fixed limit**; it depends on the player's path. An algorithm controls probability and cause and effect, linked to the character pool and characteristics. |
| 8 | Profiles are **learned over time**. |
| 9 | Gender and age mix use **real-world data**. |
| 10 | **Vietnamese cultural depth as deep as possible.** |
| 11 | Saves live in **a folder, offline**. |
| 12 | Build an **attribute library editor**. |
| 13 | **Generator first**. |

## 2. Content boundaries I will keep (stated now so there are no surprises)

The simulation will model crime and violence as **causes and consequences** (motive, opportunity, risk,
detection, justice, revenge, family fallout, guilt, ostracism), including blackmail, bribery, coercion,
exploitation, theft, assault and killing, because a world that cannot punish or breed these things is not
realistic. Presentation is **non-graphic and non-glorifying**. Specifically:

- Sexual violence, sexual coercion and prostitution exist in the simulation only as **abstract, off-screen
  events with their consequences** (investigation, trauma, justice, social effects); I will not write explicit
  or titillating depictions of them. Nothing sexual involving minors is modelled in any form.
- Real historical or living people are never used; "a villain's career" is emergent from the player's
  choices, with consequences, not a named figure.
- The tone rules in `content/industry-cookware/events/README.md` extend to these systems: the point is to
  understand how people and systems produce harm, and what it costs, not to reward it.
- An **intensity setting** at world creation (how explicit text is allowed to be, whether some themes are
  skipped) is part of the plan; the underlying simulation stays the same.

## 3. Architecture in one picture

- **The log stays the truth.** Seed plus player inputs still produces the same world, checked in CI. The new
  parts add events, not a second source of truth.
- **World = seed + people + places + time + history.** A world has a `worldSeed`. Each run inside it has a
  `runSeed` (the "new seed" on restart). Generation of new people mixes both, so a continued world is not
  identical to its previous run.
- **Snapshots plus log chunks.** A multi-year, 3000-person world cannot be replayed from week one on every
  load, so the save is a periodic full snapshot plus the log since then. Replay tests in CI still cover short
  horizons from seed; long horizons are checked by snapshot-equals-replay on sampled worlds.
- **Tiers of simulation (level of detail).** Tier A (about 50, near the player) acts weekly with the full
  behaviour algorithm. Tier B (the company, about 500) runs a cheaper monthly pass. Tier C (the rest, up
  to 3000) runs a yearly statistical pass (births, deaths, marriages, moves, jobs) and is **materialised**
  into a full Person the moment the player meets them. A Person promoted to Tier A keeps a consistent past
  because Tier C stores the facts the yearly pass produced.
- **Folder saves.** A world is a folder: `world.json` (settings, seeds), `people/` (one file per person or
  chunks), `log/` (log chunks), `snapshots/`, `lore/`. A small local save host (Node, started by `play.bat`)
  reads and writes the folder; the browser game talks to it. Fallback: the browser's directory-picker
  permission where available. Later a desktop shell (Tauri or Electron) can replace the host.
- **Client stays a view.** The client only reads state through the existing transport and renders it. This is
  already the architecture; the plan keeps it strict (a view-model per screen) so a graphical or open-world
  client can replace the text one. People and places carry **location and schedule fields from the start**
  (unused at first) so movement can be added later.
- **Time model.** The calendar gets a **day** as its base unit now (cheap today, expensive later). The
  simulation still ticks weekly at first; the settings expose year length, speed and (later) finer steps.
- **New modules** (each only talks by events, as today): `identity` (people store, generation, appraisal),
  `perception` (what the player believes about each person), `life` (life events, family, ageing),
  `ladder` (careers), `behaviour` (actions and pacing), `crime` (norms, detection, justice, revenge),
  `world` (population tiers, births, deaths, companies), `text` (realiser). Save and load live in a tool
  package (it needs the file system), not in the browser packages.

## 4. The algorithms (summary; details in `IDENTITY-ENGINE.md` and below)

1. **Person model and appraisal.** Four layers (origin, life state, memory, intent); appraisal = action effect
   x match with the observer's values x how well they know the player.
2. **Generator.** Seeded conditional sampling with archetype priors, quirk compatibility, rejection and
   validation; story-function casting.
3. **Real-world distributions.** Demographics, marriage, fertility, mortality, education, income and
   occupation mix come from a **data pack** of public statistics for Vietnam (sources and years recorded per
   table), compiled offline into compact tables. See 6.
4. **Perception (hidden attributes, learned over time).** The player never sees a person's true numbers.
   Each person has, for the player, a set of **impressions** (a noisy estimate per trait with a confidence).
   Observations (scenes, outcomes, gossip, records) nudge impressions and raise confidence; first
   impressions are biased by appearance, role and rumour. The dossier shows impressions with confidence
   and what is known versus guessed. NPCs have the same perception of each other and of the player; **a
   reputation is simply other people's impressions**.
5. **Behaviour.** Utility-based, seeded action choice with preconditions, trait and context modifiers,
   perceived risk, softmax temperature from impulsivity, and director pacing (what becomes a scene).
6. **Life, family and ageing.** Hazard-rate life events; **inheritance** (children blend both parents'
   temperament and values with noise, plus upbringing effects); ageing and death; marriage markets with
   age, class and location constraints; population balance (births, deaths, migration) to stay under 3000.
7. **Ladder.** Steps with eligibility, sponsors, vacancies and competition among candidates, evaluated for
   everyone with the same function.
8. **Dark-path engine (`crime`).** A causal model, not a dice roll on a menu:
   - **Motive** (need, greed, anger, fear, loyalty, ideology) comes from the person's state.
   - **Opportunity and means** come from role, access and relationships.
   - **Barrier** is conscience: integrity and values, **eroded by habituation** (each transgression lowers the
     next barrier; remorse or punishment raises it) and by company culture.
   - **Perceived risk** from caution and what they believe about detection.
   - **Probability** is a function of motive x opportunity x (1 - barrier) x (1 - perceived risk), calibrated
     to **base rates** for the population (so most people most of the time do not), scaled by context.
   - **Detection and justice:** traces, witnesses, rumour spread, investigators, evidence, arrest, trial,
     punishment, with corruption and class affecting outcomes (realistically unfair).
   - **Consequences are caused by the world, not scripted:** victims, families, allies and rivals react by
     their own identities (revenge, fear, silence, reporting), which creates new events, new motives and, over
     years, cycles of violence or reform. Guilt, paranoia and addiction apply to people with the matching
     temperament.
   - **Escalation ladders and exits:** coercion to blackmail to violence is a ladder with a growing barrier
     collapse, and also with exits (confession, flight, a protector).
9. **Text realiser.** Authored fragments (opening, body, reaction, closing) with slots and conditions,
   chosen by a context-free grammar with: gender/age/relationship-aware forms of address (anh, chị, em, cô,
   chú, bác, ông, bà...), mood and voice tags, **a recently-used memory that penalises repetition**, and
   paraphrase sets for the same beat. The text stays hand-written; the algorithm only recombines and varies it.

## 5. Vietnamese cultural depth (a workstream, not a feature)

A **culture pack** of data and rules, built with cultural reviewers:

- Forms of address and hierarchy (age, seniority, gender, family terms, regional variants) in the text engine.
- Family obligation and filial duty (money sent home, caring for parents, eldest-child expectations, in-laws,
  ancestral rites), matchmaking pressure and marriage expectations, "face" and indirect refusal.
- Social economy: gifts and envelopes (Tet, weddings, funerals, "giving thanks"), relationship networks,
  favour debts, the "hidden agreements" around officials and licences.
- Region and migration (north, centre, south; rural to city), housing and the extended household,
  religion and folk practice, festivals and the working calendar.
- Each item is data with hooks (probabilities, scene requirements, address rules), so the same engine works.

## 6. Data pack (real-world statistics)

Work item with its own owner decision: a `data/world` pack of CSV tables with **source, year and notes per
table**, compiled into the game. Targets (public sources such as the national statistics office, labour
force surveys, census, health and demographic surveys):

- Age and gender structure by region; by industry and occupation; education levels.
- Marriage age and rates, fertility, household structure, mortality and life expectancy.
- Income and debt distributions, remittances, housing.
- Workplace mix by industry (to drive each company's age and gender mix).
- Crime and misconduct base rates (where data is thin, use broad, clearly marked priors, never presented
  as exact).
Data is versioned, validated and documented; tables with weak sources are labelled. The generator reads
them; it does not hard-code any number.

## 7. Milestones (generator first, as decided)

Each milestone ends with something the owner can see or play and with green CI. Items marked (ADR) need a
written decision record first (`docs/adr/0003-...`).

### M0: Decisions and groundwork

- ADR-0003 (identity and world engine), ADR-0004 (saves and snapshots), ADR-0005 (content boundaries).
- Performance budget (a weekly tick for 50 people, a monthly pass for 500, a yearly pass for 3000, each well
  under a second) and a test that guards it.
- Calendar with a day base unit; settings model (year length, speed, intensity); world and run seeds.

### M1: The generator and the library (first deliverable)

- Person schema and people store (origin, life state, memory, intent) in the contracts and a new `identity`
  module, with the event `person.created` in the log.
- **Data pack v1** (demographics, marriage, fertility, mortality, education, occupation and income tables with
  sources) and the **attribute library v1** (temperaments, values, about 60 quirks, backgrounds, names,
  archetypes, forms of address), validated like other content, in Vietnamese and English.
- **Generator** (4.2): seeded conditional sampling, archetype priors, quirk compatibility, rejection and
  validation, story-function casting, family generation with inheritance.
- **Attribute library editor** (12): a tool (local web page, offline, writes the pack files) to browse and
  edit quirks, values, backgrounds, archetypes, life events, name lists and weights; live validation;
  "generate 20 people with these weights" preview and distribution charts so authors see what the library
  produces; export to the content pack. This is how non-programmers extend the world.
- **Generator workbench** (CLI and the editor's preview): `pnpm people:generate --n 200 --company factory`
  prints demographic and trait distributions against the real-world tables, and flags contradictions.
- Tests: determinism (same seed, same people), distribution tests against the data pack, no impossible
  combinations, performance of generating thousands.

### M2: The world, the player's profile, saves (playable)

- Population tiers A, B, C, company staffing from distributions, births, deaths, migration, the 3000 cap.
- The player as a Person: profile screens, quick-start personas, Vietnamese address forms, settings (game
  length, speed, intensity).
- **Saves:** world folder, snapshots plus log chunks, local save host, "continue world" and "new world",
  a **new run in an old world with a new seed**.
- Dossier screen with **impressions** (perception, 4.4); hidden traits learned over time.
- A minimal ladder for the player replacing the hand-placed manager offers.
- The old fixed characters are migrated to ordinary generated Persons or role-cast slots (pilot: HR and
  Production), with the old fixed-people mode kept as a legacy option until migration is done (question 7).

### M3: People act

- Appraisal generalised to all people; gossip and reputation as impressions.
- Behaviour engine with an action library of about 40 actions and director pacing; off-screen actions
  become rumours and facts; NPC-to-NPC actions.
- Life events and the full ladder for everyone, with competition and vacancy chains.
- Switching characters: **the old protagonist becomes an autonomous Person** in the same world and can
  be met again.

### M4: The text stops repeating

- Text realiser with grammar, voice tags, forms of address, a repetition memory and paraphrase sets.
- Migrate scene text to slots and pools: pilot on two jobs, then all (a long authoring workstream, with
  practitioner review). The editor gains a text-pool view.
- Culture pack v1 wired into address, scenes and probabilities.

### M5: The dark path

- `crime` module: motive, opportunity, barrier with habituation, perceived risk, base rates, detection,
  justice, retaliation, family and victim consequences, guilt and paranoia.
- Escalation ladders and exits; consequence scenes written under the section-2 boundaries.
- Bots: a "ruthless" player and a "reformer" player to calibrate; population checks that most people
  do not commit most crimes, and that the world does not collapse or stay saintly.
- Specialist review (law, criminology, sensitivity) before release.

### M6: Romance, family and legacy

- Courtship and marriage for the player and for NPCs (data-driven markets), children as inheritance, ageing
  and death, caring for parents, heirs and old protagonists as part of the world.
- Long-run (multi-decade) playtests and a "world history" lore book generated from the log.

### M7: Quality, scale and graphics readiness

- Calibration against real-world distributions (reports that compare simulated and real data).
- Long-horizon determinism checks, snapshot equals replay, performance at the 3000 cap.
- Cultural and professional review passes; accessibility; save migration across versions.
- Spatial layer prototype (places, schedules, movement) behind a flag, as the doorway to an open-world client.
- Appearance layer on every Person from M1c (section 7a); sprite-layer manifest and validator when art starts.

## 7a. Appearance and sprites (added 2026-10-02, owner question)

There is no blocker for sprites later, but one cheap thing must be done early: give every Person an
**appearance layer** now, so saved worlds do not need a migration when graphics arrive.

- **Appearance is data, not pixels.** `appearance` is a small set of traits (body build, height class, skin tone range,
  face shape, hair style and colour, facial hair, glasses, one or two marks) plus an `appearance_seed`.
  A sprite renderer later composes layers (body, head, hair, clothes, accessories) from these traits.
- **Drawn from its own seeded stream** (`scope: appearance`), so adding it never changes existing generation results.
- **Derived from identity honestly:** age drives body class and grey hair; gender drives the body base and
  clothing options; family members **resemble each other** (children inherit traits from both parents with noise);
  region and background shape clothing and style; money and role shape clothes (uniform, office wear, ao dai on
  occasions, Tet clothes); health, stress and sleep show as visible **tells** (tired eyes, weight change).
- **Appearance is independent of temperament.** A face never tells you someone is dishonest. The only links to
  personality are through state a real person could show (grooming, fatigue, nervous habits from quirks), which
  also gives the player fair, learnable clues for the hidden traits.
- **Ageing and change over years:** sprites are layered so a person can age, change hair, gain or lose weight, and dress for
  a new job without redrawing a whole character.
- **Level of detail:** only the roughly 50 people near the player need sprites on screen; the rest keep their traits and
  render on demand.
- **Asset pipeline (later):** a sprite-layer manifest (which layer files exist per trait), a validator that every
  trait value has art (so the generator never produces a combination with no sprite), and an editor tab to preview
  a person as a sprite. Art can be hand-drawn or generated offline and reviewed; the engine does not care.
- **Open-world readiness:** people already carry location and schedule fields (section 3); animation states
  (idle, walk, talk, work) are a renderer concern and do not touch the simulation.

## 8. Dependencies and risks

- Scale of authoring: the attribute library, culture pack, text pools and scene re-casting are the biggest
  cost. Mitigation: build the system first, author in vertical slices, and use offline AI drafts reviewed by
  people, never free-form AI at runtime.
- Simulating thousands of people without making the game incomprehensible: tiers, a cap on scenes per week,
  and an understandable dossier and lore book.
- Dark systems can drift into gratuitousness or stereotype: boundaries (section 2), independent personality
  axes, and reviews.
- Data quality: weak sources are marked and used as priors, not facts.
- Determinism with snapshots: guarded by snapshot-equals-replay tests.
- Tooling: the save host adds a Node process; the one-click HTML must still work without it (with in-memory
  play and a download-your-save fallback).

## 9. Questions still open

1. **Saves:** is a small local Node save host (started by `play.bat`) acceptable, with the single HTML still
   playable without saves, or do you want a proper desktop app (Tauri or Electron) from the start?
2. **Intensity setting:** do you agree with the boundaries in section 2 (non-graphic, abstract treatment of
   sexual violence and prostitution, nothing involving minors), and with an intensity setting at world creation?
3. **Data pack:** may I use public statistics (national statistics office, surveys), noting sources, and mark
   crime and misconduct rates as priors where data is weak? Do you have preferred sources?
4. **Reviewers:** who can review the Vietnamese cultural pack and the dark-path content (people with the
   right knowledge)? Reviews are built into M4, M5 and M7.
5. ~~Order~~ decided: the generator and the library editor come first (M1).
6. **Language:** keep Vietnamese and English for everything, including the new libraries and text pools?
7. **Existing content:** the eleven jobs are written around fixed named people. Re-casting them takes time:
   migrate all of them in M2 to M4, or keep the old fixed-people mode as a legacy "classic" option while the
   new world mode grows?
