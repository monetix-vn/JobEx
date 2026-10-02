# Worlds and saves: how it works (for people and AI)

This explains the M2 runtime in one place. Decisions are in `docs/adr/0003` (identity and world engine)
and `0004` (saves). Plans: `WORLD-PLAN.md`. This file describes what is built.

## Three kinds of saved things

| What | Where | Holds |
| --- | --- | --- |
| A game save | browser slots, or an exported file | seed + player inputs (a run is replayed to restore it), profile, settings, optional `world_id` |
| A world | `saves/<world-id>/world.json` (kept by the save host) | world seed, year, people, lore, run records |
| A world's readable history | `saves/<world-id>/lore.md` | the lore as text, regenerated on every save |

A game save is small because a run is deterministic: same seed and inputs give the same events. A world
holds long-lived state: the people and what happened.

## Life of a world

1. **Start**: the profile form offers "new world" or "continue". A new world gets a seed and about 50
   generated staff (`ensureRoster`, departments follow the cookware mix in `COOKWARE_MIX`).
2. **Run seed**: each run in a world uses `nextRunSeed(world)` = `<world_seed>/run<n>`. Same world, same
   sequence of runs.
3. **Play**: the run is a normal run (profile effects apply). The People panel lists the world's people.
4. **Run ends**: `summariseRun` reads facts, reputation, stress and the ending; `retireProtagonist` turns the
   player into an autonomous person (personality from what they did, not what they said);
   `advanceWorldYear` ages everyone and rolls life events. The world is saved and a news panel shows the year.
5. **Continue**: the next run starts in the same world, a year later, with the old protagonist as a person.

## Hidden traits

A person's temperament, values and quirks exist in the data but the UI never shows them
(`dossierOf` returns name, department, rough age, appearance, legacy note only). The plan is that the
player learns them over time through scenes (perception, still to build).

## The save host

`pnpm save:host` / `save-host.bat`, port 5190, this computer only. It refuses other websites (origin check
plus a required `x-jobex: 1` header), accepts only valid worlds, keeps a `.bak` of the previous save,
writes through a temp file, and moves deleted worlds to `.trash` instead of erasing them. `saves/` is in
`.gitignore`. The game works without it (no worlds).

## Code map

- `packages/contracts/src/world.ts`: `World`, `LoreEntry`, `RunSummary`, settings and limits.
- `packages/mod-people/src/world.ts`: `createWorld`, `ensureRoster`, `nextRunSeed`, `retireProtagonist`,
  `advanceWorldYear`, `parseWorld`.
- `tools/save-host/`: the server and tests.
- `tools/demo-host/src/world-bridge.ts`: save host client, library loader, `summariseRun`, `dossierOf`.
- `tools/demo-host/src/main.ts`: new-game flow, run-end handler, People and news panels.
- `packages/client-web/src/profile.ts`: the world section of the profile form.

## Not built yet

500 and 3000 person tiers, perception (learning traits), generated people inside scenes, career ladder,
behaviour engine. See the roadmap in `docs/STATUS.md`.
