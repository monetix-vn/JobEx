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
  mod-stubs/     stand-ins for Phase 1 modules (economy, director, choice)
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
pnpm run ci             # everything CI runs
pnpm test              # unit, property and fixture tests
pnpm check:boundaries  # dependency rules
pnpm validate:packs    # validate ./content
pnpm sim:determinism   # headless 1-year run, twice, plus replay
pnpm dev:web           # client shell at http://localhost:5173
```

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
