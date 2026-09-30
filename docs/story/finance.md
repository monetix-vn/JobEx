# Series bible: Finance and Accounting Specialist (third job)

Status: DRAFT v1 by AI (full detail). The owner answered the open questions on 2026-09-30 (see section 11) and asked to continue; treat the bible as approved in principle and confirm the episode list as scenes are written. Not reviewed by a practitioner.
Scenes follow `docs/AI-GUIDE.md`. Tone rules: `content/industry-cookware/events/README.md`. Format:
`docs/AUTHORING.md`. Reference for level of detail: `docs/story/qc.md`.

Engine status: the role file `role.fin.accountant` exists in the pack with its month-end close steps
(`bank_rec`, `ar_aging`, `accruals`, `cutoff`) but has no blurb, so it is not yet offered in the job
picker. Add the blurb once the first scenes exist.

## 1. Premise

You are the new accountant at the cookware exporter, handling receivables, invoicing checks and the
month-end close. Every other department's shortcut eventually arrives at your desk as a number: an
invoice dated a few days early, a forecast that does not match the contract, an expense with no
receipt. Your job is to make the books true. The people who send you numbers would often prefer that
you make them convenient.

## 2. What the player should feel

- The books are where every department's small lie ends up, and you are the last control.
- The month-end close creates hard deadlines and social pressure to "make it balance".
- Small adjustments are how large misstatements begin; each one is easy to explain alone.
- An auditor will ask who knew, and "I was told to" is not a defence.
- You can do right and still be unpopular; accuracy pays on a slower clock than sales does.

## 3. The player's arc

1. **Weeks 1 to 12, learning the close.** Quarter-end mechanics, first small requests. Choices feel like admin.
2. **Weeks 13 to 26, the first favour.** A respected colleague asks for something "just this once". It works.
3. **Weeks 27 to 40, the favours compound.** The same people now expect it; one adjustment needs another to hide it.
4. **Weeks 41 to 52, the audit.** Fieldwork reads your year back to you; year-end close and the review.

## 4. Cast (create as `char.*` after approval)

| Character                 | Title / dept            | Wants                                | Fears                         | Tic                                | Relationship arc                                                                          |
| ------------------------- | ----------------------- | ------------------------------------ | ----------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| Ms Hanh (`chief_acct`)    | Chief Accountant, boss  | A clean close, no audit findings     | A qualified audit opinion     | Checks the trial balance twice     | Mentor who lets you carry the blame if your work is sloppy; protects you if you document  |
| Mr Duc (`finance_lead`)   | Finance Director        | Cash in, bank covenants met          | The bank reviewing numbers    | Talks about "the bigger picture"   | Above Hanh; sets targets that quietly invite adjustments                                  |
| Thu (`ap_clerk`)          | Accounts payable clerk  | To be shown how, and to be safe      | Being blamed for a typo       | Keeps a private notebook of errors | The junior you teach or use; keeps evidence when she is scapegoated                       |
| Mr Bao (`sales_manager`)  | Sales Manager           | Revenue in this quarter              | Missing his quota             | Charming, then sudden deadlines    | Friction to pressure; pushes cut-off games every quarter-end                              |
| Mr Long (`owner_relative`)| Owner's nephew, admin   | Personal costs booked as business    | Being questioned              | "It is family money"               | Wildcard above the rules; tests whether rules apply to everyone                           |
| Ms Vy (`auditor`)         | External auditor        | To find gaps, honestly               | Being lied to                 | Reads the dates, not the claims    | Shared with QC (appears in spring interim and autumn fieldwork); the season's referee     |

