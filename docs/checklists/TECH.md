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
- [ ] E8 Client: cast panel, relationship hints; both languages
- [x] E9 Authoring: `char:`, `rel`, `favor`, `char:` speakers, `arc:` entries and `arc <name> <stage>` effects
- [x] E10 Demo arc playable end to end: The Hamper (Hung, Khoa, Minh, Lan, Tam), acceptance test in qc-year.test.ts, pins updated

## Phase 3: Roles and endings engine support

- [ ] R1 Endings: "promoted" and "walked away" (conditions on facts, relationships, KPIs)
- [ ] R2 Finance role: pack role file, tasks, KPIs, overhead hours (see finance bible)
- [ ] R3 Month-end close mechanic for Finance if the bible wants it (owner decision)
- [ ] R4 Shared events across jobs (audit day, compliance) checked for each role

## Phase 4: Player experience

- [ ] P1 Weekly planner (allocate hours) and time-scale setting
- [ ] P2 Walkable/office map in the client (block D)
- [ ] P3 Saves/load (persist seed + inputs), resume after closing
- [ ] P4 `mod-i18n` as a real module (currently in `tools/demo-host`)
- [ ] P5 Accessibility and mobile layout pass
- [ ] P6 Sound/visual polish (owner decides scope)

## Phase 5: Quality and scale

- [ ] Q1 Balance reports at scale (bulk runs per policy, stress/ending distributions per job)
- [ ] Q2 Content lint in CI: decisions per year per job within target, every fact has a lesson, every arc reachable
- [ ] Q3 Performance check for long runs
- [ ] Q4 Practitioner review workflow (export a job's text to a reviewable document)
- [ ] Q5 Packaging: web build hosting, versioned releases

## Working rules for this list

- Never reorder Phase 2 items without telling the owner.
- If an item turns out to be larger than one block, split it and add the parts here.
- After each item: update this file, `docs/STATUS.md`, and report to the owner.
