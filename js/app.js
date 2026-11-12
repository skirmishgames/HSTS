(function () {
  'use strict';

  var LSK = 'hts.hon.bro.v1';
  var NATIONS = [{ id: 'us', name: 'United States' }, { id: 'ge', name: 'Germany' }, { id: 'uk', name: 'Commonwealth' }, { id: 'ru', name: 'Soviet Union (Stalingrad)' }];
  /* Each builder nation is built from one or more data files. Germany holds both German files.
     Ids from hon-hos-gs are prefixed with HOSP in the merged view because ten option ids
     (veteran, ammo, artillery, ...) also exist in hon-bro-ge. The data files are not changed. */
  var SOURCES = { us: ['hon-bro-us', 'hon-v1-us'], ge: ['hon-bro-ge', 'hon-hos-gs', 'hon-v1-ge'], uk: ['hon-bro-uk', 'hon-v1-uk'], ru: ['hon-hos-ru'] };
  /* First edition (V1) files are merged the same way, with ids prefixed V1P and a First edition tag. */
  var V1P = 'v1:', V1_TAG = 'First edition', V1_WORDS = ' first edition v1';
  var HOSP = 'gs:';
  var HOS_TAG = 'Stalingrad';
  var HOS_WORDS = ' stalingrad eastern front';
  var PRESETS = [150, 200, 250, 300, 350, 400, 500];
  var TYPES = [['all', 'All'], ['platoon', 'Platoons'], ['command', 'Command'], ['hero', 'Heroes'], ['landing', 'Landing'], ['aircraft', 'Aircraft'], ['support', 'Support tile'], ['special', 'Other']];
  var TYPE_ORDER = { command: 0, platoon: 1, hero: 2, landing: 3, aircraft: 4, support: 5, special: 6 };
  var CATS = [['support', 'Support units'], ['gear', 'Gear'], ['trait', 'Character traits'], ['order', 'Orders'], ['customization', 'Customizations']];
  var CAT_NAME = { support: 'Support', gear: 'Gear', trait: 'Trait', order: 'Order', customization: 'Customization' };
  var SIZE_NAME = { w: 'wide', n: 'narrow' };

  var S = {
    nation: 'us', limit: 250, name: '', army: [], theme: 'light', saved: [],
    type: 'all', sets: {}, q: '', view: 'army'
  };
  var P = { uid: null, i: 0, all: false, own: false };
  var OWN = window.HTS_OWN;
  var cache = {};
  var seq = 0;

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* First edition stripes are kept apart from V2 and Stalingrad ones, so first edition options only fit first edition slots. */
  function v1s(c) { return 'v1_' + c; }
  function data() {
    var n = S.nation;
    if (!cache[n]) {
      var tiles = [], options = [], t = {}, o = {}, name = '';
      SOURCES[n].forEach(function (key) {
        var d = window.HTS_DATA[key], hos = key.indexOf('hon-hos-') === 0, v1 = key.indexOf('hon-v1-') === 0, merged = hos && SOURCES[n].length > 1, pre = v1 ? V1P : (merged ? HOSP : '');
        if (!d) return;
        name = SOURCES[n].length > 1 ? NATIONS.filter(function (x) { return x.id === n; })[0].name : d.name;
        /* copies, so the shared data files stay as they are for the unit index and heroes pages */
        d.tiles.forEach(function (x) {
          var y = Object.assign({}, x, { id: pre + x.id, own: (x.own || []).map(function (id) { return pre + id; }), hos: merged, v1: v1, un: v1 ? '' : key.split('-')[2] });
          if (v1) y.slots = x.slots.map(function (sl) { return Object.assign({}, sl, { stripes: sl.stripes.map(v1s) }); });
          tiles.push(y); t[y.id] = y;
        });
        d.options.forEach(function (x) {
          var y = Object.assign({}, x, { id: pre + x.id, hos: merged, v1: v1 });
          if (v1) y.stripes = x.stripes.map(v1s);
          options.push(y); o[y.id] = y;
        });
      });
      cache[n] = { d: { name: name, tiles: tiles, options: options }, t: t, o: o };
    }
    return cache[n];
  }

  /* ---------- storage ---------- */
  function persist() {
    try {
      localStorage.setItem(LSK, JSON.stringify({ nation: S.nation, limit: S.limit, name: S.name, army: S.army, theme: S.theme, saved: S.saved }));
    } catch (e) { /* storage can be blocked */ }
  }
  function restore() {
    try {
      var raw = localStorage.getItem(LSK);
      if (!raw) return;
      var j = JSON.parse(raw);
      ['nation', 'limit', 'name', 'army', 'theme', 'saved'].forEach(function (k) { if (j[k] != null) S[k] = j[k]; });
      if (!Array.isArray(S.saved)) S.saved = [];
      migrate();
    } catch (e) { /* ignore */ }
  }
  /* Old saves under the nation gs (Germany, Stalingrad) become Germany with prefixed ids. */
  function oldGs(list) { return list.map(function (id) { return id && String(id).indexOf(HOSP) !== 0 ? HOSP + id : id; }); }
  function migrateSnap(j) {
    if (!j || j.n !== 'gs') return j;
    var k = Object.assign({}, j, { n: 'ge' });
    if (Array.isArray(j.a)) k.a = j.a.map(function (x) { return [oldGs([x[0]])[0], Array.isArray(x[1]) ? oldGs(x[1]) : x[1]]; });
    return k;
  }
  function migrate() {
    if (S.nation === 'gs') {
      S.nation = 'ge';
      if (Array.isArray(S.army)) S.army = S.army.map(function (e) { return Object.assign({}, e, { t: oldGs([e.t])[0], o: Array.isArray(e.o) ? oldGs(e.o) : e.o }); });
    }
    if (!NATIONS.some(function (n) { return n.id === S.nation; })) { S.nation = 'us'; S.army = []; }
    S.saved = S.saved.filter(function (a) { return a && a.snap; }).map(function (a) {
      var snap = migrateSnap(a.snap);
      return Object.assign({}, a, { nation: a.nation === 'gs' ? 'ge' : a.nation, snap: snap });
    });
  }
  function uid() { seq += 1; return 'a' + Date.now().toString(36) + seq; }

  /* ---------- rules ---------- */
  function fits(slot, opt) {
    var why = [];
    if (slot.stripes.indexOf('all') >= 0) return opt.v1 ? ['stripes'] : why; // Support tile: takes any V2 option, not first edition ones
    if (slot.size !== opt.size) why.push('size');
    var ok;
    if (opt.stripes.indexOf('any') >= 0) ok = !slot.stripes.some(function (x) { return String(x).indexOf('v1_') === 0; }); /* V2 any-stripe options do not go on first edition tiles */
    /* every stripe colour on the option must be on the slot: one shared colour is not a match */
    else ok = opt.stripes.length > 0 && opt.stripes.every(function (s) { return slot.stripes.indexOf(s) >= 0; });
    if (!ok) why.push('stripes');
    return why;
  }
  function cost(n) { return typeof n === 'number' ? n : 0; }
  function entryCost(e) {
    var D = data(), t = D.t[e.t];
    if (!t) return 0;
    var c = cost(t.cost);
    e.o.forEach(function (id) { if (id && D.o[id]) c += cost(D.o[id].cost); });
    return c;
  }
  function total() { return S.army.reduce(function (a, e) { return a + entryCost(e); }, 0); }
  function normalize() {
    var D = data();
    S.army = S.army.filter(function (e) { return D.t[e.t]; });
    S.army.forEach(function (e) {
      var t = D.t[e.t];
      if (!e.id) e.id = uid();
      if (!Array.isArray(e.o)) e.o = [];
      while (e.o.length < t.slots.length) e.o.push(null);
      e.o = e.o.slice(0, t.slots.length).map(function (id) { return id && D.o[id] ? id : null; });
    });
  }

  /* ---------- rendering helpers ---------- */
  function dots(list) {
    return list.map(function (s) { return '<span class="dot ' + esc(String(s).replace(/^v1_/, '')) + '" title="' + stripeName(s) + '"></span>'; }).join('');
  }
  function stripeName(s) {
    if (String(s).indexOf('v1_') === 0) return stripeName(String(s).slice(3)) + ', first edition';
    return ({ R: 'red', Y: 'yellow', B: 'blue', LB: 'light blue', W: 'white', K: 'black', G: 'green', T: 'tan', O: 'orange', OL: 'olive', CR: 'cream', BL: 'blue', LY: 'pale yellow', WR: 'white and red', YRB: 'yellow, red and blue (Weapon Platoon)', GOG: 'green and orange (Recon Squadron)', GLG: 'grey and light green (Sherman Squadron)', RWR: 'red and white (Panzergruppe)', GWG: 'green and white (Sturmpioniere)', GW: 'green and white (Panzergrenadiere)', RWM: 'red, white and maroon (Chaudiere)', YR: 'yellow and red (Suffolk)', YGY: 'yellow and grey (Yeomanry)', KWK: 'black and white (SS-Panzergrenadiere)', KRK: 'black and red (Wittmann)', WRW: 'white and red (East Yorkshire)', GKG: 'green and black (Royal Winnipeg Rifles)', BGB: 'blue and green (Paratroopers)', YLB: 'yellow and light blue (Rifle Platoon)', BYB: 'blue and yellow (Rangers)', KG: 'black and green', BCG: 'blue, cream and green', BRD: 'blue and red', cmd: 'command stripes', custom: 'customization', any: 'common, fits any slot', all: 'any option (Support tile)' })[s] || s;
  }
  function pips(n) { var s = ''; for (var i = 0; i < n; i++) s += '■'; return s; }
  function costLabel(c) { return c == null ? 'SP' : String(c); }
  function unitLine(units) {
    return (units || []).map(function (u) { return u[0] + (u[1] > 1 ? ' x' + u[1] : ''); }).join(', ');
  }
  function unitChips(units) {
    if (!units || !units.length) return '';
    return '<span class="uchips">' + units.map(function (u) {
      return '<span class="u k-' + esc(u[2]) + '">' + esc(u[0]) + (u[1] > 1 ? ' <i>x' + u[1] + '</i>' : '') + '</span>';
    }).join('') + '</span>';
  }
  function unitsHref(t) { return 'units.html?n=' + (t.un || S.nation) + '&q=' + encodeURIComponent(t.name + ' ' + (t.sub && t.type !== 'special' ? t.sub : '')); }
  function hosBadge(x) { return x.hos ? '<span class="hosbadge" title="Heroes of Stalingrad">' + HOS_TAG + '</span>' : (x.v1 ? '<span class="hosbadge v1badge" title="Heroes of Normandie, first edition">' + V1_TAG + '</span>' : ''); }
  var KIND_ORDER = ['officer', 'character', 'infantry', 'weapon', 'vehicle', 'marker', 'aircraft'];
  var KIND_PLURAL = { officer: 'Officers', character: 'Characters', infantry: 'Infantry', weapon: 'Weapons', vehicle: 'Vehicles', marker: 'Markers', aircraft: 'Aircraft' };

  /* ---------- setup ---------- */
  function renderSetup() {
    $('nations').innerHTML = NATIONS.map(function (n) {
      return '<button type="button" data-nation="' + n.id + '" class="' + (S.nation === n.id ? 'on' : '') + '" aria-pressed="' + (S.nation === n.id) + '">' + n.name + '</button>';
    }).join('');
    var sel = $('limitSel');
    var isPreset = PRESETS.indexOf(S.limit) >= 0;
    sel.innerHTML = PRESETS.map(function (p) {
      return '<option value="' + p + '"' + (p === S.limit ? ' selected' : '') + '>' + p + (p === 250 ? ' (championship)' : '') + '</option>';
    }).join('') + '<option value="custom"' + (isPreset ? '' : ' selected') + '>Custom</option>';
    $('limitNum').value = S.limit;
    $('armyName').value = S.name;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    $('lnkUnits').href = 'units.html?n=' + S.nation;
  }

  function renderPoints() {
    var used = total(), lim = S.limit || 0;
    $('ptsUsed').textContent = used;
    $('ptsLimit').textContent = lim;
    var ratio = lim > 0 ? used / lim : 0;
    var fill = $('barFill');
    fill.style.width = Math.min(100, ratio * 100) + '%';
    fill.className = 'fill' + (ratio > 1 ? ' over' : ratio > 0.9 ? ' near' : '');
    var left = $('ptsLeft');
    var diff = lim - used;
    left.textContent = diff >= 0 ? diff + ' left' : Math.abs(diff) + ' over';
    left.className = 'left' + (diff < 0 ? ' over' : '');

    var D = data(), warn = [], mismatch = 0, sp = 0;
    S.army.forEach(function (e) {
      var t = D.t[e.t];
      e.o.forEach(function (id, i) {
        if (!id) return;
        var o = D.o[id];
        if (fits(t.slots[i], o).length) mismatch += 1;
        if (o.cost == null) sp += 1;
      });
    });
    if (OWN.active()) {
      var miss = {};
      S.army.forEach(function (e) {
        var t = D.t[e.t];
        if (!OWN.owns(t.set)) miss[t.set] = 1;
        e.o.forEach(function (id) { if (id && !OWN.owns(D.o[id].set)) miss[D.o[id].set] = 1; });
      });
      var mk = Object.keys(miss);
      if (mk.length) warn.push('<p>This army uses items from ' + mk.map(function (k) { return esc(OWN.name(k)); }).join(' and ') + ', which ' + (mk.length > 1 ? 'are' : 'is') + ' not in your collection.</p>');
    }
    var ord = 0, hasOrd = false;
    S.army.forEach(function (e) {
      var t = D.t[e.t];
      if (t.orders == null) return;
      hasOrd = true; ord += t.orders;
      (t.starSlots || []).forEach(function (i) { if (e.o[i]) ord += 1; });
    });
    if (hasOrd) warn.push('<p class="info">Order tokens: ' + ord + '. This counts officer stars, fixed tile stars and star slots that hold an option. Command options that add orders are not counted.' + (S.army.some(function (e) { return D.t[e.t].orders == null; }) ? ' Tiles from Heroes of Normandie have no order tokens in the builder.' : '') + '</p>');
    if (diff < 0) warn.push('<p class="bad">The army is ' + Math.abs(diff) + ' points over the limit.</p>');
    if (mismatch) warn.push('<p>' + mismatch + ' option' + (mismatch > 1 ? 's are' : ' is') + ' in a slot of the wrong size or stripes. Check your physical tiles.</p>');
    if (sp) warn.push('<p>' + sp + ' option' + (sp > 1 ? 's show' : ' shows') + ' SP instead of a cost. Those are counted as 0 points. Check your scenario.</p>');
    $('warnings').innerHTML = warn.join('');
  }

  /* ---------- board ---------- */
  function renderBoard() {
    var D = data(), b = $('board');
    var head = '<div class="print-head"><h2>' + esc(S.name || 'Army') + '</h2><p>' + esc(D.d.name) + ', ' + total() + ' of ' + S.limit + ' points</p></div>';
    if (!S.army.length) {
      b.innerHTML = head + '<div class="empty">No tiles yet. Open "Add tiles" and pick a Recruitment Tile to start.</div>';
      renderSummary();
      return;
    }
    b.innerHTML = head + S.army.map(function (e, idx) {
      var t = D.t[e.t];
      var slots = t.slots.map(function (s, i) {
        var pos = 'left:' + (s.x * 100) + '%;top:' + (s.y * 100) + '%;width:' + (s.w * 100) + '%;height:' + (s.h * 100) + '%';
        var id = e.o[i], o = id && D.o[id];
        if (o) {
          var bad = fits(s, o).length > 0;
          var st = t.starSlots && t.starSlots.indexOf(i) >= 0 ? ' star' : '';
          return '<button type="button" class="slot filled' + (bad ? ' mismatch' : '') + st + '" style="' + pos + '" data-slot="' + e.id + ':' + i + '" aria-label="Slot ' + (i + 1) + ': ' + esc(o.name) + '. Change"><img src="' + o.img + '" alt="' + esc(o.name) + '"></button>';
        }
        var st2 = t.starSlots && t.starSlots.indexOf(i) >= 0 ? ' star' : '';
        return '<button type="button" class="slot' + st2 + '" style="' + pos + '" data-slot="' + e.id + ':' + i + '" aria-label="Slot ' + (i + 1) + ', ' + SIZE_NAME[s.size] + '. Add an option"><span class="plus">+</span><span class="dots">' + dots(s.stripes) + '</span></button>';
      }).join('');
      var lines = e.o.map(function (id, i) {
        if (!id) return '';
        var o = D.o[id], bad = fits(t.slots[i], o).length > 0;
        return '<li><span class="ol"><span' + (bad ? ' class="bad"' : '') + '>' + esc(o.name) + (bad ? ' (does not fit)' : '') + '</span>' + unitChips(o.units) + (o.note ? '<small class="note">' + esc(o.note) + '</small>' : '') + '</span><span>' + costLabel(o.cost) + '</span></li>';
      }).join('');
      var sub = t.sub ? '<small>' + esc(t.sub) + '</small>' : '';
      return '<article class="atile" data-uid="' + e.id + '">' +
        '<header><h3>' + esc(t.name) + sub + '</h3><div class="tools"><span class="tcost">' + entryCost(e) + ' pts</span>' +
        '<button type="button" class="ghost" data-act="up" aria-label="Move up"' + (idx === 0 ? ' disabled' : '') + '>Up</button>' +
        '<button type="button" class="ghost" data-act="down" aria-label="Move down"' + (idx === S.army.length - 1 ? ' disabled' : '') + '>Down</button>' +
        '<button type="button" class="ghost" data-act="zoom">Zoom</button>' +
        (t.v1 ? '' : '<a class="btn ghost" href="' + esc(unitsHref(t)) + '">Units</a>') +
        '<button type="button" class="ghost danger" data-act="remove">Remove</button></div></header>' +
        (t.units ? '<p class="incl"><b>Tile includes</b>' + unitChips(t.units) + '</p>' : '') +
        '<div class="tilebox" style="aspect-ratio:' + t.w + '/' + t.h + '"><img src="' + t.img + '" alt="' + esc(t.name) + ' tile" width="' + t.w + '" height="' + t.h + '">' + slots + '</div>' +
        (lines ? '<ul class="optlist">' + lines + '</ul>' : '') + '</article>';
    }).join('');
    renderSummary();
  }

  function renderSummary() {
    var D = data(), s = $('summary');
    if (!S.army.length) { s.innerHTML = ''; return; }
    var rows = '', squares = 0, tally = {};
    function addUnits(list) {
      (list || []).forEach(function (u) {
        var k = u[0];
        if (!tally[k]) tally[k] = { name: u[0], qty: 0, kind: u[2] };
        tally[k].qty += u[1];
      });
    }
    S.army.forEach(function (e) {
      var t = D.t[e.t];
      squares += t.squares || 0;
      addUnits(t.units);
      rows += '<tr><td>' + esc(t.name) + (t.sub && t.type !== 'special' ? ' <span class="count">' + esc(t.sub) + '</span>' : '') + (t.squares ? ' <span class="pips" title="Breaking point">' + pips(t.squares) + '</span>' : '') +
        (t.units ? '<div class="ul">' + esc(unitLine(t.units)) + '</div>' : '') + '</td><td class="r">' + costLabel(t.cost) + '</td></tr>';
      e.o.forEach(function (id) {
        if (!id) return;
        var o = D.o[id]; squares += o.squares || 0;
        addUnits(o.units);
        rows += '<tr class="opt"><td>' + esc(o.name) + (o.squares ? ' <span class="pips" title="Breaking point">' + pips(o.squares) + '</span>' : '') +
          (o.units ? '<div class="ul">' + esc(unitLine(o.units)) + '</div>' : '') + '</td><td class="r">' + costLabel(o.cost) + '</td></tr>';
      });
    });
    var all = Object.keys(tally).map(function (k) { return tally[k]; }), count = 0;
    all.forEach(function (u) { count += u.qty; });
    var groups = KIND_ORDER.map(function (k) {
      var items = all.filter(function (u) { return u.kind === k; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (!items.length) return '';
      return '<tr><th scope="row">' + KIND_PLURAL[k] + '</th><td>' + items.map(function (u) { return '<span class="u k-' + k + '">' + esc(u.name) + (u.qty > 1 ? ' <i>x' + u.qty + '</i>' : '') + '</span>'; }).join('') + '</td></tr>';
    }).join('');
    s.innerHTML = '<h3>Roster</h3><table><tbody>' + rows + '</tbody><tfoot><tr><td>Total</td><td class="r">' + total() + ' / ' + S.limit + '</td></tr></tfoot></table>' +
      '<p class="count">Red squares are breaking points. Total across the army: ' + squares + '.</p>' +
      (groups ? '<h3 class="uh">Units in this army</h3><table class="utable"><tbody>' + groups + '</tbody></table><p class="count">Unit entries from tiles and options. Gear, traits, customizations and orders add no units. Aircraft entries are counters you call in with orders.</p>' : '');
  }

  /* ---------- library ---------- */
  function renderFilters() {
    $('typeChips').innerHTML = TYPES.map(function (t) {
      return '<button type="button" class="chip' + (S.type === t[0] ? ' on' : '') + '" data-type="' + t[0] + '">' + t[1] + '</button>';
    }).join('');
    var sets = {};
    data().d.tiles.forEach(function (t) { if (OWN.owns(t.set)) sets[t.set] = 1; });
    $('setChips').innerHTML = Object.keys(sets).map(function (k) {
      return '<button type="button" class="chip' + (S.sets[k] ? ' on' : '') + '" data-set="' + esc(k) + '" title="' + esc(OWN.name(k)) + '">' + esc(k) + '</button>';
    }).join('');
  }

  function renderLibrary() {
    var D = data(), q = S.q.trim().toLowerCase();
    var anySet = Object.keys(S.sets).some(function (k) { return S.sets[k]; });
    var list = D.d.tiles.filter(function (t) {
      if (S.type !== 'all' && t.type !== S.type) return false;
      if (anySet && !S.sets[t.set]) return false;
      if (!OWN.owns(t.set)) return false;
      if (q && (t.name + ' ' + (t.sub || '') + (t.hos ? HOS_WORDS : '') + (t.v1 ? V1_WORDS : '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    }).sort(function (a, b) {
      /* V2 tiles first, then first edition, so the two editions sit in separate runs */
      return ((a.v1 ? 1 : 0) - (b.v1 ? 1 : 0)) || (TYPE_ORDER[a.type] - TYPE_ORDER[b.type]) || (a.cost - b.cost) || a.name.localeCompare(b.name);
    });
    var hidT = D.d.tiles.filter(function (t) { return !OWN.owns(t.set); }).length;
    $('ownnote').innerHTML = OWN.note(hidT, hidT === 1 ? 'tile' : 'tiles');
    if (!list.length) { $('library').innerHTML = '<p class="count">No tiles match.' + (OWN.active() ? ' Your collection filter is on. Open My collection to change it.' : '') + '</p>'; return; }
    $('library').innerHTML = list.map(function (t) {
      var n = S.army.filter(function (e) { return e.t === t.id; }).length;
      return '<div class="lcard"><button type="button" class="imgbtn" data-zoom="' + t.img + '" data-cap="' + esc(t.name + ', ' + t.cost + ' pts') + '" aria-label="Zoom ' + esc(t.name) + '"><img src="' + t.img + '" alt="' + esc(t.name) + '" loading="lazy" width="' + t.w + '" height="' + t.h + '"></button>' +
        '<div class="info"><span class="nm">' + esc(t.name) + '</span><span class="sb">' + esc(t.sub || '') + '</span>' + hosBadge(t) +
        (t.units ? '<span class="lu">' + esc(unitLine(t.units)) + '</span>' : '') +
        '<span class="count">' + t.slots.length + ' slot' + (t.slots.length === 1 ? '' : 's') + (n ? ', ' + n + ' in army' : '') + '</span>' +
        '<div class="row"><span class="pts">' + t.cost + ' pts</span><span class="lrow-btns">' + (t.v1 ? '' : '<a class="btn ghost" href="' + esc(unitsHref(t)) + '">Units</a>') + '<button type="button" class="add" data-add="' + t.id + '">Add</button></span></div></div></div>';
    }).join('');
  }

  /* ---------- saved armies ---------- */
  function renderSaved() {
    var r = $('savedRow');
    if (!S.saved.length) { r.innerHTML = ''; return; }
    r.innerHTML = S.saved.map(function (a, i) {
      return '<span class="chips"><button type="button" class="chip" data-load="' + i + '">' + esc(a.name) + ' (' + (NATIONS.filter(function (n) { return n.id === a.nation; })[0] || NATIONS[0]).name.slice(0, 2).toUpperCase() + ', ' + a.pts + ')</button>' +
        '<button type="button" class="chip" data-del="' + i + '" aria-label="Delete saved army ' + esc(a.name) + '">x</button></span>';
    }).join('');
  }

  /* ---------- picker ---------- */
  function openPicker(entryId, i) {
    P.uid = entryId; P.i = i; P.all = false; P.own = false;
    $('pickAll').checked = false; $('pickOwn').checked = false; $('pickOwnWrap').hidden = !OWN.active();
    renderPicker();
    $('picker').hidden = false;
  }
  function renderPicker() {
    var D = data();
    var e = S.army.filter(function (x) { return x.id === P.uid; })[0];
    if (!e) { $('picker').hidden = true; return; }
    var t = D.t[e.t], slot = t.slots[P.i];
    $('pickTitle').textContent = t.name + ', slot ' + (P.i + 1);
    $('pickMeta').innerHTML = slot.stripes.indexOf('all') >= 0 ? 'This slot takes any option, whatever its size or stripes.' : 'Size: ' + SIZE_NAME[slot.size] + '. Stripes: ' + dots(slot.stripes) + ' ' + slot.stripes.map(stripeName).join(', ');
    $('pickClear').disabled = !e.o[P.i];
    var html = '';
    CATS.forEach(function (c) {
      var items = D.d.options.filter(function (o) { return o.cat === c[0] && (P.own || OWN.owns(o.set)); }).map(function (o) { return { o: o, why: fits(slot, o) }; });
      if (!P.all) items = items.filter(function (x) { return !x.why.length; });
      items.sort(function (a, b) { return (a.why.length - b.why.length) || (cost(a.o.cost) - cost(b.o.cost)) || a.o.name.localeCompare(b.o.name); });
      if (!items.length) return;
      html += '<div class="pick-group">' + c[1] + '</div>';
      html += items.map(function (x) {
        var o = x.o;
        return '<button type="button" class="pcard' + (x.why.length ? ' nofit' : '') + '" data-pick="' + o.id + '">' +
          '<img src="' + o.img + '" alt="" loading="lazy" width="' + o.w + '" height="' + o.h + '">' +
          '<span class="nm">' + esc(o.name) + '</span>' + hosBadge(o) +
          (o.units ? '<span class="nt">Includes: ' + esc(unitLine(o.units)) + '</span>' : '') +
          (o.note ? '<span class="nt">' + esc(o.note) + '</span>' : '') +
          (x.why.length ? '<span class="fl">Wrong ' + x.why.join(' and ') + '</span>' : '') +
          '<span class="pc"><span class="pts">' + costLabel(o.cost) + ' pts</span><span>' + dots(o.stripes) + '</span></span></button>';
      }).join('');
    });
    $('pickList').innerHTML = html || '<p class="count">Nothing fits this slot. Tick a box above to see more options.</p>';
  }
  function closeOverlays() {
    ['picker', 'zoom', 'help', 'own'].forEach(function (id) { $(id).hidden = true; });
  }

  /* ---------- share, export, import ---------- */
  function snapshot() {
    return { n: S.nation, l: S.limit, nm: S.name, a: S.army.map(function (e) { return [e.t, e.o]; }) };
  }
  function applySnapshot(j) {
    j = migrateSnap(j);
    if (!j || !NATIONS.some(function (n) { return n.id === j.n; }) || !Array.isArray(j.a)) throw new Error('bad');
    S.nation = j.n; S.limit = Number(j.l) || 250; S.name = j.nm || '';
    S.army = j.a.map(function (x) { return { id: uid(), t: x[0], o: Array.isArray(x[1]) ? x[1] : [] }; });
    normalize();
  }
  function encode(j) { return btoa(unescape(encodeURIComponent(JSON.stringify(j)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function decode(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  }
  function toast(msg) {
    var el = document.createElement('p');
    el.textContent = msg;
    el.setAttribute('role', 'status');
    $('warnings').appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3500);
  }

  /* ---------- actions ---------- */
  function renderAll() {
    normalize();
    renderSetup(); renderFilters(); renderLibrary(); renderBoard(); renderPoints(); renderSaved();
    document.body.setAttribute('data-view', S.view);
    $('tabArmy').className = S.view === 'army' ? 'on' : '';
    $('tabLib').className = S.view === 'lib' ? 'on' : '';
  }
  function refresh() { persist(); renderLibrary(); renderBoard(); renderPoints(); }

  OWN.onChange(function () { Object.keys(S.sets).forEach(function (k) { if (!OWN.owns(k)) delete S.sets[k]; }); renderFilters(); renderLibrary(); renderPoints(); if (!$('picker').hidden) renderPicker(); });

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target;
      var el;
      if ((el = t.closest('[data-nation]'))) {
        if (el.dataset.nation !== S.nation) {
          if (S.army.length && !window.confirm('Switching country clears the current army. Continue?')) return;
          S.nation = el.dataset.nation; S.army = []; persist(); renderAll();
        }
        return;
      }
      if ((el = t.closest('[data-type]'))) { S.type = el.dataset.type; renderFilters(); renderLibrary(); return; }
      if ((el = t.closest('[data-set]'))) { S.sets[el.dataset.set] = !S.sets[el.dataset.set]; renderFilters(); renderLibrary(); return; }
      if ((el = t.closest('[data-add]'))) {
        var tile = data().t[el.dataset.add];
        S.army.push({ id: uid(), t: tile.id, o: tile.slots.map(function () { return null; }) });
        persist(); renderLibrary(); renderBoard(); renderPoints();
        toast('Added ' + tile.name + '.');
        return;
      }
      if ((el = t.closest('[data-slot]'))) { var p = el.dataset.slot.split(':'); openPicker(p[0], Number(p[1])); return; }
      if ((el = t.closest('[data-pick]'))) {
        var e = S.army.filter(function (x) { return x.id === P.uid; })[0];
        if (e) { e.o[P.i] = el.dataset.pick; refresh(); }
        $('picker').hidden = true; return;
      }
      if ((el = t.closest('[data-act]'))) {
        var card = el.closest('[data-uid]'), id = card.dataset.uid;
        var idx = S.army.map(function (x) { return x.id; }).indexOf(id), act = el.dataset.act;
        if (act === 'remove') S.army.splice(idx, 1);
        if (act === 'up' && idx > 0) { var a = S.army.splice(idx, 1)[0]; S.army.splice(idx - 1, 0, a); }
        if (act === 'down' && idx < S.army.length - 1) { var b = S.army.splice(idx, 1)[0]; S.army.splice(idx + 1, 0, b); }
        if (act === 'zoom') { var tl = data().t[S.army[idx].t]; showZoom(tl.img, tl.name + ', ' + tl.cost + ' pts'); return; }
        refresh(); return;
      }
      if ((el = t.closest('[data-zoom]'))) { showZoom(el.dataset.zoom, el.dataset.cap); return; }
      if ((el = t.closest('[data-load]'))) {
        var a2 = S.saved[Number(el.dataset.load)];
        try { applySnapshot(a2.snap); persist(); renderAll(); toast('Loaded ' + a2.name + '.'); } catch (err) { toast('Could not load that army.'); }
        return;
      }
      if ((el = t.closest('[data-del]'))) {
        var i = Number(el.dataset.del);
        if (el.dataset.sure === '1') { S.saved.splice(i, 1); persist(); renderSaved(); }
        else { el.dataset.sure = '1'; el.textContent = 'Delete?'; }
        return;
      }
      if (t.closest('#zoom')) { $('zoom').hidden = true; return; }
      if (t.id === 'picker' || t.id === 'help') { closeOverlays(); }
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeOverlays(); });

    $('pickClose').onclick = closeOverlays;
    $('helpClose').onclick = closeOverlays;
    $('btnHelp').onclick = function () { $('help').hidden = false; };
    $('pickAll').onchange = function () { P.all = this.checked; renderPicker(); };
    $('pickOwn').onchange = function () { P.own = this.checked; renderPicker(); };
    $('pickClear').onclick = function () {
      var e = S.army.filter(function (x) { return x.id === P.uid; })[0];
      if (e) { e.o[P.i] = null; refresh(); }
      $('picker').hidden = true;
    };
    $('btnTheme').onclick = function () { S.theme = S.theme === 'dark' ? 'light' : 'dark'; persist(); renderSetup(); };
    $('tabArmy').onclick = function () { S.view = 'army'; renderAll(); window.scrollTo(0, 0); };
    $('tabLib').onclick = function () { S.view = 'lib'; renderAll(); window.scrollTo(0, 0); };
    $('limitSel').onchange = function () {
      if (this.value !== 'custom') { S.limit = Number(this.value); persist(); renderSetup(); renderPoints(); }
      else $('limitNum').focus();
    };
    $('limitNum').oninput = function () {
      var v = Math.max(0, Math.floor(Number(this.value) || 0));
      S.limit = v; persist(); renderPoints();
      $('limitSel').value = PRESETS.indexOf(v) >= 0 ? String(v) : 'custom';
    };
    $('armyName').oninput = function () { S.name = this.value; persist(); };
    $('search').oninput = function () { S.q = this.value; renderLibrary(); };
    $('btnNew').onclick = function () {
      if (S.army.length && !window.confirm('Clear the current army?')) return;
      S.army = []; S.name = ''; persist(); renderAll();
    };
    $('btnSave').onclick = function () {
      var name = (S.name || '').trim() || ('Army ' + (S.saved.length + 1));
      S.name = name;
      var rec = { name: name, nation: S.nation, pts: total(), snap: snapshot() };
      var at = S.saved.map(function (x) { return x.name; }).indexOf(name);
      if (at >= 0) S.saved[at] = rec; else S.saved.push(rec);
      persist(); renderSetup(); renderSaved(); toast('Saved ' + name + ' on this device.');
    };
    $('btnPrint').onclick = function () { S.view = 'army'; renderAll(); window.print(); };
    $('btnLink').onclick = function () {
      var url = location.href.split('#')[0] + '#b=' + encode(snapshot());
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { toast('Link copied.'); }, function () { window.prompt('Copy this link', url); });
      } else window.prompt('Copy this link', url);
    };
    $('btnExport').onclick = function () {
      var blob = new Blob([JSON.stringify(snapshot(), null, 1)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = ((S.name || 'army').replace(/[^\w\- ]+/g, '').trim() || 'army') + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    };
    $('fileImport').onchange = function () {
      var f = this.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try { applySnapshot(JSON.parse(r.result)); persist(); renderAll(); toast('Imported.'); } catch (err) { toast('That file is not a valid army.'); }
      };
      r.readAsText(f); this.value = '';
    };
  }

  function showZoom(src, cap) {
    $('zoomImg').src = src; $('zoomImg').alt = cap || '';
    $('zoomCap').textContent = cap || '';
    $('zoom').hidden = false;
  }

  function init() {
    restore();
    if (location.hash.indexOf('#b=') === 0) {
      try { applySnapshot(decode(location.hash.slice(3))); persist(); history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore bad link */ }
    }
    var f = document.querySelector('.foot');
    if (f) f.insertAdjacentHTML('beforeend', '<p>Corrections and feedback: <a href="mailto:games@staroversky.com">games@staroversky.com</a></p>');
    bind();
    renderAll();
  }
  init();
  window.HTS = { state: S, data: data, fits: fits, total: total, unitLine: unitLine };
})();
