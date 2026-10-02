# 0003: Identity and world engine (everyone is a Person)

Status: accepted on 2026-10-02 (owner: "ok" to `docs/design/WORLD-PLAN.md` v2 and its recommendations).
Design: `docs/design/IDENTITY-ENGINE.md`, `docs/design/PROFILE-AND-TIME.md`, `docs/design/WORLD-PLAN.md`.

## Decision

1. The player and every non-player character are the same thing, a **Person**, with four layers: origin
   (fixed), life state (slow), memory (event-sourced) and intent (derived). Only the controller differs.
2. People are **generated** from a seeded, data-driven attribute library plus a real-world data pack, on
   events requested by the director or by story arcs, and recorded as `person.created` events. The log stays
   the single source of truth; the people store is a projection of it.
3. Other people's feelings about the player are **appraisals** that depend on the observer's values
   (action effect x value match x familiarity). What the player knows about anyone is an **impression**
   (noisy estimate plus confidence), never the true numbers.
4. Non-player action is **utility-based, seeded choice** with director pacing. Crime and violence are a causal
   model (motive, opportunity, conscience with habituation, perceived risk, detection, justice, retaliation),
   calibrated to base rates.
5. The world is simulated in **tiers**: about 50 people weekly, the company (about 500) monthly, the rest of
   a hard cap of 3000 yearly and materialised on contact.
6. The existing fixed characters become ordinary Persons or anchors; arcs move from named people to **story
   functions** (complainant, accused, tempter...) filled by casting. A legacy fixed-cast mode stays until the
   migration is finished.
7. New modules, each talking only by events: `identity`, `perception`, `life`, `ladder`, `behaviour`,
   `crime`, `world`, `text`. Existing modules are extended, not replaced. Layer rules (ADR 0001) still hold.

## Consequences

- Determinism and CI replay are preserved; all randomness comes from the kernel's seeded RNG, derived from
  `hash(worldSeed, runSeed, eventId, counter)`.
- Content cost grows (library, culture pack, text pools); offline AI drafts reviewed by people, never
  free-form AI at runtime.
- Personality axes are independent of gender and age; bias is shown through scenes, not hidden penalties.
