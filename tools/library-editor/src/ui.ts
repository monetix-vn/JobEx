/**
 * The page of the attribute library editor: plain HTML and JavaScript, no libraries, no network, 8-bit look
 * to match the game. (The script avoids template-literal backticks so it can live in one string.)
 */
export const EDITOR_HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>People Library Editor</title>
<style>
:root{--bg:#1b1b2f;--ink:#0d0d1a;--panel:#33335a;--panel2:#4a4a80;--line:#eeeeee;--text:#eeeeee;--dim:#a8a8d0;--gold:#ffd166;--green:#8fe388;--red:#ff7b7b;--orange:#ffb86b;--blue:#9ad1ff}
*{box-sizing:border-box}
html{image-rendering:pixelated}
body{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 ui-monospace,Menlo,Consolas,"Courier New",monospace;-webkit-font-smoothing:none;font-smooth:never;
  background-image:linear-gradient(rgba(0,0,0,.18) 50%,transparent 50%);background-size:100% 4px}
header{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:10px 14px;border-bottom:4px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:5}
.logo{display:flex;align-items:center;gap:10px}
.sprite{width:4px;height:4px;background:transparent;display:inline-block;margin:0 12px 24px 4px;
  box-shadow:8px 0 var(--gold),12px 0 var(--gold),16px 0 var(--gold),4px 4px var(--gold),8px 4px #eee,12px 4px #eee,16px 4px #eee,20px 4px var(--gold),4px 8px var(--gold),8px 8px #111,12px 8px #eee,16px 8px #111,20px 8px var(--gold),8px 12px #eee,12px 12px #eee,16px 12px #eee,4px 16px var(--blue),8px 16px var(--blue),12px 16px var(--blue),16px 16px var(--blue),20px 16px var(--blue),4px 20px var(--blue),12px 20px var(--blue),20px 20px var(--blue),8px 24px var(--green),16px 24px var(--green)}
h1{font-size:15px;margin:0;color:var(--gold);text-transform:uppercase;letter-spacing:2px}
h3{margin:14px 0 6px;color:var(--gold);text-transform:uppercase;letter-spacing:1px;font-size:13px}
nav{display:flex;gap:6px;flex-wrap:wrap}
button{font:inherit;color:var(--text);background:var(--panel);border:3px solid var(--line);padding:3px 10px;cursor:pointer;box-shadow:3px 3px 0 #000;text-transform:uppercase;letter-spacing:1px;font-size:12px}
button:hover{background:var(--panel2)}
button:active{box-shadow:0 0 0 #000;transform:translate(3px,3px)}
button.on{background:var(--gold);color:#111}
button.primary{background:var(--green);color:#111}
button.danger{background:var(--red);color:#111}
#status{margin-left:auto;color:var(--dim)}
main{display:grid;grid-template-columns:250px minmax(0,1fr) 330px;min-height:calc(100vh - 70px)}
aside,section,#diag{padding:12px;border-right:3px solid var(--line);overflow:auto;max-height:calc(100vh - 70px)}
#diag{border-right:0}
.item{display:block;width:100%;text-align:left;margin:0 0 6px;box-shadow:none;border-width:2px;border-color:#555580;text-transform:none;letter-spacing:0;font-size:13px}
.item.on{background:var(--panel);border-color:var(--gold);color:var(--text)}
fieldset{border:3px solid var(--line);margin:10px 0;padding:8px 10px;background:rgba(13,13,26,.55)}
legend{color:var(--gold);padding:0 6px;text-transform:uppercase;letter-spacing:1px;font-size:12px}
label{display:grid;grid-template-columns:170px minmax(0,1fr);gap:4px 10px;align-items:start;margin:6px 0}
label span.k{color:var(--blue);overflow-wrap:anywhere}
label .help{grid-column:2;color:var(--dim);font-size:12px;margin-top:-2px}
body.nohelp .help{display:none}
input,textarea,select{font:inherit;color:var(--text);background:var(--ink);border:3px solid #6a6aa0;padding:3px 6px;width:100%;border-radius:0}
input:focus,select:focus{outline:0;border-color:var(--gold)}
input[type=number]{max-width:160px}
input[type=checkbox]{width:20px;height:20px}
.box{border:3px solid var(--gold);background:#2a2a48;padding:8px 12px;margin:0 0 10px;box-shadow:4px 4px 0 #000}
.box b{color:var(--gold);text-transform:uppercase;letter-spacing:1px}
.box ul{margin:4px 0 0;padding-left:20px}
.small{font-size:12px;color:var(--dim)}
.err{color:var(--red)}.warn{color:var(--orange)}.info{color:var(--dim)}.good{color:var(--green)}
.bar{height:10px;background:var(--gold);display:inline-block;vertical-align:middle;box-shadow:2px 2px 0 #000}
table.t{border-collapse:collapse;width:100%}
table.t td,table.t th{border-bottom:2px solid #55557f;padding:3px 6px;text-align:left;vertical-align:top}
.doc{max-width:860px}
.doc h1{font-size:18px;margin:6px 0 10px}
.doc h2{font-size:15px;margin:22px 0 8px;color:var(--gold);border-bottom:3px solid var(--line);padding-bottom:3px;text-transform:uppercase;letter-spacing:1px}
.doc h3{font-size:13px;color:var(--blue)}
.doc code{background:var(--ink);border:2px solid #55557f;padding:0 4px;color:var(--green)}
.doc pre{background:var(--ink);border:3px solid #55557f;padding:8px;overflow:auto}
.doc pre code{border:0;padding:0}
.doc table{border-collapse:collapse;width:100%;margin:8px 0}
.doc th,.doc td{border:2px solid #55557f;padding:4px 8px;text-align:left;vertical-align:top}
.doc th{background:var(--panel);color:var(--gold)}
.doc li{margin:2px 0}
.toc a{display:block;color:var(--text);text-decoration:none;padding:3px 6px;border-left:4px solid transparent;cursor:pointer;font-size:13px}
.toc a:hover{border-left-color:var(--gold);background:var(--panel)}
@media (max-width:1100px){main{grid-template-columns:1fr}aside,section,#diag{max-height:none;border-right:0;border-bottom:3px solid var(--line)}label{grid-template-columns:1fr}label .help{grid-column:1}}
</style>
</head>
<body>
<header>
  <div class="logo"><span class="sprite"></span><h1>People Library Editor</h1></div>
  <nav id="tabs"></nav>
  <button id="hints" title="Show or hide the explanation under every field">Hints: on</button>
  <button id="save" class="primary">Save to library/</button>
  <span id="status">loading...</span>
</header>
<main>
  <aside id="list"></aside>
  <section id="form"></section>
  <div id="diag"></div>
</main>
<script>
var BT = String.fromCharCode(96);
var FILES = ['guide','archetypes','quirks','names','departments','tables','preview'];
var LABELS = { guide: 'Guide', archetypes: 'Archetypes', quirks: 'Quirks', names: 'Names', departments: 'Departments', tables: 'Data tables', preview: 'Preview' };
var state = { data: null, tab: 'guide', sel: 0, dirty: false, diag: [], timer: null, guide: null };
var $ = function (id) { return document.getElementById(id); };

/* ---------- what each tab is for, and how to use it ---------- */
var INTRO = {
  archetypes: { what: 'An archetype is a starting point for a kind of person (an ambitious climber, a tired veteran). It does not fix anyone: it shifts the odds of their temperament, values and quirks.',
    tips: ['Temperament entries are [mean, spread]: [78, 12] means "usually near 78, plausibly 54 to 100". Axes you leave out use [50, 18].', 'weight is how common the archetype is. 1 is normal, 0.5 rare, 1.5 common.', 'function_bias makes an archetype more likely when a story asks for a role, e.g. tempter: 3.', 'Change one thing, then open the Preview tab with 500+ people to see the effect.'] },
  quirks: { what: 'A quirk is a small habit or mannerism ("keeps a notebook", "gossips"). Each person gets two or three. They colour behaviour and, later, how people speak.',
    tips: ['Fill both English and Vietnamese names; the validator refuses a quirk with a missing language.', 'List incompatible quirks in both directions, or the validator warns.', 'Describe behaviour, never a group of people. A quirk that reads as a stereotype should not be added.', 'temperament_shift nudges a person by a few points only (keep it between -6 and +6).'] },
  names: { what: 'Names are drawn by weight. A person has a family name, usually a middle name, and a given name. "older" and "younger" lean a name towards people born before or after 1985.',
    tips: ['Weights are relative, not percentages: 38 vs 11 means about 3.5 times as common.', 'Give a name an "older" or "younger" number above 1 to favour that era (2 = twice as likely).', 'Keep proper Vietnamese spelling and diacritics.'] },
  departments: { what: 'A department profile says who works there: share of women, age profile, minimum education and base income. The generator reads these; nothing is hard-coded.',
    tips: ['female_share is 0 to 1 (0.78 means 78 percent women).', 'age_mean and age_sd shape a bell curve; age_min and age_max are hard limits.', 'income_base_vnd is the monthly pay of the first ladder step.', '"external" is for spouses and parents, who work anywhere.'] },
  tables: { what: 'Real-world statistics the generator uses (regions, education, marriage, children, birth sex ratio, spouse age gap). Each table must say where its numbers come from.',
    tips: ['A table is "verified" only when a person has checked it against the named source and described the check in note.', 'Probability rows must add up to 1 and cover every age from 18 to 65.', 'If there is no reliable data, say so in note instead of inventing precision.', 'Unverified tables are listed in the panel on the right.'] },
  preview: { what: 'Generate a group of people from the library as it is now (even unsaved) and see the distributions next to the department targets.',
    tips: ['Use 500 or more people; small groups are noisy.', 'Choose a story function to see how it shifts the cast (e.g. tempter).', 'Change the run seed to see that different seeds give different people with the same distribution.'] }
};
/* one-line explanation under a field, by field name */
var HELP = {
  id: 'A short unique name used by other entries to refer to this one. Lower case with underscores.',
  weight: 'How common this entry is, relative to its siblings. 1 normal, 0.5 rare, 1.5 common.',
  name: 'What the player sees, in English and Vietnamese.',
  temperament: 'Per axis: [mean, spread] on a 0 to 100 scale. Axes: caution, ambition, warmth, integrity, resilience, impulsivity.',
  caution: 'How careful and risk-averse a person is.', ambition: 'How hard they push to rise.', warmth: 'How friendly and generous they are.',
  integrity: 'How firmly they stick to what is right when it costs them.', resilience: 'How well they bear pressure.', impulsivity: 'How quickly they act without thinking.',
  value_affinity: 'Multiplies the chance of a value (security, status, fairness, loyalty, freedom, family, money, craft). Default 1.',
  quirk_affinity: 'Multiplies the chance of a quirk by its id. Default 1.',
  function_bias: 'Multiplies this archetype\'s chance when a story asks for a role (tempter, whistleblower, rival...).',
  voice: 'Speech tags that will later choose how the person talks.',
  tags: 'Free labels for grouping and searching.',
  incompatible_with: 'Quirk ids that never appear with this one. Always list both directions.',
  temperament_shift: 'A small nudge (a few points) to a temperament axis when this quirk is present.',
  older: 'Multiplier for people born before 1985 (above 1 favours them).', younger: 'Multiplier for people born in 1985 or later.',
  family: 'Family names with weights.', middle: 'Middle names by gender with weights.', given: 'Given names by gender with weights.',
  department: 'The department id used by scenes and roles.', female_share: 'Share of women, 0 to 1.',
  age_mean: 'Average age.', age_sd: 'Spread of ages (standard deviation); larger means a wider range.', age_min: 'Youngest allowed.', age_max: 'Oldest allowed.',
  min_education: 'Lowest education level for this department.', income_base_vnd: 'Monthly pay in VND at the first ladder step.',
  source: 'Where the numbers come from (publisher and document).', year: 'The year the figures describe.',
  verified: 'True only after a person checked the numbers against the source.', note: 'What was checked, or what is approximate.', rows: 'The data rows.',
  region: 'north, centre or south.', urban_share: 'Share of people living in towns, 0 to 1.',
  age_from: 'First age of this band.', age_to: 'Last age of this band.', gender: 'female, male, or any.',
  single: 'Share never married.', partnered: 'Share living together unmarried.', married: 'Share married.', divorced: 'Share divorced.', widowed: 'Share widowed.',
  lower_secondary: 'Share with lower-secondary education only.', upper_secondary: 'Share with upper-secondary.', vocational: 'Share with vocational training.',
  college: 'Share with college.', university: 'Share with a university degree.', postgraduate: 'Share with a postgraduate degree.',
  married_mean: 'Average number of children for married people.', other_mean: 'Average number of children for everyone else.',
  path: 'How someone got the job.', male_share: 'Share of boys among births (0.527 means 111 boys per 100 girls).',
  husband_older_mean: 'Average years the husband is older than the wife.', spread: 'Spread of the age gap in years.',
  en: 'English text.', vi: 'Vietnamese text.'
};

function el(tag, attrs, kids) {
  var e = document.createElement(tag);
  for (var k in (attrs || {})) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
  (kids || []).forEach(function (c) { e.appendChild(c); });
  return e;
}
function api(path, body) {
  return fetch(path, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {}).then(function (r) { return r.json(); });
}
function setStatus(t) { $('status').textContent = t; }
function changed() {
  state.dirty = true; setStatus('unsaved changes');
  clearTimeout(state.timer);
  state.timer = setTimeout(validate, 350);
}
function validate() { api('/api/validate', state.data).then(function (r) { state.diag = r.diagnostics; renderDiag(); }); }
function renderDiag() {
  var d = $('diag'); d.textContent = '';
  var errs = state.diag.filter(function (x) { return x.severity === 'error'; }).length;
  var warns = state.diag.filter(function (x) { return x.severity === 'warning'; }).length;
  d.appendChild(el('h3', { text: 'Checks: ' + errs + ' error(s), ' + warns + ' warning(s)', class: errs ? 'err' : 'good' }));
  d.appendChild(el('p', { class: 'small', text: 'The library is checked as you type. It cannot be saved while there are errors.' }));
  state.diag.filter(function (x) { return x.severity !== 'info'; }).forEach(function (x) {
    d.appendChild(el('div', { class: x.severity === 'error' ? 'err' : 'warn', text: (x.severity === 'error' ? '[X] ' : '[!] ') + x.code + (x.where ? ' [' + x.where + ']' : '') + ': ' + x.message }));
  });
  var unverified = state.diag.filter(function (x) { return x.code === 'table.unverified'; });
  if (unverified.length) d.appendChild(el('p', { class: 'small', text: 'Not yet verified against their source: ' + unverified.map(function (x) { return x.where; }).join(', ') + '. See the Guide, section 6.' }));
}
function renderTabs() {
  var t = $('tabs'); t.textContent = '';
  FILES.forEach(function (f) {
    var b = el('button', { text: LABELS[f], class: f === state.tab ? 'on' : '' });
    b.onclick = function () { state.tab = f; state.sel = 0; render(); };
    t.appendChild(b);
  });
}
function itemName(x, i) { return (x && (x.id || x.department || (x.name && x.name.en) || x.region || x.path)) || ('#' + (i + 1)); }

/* ---------- a generic editor for any JSON value ---------- */
function labelRow(label, input) {
  var kids = [el('span', { class: 'k', text: label }), input];
  if (HELP[label]) kids.push(el('span', { class: 'help', text: HELP[label] }));
  return el('label', {}, kids);
}
function editor(value, set, label, depth) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    var keys = Object.keys(value);
    if (keys.length === 2 && 'en' in value && 'vi' in value) {
      var box = el('fieldset', {}, [el('legend', { text: label })]);
      ['en', 'vi'].forEach(function (lg) { box.appendChild(editor(value[lg], function (v) { value[lg] = v; set(value); }, lg, depth + 1)); });
      return box;
    }
    var legend = el('legend', { text: label });
    var fs = el('fieldset', {}, [legend]);
    if (HELP[label] && depth > 0) fs.appendChild(el('div', { class: 'small help', text: HELP[label] }));
    keys.forEach(function (k) { fs.appendChild(editor(value[k], function (v) { value[k] = v; set(value); }, k, depth + 1)); });
    return fs;
  }
  if (Array.isArray(value)) {
    var allPrim = value.every(function (v) { return typeof v !== 'object' || v === null; });
    if (allPrim) {
      var inp = el('input', { value: value.join(', ') });
      inp.oninput = function () {
        var raw = inp.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        set(raw.map(function (s) { return value.length && typeof value[0] === 'number' ? Number(s) : s; }));
      };
      return labelRow(label, inp);
    }
    var fs2 = el('fieldset', {}, [el('legend', { text: label + ' (' + value.length + ')' })]);
    if (HELP[label]) fs2.appendChild(el('div', { class: 'small help', text: HELP[label] }));
    value.forEach(function (row, i) {
      var inner = editor(row, function (v) { value[i] = v; set(value); }, itemName(row, i), depth + 1);
      var rm = el('button', { text: 'remove row', class: 'danger' });
      rm.onclick = function () { value.splice(i, 1); set(value); render(); };
      inner.appendChild(rm); fs2.appendChild(inner);
    });
    if (value.length) {
      var add = el('button', { text: 'add row' });
      add.onclick = function () { value.push(JSON.parse(JSON.stringify(value[value.length - 1]))); set(value); render(); };
      fs2.appendChild(add);
    }
    return fs2;
  }
  var input;
  if (typeof value === 'boolean') {
    input = el('input', { type: 'checkbox' }); input.checked = value; input.onchange = function () { set(input.checked); };
  } else if (typeof value === 'number') {
    input = el('input', { type: 'number', step: 'any', value: String(value) }); input.oninput = function () { set(Number(input.value)); };
  } else {
    input = el('input', { value: String(value) }); input.oninput = function () { set(input.value); };
  }
  return labelRow(label, input);
}
function introBox(tab) {
  var i = INTRO[tab]; if (!i) return null;
  var ul = el('ul'); i.tips.forEach(function (t) { ul.appendChild(el('li', { text: t })); });
  return el('div', { class: 'box' }, [el('b', { text: LABELS[tab] }), el('div', { text: i.what }), ul]);
}

/* ---------- the guide: a small markdown reader ---------- */
function inline(text) {
  var frag = document.createDocumentFragment();
  text.split(BT).forEach(function (part, i) {
    if (i % 2 === 1) { frag.appendChild(el('code', { text: part })); return; }
    part.split('**').forEach(function (p, j) { frag.appendChild(j % 2 === 1 ? el('b', { text: p }) : document.createTextNode(p)); });
  });
  return frag;
}
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function renderMarkdown(md) {
  var root = el('div', { class: 'doc' });
  var lines = md.split(/\r?\n/), i = 0;
  while (i < lines.length) {
    var ln = lines[i];
    if (ln.indexOf(BT + BT + BT) === 0) {
      var code = []; i++;
      while (i < lines.length && lines[i].indexOf(BT + BT + BT) !== 0) { code.push(lines[i]); i++; }
      i++; root.appendChild(el('pre', {}, [el('code', { text: code.join('\n') })])); continue;
    }
    var h = /^(#{1,3}) (.*)$/.exec(ln);
    if (h) { var he = el('h' + h[1].length, { id: 'g-' + slug(h[2]) }); he.appendChild(inline(h[2])); root.appendChild(he); i++; continue; }
    if (ln.charAt(0) === '|') {
      var rows = [];
      while (i < lines.length && lines[i].charAt(0) === '|') { rows.push(lines[i]); i++; }
      var cells = function (r) { return r.replace(/^\||\|$/g, '').split('|').map(function (c) { return c.trim(); }); };
      var table = el('table'); var head = cells(rows[0]);
      var tr = el('tr'); head.forEach(function (c) { var th = el('th'); th.appendChild(inline(c)); tr.appendChild(th); }); table.appendChild(tr);
      rows.slice(2).forEach(function (r) { var row = el('tr'); cells(r).forEach(function (c) { var td = el('td'); td.appendChild(inline(c)); row.appendChild(td); }); table.appendChild(row); });
      root.appendChild(table); continue;
    }
    if (/^(- |\d+\. )/.test(ln)) {
      var ordered = /^\d+\. /.test(ln); var list = el(ordered ? 'ol' : 'ul');
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) { var li = el('li'); li.appendChild(inline(lines[i].replace(/^(- |\d+\. )/, ''))); list.appendChild(li); i++; }
      root.appendChild(list); continue;
    }
    if (ln.trim() === '') { i++; continue; }
    var para = [ln]; i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,3} |\||- |\d+\. )/.test(lines[i]) && lines[i].indexOf(BT + BT + BT) !== 0) { para.push(lines[i]); i++; }
    var p = el('p'); p.appendChild(inline(para.join(' '))); root.appendChild(p);
  }
  return root;
}
function renderGuide(list, form) {
  if (!state.guide) { form.appendChild(el('p', { text: 'Loading the guide...' })); api('/api/guide').then(function (r) { state.guide = r.markdown || 'The guide file was not found.'; render(); }); return; }
  var doc = renderMarkdown(state.guide);
  var toc = el('div', { class: 'toc' });
  doc.querySelectorAll('h1,h2').forEach(function (h) {
    var a = el('a', { text: h.textContent }); a.onclick = function () { h.scrollIntoView(); }; toc.appendChild(a);
  });
  list.appendChild(el('h3', { text: 'Contents' })); list.appendChild(toc);
  form.appendChild(doc);
}

/* ---------- views ---------- */
function render() {
  renderTabs();
  var list = $('list'), form = $('form');
  list.textContent = ''; form.textContent = '';
  if (state.tab === 'guide') { renderGuide(list, form); return; }
  if (state.tab === 'preview') { renderPreview(list, form); return; }
  var intro = introBox(state.tab); if (intro) form.appendChild(intro);
  var data = state.data[state.tab];
  if (Array.isArray(data)) {
    data.forEach(function (x, i) {
      var b = el('button', { text: itemName(x, i), class: 'item' + (i === state.sel ? ' on' : '') });
      b.onclick = function () { state.sel = i; render(); };
      list.appendChild(b);
    });
    var add = el('button', { text: '+ new ' + state.tab.replace(/s$/, ''), class: 'primary' });
    add.onclick = function () { data.push(JSON.parse(JSON.stringify(data[Math.max(0, data.length - 1)]))); state.sel = data.length - 1; changed(); render(); };
    list.appendChild(add);
    var del = el('button', { text: 'delete selected', class: 'danger' });
    del.onclick = function () { if (confirm('Delete ' + itemName(data[state.sel], state.sel) + '?')) { data.splice(state.sel, 1); state.sel = 0; changed(); render(); } };
    list.appendChild(del);
    list.appendChild(el('p', { class: 'small', text: 'A new entry starts as a copy of the last one: change its id and texts.' }));
    if (data[state.sel]) form.appendChild(editor(data[state.sel], function (v) { data[state.sel] = v; changed(); }, itemName(data[state.sel], state.sel), 0));
  } else {
    var keys = Object.keys(data);
    keys.forEach(function (k, i) {
      var b = el('button', { text: k, class: 'item' + (i === state.sel ? ' on' : '') });
      b.onclick = function () { state.sel = i; render(); };
      list.appendChild(b);
    });
    var key = keys[Math.min(state.sel, keys.length - 1)];
    form.appendChild(editor(data[key], function (v) { data[key] = v; changed(); }, key, 0));
  }
}
function renderPreview(list, form) {
  var intro = introBox('preview'); if (intro) form.appendChild(intro);
  var depts = state.data.departments.map(function (d) { return d.department; });
  var stories = ['(none)','complainant','accused','tempter','rival','mentor','whistleblower','witness'];
  function sel(id, opts, v) { var s = el('select', { id: id }); opts.forEach(function (o) { var op = el('option', { text: o, value: o }); if (o === v) op.selected = true; s.appendChild(op); }); return s; }
  list.appendChild(el('h3', { text: 'Generate' }));
  list.appendChild(el('p', { class: 'small', text: 'Uses the library as it is now, saved or not.' }));
  var dept = sel('pv-dept', depts, state.pv && state.pv.dept || depts[0]);
  var story = sel('pv-story', stories, state.pv && state.pv.story || '(none)');
  var n = el('input', { id: 'pv-n', type: 'number', value: String(state.pv && state.pv.n || 500) });
  var seed = el('input', { id: 'pv-seed', value: state.pv && state.pv.seed || 'editor' });
  [['department', dept, 'Whose department profile to use.'], ['story function', story, 'A role a story asks for; it shifts the archetype odds.'], ['how many', n, '500 or more gives a steady picture.'], ['run seed', seed, 'Another seed gives different people with the same distribution.']].forEach(function (p) {
    list.appendChild(el('label', {}, [el('span', { class: 'k', text: p[0] }), p[1], el('span', { class: 'help', text: p[2] })]));
  });
  var go = el('button', { text: 'Generate', class: 'primary' });
  go.onclick = function () {
    state.pv = { dept: dept.value, story: story.value, n: Number(n.value), seed: seed.value };
    setStatus('generating...');
    api('/api/preview', { raw: state.data, department: dept.value, n: Number(n.value), function: story.value === '(none)' ? undefined : story.value, seed: seed.value }).then(function (r) { setStatus('ready'); showPreview(form, r); });
  };
  list.appendChild(go);
  if (state.pvResult) showPreview(form, state.pvResult);
}
function bars(obj, scale) {
  var t = el('table', { class: 't' });
  Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a]; }).forEach(function (k) {
    var v = obj[k]; if (v < 0.0005 && scale === 'pct') return;
    var w = scale === 'pct' ? v * 100 * 3 : v * 2.4;
    t.appendChild(el('tr', {}, [el('td', { text: k }), el('td', {}, [el('span', { class: 'bar', style: 'width:' + Math.max(2, w) + 'px' })]), el('td', { text: scale === 'pct' ? (v * 100).toFixed(1) + '%' : v.toFixed(0) })]));
  });
  return t;
}
function showPreview(form, r) {
  var keep = form.firstChild && form.firstChild.className === 'box' ? form.firstChild : null;
  form.textContent = ''; if (keep) form.appendChild(keep);
  state.pvResult = r;
  if (r.error) { form.appendChild(el('p', { class: 'err', text: r.error })); return; }
  var s = r.summary;
  form.appendChild(el('h3', { text: s.count + ' people: women ' + (s.female_share * 100).toFixed(1) + '% (target ' + (r.target.female_share * 100).toFixed(0) + '%), age ' + s.age_mean.toFixed(1) + ' +/- ' + s.age_sd.toFixed(1) + ' (target ' + r.target.age_mean + ' +/- ' + r.target.age_sd + ')' }));
  [['Education', s.education, 'pct'], ['Marital status', s.marital, 'pct'], ['Married by age band', s.married_by_band, 'pct'], ['Archetypes', s.archetypes, 'pct'], ['Temperament (mean 0-100)', s.temperament_mean, 'num']].forEach(function (b) {
    form.appendChild(el('fieldset', {}, [el('legend', { text: b[0] }), bars(b[1], b[2])]));
  });
  form.appendChild(el('fieldset', {}, [el('legend', { text: 'Quirks (share of people who have it)' }), bars(s.quirks, 'pct')]));
  form.appendChild(el('p', { class: 'small', text: 'Children ' + s.children_mean.toFixed(2) + ', dependents ' + s.dependents_mean.toFixed(2) + ', money pressure ' + s.money_pressure_mean.toFixed(1) + ', distinct full names ' + s.names_distinct }));
  var t = el('table', { class: 't' }, [el('tr', {}, ['person', 'archetype', 'quirks', 'values', 'life'].map(function (h) { return el('th', { text: h }); }))]);
  r.sample.forEach(function (p) { t.appendChild(el('tr', {}, [p.name, p.archetype, p.quirks, p.values, p.life].map(function (x) { return el('td', { text: x }); }))); });
  form.appendChild(el('fieldset', {}, [el('legend', { text: 'Sample of 12' }), t]));
}
$('save').onclick = function () {
  setStatus('saving...');
  api('/api/save', state.data).then(function (r) {
    if (r.ok) { state.dirty = false; setStatus('saved ' + new Date().toLocaleTimeString()); } else { setStatus('not saved: fix the errors first'); }
    state.diag = r.diagnostics; renderDiag();
  });
};
$('hints').onclick = function () {
  var off = document.body.classList.toggle('nohelp');
  $('hints').textContent = 'Hints: ' + (off ? 'off' : 'on');
};
window.onbeforeunload = function () { return state.dirty ? 'unsaved changes' : undefined; };
api('/api/library').then(function (r) { state.data = r.raw; state.diag = r.diagnostics; setStatus('loaded'); render(); renderDiag(); });
</script>
</body>
</html>
`;
