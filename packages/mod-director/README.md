# @je/mod-director

Owns the event pool and the schedule: it decides which event happens this week. It does not play
or resolve events (narrative and choice do that).

Each week at the plan phase it:

1. fires events that were scheduled to come due, in due order;
2. tops the week up to a random count from the pool (`eventsPerWeek`, default 1 to 2). The pool is
   events whose `when` condition holds against its mirror of sim state (a condition that cannot be
   evaluated counts as false), that are off cooldown (`cooldown_weeks`, default 8), with weight above
   0, drawn by weight without replacement from its own RNG stream.

An event with a `role` is only drawn for a player in that role (`player.role`); events without one
are for everybody. Weight 0 means "scheduled only". `schedule` effects, on an event or on a resolved choice, queue an
event after a random `delay_weeks`. Each event fired emits `director.eventFired`.

Not yet: tension curve, arcs, and per-tag pacing. Those come with the later director work.

Config: `{ content: ContentView, eventsPerWeek?, defaultCooldownWeeks? }`.
Consumes `sim.stateChanged`, `turn.phaseStarted`, `choice.resolved`; emits `director.eventFired`.
