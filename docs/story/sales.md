# Series bible: Export Sales Specialist

Status: DRAFT v2 by AI, written after the scenes (2026-10-01): it documents what is in the game and
what is still planned. Not reviewed by a practitioner. Template: `docs/story/TEMPLATE.md`. Tone:
`content/industry-cookware/events/README.md`. Format: `docs/AUTHORING.md`. Reference for detail:
`docs/story/qc.md`, `docs/story/finance.md`.

## 1. Premise

You handle European buyers for a cookware exporter. Your quota, your commission and your reputation
with buyers all depend on promising things the factory must then deliver. You sit between a buyer who
wants a lower price and a faster delivery, and a factory that wants fewer, simpler orders.

## 2. What the player should feel

- A promise is a debt that someone else pays (production, QC, finance).
- Every discount, date and forecast is a small bet with your name on it.
- The numbers you are judged on (quota, DSO, margin) can be gamed, and gaming them hurts others later.
- Buyers reward honesty slowly and punish surprises fast.
- Juniors copy what you do, not what you say.

## 3. The player's arc

New and eager (weeks 1-12): win the first big order, learn what a promise costs. Stretching (13-26):
quota pressure and the first discount beyond your limit. The bill (27-40): the midseason twist when
the biggest buyer is offered a cheaper rival, the discount spiral and the overdue account come due,
Quynh repeats your habits. Who you became (41-52): the buyer's renewal or the audit of your record,
the year-end review and a possible promotion.

## 4. Cast (all exist as `char.*`; Bao, Lan and Duc are shared with QC and Finance)

| Character                 | Role                      | Wants                          | Arc                                                                          |
| ------------------------- | ------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| Mr Bao (`char.bao`)       | Sales Manager, your boss  | Quota, a good forecast         | Charming and pushy; rewards results, backs you if your numbers hold          |
| Mr Anders (`char.anders`) | European buyer            | Reliable dates, honest answers | Tests you, turns loyal if you never surprise him; offers the big renewal     |
| Ms Lan (`char.lan`)       | Production Manager        | Orders she can build           | Friction when you over-promise dates; ally when you ask first                |
| Mr Duc (`char.duc`)       | Finance Director          | Margins, cash, covenants       | Reviews your discounts and credit; trusts a clean record                     |
| Quynh (`char.quynh`)      | Junior sales coordinator  | To learn from you              | Mirrors your habits; your influence made visible                             |
| Ms Hanh (`char.hanh`)     | Chief Accountant          | True numbers                   | Appears when expense claims, freight lines or invoices look wrong            |

## 5. Season timeline

| Month     | Reality                          | Beat / storyline                                                        |
| --------- | -------------------------------- | ----------------------------------------------------------------------- |
| Jan to Feb| Pre-Tet rush, forecast           | **Premiere:** `sales.first_big_order`; existing Tet rush, forecast scenes|
| Mar to Apr| Buyer audit window               | Shared arc The Squeeze                                                  |
| May to Jun| Trade fair, quarter close        | **Discount spiral** starts; quota push at quarter ends                  |
| Jul       | Mid-year review                  | `sales.midyear_review` then **twist** `sales.big_buyer_threatens`       |
| Aug to Sep| FX swings, overdue payments      | **Overdue account** and Quynh copying you                               |
| Oct to Nov| Year-end push                    | Credit asks, expense temptations, the compliance interview if earned    |
| Dec       | Close and review                 | `sales.anders_renewal` (if trusted), `sales.year_end_review`, `sales.manager_offer` |

## 6. Storylines (arcs, all implemented)

- **The discount spiral:** `rfq_discount` -> `discount_expected` -> `margin_review`. Holding the line or a fair compromise ends it at once; promising beyond your limit leads to the buyer expecting it again and a margin review. Facts: `discount_above_limit`, `buried_discount_in_freight`.
- **The overdue account:** `payment_overdue` -> `overdue_pull_in`. Chasing properly ends it; hiding or pulling an order forward creates `pulled_shipment_in`.
- **Quynh:** `new_hire_mentor` -> `quynh_copies_you` -> `quynh_caught`. What you teach comes back. Facts: `approved_quynh_shortcut`, `blamed_quynh`.
- **The Squeeze:** shared with QC (buyer audit notice -> audit day).

## 7. Dark-side ladder

