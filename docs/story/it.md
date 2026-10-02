# Series bible: IT Support and Systems Administrator (eleventh job; last of the five departments added on 2026-10-02)

Status: DRAFT v1 by AI (2026-10-02), asked for by the owner ("then IT"), written together with the scenes.
Not reviewed by the owner or a practitioner. Playable at `?role=it`. Same cookware company as the other
factory jobs; IT is two people and an intern for four hundred staff, one ERP and a server room that is also
a cupboard. Tone: `content/industry-cookware/events/README.md`. Format: `docs/AUTHORING.md`. The security,
privacy and incident practices in the scenes are generic and simplified; they need review by a practitioner
who knows current IT security practice.

## 1. Premise

You hold the keys. Tickets, passwords, the ERP, backups and the mail server are yours, and so is the log
that records who used which key. Directors ask you to open someone's mailbox, to hand over a login, to
change a number in the database, or to keep a quiet incident quiet. Each request is a small, plausible
exception, and each one is the thing the log will show later, with your account name beside it.

## 2. What the player should feel

- Access is trust that has been written down; the log is the memory of that trust.
- The first hours of an incident decide its size; telling the right people early is the cheapest control.
- Segregation of duties is not about trusting people less; it is about not needing to trust anyone completely.
- Being able to read everything is only tolerable if you do not repeat what is not your business.
- A shortcut with a login (shared, borrowed, a leaver's) is invisible until the day everything depends on who did it.

## 3. The player's arc

1. Weeks 1 to 12: take stock of who has what, learn the systems and the people who ask for exceptions.
2. Weeks 13 to 26: the first request for a mailbox, a shared login, a quick fix to the data.
3. Weeks 27 to 40: the phishing click and the ransomware; the ransom decision; the patch and the vendor.
4. Weeks 41 to 52: the security review, the breach notice, the review and the offer (or the fall).

## 4. Cast (Kien, Bin, Son, Yen are new; Cuong, Long, Hanh, Thu, Duc, Quoc, Oanh, Ngoc, Lan, Bao, Anders, Tam are shared)

| Character              | Role                                   | Wants                              | Arc                                                                     |
| ---------------------- | -------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| Mr Kien (`char.kien`)  | IT Manager, your boss                  | A clean log, no surprises          | Backs the straight account in writing; offers you his seat              |
| Bin (`char.bin`)       | IT intern                              | To learn, to be told what to do    | Clicks first; the person you are tempted to blame; keeps the tickets    |
| Mr Son (`char.son`)    | Software and cloud vendor              | The contract                       | A friendly gift and a commission                                        |
| Ms Yen (`char.yen`)    | Software licence auditor               | A count of licences                | Finds the cracked package                                               |
| Mr Quoc                | Internal auditor                       | A clean trail                      | Reads the access list first, and the logs second                        |
| Mr Cuong, Mr Long, Ms Hanh, Thu, Mr Duc | Shared                | Mail, logins, speed, the close     | Each asks IT for an exception that is easy and wrong                    |
| Ms Oanh, Ngoc          | HR, a complainant (see `docs/story/hr.md`) | Process, safety           | The mailbox request touches Ngoc's complaint                            |

## 5. Season timeline

| Month      | Beat / storyline                                                                          |
| ---------- | ----------------------------------------------------------------------------------------- |
| Jan to Feb | Premiere `it.first_week`; the inventory of access; first tickets                           |
| Mar to Jun | The Email and The Keys can start; passwords, shadow cloud, direct edits, the patch         |
| Jun to Jul | `it.midyear_review`, then the twist `it.phishing_click` (the ransomware begins)           |
| Aug to Oct | The Ransom (files locked, pay or restore, tell the customers); The Keys; licences          |
| Oct to Nov | `it.security_review` beat; the auditor asks about access if earned                        |
| Nov to Dec | `it.blame_meeting` if earned; `it.year_end_review`, `it.manager_offer`                    |

## 6. Storylines

- **The Email:** `read_their_mail` -> `what_you_found` -> `the_gossip`. Facts: `refused_unauthorised_access`, `read_mailbox_without_authorisation`, `protected_personal_findings`, `shared_personal_findings`, `lied_about_mailbox_access`.
- **The Keys:** `shared_login` -> `erp_rights` -> `leaver_account`. Facts: `kept_least_privilege`, `shared_admin_login`, `fixed_access_properly`, `granted_conflicting_erp_rights`, `left_leaver_account_active`.
- **The Ransom:** `phishing_click` -> `files_locked` -> `pay_or_restore` -> `tell_the_customers`. Facts: `reported_incident_promptly`, `delayed_incident_report`, `hid_security_incident`, `restored_from_backup`, `paid_ransom_secretly`, `disclosed_breach`, `deleted_security_logs`.
- **Incidents:** `boss_password`, `pirated_software`, `shadow_cloud`, `direct_edit`, `patch_downtime`, `keylogger_ask`, `vendor_gift`, `usb_found`. Consequences: `quoc_asks_access`, `blame_meeting`.

## 7. Dark-side ladder

A found USB stick plugged in -> a director's simple password and no second step -> a team's files in a personal
cloud -> a cracked drawing package left alone -> a critical patch skipped -> a vendor's laptop -> a shared
login -> a leaver's account lent to the owner's family -> approval and payment rights on one person -> a
posted record changed in the database -> a mailbox opened on a director's word -> private findings
shared -> a covert keylogger -> a ransomware incident kept quiet -> a ransom paid off the books -> the
logs deleted -> access tickets back-dated -> the intern blamed.

## 8. Endings

Completed, burnout, fired, prosecuted (engine); promoted to IT manager (`it.manager_offer`); walked away
(`it.resignation_thought`, or declining the promotion).

## 9. Not yet written

More incidents (a lost laptop with unencrypted data, a drive-by wifi guest, an ex-employee's remote access, a
second-year view). 26 scenes today, about 38 decisions a year.

## 10. Open questions

- Practitioner review: are the incident response, access control and disclosure practices believable?
- Should the open-ticket queue be a visible panel (proposed in `docs/story/JOB-PROPOSALS.md`)? Not built.
