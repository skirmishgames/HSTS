(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }, { id: 'omaha', name: 'Bloody Omaha' }, { id: 'caen', name: 'Battle for Caen' }, { id: 'ws', name: 'War Stories' }, { id: 'v1', name: 'First edition (V1)' }, { id: 'fan', name: 'Fan made (unofficial)' }, { id: 'hos', name: 'Heroes of Stalingrad' }];
  var S = { b: 'bro', q: '', type: 'all', kind: 'all', size: 'all', needs: '', open: {}, theme: 'light' };
  var KINDS = [['all', 'All'], ['official', 'Official'], ['fan', 'Fan made']];
  var SIZES = [['all', 'All'], ['le150', 'Up to 150'], ['le300', '151 to 300'], ['gt300', 'Over 300'], ['none', 'Not stated']];
  var cache = {}, NCOL = 0;
  var SRCN = { bro: 'Scenario Booklet', omaha: 'Bloody Omaha rulebook', caen: 'Battle for Caen booklet V1.4', ws: 'War Stories sheet', v1: 'Library document', fan: 'Library document', hos: 'Library document' };
  function isLib() { return S.b === 'v1' || S.b === 'fan' || S.b === 'hos'; }

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
  function pg(e) { return S.b === 'ws' ? 'sheet' : isLib() ? e.pages + (e.pages === '1' ? ' page' : ' pages') : 'p.' + e.pages.replace(' to ', '-'); }

  // First edition (V1): built from the document library, so the scenarios published
  // on their own, in books, packs and gazettes are found from the Scenarios menu too.
  var V1ORDER = ['Single scenario', 'Core Set scenario book', 'Scenario Contest Compilation', 'Mini campaign', 'Gazette', 'Pack or book'];
  var HOSORDER = ['Rules and game aids', 'Scenario', 'Mini campaign', 'Battlefield Stories', 'War Stories', 'Punchboards and tiles'];
  var FANORDER = ['Small armies', 'Large armies', 'Very large armies', 'Skirmish', 'Campaign scenario', 'Campaign', 'Tournament'];
  function v1type(d) {
    if (d.group === 'fanmade' || d.group === 'stalingrad') return d.kind || 'Scenario';
    var pn = d.part ? d.part.name : '';
    if (d.group === 'gazettes' || /^Gazette/.test(pn)) return 'Gazette';
    if (/^Scenario Contest/.test(pn)) return 'Scenario Contest Compilation';
    if (/^Core Set/.test(pn)) return 'Core Set scenario book';
    if (pn) return 'Mini campaign';
    if (d.group === 'scenarios') return 'Pack or book';
    return 'Single scenario';
  }
  function v1load() {
    var lib = window.HTS_LIB || { docs: [] }, seen = {};
    var fan = S.b === 'fan', hos = S.b === 'hos';
    var entries = lib.docs.filter(function (d) { return hos ? d.group === 'stalingrad' : fan ? d.group === 'fanmade' : (d.group === 'scenarios' || d.group === 'single' || d.group === 'gazettes'); }).map(function (d) {
      var t = v1type(d), isIntro = /-intro$/.test(d.id) || d.group === 'scenarios' || d.group === 'gazettes';
      var facts = [['Edition', d.ed === 'V2' ? 'Big Red One (V2) rules' : d.ed === 'Community' ? 'Fan made, not official' : d.ed === 'Other' ? 'Heroes of Stalingrad rules (Eastern Front)' : 'First edition (V1) rules']];
      if (d.part) facts.push(['Part of', d.part.name + (d.part.n ? ', scenario ' + d.part.n + ' of ' + d.part.of : '')]);
      if (d.credit) facts.push(['Credit', d.credit]);
      facts.push(['Length', d.n + (d.n === 1 ? ' page' : ' pages')]);
      var tl = d.scn && d.scn.tiles && d.scn.tiles.length ? d.scn.tiles.join(', ') : '';
      if (d.scn) {
        if (d.scn.sides) facts.push(['Sides', d.scn.sides]);
        if (d.scn.pts) facts.push(['Army points', d.scn.pts]);
        if (d.scn.turns) facts.push(['Turns', d.scn.turns]);
        if (tl) facts.push(['Map tiles', tl]);
        else if (d.scn.tilesNote) facts.push(['Map tiles', d.scn.tilesNote]);
      }
      return {
        id: d.id, title: d.title.replace(/^Contest scenario \d+: /, ''), type: t, pages: String(d.n), date: tl ? 'Map tiles: ' + tl : d.part ? 'Part of ' + d.part.name : '',
        summary: d.summary, facts: facts, doc: d, v1: 1,
        badge: fan ? 'Fan made' : hos ? (d.kind === 'Rules and game aids' ? 'Rules' : d.kind === 'Punchboards and tiles' ? 'Tiles' : 'Scenario') :  d.group === 'gazettes' ? 'Story' : isIntro ? 'Pack' : 'Scenario', bcls: fan ? 'c' : hos ? (d.kind === 'Rules and game aids' || d.kind === 'Punchboards and tiles' ? 'r' : 's') : isIntro || d.group === 'gazettes' ? 'r' : 's',
        text: (d.text || []).join(' '), stext: d.scn && window.HTS_FANSCN ? window.HTS_FANSCN.text(d) : ''
      };
    });
    var ORD = hos ? HOSORDER : fan ? FANORDER : V1ORDER;
    entries.sort(function (a, b) { return ORD.indexOf(a.type) - ORD.indexOf(b.type); });
    return { entries: entries, types: ORD.filter(function (t) { return entries.some(function (e) { return e.type === t; }); }), source: 'document library', seen: seen };
  }

  function load() {
    if (cache[S.b]) return cache[S.b];
    var d = isLib() ? v1load() : window.HTS_SCEN['hon-' + S.b];
    d.entries.forEach(function (e) {
      e.head = norm(e.title);
      e.hay = norm((e.v1 ? e.text + ' ' + (e.stext || '') + ' ' + (e.doc.group === 'gazettes' ? 'gazette devil pig news ' : e.doc.group === 'fanmade' ? 'fan made unofficial scenario ' : 'scenario ') + (e.date || '') + ' ' : '') + (e.armies ? 'army builder armies ' : '') + e.title + ' ' + e.type + ' ' + e.date + ' page ' + e.pages + ' ' + e.summary + ' ' + e.facts.map(function (f) { return f[0] + ' ' + f[1]; }).join(' '));
    });
    d.entries.forEach(function (e) {
      e.kind = e.v1 && (e.doc.ed === 'Community' || e.doc.group === 'fanmade') ? 'fan' : 'official';
      e.pts = armyPts(e);
      e.sz = e.pts == null ? 'none' : e.pts <= 150 ? 'le150' : e.pts <= 300 ? 'le300' : 'gt300';
      var codes = [];
      (needsOf(e) || []).forEach(function (c) { (Array.isArray(c) ? c : [c]).forEach(function (x) { if (codes.indexOf(x) < 0) codes.push(x); }); });
      e.nk = codes;
    });
    cache[S.b] = d;
    return d;
  }

  /* Army size: the largest points figure printed for the scenario. Box booklets print it on the Armies line.
     Library documents are page text, so the figure is read from the text; packs, books, rules sheets and
     punchboard documents hold several scenarios or none and are left as Not stated. */
  var PTS_BOX = /(\d{2,4})\s*(?:army\s+)?points?\b/gi, PTS_ALT = /,\s*(\d{3,4})\)/g;
  var PTS_LIB = /(?:^|[^\d.,])(\d{2,4})\s*(?:army\s+)?(?:points?|pts)\b/gi;
  function maxOf(text, rx, bonus) {
    var best = null, m;
    rx.lastIndex = 0;
    while ((m = rx.exec(text))) {
      var n = Number(m[1]);
      if (n < 40 || n > 1500) continue;
      if (bonus && (/bonus\s+of\s*$/i.test(text.slice(Math.max(0, m.index - 14), m.index + 1)) || /^\W*(?:bonus|more|extra)/i.test(text.slice(m.index + m[0].length, m.index + m[0].length + 12)))) continue;
      if (best == null || n > best) best = n;
    }
    return best;
  }
  function armyPts(e) {
    if (e.v1) {
      if (e.bcls === 'r') return null;
      var sp = e.doc.scn && window.HTS_FANSCN ? window.HTS_FANSCN.maxPts(e.doc) : null;
      if (sp != null) return sp;
      return maxOf(e.text + ' ' + e.summary, PTS_LIB, true);
    }
    var t = e.facts.filter(function (f) { return f[0] === 'Armies'; }).map(function (f) { return f[1]; }).join(' ');
    var a = maxOf(t, PTS_BOX, false), b = maxOf(t, PTS_ALT, false);
    return a == null ? b : b == null ? a : Math.max(a, b);
  }

  function renderControls(d, F) {
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>';
    }).join('');
    $('types').innerHTML = '<button type="button" class="chip' + (S.type === 'all' ? ' on' : '') + '" data-type="all">All</button>' +
      d.types.map(function (c) { return '<button type="button" class="chip' + (S.type === c ? ' on' : '') + '" data-type="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $('kinds').innerHTML = KINDS.map(function (k) { return '<button type="button" class="chip' + (S.kind === k[0] ? ' on' : '') + '" data-fk="' + k[0] + '" aria-pressed="' + (S.kind === k[0]) + '">' + k[1] + ' <span class="count">' + F.kinds[k[0]] + '</span></button>'; }).join('');
    $('sizes').innerHTML = SIZES.map(function (k) { return '<button type="button" class="chip' + (S.size === k[0] ? ' on' : '') + '" data-fz="' + k[0] + '" aria-pressed="' + (S.size === k[0]) + '">' + k[1] + ' <span class="count">' + F.sizes[k[0]] + '</span></button>'; }).join('');
    $('needsSel').innerHTML = '<option value="">Any product</option>' + F.needs.map(function (n) {
      return '<option value="' + esc(n.code) + '"' + (S.needs === n.code ? ' selected' : '') + (!n.n && S.needs !== n.code ? ' disabled' : '') + '>' + esc(OWN.name(n.code)) + ' (' + n.n + ')</option>';
    }).join('');
    $('needsSel').value = S.needs;
    $('btnClear').hidden = S.kind === 'all' && S.size === 'all' && !S.needs;
    $('q').value = S.q;
    var sb = BOXES.filter(function (b) { return b.id === S.b; })[0];
    if ($('subtitle') && sb) $('subtitle').textContent = 'Scenarios index, Heroes of Normandie, ' + sb.name;
    $('srcnote').textContent = S.b === 'hos' ? 'Heroes of Stalingrad is the Eastern Front game of the same system as Heroes of Normandie, which covers the Western Front. These are its rules, scenarios, stories, punchboards and map tiles. It has its own rules. Each opens as page pictures with the text. Rules, scenarios and stories have a PDF. Punchboards and tiles are pictures only, reduced in size.' : S.b === 'fan' ? 'Fan made scenarios and campaigns, not official. Only the ones that name their map tiles or show a clear printed map are here. Most are rebuilt as web pages with the map, forces and rules, and have no PDF. The four campaigns open as page pictures with the text and have a PDF. Where a scenario differs from the Big Red One (V2) rules, the V2 rules win.' : S.b === 'v1' ? 'Every first edition scenario in the library: single scenarios, scenarios cut out of books, packs and gazettes. Each opens as page pictures with the text, and has a PDF. Where a scenario differs from the Big Red One (V2) rules, the V2 rules win.' : 'Page numbers are the printed page numbers of the ' + d.source + ' (the PDF page matches the printed number).';
    dlbar();
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function encode(j) { return btoa(unescape(encodeURIComponent(JSON.stringify(j)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  var SIDE = { us: ['us', 'American', '1st Infantry Division'], ge: ['ge', 'German', '2. Panzer Division'], uk: ['uk', 'Commonwealth', 'Commonwealth'] };
  function armyHref(e, side) {
    var a = e.armies[side];
    return 'builder.html#b=' + encode({ n: a.side || side, l: a.limit, nm: e.title + ', ' + (a.label || SIDE[side][1]), a: a.tiles });
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
    if (e.v1) {
      var pd = e.doc.pdf;
      return '<p class="sarow"><a class="btn" data-read="' + esc(e.id) + '" href="guides.html?d=' + esc(e.id) + '">' + (e.badge === 'Scenario' ? 'Read the scenario' : 'Read it') + '</a>' +
        (pd ? '<a class="btn ghost" href="' + esc(pd.href) + '" download>Download the PDF (' + esc(pd.size) + ')</a>' : '') +
        '<span class="sameta">Page pictures with the text, ' + esc(e.pages) + (e.pages === '1' ? ' page' : ' pages') + '.</span></p>';
    }
    var f = (window.HTS_SCEN_FULL || {})['hon-' + S.b];
    if (!f || !f.entries[e.id]) return '';
    return '<p class="sarow"><a class="btn" data-read="' + esc(e.id) + '" href="scenario.html?b=' + S.b + '&s=' + esc(e.id) + '">Read the full scenario</a><span class="sameta">Full text, maps, recruitment pictures and the original ' + (S.b === 'ws' ? 'sheet' : 'pages') + '. ' + (S.b === 'ws' ? 'War Stories sheet' : 'Booklet ' + esc(pg(e))) + '.</span></p>';
  }
  function dlbar() {
    var f = (window.HTS_SCEN_FULL || {})['hon-' + S.b];
    if (!$('dlbar')) return;
    if (isLib()) { $('dlbar').innerHTML = '<span class="label">Looking for rules, units or gazette stories?</span> <a class="btn ghost" href="guides.html">Browse all documents</a>'; return; }
    if (!f) return;
    $('dlbar').innerHTML = '<span class="label">Download the original</span><ul>' + f.book.pdfs.map(function (p) {
      return '<li><a class="btn ghost" href="' + esc(p.href) + '" download>' + esc(p.label) + '</a><span class="sameta">' + esc(p.size) + '. ' + esc(p.note || '') + '</span></li>';
    }).join('') + '</ul>';
  }
  function body(e) {
    return readLink(e) + '<p class="htext">' + esc(e.summary) + '</p>' +
      '<dl class="sfacts">' + e.facts.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>'; }).join('') + (e.v1 && e.pts != null ? '<dt>Army size</dt><dd>Up to ' + e.pts + ' points (the largest figure printed in the text)</dd>' : '') + (needsOf(e) && !e.facts.some(function (f) { return f[0] === 'Required products'; }) ? '<dt>Needs</dt><dd>' + esc(needsText(e)) + '</dd>' : '') + '</dl>' + figs(e) + armies(e) +
      '<p class="hsrc">' + (e.v1 ? 'From the document library, ' + esc(pg(e)) : esc(SRCN[S.b] || 'Scenario Booklet') + ', ' + esc(pg(e))) + '</p>';
  }
  // My collection: what a scenario needs (data/hon-needs.js). No entry means not tagged, and it is never hidden.
  var OWN = window.HTS_OWN;
  function needsOf(e) { var n = window.HTS_NEEDS && window.HTS_NEEDS[(e.v1 ? 'lib' : S.b) + ':' + e.id]; return n && n.length ? n : null; }
  function usable(e) {
    var n = needsOf(e);
    return !n || !OWN || n.every(function (c) { return Array.isArray(c) ? c.some(function (x) { return OWN.owns(x); }) : OWN.owns(c); });
  }
  function pname(c) { return OWN.name(c).replace(/^Heroes of (Normandie|Stalingrad): /, ''); }
  function needsText(e) {
    var n = needsOf(e);
    return n ? n.map(function (c) { return Array.isArray(c) ? c.map(pname).join(' or ') : pname(c); }).join(', ') : '';
  }
  function needsLine(e) {
    if (!OWN) return '';
    var n = needsOf(e);
    if (n) return '<span class="needs"><b>Needs:</b> ' + esc(needsText(e)) + '</span>';
    return OWN.active() ? '<span class="needs">Needs not tagged, shown anyway.</span>' : '';
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
      '<span class="hname"><span class="ht">' + mk(e.title) + '</span>' + (e.date ? '<span class="hsnip">' + esc(e.date) + '</span>' : '') + needsLine(e) + snip + '</span>' +
      '<span class="hbadges"><span class="hb hb-t' + (e.v1 ? e.bcls : /^Campaign/.test(e.type) ? 'c' : /scenario/i.test(e.type) ? 's' : 'r') + '">' + esc(e.v1 ? e.badge : e.type === 'Booklet rules and reference' ? 'Rules' : /^Campaign/.test(e.type) ? 'Campaign' : 'Scenario') + '</span></span>' +
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
    if (S.type !== 'all' && d.types.indexOf(S.type) < 0) S.type = 'all';
    var toks = tokens(S.q), mk = markFn(toks);
    /* one pass for every filter, so each chip and the Needs list can count what it would give with the others as they are */
    var info = d.entries.map(function (e, i) {
      var score = 0;
      if (toks.length) {
        var padded = ' ' + e.hay + ' ', hp = ' ' + e.head + ' ';
        if (!toks.every(function (t) { return hit(e.hay, padded, t); })) score = -1;
        else toks.forEach(function (t) { score += countOf(e.hay, t) + (hit(e.head, hp, t) ? 20 : 0); });
      }
      return { e: e, score: score, i: i, own: usable(e) };
    });
    function ok(x, skip) {
      var e = x.e;
      if (skip !== 'own' && !x.own) return false;
      if (skip !== 'type' && S.type !== 'all' && e.type !== S.type) return false;
      if (skip !== 'q' && x.score < 0) return false;
      if (skip !== 'kind' && S.kind !== 'all' && e.kind !== S.kind) return false;
      if (skip !== 'size' && S.size !== 'all' && e.sz !== S.size) return false;
      if (skip !== 'needs' && S.needs && e.nk.indexOf(S.needs) < 0) return false;
      return true;
    }
    var F = { kinds: {}, sizes: {}, needs: [] }, byCode = {};
    /* Needs lists only products that a scenario shown in this list needs; the number is what is left with the other filters on */
    info.forEach(function (x) { if (x.own) x.e.nk.forEach(function (c) { byCode[c] = 0; }); });
    if (S.needs && byCode[S.needs] == null) S.needs = '';
    KINDS.forEach(function (k) { F.kinds[k[0]] = info.filter(function (x) { return ok(x, 'kind') && (k[0] === 'all' || x.e.kind === k[0]); }).length; });
    SIZES.forEach(function (k) { F.sizes[k[0]] = info.filter(function (x) { return ok(x, 'size') && (k[0] === 'all' || x.e.sz === k[0]); }).length; });
    info.forEach(function (x) { if (x.own && ok(x, 'needs')) x.e.nk.forEach(function (c) { byCode[c] += 1; }); });
    var order = OWN ? OWN.products.map(function (p) { return p.code; }) : [];
    F.needs = Object.keys(byCode).map(function (c) { return { code: c, n: byCode[c] }; }).sort(function (a, b) {
      var ia = order.indexOf(a.code), ib = order.indexOf(b.code);
      return (ia < 0 ? 9999 : ia) - (ib < 0 ? 9999 : ib) || a.code.localeCompare(b.code);
    });
    renderControls(d, F);
    var res = info.filter(function (x) { return ok(x); }), shown = info.filter(function (x) { return x.own; }).length;
    /* My collection: what it alone takes out of the list the other filters leave, so Show everything adds exactly this many */
    var hidden = info.filter(function (x) { return !x.own && ok(x, 'own'); }).length;
    var untagged = S.needs ? info.filter(function (x) { return ok(x, 'needs') && !x.e.nk.length; }).length : 0;
    if (toks.length) res.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
    if ($('ownnote')) $('ownnote').innerHTML = OWN ? OWN.note(hidden, hidden === 1 ? 'scenario' : 'scenarios') : '';
    if (!res.length) {
      $('out').innerHTML = '<p class="empty2">Nothing matches. Try fewer or simpler words, or clear the filters.' + (hidden ? ' Your collection hides ' + hidden + ' here.' : '') + '</p>';
      $('stat').textContent = '0 entries.' + (untagged ? ' ' + untagged + ' with no needs tagged are left out while a product is chosen.' : '');
    } else {
      $('out').innerHTML = list(res, mk, toks);
      $('stat').textContent = res.length + ' of ' + shown + ' entries, in ' + (isLib() ? 'library order' : 'booklet page order') + '. Click one to read it.';
      if (toks.length) $('stat').textContent = res.length + ' of ' + shown + ' entries, best match first. Click one to read it.';
      if (untagged) $('stat').textContent += ' ' + untagged + ' with no needs tagged are left out while a product is chosen.';
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
      if (S.kind !== 'all') p.set('k', S.kind); if (S.size !== 'all') p.set('z', S.size); if (S.needs) p.set('n', S.needs);
      var o = Object.keys(S.open); if (o.length) p.set('e', o.join(','));
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; render(); return; }
      if ((el = t.closest('[data-type]'))) { S.type = el.dataset.type; render(); return; }
      if ((el = t.closest('[data-fk]'))) { S.kind = el.dataset.fk; render(); return; }
      if ((el = t.closest('[data-fz]'))) { S.size = el.dataset.fz; render(); return; }
      if (t.closest('#btnClear')) { S.kind = 'all'; S.size = 'all'; S.needs = ''; render(); return; }
      if ((el = t.closest('[data-toggle]'))) toggle(el.dataset.toggle);
    });
    window.addEventListener('resize', function () { if (ncol() !== NCOL) render(); });
    $('needsSel').onchange = function () { S.needs = this.value; render(); };
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
    if (KINDS.some(function (k) { return k[0] === p.get('k'); })) S.kind = p.get('k');
    if (SIZES.some(function (k) { return k[0] === p.get('z'); })) S.size = p.get('z');
    if (p.get('n') && p.get('n').length <= 80) S.needs = p.get('n');
    if (p.get('e')) p.get('e').split(',').forEach(function (id) { if (/^[a-z0-9-]+$/.test(id)) S.open[id] = 1; });
    bind(); render();
    if (OWN) OWN.onChange(render);
    var first = Object.keys(S.open)[0]; if (first && $('s-' + first)) $('s-' + first).scrollIntoView({ block: 'center' });
  }
  init();
  window.HTS_SCEN_UI = { state: S, load: load };
})();
