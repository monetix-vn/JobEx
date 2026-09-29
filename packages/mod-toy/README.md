# @je/mod-toy

A deliberately tiny module used to prove the Phase 0 gate: a new module is added with no change to
any existing module. It consumes `sim.weekSettled` and emits its own `toy.tallied`.

Depends only on `@je/contracts` (and `@je/kernel` for tests). Its event payload type lives in this
package rather than in contracts, because no other module consumes it.
