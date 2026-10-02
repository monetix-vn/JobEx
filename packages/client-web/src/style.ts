/**
 * The game screen's look: 8-bit. Flat colours, 3px square borders, a monospace face, pixel art drawn as SVG with sharp
 * edges. Two columns on a wide screen (the scene, and the stats and people beside it), one column on a phone.
 */
export const STYLE = `
.je{--bg:#1b1b2f;--ink:#eee;--gold:#ffd166;--panel:#33335a;--panel2:#4a4a80;--deep:#0d0d1a;--good:#8fe388;--bad:#ff6b6b;--blue:#9ad1ff;--dim:#2a2a40;
 font-family:ui-monospace,Menlo,Consolas,monospace;background:var(--bg);color:var(--ink);max-width:560px;margin:0 auto;padding:12px;image-rendering:pixelated;box-sizing:border-box}
.je *{box-sizing:border-box}
.je-status{display:flex;justify-content:space-between;align-items:center;gap:8px;border:3px solid var(--ink);padding:4px 8px;margin-bottom:8px}
.je-name{color:var(--gold)}
.je-langs{display:flex;gap:4px}
.je-lang,.je-cast-toggle{font:inherit;color:var(--ink);background:var(--panel);border:2px solid var(--ink);padding:0 6px;cursor:pointer}
.je-cast-toggle{margin-left:6px}
.je-lang[aria-pressed="true"]{background:var(--gold);color:#111}
.je-year{margin-bottom:8px}
.je-year svg{display:block;width:100%;height:8px;color:var(--blue)}
.je-months{display:grid;grid-template-columns:repeat(12,1fr);font-size:10px;color:#8a8ab0;text-align:center;margin-top:2px}
.je-months span[data-now="true"]{color:var(--gold);font-weight:bold}
.je-layout{display:flex;flex-direction:column;gap:8px}
.je-side{display:contents}
.je-main{order:2;min-width:0}
.je-bars{order:1;border:3px solid var(--ink);padding:6px 8px}
.je-reps-box{order:3}
.je-close{order:3}
.je-cast{order:4}
.je-bar{display:grid;grid-template-columns:9em 1fr 3.5em;gap:6px;align-items:center;font-size:.85em;margin:2px 0}
.je-bar svg{width:100%;height:10px}
.je-bar[data-tone="good"] svg{color:var(--good)}
.je-bar[data-tone="mid"] svg{color:var(--gold)}
.je-bar[data-tone="bad"] svg{color:var(--bad)}
.je-bar .je-val{text-align:right;color:#bbb}
.je-bars h4{margin:6px 0 2px;font-size:.8em;color:#9ad;text-transform:uppercase;letter-spacing:1px}
.je-bars h4:first-child{margin-top:0}
.je-flash{animation:je-flash .7s steps(4)}
@keyframes je-flash{0%{background:var(--gold);color:#111}100%{background:transparent}}
.je-stats,.je-reps{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.je-cast{border:3px solid var(--ink);padding:4px 8px;font-size:.85em}
.je-cast ul{margin:4px 0 0;padding:0;list-style:none}
.je-cast li.je-plain{list-style:square;margin-left:18px}
.je-person.je-card{display:grid;grid-template-columns:30px 1fr;gap:8px;align-items:start;padding:4px;margin:4px 0;border:2px solid var(--dim);cursor:pointer}
.je-card:hover,.je-card:focus{border-color:var(--ink);outline:none}
.je-card[data-open="true"]{background:var(--deep);border-color:var(--gold)}
.je-card .je-sprite{width:30px;height:37px;background:#2b2b4a;border:2px solid var(--dim)}
.je-card .je-who{color:var(--gold)}
.je-card .je-sub{color:#aaa}
.je-card .je-tag{display:inline-block;margin-right:4px;padding:0 4px;border:2px solid var(--dim);color:var(--ink)}
.je-card .je-tag[data-feel="good"]{color:var(--good)}
.je-card .je-tag[data-feel="bad"]{color:var(--bad)}
.je-card .je-more{margin-top:4px;color:#ccc}
.je-close{border:3px solid var(--gold);padding:4px 8px;font-size:.85em}
.je-close ul{margin:2px 0 0;padding-left:18px}
.je-step[data-state="2"]{color:var(--good)}
.je-step[data-state="1"]{color:var(--gold)}
.je-map{display:grid;gap:0;border:3px solid var(--ink);margin-bottom:8px}
.je-tile{aspect-ratio:1;background:#3a3a55}
.je-tile[data-tile="#"]{background:#111}
.je-tile[data-tile="d"]{background:#8a5a2b}
.je-tile[data-tile="m"]{background:#4e7d4e}
.je-stage{display:block;width:100%;height:auto;border:3px solid var(--ink);border-bottom:0;background:#2b2b4a}
.je-dialogue{border:3px solid var(--ink);background:var(--deep);padding:8px;min-height:96px}
.je-stage+.je-dialogue{border-top-width:3px}
.je-previous{border-left:3px solid var(--gold);padding-left:8px;margin-bottom:8px;color:#bbb;font-style:italic}
.je-line b{color:var(--gold)}
.je-changes{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0 2px;align-items:center}
.je-changes .je-label{color:#9ad;font-size:.8em;text-transform:uppercase;letter-spacing:1px;margin-right:2px}
.je-chip{padding:0 6px;border:2px solid var(--dim);background:var(--panel);font-size:.85em}
.je-chip[data-tone="good"]{border-color:var(--good);color:var(--good)}
.je-chip[data-tone="bad"]{border-color:var(--bad);color:var(--bad)}
.je-outcome{margin-top:6px}
.je-picker h2{margin:0 0 6px;font-size:1.15em;color:var(--gold)}
.je-job{display:block;width:100%;text-align:left;margin-top:8px;padding:10px;font:inherit;color:var(--ink);background:var(--panel);border:3px solid var(--ink);cursor:pointer}
.je-job:hover,.je-job:focus{background:var(--panel2)}
.je-dept{margin:16px 0 0;font-size:14px;color:#9ad;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #556}
.je-job b{display:block;color:var(--gold);margin-bottom:4px}
.je-again{margin-top:12px;padding:8px 12px;font:inherit;color:#111;background:var(--gold);border:3px solid var(--ink);cursor:pointer}
.je-terms{margin-top:8px;font-size:.9em}
.je-terms-hint{color:#999;margin-right:6px}
.je-term{font:inherit;color:var(--blue);background:none;border:0;border-bottom:1px dashed var(--blue);margin-right:8px;padding:0;cursor:pointer}
.je-term[aria-expanded="true"]{color:#111;background:var(--blue)}
.je-definition{margin-top:6px;padding:6px;border:2px solid var(--blue);background:#13233a}
.je-banner{font-size:1.6em;letter-spacing:3px;text-align:center;padding:10px;margin-bottom:10px;border:3px solid var(--ink);background:var(--panel);animation:je-pop .6s steps(5)}
.je-banner[data-ending="promoted"],.je-banner[data-ending="completed"]{color:var(--good);border-color:var(--good)}
.je-banner[data-ending="fired"],.je-banner[data-ending="prosecuted"],.je-banner[data-ending="burnout"]{color:var(--bad);border-color:var(--bad)}
.je-banner[data-ending="walked_away"]{color:var(--blue);border-color:var(--blue)}
@keyframes je-pop{0%{transform:scale(.6)}100%{transform:scale(1)}}
.je-debrief{border:3px solid var(--ink);background:var(--deep);padding:10px}
.je-debrief h2,.je-debrief h3{margin:10px 0 6px;font-size:1em;color:var(--gold)}
.je-debrief h2{font-size:1.15em;margin-top:0}
.je-debrief ol,.je-debrief ul{margin:0;padding-left:20px}
.je-debrief li{margin-bottom:4px}
.je-entry-ending{color:var(--gold)}
.je-choice{display:block;width:100%;text-align:left;margin-top:6px;padding:6px;font:inherit;color:var(--ink);background:var(--panel);border:2px solid var(--ink);cursor:pointer}
.je-choice:hover,.je-choice:focus{background:var(--panel2)}
.je-choice:disabled{opacity:.55;cursor:not-allowed}
.je-choice .je-tags{display:block;margin-top:3px;font-size:.8em;color:var(--blue)}
.je-choice .je-blocked{color:var(--bad)}
@media (max-width:600px){
 .je-bar{grid-template-columns:6em 1fr 2.6em}
 .je-standing{display:grid;grid-template-columns:1fr 1fr;column-gap:12px}
 .je-standing .je-bar{grid-template-columns:5em 1fr 2.2em}
}
@media (min-width:900px){
 .je-game{max-width:1000px}
 .je-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:12px;align-items:start}
 .je-main{order:0;grid-column:1;grid-row:1 / span 6}
 .je-side{display:flex;flex-direction:column;gap:8px;grid-column:2;grid-row:1}
 .je-side>*{order:0}
 .je-dialogue{font-size:1.05em}
}
@media (prefers-reduced-motion:reduce){.je-flash,.je-banner{animation:none}}
`;
