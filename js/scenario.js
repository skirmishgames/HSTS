(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXN = { bro: 'Big Red One', omaha: 'Bloody Omaha', caen: 'Battle for Caen', ws: 'War Stories' };
  var S = { b: 'bro', s: '', theme: 'light' };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/__(.+?)__/g, '<em>$1</em>'); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  function summ() { return window.HTS_SCEN['hon-' + S.b]; }
  function full() { return (window.HTS_SCEN_FULL || {})['hon-' + S.b]; }
  function entry() { return summ().entries.filter(function (e) { return e.id === S.s; })[0]; }
  function fullEntry() { var f = full(); return f && f.entries[S.s]; }

  function encode(j) { return btoa(unescape(encodeURIComponent(JSON.stringify(j)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  var SIDE = { us: 'American', ge: 'German', uk: 'Commonwealth' };
  function armyHref(e, key) {
    var a = e.armies[key];
    return 'builder.html#b=' + encode({ n: a.side || key, l: a.limit, nm: e.title + ', ' + (a.label || SIDE[a.side || key]), a: a.tiles });
  }

  function block(b) {
    switch (b.k) {
      case 'h': return '<h2 id="' + slug(b.t) + '">' + rich(b.t) + '</h2>';
      case 'h3': return '<h3>' + rich(b.t) + '</h3>';
      case 'h4': return '<h4>' + rich(b.t) + '</h4>';
      case 'p': return '<p>' + rich(b.t) + '</p>';
      case 'quote': return '<blockquote>' + rich(b.t) + '</blockquote>';
      case 'note': return '<aside class="snote">' + rich(b.t) + '</aside>';
      case 'ul': return '<ul>' + b.items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>';
      case 'ol': return '<ol>' + b.items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ol>';
      case 'fig': return '<figure class="sfig"><button type="button" class="sfigb" data-zoom="' + esc(b.img) + '" data-cap="' + esc(b.cap || '') + '" aria-label="Open picture full size"><img src="' + esc(b.img) + '" alt="' + esc(b.alt || b.cap || '') + '" width="' + b.w + '" height="' + b.h + '" loading="lazy"></button>' + (b.cap ? '<figcaption>' + rich(b.cap) + '</figcaption>' : '') + '</figure>';
      case 'table': return '<div class="stable"><table><thead><tr>' + b.head.map(function (h) { return '<th>' + rich(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + b.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + rich(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      case 'pg': var PP = full().book.pages; return '<div class="pgmark"><button type="button" data-zoom="' + PP.dir + 'p' + pad(b.n) + '.webp" data-cap="Original page ' + b.n + '" aria-label="Open original page ' + b.n + '">Booklet page ' + b.n + '</button></div>';
      case 'gal': return '<ul class="sgal">' + b.items.map(function (g) { return '<li><button type="button" class="sgalb" data-zoom="' + esc(g.img) + '" data-cap="' + esc(g.cap) + '" aria-label="Open ' + esc(g.cap) + ' full size"><img src="' + esc(g.img) + '" alt="' + esc(g.cap) + '" width="' + g.w + '" height="' + g.h + '" loading="lazy"></button><span>' + esc(g.cap) + '</span></li>'; }).join('') + '</ul>';
      case 'facts': return '<dl class="sfacts">' + b.rows.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + rich(f[1]) + '</dd>'; }).join('') + '</dl>';
      default: return '';
    }
  }

  function dl(f, fe) {
    return '<section class="sdl"><h2>Download</h2><ul>' + (fe && fe.pdfs || f.book.pdfs).map(function (p) {
      return '<li><a class="btn" href="' + esc(p.href) + '" download>' + esc(p.label) + '</a><span class="sameta">' + esc(p.size) + '. ' + esc(p.note || '') + '</span></li>';
    }).join('') + '</ul></section>';
  }
  function pagesGallery(f, fe) {
    var P = f.book.pages, a = fe.pages[0], z = fe.pages[1], h = '';
    for (var n = a; n <= z; n++) {
      var src = P.dir + 'p' + pad(n) + '.webp';
      h += '<button type="button" class="spage" data-zoom="' + src + '" data-cap="Original page ' + n + '"><img src="' + P.dir + 't' + pad(n) + '.webp" alt="Original booklet page ' + n + '" width="' + P.tw + '" height="' + P.th + '" loading="lazy"><span>Page ' + n + '</span></button>';
    }
    return '<section class="sorig"><h2 id="original-pages">Original pages</h2><p class="hsrc">The pages as printed, for the layout and the pictures. Tap one to open it full size.</p><div class="spages">' + h + '</div></section>';
  }
  function armies(e) {
    if (!e.armies) return '';
    return '<section class="sarmy"><h2 id="armies">Armies in the builder</h2>' + Object.keys(e.armies).map(function (k) {
      var a = e.armies[k];
      return '<p class="sarow"><a class="btn" href="' + esc(armyHref(e, k)) + '" data-army="' + k + '">' + esc(a.label || (SIDE[a.side || k] + ' army')) + '</a><span class="sameta">' + a.pts + ' of ' + a.limit + ' points' + (a.note ? '. ' + esc(a.note) : '') + '</span></p>';
    }).join('') + '<p class="hsrc">This replaces the army now in the builder. Save yours first if you want to keep it.</p></section>';
  }

  function render() {
    var d = summ(), e = entry(), f = full(), fe = fullEntry(), out = $('out'), i;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    if (!e) {
      var list = d.entries.map(function (x) {
        var has = (window.HTS_SCEN_FULL['hon-' + S.b] || { entries: {} }).entries[x.id];
        return '<li><a href="scenario.html?b=' + S.b + '&amp;s=' + x.id + '">' + esc(x.title) + '</a> <span class="hsnip">' + (S.b === 'ws' ? 'sheet' : 'p.' + esc(x.pages.replace(' to ', '-'))) + (has ? '' : ', not yet laid out') + '</span></li>';
      }).join('');
      out.innerHTML = '<h1 class="stitle">Scenario reader, ' + esc(BOXN[S.b]) + '</h1><ul class="slist">' + list + '</ul>';
      document.title = 'Heroes System Tactical Scale scenario reader';
      return;
    }
    var idx = d.entries.indexOf(e), prev = d.entries[idx - 1], next = d.entries[idx + 1];
    document.title = e.title + ', ' + BOXN[S.b] + ' scenario, Heroes System Tactical Scale';
    $('subtitle').textContent = 'Scenario reader, ' + BOXN[S.b];
    $('srcnote').textContent = f && f.book.sheets ? 'Text and pictures come from the original War Stories sheet, which you can also download as a PDF below.' : 'Text and pictures come from the ' + (f ? f.book.title + ' ' + f.book.version : 'original book') + ', pages ' + e.pages.replace(' to ', ' to ') + '.';
    var h = '<nav class="scrumb" aria-label="Breadcrumb"><a href="scenarios.html?b=' + S.b + '&amp;e=' + e.id + '">All ' + esc(BOXN[S.b]) + ' scenarios</a></nav>';
    h += '<h1 class="stitle">' + esc(e.title) + '</h1>';
    h += '<p class="smeta">' + [e.type === 'Single scenarios' || e.type === 'Bonus scenario' ? 'Scenario' : /^Campaign/.test(e.type) ? 'Campaign scenario' : 'Rules', e.date, (S.b === 'ws' ? 'Original sheet, PDF' : 'Booklet p.' + e.pages.replace(' to ', '-'))].filter(Boolean).map(esc).join(' &middot; ') + '</p>';
    if (!fe) {
      h += '<p class="htext">The full text of this entry is not laid out yet. Here is the summary.</p><p class="htext">' + esc(e.summary) + '</p><dl class="sfacts">' + e.facts.map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>' + armies(e);
    } else {
      var toc = fe.blocks.filter(function (b) { return b.k === 'h'; }).map(function (b) { return '<a class="chip" href="#' + slug(b.t) + '">' + esc(b.t) + '</a>'; });
      if (e.armies) toc.push('<a class="chip" href="#armies">Armies in the builder</a>');
      if (fe.pages) toc.push('<a class="chip" href="#original-pages">Original pages</a>');
      h += '<div class="stoc chips" role="navigation" aria-label="On this page">' + toc.join('') + '</div>';
      h += '<div class="sbody">' + fe.blocks.map(block).join('') + '</div>';
      h += armies(e) + (fe.pages ? pagesGallery(f, fe) : '') + dl(f, fe);
    }
    h += '<nav class="spn" aria-label="Previous and next">' + (prev ? '<a class="btn ghost" href="scenario.html?b=' + S.b + '&amp;s=' + prev.id + '">&larr; ' + esc(prev.title) + '</a>' : '<span></span>') + (next ? '<a class="btn ghost" href="scenario.html?b=' + S.b + '&amp;s=' + next.id + '">' + esc(next.title) + ' &rarr;</a>' : '<span></span>') + '</nav>';
    out.innerHTML = h;
  }

  var zoomed = false;
  function openBox(src, cap) {
    $('lbxImg').src = src; $('lbxImg').alt = cap || ''; $('lbxCap').textContent = cap || '';
    zoomed = false; $('lbxBody').classList.remove('z'); $('lbxZoom').textContent = 'Zoom in';
    $('lbx').hidden = false; document.body.classList.add('lbxopen');
  }
  function closeBox() { $('lbx').hidden = true; document.body.classList.remove('lbxopen'); $('lbxImg').removeAttribute('src'); }

  function bind() {
    document.addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-zoom]');
      if (el) { openBox(el.dataset.zoom, el.dataset.cap); }
    });
    $('lbxClose').onclick = closeBox;
    $('lbxZoom').onclick = function () { zoomed = !zoomed; $('lbxBody').classList.toggle('z', zoomed); this.textContent = zoomed ? 'Fit to screen' : 'Zoom in'; };
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('lbx').hidden) closeBox(); });
    $('btnTheme').onclick = function () {
      S.theme = S.theme === 'dark' ? 'light' : 'dark';
      try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = S.theme; localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
      render();
    };
  }
  function init() {
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) S.theme = j.theme; } catch (e) { /* ignore */ }
    var p = new URLSearchParams(location.search);
    if (BOXN[p.get('b')]) S.b = p.get('b');
    if (p.get('s') && /^[a-z0-9-]+$/.test(p.get('s'))) S.s = p.get('s');
    window.HTS_SCEN_FULL = window.HTS_SCEN_FULL || {};
    bind(); render();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }
  init();
  window.HTS_SREAD_UI = { state: S };
})();
