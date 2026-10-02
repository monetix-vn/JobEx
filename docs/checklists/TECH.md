# Technical development checklist

Engine, tools and product phases. AI: read `docs/AI-GUIDE.md` first. Tick a box only when the work is
committed, `pnpm run ci:quiet` passes, and `docs/STATUS.md` is updated. Mark `[~]` for in progress
and write who/which branch after it. Keep items small (one block of work = one commit or a few).

Legend: `[x]` done, `[~]` in progress, `[ ]` not started, `(needs owner)` needs an owner decision.

## Phase 0: Foundations (done)

- [x] Monorepo, boundaries enforced in CI, contracts, kernel (bus, seeded RNG, clock, replay)
- [x] Rules: safe expression evaluator
- [x] mod-content loader/validator and pack validator CLI
- [x] Headless sim-runner, determinism gate, toy-module gate
- [x] Minimal web client shell

## Phase 1: Playable core (done except as noted)

- [x] sim-core, workload, choice, narrative, director
- [x] knowledge (facts), social (groups), risk (detection, audits, endings), education (debrief, glossary)
- [x] Two jobs playable (Sales, QC), job picker, per-job events and busyness
- [x] EN/VI live switching (in demo-host)
- [x] One-click builds (`play.bat`, `play-vi.bat`)
- [x] Dev workflow: CLAUDE.md, STATUS, quiet CI, pins, scaffold
- [x] Authoring toolchain: YAML import, `content:list`, guides
- [ ] Verify GitHub Actions actually runs green on GitHub (never observed; no `gh` available)

## Phase 2: Story engine (ADR 0002) (needs owner approval of the ADR)

Order matters; each item ships with tests and a docs/AUTHORING.md update.

- [x] E1 `character` content kind: schema, types, validator refs, locale keys, `char:` in scene cast (branch feature/story-engine)
- [x] E2 `mod-relationships` (priority 32): `rel.<char>.trust|loyalty|owed`, drift, effects `rel`/`favor` (YAML sugar over deltas), conditions on them, `relationship.changed` event
- [x] E3 Facts feed relationships (a fact reaching witnessed/public changes trust of characters in the affected reputation group)
- [x] E4 `arc` content kind and director state machine (stages, delays, branches by choice effects `{arc, stage}`, events `arc.started/advanced/ended`); `arc.the_squeeze` migrated
- [x] E5 Validator: arcs reference real events/stages, reserved/duplicate stage ids rejected, unreachable stages warned (an arc ends by `end` or its last stage, so there is no separate can-end rule)
- [x] E6 Timeline beats: events with a `beat` week window play once, ahead of the random pool, one per week; everything else stays random (named beats such as Tet are not needed yet)
- [x] E7 Debrief: "people who remember you" (trust, favours) and storylines closed/open, in both languages
- [x] E8 Client: cast panel (people met, how they feel about you), both languages; `scene.started` carries the named people
- [x] E9 Authoring: `char:`, `rel`, `favor`, `char:` speakers, `arc:` entries and `arc <name> <stage>` effects
- [x] E10 Demo arc playable end to end: The Hamper (Hung, Khoa, Minh, Lan, Tam), acceptance test in qc-year.test.ts, pins updated

## Phase 3: Roles and endings engine support

- [x] R1 Endings "promoted" and "walked_away": a scene effect `end promoted|walked_away` (YAML `end promoted`) ends the run with that ending; conditions come from the scene (facts, relationships, rep)
- [x] R2 Finance role: `role.fin.accountant` playable (blurb, overhead 20 hours), `fin-year` scenario in sim-runner, CI step `sim:fin`, balance guards in `fin-year.test.ts`
- [x] R3 Month-end close mechanic (`mod-close`, role field `close_steps`, visible checklist in the client); owner said yes on 2026-09-30
- [ ] R4 Shared events across jobs (audit day, compliance) checked for each role

## Phase 4: Player experience

- [ ] P1 Weekly planner (allocate hours) and time-scale setting
- [ ] P2 Walkable/office map in the client (block D)
- [ ] P3 Saves/load (persist seed + inputs), resume after closing
- [ ] P4 `mod-i18n` as a real module (currently in `tools/demo-host`)
- [ ] P5 Accessibility and mobile layout pass
- [ ] P6 Sound/visual polish (owner decides scope)

## Phase 5: Quality and scale

