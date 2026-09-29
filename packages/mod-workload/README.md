# @je/mod-workload

Owns demand, capacity, backlog and the stress and health they cause. It never edits player state:
it sends `sim.applyDelta` for stress and health.

Each week (on `clock.ticked`) it samples the role's `weekly_demand` from its own RNG stream. Choices
that cost hours (`choice.resolved`, not ignored) add to that week's demand. In the consequence phase
the week closes: hours over capacity (default 45) become stress (0.6 per hour, at most 10), a
comfortable week relieves 2, health drops when stress would pass 80, and unfinished hours carry
over as backlog.

Weekly demand is the role's listed tasks plus `overheadHours` (default 22: meetings, email, admin).
Recovery (-2 stress) only happens in a week at or below 90% of capacity.

Config: `{ content: ContentView, roleId, capacityHours?, overheadHours? }`.
Consumes `clock.ticked`, `sim.stateChanged`, `turn.phaseStarted`, `choice.resolved`; emits
`workload.weekPlanned`, `workload.weekClosed`, `sim.applyDelta`.
