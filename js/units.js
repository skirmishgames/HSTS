(function () {
  'use strict';

  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }];
  var TTYPES = [['all', 'All'], ['platoon', 'Platoons'], ['command', 'Command'], ['hero', 'Heroes'], ['landing', 'Landing'], ['aircraft', 'Aircraft'], ['support', 'Support tile'], ['special', 'Other']];
  var NATIONS = [{ id: 'us', name: 'United States' }, { id: 'ge', name: 'Germany' }, { id: 'uk', name: 'Commonwealth' }];
  var VIEWS = [['tile', 'By tile'], ['unit', 'Unit list']];
  var KINDS = [['all', 'All'], ['officer', 'Officers'], ['character', 'Characters'], ['infantry', 'Infantry'], ['weapon', 'Weapons'], ['vehicle', 'Vehicles'], ['marker', 'Markers'], ['aircraft', 'Aircraft']];
  var KIND_ORDER = ['officer', 'character', 'infantry', 'weapon', 'vehicle', 'marker', 'aircraft'];
  var KIND_NAME = { officer: 'Officer', character: 'Character', infantry: 'Infantry', weapon: 'Weapon', vehicle: 'Vehicle', marker: 'Marker', aircraft: 'Aircraft' };
  var CAT_NAME = { support: 'Support unit', gear: 'Gear', trait: 'Character trait', order: 'Order', customization: 'Customization' };
  var TYPE_NAME = { platoon: 'Platoon', command: 'Command tile', hero: 'Hero', landing: 'Landing', aircraft: 'Aircraft', support: 'Support tile', special: 'Other' };
  var TYPE_ORDER = { command: 0, platoon: 1, hero: 2, landing: 3, aircraft: 4, support: 5, special: 6 };

  var S = { b: 'bro', n: 'us', q: '', view: 'tile', kind: 'all', tt: 'all', theme: 'light' };
  var cache = {};

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function match(hay, q) {
    var toks = norm(q).split(' ').filter(Boolean);
    if (!toks.length) return true;
    var padded = ' ' + hay + ' ';
    return toks.every(function (t) { return t.length <= 2 ? padded.indexOf(' ' + t + ' ') >= 0 : hay.indexOf(t) >= 0; });
  }
  function unitLine(units) { return (units || []).map(function (u) { return u[0] + (u[1] > 1 ? ' x' + u[1] : ''); }).join(' '); }
  function chips(units) {
    if (!units || !units.length) return '';
    return '<span class="uchips">' + units.map(function (u) {
      return '<span class="u k-' + esc(u[2]) + '" title="' + esc(KIND_NAME[u[2]] || '') + '">' + esc(u[0]) + (u[1] > 1 ? ' <i>x' + u[1] + '</i>' : '') + '</span>';
    }).join('') + '</span>';
  }
  // counter art: tile-specific first, then the nation default
  function tokens(units, tile, nat, small) {
    if (!units || !units.length) return '';
    return '<span class="' + (small ? 'ctrs small' : 'ctrs') + '">' + units.map(function (u) {
      var src = (tile && tile.uimg && tile.uimg[u[0]]) || (nat && nat.uimg && nat.uimg[u[0]]);
      var qty = u[1] > 1 ? ' <i>x' + u[1] + '</i>' : '';
      if (!src) return '<span class="u k-' + esc(u[2]) + '" title="' + esc(KIND_NAME[u[2]] || '') + '">' + esc(u[0]) + qty + '</span>';
      return '<figure class="ctr k-' + esc(u[2]) + '"><button type="button" data-zoom="' + src + '" data-cap="' + esc(u[0] + (u[1] > 1 ? ' x' + u[1] : '')) + '" aria-label="Zoom ' + esc(u[0]) + '"><img src="' + src + '" alt="" loading="lazy"></button><figcaption>' + esc(u[0]) + qty + '</figcaption></figure>';
    }).join('') + '</span>';
  }
  function pips(n) { var s = ''; for (var i = 0; i < n; i++) s += '■'; return s; }
  function costLabel(c) { return c == null ? 'SP' : String(c); }

  /* ---------- index ---------- */
  function index(n) {
    var ck = S.b + ':' + n;
    if (cache[ck]) return cache[ck];
    var d = window.HTS_DATA['hon-' + S.b + '-' + n];
    var O = {}, owned = {};
    d.options.forEach(function (o) { O[o.id] = o; });
    var tiles = d.tiles.slice().sort(function (a, b) {
      return (TYPE_ORDER[a.type] - TYPE_ORDER[b.type]) || (a.cost - b.cost) || a.name.localeCompare(b.name);
    }).map(function (t) {
      var own = (t.own || []).map(function (id) { owned[id] = t.id; return O[id]; }).filter(Boolean);
      var hay = norm([t.name, t.sub, TYPE_NAME[t.type], unitLine(t.units)].concat(own.map(function (o) { return o.name + ' ' + CAT_NAME[o.cat] + ' ' + unitLine(o.units); })).join(' '));
      return { t: t, own: own, hay: hay };
    });
    var T = {};
    d.tiles.forEach(function (t) { T[t.id] = t; });
    var common = d.options.filter(function (o) { return !owned[o.id] && o.units; }).sort(function (a, b) {
      return (a.cat === b.cat ? 0 : (a.cat === 'support' ? -1 : 1)) || (a.cost || 0) - (b.cost || 0) || a.name.localeCompare(b.name);
    }).map(function (o) { return { o: o, hay: norm(o.name + ' common option ' + unitLine(o.units) + ' ' + (o.units || []).map(function (u) { return u[2]; }).join(' ')) }; });

    // unit list
    var U = {};
    function add(units, label, extra, tt) {
      (units || []).forEach(function (u) {
        var k = u[0];
        if (!U[k]) U[k] = { name: u[0], kind: u[2], from: [] };
        U[k].from.push({ label: label, q: extra, qty: u[1], tt: tt });
      });
    }
    d.tiles.forEach(function (t) { add(t.units, t.name + (t.sub && t.type !== 'special' ? ', ' + t.sub : '') + ' (tile)', t.name + ' ' + (t.sub && t.type !== 'special' ? t.sub : ''), t.type); });
    d.options.forEach(function (o) {
      if (!o.units) return;
      var tid = owned[o.id], tl = tid && T[tid];
      var label = o.name + (tl ? ' (on ' + (tl.sub && tl.type !== 'special' ? tl.sub : tl.name) + ')' : ' (common option)');
      add(o.units, label, tl ? tl.name + ' ' + (tl.sub || '') : o.name, tl ? tl.type : 'common');
    });
    var units = Object.keys(U).map(function (k) {
      var u = U[k];
      u.hay = norm(u.name + ' ' + u.kind + ' ' + u.from.map(function (f) { return f.label; }).join(' '));
      return u;
    }).sort(function (a, b) { return a.name.localeCompare(b.name); });

    cache[ck] = { d: d, tiles: tiles, common: common, units: units };
    return cache[ck];
  }

  /* ---------- rendering ---------- */
  function renderControls() {
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>';
    }).join('');
    $('subtitle').textContent = 'Unit index, Heroes of Normandie, ' + BOXES.filter(function (b) { return b.id === S.b; })[0].name;
    $('ttypes').innerHTML = TTYPES.map(function (k) {
      return '<button type="button" class="chip' + (S.tt === k[0] ? ' on' : '') + '" data-tt="' + k[0] + '">' + k[1] + '</button>';
    }).join('');
    $('nations').innerHTML = NATIONS.map(function (n) {
      return '<button type="button" data-nation="' + n.id + '" class="' + (S.n === n.id ? 'on' : '') + '" aria-pressed="' + (S.n === n.id) + '">' + n.name + '</button>';
    }).join('');
    $('views').innerHTML = VIEWS.map(function (v) {
      return '<button type="button" data-view="' + v[0] + '" class="' + (S.view === v[0] ? 'on' : '') + '" aria-pressed="' + (S.view === v[0]) + '">' + v[1] + '</button>';
    }).join('');
    $('kinds').innerHTML = KINDS.map(function (k) {
      return '<button type="button" class="chip' + (S.kind === k[0] ? ' on' : '') + '" data-kind="' + k[0] + '">' + k[1] + '</button>';
    }).join('');
    $('q').value = S.q;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function optionRow(o, tile, nat) {
    var right = costLabel(o.cost) + ' pts';
    var body = o.units ? tokens(o.units, tile, nat, true) : '<span class="cat">' + esc(CAT_NAME[o.cat] || o.cat) + ', adds no units</span>';
    return '<li><button type="button" class="th" data-zoom="' + o.img + '" data-cap="' + esc(o.name + ', ' + right) + '" aria-label="Zoom ' + esc(o.name) + '"><img src="' + o.img + '" alt="" loading="lazy" width="' + o.w + '" height="' + o.h + '"></button>' +
      '<div><div class="on">' + esc(o.name) + (o.units ? ' <span class="cat">' + esc(CAT_NAME[o.cat] || '') + '</span>' : '') + '</div>' + body + (o.note ? '<span class="note">' + esc(o.note) + '</span>' : '') + '</div>' +
      '<span class="opts">' + right + '</span></li>';
  }

  function hasKind(units, k) { return (units || []).some(function (u) { return u[2] === k; }); }

  function renderTiles(I) {
    var list = I.tiles.filter(function (x) {
      if (S.tt !== 'all' && x.t.type !== S.tt) return false;
      if (S.kind !== 'all' && !hasKind(x.t.units, S.kind) && !x.own.some(function (o) { return hasKind(o.units, S.kind); })) return false;
      return match(x.hay, S.q);
    });
    var com = S.tt !== 'all' ? [] : I.common.filter(function (x) {
      return (S.kind === 'all' || hasKind(x.o.units, S.kind)) && match(x.hay, S.q);
    });
    var html = '';
    if (list.length) {
      html += '<div class="ugrid">' + list.map(function (x) {
        var t = x.t;
        return '<article class="ucard" id="t-' + t.id + '"><button type="button" class="imgbtn" data-zoom="' + t.img + '" data-cap="' + esc(t.name + ', ' + t.cost + ' pts') + '" aria-label="Zoom ' + esc(t.name) + '"><img src="' + t.img + '" alt="' + esc(t.name) + ' tile" loading="lazy" width="' + t.w + '" height="' + t.h + '"></button>' +
          '<div class="ubody"><h3>' + esc(t.name) + (t.sub && t.type !== 'special' ? '<small>' + esc(t.sub) + '</small>' : '') + '</h3>' +
          '<p class="umeta">' + esc(TYPE_NAME[t.type]) + ', ' + t.cost + ' pts, ' + t.slots.length + ' slot' + (t.slots.length === 1 ? '' : 's') + (t.squares ? ', breaking point <span class="pips">' + pips(t.squares) + '</span>' : '') + '</p>' +
          (t.note ? '<p class="umeta note2">' + esc(t.note) + '</p>' : '') + '<h4>Units on the tile</h4>' + tokens(t.units, t, I.d) +
          (x.own.length ? '<h4>Options that come with this tile</h4><ul class="oplist">' + x.own.map(function (o) { return optionRow(o, t, I.d); }).join('') + '</ul>' : '') +
          '</div></article>';
      }).join('') + '</div>';
    }
    if (com.length) {
      html += '<section class="usec"><h2>Common and shared options</h2><div class="ugrid">' + com.map(function (x) {
        return '<article class="ucard"><div class="ubody"><ul class="oplist">' + optionRow(x.o, null, I.d) + '</ul></div></article>';
      }).join('') + '</div></section>';
    }
    if (!html) html = '<p class="empty2">Nothing matches. Try fewer words, for example "rifle" or "bazooka".</p>';
    $('out').innerHTML = html;
    $('stat').textContent = list.length + ' tile' + (list.length === 1 ? '' : 's') + (com.length ? ', ' + com.length + ' common option' + (com.length === 1 ? '' : 's') : '') + ' shown.';
  }

  function renderUnits(I) {
    var list = I.units.filter(function (u) {
      if (S.kind !== 'all' && u.kind !== S.kind) return false;
      if (S.tt !== 'all' && !u.from.some(function (f) { return f.tt === S.tt; })) return false;
      return match(u.hay, S.q);
    });
    var html = KIND_ORDER.map(function (k) {
      var items = list.filter(function (u) { return u.kind === k; });
      if (!items.length) return '';
      return '<section class="ulist-group"><h3>' + esc(KIND_NAME[k]) + ' (' + items.length + ')</h3>' + items.map(function (u) {
        return '<div class="urow"><div class="un">' + esc(u.name) + '</div><div class="from">' + u.from.map(function (f) {
          return '<button type="button" class="plink" data-q="' + esc(f.q) + '">' + esc(f.label) + (f.qty > 1 ? ' x' + f.qty : '') + '</button>';
        }).join('') + '</div></div>';
      }).join('') + '</section>';
    }).join('');
    if (!html) html = '<p class="empty2">No units match.</p>';
    $('out').innerHTML = html;
    $('stat').textContent = list.length + ' unit' + (list.length === 1 ? '' : 's') + ' shown. Tap a source to see its tile.';
  }

  function render() {
    renderControls();
    var I = index(S.n);
    if (S.view === 'unit') renderUnits(I); else renderTiles(I);
    try {
      var p = new URLSearchParams();
      p.set('b', S.b); p.set('n', S.n); if (S.q) p.set('q', S.q); if (S.view !== 'tile') p.set('v', S.view);
      if (S.tt !== 'all') p.set('tt', S.tt); if (S.kind !== 'all') p.set('k', S.kind);
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }
  function renderResults() { var I = index(S.n); if (S.view === 'unit') renderUnits(I); else renderTiles(I); }

  function saveTheme() {
    try {
      var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = S.theme;
      localStorage.setItem(LSK, JSON.stringify(j));
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; render(); return; }
      if ((el = t.closest('[data-tt]'))) { S.tt = el.dataset.tt; render(); return; }
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; render(); return; }
      if ((el = t.closest('[data-tt]'))) { S.tt = el.dataset.tt; render(); return; }
      if ((el = t.closest('[data-nation]'))) { S.n = el.dataset.nation; render(); return; }
      if ((el = t.closest('[data-view]'))) { S.view = el.dataset.view; render(); return; }
      if ((el = t.closest('[data-kind]'))) { S.kind = el.dataset.kind; render(); return; }
      if ((el = t.closest('[data-q]'))) { S.q = el.dataset.q; S.view = 'tile'; render(); window.scrollTo(0, 0); return; }
      if ((el = t.closest('[data-zoom]'))) {
        $('zoomImg').src = el.dataset.zoom; $('zoomImg').alt = el.dataset.cap || '';
        $('zoomCap').textContent = el.dataset.cap || ''; $('zoom').hidden = false; return;
      }
      if (t.closest('#zoom')) $('zoom').hidden = true;
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') $('zoom').hidden = true; });
    var timer;
    $('q').oninput = function () {
      S.q = this.value;
      clearTimeout(timer);
      timer = setTimeout(function () { renderResults(); render_url(); }, 120);
    };
    $('btnReset').onclick = function () { S.tt = 'all'; S.kind = 'all'; S.q = ''; render(); };
    $('btnTheme').onclick = function () { S.theme = S.theme === 'dark' ? 'light' : 'dark'; saveTheme(); renderControls(); };
  }
  function render_url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b); p.set('n', S.n); if (S.q) p.set('q', S.q); if (S.view !== 'tile') p.set('v', S.view);
      if (S.tt !== 'all') p.set('tt', S.tt); if (S.kind !== 'all') p.set('k', S.kind);
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function init() {
    try {
      var j = JSON.parse(localStorage.getItem(LSK) || '{}');
      if (j.theme) S.theme = j.theme;
      if (NATIONS.some(function (n) { return n.id === j.nation; })) S.n = j.nation;
    } catch (e) { /* ignore */ }
    var p = new URLSearchParams(location.search);
    if (NATIONS.some(function (n) { return n.id === p.get('n'); })) S.n = p.get('n');
    if (BOXES.some(function (b) { return b.id === p.get('b'); })) S.b = p.get('b');
    if (TTYPES.some(function (t) { return t[0] === p.get('tt'); })) S.tt = p.get('tt');
    if (KINDS.some(function (k) { return k[0] === p.get('k'); })) S.kind = p.get('k');
    if (p.get('q')) S.q = p.get('q');
    if (p.get('v') === 'unit') S.view = 'unit';
    bind();
    render();
  }
  init();
  window.HTS_UNITS = { state: S, index: index, match: match, norm: norm };
})();
