# Series bible: Purchasing Buyer (fifth job)

Status: DRAFT v1 by AI (2026-10-01), written together with the scenes. Not reviewed by the owner or a
practitioner. The job is playable (`?role=purch`), 23 scenes. Tone: `content/industry-cookware/events/README.md`.
Format: `docs/AUTHORING.md`. Reference for detail: `docs/story/qc.md`, `docs/story/finance.md`.

## 1. Premise

You buy steel, packaging and parts for the same cookware factory. Your manager measures you on savings,
the directors measure the factory on output, suppliers measure you on how friendly you are, and Dung in
the warehouse measures you on whether what you ordered is actually on the shelf. Every rule in
purchasing (three quotes, approval limits, approved suppliers, gift register) exists because
somebody once bent it.

## 2. What the player should feel

- Price is only one part of cost: the cheapest supplier is not always the cheapest.
- Suppliers are generous because it works. A gift is the first payment on a debt.
- Rules like approval limits and three quotes are friction, and they are also the only evidence you are fair.
- A single source is a saving until it fails; a small honest supplier is a safety net.
- The person who counts the stock is usually right, and is usually the one who gets blamed.

## 3. The player's arc

1. Weeks 1 to 12: learn the rules, the suppliers and the store.
2. Weeks 13 to 26: first temptations (gifts, a rushed order), first savings.
3. Weeks 27 to 40: the steel price twist, the single-source bet, the ghost stock.
4. Weeks 41 to 52: the vendor audit, the review, the offer (or the fall).

## 4. Cast (Tam, Hung, Khoa, Lan, Duc, Hanh and Vy are shared)

| Character              | Role                       | Wants                          | Arc                                                                  |
| ---------------------- | -------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| Mr Tam (`char.tam`)    | Purchasing Manager, boss   | Savings, a clean audit         | Rewards honesty if the numbers hold; offers the manager seat         |
| Mr Hung (`char.hung`)  | Large supplier's rep       | Volume, the buyer's loyalty    | The sweetener: lunch, rebate, pressure; the single source's weakness |
| Ms Linh (`char.linh`)  | Small steel trader         | Survive on honest terms        | The safety net; asks for help paying on time                         |
| Dung (`char.dung`)     | Warehouse keeper           | Counts that match              | Keeps his own notebook; blamed if you are not careful                |
| Ms Lan (`char.lan`)    | Production Manager         | Materials on time              | The urgency behind skipped quotes                                    |
| Ms Hanh, Mr Duc        | Finance                    | Matching invoices, true numbers| Flag split orders, surcharges, odd payments                          |
| Ms Vy (`char.vy`)      | External auditor           | To find gaps honestly          | Vendor audit in autumn                                               |

## 5. Season timeline

| Month     | Beat / storyline                                                                 |
| --------- | -------------------------------------------------------------------------------- |
| Jan to Feb| Premiere `purch.first_week`; first lunch invitation (the sweetener can start)    |
| Mar to Jun| Skipped quotes, split orders, invoice mismatch, conflict of interest             |
| Jul       | `purch.midyear_review`, then the twist `purch.steel_price_twist`                 |
| Aug to Oct| Single source asked (and its failure), the ghost stock                           |
| Oct to Nov| `purch.vendor_audit` beat; consequence scenes for rebates and blame              |
| Dec       | `purch.year_end_review`, `purch.manager_offer`                                   |

## 6. Storylines

- **The sweetener:** `hung_lunch` -> `hung_rebate` -> `hung_pressure`. Facts: `accepted_supplier_gifts`, `accepted_supplier_rebate`, `steered_price_for_rebate`, `reported_rebate_offer`.
- **The single source:** `single_source_ask` -> `supplier_fails` -> `shortage_blame`. Facts: `single_sourced_without_backup`, `covered_gap_with_unapproved_po`, `blamed_manager`.
- **The ghost stock:** `stock_gap` -> `stock_writeoff` -> `stock_audit`. Facts: `adjusted_inventory_quietly`, `ghost_inventory_writeoff`, `blamed_warehouse_keeper`.
- **Shared:** The Squeeze (buyer audit notice and audit day).

## 7. Dark-side ladder

Declared courtesy -> accepting gifts and early access -> skipping the three-quote rule -> splitting a
purchase order -> hiding a family tie -> unauthorised early payment -> a personal rebate -> letting a
price rise while being paid -> blaming the warehouse keeper or your manager.

## 8. Endings

Completed, burnout, fired, prosecuted (engine), promoted to Purchasing Manager (`purch.manager_offer`),
walked away (`purch.resignation_thought`).

## 9. What is written and what is not

Imported: all of the above plus `skipped_quotes`, `split_po`, `invoice_mismatch`, `conflict_of_interest`,
`small_supplier`, `vy_asks_rebate`, `scapegoat_meeting`. Not yet written: a sample-test conflict with
QC, a price-negotiation bluff, a late-delivery penalty waiver, a new-supplier qualification block, a
Tet restock block, a second year-end consequence. The job has fewer scenes than the others (23 against
31 to 46), so a year has about 50 decisions; add scenes to raise it.

## 10. Open questions

- Practitioner review: are the approval limits, quote rules and gift practices realistic here?
- Should procurement have a visible mini-mechanic (a quote comparison table)? Not built.
