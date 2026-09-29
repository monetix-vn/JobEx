# @je/mod-choice

Owns outcome tables, skill checks and costs. It is the authority on whether a choice may be made.

On `choice.made` for an open scene it checks the choice's `requires` expression and energy cost
against its mirror of sim state (rejecting with `choice.rejected` and a reason), rolls the outcome
table with its own RNG stream, sends numeric `delta` effects to sim-core as `sim.applyDelta`, and
emits `choice.resolved` with the outcome (`result` from content, default `ok`), the narration key,
the cost, and the effects it did not apply itself (`schedule`, `fact`) for the modules that own
them. A scene with no choices accepts the synthetic `__continue` choice. `scene.expired` resolves
the scene as `ignored`.

Config: `{ content: ContentView }`.
Consumes `sim.stateChanged`, `scene.started`, `scene.expired`, `choice.made`; emits
`sim.applyDelta`, `choice.resolved`, `choice.rejected`.
