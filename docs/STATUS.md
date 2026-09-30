# Status (update this at the end of every block)

Last updated after the authoring toolchain. Repo: github.com/monetix-vn/JobEx.

## Done

- Phase 0 (foundations): contracts, kernel, rules, content pack validator, headless runner, client
  shell, boundary check, CI. Gates met (see README).
- Phase 1 block A: sim-core, workload, choice, narrative; first Sales Specialist scenes.
- Phase 1 block B: director, knowledge (facts), social (gossip, reputation), live VI/EN switch.
- Phase 1 block C: risk (detectors, audits, scapegoating, endings), education (debrief, glossary).
- Second job: QC Specialist (16 pressure events, 2 consequence events, 27 facts, 12 terms; six added via `pnpm author`, source in content-src/qc-batch2.yml), a job picker,
  per-job events (`role`) and busyness (`overhead_hours`).
- Authoring: write scenes/facts/terms in YAML (EN+VI together), `pnpm author` imports + validates,
  `pnpm content:list` is the event library (docs/AUTHORING.md, example in `content-src/examples/`).
- Playable in the browser: `play.bat` / `play-vi.bat` (pick a job; sales 18 events, QC 18).

## Branches

`main` (Phase 0) <- `phase-1-block-a` <- `phase-1-block-c` <- `chore/dev-workflow` <-
`phase-1-qc-role` <- `feature/authoring` (this). No PRs opened yet. Block B commits are inside `phase-1-block-a`/`c` history.

## Next (in order) - revised 2026-09-30 by the owner: engine first, then a series bible, then scenes

Start with `docs/AI-GUIDE.md`; checklists in `docs/checklists/`; bibles in `docs/story/`.
Plan and design: `docs/adr/0002-story-engine-and-series-bible.md` (proposed, awaiting approval).

1. Engine: characters, per-person relationships, story arcs and a timeline of beats (ADR 0002 step 1).
2. Series bible per job (`docs/story/TEMPLATE.md`): premise, cast, season timeline, arcs, dark-side
   ladder, endings; owner approves each one. Then an episode list.
3. Write scenes against the approved episode lists (`pnpm author`); Finance & Accounting is the third job.
4. Planner and walkable map in the client, saves, time-scale, `mod-i18n`, balance reports,
   practitioner review of all content.

## Known gaps and caveats

- All scene text, odds, consequences and glossary definitions are AI first drafts.
- Balance numbers were tuned with careful / random / reckless bot players (`--policy`); guards live in
  `tools/sim-runner/test/sales-week.test.ts`.
- Not built: YAML packs, pack sign-off records, `source`/`last_reviewed` checks, Playwright tests,
  cloud saves, mobile build.
- GitHub Actions has never been observed from this environment (no `gh`); check the Actions tab.
