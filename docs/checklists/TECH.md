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

- [ ] E1 `character` content kind: schema, types, validator refs, locale keys, `char:` in scene cast
- [ ] E2 `mod-relationships` (priority 32): `rel.<char>.trust|loyalty|owed`, decay, effects `rel`/`favor`, conditions on them, `relationship.changed` event
- [ ] E3 Facts feed relationships (witnessed/rumor -> trust change for who could know)
- [ ] E4 `arc` content kind and director state machine (stages, gaps, branches, start/advance from outcomes); migrate the existing `arc.the_squeeze` tag
- [ ] E5 Validator: arcs reference real events, every arc can end, no orphan stages
- [ ] E6 Timeline beats: fixed/near-fixed episodes by week or named beat, random incidents between; keep >= 50% random
- [ ] E7 Debrief: "people who remember you", arcs closed/open
- [ ] E8 Client: cast panel, relationship hints; both languages
- [ ] E9 Authoring: extend YAML with `char:`, `rel`, `favor`, `arc` (+ tests)
- [ ] E10 Demo arc with two characters playable end to end (acceptance test), pins updated

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
