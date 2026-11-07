(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }, { id: 'omaha', name: 'Bloody Omaha' }];
  var S = { b: 'bro', q: '', type: 'all', open: {}, theme: 'light' };
  var cache = {}, NCOL = 0;
  var SRCN = { bro: 'Scenario Booklet', omaha: 'Bloody Omaha rulebook' };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  var STOP = { a: 1, an: 1, the: 1, of: 1, to: 1, in: 1, on: 1, and: 1, or: 1, for: 1, is: 1, it: 1, at: 1, by: 1, as: 1 };
  function tokens(q) {
    var all = norm(q).split(' ').filter(Boolean);
    var keep = all.filter(function (t) { return !STOP[t]; });
    return keep.length ? keep : all;
  }
  function hit(hay, padded, t) { return t.length <= 2 ? padded.indexOf(' ' + t + ' ') >= 0 : hay.indexOf(t) >= 0; }
  function countOf(hay, t) { var n = 0, i = -1; while ((i = hay.indexOf(t, i + 1)) >= 0) n++; return n; }
  function markFn(toks) {
    if (!toks.length) return esc;
    var re = new RegExp('(' + toks.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return function (s) { return esc(s).replace(re, '<mark>$1</mark>'); };
  }
  function pg(e) { return 'p.' + e.pages.replace(' to ', '-'); }

  function load() {
    if (cache[S.b]) return cache[S.b];
    var d = window.HTS_SCEN['hon-' + S.b];
    d.entries.forEach(function (e) {
      e.head = norm(e.title);
      e.hay = norm((e.armies ? 'army builder armies ' : '') + e.title + ' ' + e.type + ' ' + e.date + ' page ' + e.pages + ' ' + e.summary + ' ' + e.facts.map(function (f) { return f[0] + ' ' + f[1]; }).join(' '));
    });
    cache[S.b] = d;
    return d;
  }

  function renderControls(d) {
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>';
    }).join('');
    $('types').innerHTML = '<button type="button" class="chip' + (S.type === 'all' ? ' on' : '') + '" data-type="all">All</button>' +
      d.types.map(function (c) { return '<button type="button" class="chip' + (S.type === c ? ' on' : '') + '" data-type="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $('q').value = S.q;
    var sb = BOXES.filter(function (b) { return b.id === S.b; })[0];
    if ($('subtitle') && sb) $('subtitle').textContent = 'Scenarios index, Heroes of Normandie, ' + sb.name;
    $('srcnote').textContent = 'Page numbers are the printed page numbers of the ' + d.source + ' (the PDF page matches the printed number).';
    dlbar();
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function encode(j) { return btoa(unescape(encodeURIComponent(JSON.stringify(j)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  var SIDE = { us: ['us', 'American', '1st Infantry Division'], ge: ['ge', 'German', '2. Panzer Division'] };
  function armyHref(e, side) {
    var a = e.armies[side];
    return 'index.html#b=' + encode({ n: a.side || side, l: a.limit, nm: e.title + ', ' + (a.label || SIDE[side][1]), a: a.tiles });
  }
  function armies(e) {
    if (!e.armies) return '';
    return '<div class="sarmy"><h4>Open the armies in the builder</h4>' +
      Object.keys(e.armies).map(function (k) {
        var a = e.armies[k], sd = SIDE[a.side || k];
        return '<p class="sarow"><a class="btn" href="' + esc(armyHref(e, k)) + '" data-army="' + k + '">' + esc(a.label || (sd[1] + ' army')) + '</a>' +
          '<span class="sameta">' + esc(a.sub || sd[2]) + ', ' + a.pts + ' of ' + a.limit + ' points, ' + a.tiles.length + ' tile' + (a.tiles.length === 1 ? '' : 's') + '</span>' +
          (a.note ? '<span class="sanote">' + esc(a.note) + '</span>' : '') + '</p>';
      }).join('') +
      '<p class="hsrc">This replaces the army now in the builder. Save yours first if you want to keep it. Armies follow the recruitment pictures in the booklet.</p></div>';
  }
  function figs(e) {
    if (!e.figs || !e.figs.length) return '';
    return '<div class="rfigs">' + e.figs.map(function (f) {
      return '<figure class="rfig"><a href="' + esc(f.img) + '" target="_blank" rel="noopener"><img src="' + esc(f.img) + '" alt="' + esc(f.cap || e.title) + '" width="' + f.w + '" height="' + f.h + '" loading="lazy"></a><figcaption>' + esc(f.cap || '') + '</figcaption></figure>';
    }).join('') + '</div>';
  }
  function readLink(e) {
    var f = (window.HTS_SCEN_FULL || {})['hon-' + S.b];
    if (!f || !f.entries[e.id]) return '';
    return '<p class="sarow"><a class="btn" data-read="' + esc(e.id) + '" href="scenario.html?b=' + S.b + '&s=' + esc(e.id) + '">Read the full scenario</a><span class="sameta">Full text, maps, recruitment pictures and the original pages. Booklet ' + esc(pg(e)) + '.</span></p>';
  }
  function dlbar() {
    var f = (window.HTS_SCEN_FULL || {})['hon-' + S.b];
    if (!f || !$('dlbar')) return;
    $('dlbar').innerHTML = '<span class="label">Download the original</span><ul>' + f.book.pdfs.map(function (p) {
      return '<li><a class="btn ghost" href="' + esc(p.href) + '" download>' + esc(p.label) + '</a><span class="sameta">' + esc(p.size) + '. ' + esc(p.note || '') + '</span></li>';
    }).join('') + '</ul>';
  }
  function body(e) {
    return readLink(e) + '<p class="htext">' + esc(e.summary) + '</p>' +
      '<dl class="sfacts">' + e.facts.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('') + '</dl>' + figs(e) + armies(e) +
      '<p class="hsrc">' + esc(SRCN[S.b] || 'Scenario Booklet') + ', ' + esc(pg(e)) + '</p>';
  }
  function row(e, mk, toks) {
    var isOpen = S.open[e.id] === 1, snip = '';
    if (toks.length && !toks.every(function (t) { return hit(e.head, ' ' + e.head + ' ', t); })) {
      var t = e.summary + ' ' + e.facts.map(function (f) { return f[1]; }).join(' '), low = t.toLowerCase(), at = -1;
      toks.forEach(function (k) { var i = low.indexOf(k); if (i >= 0 && (at < 0 || i < at)) at = i; });
      if (at >= 0) { var a = Math.max(0, at - 50); snip = '<span class="hsnip">' + (a > 0 ? '... ' : '') + mk(t.slice(a, a + 120)) + ' ...</span>'; }
    }
    return '<div class="hrow' + (isOpen ? ' open' : '') + '" id="s-' + esc(e.id) + '">' +
      '<button type="button" class="hhead" data-toggle="' + esc(e.id) + '" aria-expanded="' + isOpen + '" aria-controls="sb-' + esc(e.id) + '">' +
      '<span class="spg">' + esc(pg(e)) + '</span>' +
      '<span class="hname">' + mk(e.title) + (e.date ? '<span class="hsnip">' + esc(e.date) + '</span>' : '') + snip + '</span>' +
      '<span class="hbadges"><span class="hb hb-t' + (e.type === 'Campaign' ? 'c' : e.type === 'Single scenarios' ? 's' : 'r') + '">' + esc(e.type === 'Booklet rules and reference' ? 'Rules' : e.type === 'Single scenarios' ? 'Scenario' : 'Campaign') + '</span></span>' +
      '<span class="hchev" aria-hidden="true"></span></button>' +
      '<div class="hbody" id="sb-' + esc(e.id) + '"' + (isOpen ? '' : ' hidden') + '>' + (isOpen ? body(e) : '') + '</div></div>';
  }
  function ncol() { return window.innerWidth >= 900 ? 2 : 1; }
  function list(items, mk, toks) {
    var n = ncol(), cols = [];
    for (var k = 0; k < n; k++) cols.push('');
    var per = Math.ceil(items.length / n);
    items.forEach(function (x, i) { cols[Math.floor(i / per)] += row(x.e, mk, toks); });
    return '<div class="hlist">' + cols.map(function (c) { return '<div class="hcol">' + c + '</div>'; }).join('') + '</div>';
  }

  function render() {
    var d = load();
    NCOL = ncol();
    renderControls(d);
    var toks = tokens(S.q), mk = markFn(toks), res = [];
    d.entries.forEach(function (e, i) {
      if (S.type !== 'all' && e.type !== S.type) return;
      var score = 0;
      if (toks.length) {
        var padded = ' ' + e.hay + ' ', hp = ' ' + e.head + ' ';
        if (!toks.every(function (t) { return hit(e.hay, padded, t); })) return;
        toks.forEach(function (t) { score += countOf(e.hay, t) + (hit(e.head, hp, t) ? 20 : 0); });
      }
      res.push({ e: e, score: score, i: i });
    });
    if (toks.length) res.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
    if (!res.length) {
      $('out').innerHTML = '<p class="empty2">Nothing matches. Try fewer or simpler words, or clear the filter.</p>';
      $('stat').textContent = '0 entries.';
    } else {
      $('out').innerHTML = list(res, mk, toks);
      $('stat').textContent = res.length + ' of ' + d.entries.length + ' entries, in booklet page order. Click one to read it.';
      if (toks.length) $('stat').textContent = res.length + ' of ' + d.entries.length + ' entries, best match first. Click one to read it.';
    }
    url();
  }

  function toggle(id) {
    var d = load(), e = d.entries.filter(function (x) { return x.id === id; })[0], r = $('s-' + id);
    if (!e || !r) return;
    var open = S.open[id] !== 1;
    if (open) S.open[id] = 1; else delete S.open[id];
    var b = r.querySelector('.hbody'), h = r.querySelector('.hhead');
    if (open && !b.firstChild) b.innerHTML = body(e);
    b.hidden = !open; h.setAttribute('aria-expanded', String(open)); r.classList.toggle('open', open);
    url();
  }

  function url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b);
      if (S.q) p.set('q', S.q); if (S.type !== 'all') p.set('t', S.type);
      var o = Object.keys(S.open); if (o.length) p.set('e', o.join(','));
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; render(); return; }
      if ((el = t.closest('[data-type]'))) { S.type = el.dataset.type; render(); return; }
      if ((el = t.closest('[data-toggle]'))) toggle(el.dataset.toggle);
    });
    window.addEventListener('resize', function () { if (ncol() !== NCOL) render(); });
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
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) S.theme = j.theme; } catch (e) { /* ignore */ }
    var p = new URLSearchParams(location.search);
    if (BOXES.some(function (b) { return b.id === p.get('b'); })) S.b = p.get('b');
    if (p.get('q')) S.q = p.get('q');
    var d = load();
    if (p.get('t') && d.types.indexOf(p.get('t')) >= 0) S.type = p.get('t');
    if (p.get('e')) p.get('e').split(',').forEach(function (id) { if (/^[a-z0-9]+$/.test(id)) S.open[id] = 1; });
    bind(); render();
    var first = Object.keys(S.open)[0]; if (first && $('s-' + first)) $('s-' + first).scrollIntoView({ block: 'center' });
  }
  init();
  window.HTS_SCEN_UI = { state: S, load: load };
})();
