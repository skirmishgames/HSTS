(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'all', name: 'All boxes' }, { id: 'bro', name: 'Big Red One' }, { id: 'omaha', name: 'Bloody Omaha' }, { id: 'caen-ecg', name: 'Battle for Caen: Epsom, Charnwood & Goodwood' }, { id: 'caen-wj', name: 'Battle Pack #3: Windsor & Jupiter' }, { id: 'promo', name: 'Promo heroes' }, { id: 'hos', name: 'Heroes of Stalingrad' }];
  var SETBOX = { CB: 'bro', BO: 'omaha', ECG: 'caen-ecg', BP3: 'caen-wj', 'HoS-CB': 'hos', 'HoS-BP': 'hos', 'HoS-KS': 'hos', 'HoS-HP': 'hos' };
  var HOSN = { ru: 1, gs: 1 };
  function boxOf(t) { return SETBOX[t.set] || 'promo'; }
  function boxName(id) { return BOXES.filter(function (b) { return b.id === id; })[0].name; }
  var NATIONS = [{ id: 'us', name: 'United States' }, { id: 'ge', name: 'Germany' }, { id: 'uk', name: 'Commonwealth' }, { id: 'ru', name: 'Soviet Union (Stalingrad)' }, { id: 'gs', name: 'Germany (Stalingrad)' }];
  var CATS = [['customization', 'Customizations'], ['gear', 'Gear'], ['trait', 'Character traits'], ['support', 'Support units'], ['order', 'Orders']];
  var STRIPE = { R: 'red', Y: 'yellow', B: 'blue', LB: 'light blue', W: 'white', K: 'black', G: 'green', T: 'tan', O: 'orange', OL: 'olive', CR: 'cream', BL: 'blue', LY: 'pale yellow', WR: 'white and red', KG: 'black and green', BCG: 'blue, cream and green', BRD: 'blue and red', cmd: 'command', custom: 'customization', any: 'common', all: 'any option' };
  var KIND = { officer: 'Officer', character: 'Character', infantry: 'Infantry', weapon: 'Weapon', vehicle: 'Vehicle', marker: 'Marker', aircraft: 'Aircraft' };
  var S = { b: 'all', n: 'us', q: '', open: {}, theme: 'light' };
  var cache = {};
  var OWN = window.HTS_OWN;
  var EQBOX = { bro: 'CB', omaha: 'BO', 'caen-ecg': 'ECG', 'caen-wj': 'BP3' };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function tokens(q) { return norm(q).split(' ').filter(Boolean); }
  function hit(hay, padded, t) { return t.length <= 2 ? padded.indexOf(' ' + t + ' ') >= 0 : hay.indexOf(t) >= 0; }
  function markFn(toks) {
    if (!toks.length) return esc;
    var re = new RegExp('(' + toks.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return function (s) { return esc(s).replace(re, '<mark>$1</mark>'); };
  }
  // same rule as the army builder
  function fits(slot, opt) {
    if (slot.stripes.indexOf('all') >= 0) return true;
    if (slot.size !== opt.size) return false;
    if (opt.stripes.indexOf('any') >= 0) return true;
    return opt.stripes.some(function (s) { return slot.stripes.indexOf(s) >= 0; });
  }
  function cost(o) { return o.cost == null ? 'SP' : o.cost; }

  function load() {
    var key = (HOSN[S.n] ? 'hon-hos-' : 'hon-bro-') + S.n;
    if (cache[key]) return cache[key];
    var d = window.HTS_DATA[key], opts = {};
    d.options.forEach(function (o) { opts[o.id] = o; });
    var heroes = d.tiles.filter(function (t) { return t.type === 'hero'; }).map(function (t) {
      t.hay = norm(t.name + ' ' + (t.sub || '') + ' ' + t.units.map(function (u) { return u[0] + ' ' + u[2]; }).join(' ') + ' ' + (t.note || ''));
      t.head = norm(t.name);
      return t;
    });
    cache[key] = { d: d, opts: opts, heroes: heroes };
    return cache[key];
  }

  function renderControls() {
    $('boxes').innerHTML = BOXES.map(function (b) { return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>'; }).join('');
    $('nations').innerHTML = NATIONS.map(function (n) { return '<button type="button" data-nation="' + n.id + '" class="' + (S.n === n.id ? 'on' : '') + '" aria-pressed="' + (S.n === n.id) + '">' + n.name + '</button>'; }).join('');
    $('q').value = S.q;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function slotText(s) {
    return (s.size === 'w' ? 'Wide' : 'Narrow') + ' slot, ' + s.stripes.map(function (x) { return STRIPE[x] || x; }).join(' or ') + ' stripes';
  }
  function takeList(D, slot) {
    var out = '';
    CATS.forEach(function (c) {
      var list = D.d.options.filter(function (o) { return o.cat === c[0] && fits(slot, o); });
      if (!list.length) return;
      out += '<p class="htake"><strong>' + c[1] + '</strong> ' + list.map(function (o) { return '<span class="tchip">' + esc(o.name) + ' <i>' + cost(o) + '</i></span>'; }).join('') + '</p>';
    });
    return out || '<p class="htext">Nothing fits this slot.</p>';
  }
  function body(t) {
    var D = load(), slots = t.slots || [], sig = slots.map(function (s) { return s.size + s.stripes.join(','); }), same = sig.every(function (x) { return x === sig[0]; });
    var html = '<div class="hhero"><img class="htile" src="' + esc(t.img) + '" alt="' + esc(t.name + ', ' + (t.sub || '') + ' recruitment tile') + '" width="' + t.w + '" height="' + t.h + '" loading="lazy"></div>';
    html += '<p class="htext"><strong>Units:</strong> ' + t.units.map(function (u) { return esc(u[0]) + ' (' + esc(KIND[u[2]] || u[2]) + ')'; }).join(', ') + '.</p>';
    if (t.note) html += '<p class="htext">' + esc(t.note) + '</p>';
    var bo = !HOSN[S.n] && window.HTS_GUIDES && window.HTS_GUIDES.heroes[String(t.name).toLowerCase()];
    if (bo) html += '<p class="htext"><strong>Based on:</strong> ' + esc(bo) + ' <a href="guides.html?g=who-are-these-heroes">All the heroes</a></p>';
    if (!slots.length) html += '<p class="htext">This tile has no option slots.</p>';
    else if (same) html += '<h4 class="hsub">' + (slots.length === 1 ? 'Slot' : 'All ' + slots.length + ' slots') + ': ' + esc(slotText(slots[0]).toLowerCase()) + '</h4><p class="hsrc">What it can take</p>' + takeList(D, slots[0]);
    else slots.forEach(function (s, i) { html += '<h4 class="hsub">Slot ' + (i + 1) + ': ' + esc(slotText(s).toLowerCase()) + '</h4>' + takeList(D, s); });
    html += '<p class="hfind"><a href="units.html?n=' + S.n + '&amp;q=' + encodeURIComponent(t.name) + '">In the unit index</a> <a href="rules.html?q=' + encodeURIComponent('heroes characters') + '">Rules: Heroes &amp; characters</a></p>';
    html += '<p class="hsrc">' + esc(boxName(boxOf(t))) + ', set ' + esc(t.set) + '. Costs are in army points; SP means the scenario sets the cost.</p>';
    return html;
  }
  function row(t, mk) {
    var isOpen = S.open[t.id] === 1;
    return '<div class="hrow' + (isOpen ? ' open' : '') + '" id="h-' + esc(t.id) + '">' +
      '<button type="button" class="hhead" data-toggle="' + esc(t.id) + '" aria-expanded="' + isOpen + '" aria-controls="hb-' + esc(t.id) + '">' +
      '<span class="hname"><span class="ht">' + mk(t.name) + '</span><span class="hsnip">' + mk(t.sub || '') + '</span></span>' +
      '<span class="hbadges"><span class="hb">' + esc(boxName(boxOf(t))) + '</span><span class="hb ' + ('hb-' + S.n) + '">' + t.cost + ' pts</span></span>' +
      '<span class="hchev" aria-hidden="true"></span></button>' +
      '<div class="hbody" id="hb-' + esc(t.id) + '"' + (isOpen ? '' : ' hidden') + '>' + (isOpen ? body(t) : '') + '</div></div>';
  }
  function ncol() { return window.innerWidth >= 900 ? 2 : 1; }
  function list(items, mk) {
    var n = ncol(), cols = [], per = Math.ceil(items.length / n);
    for (var k = 0; k < n; k++) cols.push('');
    items.forEach(function (t, i) { cols[Math.floor(i / per)] += row(t, mk); });
    return '<div class="hlist">' + cols.map(function (c) { return '<div class="hcol">' + c + '</div>'; }).join('') + '</div>';
  }

  function equipCard(q, mk, D) {
    var o = D.opts[q.opt];
    return '<article class="eqcard" id="e-' + esc(q.id) + '"><h3>' + mk(q.name) + ' <span class="hb">' + esc(boxName(q.box)) + '</span>' + (o ? ' <span class="hb ' + (S.n === 'us' ? 'hb-us' : 'hb-ge') + '">' + cost(o) + ' pts</span>' : '') + '</h3>' +
      '<div class="tfaces eqfaces">' + q.faces.map(function (f) {
        return '<figure class="tface eqface"><img src="' + esc(f.img) + '" alt="' + esc(q.name + ': ' + f.label) + '" width="' + f.w + '" height="' + f.h + '" loading="lazy"><figcaption>' + esc(f.label) + '</figcaption></figure>';
      }).join('') + '</div>' +
      '<p class="htext">' + mk(q.text) + '</p>' +
      (q.facts.length ? '<dl class="sfacts">' + q.facts.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('') + '</dl>' : '') +
      (q.links.length ? '<p class="hfind">' + q.links.map(function (l) { return '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>'; }).join(' ') + '</p>' : '') +
      '</article>';
  }

  function render() {
    var D = load(), toks = tokens(S.q), mk = markFn(toks);
    renderControls();
    var heroes = D.heroes.filter(function (t) { var p = ' ' + t.hay + ' '; return (S.b === 'all' || boxOf(t) === S.b) && toks.every(function (k) { return hit(t.hay, p, k); }); });
    var eq = window.HTS_HEROES.equipment.filter(function (q) { var h = norm(q.name + ' ' + q.text), p = ' ' + h + ' '; return (S.b === 'all' || q.box === S.b) && toks.every(function (k) { return hit(h, p, k); }); });
    var hid = 0;
    if (OWN && OWN.active()) {
      var h0 = heroes.length + eq.length;
      heroes = heroes.filter(function (t) { return OWN.owns(t.set); });
      eq = eq.filter(function (q) { return OWN.owns(EQBOX[q.box]); });
      hid = h0 - heroes.length - eq.length;
    }
    if ($('ownnote')) $('ownnote').innerHTML = OWN ? OWN.note(hid, hid === 1 ? 'hero or equipment item' : 'heroes and equipment items') : '';
    var html = '<section class="hgroup"><h2 class="hh">Hero tiles <span class="hcount">' + heroes.length + '</span></h2>' +
      (heroes.length ? list(heroes, mk) : '<p class="empty2">No hero matches.</p>') + '</section>' +
      (HOSN[S.n] ? '<section class="hgroup"><h2 class="hh">Equipment</h2><p class="htext hintro">Heroes of Stalingrad equipment is listed as options. Open a hero to see what fits its slots, or look in the <a href="units.html?b=hos&amp;n=' + S.n + '">unit index</a>.</p></section>' :
      '<section class="hgroup"><h2 class="hh">Equipment cards and markers <span class="hcount">' + eq.length + '</span></h2>' +
      '<p class="htext hintro">Customizations for Characters. They fit the slot on a hero tile and the slots on a Command tile, and they work for both armies.</p>' +
      (eq.length ? '<div class="eqgrid">' + eq.map(function (q) { return equipCard(q, mk, D); }).join('') + '</div>' : '<p class="empty2">No equipment matches.</p>') + '</section>');
    $('out').innerHTML = html;
    $('stat').textContent = HOSN[S.n] ? heroes.length + ' hero tile' + (heroes.length === 1 ? '' : 's') + '. Open a hero to see what it can take.' : heroes.length + ' hero tile' + (heroes.length === 1 ? '' : 's') + ' and ' + eq.length + ' equipment card' + (eq.length === 1 ? '' : 's') + '. Open a hero to see what it can take.';
    url();
  }

  function toggle(id) {
    var D = load(), t = D.heroes.filter(function (x) { return x.id === id; })[0], r = $('h-' + id);
    if (!t || !r) return;
    var open = S.open[id] !== 1;
    if (open) S.open[id] = 1; else delete S.open[id];
    var b = r.querySelector('.hbody'), h = r.querySelector('.hhead');
    if (open && !b.firstChild) b.innerHTML = body(t);
    b.hidden = !open; h.setAttribute('aria-expanded', String(open)); r.classList.toggle('open', open);
    url();
  }
  function url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b); p.set('n', S.n);
      if (S.q) p.set('q', S.q);
      var o = Object.keys(S.open); if (o.length) p.set('e', o.join(','));
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }
  var NCOL = 0;
  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; if (S.b === 'hos' && !HOSN[S.n]) S.n = 'ru'; else if (S.b !== 'hos' && S.b !== 'all' && HOSN[S.n]) S.n = 'us'; S.open = {}; render(); return; }
      if ((el = t.closest('[data-nation]'))) { S.n = el.dataset.nation; if (HOSN[S.n] && S.b !== 'all' && S.b !== 'hos') S.b = 'hos'; else if (!HOSN[S.n] && S.b === 'hos') S.b = 'all'; S.open = {}; render(); return; }
      if ((el = t.closest('[data-toggle]'))) toggle(el.dataset.toggle);
    });
    window.addEventListener('resize', function () { if (ncol() !== NCOL) { NCOL = ncol(); render(); } });
    var timer;
    $('q').oninput = function () { S.q = this.value; clearTimeout(timer); timer = setTimeout(render, 120); };
    $('btnTheme').onclick = function () {
      S.theme = S.theme === 'dark' ? 'light' : 'dark';
      try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = S.theme; localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
      document.documentElement.setAttribute('data-theme', S.theme);
      $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    };
  }
  function init() {
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) S.theme = j.theme; if (j.nation === 'ge' || j.nation === 'us' || j.nation === 'uk') S.n = j.nation; } catch (e) { /* ignore */ }
    var p = new URLSearchParams(location.search);
    if (NATIONS.some(function (n) { return n.id === p.get('n'); })) S.n = p.get('n');
    if (BOXES.some(function (b) { return b.id === p.get('b'); })) S.b = p.get('b');
    if (p.get('q')) S.q = p.get('q');
    if (p.get('e')) p.get('e').split(',').forEach(function (id) { if (/^[a-z0-9_]+$/.test(id)) S.open[id] = 1; });
    NCOL = ncol(); bind(); render();
    if (OWN) OWN.onChange(render);
    var first = Object.keys(S.open)[0]; if (first && $('h-' + first)) $('h-' + first).scrollIntoView({ block: 'center' });
  }
  init();
  window.HTS_HEROES_UI = { state: S, load: load };
})();
