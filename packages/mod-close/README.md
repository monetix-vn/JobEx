# @je/mod-close

The month-end close, for jobs that have one: a role with `close_steps` (finance). Nothing happens for
other jobs.

- Each step is a variable `close.<step>` owned by sim-core (clamped to 0..2): 0 open, 1 done in a
  hurry, 2 done properly. Scenes set them with ordinary delta effects (YAML: `close bank_rec +2`).
- `close.open` is 1 for the last `windowWeeks` (default 3) weeks of a month, so scenes can ask for the
  close in that window (YAML `when: [close.open = 1]`).
- When the month rolls over, `close.completed { month, steps, score }` is announced. Score is the
  points earned over the points possible. At 0.75 or more the boss's opinion rises (+2); below 0.4
  it falls (-3); each step still open adds 1 stress. Then all steps reset to 0.
- The client shows the checklist while `close.*` variables exist.

Config: `{ content, roleId, windowWeeks? }`. Consumes `run.started`, `clock.ticked`,
`sim.deltaApplied`; emits `sim.applyDelta`, `close.completed`. No randomness, no locale.
