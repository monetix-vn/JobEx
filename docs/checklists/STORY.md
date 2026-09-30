# Story and script checklist

Everything about what the game says: the series, cast, timeline, scenes, events. AI: read
`docs/AI-GUIDE.md` first. The engine work that stories depend on is in `docs/checklists/TECH.md`
(Phase 2); do not write arc/character content before its engine item is done.

Legend: `[x]` done, `[~]` in progress, `[ ]` not started. Episode status values: `planned`, `draft`,
`imported`, `reviewed`. The per-episode tables live in the bibles (`docs/story/<job>.md`) and are the
source of truth for what scene comes next; update their Status column as you go.

## Global

- [x] Tone and scene rules written (`content/industry-cookware/events/README.md`)
- [x] Authoring format and tools (`docs/AUTHORING.md`)
- [x] Bible template (`docs/story/TEMPLATE.md`)
- [ ] Owner approves the series-level direction: realism vs. tone, dark-side intensity, setting (Binh Duong or neutral) (needs owner)
- [ ] Shared company bible: factory, departments, calendar (Tet, audits, peaks), recurring outsiders, so all three jobs share one world
- [ ] Glossary coverage pass: every jargon term used in scenes is a term
- [ ] Practitioner review of all text, per job (needs owner to find reviewers)

## Job 1: QC Specialist (`docs/story/qc.md`)

- [x] Bible draft v1 (AI) (owner approval pending) (needs owner)
- [x] 24 scenes imported (10 original + 2 consequence + 6 batch 2 + 3 Hamper + premiere, midyear_review, year_end_review as beats)
- [ ] Owner approves bible and episode list (needs owner)
- [x] Cast created as `char.*` (6 characters, `content-src/qc-cast.yml`; names still need owner approval)
- [~] Onboarding block (1 of 4 imported: first_day_walkthrough; remaining: first_signature, training_gap, lab_housekeeping)
- [ ] Pre-Tet/Tet block (2)
- [ ] The Squeeze block (2 + extend audit_day)
- [ ] Cheaper Steel arc (2)
- [x] The Hamper arc (3: hung_favour, hung_money, hung_threat; wired into supplier_gift)
- [~] Mid-year block (midyear_review imported as a beat; kpi_first_pass_yield remaining)
- [ ] Field Complaint arc (4, incl. minh_mistake)
- [ ] Autumn audit and crisis block (4)
- [~] Finale block (year_end_review imported as a beat; manager_offer and the promotion ending remaining)
- [ ] Balance check: careful completes, reckless caught, 55 to 65 decisions a year; pins updated
- [ ] VI text read by a native speaker; practitioner review

## Job 2: Export Sales Specialist (`docs/story/sales.md`)

- [x] Bible outline v1 (AI)
- [x] 18 scenes imported
- [ ] Expand bible to QC level of detail (episode table with timing, cast, choices) (owner approves)
- [ ] Cast finalised (Thao, Anders, Lan, Duc, Quynh, competitor)
- [ ] Premiere and first big order
- [ ] Discount Spiral arc
- [ ] Overdue Account arc
- [ ] Quynh arc
- [ ] Midseason twist and crisis scenes
- [ ] Finale and annual review
- [ ] Balance check and review

## Job 3: Finance and Accounting (`docs/story/finance.md`)

- [x] Bible skeleton (AI)
- [x] Bible expanded to QC level of detail: cast, timeline, 4 arcs, dark-side ladder, 40-row episode list (owner approval pending) (needs owner)
- [x] Owner decisions 2026-09-30: same company, visible month-end close, promoted ending wanted (bible treated as approved in principle)
- [x] Month-end mechanic built (`mod-close`); step scenes still to write (4 steps, recurring monthly)
- [x] Role file `role.fin.accountant` (+ chief accountant) in the pack, not yet playable (no blurb)
- [x] 37 scenes imported: cast (6 + shared Vy), 8 month-end step scenes, 6 beats + manager_offer, arcs The Cut-off, The Receipt Problem (+ Vy asks), The Cookie Jar, Thu, random incidents, crisis consequences, resignation; 22 facts, 2 terms; job is playable (`?role=fin`)
- [x] First-cut balance check (`fin-year.test.ts`): careful completes or is promoted with stress about 50 and 60-66 decisions, reckless caught by week 15-37
- [ ] Remaining Finance scenes (see the list in `docs/story/finance.md`) and more close-step variants
- [ ] Practitioner review of the Finance text

## Later jobs (not yet designed)

- [ ] Choose the next jobs (Production Planner? Purchasing? HR? Logistics?) (needs owner)
- [ ] For each: bible, then scenes (same steps as above)

## Story-writing loop (each session)

1. Open the job's bible, find the first `planned` episode in timeline order whose engine
   dependencies are done.
2. Draft it in YAML under `content-src/<job>-<block>.yml` following the tone guide.
3. `pnpm author <file> --dry-run`, then import; run `pnpm run ci:quiet`; fix balance; `pnpm pin:update`
   if the year's behaviour changed.
4. Update the episode's Status in the bible, tick this list, update `docs/STATUS.md`, commit.
5. Report to the owner: what was added, anything that needs review.
