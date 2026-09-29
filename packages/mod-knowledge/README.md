# @je/mod-knowledge

Owns the ledger of facts: what the player has done that others might come to know, and how widely.

- Facts come from `fact` effects on resolved choices (`choice.resolved.effects`). Every fact must be
  defined in content (`facts/*.json`); an unknown fact is an error.
- Visibility only ever goes up: `private` (only the player) < `witnessed` (the roles present in the
  scene) < `rumor` < `public` (everyone). Repeats and downgrades are ignored.
- Each change is published as `fact.learned` (first time) or `fact.escalated`, and as the state
  variable named by its id, e.g. `fact.accepted_kickback` (rank 1 to 4, through sim-core) so `when` conditions can use it, for example
  `{ "gte": [{ "var": ["fact.accepted_kickback", 0] }, 3] }`.
- The `knowledge.escalate` command makes a fact better known (used by social's gossip).

It records knowledge; it never decides what anyone does about it.

Config: `{ content: ContentView }`.
Consumes `choice.resolved`, `knowledge.escalate`; emits `sim.applyDelta`, `fact.learned`,
`fact.escalated`.
