# Status (update this at the end of every block)

Last updated: 2026-10-02, after M2b (worlds and the People panel). Branch: `feature/story-engine`
(all work is pushed there; `main` is Phase 0; no PRs opened). Repo: github.com/monetix-vn/JobEx.
All text, odds, consequences and library data are AI first drafts and need practitioner review.

## What exists

**The game** (one-click: `play.bat`, rebuild with `build-play.bat`; Vietnamese and English):

- 11 playable jobs, grouped by department in the picker: Sales, QC, Finance and Accounting, Production
  Planner, Purchasing Buyer, Investment Banking Analyst (own company, pack `industry-securities`), HR
  Business Partner, Production Line Supervisor, FP&A Analyst, Marketing Executive, IT Support. Each has a
  bible in `docs/story/<job>.md`, arcs, beats, endings and a debrief. Review packs: `docs/review/`.
- New-game flow: player profile (age, gender, education, experience, money, dependents, how hired) that
  changes the start (never by gender), settings (time pace, intensity), control bar, save and load
  (4 browser slots, autosave, export/import file).
- Worlds (M2b): with the save host running, a game can belong to a world (people, lore, runs kept in a
  folder). Continue an old world with a new seed, or start a new one. When a run ends, the protagonist
  stays as an autonomous person, a year passes (life events, ageing), and the world is saved. A People
  panel shows what the player can see (hidden traits are not shown) and a news panel shows the year.
- "People you know" panel in a run (all people met, with a Hide/Show button).

**The engine** (details in `CLAUDE.md` and `docs/adr/`): contracts, kernel, rules; modules sim-core,
workload, choice, narrative, director, knowledge, social, relationships, close, risk, education, people.
Deterministic: seed + inputs gives the same log; replay and pinned fingerprints are checked in CI.

**The people generator** (M1): library files in `library/` (16 archetypes, 75 quirks, names,
departments, data tables, appearance, 14 life events), seeded generation, households with inheritance,
appearance with family resemblance, yearly life events. Editor: `library-editor.bat` (8-bit UI with a
Guide tab). Guide: `docs/design/GENERATOR-GUIDE.md`.

**Tools**: `pnpm author` (YAML scenes), `content:list`, `balance:report`, `review:export`,
`people:validate`, `people:generate`, save host (`save-host.bat`, port 5190), library editor (port 5180).

## Roadmap (Phase 6 in `docs/checklists/TECH.md`)

| Milestone | State |
| --- | --- |
| M0 decisions and foundations (ADR 0003-0005, seeds, calendar) | done |
| M1a-d people generator, households, appearance, life events, editor, guide | done |
| M1e verify table age bands and life-event chances against sources; owner reviews the library | open |
| M2a profile, settings, control bar, browser saves | done |
| M2b worlds, folder saves, protagonist becomes a person, People panel | mostly done |
| M2b left: 500 / 3000 person tiers, perception (traits learned over time), minimal ladder, migrate fixed characters, generated people in scenes | open |
| M3 appraisal and behaviour engine for everyone, full ladder | not started |
| M4 text realiser (variation, forms of address), Vietnamese culture pack | not started |
| M5 dark-path engine (motive, opportunity, barrier, risk, justice, retaliation) | not started |
| M6 romance, family, ageing, death, legacy, lore book | not started |
| M7 calibration against real data, long-run determinism and performance | not started |

Suggested next: generated people in scenes plus perception (M2b rest, then M3/M4 start). Design:
`docs/design/WORLD-PLAN.md` (world plan v2), `IDENTITY-ENGINE.md`, `PROFILE-AND-TIME.md`.

## Known gaps and caveats

- Library tables are flagged unverified except the birth sex ratio and the education table (anchored to
  the 2022 labour force survey). Do not claim realism.
- Blocked (greyed) choices do not say why (a requirement not met, or not enough energy). Candidate fix.
- Year length 26/12 weeks is shown as "coming soon". Sprites and art style are undecided.
- Worlds need the save host running; without it the game plays without a world.
- Not built: Playwright tests, cloud saves, mobile build, practitioner sign-off records.
- GitHub Actions has not been observed from this environment (no `gh`); check the Actions tab.

## Branches

`main` (Phase 0) <- older phase branches <- `feature/story-engine` (current, everything above).
