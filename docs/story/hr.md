# Series bible: HR Business Partner (seventh job; first of the five departments added on 2026-10-02)

Status: DRAFT v1 by AI (2026-10-02), asked for by the owner ("add all ... start with HR. add HRBP"), written
together with the scenes. Not reviewed by the owner or a practitioner. Playable at `?role=hr`. Same company
as the cookware jobs (HR sits in the factory's head office). Tone: `content/industry-cookware/events/README.md`.
Format: `docs/AUTHORING.md`. The labour-law details in the scenes (two fixed-term contracts in a row,
notice and severance, overtime cap, protection of pregnant employees, minimum working age) are generic and
approximate, and need review by a practitioner who knows the current law. Nothing here is legal advice.

## 1. Premise

You are the HR business partner to sales, quality and the floor of a cookware factory. Managers come to
you with decisions already made: the hire they want, the person they want gone, the record they want to
look better. Your KPIs are speed (time to hire, cases closed); your real work is deciding when to slow a
manager down. Every rule in HR (a fair process, a written reason, a notice period) exists because
somebody once got hurt without it, and every rule can be bent by a person who is under pressure.

## 2. What the player should feel

- A process is fairness you can show to a stranger; a promise made before the process is theatre.
- A confidential complaint is a trust you are holding for someone with less power than you.
- Cutting people is a decision with names; the criteria you write are what you will have to defend.
- Records are only worth anything if they are true on the day they were made.
- The junior colleague who keeps copies is not your enemy; they are your memory.

## 3. The player's arc

1. Weeks 1 to 12: learn the files, the policies and the people who will ask for exceptions.
2. Weeks 13 to 26: the first favour (the owner's nephew), the first complaint, the first contract trick.
3. Weeks 27 to 40: the cost cut and the list; the complaint's decision; overtime and insurance pressure.
4. Weeks 41 to 52: the labour inspection, the Tet bonus, the review and the offer (or the fall).

## 4. Cast (Oanh, Cuong, Loan, Vinh, Ngoc, Tuan are new; Lan, Bao, Duc, Long, Kiet, Khoa, Sang are shared)

| Character               | Role                              | Wants                             | Arc                                                                  |
| ----------------------- | --------------------------------- | --------------------------------- | -------------------------------------------------------------------- |
| Ms Oanh (`char.oanh`)   | HR Manager, your boss             | A clean file; a protected company | Backs the straight account; offers you her seat                      |
| Mr Cuong (`char.cuong`) | General Director                  | Cost down, no noise               | The list, the survey, the Tet bonus; wants the quick version         |
| Loan (`char.loan`)      | Payroll and HR administrator      | Complete, true files              | Keeps copies and a notebook; the person you are better off listening to |
| Mr Vinh (`char.vinh`)   | Export sales team lead, top seller| Cover for his habits              | The accused in The Complaint                                         |
| Ngoc (`char.ngoc`)      | Sales coordinator                 | To be heard and safe              | The complainant; what happens to her is the measure of HR            |
| Mr Tuan (`char.tuan`)   | Candidate, a friend of Long       | The job                           | The chosen one; the fallout months later                             |
| Mr Long, Mr Bao, Ms Lan, Mr Duc, Mr Kiet, Mr Khoa, Mr Sang | Shared | Hires, bonuses, records       | Each asks HR to bend a rule for a reason that sounds sensible        |

## 5. Season timeline

| Month      | Beat / storyline                                                                       |
| ---------- | -------------------------------------------------------------------------------------- |
| Jan to Feb | Premiere `hr.first_week`; the personnel files; first manager requests                   |
| Mar to Jun | The Chosen One and The Complaint can start; contracts, overtime, probation              |
| Jun to Jul | `hr.midyear_review`, then the twist `hr.cost_cut_twist` (headcount down ten percent)    |
| Aug to Oct | The List (names, notice day, survivors); insurance; the underage applicant; the survey  |
| Oct to Nov | `hr.labour_inspection` beat; Sang asks about contracts and records if earned            |
| Nov to Dec | `hr.tet_bonus`; `hr.blame_meeting` if earned; `hr.year_end_review`, `hr.manager_offer`  |

## 6. Storylines

- **The Chosen One:** `long_asks_favour` -> `shortlist_pressure` -> `salary_exception` -> `tuan_fallout`. Facts: `documented_conflict_of_interest`, `promised_hire_to_owner_nephew`, `ran_fair_process`, `rigged_shortlist`, `paid_above_band_secretly`.
- **The Complaint:** `ngoc_comes` -> `vinh_responds` -> `decision_meeting` -> `ngoc_after`. A buried complaint skips straight to the aftermath. Facts: `buried_complaint`, `investigated_fairly`, `leaked_complainant_name`, `retaliated_against_complainant`, `backdated_warning`.
- **The List:** `cost_cut_twist` -> `the_names` -> `notice_day` -> `survivors`. Facts: `fair_selection_documented`, `targeted_complainer_for_layoff`, `legal_severance_paid`, `skipped_legal_notice`.
- **Incidents:** `contract_chain`, `overtime_records_ask`, `insurance_base`, `salary_leak`, `probation_pregnant`, `young_applicant`, `engagement_survey`, `tet_bonus`, `reference_call`. Consequences: `sang_asks_contracts`, `blame_meeting`.

## 7. Dark-side ladder

A reference that says more than the facts -> a bonus handed out without a formula -> a survey run
in front of managers -> a hidden pay allowance -> a record backdated for an inspector -> contracts
chained with gaps -> overtime sheets edited to the cap -> insurance declared on a lower base -> a
complaint buried -> the complainant named to the accused -> a warning dated before the complaint -> a
layoff list built from the inconvenient -> a pregnancy ended with another reason on the letter -> a
child hired on a borrowed card.

## 8. Endings

Completed, burnout, fired, prosecuted (engine); promoted to head of HR (`hr.manager_offer`); walked away
(`hr.resignation_thought`, or declining the promotion).

## 9. Not yet written

More incidents (a harassment training that exists only on paper, a union petition scene, a disability
accommodation, a payroll error that favours the player, a second-year view). 29 scenes today, about 32
decisions a year (the lightest of the jobs: more scenes would help).

## 10. Open questions

- Practitioner review: are the notice, severance and contract rules and the complaint procedure believable?
- Should open cases be a visible list (the case list proposed in `docs/story/JOB-PROPOSALS.md`)? Not built.
