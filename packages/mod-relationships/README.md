# @je/mod-relationships

How named people (content kind `character`) feel about the player. Values live in sim-core as
`rel.<slug>.trust|loyalty|owed` (slug = character id without `char.`), each from -100 to 100. Scenes
change them with ordinary delta effects (`{ "delta": "rel.khoa.trust", "value": 5 }`; in YAML
`rel khoa trust +5`), and conditions read them like any variable.

- On `run.started`: seeds each character's non-zero `start` values (`mode: set`).
- Every `driftEveryWeeks` (default 4) weeks, trust and loyalty move one point back towards their start.
  `owed` (favours) does not drift.
- Facts feed relationships: when a fact reaches `witnessed` (and again at `public`), each character
  whose `home_group` has a reputation consequence gets trust `round(|change| * factShare)` with the change's sign (so -3 gives -2, not -1)
  (default 0.5), once per fact and level.
- Every `rel.*` change seen on `sim.deltaApplied` is announced as `relationship.changed`.

Config: `{ content, driftEveryWeeks?, factShare? }`. Consumes `run.started`, `clock.ticked`,
`fact.learned`, `fact.escalated`, `sim.deltaApplied`; emits `sim.applyDelta`, `relationship.changed`.
No randomness, so it never draws from the RNG stream.
