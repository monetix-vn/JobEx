# ADR 0001: pnpm monorepo, contracts first, boundaries enforced in CI

Status: accepted (Phase 0)

## Context

The development plan wants every module replaceable behind a contract, so adding a role, an
industry or a service never means editing another module, and a run that replays exactly from a
seed.

## Decisions

- **pnpm workspaces, no task runner yet.** `pnpm -r` and root scripts are enough for seven
  packages. Turborepo can be added when build times justify it; nothing depends on it.
- **Packages export TypeScript source** (`exports` points at `src/index.ts`). There is no build
  step for libraries; Vitest, tsx and Vite consume source directly, and `tsc --noEmit` typechecks
  the whole workspace at once. Revisit if a package must be published.
- **Own boundary checker instead of dependency-cruiser or ESLint boundaries.** The rules are a
  small data table (`tools/boundary-check/src/rules.ts`) and the checker also validates
  `package.json` dependencies, deep imports and package structure, which the off-the-shelf tools
  would need extra config for. Its own tests prove a forbidden import fails.
- **Determinism guards live in ESLint** (`no-restricted-properties`/`-globals`/`-syntax`), so the
  failure points at the offending line.
- **Modules are synchronous and pure over their own state.** A handler receives a frozen envelope
  and returns event drafts; the kernel stamps ids, turn, source and `causedBy`. This keeps
  replay exact and makes moving a module behind a transport a host change only.
- **A run is a seed plus recorded inputs.** The replay log stores inputs with their turn and phase
  (`idle` between turns), every message, and each module's final snapshot. Replay re-injects inputs
  at the same points and compares canonical JSON.
- **The log records the module set and versions.** Replaying with a different set fails loudly, so
  a log is never silently compared against different code.
- **Content loads through `ContentSourcePort`.** `mod-content` never reads the file system; tools
  provide a directory source, a browser build will provide a bundled one.
- **The client is a bus client.** `client-web` takes a `Transport` (subscribe, send) and imports
  only contracts. `tools/demo-host` is the composition root; a Worker or server host replaces only
  that file.

## Phase 1 block A additions

- **State ownership:** `mod-sim-core` is the only writer of player and company state. Others send
  `sim.applyDelta` and keep a read-only mirror (`VarStore` in `@je/rules`) fed by `sim.stateChanged`.
- **`ContentView` lives in contracts,** so modules read content without importing `mod-content`.
- **Choice is the authority** on requirements and costs; narrative only marks choices `disabled` as
  a UI hint.
- **Facts and schedule effects** are passed through `choice.resolved.effects` for `mod-knowledge`
  and `mod-director` (block B); nothing consumes them yet.
- **Workload includes `overheadHours`** (default 22) for meetings and admin the role's task list does
  not cover; without it a role never overloads. Balance numbers are first-cut.
- The browser build bundles Ajv, which compiles schemas with `new Function`; it would need
  `unsafe-eval` under a strict CSP. Pack validation could move to build time if that matters.

- **`mod-director`** owns the event pool and the schedule: due scheduled events first, then a
  weighted draw without replacement from events whose `when` holds, off cooldown. Conditions that
  cannot be evaluated count as false. Effects of type `schedule` (on an event or a resolved choice)
  queue a later event. Tension curve, arcs and pacing by tag are deferred.
- **Language switching replays inputs.** The simulation never reads the locale, so a new run in the
  other language, fed the recorded between-turn inputs, reaches the identical state
  (`fastForward` in the demo host; tested). This is the first user-visible use of determinism.
- **Scenes, effects and reputation are first-cut content** written by an AI assistant for review; a
  practitioner sign-off is still required before any of it is treated as realistic.

- **Facts are content.** A `fact` is a pack kind with a severity and reputation consequences for
  when it becomes known to witnesses and when it goes public. The validator checks every `fact`
  effect points at a defined fact, that each fact has text in both languages, and warns on a fact
  nothing produces. `mod-knowledge` owns the ledger (visibility only ever rises) and publishes each
  fact as a state variable named by its id, so `when` conditions can react to what is known.
- **`mod-social` applies consequences and runs gossip.** It never touches reputation directly: it
  sends `sim.applyDelta` and asks the ledger to escalate with `knowledge.escalate`. It also leaks
  private facts at a small weekly chance, as a stand-in until `mod-risk` adds real detectors.
- **Notices are scenes.** Narrative turns a fact becoming a rumor or public into a one-line scene
  with a continue choice, so the same queue, resolver and client handle it.
- The per-person relationship graph (trust, loyalty, favours owed) is deferred; reputation is
  tracked per group for now.

## Phase 1 block C additions

- **Runs can end themselves.** A module sends `run.endRequested`; the kernel finishes the current
  turn, then ends the run and puts the ending on `run.ended`. Only the first request counts, `end()`
  stays idempotent, and `runTurns` stops early. Replay handles an early end unchanged.
- **Evidence is content.** A fact lists its `traces` (type, visibility, who could find it). `mod-risk`
  rolls detectors against private facts: everyday detectors weekly, the internal audit only in audit
  weeks. A finding makes the fact `witnessed` through the ledger, so all the existing consequences
  (reputation, notices, follow-up events) apply without special cases. `mod-social`'s stand-in leak
  is switched off in scenarios that include risk.
- **Endings are data-light rules in risk.** Burnout at zero health; prosecuted when a grave fact is
  public and the boss will not cover; fired when a scandal is out and standing is very low, or two
  serious public facts. Low standing alone is a bad year, not a firing. Apart from burnout a
  condition must hold two weeks. Thresholds were tuned with three kinds of test player (`--policy
  first|random|last`), and a test guards that a careful player finishes and a reckless one does not.
- **The debrief is written by `mod-education` from the event stream,** in the player's language, at
  `run.ended`. It needs no special access: it notes choices that left a mark, how facts spread,
  detections and blame, and reads lessons from the facts and vocabulary from the scenes shown.
- **Glossary words are content** (`term` pack kind, referenced by `scene.terms`); their text rides
  along in `scene.started` so the client only draws. The validator checks references, translations
  and unused terms.

## Developer workflow (kept small on purpose)

- **Context stays small.** `CLAUDE.md` holds the commands, rules and module map; `docs/STATUS.md` is
  the handoff note updated after each block; each package README says what it owns. Files stay
  under roughly 300 lines (`validate.ts` and the integration tests were split for this).
- **Checks are quiet and targeted.** `pnpm check:fast` maps changed files to packages, adds their
  dependents (`scripts/lib/affected.mjs`), and runs only those tests; `pnpm run ci:quiet` runs the full
  CI with one line per step. Formatting touches only changed files (pre-commit hook).
- **Golden fingerprints are data,** in `tools/sim-runner/test/pins.json`, updated by `pnpm pin:update`
  rather than edited by hand in test code.
- **Content is scaffolded, not hand-typed:** `pnpm new:scene` writes a valid scene, event and text keys.
- **Line endings are pinned to LF** in `.gitattributes` (batch files excepted).

## Consequences

- Adding a module means adding a package that passes the boundary check and listing it in a
  composition root; no existing module changes (asserted by the toy-module test).
- Phase 1 will replace `mod-stubs` module by module. Event payloads shared by several modules go in
  `contracts`; a payload used by one module stays in that module (see `mod-toy`).
- Not done yet, by design: YAML packs, pack sign-off records, the `source`/`last_reviewed` check for
  legal and numeric facts, Playwright smoke tests (the client shell is covered by jsdom tests),
  Turborepo, the nightly bulk simulation.
