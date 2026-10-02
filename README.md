# Job Experiment

A simulation game for learning other jobs and departments by living their pressures, including
the dark sides. This repository holds the engine and tooling. Phase 0 (foundations) is in place;
see the Development Plan and the Game Design & Architecture Plan for the full scope.

## Layout

```
packages/
  contracts/     envelope, core events, ports, module and pack types, JSON Schemas (no logic)
  kernel/        event bus, seeded RNG streams, world clock, module host, replay log
  rules/         safe expression evaluator for content conditions and effects
  mod-content/   pack loader, validator, registry
  mod-sim-core/  player and company state; the only module that mutates it (sim.applyDelta)
  mod-workload/  weekly demand, capacity, backlog, stress and health
  mod-choice/    outcome tables, requirements, costs; applies deltas through sim-core
  mod-director/  event pool and scheduler: what happens this week (season, stress, cooldown, weight)
  mod-knowledge/ ledger of facts: what you did and who knows (private, witnessed, rumor, public)
  mod-social/    gossip and reputation consequences when facts get around
  mod-relationships/  per-person trust, loyalty and favours (named characters)
  mod-risk/      detectors, quarterly audits, scapegoating, and how a run can end
  mod-education/ glossary words and the end-of-run debrief
  mod-narrative/ scene queue and runtime, locale text resolution
  mod-stubs/     Phase 0 stand-ins (economy, director, choice), kept for the kernel tests
  mod-toy/       tiny module that proves a new module needs no edits elsewhere
  client-web/    status strip, tile map, dialogue box; runs from bus messages only
content/         data packs (core, industry-cookware): roles, events, scenes, offers, locale
tools/
  boundary-check/  fails CI on forbidden imports and dependencies
  pack-validator/  CLI over mod-content
  sim-runner/      headless runs, replay, determinism gate
  demo-host/       composition root that wires a run to client-web (Vite)
docs/            architecture decision records
```

Each package has its own `package.json`, a public `src/index.ts`, tests and a README stating what
it owns.

## Commands

Requires Node 20+ and pnpm 9.

```bash
pnpm install
pnpm check:fast        # only what you changed (and its dependents), failures only
pnpm run ci:quiet      # everything CI runs, one line per step
pnpm run ci            # the same, with full output
pnpm format            # format only changed files (a pre-commit hook does this too)
pnpm pin:update        # re-pin golden fingerprints after an intended behaviour change
pnpm new:scene <key>   # scaffold a scene, its event and EN/VI text keys
pnpm author <file.yml>   # add scenes/facts/terms written in YAML (docs/AUTHORING.md)
pnpm content:list       # list every event, its job and trigger
Writing events: content/industry-cookware/events/README.md (rules and vibe) + docs/AUTHORING.md (file format).
pnpm test              # unit, property and fixture tests
pnpm check:boundaries  # dependency rules
pnpm validate:packs    # validate ./content
pnpm sim:determinism   # headless 1-year run, twice, plus replay
pnpm sim:sales         # a year of the Sales Specialist on the real modules, checked for determinism
pnpm dev:web           # play the Sales Specialist's week: http://localhost:5173 (add ?lang=vi, ?seed=x)
```

## Play it (one click)

Double-click `play.bat` (or `play-vi.bat` to start in Vietnamese). Each launch rebuilds two
self-contained files, `JobEx-play.html` and `JobEx-play-vi.html`, from the current content (a few
seconds, needs Node 20+), then opens them in your browser; `play.bat fast` skips the rebuild.
New jobs and scenes live on the branch `feature/story-engine` until it is merged into `main`. They have no server and no dependencies, so you can copy them anywhere.
Rebuild after code or content changes with `pnpm build:play`.

Use the **EN | VI** buttons at the top to switch language at any time. The game keeps your week,
stats and choices: it replays your recorded choices into a new run in the other language, which
reaches the identical state because the simulation does not depend on language. Your choice is
remembered for next time.

## Rules the build enforces

- **Dependencies point inward.** `contracts` imports nothing; `kernel` and `rules` import only
  `contracts`; a `mod-*` imports only `contracts`, `kernel`, `rules` and never another module;
  `client-web` imports only `contracts`. Deep imports and imports that leave a package fail.
- **Deterministic.** No `Date`, `Math.random`, `performance.now`, `eval`, `Function` or browser
  globals in simulation packages (ESLint). Time and randomness come through kernel ports; every
  module gets its own RNG stream.
- **Replayable.** A run is a seed plus the player's inputs. CI runs a fixed seed twice and replays
  the recorded log; all three must match byte for byte.
- **Content is data.** Packs are validated against schemas, with reference integrity and text keys
  present in both Vietnamese and English.

## Phase 0 gate

| Gate                                                                | Where it is checked                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| A forbidden import fails CI                                         | `tools/boundary-check/test/boundary.test.ts`, `pnpm check:boundaries` |
| Headless 1-year run completes and replays identically from a seed   | `tools/sim-runner/test/gate.test.ts`, `pnpm sim:determinism` |
| A toy module is added with no change to existing modules            | `tools/sim-runner/test/gate.test.ts` (second describe)   |

## Phase 1 so far: two jobs, text only

You pick a job at the start (**Export Sales Specialist**, **Quality Control Specialist**, **Finance and Accounting Specialist**, **Production Planner**, **Purchasing Buyer**, **Investment Banking Analyst** or **HR Business Partner**; jobs are grouped by department) and can
choose another after each debrief. Nine modules run on the `industry-cookware` pack: `mod-sim-core`, `mod-workload`, `mod-choice`,
`mod-narrative`, `mod-director`, `mod-knowledge`, `mod-social`, `mod-risk` and `mod-education`.

- **Decisions:** each week the director draws one or two pressure events for your job (sales: shipments
  pulled forward, discount requests, kickback offers, backdated invoices, and more, 18 in all; QC: a
  failing batch, a borderline result, a supplier's gift, an overdue calibration, records to tidy
  before an audit, a safety defect, and more, 10 in all) by season, stress, cooldown and weight, and plays scheduled
  consequences when they come due.
- **Consequences:** what you do becomes a *fact* (21 are defined in content) with a visibility:
  private, witnessed, rumor or public. Word spreads week by week, faster the more serious the fact.
  Witnessed and public facts cost reputation with the people who now know, and new events react to
  what is known: Finance asks about a discount you gave above your limit, a buyer confronts you
  about a broken promise, Compliance interviews you about a fee. Owning up early stops the
  follow-ups; lying to them makes it worse.
- **Getting caught:** deeds leave traces. Finance, QC, the buyer and your boss may notice something
  any week, and the internal audit looks hard in the audit weeks at each quarter end (you see a
  notice when it is in the building). The boss may pin a serious matter on you, more likely when
  they think little of you.
- **Endings:** a run can end early: *fired* (a scandal is out and your boss has written you off),
  *prosecuted* (a grave offence is public), or *burnout*. A careful player finishes the year; a
  reckless one is usually gone within a few months. A bad year alone is never a firing.
- **Debrief:** every run ends with a review: how it ended, the chain from what you did to what came
  back, what each thing teaches, and the workplace vocabulary you met. Glossary words (35 so far)
  are tappable inside the scenes where they appear.

Run it headless with `pnpm exec tsx tools/sim-runner/src/cli.ts run --scenario sales-year --seed 7`
(or `--scenario qc-year`)
(`--policy first` plays carefully, `--policy last` recklessly; `sales-week` scripts just the first
three scenes), or play it in the browser.
