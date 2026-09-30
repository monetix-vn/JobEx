# 0002: Story engine first, then a series bible, then scenes

Status: proposed (waiting for the owner's approval). Date: 2026-09-30.

## Why

The engine runs a year of events, but events are independent incidents. A story needs recurring
people who remember what the player did, arcs that build over weeks, and a timeline that makes the
year feel like one season of a series. So: give the engine those three things, then plan each job
like a TV series, then write scenes against that plan.

## The order of work

1. **Engine: characters, relationships, arcs** (this ADR). Small, tested, no new content needed.
2. **Series bible per job** (`docs/story/<job>.md`, from `docs/story/TEMPLATE.md`): premise, the
   player's arc, cast, season timeline by month, recurring storylines, the dark-side ladder, endings.
   The owner reviews and approves each bible before any scene is written.
3. **Episode list per job** (table in the same file): each planned scene/arc with its trigger,
   cast, the choice triad, facts and the arcs it belongs to.
4. **Write the scenes** with `pnpm author`, against the approved episode list.
5. **Review and balance**: practitioner review of text, bot balance, pins.

Nothing in 4 starts before 2 and 3 are approved. Steps 2 and 3 can be drafted in parallel with 1.

## Engine design (step 1)

### Characters (content, new pack kind `character`)

A named, recurring person: `id` (`char.lan_production_lead`), `name`, `role_title`, `department`,
`traits` (few tags: proud, risk_averse, ambitious), `home_group` (which reputation group they belong
to), `blurb_key`. Scenes refer to them with `cast: ["char:lan_production_lead"]`; the validator
checks the reference. Lines and text keep working as today; the speaker name comes from the
character.

### Relationships (new module `mod-relationships`, priority 32)

Per character, three numbers owned by sim-core variables `rel.<char>.trust`, `rel.<char>.loyalty`
and `rel.<char>.owed` (favours they owe the player, negative when the player owes them), each
-100..100, start values from the character. Effects in scenes get two new forms:
`rel lan trust +8` and `favor lan +1`. Conditions can read them (`rel.lan.trust >= 20`). The
module also: applies slow decay towards neutral, turns `witnessed`/`rumor` facts into trust changes
for the characters who could know (same department or named in the fact), and emits
`relationship.changed` for the debrief and client. No module imports another; it talks by events.

### Arcs (content kind `arc`, runs in `mod-director`)

An arc is a small state machine: `id`, `stages` (each with an event to fire, an earliest and latest
week gap after the previous stage, and an optional condition), and `branches` chosen by a choice
outcome tag or a relationship/fact condition. A scene outcome can `start arc <id>` or
`advance arc <id> <stage>`; the director schedules the next stage. Arcs reuse the existing
`schedule` mechanism, so replay stays identical. The validator checks stages reference real events
and that every arc can reach an end.

### Timeline

Events may carry `season` hints (`not_before_week`, `not_after_week`, or named beats such as
`tet`, `year_end_close`, `audit_window`). The director keeps the weekly random events but reserves
"beats": fixed or near-fixed episodes from the bible (the season premiere, mid-season twist,
finale) so every run has a spine, with random incidents between them.

### Debrief and client

The debrief adds "the people who remember you" (trust, favours) and the arcs you closed or left
open. The client shows a small cast panel. Both are read-only views of events.

## What stays the same

Determinism and replay, the c1/c2/c3 convention, EN+VI for every text, module boundaries, YAML
authoring (extended with `char:`, `rel`, `favor`, `arc`).

## Risks

- Too much state makes balance hard: start with about 5 characters per job and a hard cap.
- Arcs can make a run feel railroaded: keep at least half of each year random incidents.
- Every new content kind needs validator rules and pins; budget one block for the engine.

## Acceptance for step 1

Tests for each new piece, a demo arc with two characters playable end to end in both languages, the
year still deterministic, CI green, `docs/AUTHORING.md` updated.
