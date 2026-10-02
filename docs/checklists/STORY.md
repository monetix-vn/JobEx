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
- [x] 37 scenes imported in total (see `pnpm content:list --role qc`); 33 facts
- [ ] Owner approves bible and episode list (needs owner)
- [x] Cast created as `char.*` (6 characters, `content-src/qc-cast.yml`; names still need owner approval)
- [x] Onboarding block (first_day_walkthrough, first_signature, training_gap, lab_housekeeping)
- [x] Pre-Tet/Tet block (pre_tet_pile, tet_bonus_pressure)
- [x] The Squeeze block (audit_notice_huddle, vy_spring_visit as a beat)
- [x] Cheaper Steel arc (new_supplier_trial wired in, steel_trial_results, steel_field_failure)
- [x] The Hamper arc (3: hung_favour, hung_money, hung_threat; wired into supplier_gift)
- [x] Mid-year block (midyear_review beat, kpi_first_pass_yield)
- [x] Field Complaint arc (field_complaint_arrives beat, root_cause_dispute, recall_press) and the Minh arc (minh_mistake, minh_at_audit)
- [x] Autumn audit and crisis block (ms_vy_returns beat, scapegoat_meeting; recall_press in the complaint arc)
- [x] Finale block (year_end_review beat, manager_offer with the promoted ending)
- [x] Balance check (qc-year.test.ts): careful completes or is promoted, reckless caught; QC overhead tuned to 14 hours after the new scenes; pins updated
- [ ] VI text read by a native speaker; practitioner review

## Job 2: Export Sales Specialist (`docs/story/sales.md`)

