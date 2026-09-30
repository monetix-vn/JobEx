# JobEx: working notes for Claude

A simulation game that teaches other jobs by living their pressures, including the dark side. TypeScript
pnpm monorepo. Read this first; it replaces re-reading the plans or module sources. Current state and
next steps: `docs/STATUS.md`. Decisions: `docs/adr/`. Each package's README says what it owns.

## Commands (run the smallest one that answers your question)

```bash
pnpm check:fast            # only what you changed (and its dependents): format, lint, types, boundaries, tests
pnpm test -- <path>        # one test file, e.g. packages/mod-risk
pnpm run ci:quiet          # the full CI, one line per step, output only for failures
pnpm pin:update            # re-pin golden fingerprints after an intended behaviour change
pnpm new:scene <key> [--prefix qc]   # scaffold a scene + event + EN/VI keys (prefix binds it to a job)
pnpm validate:packs        # content validation only
pnpm build:play            # rebuild JobEx-play.html (one-click game; play.bat opens it)
```

Avoid `prettier --write .` and whole-repo reads: format only changed files (`pnpm format`), and read
only the file you are editing. Long logs: pipe through `tail`/`grep`, or use the quiet scripts.

## Architecture in 12 lines

- `contracts` (types, events, JSON Schemas, no logic) <- `kernel` (bus, seeded RNG, clock, replay) and
  `rules` (safe expression evaluator). `mod-*` import only contracts, kernel, rules and never each
  other; they talk by events. `client-web` imports only contracts. `tools/*` compose everything.
  CI enforces this (`tools/boundary-check`) and bans Date/Math.random/browser globals in packages.
- A run = seed + player inputs. Same seed, same log, byte for byte; replay is checked in CI.
- Modules: sim-core (state, only writer), workload, choice (requirements, costs, outcomes), narrative
  (scenes, text, notices), director (what happens this week), knowledge (facts ledger), social (gossip,
  reputation), risk (detection, audits, blame, endings), education (debrief). Stubs: mod-stubs, mod-toy.
- Jobs are roles with a `blurb_key` (playable); an event with `role` is only for that job. Convention in
  every scene: c1 by the book, c2 a legitimate compromise, c3 the shortcut (test policies `--policy
  first|last` rely on it). Per-job busyness is `overhead_hours` on the role.
- Content is data in `content/<pack>/{roles,events,scenes,offers,facts,terms,locale}`; validated by
  `mod-content`. Every text key must exist in `vi` and `en`. Facts define consequences and traces.
- Player-facing text is Vietnamese and English; the simulation never reads the locale.

## Rules of thumb

- Change a contract: add an event or field in `packages/contracts/src`, bump `v` if it breaks.
- Add a module: new `packages/mod-x` with `manifest` + `createModule` + README + tests; wire it in
  `tools/sim-runner/src/{runner,scenario}.ts` and `tools/demo-host/src/host.ts` (priority order!).
- Tests use fake `ContentView`s and `runFixture`; integration tests live in `tools/sim-runner/test`.
- Golden fingerprints live in `tools/sim-runner/test/pins.json`; never edit by hand, run `pin:update`.
- Write files with the editor tools, not shell heredocs (apostrophes break them).
- Content text is a first draft by an AI; note it needs practitioner review, never claim realism.
- Do not push or open PRs without being asked. Commit trailer: `Co-Authored-By: Claude`.
