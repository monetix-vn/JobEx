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

## Consequences

- Adding a module means adding a package that passes the boundary check and listing it in a
  composition root; no existing module changes (asserted by the toy-module test).
- Phase 1 will replace `mod-stubs` module by module. Event payloads shared by several modules go in
  `contracts`; a payload used by one module stays in that module (see `mod-toy`).
- Not done yet, by design: YAML packs, pack sign-off records, the `source`/`last_reviewed` check for
  legal and numeric facts, Playwright smoke tests (the client shell is covered by jsdom tests),
  Turborepo, the nightly bulk simulation.
