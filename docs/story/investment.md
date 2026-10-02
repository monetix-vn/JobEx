# Series bible: Investment Banking Analyst, the "finance bro" (sixth job)

Status: DRAFT v1 by AI (2026-10-02), requested by the owner ("you added accountants, not finance bro").
Written together with the scenes. Not reviewed by the owner or a practitioner. Playable at `?role=inv`.
This job is in its own company and pack (`content/industry-securities`, a securities firm), not the
cookware factory. Nothing here is legal or investment advice; the rules described are generic and
fictional. Tone: `content/industry-cookware/events/README.md`. Format: `docs/AUTHORING.md`
(import with `--pack industry-securities`).

## 1. Premise

You are the analyst on a deal team at a securities firm: models at midnight, pitch books by morning,
and a team that knows things the market does not. The pay is good, the hours are brutal and the culture
treats exhaustion as a credential. A valuation is a number everybody wants to be higher, a tip is the
fastest way to money, and a compliance rule is the thing between you and a very bad Monday.

## 2. What the player should feel

- A model is only as honest as its assumptions; the answer someone wants is the most dangerous input.
- Inside information is a temptation that is easy, quiet and, when it fails, catastrophic.
- Exhaustion causes errors, and errors cause the shortcuts that follow.
- Friendship and rules collide in small rooms at the worst times.
- Reporting a friend, or correcting a deck early, is the unglamorous skill the industry depends on.

## 3. The player's arc

1. Weeks 1 to 12: learn the models, the hours and the manual nobody reads.
2. Weeks 13 to 26: the first pressure on a valuation, the first tip, the first lost weekend.
3. Weeks 27 to 40: the market falls, the IPO is mispriced, a model error is found.
4. Weeks 41 to 52: the compliance review, the inquiry, the bonus and the offer (or the fall).

## 4. Cast (all new, in `content/industry-securities`; Hanh, Duc and the rest of the cookware world do not appear)

| Character               | Role                          | Wants                               | Arc                                                                    |
| ----------------------- | ----------------------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| Quang (`char.quang`)    | Vice President, your boss     | Deals closed, no surprises          | Works as hard as you; trusts a straight account                        |
| Ms Trang (`char.trang`) | Managing Director             | Fees, closed deals                  | Rewards closers; respects the analyst who says no in time              |
| Mr Phong (`char.phong`) | CEO of the client             | A big valuation                     | Tests you; trusts you more if you do not flatter him                   |
| Hieu (`char.hieu`)      | Fellow analyst, friend        | Money, status                       | The tip: friend, tempter and, if you report him, the cost              |
| Ms Thao (`char.thao`)   | Head of Compliance            | Complete answers, early             | Calm; the person you are better off telling first                      |

## 5. Season timeline

| Month     | Beat / storyline                                                                          |
| --------- | ----------------------------------------------------------------------------------------- |
| Jan to Feb| Premiere `inv.first_week`; the manual; first lost weekends                                |
| Mar to Jun| The valuation arc; client dinners; personal-trade and restricted-list temptations         |
| Jun to Jul| `inv.midyear_review`, then the twist `inv.market_twist` (the IPO window)                  |
| Aug to Oct| The tip arc, the hours arc, the pitch error arc                                           |
| Oct to Nov| `inv.compliance_review` beat; the inquiry, the blame meeting if you earned them           |
| Dec       | `inv.bonus_review`, `inv.associate_offer`                                                 |

## 6. Storylines

- **The valuation:** `valuation_ask` -> `assumptions_push` -> `roadshow_question`. Facts: `inflated_growth_assumption`, `misled_investor`, `corrected_the_model`.
- **The tip:** `tip_overheard` -> `friend_trades` -> `compliance_query`. Facts: `traded_on_tip`, `tipped_a_friend`, `reported_insider_trading`, `destroyed_evidence`.
- **The hours:** `weekend_ask` -> `leave_cancelled` -> `model_error_at_dawn`. Facts: `worked_to_exhaustion`, `sacrificed_family_for_deal`, `hid_model_error`.
- **The error in the pitch:** `error_found` -> `fix_or_hide` -> `client_notices`. Facts: `left_pitch_error_uncorrected`, `hid_model_error`.

## 7. Dark-side ladder

Padding client entertainment -> an unreported personal trade in a restricted name -> a smoothed
earnings slide -> softened risk language -> an inflated growth assumption -> copying a client list ->
trading on inside information -> repeating it through a relative's account -> deleting messages.

## 8. Endings

Completed, burnout, fired, prosecuted (engine); promoted to associate (`inv.associate_offer`); walked
away (`inv.resignation_thought`, or declining the promotion).

## 9. Not yet written

More incidents (a research-conflict scene, a gift from a client, a layoff round), a second-year view,
a visible hours mechanic. 25 scenes today, about 45 decisions a year.

## 10. Open questions

- Practitioner review: are the compliance and information-barrier practices believable?
- Should hours be a visible meter (the job's defining pressure)? Not built.
