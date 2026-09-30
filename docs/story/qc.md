# Series bible: Quality Control Specialist (cookware factory, Binh Duong)

Status: DRAFT v1 by AI, not yet approved by the owner, not reviewed by a practitioner.
Tone rules: `content/industry-cookware/events/README.md`. Format: `docs/AUTHORING.md`.
Episode status values: `done` (exists in content), `planned`, `draft` (YAML written, not imported),
`imported`, `reviewed`.

## 1. Premise

You are the new QC specialist at a mid-size stainless cookware maker that exports to European
buyers. Your signature is the last thing between a batch and a customer. Everyone around you is
measured on output and on time; you are measured on what does not go wrong, which nobody notices
until it does.

## 2. What the player should feel

- Saying "no" is a skill, and it costs you socially every time.
- Most quality failures start as small, reasonable compromises, not as villains.
- Records are your only defence, so falsifying them destroys the thing that protects you.
- Audits and recalls are not random: they find what you left lying around earlier in the year.
- You can be right and still lose the argument this week; integrity pays on a slower clock.

## 3. The player's arc

1. **Weeks 1 to 12, the new person.** Learn the lab, earn respect, first small pressures. Choices feel cheap.
2. **Weeks 13 to 26, the first compromise.** Production and sales lean on you. The first shortcut works.
3. **Weeks 27 to 40, the bill.** Consequences from earlier choices arrive (complaints, a buyer audit window).
4. **Weeks 41 to 52, who you became.** A recall decision and the year-end review; the ending reflects the pattern of choices.

## 4. Cast (recurring characters; all to be created as `char.*` once the engine supports them)

| Character                      | Title / dept              | Wants                              | Fears                        | Tic                             | Relationship arc                                                                          |
| ------------------------------ | ------------------------- | ---------------------------------- | ---------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------- |
| Mr Khoa (`qc_lead`)            | QC Manager, your boss     | A clean audit, no surprises        | Being blamed from above      | Says "write it down" constantly | Mentor who tests your backbone; backs you if your records are clean, hangs you out if not |
| Ms Lan (`production_lead`)     | Production Manager        | Shipments out on time              | Line downtime                | Friendly until a deadline       | Friction to reluctant ally; pressure rises in peak months, respects you if you were fair  |
| Minh (`lab_tech`)              | Lab technician            | To do right and keep the job       | Making a mistake in public   | Over-apologises                 | The junior you protect or sacrifice; his loyalty reflects how you handle his errors       |
| Mr Hung (`supplier_rep`)       | Account manager, supplier | Easy acceptance, repeat orders     | Losing the account           | Gifts, small favours            | Outsider who escalates from hamper to real money; gets ugly if you refuse late            |
| Ms Vy (`auditor`)              | Buyer's external auditor  | To find gaps, honestly             | Being lied to                | Reads the dates, not the claims | Appears twice (spring, autumn); the season's referee                                      |
| Mr Tam (`purchasing` / `cost`) | Purchasing manager        | Lower cost, faster approvals       | Missing savings targets      | Jokes about "flexibility"       | Wildcard ally of production; tests you with supplier and spec changes                     |

## 5. Season timeline (by month)