1. Padding a forecast or quota (`forecast_padded`, `padded_quota_orders`).
2. An unrealistic delivery date (`promised_unrealistic_date`).
3. A discount or credit above your limit (`discount_above_limit`, `credit_above_limit`).
4. Claiming an expense that did not happen (`padded_expense_claim`).
5. Staging a factory visit (`staged_factory_visit`).
6. Hiding discounts in freight or shipping early to reach a number (`buried_discount_in_freight`, `pulled_shipment_in`).
7. Exploiting a buyer's trust (`exploited_buyer_trust`).
8. Backdating documents, paying for a document, taking a kickback (`backdated_documents`, `paid_for_document`, `accepted_kickback`).

## 8. Endings

Completed, burnout, fired, prosecuted (engine), and promoted to Sales Manager (`sales.manager_offer`,
weeks 51-52, needs trust with Bao, standing with the boss and buyers).

## 9. Episode list

All rows below are `imported` unless marked.

| Id                        | Timing / trigger            | Cast            | Situation                                           | c1 / c2 / c3                                          | Arc     |
| ------------------------- | --------------------------- | --------------- | --------------------------------------------------- | ----------------------------------------------------- | ------- |
| sales.first_big_order     | beat, weeks 1 to 3          | Bao, Anders     | First big order with a tight date                   | check capacity / date in between / promise his date   | -       |
| sales.midyear_review      | beat, weeks 24 to 28        | Bao             | What do you want to be known for                    | trust and planning / numbers and promotion / say what he wants | -  |
| sales.big_buyer_threatens | beat (twist), weeks 29 to 32| Anders, Bao     | A rival is 14% cheaper                              | total cost of ownership / moderate cut / match price  | -       |
| sales.year_end_review     | beat, weeks 49 to 50        | Bao             | Annual review                                       | honest / modest / polished                            | -       |
| sales.manager_offer       | beat, weeks 51 to 52, earned| Bao             | Offered the manager seat with a condition           | accept on terms / decline / accept blindly (ends: promoted) | -  |
| sales.discount_expected   | arc stage                   | Anders          | He assumes the same discount again                  | explain tiers / ask Duc / say yes again               | spiral  |
| sales.margin_review       | arc stage                   | Duc             | Margin review of Anders's account                   | show everything / frame it / bury it in freight       | spiral  |
| sales.overdue_pull_in     | arc stage                   | Bao             | Pull next order forward to hide the overdue balance | decline / agree with the buyer / ship early silently  | overdue |
| sales.quynh_copies_you    | arc stage                   | Quynh           | She quotes the way she watched you do it            | correct her / "careful who finds out" / "it is fine"  | quynh   |
| sales.quynh_caught        | arc stage                   | Bao, Quynh      | The habit has caused a complaint                    | own it / technical defence / blame her                | quynh   |
| sales.buyer_visit_factory | random, weeks 12 to 44      | Anders, Lan     | He wants to see a normal day                        | show the rework pile / tidy / stage the line          | -       |
| sales.quota_push          | random, quarter ends        | Bao             | "Find the other nine percent"                       | real number / ask buyers openly / count unconfirmed   | -       |
| sales.credit_ask          | random, turn 10+            | Anders          | Bigger order on 90-day terms                        | formal credit review / 60 days + prepayment / off the books | -  |
| sales.expense_padding     | random, turn 14+            | Bao             | "Add the dinner to the claim"                       | true claim / real dinner / pad                        | -       |
| sales.anders_renewal      | reward, needs his trust     | Anders          | A three-year framework, you set the price           | fair price + review clause / exploit / decline longer | -       |
| (existing 19 scenes)      | see `pnpm content:list --role sales` |        |                                                     |                                                       |         |

Added after this table was written (2026-10-01): `sales.tet_bonus_team` (Tet bonus pressure), the trade-fair
lead arc (`trade_fair` -> `fair_lead_sample` -> `fair_lead_deal`, with misrepresented samples and
uncapped penalty clauses), `sales.finance_interview` (consequence of `buried_discount_in_freight`) and
`sales.quynh_promotion` (her reference). 39 Sales scenes exist now. Still open: a consequence scene for
`staged_factory_visit`, and more buyers besides Anders.

## 10. Open questions

- Should Quynh have a playable "second year" view (she becomes the manager)?
- Practitioner review: are the quota and credit practices realistic for a Vietnamese exporter?
