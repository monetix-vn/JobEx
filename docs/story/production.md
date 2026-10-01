# Series bible: Production Planner (fourth job)

Status: DRAFT v1 by AI (2026-10-01); the job is built and playable (`?role=prod`), 31 scenes. The owner asked for
autonomous work and has not reviewed it. Not reviewed by a practitioner. Tone: `content/industry-cookware/events/README.md`.
Format: `docs/AUTHORING.md`. Reference for detail: `docs/story/qc.md`, `docs/story/finance.md`.
Nothing here is legal advice; overtime limits and safety rules are fictional and generic.

## 1. Premise

You plan production for the same cookware factory: four lines, about two hundred workers, and a
weekly schedule that everyone else treats as negotiable. Sales promises dates, purchasing brings
steel when it brings steel, QC holds lots, maintenance wants downtime, and the people on the floor
want to go home at five. Your schedule is where every department's wishes become one set of shifts.

## 2. What the player should feel

- A schedule is a negotiation with physics and with people: capacity is finite, workers are not machines.
- Every promise from sales lands on your plan, and the cost appears as overtime, skipped maintenance or a shortcut.
- A shortcut that saves a day often costs a month: deferred maintenance, bypassed guards, unrecorded hours.
- The safest person to blame is the one furthest from the office: the operator.
- Being straight about what cannot be done is a skill, and it is lonely until it saves someone.

## 3. The player's arc

1. **Weeks 1 to 12, learning the floor.** Meet Lan, Kiet and Mai, learn the lines, the first crunch. Choices feel like logistics.
2. **Weeks 13 to 26, the first favour to sales.** An impossible date, extra shifts, a guard left off "just for today". It works.
3. **Weeks 27 to 40, the bill.** Breakdowns, near-misses, a labour inspection, people who stop believing your schedule.
4. **Weeks 41 to 52, what you kept and what you cut.** Year-end peak, Tet planning, the review, and a possible promotion.

## 4. Cast (create as `char.*`; Lan, Khoa, Tam, Bao and Hanh already exist)

| Character                | Title / dept             | Wants                              | Fears                         | Tic                               | Relationship arc                                                        |
| ------------------------ | ------------------------ | ---------------------------------- | ----------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| Ms Lan (`char.lan`)      | Production Manager, boss | Shipments out, no accidents        | A line down; being blamed     | Friendly until a deadline         | Your boss here; backs you if your plan is honest, squeezes you if not   |
| Kiet (`char.kiet`)       | Line 2 supervisor        | A plan his crew can actually do    | Injury on his line            | Says "with respect" before no     | Ally or opponent depending on whether your schedules are realistic      |
| Mai (`char.mai`)         | Maintenance lead         | Planned downtime, spare parts      | A breakdown she warned about  | Keeps a logbook of every request  | Keeps the record; becomes the witness of what you deferred              |
| Phuc (`char.phuc`)       | New press operator       | To learn, to keep the job          | Being blamed for a mistake    | Never asks for help               | The floor's viewpoint; what you assign to him comes back to him         |
| Mr Bao (`char.bao`)      | Sales Manager            | Dates that win orders              | Losing the buyer              | Charming, then a sudden deadline  | Source of the impossible promises                                       |
| Mr Tam (`char.tam`)      | Purchasing Manager       | Lower material cost                | Missing savings targets       | Jokes about "flexibility"         | Brings cheap material late; blames the schedule                         |
| Mr Sang (`char.sang`)    | Labour safety inspector  | To find unsafe practice            | Being shown a clean show only | Looks at the floor, not the file  | Visits once; reads the floor and the overtime records                   |
| Mr Khoa (`char.khoa`)    | QC Manager               | Lots held when they should be      | Pressure to release           | "Write it down"                   | Holds and releases lots; conflicts with your dates                      |

## 5. Season timeline

