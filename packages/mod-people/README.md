# @je/mod-people

The people library and the people store (ADR 0003, `docs/design/IDENTITY-ENGINE.md`).

- `assembleLibrary` validates the attribute library (`library/*.json`: archetypes, quirks, names, departments and the
  real-world data tables, each with its source and a `verified` flag) the way the content validator checks packs.
- `generatePerson` draws one Person from the library with a seeded, conditional algorithm: the same world seed, run seed,
  event id and counter always give the same person; a contradictory draw is thrown away and the next sub-seed tried.
- `summarisePeople` gives the distributions the workbench and the tests compare to the data tables.
- The module (`manifest`, `createModule`) answers `person.requested` with `person.created` and keeps the store; its
  snapshot is the list of people.

- `createGuestPort` supplies the people who step into scenes (`Scene.guests`): often someone already met this run, else a
  colleague from the world's roster, else a new person; seeded by scene, slot and a counter, so a replay meets the same people.
- The `perception` module (`perceptionModule`) reads `guest.appeared` and `choice.resolved` and announces what the player now
  believes: `perception.updated` (one trait, a noisy estimate, a confidence that grows with every look) and
  `perception.quirkNoticed`. The true numbers never leave the module.

Personality axes are drawn independently of gender and age (a tested fairness rule). Depends only on `@je/contracts` and
`@je/kernel`. The workbench is `tools/people-workbench` (`pnpm people:validate`, `pnpm people:generate`).
