(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }];
  var SIDES = [{ id: 'all', name: 'Both' }, { id: 'us', name: 'American' }, { id: 'ge', name: 'German' }];
  var SIDE_NAME = { us: 'American', ge: 'German', both: 'Both sides' };
  var S = { b: 'bro', q: '', side: 'all', cat: 'all', theme: 'light' };
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

  function card(e, mk) {
    var find = e.find ? '<a class="btn ghost hfind" href="units.html?n=' + e.find.n + '&q=' + encodeURIComponent(e.find.q) + '">Find in the game</a>' : '';
    return '<article class="hcard" id="h-' + esc(e.id) + '"><header><h3>' + mk(e.name) + '</h3>' +
      '<span class="hbadges"><span class="hb hb-' + e.side + '">' + SIDE_NAME[e.side] + '</span><span class="hb">' + esc(e.cat) + '</span></span></header>' +
      '<p class="htext">' + mk(e.text) + '</p>' +
      '<ul class="hfacts">' + e.facts.map(function (f) { return '<li>' + mk(f) + '</li>'; }).join('') + '</ul>' +
      '<footer>' + find + '<a class="hsrc" href="' + esc(e.src[1]) + '" target="_blank" rel="noopener">Source: ' + esc(e.src[0]) + '</a></footer></article>';
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
    } else {
      $('out').innerHTML = '<div class="hgrid">' + res.map(function (x) { return card(x.e, mk); }).join('') + '</div>';
      $('stat').textContent = res.length + ' of ' + d.entries.length + ' entries.';
    }
    url();
  }

  function url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b);
      if (S.q) p.set('q', S.q); if (S.side !== 'all') p.set('n', S.side); if (S.cat !== 'all') p.set('c', S.cat);
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; render(); return; }
      if ((el = t.closest('[data-side]'))) { S.side = el.dataset.side; render(); return; }
      if ((el = t.closest('[data-cat]'))) { S.cat = el.dataset.cat; render(); }
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
    bind(); render();
  }
  init();
  window.HTS_HISTORY_UI = { state: S, load: load };
})();
