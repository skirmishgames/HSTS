/* Fan made scenario layout. A library document with a `scn` object is shown as a scenario page
   (header, facts, sections, maps, forces) instead of page pictures. Used by guides.js and scenarios.js.
   scn: { by, sides, pts, turns, tiles: [codes], tilesNote, req: [printed requirements],
          maps: [{ img, w, h, cap, p }],
          bg, setup, forces: [{ side, pts, b, img: { img, w, h } }], deploy, rules, win, notes: [blocks] }
   Blocks are { k: 'p' | 'h3' | 'ul' | 'ol', t | items }. */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/__(.+?)__/g, '<em>$1</em>'); }
  var SEC = [['bg', 'Background', 'background'], ['setup', 'Map and set-up', 'map-and-set-up'], ['forces', 'Forces', 'forces'], ['deploy', 'Deployment', 'deployment'], ['rules', 'Special rules', 'special-rules'], ['win', 'Objectives and victory', 'objectives-and-victory'], ['notes', 'Notes', 'notes']];

  function blocks(bl) {
    return (bl || []).map(function (b) {
      if (b.k === 'h3') return '<h3>' + rich(b.t) + '</h3>';
      if (b.k === 'ul') return '<ul>' + b.items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ul>';
      if (b.k === 'ol') return '<ol>' + b.items.map(function (x) { return '<li>' + rich(x) + '</li>'; }).join('') + '</ol>';
      return '<p>' + rich(b.t) + '</p>';
    }).join('');
  }
  function fig(dc, m, cls) {
    var src = 'img/hon/lib/' + dc.id + '/' + m.img;
    return '<figure class="sfig ' + (cls || '') + '"><button type="button" class="sfigb" data-zoom="' + esc(src) + '" data-cap="' + esc(m.cap || dc.title) + '" aria-label="Open the picture full size"><img src="' + esc(src) + '" alt="' + esc(m.cap || dc.title) + '" width="' + m.w + '" height="' + m.h + '" loading="lazy"></button>' + (m.cap ? '<figcaption>' + esc(m.cap) + '</figcaption>' : '') + '</figure>';
  }
  function has(s, k) {
    if (k === 'setup') return !!(s.setup && s.setup.length) || !!(s.maps && s.maps.length) || !!(s.tiles && s.tiles.length) || !!s.tilesNote;
    if (k === 'forces') return !!(s.forces && s.forces.length);
    return !!(s[k] && s[k].length);
  }
  function tilesHtml(s) {
    var t = (s.tiles || []).map(function (c) { return '<span class="scn-tile">' + esc(c) + '</span>'; }).join(' ');
    return t + (s.tilesNote ? (t ? ' ' : '') + esc(s.tilesNote) : '');
  }
  function needsText(dc) {
    var n = window.HTS_NEEDS && window.HTS_NEEDS['lib:' + dc.id], O = window.HTS_OWN;
    if (!n || !n.length || !O) return '';
    function nm(c) { return O.name(c).replace(/^Heroes of (Normandie|Stalingrad): /, ''); }
    return n.map(function (c) { return Array.isArray(c) ? c.map(nm).join(' or ') : nm(c); }).join(', ');
  }
  function facts(dc) {
    var s = dc.scn, r = [];
    if (s.sides) r.push(['Sides', s.sides]);
    if (s.pts) r.push(['Army points', s.pts]);
    if (s.turns) r.push(['Length', s.turns]);
    var t = tilesHtml(s);
    if (t) r.push(['Map tiles', t, 1]);
    if (s.req && s.req.length) r.push(['Printed requirements', s.req.join(', ')]);
    var nt = needsText(dc);
    if (nt) r.push(['Products needed', nt]);
    if (s.by) r.push(['Author', s.by]);
    return '<dl class="sfacts">' + r.map(function (f) { return '<dt>' + esc(f[0]) + '</dt><dd>' + (f[2] ? f[1] : esc(f[1])) + '</dd>'; }).join('') + '</dl>';
  }
  function sections(dc) {
    var s = dc.scn, h = '';
    SEC.forEach(function (x) {
      var k = x[0];
      if (!has(s, k)) return;
      h += '<section class="scn-sec" id="' + x[2] + '"><h2>' + x[1] + '</h2>';
      if (k === 'setup') {
        (s.maps || []).forEach(function (m) { h += fig(dc, m, 'scn-map'); });
        if (s.tiles && s.tiles.length || s.tilesNote) h += '<p class="scn-tiles"><strong>Map tiles:</strong> ' + tilesHtml(s) + '</p>';
        h += blocks(s.setup);
      } else if (k === 'forces') {
        s.forces.forEach(function (f) {
          h += '<div class="scn-force"><h3>' + esc(f.side) + (f.pts ? ' <span class="scn-fp">' + esc(f.pts) + '</span>' : '') + '</h3>' + (f.img ? fig(dc, f.img, 'scn-fimg') : '') + blocks(f.b) + '</div>';
        });
      } else h += blocks(s[k]);
      h += '</section>';
    });
    return h;
  }
  function originals(dc) {
    var h = '';
    for (var p = 1; p <= dc.n; p++) {
      var src = 'img/hon/lib/' + dc.id + '/p' + (p < 10 ? '0' + p : p) + '.webp', sz = dc.sizes[p - 1];
      h += '<section class="dpage" id="p' + p + '"><h3 class="dph">Page ' + p + '</h3><div class="sfig"><button type="button" class="sfigb" data-zoom="' + src + '" data-cap="' + esc(dc.title + ', page ' + p) + '" aria-label="Open page ' + p + ' full size"><img src="' + src + '" alt="' + esc(dc.title + ', original page ' + p) + '" width="' + sz[0] + '" height="' + sz[1] + '" loading="lazy"></button></div></section>';
    }
    return '<details class="scn-orig" id="original-pages"><summary>See the original pages (' + dc.n + (dc.n === 1 ? ' page' : ' pages') + ')</summary><p class="hsrc">The fan author’s pages as published, kept so nothing is lost. Tap a page to open it full size.</p>' + h + '</details>';
  }
  function toc(dc) {
    var s = dc.scn, c = SEC.filter(function (x) { return has(s, x[0]); }).map(function (x) { return '<a class="chip" href="#' + x[2] + '">' + x[1] + '</a>'; });
    c.push('<a class="chip" href="#original-pages">Original pages</a>');
    return '<div class="stoc chips" role="navigation" aria-label="On this page">' + c.join('') + '</div>';
  }
  function plain(bl) { return (bl || []).map(function (b) { return (b.t || '') + ' ' + (b.items || []).join(' '); }).join(' '); }
  function text(dc) {
    var s = dc.scn; if (!s) return '';
    var t = [s.sides, s.pts, s.turns, (s.tiles || []).join(' '), s.tilesNote, (s.req || []).join(' '), s.by];
    ['bg', 'setup', 'deploy', 'rules', 'win', 'notes'].forEach(function (k) { t.push(plain(s[k])); });
    (s.forces || []).forEach(function (f) { t.push(f.side + ' ' + (f.pts || '') + ' ' + plain(f.b)); });
    (s.maps || []).forEach(function (m) { t.push(m.cap); });
    return t.filter(Boolean).join(' ');
  }
  /* the biggest points figure in scn.pts, or null */
  function maxPts(dc) {
    var s = dc.scn, best = null, m, rx = /(\d{2,4})/g;
    if (!s || !s.pts) return null;
    while ((m = rx.exec(s.pts))) { var n = Number(m[1]); if (n >= 40 && n <= 1500 && (best == null || n > best)) best = n; }
    return best;
  }
  window.HTS_FANSCN = {
    esc: esc,
    /* everything from the facts down to the original pages, for a doc that has scn */
    body: function (dc) {
      return facts(dc) + toc(dc) + '<div class="sbody scn">' + sections(dc) + '</div>' + originals(dc);
    },
    text: text, maxPts: maxPts, tiles: function (dc) { return dc.scn && dc.scn.tiles || []; }
  };
})();