- [x] Q1 Balance reports at scale: `pnpm balance:report [--runs 40]` writes `docs/BALANCE.md` (endings, weeks, decisions, stress, storylines per job and test player); role field `events_per_week` sets a job's pace
- [x] Q2 Content lint (`tools/pack-validator/test/content-lint.test.ts`, part of `pnpm test`): c1/c2/c3 numbering, lessons for severity 3+, dark scenes leave a fact and can fail on c3, no placeholders, enough scenes and beats per job; arcs are covered by the validator
- [ ] Q3 Performance check for long runs
- [x] Q4 Practitioner review workflow: `pnpm review:export [--role qc|sales|fin|prod|all]` writes `docs/review/<job>.md` (every scene in English and Vietnamese, outcomes, facts, lessons, a checklist per scene); send a pack to someone who has done the job
- [ ] Q5 Packaging: web build hosting, versioned releases

## Working rules for this list

- Never reorder Phase 2 items without telling the owner.
- If an item turns out to be larger than one block, split it and add the parts here.
- After each item: update this file, `docs/STATUS.md`, and report to the owner.

## Phase 6: Identity and world engine (plan: `docs/design/WORLD-PLAN.md`; needs owner sign-off on its open questions)

- [x] M0 ADRs 0003 (identity and world engine), 0004 (saves and snapshots), 0005 (content boundaries) written
- [x] M0 performance guard (`perf-budget.test.ts`), day-based calendar helpers (`dayOfYear`, `daysBetween`), world and run seeds (`deriveSeed`, `generationStream`), world settings and limits in `contracts/src/world.ts`
- [x] M1a Person schema (`contracts/src/people.ts`), people library v0 (`library/`: 12 archetypes, 34 quirks, names, 13 departments, 6 data tables flagged unverified), generator, people module, workbench (`pnpm people:validate`, `pnpm people:generate`), tests
- [x] M1b Households with inheritance (`generateHousehold`: spouse, children, supported parents), 63 quirks, attribute library editor (`pnpm library:edit`), first data checks (sex ratio at birth verified; national anchors for marriage and urban share noted)
- [x] M1d Generator guide and whitepaper (`docs/design/GENERATOR-GUIDE.md`, shown in the editor's Guide tab); editor restyled in 8-bit with per-field hints and per-tab guidance
- [x] M1c Appearance layer on every Person (traits and seed, own stream, family resemblance, state tells), life events library (14 events, yearly hazards by age and traits), 16 archetypes, 75 quirks, education table anchored to the 2022 labour force survey (`docs/design/WORLD-PLAN.md` 7a)
- [ ] M1e Verify the age-band rows of the marriage and education tables and the life-event chances against sources; review the library with the owner
- [x] M2a New-game flow in the game: player profile screens (quick-start personas, age, gender, education, experience, money, dependents, how hired) that change the start (stress, skills, money pressure, standing; never by gender), settings (Thoughtful or Steady time, intensity stored; shorter years marked coming soon), control bar (pause, 1x or 2x, next week), save and load (4 browser slots with autosave every 4 weeks, export and import of a save file, loaded in either language), a fresh seed per new game
- [~] M2b World and player: population tiers (50 / 500 / 3000), player profile and settings, folder saves (continue or restart world, new seed), perception and dossier (hidden traits learned over time), minimal ladder, migrate fixed characters
  - [x] done: world file (people, lore, runs), roster of 50 for tier A, folder saves via save host (save-host.bat), continue world or new seed, protagonist becomes an autonomous person, yearly advance, People panel (hidden traits not shown), news panel
  - [x] done: generated people in scenes (`Scene.guests`, `{slot}` in text, `GuestPort` from mod-people: recurring colleagues from the world roster or generated), perception (module `perception` in mod-people: noisy readings per trait, confidence grows, quirks noticed; shown in the People you know panel and the People panel; no true number reaches the screen), 3 generic guest scenes for every job (`content-src/guests.yml`)
  - [ ] left: tiers 500 / 3000, minimal ladder, migrate fixed characters to people, perception from gossip and records (only scene sightings so far), impressions kept in the world between runs, guest behaviour driven by their traits (M3)
- [~] M3 (slice 1 done: appraisal module in mod-people, guests only: trust from values and familiarity, actions reported/covers/badmouths/vouches, notices and cast panel; next: attach persons to the fixed cast, behaviour driven by goals and ladder, perception of hidden acts) Appraisal for everyone, behaviour engine, life events, full ladder, old protagonist as an autonomous Person
- [ ] M4 Text realiser (variation, forms of address), scene text as slots and pools, Vietnamese culture pack v1
- [ ] M5 Dark-path engine (motive, opportunity, barrier with habituation, risk, justice, retaliation), reviews
- [ ] M6 Romance, family, inheritance, ageing, death, legacy, world history lore book
- [ ] M7 Calibration against real-world data, long-run determinism and performance, reviews, spatial layer prototype
