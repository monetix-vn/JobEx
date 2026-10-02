/**
 * The page of the attribute library editor: plain HTML and JavaScript, no libraries, no network.
 * (Written without template-literal backticks inside the script so it can live in one string.)
 */
export const EDITOR_HTML = String.raw`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>People library editor</title>
<style>
:root{--bg:#14142a;--panel:#1d1d3a;--line:#3a3a6a;--text:#e8e8f4;--dim:#9a9ac0;--accent:#ffd166;--ok:#7bd88f;--bad:#ff7b7b;--warn:#ffb86b}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:14px/1.45 system-ui,Segoe UI,sans-serif}
header{display:flex;gap:12px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:5}
header h1{font-size:16px;margin:0;color:var(--accent)}
nav{display:flex;gap:6px;flex-wrap:wrap}
button{font:inherit;color:var(--text);background:var(--panel);border:1px solid var(--line);padding:5px 10px;border-radius:6px;cursor:pointer}
button:hover{border-color:var(--accent)}
button.on{background:var(--accent);color:#222;border-color:var(--accent)}
button.primary{background:var(--ok);color:#102}
#status{margin-left:auto;color:var(--dim)}
main{display:grid;grid-template-columns:260px 1fr 340px;gap:0;min-height:calc(100vh - 52px)}
aside,section,#diag{padding:12px;border-right:1px solid var(--line);overflow:auto;max-height:calc(100vh - 52px)}
#diag{border-right:0}
.item{display:block;width:100%;text-align:left;margin:0 0 4px;padding:5px 8px;border-radius:5px;border:1px solid transparent;background:transparent}
.item.on{background:var(--panel);border-color:var(--accent);color:var(--text)}
fieldset{border:1px solid var(--line);border-radius:8px;margin:8px 0;padding:8px 10px}
legend{color:var(--dim);padding:0 6px}
label{display:grid;grid-template-columns:150px 1fr;gap:8px;align-items:center;margin:4px 0}
label span{color:var(--dim);overflow-wrap:anywhere}
input,textarea,select{font:inherit;color:var(--text);background:#101024;border:1px solid var(--line);border-radius:5px;padding:4px 6px;width:100%}
input[type=number]{max-width:140px}
.row{display:flex;gap:6px;align-items:center}
.small{font-size:12px;color:var(--dim)}
.err{color:var(--bad)}.warn{color:var(--warn)}.info{color:var(--dim)}
.bar{height:10px;background:var(--accent);border-radius:3px;display:inline-block;vertical-align:middle}
table.t{border-collapse:collapse;width:100%}
table.t td,table.t th{border-bottom:1px solid var(--line);padding:3px 6px;text-align:left}
.pre{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
@media (max-width:1100px){main{grid-template-columns:1fr}aside,section,#diag{max-height:none;border-right:0}}
</style>
</head>
<body>
<header>
  <h1>People library editor</h1>
  <nav id="tabs"></nav>
  <button id="save" class="primary">Save to library/</button>
  <span id="status">loading...</span>
</header>
<main>
  <aside id="list"></aside>
  <section id="form"></section>
  <div id="diag"></div>
</main>
<script>
var FILES = ['archetypes','quirks','names','departments','tables','preview'];
var state = { data: null, tab: 'archetypes', sel: 0, dirty: false, diag: [], timer: null };
var $ = function (id) { return document.getElementById(id); };
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
function validate() {
  api('/api/validate', state.data).then(function (r) { state.diag = r.diagnostics; renderDiag(); });
}
function renderDiag() {
  var d = $('diag'); d.textContent = '';
  var errs = state.diag.filter(function (x) { return x.severity === 'error'; }).length;
  var warns = state.diag.filter(function (x) { return x.severity === 'warning'; }).length;
  d.appendChild(el('h3', { text: errs + ' error(s), ' + warns + ' warning(s)', class: errs ? 'err' : 'info' }));
  state.diag.filter(function (x) { return x.severity !== 'info'; }).forEach(function (x) {
    d.appendChild(el('div', { class: x.severity === 'error' ? 'err' : 'warn', text: x.code + (x.where ? ' [' + x.where + ']' : '') + ': ' + x.message }));
  });
  var unverified = state.diag.filter(function (x) { return x.code === 'table.unverified'; });
  if (unverified.length) d.appendChild(el('p', { class: 'small', text: 'Not yet verified against their source: ' + unverified.map(function (x) { return x.where; }).join(', ') }));
}
function renderTabs() {
  var t = $('tabs'); t.textContent = '';
  FILES.forEach(function (f) {
    var b = el('button', { text: f, class: f === state.tab ? 'on' : '' });
    b.onclick = function () { state.tab = f; state.sel = 0; render(); };
    t.appendChild(b);
  });
}
function itemName(x, i) { return (x && (x.id || x.department || (x.name && x.name.en) || x.region || x.path)) || ('#' + (i + 1)); }
/* a generic editor for any JSON value */
function editor(value, set, label, depth) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    var keys = Object.keys(value);
    if (keys.length === 2 && 'en' in value && 'vi' in value) {
      var box = el('fieldset', {}, [el('legend', { text: label })]);
      ['en', 'vi'].forEach(function (lg) { box.appendChild(editor(value[lg], function (v) { value[lg] = v; set(value); }, lg, depth + 1)); });
      return box;
    }
    var fs = el('fieldset', {}, [el('legend', { text: label })]);
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
      return el('label', {}, [el('span', { text: label + ' (comma list)' }), inp]);
    }
    var fs2 = el('fieldset', {}, [el('legend', { text: label + ' (' + value.length + ')' })]);
    value.forEach(function (row, i) {
      var inner = editor(row, function (v) { value[i] = v; set(value); }, itemName(row, i), depth + 1);
      var rm = el('button', { text: 'remove' });
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
  return el('label', {}, [el('span', { text: label }), input]);
}
function render() {
  renderTabs();
  var list = $('list'), form = $('form');
  list.textContent = ''; form.textContent = '';
  if (state.tab === 'preview') { renderPreview(list, form); return; }
  var data = state.data[state.tab];
  if (Array.isArray(data)) {
    data.forEach(function (x, i) {
      var b = el('button', { text: itemName(x, i), class: 'item' + (i === state.sel ? ' on' : '') });
      b.onclick = function () { state.sel = i; render(); };
      list.appendChild(b);
    });
    var add = el('button', { text: '+ new ' + state.tab.replace(/s$/, '') });
    add.onclick = function () { data.push(JSON.parse(JSON.stringify(data[Math.max(0, data.length - 1)]))); state.sel = data.length - 1; changed(); render(); };
    list.appendChild(add);
    var del = el('button', { text: 'delete selected' });
    del.onclick = function () { if (confirm('Delete ' + itemName(data[state.sel], state.sel) + '?')) { data.splice(state.sel, 1); state.sel = 0; changed(); render(); } };
    list.appendChild(del);
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
  var depts = state.data.departments.map(function (d) { return d.department; });
  var stories = ['(none)','complainant','accused','tempter','rival','mentor','whistleblower','witness'];
  function sel(id, opts, v) { var s = el('select', { id: id }); opts.forEach(function (o) { var op = el('option', { text: o, value: o }); if (o === v) op.selected = true; s.appendChild(op); }); return s; }
  list.appendChild(el('h3', { text: 'Generate with the current (unsaved) library' }));
  var dept = sel('pv-dept', depts, state.pv && state.pv.dept || depts[0]);
  var story = sel('pv-story', stories, state.pv && state.pv.story || '(none)');
  var n = el('input', { id: 'pv-n', type: 'number', value: String(state.pv && state.pv.n || 500) });
  var seed = el('input', { id: 'pv-seed', value: state.pv && state.pv.seed || 'editor' });
  [['department', dept], ['story function', story], ['how many', n], ['run seed', seed]].forEach(function (p) { list.appendChild(el('label', {}, [el('span', { text: p[0] }), p[1]])); });
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
    t.appendChild(el('tr', {}, [el('td', { text: k }), el('td', {}, [el('span', { class: 'bar', style: 'width:' + Math.max(1, w) + 'px' })]), el('td', { text: scale === 'pct' ? (v * 100).toFixed(1) + '%' : v.toFixed(0) })]));
  });
  return t;
}
function showPreview(form, r) {
  state.pvResult = r; form.textContent = '';
  if (r.error) { form.appendChild(el('p', { class: 'err', text: r.error })); return; }
  var s = r.summary;
  form.appendChild(el('h3', { text: s.count + ' people - women ' + (s.female_share * 100).toFixed(1) + '% (target ' + (r.target.female_share * 100).toFixed(0) + '%), age ' + s.age_mean.toFixed(1) + ' +/- ' + s.age_sd.toFixed(1) + ' (target ' + r.target.age_mean + ' +/- ' + r.target.age_sd + ')' }));
  [['Education', s.education, 'pct'], ['Marital status', s.marital, 'pct'], ['Married by age band', s.married_by_band, 'pct'], ['Archetypes', s.archetypes, 'pct'], ['Temperament (mean)', s.temperament_mean, 'num']].forEach(function (b) {
    form.appendChild(el('fieldset', {}, [el('legend', { text: b[0] }), bars(b[1], b[2])]));
  });
  var q = {}; Object.keys(s.quirks).forEach(function (k) { q[k] = s.quirks[k]; });
  form.appendChild(el('fieldset', {}, [el('legend', { text: 'Quirks (share of people with it)' }), bars(q, 'pct')]));
  form.appendChild(el('p', { class: 'small', text: 'Children ' + s.children_mean.toFixed(2) + ', dependents ' + s.dependents_mean.toFixed(2) + ', money pressure ' + s.money_pressure_mean.toFixed(1) + ', distinct full names ' + s.names_distinct }));
  var t = el('table', { class: 't' }, [el('tr', {}, ['person', 'archetype', 'quirks', 'values', 'life'].map(function (h) { return el('th', { text: h }); }))]);
  r.sample.forEach(function (p) { t.appendChild(el('tr', {}, [p.name, p.archetype, p.quirks, p.values, p.life].map(function (x) { return el('td', { text: x }); }))); });
  form.appendChild(el('fieldset', {}, [el('legend', { text: 'Sample' }), t]));
}
$('save').onclick = function () {
  setStatus('saving...');
  api('/api/save', state.data).then(function (r) {
    if (r.ok) { state.dirty = false; setStatus('saved ' + new Date().toLocaleTimeString()); } else { setStatus('not saved: fix the errors first'); }
    state.diag = r.diagnostics; renderDiag();
  });
};
window.onbeforeunload = function () { return state.dirty ? 'unsaved changes' : undefined; };
api('/api/library').then(function (r) { state.data = r.raw; state.diag = r.diagnostics; setStatus('loaded'); render(); renderDiag(); });
</script>
</body>
</html>
`;
