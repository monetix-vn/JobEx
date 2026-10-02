# Status (update this at the end of every block)

Last updated: 2026-10-03, after M3 (appraisal, behaviour, the career ladder, fixed characters with a person underneath). Branch: `feature/story-engine`
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
- Generated people in scenes: a scene can name guests (`guests:` in YAML, `{colleague}` in text). They are colleagues
  from the world's roster (or newly generated), often recurring, and the player learns their traits over time: each
  scene gives two noisy readings of one trait, confidence grows, quirks get noticed. The panels show words such as
  "warm (an impression)", never numbers. Each guest also judges what you did (their integrity, values and how well
  they know you) and keeps a trust score; then they act: a principled witness may tell others about a shortcut (the deed
  becomes a rumour, and you are not told who), a lenient friend keeps it quiet, a rough or impulsive one you crossed runs you
  down, a warm one you helped vouches for you (these two show as notices and in the cast panel). Three generic scenes (a favour, a complaint, stolen credit) run for every job.

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
| M2b generated people in scenes, perception (scene sightings) | done |
| M2b left: 500 / 3000 person tiers, minimal ladder, migrate fixed characters to people, impressions kept in the world, perception from gossip and records | open |
| M3 appraisal and behaviour engine for everyone, full ladder | done in its first form (see below); the action library is small (3 wants, 4 reactions), NPC-to-NPC actions and gossip as impressions are not built |
| M4 text realiser (variation, forms of address), Vietnamese culture pack | not started |
| M5 dark-path engine (motive, opportunity, barrier, risk, justice, retaliation) | not started |
| M6 romance, family, ageing, death, legacy, lore book | not started |
| M7 calibration against real data, long-run determinism and performance | not started |

Suggested next: M3 (guests behave by their traits, so what the player learns matters) or the M2b leftovers above. Design:
`docs/design/WORLD-PLAN.md` (world plan v2), `IDENTITY-ENGINE.md`, `PROFILE-AND-TIME.md`.

## Known gaps and caveats

- Library tables are flagged unverified except the birth sex ratio and the education table (anchored to
  the 2022 labour force survey). Do not claim realism.
- M3: people act on their traits only through the outcome (trust, rumours, standing); their lines are the same for
  everyone (text variation is M4). The fixed characters (Khoa, Lan...) keep their names and scripted feelings; the person
  under them (slice 2) adds a smaller extra view (40% of a guest's trust change, through `rel.<slug>.trust`). Their traits
  come from the writers' notes in `packages/mod-people/src/character.ts` (about 50 known words; others are ignored).
  Not yet: replacing the fixed names with generated ones.
- M3 behaviour: once a week (after week 6, at most one scene every 3 weeks, most weeks nothing) a person the player has
  met may bring a scene because they want something: a favour (debt, loose rules), a complaint (fragile, trusts you), or
  credit (ambitious, cold). Wants come from temperament, money and trust; the pick is a seeded softmax. The scene is the
  matching generic one, with that person as the guest.
- M3 ladder (yearly, everyone in a world): five steps (staff, senior, team lead, manager, head), room per step by
  department size, promotion by performance, ambition, tenure and a dash of luck, vacancy chains, the best passed-over
  person may leave, leavers and retirees are replaced by new hires. Lore lines appear in the news panel; the People panel
  shows each person's position. The steps, tenure, performance and shares are first drafts, not data from a source. Impressions live in a run and are not saved into the world. A save
  reloaded after the world changed may meet different roster people in the same scenes (the choices still replay).
- Only 3 guest scenes exist; every other scene still uses fixed characters or roles. More are content work.
- Blocked (greyed) choices do not say why (a requirement not met, or not enough energy). Candidate fix.
- Year length 26/12 weeks is shown as "coming soon". Sprites and art style are undecided.
- Worlds need the save host running; without it the game plays without a world.
- Not built: Playwright tests, cloud saves, mobile build, practitioner sign-off records.
- GitHub Actions has not been observed from this environment (no `gh`); check the Actions tab.

## Branches

`main` (Phase 0) <- older phase branches <- `feature/story-engine` (current, everything above).
