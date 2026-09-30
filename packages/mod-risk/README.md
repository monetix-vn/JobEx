# @je/mod-risk

Owns detection, audits, blame and endings. It reads facts and reputation from the state mirror and
acts only through commands and requests.

- **Detection.** While a fact is still `private` (rank 1), the evidence it left (`traces` on the
  fact, each with a visibility and a list of detectors) can be found. Everyday detectors (finance,
  QC, the buyer, the boss) roll every week at `visibility x strength x 0.02`. The internal audit
  rolls only in audit weeks (default weeks 12, 25, 38, 51, the quarter ends) at
  `visibility x strength x 0.25`. A finding emits `risk.detected` and asks the ledger to make the
  fact `witnessed` (`knowledge.escalate`), so social's reputation consequences and the follow-up
  events take over. One finding per fact per week.
- **Audits.** `risk.auditStarted` tells the rest of the game (and the player) an audit week began.
- **Scapegoating.** When a serious fact (severity 6 or more) becomes known to anyone besides the
  player, the boss may blame the player: chance `0.15 + 0.04 x severity + (50 - boss standing) / 200`,
  between 0 and 0.75. It costs 6 boss standing and 5 stress. Once per fact.
- **Endings.** Checked in the end phase, never before week 8. `burnout` at zero health (at once);
  `prosecuted` when a public fact of severity 9 or more meets boss standing of 30 or less;
  `fired` when a scandal is out (a fact of severity 6 or more that is at least a rumor) and boss
  standing is 10 or less, or two public facts of severity 7 or more meet boss standing of 25 or
  less. A low standing alone is a bad year, not a firing. Apart from burnout, the condition must
  hold two weeks in a row (`graceWeeks`), and a recovery resets the count. It sends
  `run.endRequested`; the kernel ends the run after that turn.

All rolls use this module's own RNG stream.

Config: `{ content: ContentView, strengths?, auditWeeks?, detectBase?, auditFactor?,
minTurnsBeforeEnding?, graceWeeks? }`.
Consumes `sim.stateChanged`, `clock.ticked`, `turn.phaseStarted`, `fact.learned`, `fact.escalated`;
emits `risk.auditStarted`, `risk.detected`, `risk.scapegoated`, `knowledge.escalate`,
`sim.applyDelta`, `run.endRequested`.