Minor: Ms Petra (buyer's accounts payable contact), a bank relationship manager.

## 5. Season timeline (by month)

| Month | Business reality                                   | Beat / storyline                                                                 |
| ----- | -------------------------------------------------- | -------------------------------------------------------------------------------- |
| Jan   | Year-end follow-ups, Tet bonuses, short close      | **Premiere:** first close under time pressure; meet Hanh, Duc, Thu               |
| Feb   | Tet break, backlog, annual statements finalised    | Missing documents from before the break; accrual estimates                       |
| Mar   | Quarter close, VAT/tax filing                      | **Arc A "The Cut-off"** starts: Bao wants a shipment booked early                |
| Apr   | Audit interim (spring)                             | Ms Vy's first visit; samples and confirmations                                   |
| May   | Calm-ish, budget prep                              | **Arc B "The Receipt Problem"** starts (Long's expenses)                         |
| Jun   | Half-year close, bank covenant check               | Duc's targets; reserve and accrual pressure (**Arc C "The Cookie Jar"** begins)  |
| Jul   | Peak orders, collections push                      | **Midseason twist:** a large buyer disputes an invoice you were told to adjust   |
| Aug   | Overdue receivables                                | Hiding vs. reserving an overdue balance                                          |
| Sep   | Quarter close, budget approval                     | Arc A peaks: cut-off again, bigger; Thu's first real mistake                     |
| Oct   | Audit fieldwork (autumn)                           | Ms Vy returns: what did spring leave behind?                                     |
| Nov   | Audit findings, management letter                  | **Crisis:** who adjusted what; scapegoat meeting                                 |
| Dec   | Year-end close, bonus calculation, review          | **Finale:** review with Hanh; ending from facts, relationships and records       |

## 6. Storylines (arcs)

- **Arc A, The Cut-off** (Mar, Jun, Sep, Dec quarter-ends): Bao asks to book shipments early -> "just the paperwork, goods ship Monday" -> bigger request next quarter -> an auditor cut-off test. Facts: `booked_revenue_early`, `backdated_invoice_entry`, `cutoff_breach`.
- **Arc B, The Receipt Problem** (May to Oct): Long's expenses without receipts -> personal items -> a family event booked as "client entertainment" -> the auditor asks for receipts. Facts: `booked_personal_expense`, `created_support_document`.
- **Arc C, The Cookie Jar** (Jun to Dec): pressure to smooth profit with accruals -> an "excess" reserve made in a good month -> released in a bad month -> the auditor sees the pattern. Facts: `padded_reserve`, `released_reserve_to_hit_target`.
- **Arc D, Thu** (Sep to Dec): her mistake -> how you handle it -> her notebook -> at the audit she has a record of who told whom.
- **Shared arc, The Squeeze** (Mar to Apr, with QC and Sales): buyer audit notice -> audit day.

## 7. Dark-side ladder (smallest to largest)

1. Accept a missing receipt "just this once" (`accepted_missing_receipt`, sev 2).
2. Round an accrual the convenient way (`rounded_accrual`, 2).
3. Book revenue a few days early at quarter-end (`booked_revenue_early`, 3).
4. Ignore a known duplicate or error that favours the company (`ignored_known_error`, 3).
5. Book a personal expense as business (`booked_personal_expense`, 4).
6. Hide an overdue balance by moving it (`hid_overdue_balance`, 4).
7. Pad and release a reserve to hit a target (`padded_reserve`, `released_reserve_to_hit_target`, 4 to 5).
8. Create or alter supporting documents, or falsify a reconciliation (`created_support_document`, 5).

## 8. Endings

Completed with pride (clean close), completed with secrets (promoted on a pile of private facts),
burnout, fired (caught at the audit or scapegoated), prosecuted (falsified documents traced). The
engine endings exist (fired, prosecuted, burnout, completed); the "promoted to chief accountant" and
"walked away" endings are planned (TECH checklist R1).

## 9. Episode list

Status values: `planned`, `draft`, `imported`, `reviewed`. All rows are `planned` until the bible is
approved. Choices are c1 by the book / c2 legitimate compromise / c3 shortcut.

| Id                                           | Timing / trigger                 | Cast               | Situation                                             | c1 / c2 / c3 in a few words                                               | Arc | Status  |
| -------------------------------------------- | -------------------------------- | ------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------- | --- | ------- |
| **Premiere and onboarding (weeks 1 to 12)**  |                                  |                    |                                                       |                                                                           |     |         |
| fin.first_close                              | week 1 to 3, beat                | Hanh, Thu          | First month-end close; Hanh explains the checklist    | ask to learn the steps / follow the list / skip to the numbers            | -   | planned |
| fin.first_adjustment                         | weeks 3 to 10                    | Hanh               | A small journal entry needs a reason on file          | write the reason / ask Hanh / leave blank                                 | -   | planned |
| fin.thu_training                             | weeks 4 to 12                    | Thu                | Thu was never shown the approval rules                | teach her / pair / let her guess                                          | D   | planned |
| fin.bank_rec_gap                             | weeks 5 to 14                    | Hanh               | A reconciling item you cannot explain                 | investigate / flag with a note / write it off                             | -   | planned |
| **Tet and early year (Jan to Feb)**          |                                  |                    |                                                       |                                                                           |     |         |
| fin.tet_bonus_calc                           | weeks 3 to 7                     | Duc, Hanh          | Bonus accrual estimate under pressure                 | compute fully / estimate with range / use the number Duc wants            | C   | planned |
| fin.missing_documents                        | weeks 6 to 12                    | Bao, Thu           | Invoices without delivery proof                       | hold / request proof / accept                                             | -   | planned |
| **The Cut-off (quarter ends)**               |                                  |                    |                                                       |                                                                           |     |         |
| fin.quarter_close_push                       | weeks 11 to 13                   | Bao, Hanh          | Bao wants a Friday shipment booked this quarter       | refuse / book on shipping date / book early                               | A   | planned |
| fin.cutoff_followup                          | after a booking decision         | Hanh               | Hanh asks what happened to that order                 | explain / document / deflect                                              | A   | planned  |
| fin.quarter_close_push_2                     | weeks 24 to 26                   | Bao, Duc           | Bigger shipment, half-year target                     | refuse / split / book early                                               | A   | planned |
| fin.cutoff_test_prep                         | weeks 38 to 40                   | Hanh, Vy           | Auditor will test cut-off                             | correct entries / disclose / patch                                        | A   | planned |
| **The Squeeze (shared)**                     |                                  |                    |                                                       |                                                                           |     |         |
| fin.audit_notice_huddle                      | after buyer notice               | Hanh, Duc          | Preparing documents for a buyer audit                 | real gap list / prioritise / cosmetic fix                                 | -   | planned |
| fin.vy_interim                               | weeks 14 to 17, beat             | Vy, Hanh           | Ms Vy's interim visit and sample requests             | open files / guided / steer                                               | -   | planned |
| **The Receipt Problem (May to Oct)**         |                                  |                    |                                                       |                                                                           |     |         |
| fin.long_receipts                            | weeks 18 to 24                   | Long               | Stack of expenses with no receipts                    | ask for receipts / book as staff advance / book as business               | B   | planned |
| fin.long_personal                            | after accepting receipts         | Long               | A family dinner expensed as client entertainment      | refuse / reclassify to personal / book                                    | B   | planned |
| fin.long_wedding                             | weeks 34 to 40                   | Long, Duc          | Large event booked to marketing                       | escalate to Hanh / refuse / book                                          | B   | planned |
| fin.receipt_support                          | after a personal booking         | Long               | "Get me a supplier letter to cover it"                | refuse / ask for real docs / create one                                   | B   | planned |
| **The Cookie Jar (Jun to Dec)**              |                                  |                    |                                                       |                                                                           |     |         |
| fin.profit_smoothing                         | weeks 22 to 28                   | Duc                | Duc suggests a generous accrual in a good month       | refuse / modest estimate / pad                                            | C   | planned |
| fin.reserve_release                          | weeks 40 to 46                   | Duc                | Bad quarter; release the reserve to hit target        | refuse / partial with note / release                                      | C   | planned |
| fin.covenant_check                           | weeks 24 to 27                   | Duc                | Bank covenant ratio at risk                           | report honestly / present with options / adjust                           | C   | planned |
| **Mid-year (Jun to Jul)**                    |                                  |                    |                                                       |                                                                           |     |         |
| fin.midyear_review                           | weeks 24 to 28, beat             | Hanh               | Hanh's feedback on your work so far                   | accept / defend with data / spin                                          | -   | planned |
| fin.buyer_disputes_invoice                   | week 28 to 32, beat (twist)      | Petra, Bao         | A large buyer disputes an invoice that was adjusted   | correct / explain with support / hold the line                            | A   | planned |
| fin.dso_pressure                             | weeks 26 to 40                   | Duc, Bao           | DSO target: move overdue balances?                    | report honestly / payment plan / reclassify                               | -   | planned |
| **Collections and risk (Aug to Oct)**        |                                  |                    |                                                       |                                                                           |     |         |
| fin.overdue_balance                          | weeks 30 to 38                   | Bao, Petra         | A buyer is 90 days overdue; Bao asks you to leave it  | provide / reserve / hide by moving                                        | -   | planned |
| fin.duplicate_payment                        | weeks 18 to 44                   | Thu                | A duplicate payment in the company's favour           | refund it / hold and log / keep it                                        | -   | planned |
| fin.fx_difference                            | weeks 12 to 44                   | Hanh               | FX gain you could time                                | book at date / ask policy / time it                                       | -   | planned |
| fin.thu_mistake                              | weeks 34 to 42                   | Thu                | Thu posts a wrong amount, begs you not to tell        | correct and coach / correct and log / cover                               | D   | planned |
| **Audit and crisis (Oct to Nov)**            |                                  |                    |                                                       |                                                                           |     |         |
| fin.vy_fieldwork                             | weeks 41 to 44, beat             | Vy, Hanh           | Ms Vy's fieldwork compares spring to now              | full transparency / explain gaps / deflect                                | -   | planned |
| fin.vy_asks_receipts                         | needs a Long booking             | Vy, Long           | Ms Vy asks for the receipts                           | show what you have / explain / produce a document                         | B   | planned |
| fin.thu_at_audit                             | autumn audit, arc D              | Thu, Vy            | Thu is asked who told her to post it                  | prepare her to tell the truth / leave her / script her                    | D   | planned |
| fin.management_letter                        | weeks 45 to 48                   | Hanh, Duc          | Audit findings and who takes the blame                | present the record / share responsibility / point at Thu                  | -   | planned |
| fin.scapegoat_meeting                        | needs a severe fact, crisis      | Duc, Hanh          | Management looks for one person to blame              | present the record / shared responsibility / point at Thu                 | -   | planned |
| **Year-end finale (Dec)**                    |                                  |                    |                                                       |                                                                           |     |         |
| fin.year_end_close                           | weeks 49 to 52                   | Hanh, Bao          | Last close of the year: final pressure from sales     | refuse / book on date / book early                                        | A   | planned |
| fin.year_end_review                          | weeks 49 to 52, beat             | Hanh               | Annual review and promotion                           | honest / modest / polished                                                | -   | planned |
| fin.manager_offer                            | rare, good record + relationships| Hanh, Duc          | Offered the chief accountant seat with a condition    | accept on your terms / decline / accept the condition (needs ending)      | -   | planned |

Target: about 38 to 42 distinct scenes, about 20 random incidents and about 20 beat/arc scenes, for
about 55 to 65 decisions a run. Count now: 40 planned.

## 10. Role definition (pending)

`role.fin.accountant` (department `dept.finance`, level 1, reports to `role.fin.chief_accountant`):
weekly tasks `task.ar_followup` (receivables chasing), `task.invoice_check` (checking invoices
against delivery and contract), `task.month_end_close` (heavier in the last week of each month);
KPIs `kpi.close_on_time` and `kpi.dso_days`; skills accounting, analysis, backbone; overhead hours to
be tuned (start near 17, like QC) so that a careful player finishes the year under pressure but not
crushed. Start salary about 14 million VND. Dark offers: a cut-off offer and a receipt offer to be
defined after approval. A month-end close mini-mechanic (a short checklist the player sees each
month) is optional; decision needed.

## 11. Decisions (owner, 2026-09-30) and open questions

Decided:

- Same company as QC and Sales (shared audits, shared cast such as Ms Vy).
- The month-end close is a visible mini-mechanic: a checklist of four steps each month (bank
  reconciliation, receivables ageing, accruals, cut-off check). Step scenes appear in the last two
  weeks of each month; each step can be done properly, rushed, or skipped; the month is scored.
- A "promoted to chief accountant" ending is wanted (offered by `fin.manager_offer`).

Still open:

- Is Finance in this same company (recommended, shares audits with QC and Sales) or a different one?
- Should month-end be a visible mini-mechanic, or only a source of scenes?
- Practitioner: are the cut-off, reserve and receipt ladders realistic for Vietnamese accounting
  practice (VAS, tax rules)? All text is fictional and must not be read as accounting advice.
- Is the "promoted to chief accountant" ending wanted, and what should it require?
