(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }];
  var S = { b: 'bro', q: '', ch: 'all', open: null, chunk: null, theme: 'light' };
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

  function load() {
    var ck = S.b;
    if (cache[ck]) return cache[ck];
    var d = window.HTS_RULES['hon-' + S.b];
    var secs = {}, chapters = {};
    d.sections.forEach(function (s) { secs[s.id] = s; });
    d.chapters.forEach(function (c) { chapters[c.n] = c; });
    d.chunks.forEach(function (c) {
      var s = secs[c.sec];
      c.hay = norm((s ? s.id + ' ' + s.title : '') + ' ' + (c.sub || '') + ' ' + c.text);
      c.head = norm((s ? s.title : '') + ' ' + (c.sub || '') + ' ' + (c.term || ''));
      c.ch = s ? s.chapter : 0;
    });
    cache[ck] = { d: d, secs: secs, chapters: chapters };
    return cache[ck];
  }

  function markFn(toks) {
    if (!toks.length) return esc;
    var re = new RegExp('(' + toks.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return function (s) { return esc(s).replace(re, '<mark>$1</mark>'); };
  }
  function label(R, c) {
    var s = R.secs[c.sec];
    var sid = s && !/^icons/.test(s.id) && s.id.indexOf('.') > 0 ? s.id + ' ' : '';
    return sid + (s ? s.title : '') + (c.sub ? ', ' + c.sub : '') + ' (p.' + c.page + ')';
  }
  function snippet(c, toks, mk) {
    var t = c.text.replace(/\n/g, ' ');
    var low = t.toLowerCase(), at = -1;
    toks.forEach(function (k) { var i = low.indexOf(k); if (i >= 0 && (at < 0 || i < at)) at = i; });
    var a = Math.max(0, (at < 0 ? 0 : at) - 90), b = Math.min(t.length, a + 320);
    return (a > 0 ? '... ' : '') + mk(t.slice(a, b)) + (b < t.length ? ' ...' : '');
  }

  function renderControls() {
    var R = load();
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>';
    }).join('');
    $('chapters').innerHTML = '<button type="button" class="chip' + (S.ch === 'all' ? ' on' : '') + '" data-ch="all">All</button>' +
      R.d.chapters.map(function (c) { return '<button type="button" class="chip' + (String(S.ch) === String(c.n) ? ' on' : '') + '" data-ch="' + c.n + '">' + (c.n < 9 ? c.n + ' ' : '') + esc(c.title) + '</button>'; }).join('');
    $('q').value = S.q;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function renderToc(R) {
    var html = R.d.chapters.filter(function (c) { return S.ch === 'all' || String(S.ch) === String(c.n); }).map(function (c) {
      var list = R.d.sections.filter(function (s) { return s.chapter === c.n; });
      if (!list.length) return '';
      return '<section class="rch"><h2>' + (c.n < 9 ? c.n + ' ' : '') + esc(c.title) + '</h2><div class="rtoc">' + list.map(function (s) {
        var pages = R.d.chunks.filter(function (k) { return k.sec === s.id; }).map(function (k) { return k.page; });
        var lo = Math.min.apply(null, pages), hi = Math.max.apply(null, pages);
        var id = /^icons/.test(s.id) ? '' : s.id + ' ';
        return '<button type="button" class="rlink" data-open="' + esc(s.id) + '"><span>' + esc(id + s.title) + '</span><small>p.' + (lo === hi ? lo : lo + '-' + hi) + '</small></button>';
      }).join('') + '</div></section>';
    }).join('');
    $('out').innerHTML = html;
    $('stat').textContent = 'Pick a section to read, or search above.';
  }

  function renderResults(R) {
    var toks = tokens(S.q), mk = markFn(toks);
    var res = [];
    R.d.chunks.forEach(function (c) {
      if (S.ch !== 'all' && String(c.ch) !== String(S.ch)) return;
      var padded = ' ' + c.hay + ' ';
      if (!toks.every(function (t) { return hit(c.hay, padded, t); })) return;
      var score = 0, hp = ' ' + c.head + ' ';
      toks.forEach(function (t) { score += countOf(c.hay, t) + (hit(c.head, hp, t) ? 12 : 0); });
      if (norm(S.q) && c.hay.indexOf(norm(S.q)) >= 0) score += 25;
      if (c.term && norm(c.term) === norm(S.q)) score += 60;
      if (c.term) score += 4;
      res.push({ c: c, score: score });
    });
    res.sort(function (a, b) { return (b.score - a.score) || (a.c.page - b.c.page); });
    var shown = res.slice(0, 60);
    if (!shown.length) { $('out').innerHTML = '<p class="empty2">No rule matches. Try fewer or simpler words.</p>'; $('stat').textContent = '0 matches.'; return; }
    $('out').innerHTML = '<div class="rres">' + shown.map(function (x) {
      var c = x.c;
      return '<article class="rcard"><h3><button type="button" class="rtitle" data-open="' + esc(c.sec) + '" data-chunk="' + c.id + '">' + mk(label(R, c)) + '</button>' + (c.term ? ' <span class="rbadge">Keyword</span>' : '') + '</h3><p>' + snippet(c, toks, mk) + '</p></article>';
    }).join('') + '</div>';
    $('stat').textContent = res.length + ' match' + (res.length === 1 ? '' : 'es') + (res.length > 60 ? ', showing the best 60' : '') + '.';
  }

  function renderSection(R) {
    var s = R.secs[S.open];
    if (!s) { S.open = null; render(); return; }
    var toks = tokens(S.q), mk = markFn(toks);
    var chunks = R.d.chunks.filter(function (c) { return c.sec === s.id; });
    var idx = R.d.sections.map(function (x) { return x.id; }).indexOf(s.id);
    var prev = R.d.sections[idx - 1], next = R.d.sections[idx + 1];
    var html = '<div class="rbar"><button type="button" class="ghost" data-back="1">' + (S.q ? 'Back to results' : 'Back to contents') + '</button>' +
      '<span class="rnav">' + (prev ? '<button type="button" class="ghost" data-open="' + esc(prev.id) + '">Previous</button>' : '') + (next ? '<button type="button" class="ghost" data-open="' + esc(next.id) + '">Next</button>' : '') + '</span></div>' +
      '<article class="rsec"><h2>' + esc((/^icons/.test(s.id) ? '' : s.id + ' ') + s.title) + '</h2>';
    var lastSub = null, lastPage = null;
    chunks.forEach(function (c) {
      html += '<section class="rchunk' + (S.chunk === c.id ? ' focus' : '') + '" id="k' + c.id + '">';
      if (c.sub && c.sub !== lastSub) html += '<h3>' + mk(c.sub) + '</h3>';
      html += c.text.split('\n').map(function (p) { return '<p>' + mk(p) + '</p>'; }).join('');
      if (c.page !== lastPage) html += '<small class="rpg">Rulebook p.' + c.page + '</small>';
      html += '</section>';
      lastSub = c.sub; lastPage = c.page;
    });
    html += '</article>';
    $('out').innerHTML = html;
    $('stat').textContent = chunks.length + ' part' + (chunks.length === 1 ? '' : 's') + ' in this section.';
    var f = document.querySelector('.rchunk.focus');
    if (f && f.scrollIntoView) f.scrollIntoView({ block: 'center' });
    else window.scrollTo(0, 0);
  }

  function url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b);
      if (S.q) p.set('q', S.q); if (S.ch !== 'all') p.set('ch', S.ch);
      if (S.open) p.set('s', S.open); if (S.chunk != null) p.set('k', S.chunk);
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }
  function render() {
    renderControls();
    var R = load();
    if (S.open) renderSection(R);
    else if (tokens(S.q).length) renderResults(R);
    else renderToc(R);
    url();
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; S.open = null; render(); return; }
      if ((el = t.closest('[data-ch]'))) { S.ch = el.dataset.ch === 'all' ? 'all' : Number(el.dataset.ch); S.open = null; render(); return; }
      if ((el = t.closest('[data-open]'))) { S.open = el.dataset.open; S.chunk = el.dataset.chunk != null ? Number(el.dataset.chunk) : null; render(); if (S.chunk == null) window.scrollTo(0, 0); return; }
      if (t.closest('[data-back]')) { S.open = null; S.chunk = null; render(); }
    });
    var timer;
    $('q').oninput = function () {
      S.q = this.value; S.open = null; S.chunk = null;
      clearTimeout(timer); timer = setTimeout(function () { var R = load(); renderControlsLight(); if (tokens(S.q).length) renderResults(R); else renderToc(R); url(); }, 120);
    };
    $('btnTheme').onclick = function () {
      S.theme = S.theme === 'dark' ? 'light' : 'dark';
      try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = S.theme; localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
      renderControlsLight();
    };
  }
  function renderControlsLight() {
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function init() {
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) S.theme = j.theme; } catch (e) { /* ignore */ }
    var p = new URLSearchParams(location.search);
    if (BOXES.some(function (b) { return b.id === p.get('b'); })) S.b = p.get('b');
    if (p.get('q')) S.q = p.get('q');
    if (p.get('ch') && !isNaN(Number(p.get('ch')))) S.ch = Number(p.get('ch'));
    if (p.get('s')) S.open = p.get('s');
    if (p.get('k') != null && p.get('k') !== '') S.chunk = Number(p.get('k'));
    bind(); render();
  }
  init();
  window.HTS_RULES_UI = { state: S, load: load };
})();
