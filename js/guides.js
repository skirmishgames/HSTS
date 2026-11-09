(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var S = { g: '', d: '', c: 'all', q: '', theme: 'light' };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/__(.+?)__/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([a-z][a-z0-9_-]*\.html(?:\?[a-z0-9_=&;%.-]*)?)\)/g, '<a href="$2">$1</a>')
      .replace(/\[([^\]]+)\]\((https:\/\/(?:steamcommunity\.com|drive\.google\.com)\/[a-zA-Z0-9_.\/?=-]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function data() { return window.HTS_GUIDES; }
  function lib() { return window.HTS_LIB || { groups: [], docs: [] }; }
  function curG() { return data().guides.filter(function (g) { return g.id === S.g; })[0]; }
  function curD() { return lib().docs.filter(function (d) { return d.id === S.d; })[0]; }
  function grp(id) { return lib().groups.filter(function (g) { return g.id === id; })[0]; }
  var EDN = { V1: 'First edition (V1)', V2: 'Big Red One (V2)', Community: 'Community, unofficial' };

  function block(b) {
    switch (b.k) {
      case 'h': return '<h2 id="' + slug(b.t) + '">' + rich(b.t) + '</h2>';
      case 'h3': return '<h3>' + rich(b.t) + '</h3>';
      case 'p': return '<p>' + rich(b.t) + '</p>';
      case 'note': return '<aside class="snote">' + rich(b.t) + '</aside>';
      case 'ul': return '<ul>' + b.items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>';
      case 'ol': return '<ol>' + b.items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ol>';
      case 'table': return '<div class="stable"><table><thead><tr>' + b.head.map(function (h) { return '<th>' + rich(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + b.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + rich(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
      default: return '';
    }
  }

  function renderGuide(g) {
    var d = data(), out = $('out'), i = d.guides.indexOf(g), prev = d.guides[i - 1], next = d.guides[i + 1];
    document.title = g.title + ', Guides, Heroes System Tactical Scale';
    $('subtitle').textContent = 'Guides and documents';
    var h = '<nav class="scrumb" aria-label="Breadcrumb"><a href="guides.html">All guides and documents</a></nav>';
    h += '<h1 class="stitle">' + esc(g.title) + '</h1><p class="smeta">' + esc(g.tag) + '</p>';
    var toc = g.blocks.filter(function (b) { return b.k === 'h'; }).map(function (b) { return '<a class="chip" href="#' + slug(b.t) + '">' + esc(b.t) + '</a>'; });
    if (toc.length > 2) h += '<div class="stoc chips" role="navigation" aria-label="On this page">' + toc.join('') + '</div>';
    h += '<div class="sbody">' + g.blocks.map(block).join('') + '</div>';
    h += '<p class="hsrc">Source: ' + esc(g.source) + (g.link ? ' <a href="' + esc(g.link.href) + '" rel="noopener" target="_blank">' + esc(g.link.label) + '</a>.' : '') + '</p>';
    h += '<nav class="spn" aria-label="Previous and next">' + (prev ? '<a class="btn ghost" href="guides.html?g=' + prev.id + '">&larr; ' + esc(prev.title) + '</a>' : '<span></span>') + (next ? '<a class="btn ghost" href="guides.html?g=' + next.id + '">' + esc(next.title) + ' &rarr;</a>' : '<span></span>') + '</nav>';
    out.innerHTML = h;
  }

  function paras(t) { return String(t).split(/\n{2,}/).map(function (p) { return '<p>' + esc(p.replace(/\n/g, ' ')) + '</p>'; }).join(''); }

  function renderDoc(dc) {
    var L = lib(), out = $('out'), g = grp(dc.group);
    var same = L.docs.filter(function (x) { return x.group === dc.group; }), i = same.indexOf(dc), prev = same[i - 1], next = same[i + 1];
    document.title = dc.title + ', Documents, Heroes System Tactical Scale';
    $('subtitle').textContent = 'Guides and documents';
    var h = '<nav class="scrumb" aria-label="Breadcrumb"><a href="guides.html?c=' + dc.group + '">' + esc(g ? g.title : 'Documents') + '</a></nav>';
    h += '<h1 class="stitle">' + esc(dc.title) + '</h1>';
    h += '<p class="smeta">' + [EDN[dc.ed], dc.n + (dc.n === 1 ? ' page' : ' pages'), dc.credit].filter(Boolean).map(esc).join(' &middot; ') + '</p>';
    h += '<aside class="snote">' + (dc.ed === 'V2' ? 'This document is for the Big Red One (V2) rules.' : (dc.ed === 'Community' ? 'Fan made, not official. ' : dc.ed === 'V1' ? 'A first edition document. ' : '') + 'Where this differs from the Big Red One (V2) rules, the V2 rules win.') + '</aside>';
    if (dc.part) {
      var pl = dc.part.link ? '<a href="guides.html?d=' + dc.part.link + '">' + esc(dc.part.name) + '</a>' : esc(dc.part.name);
      h += '<aside class="snote">' + (dc.part.n ? 'Part of ' + pl + ', scenario ' + dc.part.n + ' of ' + dc.part.of + '.' : 'This is the introduction to ' + esc(dc.part.name) + (dc.part.of ? '. Its ' + dc.part.of + ' scenarios are listed below.' : '.')) + '</aside>';
    }
    h += '<p class="htext">' + esc(dc.summary) + '</p>';
    var kids = L.docs.filter(function (x) { return x.part && x.part.link === dc.id; });
    if (kids.length) h += '<ol class="slist">' + kids.map(function (x) { return '<li><a href="guides.html?d=' + x.id + '">' + esc(x.title.replace(/^Contest scenario \d+: /, '')) + '</a></li>'; }).join('') + '</ol>';
    if (dc.pdf) h += '<p class="sarow"><a class="btn" href="' + esc(dc.pdf.href) + '" download>Download the PDF</a><span class="sameta">' + esc(dc.pdf.size) + '. ' + esc(dc.pdf.note) + '</span></p>';
    else h += '<p class="hsrc">The pages are below as pictures, with the text of each page under it. The original PDF is kept in the project files, not on this site.</p>';
    if (dc.n > 1) {
      var chips = ''; for (var k = 1; k <= dc.n; k++) chips += '<a class="chip" href="#p' + k + '">' + k + '</a>';
      h += '<div class="stoc chips" role="navigation" aria-label="Pages"><span class="hsrc">Pages</span>' + chips + '</div>';
    }
    for (var p = 1; p <= dc.n; p++) {
      var src = 'img/hon/lib/' + dc.id + '/p' + (p < 10 ? '0' + p : p) + '.webp', sz = dc.sizes[p - 1], tx = dc.text[p - 1] || '';
      h += '<section class="dpage" id="p' + p + '"><h2 class="dph">Page ' + p + '</h2><div class="sfig"><button type="button" class="sfigb" data-zoom="' + src + '" data-cap="' + esc(dc.title + ', page ' + p) + '" aria-label="Open page ' + p + ' full size"><img src="' + src + '" alt="' + esc(dc.title + ', page ' + p) + '" width="' + sz[0] + '" height="' + sz[1] + '" loading="lazy"></button></div>' +
        (tx.length > 20 ? '<details class="dtext"><summary>Text of page ' + p + '</summary><div class="ptext">' + paras(tx) + '</div></details>' : '<p class="hsrc">This page is a picture with no text to extract.</p>') + '</section>';
    }
    h += '<nav class="spn" aria-label="Previous and next">' + (prev ? '<a class="btn ghost" href="guides.html?d=' + prev.id + '">&larr; ' + esc(prev.title) + '</a>' : '<span></span>') + (next ? '<a class="btn ghost" href="guides.html?d=' + next.id + '">' + esc(next.title) + ' &rarr;</a>' : '<span></span>') + '</nav>';
    out.innerHTML = h;
  }

  function docCard(dc, extra) {
    return '<li class="dcard"><a href="guides.html?d=' + dc.id + '"><strong>' + esc(dc.title) + '</strong></a>' +
      '<span class="dbadges"><span class="hb">' + esc(dc.ed === 'Community' ? 'Community' : dc.ed) + '</span><span class="hb">' + dc.n + (dc.n === 1 ? ' page' : ' pages') + '</span>' + (dc.pdf ? '<span class="hb">PDF ' + esc(dc.pdf.size) + '</span>' : '') + '</span>' +
      '<span class="hsnip">' + esc(dc.summary) + '</span>' + (dc.part ? '<span class="hsrc">Part of ' + esc(dc.part.name) + '</span>' : '') + (extra || '') + '</li>';
  }

  function matches() {
    var toks = norm(S.q).split(' ').filter(Boolean), res = [];
    lib().docs.forEach(function (dc) {
      if (S.c !== 'all' && dc.group !== S.c) return;
      if (!toks.length) { res.push({ dc: dc, hits: [] }); return; }
      var head = norm(dc.title + ' ' + dc.summary), hits = [];
      dc.text.forEach(function (t, i) {
        var hay = norm(t);
        if (toks.every(function (k) { return hay.indexOf(k) >= 0; })) hits.push(i + 1);
      });
      if (hits.length || toks.every(function (k) { return head.indexOf(k) >= 0; })) res.push({ dc: dc, hits: hits });
    });
    return res;
  }

  function renderList() {
    var d = data(), L = lib(), out = $('out');
    document.title = 'Guides and documents, Heroes System Tactical Scale';
    $('subtitle').textContent = 'Guides and documents';
    var h = '<h1 class="stitle">Guides and documents</h1><p class="htext">' + esc(d.intro) + '</p>';
    h += '<h2 id="guides">Guides</h2><ul class="slist" id="gList">' + d.guides.map(function (x) {
      return '<li><a href="guides.html?g=' + x.id + '">' + esc(x.title) + '</a> <span class="hsnip">' + esc(x.tag) + '. ' + esc(x.summary) + '</span></li>';
    }).join('') + '</ul>';
    h += '<h2 id="documents">Documents</h2><p class="htext">Rules sheets, scenario packs and single scenarios, Gazettes, unit references and catalogues from the first edition and the community. Each opens as pictures of the pages with the text under them, so you can search them, and the rules, scenarios, Gazettes, community rules and aids have a PDF to download.</p>';
    h += '<div class="field"><label class="label" for="lq">Search the documents</label><input id="lq" type="search" placeholder="Try: mines, night combat, landing craft, Lord Lovat" autocomplete="off" value="' + esc(S.q) + '"></div>';
    h += '<div class="chips" id="lchips" role="group" aria-label="Kind of document"><button type="button" class="chip' + (S.c === 'all' ? ' on' : '') + '" data-c="all">All ' + L.docs.length + '</button>' + L.groups.map(function (g) {
      var n = L.docs.filter(function (x) { return x.group === g.id; }).length;
      return '<button type="button" class="chip' + (S.c === g.id ? ' on' : '') + '" data-c="' + g.id + '">' + esc(g.title) + ' ' + n + '</button>';
    }).join('') + '</div>';
    h += '<p class="hsrc" id="lstat"></p><div id="lout"></div>';
    out.innerHTML = h;
    $('lq').oninput = function () { S.q = this.value; renderResults(); };
    $('lchips').onclick = function (ev) { var b = ev.target.closest('[data-c]'); if (!b) return; S.c = b.dataset.c; Array.prototype.forEach.call(this.querySelectorAll('.chip'), function (x) { x.classList.toggle('on', x === b); }); renderResults(); };
    renderResults();
  }

  function snippet(t, toks) {
    var s = t.replace(/\s+/g, ' '), low = s.toLowerCase(), at = -1;
    toks.forEach(function (k) { var i = low.indexOf(k); if (i >= 0 && (at < 0 || i < at)) at = i; });
    var a = Math.max(0, (at < 0 ? 0 : at) - 70), b = Math.min(s.length, a + 200);
    return (a > 0 ? '... ' : '') + esc(s.slice(a, b)) + (b < s.length ? ' ...' : '');
  }
  function renderResults() {
    var L = lib(), res = matches(), toks = norm(S.q).split(' ').filter(Boolean), h = '';
    if (!res.length) { $('lout').innerHTML = '<p class="empty2">No document matches. Try fewer or simpler words.</p>'; $('lstat').textContent = '0 documents.'; return; }
    if (toks.length) {
      h = '<ul class="dlist">' + res.map(function (x) {
        var dc = x.dc, first = x.hits.slice(0, 4).map(function (p) { return '<a class="chip" href="guides.html?d=' + dc.id + '#p' + p + '">p.' + p + '</a>'; }).join('');
        var sn = x.hits.length ? '<span class="hsnip">' + snippet(dc.text[x.hits[0] - 1], toks) + '</span>' : '';
        return docCard(dc, sn + (x.hits.length ? '<span class="chips">' + first + (x.hits.length > 4 ? '<span class="hsrc">and ' + (x.hits.length - 4) + ' more pages</span>' : '') + '</span>' : ''));
      }).join('') + '</ul>';
      $('lstat').textContent = res.length + ' document' + (res.length === 1 ? '' : 's') + ' match.';
    } else {
      h = L.groups.filter(function (g) { return S.c === 'all' || S.c === g.id; }).map(function (g) {
        var docs = res.filter(function (x) { return x.dc.group === g.id; });
        if (!docs.length) return '';
        return '<section class="dgrp" id="g-' + g.id + '"><h3>' + esc(g.title) + '</h3><p class="hsrc">' + esc(g.intro) + '</p><ul class="dlist">' + docs.map(function (x) { return docCard(x.dc); }).join('') + '</ul></section>';
      }).join('');
      $('lstat').textContent = res.length + ' documents.';
    }
    $('lout').innerHTML = h;
  }

  function render() {
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    var g = curG(), d = curD();
    if (g) renderGuide(g); else if (d) renderDoc(d); else renderList();
  }

  var zoomed = false;
  function openBox(src, cap) {
    $('lbxImg').src = src; $('lbxImg').alt = cap || ''; $('lbxCap').textContent = cap || '';
    zoomed = false; $('lbxBody').classList.remove('z'); $('lbxZoom').textContent = 'Zoom in';
    $('lbx').hidden = false; document.body.classList.add('lbxopen');
  }
  function closeBox() { $('lbx').hidden = true; document.body.classList.remove('lbxopen'); $('lbxImg').removeAttribute('src'); }

  function init() {
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) S.theme = j.theme; } catch (e) { /* ignore */ }
    var p = new URLSearchParams(location.search);
    if (p.get('g') && /^[a-z0-9-]+$/.test(p.get('g'))) S.g = p.get('g');
    if (p.get('d') && /^[a-z0-9-]+$/.test(p.get('d'))) S.d = p.get('d');
    if (p.get('c') && /^[a-z]+$/.test(p.get('c'))) S.c = p.get('c');
    if (p.get('q')) S.q = p.get('q');
    document.addEventListener('click', function (ev) { var el = ev.target.closest('[data-zoom]'); if (el) openBox(el.dataset.zoom, el.dataset.cap); });
    $('lbxClose').onclick = closeBox;
    $('lbxZoom').onclick = function () { zoomed = !zoomed; $('lbxBody').classList.toggle('z', zoomed); this.textContent = zoomed ? 'Fit to screen' : 'Zoom in'; };
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('lbx').hidden) closeBox(); });
    $('btnTheme').onclick = function () {
      S.theme = S.theme === 'dark' ? 'light' : 'dark';
      try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = S.theme; localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
      document.documentElement.setAttribute('data-theme', S.theme); $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    };
    render();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }
  init();
})();
