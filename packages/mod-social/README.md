# @je/mod-social

Owns how word gets around and what people think of the player because of it. Reputation values
live in sim-core; social only sends `sim.applyDelta` for `player.rep.<group>`.

- When a fact becomes known to witnesses (`fact.learned` / `fact.escalated`), the fact's
  `consequences.witnessed` reputation changes are applied once. When it becomes public,
  `consequences.public` are applied once (intermediate levels are never skipped).
- Gossip: each week, every fact that is `witnessed` or `rumor` may spread one step. The chance per
  week is `gossipPerSeverity` (default 0.02) times the fact's severity, capped at 0.5 (rumors are
  1.5 times likelier to go public, capped at 0.75). The roll uses this module's own RNG stream, and
  spreading is requested with the `knowledge.escalate` command; the ledger owns the fact.
- Leaks: each week a `private` fact may come out to the people who were there (chance
  `leakPerSeverity`, default 0.0015, times severity). This stands in for detectors and audits until
  `mod-risk` exists.
- Honest deeds are facts too, with positive consequences.

Not yet: an individual relationship graph (per-person trust, loyalty, favours owed). Groups are
enough for the first vertical slice.

Config: `{ content: ContentView, gossipPerSeverity?, leakPerSeverity? }`.
Consumes `fact.learned`, `fact.escalated`, `clock.ticked`; emits `sim.applyDelta`,
`knowledge.escalate`.
