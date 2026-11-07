(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }, { id: 'omaha', name: 'Bloody Omaha' }];
  var S = { b: 'bro', q: '', ch: 'all', open: null, chunk: null, full: false, theme: 'light' };
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

  var ICONIDX = null;
  function iconIdx() {
    if (ICONIDX) return ICONIDX;
    ICONIDX = [];
    var all = window.HTS_ICONS || {};
    ['bro', 'omaha'].forEach(function (b) {
      var d = all['hon-' + b]; if (!d) return;
      d.entries.forEach(function (e) { ICONIDX.push({ e: e, box: b, n: norm(e.name) }); });
    });
    return ICONIDX;
  }
  function iconsFor(c) {
    var idx = iconIdx(), out = [], seen = {};
    var sub = norm((c.sub || '') + ' ' + (c.term || '')), tx = ' ' + norm(c.text) + ' ';
    idx.forEach(function (x) {
      if (!x.e.icons.length || seen[x.n]) return;
      var ok = sub && (' ' + sub + ' ').indexOf(' ' + x.n + ' ') >= 0 && x.n.length > 3;
      if (!ok && x.n.length > 4) ok = tx.indexOf(' ' + x.n + ' special abilit') >= 0 || tx.indexOf(' ' + x.n + ' special ability ') >= 0;
      if (ok) { seen[x.n] = 1; out.push(x); }
    });
    out.sort(function (a, b) { return (a.box === S.b ? 0 : 1) - (b.box === S.b ? 0 : 1); });
    return out.slice(0, 5);
  }

  function load() {
    var ck = S.b;
    if (cache[ck]) return cache[ck];
    var d = window.HTS_RULES['hon-' + S.b];
    var secs = {}, chapters = {};
    d.sections.forEach(function (s) { secs[s.id] = s; });
    d.chapters.forEach(function (c) { chapters[c.n] = c; });
    d.chunks.forEach(function (c) {
      var s = secs[c.sec];
      c.hay = norm((s ? s.id + ' ' + s.title : '') + ' ' + (c.sub || '') + ' ' + c.text + (c.table ? ' ' + c.table.head.join(' ') + ' ' + c.table.rows.map(function (r) { return r.join(' '); }).join(' ') : ''));
      c.head = norm((s ? s.title : '') + ' ' + (c.sub || '') + ' ' + (c.term || ''));
      c.ch = s ? s.chapter : 0;
      c.icons = iconsFor(c);
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
    var sb = BOXES.filter(function (b) { return b.id === S.b; })[0];
    if ($('subtitle') && sb) $('subtitle').textContent = 'Rules compendium, Heroes of Normandie, ' + sb.name;
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
      return '<article class="rcard"><h3><button type="button" class="rtitle" data-open="' + esc(c.sec) + '" data-chunk="' + c.id + '">' + mk(label(R, c)) + '</button>' + (c.term ? ' <span class="rbadge">Keyword</span>' : '') + '</h3><p>' + snippet(c, toks, mk) + '</p>' + thumbsHtml(c) + '</article>';
    }).join('') + '</div>';
    $('stat').textContent = res.length + ' match' + (res.length === 1 ? '' : 'es') + (res.length > 60 ? ', showing the best 60' : '') + '.';
  }

  function tableHtml(c) {
    if (!c.table) return '';
    return '<div class="rtablew"><table class="rtable"><thead><tr>' + c.table.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      c.table.rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function chipsHtml(c) {
    if (!c.icons || !c.icons.length) return '';
    return '<div class="richips">' + c.icons.map(function (x) {
      return '<a class="richip" href="icons.html?b=' + x.box + '&amp;q=' + encodeURIComponent(x.e.name) + '" title="Open in the icon glossary"><img src="' + esc(x.e.icons[0].img) + '" alt="" width="24" height="24" loading="lazy">' + esc(x.e.name) + ' icon</a>';
    }).join('') + '</div>';
  }
  function figsHtml(c) {
    if (!c.figs || !c.figs.length) return '';
    return '<div class="rfigs">' + c.figs.map(function (f) {
      return '<figure class="rfig"><a href="' + esc(f.img) + '" target="_blank" rel="noopener"><img src="' + esc(f.img) + '" alt="Rulebook figure, page ' + c.page + '" width="' + f.w + '" height="' + f.h + '" loading="lazy"></a><figcaption>Rulebook p.' + c.page + '</figcaption></figure>';
    }).join('') + '</div>';
  }
  function thumbsHtml(c) {
    var t = (c.icons || []).slice(0, 3).map(function (x) { return '<img class="ic" src="' + esc(x.e.icons[0].img) + '" alt="" loading="lazy">'; }).join('') +
      (c.figs || []).slice(0, 2).map(function (f) { return '<img src="' + esc(f.img) + '" alt="" loading="lazy">'; }).join('');
    return t ? '<div class="rthumbs">' + t + '</div>' : '';
  }

  var lastFocus = null;
  function openModal(R) {
    var s = R.secs[S.open];
    if (!s) { S.open = null; closeModal(); return; }
    var toks = tokens(S.q), mk = markFn(toks);
    var all = R.d.chunks.filter(function (c) { return c.sec === s.id; });
    var focus = null;
    all.forEach(function (c) { if (c.id === S.chunk) focus = c; });
    var partial = !!focus && !S.full && all.length > 1;
    var chunks = partial ? all.filter(function (c) { return c.sub === focus.sub; }) : all;
    var idx = R.d.sections.map(function (x) { return x.id; }).indexOf(s.id);
    var prev = R.d.sections[idx - 1], next = R.d.sections[idx + 1];
    var ch = R.d.chapters.filter(function (c) { return c.n === s.chapter; })[0];
    var subs = [];
    all.forEach(function (c) { if (c.sub && subs.indexOf(c.sub) < 0) subs.push(c.sub); });
    var secName = (/^icons/.test(s.id) ? '' : s.id + ' ') + s.title;

    var head = '<div class="rdh"><div class="rdt"><small>' + (ch ? esc((ch.n < 9 ? ch.n + ' ' : '') + ch.title) : '') + '</small>' +
      '<h2 id="rdtitle">' + esc(partial && focus.sub ? focus.sub : secName) + '</h2>' +
      (partial && focus.sub ? '<small>In ' + esc(secName) + '</small>' : '') + '</div>' +
      '<button type="button" class="ghost rclose" data-close="1" aria-label="Close">Close</button></div>';

    var body = '<div class="rdb" id="rdbody">';
    if (!partial && subs.length > 1) {
      body += '<nav class="rjump" aria-label="Jump to">' + subs.map(function (x, i) { return '<button type="button" class="chip" data-jump="' + i + '">' + esc(x) + '</button>'; }).join('') + '</nav>';
    }
    var lastSub = null, lastPage = null, si = -1;
    chunks.forEach(function (c) {
      if (c.sub && c.sub !== lastSub && !(partial && c.sub === focus.sub)) { si = subs.indexOf(c.sub); body += '<h3 class="rsub" id="rs' + si + '">' + mk(c.sub) + '</h3>'; }
      body += '<section class="rchunk' + (S.chunk === c.id && !partial ? ' focus' : '') + '" id="k' + c.id + '">' +
        c.text.split('\n').map(function (p) { return '<p>' + mk(p) + '</p>'; }).join('') + tableHtml(c) + chipsHtml(c) + figsHtml(c) + '</section>';
      if (c.page !== lastPage) body += '<small class="rpg">Rulebook p.' + c.page + '</small>';
      lastSub = c.sub; lastPage = c.page;
    });
    body += '</div>';

    var foot = '<div class="rdf"><span class="rnav">' +
      (prev ? '<button type="button" class="ghost" data-open="' + esc(prev.id) + '" data-full="1">Previous section</button>' : '') +
      (next ? '<button type="button" class="ghost" data-open="' + esc(next.id) + '" data-full="1">Next section</button>' : '') + '</span>' +
      (partial ? '<button type="button" data-full-open="1">Read whole section (' + all.length + ' parts)</button>' : '') + '</div>';

    var m = $('rmodal');
    if (!m) {
      m = document.createElement('div'); m.id = 'rmodal'; m.className = 'rmodal'; m.hidden = true;
      m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'rdtitle');
      document.body.appendChild(m);
    }
    if (m.hidden) lastFocus = document.activeElement;
    m.innerHTML = '<div class="rdlg">' + head + body + foot + '</div>';
    m.hidden = false;
    document.body.classList.add('rlock');
    var bodyEl = $('rdbody'), f = document.querySelector('#rmodal .rchunk.focus');
    if (f && f.scrollIntoView) f.scrollIntoView({ block: 'center' }); else bodyEl.scrollTop = 0;
    var cb = m.querySelector('.rclose'); if (cb && cb.focus) cb.focus({ preventScroll: true });
  }
  function closeModal() {
    var m = $('rmodal');
    if (m && !m.hidden) {
      m.hidden = true; m.innerHTML = '';
      if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    }
    document.body.classList.remove('rlock');
  }

  function url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b);
      if (S.q) p.set('q', S.q); if (S.ch !== 'all') p.set('ch', S.ch);
      if (S.open) p.set('s', S.open); if (S.chunk != null) p.set('k', S.chunk); if (S.open && S.full) p.set('full', '1');
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }
  function render() {
    renderControls();
    var R = load();
    if (tokens(S.q).length) renderResults(R);
    else renderToc(R);
    if (S.open) openModal(R); else closeModal();
    url();
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; S.open = null; S.ch = 'all'; render(); return; }
      if ((el = t.closest('[data-ch]'))) { S.ch = el.dataset.ch === 'all' ? 'all' : Number(el.dataset.ch); S.open = null; render(); return; }
      if ((el = t.closest('[data-jump]'))) { var h = document.getElementById('rs' + el.dataset.jump); if (h) h.scrollIntoView({ block: 'start' }); return; }
      if (t.closest('[data-full-open]')) { S.full = true; render(); return; }
      if ((el = t.closest('[data-open]'))) { S.open = el.dataset.open; S.chunk = el.dataset.chunk != null ? Number(el.dataset.chunk) : null; S.full = el.dataset.full === '1' || S.chunk == null; render(); return; }
      if (t.closest('[data-close]') || t.id === 'rmodal') { S.open = null; S.chunk = null; S.full = false; render(); }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && S.open) { S.open = null; S.chunk = null; S.full = false; render(); }
    });
    var timer;
    $('q').oninput = function () {
      S.q = this.value; S.open = null; S.chunk = null; S.full = false; closeModal();
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
    if (p.get('full') === '1') S.full = true;
    bind(); render();
  }
  init();
  window.HTS_RULES_UI = { state: S, load: load };
})();
