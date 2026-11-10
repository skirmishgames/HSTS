(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var D = window.HTS_EXPANSIONS;
  var S = { l: 'all', g: 'all', q: '', open: {}, theme: 'light' };
  var NCOL = 0, ALLI = [], GUIDE = {};

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  var STOP = { a: 1, an: 1, the: 1, of: 1, to: 1, in: 1, on: 1, and: 1, or: 1, for: 1, is: 1, it: 1, at: 1, by: 1, as: 1 };
  function tokens(q) {
    var all = norm(q).split(' ').filter(Boolean), keep = all.filter(function (t) { return !STOP[t]; });
    return keep.length ? keep : all;
  }
  function hit(hay, padded, t) { return t.length <= 2 ? padded.indexOf(' ' + t + ' ') >= 0 : hay.indexOf(t) >= 0; }
  function countOf(hay, t) { var n = 0, i = -1; while ((i = hay.indexOf(t, i + 1)) >= 0) n++; return n; }
  function markFn(toks) {
    if (!toks.length) return esc;
    var re = new RegExp('(' + toks.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return function (s) { return esc(s).replace(re, '<mark>$1</mark>'); };
  }

  function prep() {
    D.guide.forEach(function (g, gi) { g.items.forEach(function (id) { (GUIDE[id] = GUIDE[id] || []).push(gi); }); });
    D.lines.forEach(function (l) {
      l.items.forEach(function (it) {
        it.line = l.id; it.lineName = l.name;
        it.text = it.text || '';
        it.tool = it.tool || [];
        it.head = norm(it.name);
        it.hay = norm(it.name + ' ' + l.name + ' ' + it.cat + ' ' + it.text);
        ALLI.push(it);
      });
    });
  }
  function status(it) { return it.status === 'full' ? 'In the tool' : (it.status === 'part' ? 'Partly in the tool' : ''); }

  function renderControls() {
    $('lines').innerHTML = '<button type="button" class="chip' + (S.l === 'all' ? ' on' : '') + '" data-line="all">All games</button>' +
      D.lines.map(function (l) { return '<button type="button" class="chip' + (S.l === l.id ? ' on' : '') + '" data-line="' + l.id + '">' + esc(l.name) + '</button>'; }).join('');
    $('cats').innerHTML = '<button type="button" class="chip' + (S.g === 'all' ? ' on' : '') + '" data-cat="all">All</button>' +
      '<button type="button" class="chip' + (S.g === 'tool' ? ' on' : '') + '" data-cat="tool">In the tool</button>' +
      D.cats.map(function (c) { return '<button type="button" class="chip' + (S.g === c ? ' on' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $('q').value = S.q;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function body(it) {
    var h = '';
    if (it.text) h += '<p class="htext">' + esc(it.text) + '</p>';
    else h += '<p class="htext">No contents notes yet.</p>';
    if (it.imgs) h += '<div class="xfigs">' + it.imgs.map(function (f) {
      return '<figure class="xfig"><img src="' + esc(f.img) + '" alt="' + esc(it.name + ': ' + f.label) + '" width="' + f.w + '" height="' + f.h + '" loading="lazy"><figcaption>' + esc(f.label) + '. Small preview.</figcaption></figure>';
    }).join('') + '</div>';
    h += '<dl class="sfacts"><dt>Game</dt><dd>' + esc(it.lineName) + '</dd><dt>Type</dt><dd>' + esc(it.cat) + '. ' + esc(D.catdesc[it.cat] || '') + '</dd>' +
      '<dt>In this tool</dt><dd>' + (it.status === 'full' ? 'Fully covered.' : (it.status === 'part' ? 'Partly covered. ' + (it.gap || 'See the links for what is in.') : 'Not yet.')) + '</dd></dl>';
    if (it.tool.length) h += '<p class="hfind">' + it.tool.map(function (l) { return '<a href="' + esc(l.href) + '">' + esc(l.label) + '</a>'; }).join(' ') + '</p>';
    if (GUIDE[it.id]) h += '<p class="hfind">' + GUIDE[it.id].map(function (gi) { return '<a href="#guide-' + gi + '" data-guide="' + gi + '">Starter force: ' + esc(D.guide[gi].title) + '</a>'; }).join(' ') + '</p>';
    return h;
  }
  function row(it, mk) {
    var isOpen = S.open[it.id] === 1, st = status(it), thumb = it.imgs ? '<span class="tthumb"><img src="' + esc(it.imgs[0].img) + '" alt="" width="44" height="44" loading="lazy"></span>' : '';
    var snip = it.text ? it.text.split(/(?<=\.)\s/)[0] : it.cat;
    return '<div class="hrow' + (isOpen ? ' open' : '') + '" id="x-' + esc(it.id) + '">' +
      '<button type="button" class="hhead" data-toggle="' + esc(it.id) + '" aria-expanded="' + isOpen + '" aria-controls="xb-' + esc(it.id) + '">' + thumb +
      '<span class="hname"><span class="ht">' + mk(it.name) + '</span><span class="hsnip">' + mk(snip) + '</span></span>' +
      '<span class="hbadges"><span class="hb">' + esc(it.cat) + '</span>' + (st ? '<span class="hb hb-us">' + st + '</span>' : '') + '</span>' +
      '<span class="hchev" aria-hidden="true"></span></button>' +
      '<div class="hbody" id="xb-' + esc(it.id) + '"' + (isOpen ? '' : ' hidden') + '>' + (isOpen ? body(it) : '') + '</div></div>';
  }
  function ncol() { return window.innerWidth >= 900 ? 2 : 1; }
  function list(items, mk) {
    var n = ncol(), cols = [], per = Math.ceil(items.length / n);
    for (var k = 0; k < n; k++) cols.push('');
    items.forEach(function (it, i) { cols[Math.floor(i / per)] += row(it, mk); });
    return '<div class="hlist">' + cols.map(function (c) { return '<div class="hcol">' + c + '</div>'; }).join('') + '</div>';
  }
  function guideHtml() {
    return '<section class="hgroup" id="guide"><h2 class="hh">' + esc(D.guideTitle) + '</h2><p class="htext hintro">' + esc(D.guideIntro) + '</p><div class="eqgrid">' +
      D.guide.map(function (g, i) {
        return '<article class="eqcard" id="guide-' + i + '"><h3>' + esc(g.title) + '</h3><p class="htext">' + esc(g.text) + '</p><p class="hfind">' +
          g.items.map(function (id) { var it = ALLI.filter(function (x) { return x.id === id; })[0]; return '<a href="#x-' + esc(id) + '" data-open="' + esc(id) + '">' + esc(it.name) + '</a>'; }).join(' ') + '</p></article>';
      }).join('') + '</div></section>';
  }

  function render() {
    NCOL = ncol();
    renderControls();
    var toks = tokens(S.q), mk = markFn(toks), html = '', total = 0, groups = [];
    D.lines.forEach(function (l) {
      if (S.l !== 'all' && S.l !== l.id) return;
      var res = [];
      l.items.forEach(function (it, i) {
        if (S.g === 'tool' ? !it.status : (S.g !== 'all' && it.cat !== S.g)) return;
        var score = 0;
        if (toks.length) {
          var padded = ' ' + it.hay + ' ', hp = ' ' + it.head + ' ';
          if (!toks.every(function (t) { return hit(it.hay, padded, t); })) return;
          toks.forEach(function (t) { score += countOf(it.hay, t) + (hit(it.head, hp, t) ? 20 : 0); });
        }
        res.push({ it: it, score: score, i: i });
      });
      if (toks.length) res.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
      if (res.length) groups.push({ l: l, res: res });
      total += res.length;
    });
    groups.forEach(function (g) {
      html += '<section class="hgroup"><h2 class="hh">' + esc(g.l.name) + ' <span class="hcount">' + g.res.length + '</span></h2><p class="htext hintro">' + esc(g.l.sub) + '</p>' +
        list(g.res.map(function (r) { return r.it; }), mk) + '</section>';
    });
    if (!total) html = '<p class="empty2">Nothing matches. Try fewer or simpler words, or clear the filters.</p>';
    if (!toks.length && S.g === 'all' && (S.l === 'all' || S.l === 'hon1')) html += guideHtml();
    $('out').innerHTML = html;
    $('stat').textContent = total + ' of ' + ALLI.length + ' products' + (toks.length ? ', best match first' : '') + '. Open one to see what it holds and what the tool covers.';
    url();
  }

  function toggle(id) {
    var it = ALLI.filter(function (x) { return x.id === id; })[0], r = $('x-' + id);
    if (!it || !r) return;
    var open = S.open[id] !== 1;
    if (open) S.open[id] = 1; else delete S.open[id];
    var b = r.querySelector('.hbody'), h = r.querySelector('.hhead');
    if (open && !b.firstChild) b.innerHTML = body(it);
    b.hidden = !open; h.setAttribute('aria-expanded', String(open)); r.classList.toggle('open', open);
    url();
  }
  function openItem(id) {
    var it = ALLI.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    S.l = it.line; S.g = 'all'; S.q = ''; S.open[id] = 1; render();
    var el = $('x-' + id); if (el) el.scrollIntoView({ block: 'center' });
  }
  function url() {
    try {
      var p = new URLSearchParams();
      if (S.l !== 'all') p.set('l', S.l);
      if (S.g !== 'all') p.set('g', S.g);
      if (S.q) p.set('q', S.q);
      var o = Object.keys(S.open); if (o.length) p.set('e', o.join(','));
      var s = p.toString();
      history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-line]'))) { S.l = el.dataset.line; S.open = {}; render(); return; }
      if ((el = t.closest('[data-cat]'))) { S.g = el.dataset.cat; render(); return; }
      if ((el = t.closest('[data-open]'))) { ev.preventDefault(); openItem(el.dataset.open); return; }
      if ((el = t.closest('[data-guide]'))) { ev.preventDefault(); S.l = 'hon1'; S.g = 'all'; S.q = ''; render(); var gx = $('guide-' + el.dataset.guide); if (gx) gx.scrollIntoView({ block: 'center' }); return; }
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
    prep();
    var p = new URLSearchParams(location.search);
    if (D.lines.some(function (l) { return l.id === p.get('l'); })) S.l = p.get('l');
    if (p.get('g') === 'tool' || D.cats.indexOf(p.get('g')) >= 0) S.g = p.get('g');
    if (p.get('q')) S.q = p.get('q');
    if (p.get('e')) p.get('e').split(',').forEach(function (id) { if (/^[a-z0-9-]+$/.test(id)) S.open[id] = 1; });
    bind(); render();
    var first = Object.keys(S.open)[0]; if (first && $('x-' + first)) $('x-' + first).scrollIntoView({ block: 'center' });
  }
  init();
  window.HTS_EXP_UI = { state: S };
})();
