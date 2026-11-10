(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }, { id: 'omaha', name: 'Bloody Omaha' }, { id: 'caen', name: 'Battle for Caen' }, { id: 'hos', name: 'Heroes of Stalingrad' }];
  var S = { b: 'bro', q: '', g: 'all', open: {}, theme: 'light' };
  var cache = {}, NCOL = 0;

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
    var d = window.HTS_TOKENS['hon-' + S.b];
    d.entries.forEach(function (e) {
      e.head = norm(e.name);
      e.hay = norm(e.name + ' ' + e.group + ' ' + e.summary + ' ' + e.text.join(' ') + ' ' +
        e.faces.map(function (f) { return f.label; }).join(' ') + ' ' +
        e.facts.map(function (f) { return f[0] + ' ' + f[1]; }).join(' '));
    });
    cache[S.b] = d;
    return d;
  }

  function renderControls(d) {
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>';
    }).join('');
    $('groups').innerHTML = '<button type="button" class="chip' + (S.g === 'all' ? ' on' : '') + '" data-group="all">All</button>' +
      d.groups.map(function (c) { return '<button type="button" class="chip' + (S.g === c ? ' on' : '') + '" data-group="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $('q').value = S.q;
    var sb = BOXES.filter(function (b) { return b.id === S.b; })[0];
    if ($('subtitle') && sb) $('subtitle').textContent = 'Tokens and markers, ' + (sb.id === 'hos' ? 'Heroes of Stalingrad' : 'Heroes of Normandie, ' + sb.name);
    if ($('srcnote')) $('srcnote').textContent = 'Rule text is summarised from the ' + d.source + '. Page numbers are printed page numbers.';
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function faces(e) {
    return '<div class="tfaces">' + e.faces.map(function (f) {
      return '<figure class="tface' + (f.tall ? ' tall' : '') + '"><img src="' + esc(f.img) + '" alt="' + esc(e.name + ': ' + f.label) + '" width="' + f.w + '" height="' + f.h + '" loading="lazy"><figcaption>' + esc(f.label) + '</figcaption></figure>';
    }).join('') + '</div>';
  }
  function body(e) {
    return e.text.map(function (p) { return '<p class="htext">' + esc(p) + '</p>'; }).join('') +
      faces(e) +
      (e.facts.length ? '<dl class="sfacts">' + e.facts.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('') + '</dl>' : '') +
      (e.links.length ? '<p class="hfind">' + e.links.map(function (l) { return '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>'; }).join(' ') + '</p>' : '') +
      '<p class="hsrc">' + esc(e.src) + '</p>';
  }
  function row(e, mk, toks) {
    var isOpen = S.open[e.id] === 1, snip = '', t0 = e.faces[0];
    snip = '<span class="hsnip">' + mk(e.summary) + '</span>';
    return '<div class="hrow' + (isOpen ? ' open' : '') + '" id="t-' + esc(e.id) + '">' +
      '<button type="button" class="hhead" data-toggle="' + esc(e.id) + '" aria-expanded="' + isOpen + '" aria-controls="tb-' + esc(e.id) + '">' +
      '<span class="tthumb"><img src="' + esc(t0.img) + '" alt="" width="44" height="44" loading="lazy"></span>' +
      '<span class="hname"><span class="ht">' + mk(e.name) + '</span>' + snip + '</span>' +
      '<span class="hchev" aria-hidden="true"></span></button>' +
      '<div class="hbody" id="tb-' + esc(e.id) + '"' + (isOpen ? '' : ' hidden') + '>' + (isOpen ? body(e) : '') + '</div></div>';
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
      if (S.g !== 'all' && e.group !== S.g) return;
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
      $('stat').textContent = res.length + ' of ' + d.entries.length + ' entries' + (toks.length ? ', best match first' : '') + '. Click one to see the markers and what they do.';
    }
    url();
  }

  function toggle(id) {
    var d = load(), e = d.entries.filter(function (x) { return x.id === id; })[0], r = $('t-' + id);
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
      if (S.q) p.set('q', S.q); if (S.g !== 'all') p.set('g', S.g);
      var o = Object.keys(S.open); if (o.length) p.set('e', o.join(','));
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; S.g = 'all'; S.open = {}; render(); return; }
      if ((el = t.closest('[data-group]'))) { S.g = el.dataset.group; render(); return; }
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
    if (p.get('g') && d.groups.indexOf(p.get('g')) >= 0) S.g = p.get('g');
    if (p.get('e')) p.get('e').split(',').forEach(function (id) { if (/^[a-z0-9]+$/.test(id)) S.open[id] = 1; });
    bind(); render();
    var first = Object.keys(S.open)[0]; if (first && $('t-' + first)) $('t-' + first).scrollIntoView({ block: 'center' });
  }
  init();
  window.HTS_TOK_UI = { state: S, load: load };
})();
