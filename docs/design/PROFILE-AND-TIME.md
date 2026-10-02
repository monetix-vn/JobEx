# Design: player profile and time scale (proposal, no code yet)

Status: PROPOSAL (2026-10-02), asked for by the owner ("create player profile (sex, background, age) and time
scale / speed first; you suggest what I should do with those things; focus on game design, not code").
Nothing here is built. It needs the owner's choices (section 7) before engine work starts.

## 1. The idea in one paragraph

Today every player is the same anonymous person in a different chair. The most honest thing a job
simulation can teach is that **the same job feels different depending on who you are and what you carry
home**. So the profile should not be a costume; it should change (a) what you can afford to refuse, (b) who
trusts you at the start, (c) how much time and energy you really have, and (d) a few scenes that only
some people meet. Time scale then decides how those pressures are felt: a calm year you can think through,
or a year that does not wait.

## 2. Principles

1. **Pressure, not stereotype.** A profile field changes the player's situation (money, hours, trust),
   never their ability or their moral worth. Nobody is "worse at finance" because of gender or age.
2. **Money is the engine of the dark side.** The game is about temptation; a person with debt and dependents
   is tempted differently from a person with a safety net. This is the most important profile axis.
3. **Bias is shown, not scored.** Real workplaces treat people differently. We show that in a handful of
   authored scenes (opt-in realism level), never as hidden stat penalties.
4. **Replay is the point.** The same job and seed with a different persona should produce a different
   story and a different debrief ("someone in your position faces this differently").
5. **Everything is chosen once, at the start, and is part of the recorded run** (same persona + seed + inputs =
   same log). No profile data leaves the device.

## 3. The profile: three short screens

### Screen 1: Who you are

| Field | Options | What it changes |
| ----- | ------- | --------------- |
| Name | free text, or a suggested one | Shown in scenes ("Ms Lan calls you by name"). |
| Age band | 22-25, 26-32, 33-40, 41-50, 51+ | Starting energy, how bosses and peers treat you, which life scenes appear (see below), promotion expectations. |
| Gender | female, male, non-binary / prefer not to say | Vietnamese forms of address (anh / chị / em, so the text can stop avoiding gender); the opt-in set of "workplace experience" scenes. **No numeric penalties.** |

A real design win: today the Vietnamese text must say "anh/chị" for the player because we do not know who is
playing. With a profile, scenes can address the player correctly, which makes the story feel personal.

### Screen 2: Where you come from

| Field | Options | What it changes |
| ----- | ------- | --------------- |
| Education | fresh graduate (business / engineering / other), self-taught, vocational, postgraduate | Starting skills and which glossary terms you already know (less jargon help if you know the field). |
| Experience | none, one job before, ten years elsewhere, switching career | Starting skills, starting stress tolerance, how patient the boss is. |
| How you got the job | applied cold, internal transfer, recommended by someone, relative of an owner | Starting trust with specific people (a recommender expects loyalty; a relative is watched by everyone). |

### Screen 3: What is at stake at home

| Field | Options | What it changes |
| ----- | ------- | --------------- |
| Money | comfortable, tight, in debt, sending money to family | A visible "money pressure" level that makes cash offers (kickbacks, bonus tricks) pull harder, and makes a firing more frightening. This is the main driver of the dark side. |
| People who depend on you | none, partner, children, parents, several | Fewer free hours, home events that compete with work, and reasons to say yes. |
| Home base | lives with family, rents alone, long commute, owns a flat | Commute hours, energy, one or two home scenes. |

## 4. What the profile does inside the game

| Effect | Example |
| ------ | ------- |
| Starting skills and relationships | A fresh graduate starts with lower skill and a boss who is patient; a career switcher starts with high backbone and low job skill; a relative of the owner starts with unusual trust from some people and suspicion from others. |
| Money pressure | A player in debt who is offered an envelope from a supplier feels it; the debrief says so. A comfortable player can refuse more cheaply, and the debrief says that too ("refusing was easier for you than for someone in debt"). |
| Hours and energy | A parent of two has fewer free hours: the same job overhead fills more of their week, so the same pressure arrives sooner. A 24-year-old recovers energy faster; a 48-year-old has more standing and slower recovery. |
| Life scenes (about 10 shared across jobs, not per job) | A child is ill on the day of the audit; a parent is in hospital during year-end; a landlord raises the rent; a wedding to attend during the peak; a relative asks to be hired; a bank letter about the loan. Each competes with work for hours and tests priorities. |
| Treatment by others (opt-in "workplace experience" level) | A woman asked to take the notes and plan the party; a 52-year-old assumed to be slow with the new system; a 23-year-old not taken seriously by a supplier; a pregnant colleague scene seen from the colleague's side. Shown as scenes with real options, never as a hidden penalty. |
| Debrief | The end-of-run review adds a section: "your situation" - what was harder or easier because of who you were, with the same facts and lessons as today. |

### Quick start personas (for first-time players and for classrooms)

Four ready-made people so nobody has to fill three screens:

1. **The fresh graduate:** 23, first job, rents in the city, family expects help with money.
2. **The parent:** 36, mortgage, two children, good at the job and out of hours.
3. **The career switcher:** 41, ten years in another field, savings, something to prove.
4. **The owner's relative:** 28, easy trust and heavy expectations, no escape from the family.

Plus "Create your own" for those who want it. A random persona button is cheap and useful for a classroom.

## 5. Time scale and speed

### What exists now

The year runs in weeks. Time advances by itself every second or two, and pauses when a decision is open.
Nothing lets the player choose how the year feels.

### Proposed controls

| Control | Options | Why |
| ------- | ------- | --- |
| **How the year runs** | **Thoughtful** (time moves only when you end the week), **Steady** (a week every few seconds, pauses on a decision; today's behaviour), **Pressure** (decisions have a limit; if you do not choose, the default happens) | Pressure mode teaches that not deciding is a decision. It is optional; the default stays Steady. |
| **Length of the year** | **Full year** (52 weeks), **Short year** (26 weeks, same story compressed), **Sprint** (12 weeks, one storyline and the offer; for classrooms and demos) | Lets a lesson fit a lunch break or a semester. Season beats scale by percentage of the year. |
| **Speed while playing** | pause, normal, fast; "skip to the next decision" | Never skips decisions; useful for accessibility and for replays. |
| **Auto-save** (depends on the save feature) | every week | A year takes about an hour; people close the laptop. |

### Time as a resource (ties to the planned weekly planner)

Each week the player has hours. The job overhead, the commute, the home events and sleep all take some.
With a profile, the same job gives different players different amounts of free time, which is exactly the
difference between "I could stay late to fix it" and "I have to collect my child at five". The planner
(roadmap item P1) is where the player actually spends those hours; the profile only sets the budget. We
should build the profile first and the planner after, so the budget has meaning.

## 6. Suggested order of work (design view)

1. **Persona presets and the three screens,** with a small, fixed set of effects: starting skills,
   starting relationships, money pressure level, free hours, Vietnamese address forms, and a debrief section.
2. **Time controls:** Thoughtful / Steady, Full / Short year, speed and skip-to-decision. (Pressure mode later.)
3. **About ten shared life scenes** and the opt-in workplace-experience set, written with the same tone rules
   as the job scenes and reviewed by practitioners.
4. **Pressure mode and the weekly planner,** once the budget of hours exists.

Content cost: scenes can be gated on profile values (for example "has dependents", "in debt", "age band"),
so a job's existing scenes stay as they are, and profile scenes are added on top. Each job also gains a few
profile-aware lines (a boss who says something different to a 23-year-old than to a 45-year-old).

## 7. Decisions needed from the owner

1. **Workplace-experience scenes** (bias shown through scenes): on by default, off by default, or chosen by
   the player at the start ("realism level")? My recommendation: a visible choice at the start, default on,
   described honestly.
2. **Gender options:** female, male, non-binary / prefer not to say. Any others you want?
3. **Free creation vs presets:** presets first and free creation too, or only presets at first?
4. **Pressure mode** (timed decisions): include in the first release or later? Recommendation: later.
5. **Default length:** Full year as the default, with Short year and Sprint as options? Recommendation: yes.
6. **Money pressure:** shown to the player as a visible meter, or felt only through scenes and the debrief?
   Recommendation: a small visible indicator, so the player understands why a cash offer is tempting.
