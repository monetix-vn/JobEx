# Series bible: Export Sales Specialist

Status: DRAFT v1 by AI (outline level), not approved, not practitioner-reviewed. Template and field
meanings: `docs/story/TEMPLATE.md`. Full example of the level of detail wanted: `docs/story/qc.md`.

## 1. Premise

You handle European buyers for a cookware exporter. Your quota, your commission and your reputation
with buyers all depend on promising things the factory must then deliver. You sit between a buyer who
wants lower price and faster delivery and a factory that wants fewer, simpler orders.

## 2. What the player should feel

- A promise is a debt someone else pays (production, QC, finance).
- Every discount, date and forecast is a small bet with your name on it.
- The numbers you are judged on (quota, DSO) can be gamed, and gaming them hurts others later.
- Buyers reward honesty slowly and punish surprises fast.

## 3. The player's arc

New hire and eager (weeks 1 to 12), hitting quota by stretching promises (13 to 26), the stretched
promises come due (27 to 40), year-end accounting of who trusts you (41 to 52).

## 4. Cast (to create as `char.*`)

| Character          | Role                   | Wants                              | Arc                                                                  |
| ------------------ | ---------------------- | ---------------------------------- | -------------------------------------------------------------------- |
| Ms Thao (boss)     | Sales Manager          | Quota and a good forecast          | Pushes stretch targets; protects you only if numbers hold            |
| Mr Anders (buyer)  | European buyer         | Low price, reliable dates          | Friendly, then demanding; becomes loyal or leaves based on honesty   |
| Ms Lan             | Production Manager     | Realistic orders                   | Friction when you over-promise dates                                 |
| Mr Duc             | Finance lead           | Clean books, collected cash        | Watches your discounts and invoice dates                             |
| Quynh (new hire)   | Junior sales colleague | To learn from you                  | Copies your habits, good or bad; mirrors your arc                    |
| A rival competitor | Competing exporter     | Your buyer                         | Offers the buyer a lower price; the pressure behind "competitor_quote" |

## 5. Season timeline

| Month     | Reality                        | Beat                                                        |
| --------- | ------------------------------ | ----------------------------------------------------------- |
| Jan to Feb| Pre-Tet rush, forecast         | **Premiere:** first big order; Tet rush (`tet_rush`)        |
| Mar to Apr| Buyer audit window             | Arc "The Squeeze" (shared)                                  |
| May to Jun| Trade fair, quarter close      | **Arc "The Discount Spiral"** starts                        |
| Jul       | Mid-year KPI review            | **Midseason twist:** a large buyer threatens to switch      |
| Aug to Sep| FX swings, overdue payments    | **Arc "The Overdue Account"**; invoice temptations          |
| Oct to Nov| Year-end push                  | **Crisis:** pulled-in shipments, backdated invoices         |
| Dec       | Close and review               | **Finale:** review; consequences of your promise pattern    |

## 6. Storylines (arcs)

- **The Squeeze** (shared with QC).
- **The Discount Spiral:** small discount -> buyer expects it -> margin review -> Finance asks questions. Facts: `discount_above_limit`, `promised_unrealistic_date`.
- **The Overdue Account:** payment overdue -> pressure to chase or to pull in next order -> backdating temptation. Facts: `backdated_invoice`.
- **Quynh:** mentoring -> she copies your shortcuts -> she is caught or praised; reflects your influence.

## 7. Dark-side ladder

Padding a forecast; promising an unrealistic date; discount above limit; pulling shipments into the
quarter; accepting a buyer gift; backdating an invoice; a kickback (`accepted_kickback`, top rung).

## 8. Endings

Shared engine endings (completed, burnout, fired, prosecuted) plus planned: "promoted to Sales Manager", "walked away".

## 9. Episode list

| Id                         | Status                | Note                                                      |
| -------------------------- | --------------------- | --------------------------------------------------------- |
| 18 scenes in content       | done                  | see `pnpm content:list --role sales`                      |
| sales.first_big_order      | planned (beat, week 2 to 4) | premiere                                             |
| sales.buyer_visit_factory  | planned               | buyer tours the factory; hide or show problems            |
| sales.discount_ask_2       | planned (arc)         | second discount request, margin review looming            |
| sales.finance_margin_review| planned (arc)         | Duc questions your discounts                              |
| sales.big_buyer_threatens  | planned (beat, ~week 28) | midseason twist                                        |
| sales.quynh_copies_you     | planned (arc)         | junior repeats your shortcut                              |
| sales.overdue_chase        | planned (arc)         | chase payment vs pull in a new order                      |
| sales.year_end_pull_in     | planned (crisis)      | push shipments into the year                              |
| sales.annual_review        | planned (finale)      | review and promotion                                      |

Target: about 40 distinct sales scenes. Expand the planned rows to the QC-level table before writing.

## 10. Open questions

Which buyer relationship should be the spine (Anders)? Should Quynh exist in year 1 or be a
second-playthrough surprise?
