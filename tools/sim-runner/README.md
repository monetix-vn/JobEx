# @je/sim-runner

Headless runner for the whole simulation, no UI. It drives a run with a seeded bot that answers
scenes, and produces a `ReplayLog` (seed, player inputs, every message, final module state).

```bash
pnpm exec tsx tools/sim-runner/src/cli.ts run --seed 7 --weeks 52 --out out/log.json
pnpm exec tsx tools/sim-runner/src/cli.ts replay out/log.json
pnpm exec tsx tools/sim-runner/src/cli.ts check --seed 2026 --weeks 52 --toy
```

`check` is the Phase 0 determinism gate used in CI: it runs the same seed twice, replays the
recorded log, and confirms a different seed gives a different log.