| Month | Business reality                                   | Beat / storyline                                                                    |
| ----- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Jan   | Pre-Tet rush, output push, short-staffed lab       | **Premiere:** first batch under pressure; meet Khoa, Lan, Minh                      |
| Feb   | Tet break, backlog after                           | Catch-up pressure: sample cuts, rework without retest                               |
| Mar   | Buyer audit notice (spring)                        | **Arc A "The Squeeze"** starts: audit prep vs. records reality                      |
| Apr   | Audit window (spring)                              | Ms Vy's first visit; records and calibration checked                                |
| May   | Calm-ish, new supplier push                        | **Arc B "Cheaper Steel"** starts (Tam)                                              |
| Jun   | Mid-year review, cost targets                      | Spec-change pressure; Khoa's feedback on your record so far                         |
| Jul   | Peak summer orders                                 | **Midseason twist:** a batch fails after shipping (field complaint begins, Arc C)   |
| Aug   | Complaint handling, traceability                   | Complaint trace; mislabeled sample; Minh's mistake                                  |
| Sep   | Supplier account pressure                          | **Arc D "The Hamper"** peaks (Hung's escalation)                                    |
| Oct   | Autumn audit prep                                  | Ms Vy's second visit: what did you leave behind in spring?                          |
| Nov   | Year-end peak, tempers short                       | **Crisis:** recall decision; blame and scapegoating                                 |
| Dec   | Year-end close, performance review                 | **Finale:** review with Khoa; ending determined by facts, relationships and records |

## 6. Storylines (arcs)

Existing content already has `arc.the_squeeze` on `event.buyer_audit_notice` and `event.audit_day`.

- **Arc A, The Squeeze** (Mar to Apr, shared with sales): notice -> prep pressure -> audit day.
  Branches: clean records (calm audit), patched records (fact `filled_records`/`backdated_calibration`, audit finds gaps).
- **Arc B, Cheaper Steel** (May to Oct): trial supplier -> first deliveries thin on paperwork -> a field failure or a clean result. Facts: `fast_tracked_supplier`, `accepted_on_supplier_word`.
- **Arc C, The Field Complaint** (Jul to Nov): complaint trace -> root cause hunt -> recall decision. Facts: `downplayed_defect`, `delayed_recall_notice`.
- **Arc D, The Hamper** (Jun to Oct): gift -> "light check" request -> real money -> threat. Facts: `accepted_supplier_gift`, plus new `took_supplier_money`.
- **Arc E, Minh** (Aug to Dec): his mistake -> how you handle it -> his loyalty or resentment -> he testifies or covers for you at the audit.

## 7. The dark-side ladder (smallest to largest)

1. Round a borderline result the favourable way (`rounded_result`, sev 2).
2. Cut the sample size (`cut_sample_size`, 3).
3. Release reworked/untested lot on someone's word (`released_reworked_lot`, 3).
4. Accept a supplier on its own certificate (`fast_tracked_supplier`, 3).
5. Accept a gift and go easy (`accepted_supplier_gift`, 3).
6. Backdate calibration or fill records before an audit (4).
7. Loosen the spec or alter records (`loosened_spec_to_pass`, `altered_inspection_records`, 4).
8. Delay a recall notice or take money (`delayed_recall_notice`, 5).

## 8. Endings

Completed with pride (clean record), completed with secrets (promoted on a pile of private facts),
burnout, fired (caught in an audit or scapegoated), prosecuted (recall or bribe traced). Engine
endings exist (`fired`, `prosecuted`, `burnout`, completed); a "promoted to QC manager" ending and a
"walked away" ending are planned (engine, see TECH checklist).

## 9. Episode list

Status `done` = exists in `content/industry-cookware`. Planned ids use the YAML `scene:` format
(`qc.<key>`). c1/c2/c3 = by the book / compromise / shortcut.

| Id                                          | Timing / trigger               | Cast                | Situation                                        | c1 / c2 / c3                                                                        | Arc | Status                         |
| ------------------------------------------- | ------------------------------ | ------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- | --- | ------------------------------ |
| qc.batch_fail                               | any, cd 10                     | Lan, Khoa           | A batch fails inspection, shipment waiting       | hold / partial / release                                                            | -   | done                           |
| qc.borderline_result                        | any                            | Minh                | Result sits on the limit                         | retest / document / round                                                           | -   | done                           |
| qc.supplier_no_coa                          | any                            | Hung                | Delivery arrives without CoA                     | hold / conditional / accept                                                         | B   | done                           |
| qc.calibration_overdue                      | any                            | Khoa                | Instrument overdue for calibration               | stop / schedule / backdate                                                          | A   | done                           |
| qc.audit_prep_records                       | audit window                   | Khoa                | Gaps in records before the audit                 | fix honestly / disclose / fill in                                                   | A   | done                           |
| qc.complaint_trace                          | after shipments                | Lan                 | Customer complaint needs tracing                 | full trace / partial / blame supplier                                               | C   | done                           |
| qc.inspector_shortcut                       | any                            | Minh                | Skip a step to save time                         | enforce / coach / look away                                                         | E   | done                           |
| qc.supplier_gift                            | any                            | Hung                | Hamper plus a request                            | decline / declare / accept                                                          | D   | done                           |
| qc.oven_drift                               | any                            | Minh                | Oven temperature drifting                        | stop / adjust & log / ignore                                                        | -   | done                           |
| qc.recall_decision                          | turn >= 8, cd 30               | Khoa, Lan           | Possible recall                                  | recall / targeted / delay                                                           | C   | done                           |
| qc.audit_findings                           | needs a QC fact                | Ms Vy               | Audit finds what you did                         | own it / explain / deny                                                             | A   | done (consequence)             |
| qc.compliance_interview                     | needs a severe fact            | Compliance          | Questioned about the worst deed                  | truth / partial / lie                                                               | -   | done (consequence)             |
| qc.sample_size_cut                          | turn >= 4                      | Lan                 | Cut the sample to ship                           | full / reduced & noted / record full                                                | -   | done                           |
| qc.rework_no_retest                         | turn >= 6                      | Lan                 | Release reworked lot untested                    | retest / sample / release                                                           | -   | done                           |
| qc.mislabeled_sample                        | cd 16                          | Minh                | Labels swapped                                   | hold both / retest likelier / guess                                                 | E   | done                           |
| qc.spec_change_pressure                     | turn >= 10                     | Khoa, Tam           | Loosen the spec to pass                          | keep / deviation / quiet change                                                     | -   | done                           |
| qc.overtime_blame                           | stress >= 30                   | Khoa, Lan           | Production blames QC for defects                 | open records / summary / alter                                                      | E   | done                           |
| qc.new_supplier_trial                       | turn >= 8                      | Tam                 | Cheap supplier fast-track                        | qualify / limited trial / accept                                                    | B   | done                           |
| **Premiere and onboarding (weeks 1 to 12)** |                                |                     |                                                  |                                                                                     |     |                                |
| qc.first_day_walkthrough                    | week 1 to 2, beat              | Khoa, Minh          | Khoa shows you the lab and "the rule"            | ask questions / observe / pretend to know                                           | -   | planned                        |
| qc.first_signature                          | week 2 to 4                    | Khoa, Lan           | First batch under time pressure                  | wait for result / sign with note / sign                                             | -   | planned                        |
| qc.training_gap                             | weeks 3 to 10                  | Minh                | Minh was never trained on a method               | train him / pair / let him run                                                      | E   | planned                        |
| qc.lab_housekeeping                         | weeks 4 to 14                  | Minh                | Expired reagents in the fridge                   | discard & log / label / use                                                         | -   | planned                        |
| **Pre-Tet and Tet (Jan to Feb)**            |                                |                     |                                                  |                                                                                     |     |                                |
| qc.pre_tet_pile                             | weeks 3 to 6                   | Lan                 | Huge pre-Tet output, lab short-staffed           | ask help / prioritise by risk / skim                                                | -   | planned                        |
| qc.tet_bonus_pressure                       | weeks 5 to 8                   | Lan, Khoa           | Bonus depends on shipped volume                  | stay firm / negotiate release rules / go along                                      | -   | planned                        |
| **The Squeeze (Mar to Apr)**                |                                |                     |                                                  |                                                                                     |     |                                |
| qc.audit_notice_huddle                      | after buyer notice             | Khoa, Tam           | Team meeting on how to "look ready"              | real gap list / prioritise / cosmetic fix                                           | A   | planned                        |
| qc.ms_vy_visit                              | audit day (shared event)       | Vy, Khoa            | Ms Vy's spring visit                             | open books / guided tour / steer her                                                | A   | planned (extend audit_day)     |
| **Cheaper Steel (May to Oct)**              |                                |                     |                                                  |                                                                                     |     |                                |
| qc.steel_trial_results                      | after new_supplier_trial       | Tam, Hung           | Trial lot is borderline                          | reject / extend trial / pass                                                        | B   | planned                        |
| qc.steel_field_failure                      | needs fast_tracked_supplier    | Tam, Lan            | Field failure from the new steel                 | own & trace / share blame / blame supplier                                          | B   | planned (consequence)          |
| **The Hamper (Jun to Oct)**                 |                                |                     |                                                  |                                                                                     |     |                                |
| qc.hung_favour                              | after supplier_gift            | Hung                | Hung asks a "small" acceptance favour            | refuse / flag to Khoa / do it                                                       | D   | planned                        |
| qc.hung_money                               | needs accepted_supplier_gift   | Hung                | An envelope appears                              | refuse & report / refuse quietly / take it                                          | D   | planned                        |
| qc.hung_threat                              | after refusing late            | Hung                | He hints he knows about the gift                 | come clean / stonewall / pay him back                                               | D   | planned (consequence)          |
| **Mid-year (Jun to Jul)**                   |                                |                     |                                                  |                                                                                     |     |                                |
| qc.midyear_review                           | week 24 to 28, beat            | Khoa                | Khoa's review of your record so far              | accept feedback / defend / spin                                                     | -   | planned                        |
| qc.kpi_first_pass_yield                     | weeks 20 to 40                 | Khoa, Lan           | FPY KPI pressure to pass marginal lots           | flag the KPI flaw / report honestly / game the number                               | -   | planned                        |
| **Field complaint (Jul to Nov)**            |                                |                     |                                                  |                                                                                     |     |                                |
| qc.field_complaint_arrives                  | week 28 to 32, beat            | Lan, Khoa           | A European buyer reports rust spots              | open investigation / limited check / treat as one-off                               | C   | planned                        |
| qc.root_cause_dispute                       | after the complaint            | Lan, Tam            | Production blames material, purchasing blames QC | follow data / neutral review / pick a side                                          | C   | planned                        |
| qc.minh_mistake                             | weeks 28 to 40                 | Minh                | Minh misses a defect and begs you to hide it     | report with context / correct quietly and coach / cover                             | E   | planned                        |
| qc.minh_at_audit                            | autumn audit, arc E            | Minh, Vy            | Minh is asked directly by the auditor            | prepare him to tell the truth / leave him / script him                              | E   | planned (consequence)          |
| **Autumn audit and crisis (Oct to Nov)**    |                                |                     |                                                  |                                                                                     |     |                                |
| qc.ms_vy_returns                            | autumn audit, beat             | Vy, Khoa            | Ms Vy compares spring records to now             | full transparency / explain gaps / deflect                                          | A   | planned (consequence)          |
| qc.scapegoat_meeting                        | needs a severe fact, crisis    | Khoa, Lan           | Management looks for one person to blame         | present the record / share responsibility / point at Minh                           | -   | planned                        |
| qc.recall_press                             | recall decision outcome        | Khoa, buyer contact | Buyer demands a recall statement                 | accurate statement / hedged statement / minimise                                    | C   | planned                        |
| **Year-end finale (Dec)**                   |                                |                     |                                                  |                                                                                     |     |                                |
| qc.year_end_review                          | week 49 to 52, beat            | Khoa                | Annual review; promotion or not                  | honest self-assessment / modest / inflate                                           | -   | planned                        |
| qc.manager_offer                            | rare, good record + good rels  | Khoa                | Offered the QC manager seat with a condition     | accept on your terms / decline / accept the condition (leads to engine ending)      | -   | planned (needs ending)         |

Targets: 40 to 45 distinct QC scenes across the year, about 20 random incident scenes and about 20
beat/arc scenes, for about 55 to 65 decisions a run.

## 10. Open questions for the owner and for a practitioner reviewer

- Is a "promoted" ending wanted, and what should it require?
- Real QC practitioner: are the ladder steps realistic for a factory of this size and market?
- Names and places are invented; should the setting stay Binh Duong or stay neutral?
