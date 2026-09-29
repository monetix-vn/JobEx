# @je/mod-narrative

Plays scenes and resolves their text. It owns the scene queue and the active scene, and nothing
about balance or outcomes.

- Scenes start at the plan phase from a per-turn script, or when `director.eventFired` names a
  content event (unknown events are ignored). One scene is active at a time; the rest queue.
- Text is looked up in the configured locale and sent to the client already resolved, with speakers
  turned into display names (`speaker.<name>` keys).
- A choice is marked `disabled` when its `requires` expression is false against the state mirror;
  mod-choice remains the authority. A scene with no choices offers a single `__continue` choice.
- A scene unanswered for `patienceTurns` (default 1) turns emits `scene.expired`.
- When `choice.resolved` arrives, it emits `scene.ended` with the resolved narration and starts
  the next queued scene.

Config: `{ content: ContentView, locale?, script?, patienceTurns? }`.
Consumes `sim.stateChanged`, `clock.ticked`, `turn.phaseStarted`, `director.eventFired`,
`choice.resolved`; emits `scene.started`, `scene.ended`, `scene.expired`.
