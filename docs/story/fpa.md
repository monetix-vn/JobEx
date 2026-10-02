# Series bible: FP&A Analyst (ninth job; third of the five departments added on 2026-10-02)

Status: DRAFT v1 by AI (2026-10-02), asked for by the owner ("then FP&A"), written together with the
scenes. Not reviewed by the owner or a practitioner. Playable at `?role=fpa`. Same cookware company as
Finance and Accounting, but a different job: accounting records what happened, FP&A builds the budget and
the forecast and explains the numbers to the directors, the bank and the board. Tone:
`content/industry-cookware/events/README.md`. Format: `docs/AUTHORING.md`. Banking, covenant and audit
practices in the scenes are generic and simplified; they need review by a finance practitioner.

## 1. Premise

You build the budget and the rolling forecast for a cookware factory. Everybody wants the number to say
something: sales wants a low target it can beat, production wants a cushion, the General Director wants
twenty percent because he promised it, and the bank wants a ratio below three. You are the person
holding the spreadsheet in which all of those wishes have to become one honest set of numbers. The model
is only as honest as its last changed assumption, and the version history remembers who changed it.

## 2. What the player should feel

- A forecast is a range, and the range is the honest part; a single number is a negotiation.
- A target that everybody sandbags rewards sandbagging; a plug is a number with nothing under it.
- A covenant told early is a negotiation; told late it is a default.
- A chart is an argument, and a KPI definition changed quietly is a way to improve a number without improving the factory.
- The internal auditor reads the file history before the numbers.

## 3. The player's arc

1. Weeks 1 to 12: learn the model, its untouchable cell and the people who ask for numbers.
2. Weeks 13 to 26: the first variance to explain, the first error, the KPI definition.
3. Weeks 27 to 40: the bank covenant twist, reclassification and the end of the quarter.
4. Weeks 41 to 52: the budget season, the board pack, the audit review and the offer (or the fall).

## 4. Cast (Khang, Giang, Huy, Phat, Quoc are new; Duc, Hanh, Bao, Lan, Tam, Cuong, Khoa, Thu are shared)

| Character              | Role                                       | Wants                                | Arc                                                                  |
| ---------------------- | ------------------------------------------ | ------------------------------------ | -------------------------------------------------------------------- |
| Mr Khang (`char.khang`)| FP&A Manager, your boss                    | An honest model, no surprises        | Backs the straight account; offers you his seat                      |
| Ms Giang (`char.giang`)| Board representative of the owner family   | To understand the footnotes          | Reads what others skim; the person you cannot lie to twice           |
| Huy (`char.huy`)       | Sales planner                              | A good quarter, friendly numbers     | Finds your error; asks for early numbers; the one blamed if you are not careful |
| Mr Phat (`char.phat`)  | The company's bank relationship manager    | A forecast he can rely on            | Rewards early disclosure; reads your forecast against the accounts    |
| Mr Quoc (`char.quoc`)  | Internal auditor                           | A clean trail                        | Reads the file history first                                         |
| Mr Duc, Ms Hanh, Thu   | Finance director, chief accountant, AP     | The ratio, true classification       | Ask for the reclassification; sign, or do not                        |
| Mr Cuong, Mr Bao, Ms Lan | General Director, Sales, Production      | Twenty percent; low target; cushion  | Each wants the model to say what they have already promised          |

## 5. Season timeline

| Month      | Beat / storyline                                                                         |
| ---------- | ---------------------------------------------------------------------------------------- |
| Jan to Feb | Premiere `fpa.first_week`; the untouchable cell; the first variance commentary            |
| Mar to Jun | The KPI Pack can start; errors, forecasts, commission baseline, costing                   |
| Jun to Jul | `fpa.midyear_review`, then the twist `fpa.bank_covenant_twist` (the covenant at risk)     |
| Aug to Oct | The Covenant (reclassification, quarter-end timing, the bank asks); The Budget kickoff    |
| Oct to Nov | `fpa.audit_review` beat; the internal auditor asks if earned; The Budget (cut, board pack) |
| Nov to Dec | `fpa.board_blame` if earned; `fpa.year_end_review`, `fpa.manager_offer`                    |

## 6. Storylines

- **The Budget:** `budget_kickoff` -> `sandbagged_targets` -> `directors_cut` -> `board_pack_plug`. Facts: `pre_agreed_budget_deals`, `documented_budget_assumptions`, `accepted_sandbagged_targets`, `plugged_the_board_pack`, `misled_the_board`.
- **The Covenant:** `bank_covenant_twist` -> `reclassify_ask` -> `quarter_end_timing` -> `phat_asks`. Facts: `disclosed_covenant_risk_early`, `sweetened_forecast`, `reclassified_costs_to_meet_covenant`, `moved_invoices_across_quarter_end`, `misled_the_bank`.
- **The KPI Pack:** `kpi_definition` -> `cherry_picked_chart` -> `kpi_challenge`. Facts: `published_kpi_with_method`, `redefined_kpi_to_look_better`, `cherry_picked_chart`.
- **Incidents:** `variance_explain`, `excel_error`, `rolling_forecast_sweeten`, `roi_pet_project`, `commission_baseline`, `early_board_numbers`, `capex_split`, `cost_allocation`. Consequences: `audit_asks`, `board_blame`.

## 7. Dark-side ladder

A variance written up as 'timing and other' -> an optimistic footnote 'per sales' -> a chart that starts
in March -> a quietly redefined KPI -> a commission baseline reset for a friend -> an overhead allocation
that differs by product -> an investment case with untested optimism -> a purchase split under the
limit -> a forecast steered below a ratio -> a plug line in the board pack -> invoices moved across the
quarter end -> costs reclassified for a covenant -> model versions deleted before an audit -> a
colleague's name behind a number they never confirmed -> a forecast to a lender with the downside left out.

## 8. Endings

Completed, burnout, fired, prosecuted (engine); promoted to FP&A manager (`fpa.manager_offer`); walked
away (`fpa.resignation_thought`, or declining the promotion).

## 9. Not yet written

More incidents (a currency hedge decision, a bonus accrual that moves the number, a lease reclassification,
a second-year view). 27 scenes today, about 38 decisions a year.

## 10. Open questions

- Practitioner review: are the covenant, reclassification and cut-off practices believable?
- Should the budget versus actual table be a visible panel (proposed in `docs/story/JOB-PROPOSALS.md`)? Not built.
