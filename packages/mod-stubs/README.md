# @je/mod-stubs

Stand-ins for the Phase 1 modules, so the kernel, replay and client can be exercised end to end
before the real modules exist. Three modules that talk only through events:

| Module          | Stands in for           | Consumes                                                   | Emits                                       |
| --------------- | ----------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| `stub-economy`  | sim-core, workload      | `clock.ticked`, `turn.phaseStarted`, `choice.resolved`     | `sim.weekSettled`                           |
| `stub-director` | mod-director            | `sim.weekSettled`                                          | `director.eventFired`                       |
| `stub-choice`   | mod-narrative, choice   | `run.started`, `clock.ticked`, `director.eventFired`, `choice.made` | `map.loaded`, `scene.started`, `choice.resolved` |

Replace each with its real module by swapping it out of the module list; nothing else changes.
