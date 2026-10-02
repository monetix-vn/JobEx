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
- Third job: Finance and Accounting (37 scenes, visible month-end close, arcs The Cut-off, The Receipt Problem, The Cookie Jar, Thu), promoted/walked-away endings.
- Playable in the browser: `play.bat` / `play-vi.bat` (pick a job; sales 18 events, QC 18).

## Branches

`main` (Phase 0) <- `phase-1-block-a` <- `phase-1-block-c` <- `chore/dev-workflow` <-
`phase-1-qc-role` <- `feature/authoring` (this). No PRs opened yet. Block B commits are inside `phase-1-block-a`/`c` history.

## Next (in order) - revised 2026-09-30 by the owner: engine first, then a series bible, then scenes

Start with `docs/AI-GUIDE.md`; checklists in `docs/checklists/`; bibles in `docs/story/`.
Progress on `feature/story-engine`: E1 to E10 done (characters, `mod-relationships`, facts feed trust, arcs, beats, debrief people/arcs, authoring, demo arc The Hamper). Phase 2 (story engine) is complete, including the client cast panel. Finance is playable (third job): 37 scenes, month-end close, four storylines, promoted/walked-away endings (`docs/story/finance.md`). QC also has a promotion ending (`qc.manager_offer`). QC story blocks are complete (37 scenes, arcs Hamper, Cheaper Steel, Field Complaint, Minh). Sales now has its bible v2 and story layer (beats, four storylines, rewards). Production Planner (31 scenes; `docs/story/production.md`) and Purchasing Buyer (23 scenes; `docs/story/purchasing.md`) are the fourth and fifth playable jobs. Review packs for practitioners are in `docs/review/` (`pnpm review:export`). Next: practitioner review (needs people), more scenes, a fifth job.
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
