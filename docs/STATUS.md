# Status (update this at the end of every block)

Last updated after Phase 1 block C. Repo: github.com/monetix-vn/JobEx.

## Done

- Phase 0 (foundations): contracts, kernel, rules, content pack validator, headless runner, client
  shell, boundary check, CI. Gates met (see README).
- Phase 1 block A: sim-core, workload, choice, narrative; first Sales Specialist scenes.
- Phase 1 block B: director, knowledge (facts), social (gossip, reputation), live VI/EN switch.
- Phase 1 block C: risk (detectors, audits, scapegoating, endings), education (debrief, glossary).
- Playable in the browser: `play.bat` / `play-vi.bat` (Sales Specialist, 20 events, 21 facts, 24 terms).

## Branches

`main` (Phase 0) <- `phase-1-block-a` <- `phase-1-block-c` <- `chore/dev-workflow` (this). No PRs
opened yet. Block B commits are inside `phase-1-block-a`/`c` history.

## Next (in order)

1. QC Specialist role pack (integrity under pressure) and Finance role pack; a role picker.
2. Per-person relationship graph (trust, loyalty, favours owed) in mod-social.
3. Planner and walkable map in the client (block D), persistence (saves), time-scale setting.
4. `mod-i18n` as a real module (live language switching is currently in `tools/demo-host`).
5. Balance reporting at scale (nightly bulk runs), practitioner review of all content.

## Known gaps and caveats

- All scene text, odds, consequences and glossary definitions are AI first drafts.
- Balance numbers were tuned with careful / random / reckless bot players (`--policy`); guards live in
  `tools/sim-runner/test/sales-week.test.ts`.
- Not built: YAML packs, pack sign-off records, `source`/`last_reviewed` checks, Playwright tests,
  cloud saves, mobile build.
- GitHub Actions has never been observed from this environment (no `gh`); check the Actions tab.
