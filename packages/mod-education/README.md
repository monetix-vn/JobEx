# @je/mod-education

Owns the end-of-run debrief. It takes notes while the game runs and never affects it.

Notes kept: the choices that left a mark (those that produced a fact), how each fact got around
(witnessed, rumor, public), what was detected (and whether in an audit), who was blamed, the
glossary terms of every scene shown, and the last known stats.

On `run.ended` it emits `debrief.ready` in the configured language:

- the ending (`completed`, `fired`, `prosecuted`, `burnout`) with its title and epilogue;
- a timeline, in order, from what you did to what came back;
- lessons: what each fact teaches (`lesson_key` on the fact), most serious first, at most six;
- the workplace vocabulary you met (glossary terms of the scenes shown), at most twelve;
- where you stand: stress, health, bonus and standing with each group.

Text keys: `debrief.choice`, `debrief.spread.<level>`, `debrief.detected`, `debrief.detected_audit`,
`debrief.scapegoat`, `detector.<name>`, `ending.<ending>.title`, `ending.<ending>.body`. Missing
keys show as `[key]`.

Config: `{ content: ContentView, locale?, maxLessons?, maxTerms? }`.
Consumes `sim.stateChanged`, `scene.started`, `choice.resolved`, `fact.learned`, `fact.escalated`,
`risk.detected`, `risk.scapegoated`, `run.endRequested`, `run.ended`; emits `debrief.ready`.
