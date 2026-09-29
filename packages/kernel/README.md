# @je/kernel

Owns the event bus, seeded RNG streams, world clock, module host and replay log. It imports only
`@je/contracts` and has no browser, network or Node dependencies.

- **Ordering:** turn phase, then module priority (then module id), then event id.
- **Determinism:** one RNG stream per module, derived from the run seed and module id, so adding
  a module never shuffles another module's rolls. No wall-clock time or ambient randomness.
- **Contract enforcement:** a module may only emit and handle what its manifest declares.
- **Replay:** `Run.exportLog()` yields a log (seed, inputs, entries, final state); `replay()`
  re-runs it and demands a byte-identical result.
- **Fixtures:** `assertFixture` runs a module alone against given/expect event lists.