- [x] Bible v2 (AI): cast, season timeline, four storylines, dark-side ladder, episode list (owner review pending)
- [x] 34 scenes imported: the original 19 plus 15 new (premiere, midyear review, big-buyer twist, year-end review, manager offer with the promoted ending, discount spiral x2, overdue pull-in, Quynh x2, factory visit, quota push, credit ask, expense padding, Anders's renewal); 8 new facts; characters Anders and Quynh
- [x] First-cut balance check: existing sales tests pass with the new scenes; `sales-year.test.ts` has new story-layer tests; pins updated
- [x] Remaining planned Sales scenes (second Tet block, trade-fair lead arc, finance interview, Quynh's promotion); 39 Sales scenes
- [ ] Practitioner review of the Sales text

## Job 3: Finance and Accounting (`docs/story/finance.md`)

- [x] Bible skeleton (AI)
- [x] Bible expanded to QC level of detail: cast, timeline, 4 arcs, dark-side ladder, 40-row episode list (owner approval pending) (needs owner)
- [x] Owner decisions 2026-09-30: same company, visible month-end close, promoted ending wanted (bible treated as approved in principle)
- [x] Month-end mechanic built (`mod-close`); step scenes still to write (4 steps, recurring monthly)
- [x] Role file `role.fin.accountant` (+ chief accountant) in the pack, not yet playable (no blurb)
- [x] 37 scenes imported: cast (6 + shared Vy), 8 month-end step scenes, 6 beats + manager_offer, arcs The Cut-off, The Receipt Problem (+ Vy asks), The Cookie Jar, Thu, random incidents, crisis consequences, resignation; 22 facts, 2 terms; job is playable (`?role=fin`)
- [x] First-cut balance check (`fin-year.test.ts`): careful completes or is promoted with stress about 50 and 60-66 decisions, reckless caught by week 15-37
- [x] Remaining planned Finance scenes and a third close-step variant for quarter ends (46 Finance scenes)
- [ ] Practitioner review of the Finance text

## Job 4: Production Planner (`docs/story/production.md`)

- [x] Bible v1 (AI): cast, season timeline, four storylines, dark-side ladder, episode list (owner review pending)
- [x] Role `role.prod.planner` playable (overhead 15 hours), `prod-year` scenario, CI step `sim:prod`
- [x] 31 scenes: beats (first week, midyear review, big-breakdown twist, labour inspection, year-end review, manager offer), arcs The Promise, The Deferred Maintenance, Phuc, The late steel, random incidents, crisis consequences, resignation; 4 new characters, 26 facts
- [x] First-cut balance check (`prod-year.test.ts`)
- [ ] More Production scenes (the rows still planned in the bible) and practitioner review

## Job 5: Purchasing Buyer (`docs/story/purchasing.md`)

- [x] Bible v1 (AI) written with the scenes (owner review pending)
- [x] Role `role.purch.buyer` playable (overhead 22 hours), `purch-year` scenario, CI step `sim:purch`
- [x] 23 scenes: beats (first week, midyear review, steel price twist, vendor audit, year-end review, manager offer), arcs The Sweetener, The Single Source, The Ghost Stock, random incidents, consequences (auditor asks about rebates, blame meeting), resignation; 2 new characters, 25 facts
- [x] First-cut balance check (`purch-year.test.ts`)
- [ ] More Purchasing scenes (about 10 listed in the bible) and practitioner review

## Job 6: Investment Banking Analyst, the "finance bro" (`docs/story/investment.md`)

- [x] Bible v1 (AI) written with the scenes (owner review pending); own company and pack `content/industry-securities`
- [x] Role `role.inv.analyst` playable (overhead 10 hours), `inv-year` scenario, CI step `sim:inv`
- [x] 25 scenes: beats (first week, midyear review, market twist, compliance review, bonus review, associate offer), arcs The Valuation, The Tip, The Hours, The Error in the Pitch, incidents (client dinner, personal trade, headhunter, late edit), consequences (compliance asks about trades, blame meeting), resignation; 5 new characters, 3 terms, 20 facts
- [x] First-cut balance check (`inv-year.test.ts`)
- [ ] More Investment scenes (see the bible) and practitioner review

## Job 7: HR Business Partner (`docs/story/hr.md`)

- [x] Bible v1 (AI) written with the scenes (owner review pending); same company as the cookware jobs; new reputation group and detector `staff`
- [x] Role `role.hr.hrbp` playable (overhead 20 hours), `hr-year` scenario, CI step `sim:hr`
- [x] 29 scenes: beats (first week, midyear review, cost-cut twist, labour inspection, year-end review, manager offer), arcs The Chosen One, The Complaint, The List, incidents (contract chain, overtime records, insurance base, salary leak, probation and pregnancy, underage applicant, engagement survey, Tet bonus, reference call), consequences (labour inspector asks, blame meeting), resignation; 6 new characters, 27 facts
- [x] First-cut balance check (`hr-year.test.ts`)
- [ ] More HR scenes (about 32 decisions a year, the lightest job) and practitioner review (labour-law details especially)

## Job 8: Production Line Supervisor (`docs/story/supervisor.md`)

- [x] Bible v1 (AI) written with the scenes (owner review pending); same factory as the planner, Line 3, seen from the floor
- [x] Role `role.prod.supervisor` (department Production, so it is grouped with the planner) playable (overhead 15 hours), `sup-year` scenario, CI step `sim:sup`
- [x] 29 scenes: beats (first week, midyear review, rush order twist, safety inspection, year-end review, manager offer), arcs The Target, The Hand, The Roster, incidents (heat, breakdown, QC hold, training sign-off, handover, VIP visit, blocked exit, scrap theft), consequences (labour inspector asks, blame meeting), resignation; 4 new characters, 24 facts
- [x] First-cut balance check (`sup-year.test.ts`)
- [ ] More Supervisor scenes and practitioner review (injury recording and speed rating practice especially)

## Job 9: FP&A Analyst (`docs/story/fpa.md`)

- [x] Bible v1 (AI) written with the scenes (owner review pending); same company as Finance and Accounting, a different job (budget, forecast, covenant, KPI pack)
- [x] Role `role.fpa.analyst` playable (overhead 19 hours), `fpa-year` scenario, CI step `sim:fpa`
- [x] 27 scenes: beats (first week, midyear review, bank covenant twist, audit review, year-end review, manager offer), arcs The Budget, The Covenant, The KPI Pack, incidents (variance commentary, spreadsheet error, pipeline forecast, ROI case, commission baseline, early board numbers, split purchase, cost allocation), consequences (internal auditor asks, board blame), resignation; 5 new characters, 24 facts
- [x] First-cut balance check (`fpa-year.test.ts`)
- [ ] More FP&A scenes and practitioner review (covenant and cut-off practice especially)

## Job 10: Brand and Digital Marketing Executive (`docs/story/marketing.md`)

- [x] Bible v1 (AI) written with the scenes (owner review pending); same company, head office; claims, reviews, agency
- [x] Role `role.mkt.brand` playable (overhead 22 hours), `mkt-year` scenario, CI step `sim:mkt`
- [x] 28 scenes: beats (first week, midyear review, launch twist, consumer inspection, year-end review, manager offer), arcs The Claim, The Reviews, The Agency, incidents (borrowed photo, comparison ad, year-end spend, bought list, paid award, fake urgency, green claim, staged testimonial), consequences (inspector asks, blame meeting), resignation; 5 new characters, 28 facts
- [x] First-cut balance check (`mkt-year.test.ts`)
- [ ] More Marketing scenes and practitioner review (advertising substantiation and review practice especially)

## Later jobs (not yet designed)

- [x] Owner decision 2026-10-02: add HR (HRBP), Production (Line Supervisor), FP&A, Marketing and IT in that order, grouped by department in the picker (`docs/story/JOB-PROPOSALS.md`)
- [ ] Further jobs after those five (Logistics? Warehouse? a bank branch? a start-up?) (needs owner)
- [ ] For each: bible, then scenes (same steps as above)

## Story-writing loop (each session)

1. Open the job's bible, find the first `planned` episode in timeline order whose engine
   dependencies are done.
2. Draft it in YAML under `content-src/<job>-<block>.yml` following the tone guide.
3. `pnpm author <file> --dry-run`, then import; run `pnpm run ci:quiet`; fix balance; `pnpm pin:update`
   if the year's behaviour changed.
4. Update the episode's Status in the bible, tick this list, update `docs/STATUS.md`, commit.
5. Report to the owner: what was added, anything that needs review.
