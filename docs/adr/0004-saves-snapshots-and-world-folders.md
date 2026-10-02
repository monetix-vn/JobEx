# 0004: Saves, snapshots and world folders

Status: accepted on 2026-10-02 (owner: "ok" to the recommendations in `docs/design/WORLD-PLAN.md`).

## Decision

1. A **world** is a folder: `world.json` (settings, `worldSeed`, version), `people/` (chunked person files),
   `log/` (log chunks per year), `snapshots/` (periodic full state), `lore/` (derived readable history).
2. Each play session is a **run** with its own `runSeed` inside a world. Restarting uses a new `runSeed`;
   continuing keeps the world and its people. Characters the player no longer controls remain in the world as
   autonomous Persons.
3. Loading uses the latest snapshot plus the log chunks since it (no replay from week one). CI keeps
   replay-from-seed tests for short horizons and adds **snapshot equals replay** checks on sampled worlds.
4. The folder is read and written by a **small local save host** (Node, started by `play.bat`, in `tools/`,
   because packages must not touch the file system). The browser client talks to it over the existing
   transport. The single-file `JobEx-play.html` keeps working without the host (in-memory play and a
   download-your-save fallback). A desktop shell (Tauri or Electron) can replace the host later.
5. Save files carry a format version and a migration step per version.

## Consequences

- Multi-year worlds of up to 3000 people stay loadable in a fraction of a second.
- The client must stay a pure view of state (view-models), so a graphical client can replace it.
