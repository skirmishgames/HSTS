(function () {
  'use strict';
  /* Site-wide search. Nothing is loaded until the first search: each group then loads only its own data files,
     shows its results as soon as they arrive, and links to the page that owns the result. */
  var LSK = 'hts.hon.bro.v1';
  var CAP = 8;
  var VER = (function () { var s = document.querySelector('script[src*="js/search.js"]'), m = s && /\?(v=[^&"]+)/.exec(s.getAttribute('src') || ''); return m ? '?' + m[1] : ''; })();
  var S = { q: '', theme: 'light', all: {} };

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  /* Same length as the input, so a position found in the folded text is the position in the original. */
  function fold(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) { var f = s.charAt(i).normalize('NFD').replace(/[̀-ͯ]/g, ''); out += f.length === 1 ? f.toLowerCase() : s.charAt(i).toLowerCase(); }
    return out;
  }
  var STOP = { a: 1, an: 1, the: 1, of: 1, to: 1, in: 1, on: 1, and: 1, or: 1, for: 1, is: 1, it: 1, at: 1, by: 1, as: 1 };
  function tokens(q) {
    var all = norm(q).split(' ').filter(Boolean), keep = all.filter(function (t) { return !STOP[t]; });
    return keep.length ? keep : all;
  }
  function hit(hay, t) { return t.length <= 2 ? (' ' + hay + ' ').indexOf(' ' + t + ' ') >= 0 : hay.indexOf(t) >= 0; }
  function countOf(hay, t) { var n = 0, i = -1; while ((i = hay.indexOf(t, i + 1)) >= 0 && n < 50) n++; return n; }
  function allHit(hay, toks) { for (var i = 0; i < toks.length; i++) if (!hit(hay, toks[i])) return false; return true; }
  function reOf(toks) {
    if (!toks.length) return null;
    return new RegExp(toks.map(function (t) { var e = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); return t.length <= 2 ? '(?:^|[^a-z0-9])' + e + '(?![a-z0-9])' : e; }).join('|'), 'g');
  }
  /* Highlight on the folded text so accents do not block a match, then cut the original at the same places. */
  function mark(s, toks) {
    s = String(s == null ? '' : s);
    var re = reOf(toks);
    if (!re) return esc(s);
    var f = fold(s), out = '', last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(f))) {
      var a = m.index, b = m.index + m[0].length;
      while (a < b && !/[a-z0-9]/.test(f.charAt(a))) a++; /* a short word match carries its leading separator: keep that outside the mark */
      if (b <= a) { re.lastIndex = m.index + 1; continue; }
      out += esc(s.slice(last, a)) + '<mark>' + esc(s.slice(a, b)) + '</mark>';
      last = b;
    }
    return out + esc(s.slice(last));
  }
  function snippet(x, toks, len) {
    x = String(x || '').replace(/\s+/g, ' ').trim();
    if (!x) return '';
    len = len || 170;
    var f = fold(x), at = -1;
    toks.forEach(function (t) { var i = f.indexOf(t); if (i >= 0 && (at < 0 || i < at)) at = i; });
    var a = Math.max(0, (at < 0 ? 0 : at) - 60), b = Math.min(x.length, a + len);
    if (at < 0) return esc(x.slice(0, len)) + (x.length > len ? ' ...' : '');
    return (a > 0 ? '... ' : '') + mark(x.slice(a, b), toks) + (b < x.length ? ' ...' : '');
  }
  function q(s) { return encodeURIComponent(s); }
  function unitText(units) { return (units || []).map(function (u) { return u[0]; }).join(', '); }

  /* ---------- loading ---------- */
  var files = {};
  function load(list) {
    return Promise.all(list.map(function (f) {
      if (files[f]) return files[f];
      files[f] = new Promise(function (res, rej) {
        var el = document.createElement('script');
        el.src = 'data/' + f + '.js' + VER; el.async = true;
        el.onload = function () { res(); };
        el.onerror = function () { delete files[f]; rej(new Error(f)); };
        document.head.appendChild(el);
      });
      return files[f];
    }));
  }

  /* ---------- the document library, shared by Scenarios and Documents ---------- */
  var LIBX = null;
  function libIndex() {
    if (LIBX) return LIBX;
    function bgText(dc) { return (dc.background || []).map(function (b) { return [b.t, (b.items || []).join(' '), (b.rows || []).map(function (r) { return r.join(' '); }).join(' ')].join(' '); }).join(' '); }
    LIBX = window.HTS_LIB.docs.map(function (dc) {
      return { dc: dc, head: norm(dc.title + ' ' + dc.summary + ' ' + bgText(dc)), title: norm(dc.title), pages: (dc.text || []).map(norm) };
    });
    return LIBX;
  }
  /* A document matches when every word is in its title and summary, or every word is on one page. */
  function docMatch(x, toks) {
    var pages = [], score = 0;
    x.pages.forEach(function (p, i) { if (p && allHit(p, toks)) { pages.push(i + 1); score += countOf(p, toks[0]); } });
    var inHead = allHit(x.head, toks);
    if (!pages.length && !inHead) return null;
    toks.forEach(function (t) { if (hit(x.title, t)) score += 20; });
    return { score: score + (inHead ? 5 : 0), pages: pages };
  }
  var EDN = { V1: 'First edition', V2: 'Big Red One (V2)', Community: 'Community', Other: 'Other Heroes line' };
  function docItem(x, href, groupLabel) {
    var dc = x.dc;
    return { kind: 'doc', ix: x, t: dc.title.replace(/^Contest scenario \d+: /, ''), href: href,
      b: [groupLabel || '', dc.group === 'fanmade' ? 'Fan made' : EDN[dc.ed] || dc.ed, dc.n + (dc.n === 1 ? ' page' : ' pages'), dc.pdf ? 'PDF' : ''].filter(Boolean),
      s: dc.summary, d: dc };
  }
  var SCEN_LIB_GROUPS = { scenarios: 'v1', single: 'v1', gazettes: 'v1', fanmade: 'fan', stalingrad: 'hos' };

  /* ---------- groups ---------- */
  var NATS = { us: 'United States', ge: 'Germany', uk: 'Commonwealth', fr: 'French (FFI)', ru: 'Soviet Union' };
  var SRC = { us: ['hon-bro-us', 'hon-v1-us'], ge: ['hon-bro-ge', 'hon-hos-gs', 'hon-v1-ge'], uk: ['hon-bro-uk', 'hon-v1-uk'], fr: ['hon-v1-fr'], ru: ['hon-hos-ru'] };
  var TYPE_NAME = { platoon: 'Platoon', command: 'Command tile', hero: 'Hero', landing: 'Landing', aircraft: 'Aircraft', support: 'Support tile', special: 'Other' };
  var CAT_NAME = { support: 'Support', gear: 'Gear', trait: 'Trait', order: 'Order', customization: 'Customization' };
  var BOXN = { bro: 'Big Red One', omaha: 'Bloody Omaha', caen: 'Battle for Caen', ws: 'War Stories', hos: 'Heroes of Stalingrad' };

  function builderItems() {
    var out = [];
    Object.keys(SRC).forEach(function (n) {
      SRC[n].forEach(function (key) {
        var d = window.HTS_DATA && window.HTS_DATA[key];
        if (!d) return;
        var v1 = key.indexOf('hon-v1-') === 0, hos = key.indexOf('hon-hos-') === 0;
        var pre = v1 ? 'v1:' : (hos && SRC[n].length > 1 ? 'gs:' : '');
        var ed = v1 ? 'First edition' : hos ? 'Stalingrad' : 'V2', words = v1 ? ' first edition v1' : hos ? ' stalingrad eastern front' : '';
        d.tiles.forEach(function (t) {
          var name = t.name + (t.sub ? ' ' + t.sub : '');
          out.push({ t: t.name, sub: t.sub || '', href: 'builder.html?n=' + n + '&q=' + q(name), img: t.img,
            b: ['Tile', NATS[n], ed, t.cost + ' pts', TYPE_NAME[t.type] || ''].filter(Boolean),
            x: [unitText(t.units), t.note].filter(Boolean).join('. '), hay: norm(name + ' tile ' + unitText(t.units) + ' ' + (TYPE_NAME[t.type] || '') + ' ' + NATS[n] + ' ' + (t.set || '') + words + ' ' + (t.note || '')), head: norm(name) });
        });
        d.options.forEach(function (o) {
          out.push({ t: o.name, sub: '', href: 'builder.html?n=' + n + '&o=' + q(pre + o.id), img: o.img,
            b: ['Option', NATS[n], ed, CAT_NAME[o.cat] || o.cat, (o.cost == null ? 'SP' : o.cost) + ' pts'].filter(Boolean),
            x: [unitText(o.units), o.note].filter(Boolean).join('. '), hay: norm(o.name + ' option ' + unitText(o.units) + ' ' + (CAT_NAME[o.cat] || '') + ' ' + NATS[n] + ' ' + (o.set || '') + words + ' ' + (o.note || '')), head: norm(o.name) });
        });
      });
    });
    return out;
  }

  function scenarioItems() {
    var out = [];
    Object.keys(window.HTS_SCEN || {}).forEach(function (k) {
      var b = k.replace('hon-', '');
      window.HTS_SCEN[k].entries.forEach(function (e) {
        out.push({ t: e.title, href: 'scenarios.html?b=' + b + '&q=' + q(e.title) + '&e=' + e.id,
          b: [BOXN[b] || b, e.type, 'p.' + String(e.pages).replace(' to ', '-')], s: e.summary, x: e.summary + ' ' + e.facts.map(function (f) { return f[1]; }).join(' '),
          hay: norm(e.title + ' ' + e.type + ' ' + e.date + ' ' + e.summary + ' ' + e.facts.map(function (f) { return f[0] + ' ' + f[1]; }).join(' ')), head: norm(e.title) });
      });
    });
    libIndex().forEach(function (x) {
      var b = SCEN_LIB_GROUPS[x.dc.group];
      if (!b) return;
      var title = x.dc.title.replace(/^Contest scenario \d+: /, '');
      out.push(docItem(x, 'scenarios.html?b=' + b + '&q=' + q(title) + '&e=' + x.dc.id, b === 'fan' ? 'Fan made' : b === 'hos' ? 'Stalingrad' : 'First edition'));
    });
    return out;
  }

  function rulesItems() {
    var out = [];
    ['bro', 'omaha', 'caen'].forEach(function (b) {
      var d = window.HTS_RULES && window.HTS_RULES['hon-' + b];
      if (!d) return;
      var secs = {};
      d.sections.forEach(function (s) { secs[s.id] = s; });
      d.chunks.forEach(function (c) {
        var s = secs[c.sec], title = (s ? s.title : 'Rules') + (c.sub ? ', ' + c.sub : '');
        var tab = c.table ? ' ' + c.table.head.join(' ') + ' ' + c.table.rows.map(function (r) { return r.join(' '); }).join(' ') : '';
        out.push({ t: title, href: 'rules.html?b=' + b + '&s=' + q(c.sec) + '&k=' + c.id, live: true,
          b: [BOXN[b], 'p.' + c.page, c.term ? 'Keyword' : ''].filter(Boolean), x: c.text + tab,
          hay: norm((s ? s.id + ' ' + s.title : '') + ' ' + (c.sub || '') + ' ' + c.text + tab), head: norm(title + ' ' + (c.term || '')) });
      });
    });
    return out;
  }

  function documentItems() {
    var out = [];
    libIndex().forEach(function (x) { if (!SCEN_LIB_GROUPS[x.dc.group]) out.push(docItem(x, 'guides.html?d=' + x.dc.id)); });
    var G = window.HTS_GUIDES;
    if (G) G.guides.forEach(function (g) {
      var text = g.blocks.map(function (b) { return [b.t || '', (b.items || []).join(' '), (b.head || []).join(' '), (b.rows || []).map(function (r) { return r.join(' '); }).join(' ')].join(' '); }).join(' ');
      out.push({ t: g.title, href: 'guides.html?g=' + g.id, b: ['Guide', g.tag], s: g.summary, x: text, hay: norm(g.title + ' ' + g.tag + ' ' + g.summary + ' ' + text), head: norm(g.title) });
    });
    return out;
  }

  var HERO_N = { 'hon-bro-us': 'us', 'hon-bro-ge': 'ge', 'hon-bro-uk': 'uk', 'hon-hos-ru': 'ru', 'hon-hos-gs': 'gs' };
  var HERO_NAME = { us: 'United States', ge: 'Germany', uk: 'Commonwealth', ru: 'Soviet Union', gs: 'Germany (Stalingrad)' };
  function heroItems() {
    var out = [];
    Object.keys(HERO_N).forEach(function (key) {
      var d = window.HTS_DATA && window.HTS_DATA[key], n = HERO_N[key];
      if (!d) return;
      d.tiles.forEach(function (t) {
        if (t.type !== 'hero') return;
        var units = (t.units || []).map(function (u) { return u[0] + ' ' + u[2]; }).join(' ');
        out.push({ t: t.name, sub: t.sub || '', href: 'heroes.html?b=all&n=' + n + '&q=' + q(t.name) + (/^[a-z0-9_]+$/.test(t.id) ? '&e=' + t.id : ''), img: t.img,
          b: ['Hero tile', HERO_NAME[n], t.cost + ' pts'], x: [unitText(t.units), t.note].filter(Boolean).join('. '), hay: norm(t.name + ' ' + (t.sub || '') + ' ' + units + ' ' + (t.note || '') + ' hero'), head: norm(t.name) });
      });
    });
    var H = window.HTS_HEROES;
    if (H) H.equipment.forEach(function (e) {
      out.push({ t: e.name, href: 'heroes.html?b=all&n=us&q=' + q(e.name), img: e.faces && e.faces[0] ? e.faces[0].img : '', b: ['Equipment', BOXN[e.box] || e.box], s: e.text, x: e.text, hay: norm(e.name + ' ' + e.text + ' equipment'), head: norm(e.name) });
    });
    return out;
  }

  function tokenItems() {
    var out = [];
    ['bro', 'omaha', 'caen', 'hos'].forEach(function (b) {
      var d = window.HTS_TOKENS && window.HTS_TOKENS['hon-' + b];
      if (!d) return;
      d.entries.forEach(function (e) {
        var text = (e.text || []).join(' ');
        out.push({ t: e.name, href: 'tokens.html?b=' + b + '&q=' + q(e.name) + (/^[a-z0-9]+$/.test(e.id) ? '&e=' + e.id : ''), b: [BOXN[b], e.group].filter(Boolean), s: e.summary, x: e.summary + ' ' + text,
          hay: norm(e.name + ' ' + e.group + ' ' + e.summary + ' ' + text), head: norm(e.name) });
      });
    });
    return out;
  }

  function iconItems() {
    var out = [];
    ['bro', 'omaha', 'caen', 'hos'].forEach(function (b) {
      var d = window.HTS_ICONS && window.HTS_ICONS['hon-' + b];
      if (!d) return;
      d.entries.forEach(function (e) {
        out.push({ t: e.name, href: 'icons.html?b=' + b + '&q=' + q(e.name), img: e.icons && e.icons[0] ? e.icons[0].img : '', icon: true, b: [BOXN[b], e.group, e.page ? 'p.' + e.page : ''].filter(Boolean), x: e.text,
          hay: norm(e.name + ' ' + e.group + ' ' + e.text), head: norm(e.name) });
      });
    });
    return out;
  }

  function cardItems() {
    var d = window.HTS_CARDS && window.HTS_CARDS['hon-bro'], out = [];
    if (d) d.entries.forEach(function (e) {
      out.push({ t: e.name, href: 'cards.html?s=' + e.nation + '&q=' + q(e.name), img: e.thumb, b: [e.nation === 'us' ? 'US deck' : 'German deck', e.phase, e.copies + (e.copies === 1 ? ' copy' : ' copies')].filter(Boolean),
        s: e.when, x: e.when + ' ' + e.text, hay: norm(e.name + ' ' + e.phase + ' ' + e.when + ' ' + e.text + ' ' + (e.nation === 'us' ? 'american us' : 'german')), head: norm(e.name) });
    });
    return out;
  }

  function productItems() {
    var D = window.HTS_EXPANSIONS, out = [];
    if (D) D.lines.forEach(function (l) {
      l.items.forEach(function (i) {
        out.push({ t: i.name, href: 'expansions.html?l=' + l.id + '&q=' + q(i.name) + (/^[a-z0-9-]+$/.test(i.id) ? '&e=' + i.id : ''), b: [l.name, i.cat].filter(Boolean), s: i.text || '', x: i.text || '',
          hay: norm(i.name + ' ' + (i.cat || '') + ' ' + l.name + ' ' + (i.text || '')), head: norm(i.name) });
      });
    });
    return out;
  }

  function mapItems() {
    var M = window.HTS_MAPS, out = [];
    if (M) M.boxes.forEach(function (b) {
      b.pieces.forEach(function (p) {
        out.push({ t: p.name, href: 'maps.html?b=' + b.id + '&q=' + q(p.name), img: 'img/hon/maps/' + b.id + '/' + (p.t || p.a), b: [b.name, p.group, [p.ma, p.mb].filter(Boolean).join(' and '), p.w + ' by ' + p.h].filter(Boolean),
          x: '', hay: norm(p.name + ' ' + p.group + ' ' + (p.ma || '') + ' ' + (p.mb || '') + ' ' + b.name + ' ' + (p.kind || '')), head: norm(p.name + ' ' + (p.ma || '') + ' ' + (p.mb || '')) });
      });
    });
    return out;
  }

  function historyItems() {
    var out = [];
    ['bro', 'caen', 'hos'].forEach(function (b) {
      var d = window.HTS_HISTORY && window.HTS_HISTORY['hon-' + b];
      if (!d) return;
      d.entries.forEach(function (e) {
        var facts = (e.facts || []).join(' ');
        out.push({ t: e.name, href: 'history.html?b=' + b + '&q=' + q(e.name) + (/^[a-z0-9]+$/.test(e.id) ? '&e=' + e.id : ''), b: [BOXN[b], e.cat].filter(Boolean), s: e.text, x: e.text + ' ' + facts,
          hay: norm(e.name + ' ' + e.cat + ' ' + e.text + ' ' + facts), head: norm(e.name) });
      });
    });
    return out;
  }

  var LIBF = ['hon-library'];
  var GROUPS = [
    { id: 'builder', title: 'Army builder tiles and options', files: ['hon-bro-us', 'hon-bro-ge', 'hon-bro-uk', 'hon-hos-ru', 'hon-hos-gs', 'hon-v1-us', 'hon-v1-ge', 'hon-v1-uk', 'hon-v1-fr'], build: builderItems },
    { id: 'scenarios', title: 'Scenarios', files: ['hon-bro-scenarios', 'hon-omaha-scenarios', 'hon-caen-scenarios', 'hon-ws-scenarios'].concat(LIBF), build: scenarioItems },
    { id: 'rules', title: 'Rules', files: ['hon-bro-rules', 'hon-omaha-rules', 'hon-caen-rules'], build: rulesItems },
    { id: 'documents', title: 'Documents', files: ['hon-guides'].concat(LIBF), build: documentItems },
    { id: 'heroes', title: 'Heroes and equipment', files: ['hon-bro-us', 'hon-bro-ge', 'hon-bro-uk', 'hon-hos-ru', 'hon-hos-gs', 'hon-bro-heroes'], build: heroItems },
    { id: 'tokens', title: 'Tokens', files: ['hon-bro-tokens', 'hon-omaha-tokens', 'hon-caen-tokens', 'hon-hos-tokens'], build: tokenItems },
    { id: 'icons', title: 'Icons', files: ['hon-icons'], build: iconItems },
    { id: 'cards', title: 'Cards', files: ['hon-bro-cards'], build: cardItems },
    { id: 'products', title: 'Archive products', files: ['expansions'], build: productItems },
    { id: 'maps', title: 'Maps', files: ['maps'], build: mapItems },
    { id: 'history', title: 'History', files: ['hon-bro-history', 'hon-caen-history', 'hon-hos-history'], build: historyItems }
  ];
  GROUPS.forEach(function (g) { g.state = 'idle'; g.items = null; });

  function ready(g) {
    if (g.state === 'ready') return Promise.resolve();
    if (g.pending) return g.pending;
    g.state = 'loading';
    g.pending = load(g.files).then(function () { g.items = g.build(); g.state = 'ready'; }, function () { g.state = 'failed'; g.pending = null; });
    return g.pending;
  }

  /* ---------- searching ---------- */
  function search(g, toks) {
    var res = [];
    g.items.forEach(function (it, i) {
      var score = 0;
      if (it.kind === 'doc') {
        var m = docMatch(it.ix, toks);
        if (!m) return;
        score = m.score; res.push({ it: it, score: score, i: i, pages: m.pages });
        return;
      }
      if (!allHit(it.hay, toks)) return;
      toks.forEach(function (t) { score += Math.min(countOf(it.hay, t), 10) + (hit(it.head, t) ? 20 : 0); });
      if (it.head === norm(S.q)) score += 40;
      res.push({ it: it, score: score, i: i });
    });
    res.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
    return res;
  }

  function row(r, toks) {
    var it = r.it, h = '<li class="sres">';
    if (it.img) h += '<img class="sthumb' + (it.icon ? ' sicon' : '') + '" src="' + esc(it.img) + '" alt="" loading="lazy">';
    h += '<div class="sbody"><a class="sname" href="' + esc(it.href + (it.live ? '&q=' + q(S.q) : '')) + '">' + mark(it.t, toks) + '</a>';
    if (it.sub) h += ' <span class="ssub">' + mark(it.sub, toks) + '</span>';
    h += '<span class="hbadges sbadges">' + it.b.map(function (x) { return '<span class="hb">' + esc(x) + '</span>'; }).join('') + '</span>';
    if (it.kind === 'doc') {
      var dc = it.d, pages = r.pages || [], tx = pages.length ? dc.text[pages[0] - 1] : '';
      h += '<span class="hsnip">' + (tx ? snippet(tx, toks) : mark(dc.summary.slice(0, 200) + (dc.summary.length > 200 ? ' ...' : ''), toks)) + '</span>';
      if (pages.length) h += '<span class="chips spages">' + pages.slice(0, 4).map(function (p) { return '<a class="chip" href="guides.html?d=' + esc(dc.id) + '#p' + p + '">p.' + p + '</a>'; }).join('') + (pages.length > 4 ? '<span class="hsrc">and ' + (pages.length - 4) + ' more pages</span>' : '') + '</span>';
    } else if (it.x) h += '<span class="hsnip">' + snippet(it.x, toks) + '</span>';
    return h + '</div></li>';
  }

  function section(g, toks, res) {
    var open = !!S.all[g.id], list = open ? res : res.slice(0, CAP), h = '<section class="sgroup" id="g-' + g.id + '" aria-labelledby="gh-' + g.id + '"><h2 class="hh" id="gh-' + g.id + '">' + esc(g.title) + ' <span class="hcount">' + res.length + '</span></h2>';
    h += '<ul class="slist2">' + list.map(function (r) { return row(r, toks); }).join('') + '</ul>';
    if (res.length > CAP) h += '<p class="smore"><button type="button" class="ghost" data-all="' + g.id + '" aria-expanded="' + open + '">' + (open ? 'Show the first ' + CAP : 'Show all ' + res.length) + '</button></p>';
    return h + '</section>';
  }

  function run() {
    var toks = tokens(S.q);
    url();
    if (!toks.length) { hint(); return; }
    var pend = GROUPS.filter(function (g) { if (g.state === 'failed') g.state = 'idle'; return g.state !== 'ready'; });
    pend.forEach(function (g) { ready(g).then(schedule); });
    paint(toks);
  }
  var tm;
  function schedule() { clearTimeout(tm); tm = setTimeout(function () { var toks = tokens(S.q); if (toks.length) paint(toks); }, 30); }

  function paint(toks) {
    var html = '', chips = '', total = 0, groups = 0, waiting = 0, failed = 0;
    GROUPS.forEach(function (g) {
      if (g.state === 'failed') { failed++; html += '<section class="sgroup" id="g-' + g.id + '"><h2 class="hh">' + esc(g.title) + '</h2><p class="empty2">Could not load the data for this group. Check your connection and search again.</p></section>'; return; }
      if (g.state !== 'ready') { waiting++; html += '<section class="sgroup" id="g-' + g.id + '"><h2 class="hh">' + esc(g.title) + '</h2><p class="hsrc" role="status">Loading...</p></section>'; return; }
      var res = search(g, toks);
      if (!res.length) return;
      total += res.length; groups++;
      chips += '<a class="chip" href="#g-' + g.id + '">' + esc(g.title) + ' <span class="count">' + res.length + '</span></a>';
      html += section(g, toks, res);
    });
    $('jump').hidden = !chips;
    $('chips').innerHTML = chips;
    if (!html) html = '<p class="empty2">Nothing matches. Try fewer or simpler words. Every word has to appear in a result.</p>';
    else if (!total && !waiting) html = '<p class="empty2">Nothing matches. Try fewer or simpler words. Every word has to appear in a result.</p>' + html;
    $('out').innerHTML = html;
    $('stat').textContent = (total ? total + ' result' + (total === 1 ? '' : 's') + ' in ' + groups + ' group' + (groups === 1 ? '' : 's') + '.' : (waiting ? '' : '0 results.')) + (waiting ? ' Loading ' + waiting + ' more group' + (waiting === 1 ? '' : 's') + '...' : '');
  }

  function hint() {
    $('jump').hidden = true; $('chips').innerHTML = '';
    var ex = ['sticky bomb', 'Carentan', 'suppressed', 'Panzerfaust', 'landing craft', 'Wittmann'];
    $('out').innerHTML = '<div class="shint"><p class="htext">Type a word or two. The search covers army builder tiles and options (all countries, first edition and Stalingrad too), scenarios, rules, documents including the text on their pages, heroes and equipment, tokens, icons, cards, archive products, maps and history.</p>' +
      '<p class="htext">Try one of these:</p><div class="chips">' + ex.map(function (x) { return '<button type="button" class="chip" data-ex="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div></div>';
    $('stat').textContent = '';
  }

  function url() {
    try { history.replaceState(null, '', location.pathname + (S.q ? '?q=' + encodeURIComponent(S.q) : '')); } catch (e) { /* ignore */ }
  }

  function bind() {
    var timer;
    $('q').oninput = function () { S.q = this.value; S.all = {}; clearTimeout(timer); timer = setTimeout(run, 150); };
    document.addEventListener('click', function (ev) {
      var el;
      if ((el = ev.target.closest('[data-all]'))) { S.all[el.dataset.all] = !S.all[el.dataset.all]; paint(tokens(S.q)); var sec = $('g-' + el.dataset.all); if (sec && !S.all[el.dataset.all] && sec.scrollIntoView) sec.scrollIntoView({ block: 'start' }); return; }
      if ((el = ev.target.closest('[data-ex]'))) { S.q = el.dataset.ex; $('q').value = S.q; run(); return; }
    });
    $('btnTheme').onclick = function () {
      S.theme = S.theme === 'dark' ? 'light' : 'dark';
      try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = S.theme; localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
      theme();
    };
  }
  function theme() { document.documentElement.setAttribute('data-theme', S.theme); $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark'; }

  function init() {
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) S.theme = j.theme; } catch (e) { /* ignore */ }
    theme();
    var p = new URLSearchParams(location.search);
    if (p.get('q')) S.q = p.get('q').slice(0, 200);
    $('q').value = S.q;
    bind();
    run();
  }
  init();
  window.HTS_SEARCH = { state: S, groups: GROUPS, tokens: tokens };
})();
