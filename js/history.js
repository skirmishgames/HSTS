(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }];
  var SIDES = [{ id: 'all', name: 'Both' }, { id: 'us', name: 'American' }, { id: 'ge', name: 'German' }];
  var SIDE_NAME = { us: 'American', ge: 'German', both: 'Both sides' };
  var S = { b: 'bro', q: '', side: 'all', cat: 'all', open: {}, theme: 'light' };
  var cache = {};

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

  function load() {
    if (cache[S.b]) return cache[S.b];
    var d = window.HTS_HISTORY['hon-' + S.b];
    d.entries.forEach(function (e) {
      e.head = norm(e.name + ' ' + (e.aka || []).join(' '));
      e.hay = norm(e.name + ' ' + (e.aka || []).join(' ') + ' ' + e.cat + ' ' + SIDE_NAME[e.side] + ' ' + e.text + ' ' + e.facts.join(' '));
    });
    cache[S.b] = d;
    return d;
  }

  function renderControls(d) {
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>';
    }).join('');
    $('sides').innerHTML = SIDES.map(function (s) {
      return '<button type="button" data-side="' + s.id + '" class="' + (S.side === s.id ? 'on' : '') + '" aria-pressed="' + (S.side === s.id) + '">' + s.name + '</button>';
    }).join('');
    $('cats').innerHTML = '<button type="button" class="chip' + (S.cat === 'all' ? ' on' : '') + '" data-cat="all">All</button>' +
      d.cats.map(function (c) { return '<button type="button" class="chip' + (S.cat === c ? ' on' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $('q').value = S.q;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function body(e) {
    var find = e.find ? '<a class="btn ghost hfind" href="units.html?n=' + e.find.n + '&q=' + encodeURIComponent(e.find.q) + '">Find in the game</a>' : '';
    return '<p class="htext">' + esc(e.text) + '</p>' +
      '<ul class="hfacts">' + e.facts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
      '<div class="hfoot">' + find + '<a class="hsrc" href="' + esc(e.src[1]) + '" target="_blank" rel="noopener">Source: ' + esc(e.src[0]) + '</a></div>';
  }
  function row(e, mk, toks) {
    var isOpen = S.open[e.id] === 1, snip = '';
    if (toks.length && !toks.every(function (t) { return hit(e.head, ' ' + e.head + ' ', t); })) {
      var t = (e.text + ' ' + e.facts.join(' ')), low = t.toLowerCase(), at = -1;
      toks.forEach(function (k) { var i = low.indexOf(k); if (i >= 0 && (at < 0 || i < at)) at = i; });
      if (at >= 0) { var a = Math.max(0, at - 50); snip = '<span class="hsnip">' + (a > 0 ? '... ' : '') + mk(t.slice(a, a + 120)) + ' ...</span>'; }
    }
    return '<div class="hrow' + (isOpen ? ' open' : '') + '" id="h-' + esc(e.id) + '">' +
      '<button type="button" class="hhead" data-toggle="' + esc(e.id) + '" aria-expanded="' + isOpen + '" aria-controls="hb-' + esc(e.id) + '">' +
      '<span class="hname">' + mk(e.name) + snip + '</span>' +
      '<span class="hbadges"><span class="hb hb-' + e.side + '">' + SIDE_NAME[e.side] + '</span><span class="hb hcat">' + esc(e.cat) + '</span></span>' +
      '<span class="hchev" aria-hidden="true"></span></button>' +
      '<div class="hbody" id="hb-' + esc(e.id) + '"' + (isOpen ? '' : ' hidden') + '>' + (isOpen ? body(e) : '') + '</div></div>';
  }

  function render() {
    var d = load();
    renderControls(d);
    var toks = tokens(S.q), mk = markFn(toks), res = [];
    d.entries.forEach(function (e) {
      if (S.side !== 'all' && e.side !== S.side && e.side !== 'both') return;
      if (S.cat !== 'all' && e.cat !== S.cat) return;
      var score = 0;
      if (toks.length) {
        var padded = ' ' + e.hay + ' ', hp = ' ' + e.head + ' ';
        if (!toks.every(function (t) { return hit(e.hay, padded, t); })) return;
        toks.forEach(function (t) { score += countOf(e.hay, t) + (hit(e.head, hp, t) ? 20 : 0); });
        if (e.head.indexOf(norm(S.q)) >= 0) score += 30;
      }
      res.push({ e: e, score: score, i: d.entries.indexOf(e) });
    });
    if (toks.length) res.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
    if (!res.length) {
      $('out').innerHTML = '<p class="empty2">Nothing matches. Try fewer or simpler words, or clear a filter.</p>';
      $('stat').textContent = '0 entries.';
    } else if (toks.length) {
      $('out').innerHTML = '<div class="hlist">' + res.map(function (x) { return row(x.e, mk, toks); }).join('') + '</div>';
      $('stat').textContent = res.length + ' of ' + d.entries.length + ' entries. Click one to read it.';
    } else {
      $('out').innerHTML = d.cats.map(function (c) {
        var inCat = res.filter(function (x) { return x.e.cat === c; });
        if (!inCat.length) return '';
        return '<section class="hgroup"><h2>' + esc(c) + ' <small>' + inCat.length + '</small></h2><div class="hlist">' + inCat.map(function (x) { return row(x.e, mk, toks); }).join('') + '</div></section>';
      }).join('');
      $('stat').textContent = res.length + ' of ' + d.entries.length + ' entries. Click one to read it.';
    }
    url();
  }

  function toggle(id) {
    var d = load(), e = d.entries.filter(function (x) { return x.id === id; })[0], r = $('h-' + id);
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
      if (S.q) p.set('q', S.q); if (S.side !== 'all') p.set('n', S.side); if (S.cat !== 'all') p.set('c', S.cat);
      var o = Object.keys(S.open); if (o.length) p.set('e', o.join(','));
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; render(); return; }
      if ((el = t.closest('[data-side]'))) { S.side = el.dataset.side; render(); return; }
      if ((el = t.closest('[data-cat]'))) { S.cat = el.dataset.cat; render(); return; }
      if ((el = t.closest('[data-toggle]'))) toggle(el.dataset.toggle);
    });
    var timer;
    $('q').oninput = function () {
      S.q = this.value; clearTimeout(timer); timer = setTimeout(render, 120);
    };
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
    if (p.get('n') === 'us' || p.get('n') === 'ge') S.side = p.get('n');
    var d = load();
    if (p.get('c') && d.cats.indexOf(p.get('c')) >= 0) S.cat = p.get('c');
    if (p.get('e')) p.get('e').split(',').forEach(function (id) { if (/^[a-z0-9]+$/.test(id)) S.open[id] = 1; });
    bind(); render();
    var first = Object.keys(S.open)[0]; if (first && $('h-' + first)) $('h-' + first).scrollIntoView({ block: 'center' });
  }
  init();
  window.HTS_HISTORY_UI = { state: S, load: load };
})();