| Month     | Reality                                    | Beat / storyline                                                          |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------- |
| Jan       | Pre-Tet peak, everyone wants everything    | **Premiere:** first week on the floor; the pre-Tet crunch                 |
| Feb       | Tet shutdown, restart, people do not return| Staffing gap; **Arc A "The Promise"** can start from a sales request      |
| Mar to Apr| Buyer audit window, spring orders          | Material shortage arc (Tam); audit readiness                              |
| May to Jun| Summer heat, maintenance window            | **Arc B "The Deferred Maintenance"** starts (Mai's request)               |
| Jul       | Mid-year review, peak orders               | Midyear review; **twist:** a major breakdown or a rush order from Bao     |
| Aug to Sep| Heat, fatigue, overtime accumulates        | **Arc C "Phuc"**: the new operator; near-miss                             |
| Oct       | Labour inspection                          | Mr Sang visits; overtime and guard records                                |
| Nov       | Year-end peak                              | **Crisis:** who bypassed what; blame                                      |
| Dec       | Maintenance shutdown, Tet planning, review | **Finale:** review with Lan; what the year left on your plan              |

## 6. Storylines

- **Arc A, The Promise:** `event.prod.impossible_date` (Bao's date) -> overtime beyond the plan -> `guard_off_today` (a safety guard removed to go faster) -> `near_miss`. Facts: `planned_unrealistic_shifts`, `exceeded_overtime_limit`, `bypassed_guard`.
- **Arc B, The Deferred Maintenance:** Mai's request -> deferral under pressure -> breakdown. Facts: `deferred_maintenance`, `falsified_maintenance_log`.
- **Arc C, Phuc:** training request -> assigned unsupervised -> near-miss or injury -> how you describe it. Facts: `assigned_untrained_operator`, `blamed_operator`, `edited_incident_report`.
- **Arc D, Materials:** late steel -> schedule reshuffle -> hiding the stock-out from sales. Facts: `hid_stockout`.

## 7. Dark-side ladder

1. Padding a schedule with optimistic times (`padded_capacity_estimate`, sev 2).
2. Promising sales a date without checking the line (`planned_unrealistic_shifts`, 4).
3. Deferring planned maintenance to hit a date (`deferred_maintenance`, 5).
4. Exceeding the overtime limit and not recording it (`exceeded_overtime_limit`, 6).
5. Assigning an untrained person to a dangerous machine (`assigned_untrained_operator`, 6).
6. Leaving a safety guard off to go faster (`bypassed_guard`, 7).
7. Forging a maintenance or safety record (`falsified_maintenance_log`, `forged_safety_checklist`, 7 to 8).
8. Blaming an operator for an accident the plan caused (`blamed_operator`, `edited_incident_report`, 7 to 9).

## 8. Endings

Completed, burnout, fired, prosecuted (engine), promoted to Production Manager (`prod.manager_offer`),
walked away (`prod.resignation_thought`).

## 9. Episode list (status: imported unless noted)

| Id                          | Timing / trigger                  | Cast              | Situation                                          | c1 / c2 / c3                                         | Arc |
| --------------------------- | --------------------------------- | ----------------- | -------------------------------------------------- | ---------------------------------------------------- | --- |
| prod.first_week             | beat, weeks 1 to 3                | Lan, Kiet         | First walk on the floor, the week's plan           | ask the floor / follow the plan / assume             | -   |
| prod.pre_tet_crunch         | weeks 3 to 8                      | Lan, Bao          | Double volume before Tet                           | honest plan / prioritise / promise all               | -   |
| prod.tet_restart            | weeks 6 to 10                     | Lan, Kiet         | Half the crew has not returned                     | re-plan / hire temps properly / run short-handed     | -   |
| prod.impossible_date        | weeks 10 to 40                    | Bao, Lan          | Bao sold a date the lines cannot make              | say no with data / split the order / agree           | A   |
| prod.extra_shifts           | arc stage                         | Kiet, Lan         | Extra shifts to catch up                           | within limits / rotate crews / exceed quietly        | A   |
| prod.guard_off_today        | arc stage                         | Kiet              | A guard slows the press; "just today"              | refuse / slow the line / remove it                   | A   |
| prod.near_miss              | arc stage                         | Kiet, Phuc        | A close call at the press                          | stop and report / report quietly / keep running      | A   |
| prod.material_late          | weeks 12 to 44                    | Tam               | Steel arrives three days late                      | re-plan openly / partial run / hide from sales       | D   |
| prod.stockout_cover         | arc stage                         | Bao, Tam          | Sales asks about a shipment that cannot run        | tell the truth / tell with a plan / say it is fine   | D   |
| prod.maintenance_request    | weeks 14 to 30                    | Mai               | Mai asks for a planned oven shutdown               | schedule it / split it / defer                       | B   |
| prod.maintenance_defer      | arc stage                         | Mai, Lan          | Lan wants it pushed past the peak                  | hold / agree a date / defer                          | B   |
| prod.breakdown              | arc stage                         | Mai, Lan          | The oven fails in peak week                        | own it / share / blame maintenance                   | B   |
| prod.phuc_training          | weeks 3 to 16                     | Phuc              | New operator asks for press training               | train / pair / assign                                | C   |
| prod.phuc_unsupervised      | arc stage                         | Phuc, Kiet        | Short-handed: Phuc alone at the press              | refuse / supervise / assign                          | C   |
| prod.phuc_incident          | arc stage                         | Phuc, Lan         | Phuc is hurt; the report is yours to write         | accurate report / limited / blame Phuc               | C   |
| prod.heat_fatigue           | weeks 26 to 36                    | Kiet              | Summer heat, errors rising                         | adjust shifts / water and breaks / push on           | -   |
| prod.changeover_shortcut    | weeks 8 to 44                     | Kiet              | Skip a changeover check to save an hour            | do the check / partial / skip                        | -   |
| prod.qc_hold_conflict       | weeks 10 to 44                    | Khoa, Lan         | QC holds a lot you need                            | support the hold / negotiate retest / pressure QC    | -   |
| prod.overtime_log           | weeks 16 to 44                    | Kiet              | Records do not match hours worked                  | correct records / explain / edit                     | -   |
| prod.union_question         | weeks 20 to 40                    | Kiet              | Workers ask about overtime pay                     | answer honestly / defer to HR / dismiss              | -   |
| prod.sang_inspection        | beat, weeks 41 to 44              | Sang, Lan         | Labour inspector visits                            | show the real floor / tidy honestly / stage it       | -   |
| prod.sang_asks_records      | needs a bypass or forged record   | Sang              | Inspector asks for the records of a fact you made  | truth / partial / produce a record                   | -   |
| prod.midyear_review         | beat, weeks 24 to 28              | Lan               | Review of your plan accuracy                       | accept / data / spin                                 | -   |
| prod.big_breakdown_twist    | beat, weeks 29 to 32              | Mai, Lan, Bao     | Line 1 goes down during a rush order               | honest re-plan / partial / hide                      | -   |
| prod.year_end_peak          | weeks 44 to 50                    | Lan, Bao          | Year-end volume, all the lines at once             | plan within limits / stretch / break limits          | -   |
| prod.scapegoat_meeting      | needs a serious fact              | Lan, Mai          | Who bypassed what                                  | the record / share / blame the operator              | -   |
| prod.year_end_review        | beat, weeks 49 to 50              | Lan               | Annual review                                      | honest / modest / polished                           | -   |
| prod.manager_offer          | beat, weeks 51 to 52              | Lan               | Offered the manager seat with a condition          | accept on terms / decline / accept blindly           | -   |
| prod.resignation_thought    | stress 75+                        | Kiet              | You look exhausted                                 | ask for relief / resign / keep going                 | -   |

Target: about 38 scenes. Fill with more random incidents (shortage of a tool, a worker's family emergency,
an unapproved subcontractor, a new machine trial, a supplier visit to the line, a night-shift quarrel).

## 10. Role definition

`role.prod.planner` (department `dept.production`, level 1, reports to `role.prod.manager`): weekly
tasks `task.schedule_orders`, `task.material_check`, `task.line_changeover`; KPIs `kpi.on_time_delivery`
and `kpi.line_utilisation`; skills planning, analysis, backbone; start salary about 15 million VND;
`overhead_hours` tuned by balance runs; `events_per_week` default.

## 11. Open questions

- Should capacity be a visible mini-mechanic (a weekly board of hours against orders)? Not built.
- Practitioner review: are overtime, guard and maintenance practices realistic for a Vietnamese factory?

Planned rows not yet written as scenes: none.
Balance numbers: `docs/BALANCE.md`.
