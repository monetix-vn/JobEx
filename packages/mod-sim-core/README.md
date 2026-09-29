# @je/mod-sim-core

Owns player and company state. Other modules never mutate it: they send the `sim.applyDelta`
command and read the result from `sim.stateChanged` (a full snapshot on start, then changed
variables only).

- Initial state: defaults, then the role's `start_state` (a bare key is `player.<key>`, a dotted key
  such as `skill.negotiation` is a full path), then the company overrides from config.
- World variables (`world.turn`, `world.month_of_year`, ...) follow `clock.ticked`; energy refills
  weekly.
- Stress, energy, health, reputation and audit readiness are clamped to 0..100.
- Reputation created on demand (`player.rep.<who>`) starts at 50.
- A delta on an unknown path is rejected unless it is under `player.`, `company.`, `skill.` or `fact.` (the knowledge ledger publishes each fact's
  visibility rank under its own id, e.g. `fact.accepted_kickback`).

Config: `{ content: ContentView, roleId, company? }`.
Consumes `run.started`, `clock.ticked`, `sim.applyDelta`; emits `sim.stateChanged`,
`sim.deltaApplied`, `sim.deltaRejected`.
