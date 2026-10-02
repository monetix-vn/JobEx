# Series bible: Production Line Supervisor (eighth job; second of the five departments added on 2026-10-02)

Status: DRAFT v1 by AI (2026-10-02), asked for by the owner ("after HR, add production"), written together
with the scenes. Not reviewed by the owner or a practitioner. Playable at `?role=sup`. Same cookware
factory as the Production Planner (`docs/story/production.md`), seen from the floor instead of the office:
you supervise **Line 3** (Kiet supervises Line 2). The role is in department `dept.production`, so the job
picker shows it under Production beside the planner. Tone: `content/industry-cookware/events/README.md`.
Format: `docs/AUTHORING.md`. Safety and labour details are generic and approximate; they need review by a
practitioner who knows factory safety practice.

## 1. Premise

You supervise twenty people on two shifts. The directors see an output number; you see a press that runs
hot, a crew that is tired and a guard bracket that is a little loose. Everyone above you wants the number
and nobody above you will own what it costs on the floor. The planner writes the schedule, maintenance
fixes what it can, safety writes the report, and you are the person standing next to the machine when the
three disagree.

## 2. What the player should feel

- A target is a promise made in a meeting that the floor has to keep with its hands.
- A rating is the speed at which a guard can still do its job; above it, you are borrowing from the crew.
- An injury record is the one number that tells the truth, and the one everyone wants to be zero.
- A crew watches how you treat the weakest of them (late, sick, hurt) and decides what to tell you.
- The informal leader of the crew (Hoa) is not your enemy; she is the way you learn what is real.

## 3. The player's arc

1. Weeks 1 to 12: learn the presses, the crew and the rules; the first target and the first favour.
2. Weeks 13 to 26: the hand in the press, the roster, heat and breakdowns.
3. Weeks 27 to 40: the rush order twist; the speed-up and the count; training and handover shortcuts.
4. Weeks 41 to 52: the safety inspection, the recount, the review and the offer (or the fall).

## 4. Cast (Hoa, Nam, Binh, Tai are new; Lan, Kiet, Mai, Khoa, Bao, Sang, Phuc are shared)

| Character             | Role                                     | Wants                              | Arc                                                             |
| --------------------- | ---------------------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| Ms Lan (`char.lan`)   | Production Manager, your boss            | The number; no surprises           | Backs the honest account; offers you the assistant manager seat |
| Ms Hoa (`char.hoa`)   | Senior operator, informal crew leader    | A supervisor who asks              | Tells you what is real; her trust is the line's temperature     |
| Nam (`char.nam`)      | Young press operator                     | To prove himself, to keep his pay  | The hand; the return to work                                    |
| Mr Binh (`char.binh`) | Safety officer                           | An honest record                   | Photographs the press; investigates; reads the log               |
| Tai (`char.tai`)      | Skilled operator, attendance problems    | To keep the job and his daughter   | Late again; scrap in a bag; the test of your fairness           |
| Mr Kiet, Ms Mai       | Line 2 supervisor, maintenance lead      | Clean handovers, time to repair    | Peer and ally; the leak and the noise                           |
| Mr Khoa, Mr Bao, Mr Sang | QC, Sales, Labour inspector           | A true count, an order, a record   | Recount, rush order, inspection                                 |

## 5. Season timeline

| Month      | Beat / storyline                                                                           |
| ---------- | ------------------------------------------------------------------------------------------ |
| Jan to Feb | Premiere `sup.first_week`; the presses and the crew; first handover gaps                    |
| Mar to Jun | The Target, The Hand and The Roster can start; heat, breakdowns, QC holds                   |
| Jun to Jul | `sup.midyear_review`, then the twist `sup.rush_order_twist`                                 |
| Aug to Oct | Training sign-offs, the speed-up, the count, the VIP visit, the blocked exit               |
| Oct to Nov | `sup.safety_inspection` beat; Sang asks about the injury if earned                          |
| Nov to Dec | `sup.blame_meeting` if earned; `sup.year_end_review`, `sup.manager_offer`                   |

## 6. Storylines

- **The Target:** `target_raised` -> `run_it_faster` -> `end_of_shift_count` -> `qc_recount`. Facts: `promised_impossible_target`, `refused_unsafe_speed`, `ran_above_rated_speed`, `reported_true_count`, `inflated_output_count`.
- **The Hand:** `hand_caught` -> `how_to_record` -> `binh_investigates` -> `nam_returns`. Facts: `delayed_medical_care`, `reported_injury_honestly`, `blamed_injured_worker`, `hid_injury`, `forced_early_return`.
- **The Roster:** `tai_late` -> `favourite_overtime` -> `break_dispute`. Facts: `docked_pay_unfairly`, `edited_attendance_sheet`, `posted_fair_rota`, `favoured_friends_overtime`, `negotiated_break_fairly`, `broke_a_promise_to_crew`.
- **Incidents:** `heat_day`, `breakdown_pressure`, `qc_hold_rework`, `training_signoff`, `handover_gap`, `vip_visit`, `exit_blocked`, `scrap_theft`. Consequences: `sang_asks_injury`, `blame_meeting`.

## 7. Dark-side ladder

A handover note skipped -> a visitor without a helmet -> a pause check left off the report -> a
count rounded up -> the attendance sheet edited for a friend -> a fire exit blocked -> a training
signature on a sheet nobody attended -> a press run past a known fault -> an injured worker put back on
the machine -> a lost-time injury recorded as first aid -> the injured worker blamed in writing.

## 8. Endings

Completed, burnout, fired, prosecuted (engine); promoted to assistant production manager
(`sup.manager_offer`); walked away (`sup.resignation_thought`, or declining the promotion).

## 9. Not yet written

More incidents (a night-shift drunk operator, a union petition, a machine guarding upgrade budget, a
second-year view). 29 scenes today, about 35 decisions a year.

## 10. Open questions

- Practitioner review: are the injury recording, speed rating and training sign-off practices believable?
- Should output and the injury streak be visible meters (the job's defining pressures)? Not built.
