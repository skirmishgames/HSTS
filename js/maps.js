(function () {
  'use strict';
  var LSK = 'hts.maps.v1';
  var D = window.HTS_MAPS, CELL = D.cell;
  var BOXES = D.boxes;
  var SHORT = { bro: 'Big Red One', omaha: 'Bloody Omaha', 'caen-ecg': 'Caen: Epsom, Charnwood & Goodwood', 'caen-wj': 'Caen: Windsor & Jupiter' };
  var SIZES = [['1x1', 7, 7, '1 board (7 x 7)'], ['2x1', 14, 7, '2 x 1 boards (14 x 7)'], ['1x2', 7, 14, '1 x 2 boards (7 x 14)'],
    ['2x2', 14, 14, '2 x 2 boards (14 x 14)'], ['3x2', 21, 14, '3 x 2 boards (21 x 14)'], ['2x3', 14, 21, '2 x 3 boards (14 x 21)'],
    ['3x3', 21, 21, '3 x 3 boards (21 x 21)'], ['custom', 0, 0, 'Custom']];
  var P = {};
  BOXES.forEach(function (b) {
    b.pieces.forEach(function (p) {
      p.key = b.id + ':' + p.id; p.box = b.id; p.dir = 'img/hon/maps/' + b.id + '/'; P[p.key] = p;
    });
  });
  var ORDER = D.order || [];
  var ALL = { id: 'all', name: 'All boxes', desc: 'Every terrain piece from the four boxes, so you can compare houses, roads or boards side by side.', pieces: [] };
  BOXES.forEach(function (b) { ALL.pieces = ALL.pieces.concat(b.pieces); });
  ALL.pieces = ALL.pieces.map(function (p, i) { return { p: p, i: i }; }).sort(function (a, b) {
    return (ORDER.indexOf(a.p.group) - ORDER.indexOf(b.p.group)) || (a.i - b.i);
  }).map(function (x) { return x.p; });
  ALL.groups = ORDER.filter(function (g) { return ALL.pieces.some(function (p) { return p.cats.indexOf(g) >= 0; }); });
  var LIST = BOXES.concat([ALL]);
  SHORT.all = 'All boxes';

  var S = { b: 'bro', q: '', g: 'all', theme: 'light', sel: null, zoom: 0.45, snap: 0.5, grid: true, tab: 'map',
    map: blank(), saved: [], undo: [], redo: [], uid: 1, zoomSet: false, viewKey: null };

  function blank() { return { name: '', cols: 14, rows: 14, items: [] }; }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function fmt(n) { return String(Math.round(n * 100) / 100); }
  function box(id) { return LIST.filter(function (b) { return b.id === id; })[0]; }
  function realBox(id) { return BOXES.filter(function (b) { return b.id === id; })[0]; }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ---------- storage ---------- */
  function lsGet() { try { return JSON.parse(localStorage.getItem(LSK) || '{}'); } catch (e) { return {}; } }
  function lsPut(patch) {
    try { var j = lsGet(); Object.keys(patch).forEach(function (k) { j[k] = patch[k]; }); localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
  }
  function strip(m) {
    return { name: m.name, cols: m.cols, rows: m.rows, items: m.items.map(function (it) { return { k: it.k, s: it.s, x: it.x, y: it.y, r: it.r }; }) };
  }
  function autosave() { lsPut({ work: strip(S.map), zoom: S.zoom, snap: S.snap, grid: S.grid, b: S.b }); }
  function clean(m) {
    var out = blank();
    if (!m || typeof m !== 'object') return out;
    out.name = String(m.name || '').slice(0, 60);
    out.cols = Math.min(42, Math.max(2, Math.round(+m.cols || 14)));
    out.rows = Math.min(42, Math.max(2, Math.round(+m.rows || 14)));
    (m.items || []).forEach(function (it) {
      if (!it || !P[it.k]) return;
      var p = P[it.k];
      out.items.push({ u: S.uid++, k: it.k, s: it.s === 'b' && p.b ? 'b' : 'a', x: +it.x || 0, y: +it.y || 0, r: ((Math.round(+it.r || 0) % 4) + 4) % 4 });
    });
    out.items.forEach(function (it) { clamp(it, out); });
    return out;
  }

  /* ---------- geometry ---------- */
  function dims(it) { var p = P[it.k], odd = it.r % 2; return { w: odd ? p.h : p.w, h: odd ? p.w : p.h }; }
  function clamp(it, m) {
    m = m || S.map; var d = dims(it);
    it.x = Math.max(0, Math.min(it.x, Math.max(0, m.cols - d.w)));
    it.y = Math.max(0, Math.min(it.y, Math.max(0, m.rows - d.h)));
    it.x = Math.round(it.x * 100) / 100; it.y = Math.round(it.y * 100) / 100;
  }
  function sn(v) { return S.snap ? Math.round(v / S.snap) * S.snap : Math.round(v * 20) / 20; }
  function px(v) { return v * CELL * S.zoom; }
  function find(u) { return S.map.items.filter(function (i) { return i.u === u; })[0]; }
  function selItem() { return S.sel == null ? null : find(S.sel); }
  function ordered() {
    var items = S.map.items;
    return items.filter(function (i) { return P[i.k].kind === 'board'; }).concat(items.filter(function (i) { return P[i.k].kind !== 'board'; }));
  }
  function overlap(a, b) {
    var da = dims(a), db = dims(b);
    var w = Math.min(a.x + da.w, b.x + db.w) - Math.max(a.x, b.x);
    var h = Math.min(a.y + da.h, b.y + db.h) - Math.max(a.y, b.y);
    return w > 0.01 && h > 0.01;
  }

  /* ---------- history ---------- */
  function snapshot() { return JSON.stringify(strip(S.map)); }
  function push() { S.undo.push(snapshot()); if (S.undo.length > 100) S.undo.shift(); S.redo = []; }
  function restore(str) {
    var keep = S.sel, k = null, it = selItem();
    if (it) k = it.k;
    S.map = clean(JSON.parse(str));
    var again = S.map.items.filter(function (i) { return i.k === k; })[0];
    S.sel = keep != null && again ? again.u : null;
    renderMap();
  }
  function undo() { if (!S.undo.length) return; S.redo.push(snapshot()); restore(S.undo.pop()); autosave(); }
  function redo() { if (!S.redo.length) return; S.undo.push(snapshot()); restore(S.redo.pop()); autosave(); }
  function mut(fn, light) {
    push(); fn();
    if (light) { refreshAll(); } else { renderMap(); }
    autosave();
  }

  /* ---------- palette ---------- */
  function used(key) { return S.map.items.filter(function (i) { return i.k === key; }).length; }
  function visible() {
    var b = box(S.b), toks = norm(S.q).split(' ').filter(Boolean);
    return b.pieces.filter(function (p) {
      if (S.g !== 'all' && p.cats.indexOf(S.g) < 0) return false;
      var hay = norm(p.name + ' ' + p.cats.join(' ') + ' ' + (p.sd || ''));
      return toks.every(function (t) { return hay.indexOf(t) >= 0; });
    });
  }
  function sizeText(p) { return fmt(p.w) + ' x ' + fmt(p.h) + ' squares'; }
  function renderBoxes() {
    $('boxes').innerHTML = LIST.map(function (b) {
      return '<button type="button" class="chip' + (S.b === b.id ? ' on' : '') + '" data-box="' + b.id + '" aria-pressed="' + (S.b === b.id) + '">' + esc(SHORT[b.id] || b.name) + '</button>';
    }).join('');
    $('subtitle').textContent = 'Maps, Heroes of Normandie' + (S.b === 'all' ? '' : ', ' + box(S.b).name);
  }
  function renderPalette() {
    var b = box(S.b);
    $('palTitle').textContent = b.name;
    $('palDesc').textContent = b.desc + (S.b === 'all' ? '' : ' Pieces from different boxes can share one map.');
    var gs = ['all'].concat(b.groups);
    if (gs.indexOf(S.g) < 0) S.g = 'all';
    $('groups').innerHTML = gs.map(function (g) {
      var n = g === 'all' ? b.pieces.length : b.pieces.filter(function (p) { return p.cats.indexOf(g) >= 0; }).length;
      return '<button type="button" class="chip' + (S.g === g ? ' on' : '') + '" data-group="' + esc(g) + '" aria-pressed="' + (S.g === g) + '">' + (g === 'all' ? 'All types' : esc(g)) + ' <span class="cn">' + n + '</span></button>';
    }).join('');
    var list = visible();
    $('stat').textContent = list.length + ' of ' + b.pieces.length + ' pieces';
    $('pieces').innerHTML = list.map(function (p) {
      var n = used(p.key), thumb = p.dir + (p.t || p.a);
      return '<div class="mcard" draggable="true" data-key="' + p.key + '">' +
        '<button type="button" class="mthumb' + (p.kind === 'board' ? ' bd' : '') + '" data-view="' + p.key + '" aria-label="View ' + esc(p.name) + '"><img src="' + thumb + '" alt="" loading="lazy" draggable="false"></button>' +
        '<div class="minfo"><b>' + esc(p.name) + '</b><span>' + sizeText(p) + (p.b ? ', two sides' : ', one side') + '</span>' +
        (p.sd ? '<span>' + esc(p.sd) + '</span>' : '') + (S.b === 'all' ? '<span>' + esc(SHORT[p.box]) + '</span>' : '') +
        '<span class="mused' + (n > 1 ? ' warn' : '') + '" data-used="' + p.key + '">' + (n ? 'On the map: ' + n : '') + '</span></div>' +
        '<div class="mact"><button type="button" data-add="' + p.key + '">Add</button><button type="button" class="ghost" data-view="' + p.key + '">View</button></div></div>';
    }).join('') || '<p class="mhelp">No pieces match.</p>';
  }
  function updateUsed() {
    var nodes = $('pieces').querySelectorAll('[data-used]');
    Array.prototype.forEach.call(nodes, function (el) {
      var n = used(el.dataset.used);
      el.textContent = n ? 'On the map: ' + n : '';
      el.classList.toggle('warn', n > 1);
    });
  }

  /* ---------- stage ---------- */
  function itemHtml(it, i) {
    var p = P[it.k], d = dims(it), src = p.dir + (it.s === 'b' && p.b ? p.b : p.a);
    var z = (p.kind === 'board' ? 10 : 1000) + i;
    return '<div class="mp' + (it.u === S.sel ? ' sel' : '') + '" data-u="' + it.u + '" tabindex="0" role="button" aria-label="' + esc(p.name + ', side ' + it.s.toUpperCase()) + '" title="' + esc(p.name + ' (' + it.s.toUpperCase() + ')') + '" style="' + posCss(it, d, z) + '">' +
      '<img src="' + src + '" alt="" draggable="false" style="' + imgCss(p, it) + '"></div>';
  }
  function posCss(it, d, z) {
    return 'left:' + px(it.x) + 'px;top:' + px(it.y) + 'px;width:' + px(d.w) + 'px;height:' + px(d.h) + 'px;z-index:' + z;
  }
  function imgCss(p, it) { return 'width:' + px(p.w) + 'px;height:' + px(p.h) + 'px;transform:translate(-50%,-50%) rotate(' + (it.r * 90) + 'deg)'; }
  function planeSize() {
    var pl = $('plane'), sq = px(1);
    pl.style.width = px(S.map.cols) + 'px'; pl.style.height = px(S.map.rows) + 'px';
    pl.style.setProperty('--sq', sq + 'px'); pl.style.setProperty('--sq7', sq * 7 + 'px');
    pl.classList.toggle('nogrid', !S.grid);
  }
  function renderStage() {
    var hadFocus = document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('mp');
    planeSize();
    $('plane').innerHTML = '<div class="mgridov" aria-hidden="true"></div>' + ordered().map(itemHtml).join('');
    if (hadFocus && S.sel != null) { var el = elOf(S.sel); if (el) el.focus({ preventScroll: true }); }
  }
  function elOf(u) { return $('plane').querySelector('[data-u="' + u + '"]'); }
  function refreshItem(it) {
    var el = elOf(it.u); if (!el) return;
    var p = P[it.k], d = dims(it), z = el.style.zIndex;
    el.setAttribute('style', posCss(it, d, z));
    var img = el.firstChild; img.setAttribute('style', imgCss(p, it));
    img.src = p.dir + (it.s === 'b' && p.b ? p.b : p.a);
    el.title = p.name + ' (' + it.s.toUpperCase() + ')';
    el.setAttribute('aria-label', p.name + ', side ' + it.s.toUpperCase());
  }
  function refreshAll() { S.map.items.forEach(refreshItem); renderBar(); renderWarn(); updateUsed(); }
  function setSel(u) {
    S.sel = u;
    Array.prototype.forEach.call($('plane').querySelectorAll('.mp'), function (el) { el.classList.toggle('sel', +el.dataset.u === u); });
    renderBar();
  }

  /* ---------- toolbar, warnings, saved ---------- */
  function renderBar() {
    var it = selItem();
    $('bUndo').disabled = !S.undo.length; $('bRedo').disabled = !S.redo.length;
    Array.prototype.forEach.call($('selTools').querySelectorAll('button'), function (b) {
      b.disabled = !it || (b.dataset.act === 'flip' && !P[it.k].b);
    });
    var n = S.map.items.length;
    $('mnote').textContent = it ? P[it.k].name + ', side ' + it.s.toUpperCase() + ', ' + fmt(dims(it).w) + ' x ' + fmt(dims(it).h) + ' squares at ' + fmt(it.x) + ', ' + fmt(it.y) :
      (n ? n + ' piece' + (n === 1 ? '' : 's') + ' on the map. Click one to select it.' : 'The map is empty. Add a board from the pieces list to begin.');
  }
  function warnings() {
    var w = [], counts = {};
    S.map.items.forEach(function (i) { counts[i.k] = (counts[i.k] || 0) + 1; });
    Object.keys(counts).forEach(function (k) {
      if (counts[k] > 1) w.push(P[k].name + ' is on the map ' + counts[k] + ' times. A box holds one of each piece.');
    });
    var bd = S.map.items.filter(function (i) { return P[i.k].kind === 'board'; });
    for (var a = 0; a < bd.length; a++) for (var b = a + 1; b < bd.length; b++) {
      if (overlap(bd[a], bd[b])) w.push(P[bd[a].k].name + ' overlaps ' + P[bd[b].k].name + '.');
    }
    return w;
  }
  function renderWarn() { $('mwarn').innerHTML = warnings().map(function (t) { return '<p>' + esc(t) + '</p>'; }).join(''); }
  function renderSize() {
    var m = S.map, cur = 'custom';
    SIZES.forEach(function (s) { if (s[1] === m.cols && s[2] === m.rows) cur = s[0]; });
    $('msize').innerHTML = SIZES.map(function (s) { return '<option value="' + s[0] + '"' + (s[0] === cur ? ' selected' : '') + '>' + s[3] + '</option>'; }).join('');
    $('mcols').value = m.cols; $('mrows').value = m.rows;
    $('mname').value = m.name;
  }
  function renderSaved() {
    $('saved').innerHTML = S.saved.length ? '<span class="label">Saved maps</span>' + S.saved.map(function (s, i) {
      return '<span class="chip msv"><button type="button" class="ghost" data-load="' + i + '">' + esc(s.name) + '</button><button type="button" class="ghost danger" data-del="' + i + '" aria-label="Delete ' + esc(s.name) + '">x</button></span>';
    }).join('') : '';
  }
  function renderMap() {
    renderSize(); renderStage(); renderBar(); renderWarn(); renderSaved(); updateUsed();
    $('mzoom').value = Math.round(S.zoom * 100); $('msnap').value = String(S.snap); $('mgridchk').checked = S.grid;
  }
  function renderAll() { renderBoxes(); renderPalette(); renderMap(); }
  function toast(t) {
    var el = $('toast'); el.textContent = t; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 2200);
  }

  /* ---------- actions ---------- */
  function freeBoardSlot(w, h) {
    var m = S.map, bd = m.items.filter(function (i) { return P[i.k].kind === 'board'; });
    for (var y = 0; y < 6; y++) for (var x = 0; x < 6; x++) {
      var t = { k: bd.length ? bd[0].k : null, x: x * 7, y: y * 7, r: 0 };
      var hit = bd.some(function (b) { var d = dims(b); return t.x < b.x + d.w - 0.01 && t.x + w > b.x + 0.01 && t.y < b.y + d.h - 0.01 && t.y + h > b.y + 0.01; });
      if (!hit) return { x: x * 7, y: y * 7 };
    }
    return { x: 0, y: 0 };
  }
  function addPiece(key, at) {
    var p = P[key]; if (!p) return;
    mut(function () {
      var m = S.map, x, y;
      if (at) { x = sn(at.x - p.w / 2); y = sn(at.y - p.h / 2); }
      else if (p.kind === 'board') { var f = freeBoardSlot(p.w, p.h); x = f.x; y = f.y; m.cols = Math.max(m.cols, x + p.w); m.rows = Math.max(m.rows, y + p.h); }
      else {
        var st = $('stage'), z = CELL * S.zoom;
        x = sn((st.scrollLeft + st.clientWidth / 2) / z - p.w / 2); y = sn((st.scrollTop + st.clientHeight / 2) / z - p.h / 2);
        var tries = 0;
        while (tries < 12 && m.items.some(function (i) { return i.k !== key && Math.abs(i.x - x) < 0.01 && Math.abs(i.y - y) < 0.01; })) { x += 0.5; y += 0.5; tries++; }
      }
      var it = { u: S.uid++, k: key, s: 'a', x: x, y: y, r: 0 };
      m.items.push(it); clamp(it); S.sel = it.u;
    });
    if (!at && window.matchMedia('(max-width:899px)').matches) { setTab('map'); toast(p.name + ' added'); }
  }
  function act(a) {
    var it = selItem(); if (!it) return;
    if (a === 'del') { mut(function () { S.map.items = S.map.items.filter(function (i) { return i !== it; }); S.sel = null; }); return; }
    if (a === 'dup') {
      mut(function () { var c = { u: S.uid++, k: it.k, s: it.s, x: it.x + 1, y: it.y + 1, r: it.r }; S.map.items.push(c); clamp(c); S.sel = c.u; }); return;
    }
    if (a === 'front' || a === 'back') {
      mut(function () {
        S.map.items = S.map.items.filter(function (i) { return i !== it; });
        if (a === 'front') S.map.items.push(it); else S.map.items.unshift(it);
      }); return;
    }
    if (a === 'flip') { if (!P[it.k].b) return; mut(function () { it.s = it.s === 'a' ? 'b' : 'a'; }, true); return; }
    if (a === 'rl' || a === 'rr') {
      mut(function () {
        var d = dims(it), cx = it.x + d.w / 2, cy = it.y + d.h / 2;
        it.r = (it.r + (a === 'rr' ? 1 : 3)) % 4;
        var n = dims(it); it.x = cx - n.w / 2; it.y = cy - n.h / 2;
        it.x = sn(it.x); it.y = sn(it.y); clamp(it);
      }, true);
    }
  }
  function nudge(dx, dy) {
    var it = selItem(); if (!it) return;
    var st = S.snap || 0.05;
    mut(function () { it.x = sn(it.x + dx * st); it.y = sn(it.y + dy * st); clamp(it); }, true);
  }
  function setSize(c, r) {
    c = Math.min(42, Math.max(2, Math.round(+c || S.map.cols))); r = Math.min(42, Math.max(2, Math.round(+r || S.map.rows)));
    if (c === S.map.cols && r === S.map.rows) { renderSize(); return; }
    mut(function () { S.map.cols = c; S.map.rows = r; S.map.items.forEach(function (i) { clamp(i); }); });
  }
  function setZoom(z, keep) {
    var st = $('stage'), sq = px(1), cx = (st.scrollLeft + st.clientWidth / 2) / sq, cy = (st.scrollTop + st.clientHeight / 2) / sq;
    S.zoom = Math.min(1.2, Math.max(0.15, Math.round(z * 100) / 100));
    S.zoomSet = true;
    renderStage(); $('mzoom').value = Math.round(S.zoom * 100);
    if (keep) { st.scrollLeft = cx * px(1) - st.clientWidth / 2; st.scrollTop = cy * px(1) - st.clientHeight / 2; }
    lsPut({ zoom: S.zoom });
  }
  function fit() {
    var st = $('stage'), w = st.clientWidth - 18;
    if (w < 80) return;
    S.zoomSet = true;
    var z = Math.min(1.2, Math.max(0.15, w / (S.map.cols * CELL)));
    S.zoom = Math.floor(z * 100) / 100; renderStage(); $('mzoom').value = Math.round(S.zoom * 100); lsPut({ zoom: S.zoom });
  }
  function setTab(t) { S.tab = t; document.body.setAttribute('data-tab', t); Array.prototype.forEach.call(document.querySelectorAll('.mtabs button'), function (b) { b.classList.toggle('on', b.dataset.tab === t); }); if (t === 'map' && !S.zoomSet) fit(); }

  /* ---------- save, share, export ---------- */
  function b64(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function unb64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); }
  function encode() {
    var m = S.map;
    return b64(JSON.stringify({ v: 1, n: m.name, c: m.cols, r: m.rows, i: m.items.map(function (i) { return [i.k, i.s === 'b' ? 1 : 0, i.x, i.y, i.r]; }) }));
  }
  function decode(str) {
    var j = JSON.parse(unb64(str));
    return clean({ name: j.n, cols: j.c, rows: j.r, items: (j.i || []).map(function (a) { return { k: a[0], s: a[1] ? 'b' : 'a', x: a[2], y: a[3], r: a[4] }; }) });
  }
  function shareUrl() { return location.href.split('#')[0] + '#m=' + encode(); }
  function save() {
    var name = ($('mname').value || '').trim() || 'Untitled map ' + (S.saved.length + 1);
    S.map.name = name; $('mname').value = name;
    var rec = { name: name, map: strip(S.map) }, idx = -1;
    S.saved.forEach(function (s, i) { if (s.name === name) idx = i; });
    if (idx >= 0) S.saved[idx] = rec; else S.saved.push(rec);
    lsPut({ saved: S.saved }); autosave(); renderSaved(); toast('Saved as ' + name);
  }
  var imgCache = {};
  function loadImg(src) {
    if (imgCache[src]) return imgCache[src];
    imgCache[src] = new Promise(function (ok, bad) { var im = new Image(); im.onload = function () { ok(im); }; im.onerror = bad; im.src = src; });
    return imgCache[src];
  }
  function draw(sq, type) {
    var m = S.map, W = Math.round(m.cols * sq), H = Math.round(m.rows * sq), items = ordered();
    return Promise.all(items.map(function (it) { var p = P[it.k]; return loadImg(p.dir + (it.s === 'b' && p.b ? p.b : p.a)); })).then(function (ims) {
      var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      var c = cv.getContext('2d'); c.fillStyle = '#2b2f2a'; c.fillRect(0, 0, W, H);
      items.forEach(function (it, i) {
        var p = P[it.k], d = dims(it);
        c.save(); c.translate((it.x + d.w / 2) * sq, (it.y + d.h / 2) * sq); c.rotate(it.r * Math.PI / 2);
        c.drawImage(ims[i], -p.w * sq / 2, -p.h * sq / 2, p.w * sq, p.h * sq); c.restore();
      });
      return cv;
    });
  }
  function exportScale(maxPx) { return Math.min(CELL, maxPx / Math.max(S.map.cols, S.map.rows)); }
  function png() {
    if (!S.map.items.length) { toast('Add a piece first'); return; }
    draw(exportScale(5000)).then(function (cv) {
      cv.toBlob(function (bl) {
        if (!bl) { toast('Could not make the picture'); return; }
        var a = document.createElement('a'); a.href = URL.createObjectURL(bl);
        a.download = (slug(S.map.name) || 'hts-map') + '.png'; document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      }, 'image/png');
    }).catch(function () { toast('Could not make the picture. Open the site from its web address, not from a file.'); });
  }
  function printMap() {
    if (!S.map.items.length) { toast('Add a piece first'); return; }
    draw(exportScale(2400)).then(function (cv) {
      var im = $('printimg'); im.onload = function () { window.print(); }; im.src = cv.toDataURL('image/jpeg', 0.9);
    }).catch(function () { toast('Could not prepare the print. Open the site from its web address.'); });
  }

  /* ---------- viewer ---------- */
  function openView(key) {
    var p = P[key]; if (!p) return;
    S.viewKey = key;
    $('mmTitle').textContent = p.name;
    var sides = '<figure><img src="' + p.dir + p.a + '" alt="' + esc(p.name) + ' side A"><figcaption>Side A</figcaption></figure>' +
      (p.b ? '<figure><img src="' + p.dir + p.b + '" alt="' + esc(p.name) + ' side B"><figcaption>Side B</figcaption></figure>' : '');
    $('mmBody').innerHTML = '<div class="mfig' + (p.b ? ' two' : '') + '">' + sides + '</div><p class="mhelp">' + sizeText(p) + '. ' + (p.sd ? esc(p.sd) + ' ' : '') + esc(p.cats.join(', ')) + ', ' + esc(realBox(p.box).name) + '.' + (p.b ? '' : ' One printed side only.') + '</p>';
    $('mmodal').hidden = false; $('mmClose').focus();
  }
  function closeView() { $('mmodal').hidden = true; S.viewKey = null; }

  /* ---------- events ---------- */
  var drag = null;
  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; S.g = 'all'; lsPut({ b: S.b }); renderBoxes(); renderPalette(); return; }
      if ((el = t.closest('[data-group]'))) { S.g = el.dataset.group; renderPalette(); return; }
      if ((el = t.closest('[data-add]'))) { addPiece(el.dataset.add); return; }
      if ((el = t.closest('[data-view]'))) { openView(el.dataset.view); return; }
      if ((el = t.closest('[data-act]'))) { act(el.dataset.act); return; }
      if ((el = t.closest('[data-load]'))) {
        var s = S.saved[+el.dataset.load]; if (!s) return;
        push(); S.map = clean(s.map); S.sel = null; renderMap(); autosave(); fit(); return;
      }
      if ((el = t.closest('[data-del]'))) { S.saved.splice(+el.dataset.del, 1); lsPut({ saved: S.saved }); renderSaved(); return; }
      if ((el = t.closest('.mtabs [data-tab]'))) { setTab(el.dataset.tab); return; }
      if (t === $('mmodal')) closeView();
    });
    $('mmClose').onclick = closeView;
    $('mmAdd').onclick = function () { var k = S.viewKey; closeView(); if (k) addPiece(k); };
    var timer;
    $('q').oninput = function () { S.q = this.value; clearTimeout(timer); timer = setTimeout(renderPalette, 120); };
    $('btnTheme').onclick = function () {
      S.theme = S.theme === 'dark' ? 'light' : 'dark'; lsPut({ theme: S.theme });
      document.documentElement.setAttribute('data-theme', S.theme); $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    };
    $('bUndo').onclick = undo; $('bRedo').onclick = redo;
    $('msize').onchange = function () {
      var s = SIZES.filter(function (x) { return x[0] === this.value; }.bind(this))[0];
      if (s && s[1]) setSize(s[1], s[2]); else { $('mcols').focus(); }
    };
    $('mcols').onchange = $('mrows').onchange = function () { setSize($('mcols').value, $('mrows').value); };
    $('mname').oninput = function () { S.map.name = this.value; autosave(); };
    $('msnap').onchange = function () { S.snap = +this.value; lsPut({ snap: S.snap }); };
    $('mgridchk').onchange = function () { S.grid = this.checked; planeSize(); lsPut({ grid: S.grid }); };
    $('mzoom').oninput = function () { setZoom(+this.value / 100, true); };
    $('zIn').onclick = function () { setZoom(S.zoom + 0.05, true); };
    $('zOut').onclick = function () { setZoom(S.zoom - 0.05, true); };
    $('zFit').onclick = fit;
    $('bSave').onclick = save;
    $('bPng').onclick = png; $('bPrint').onclick = printMap;
    $('bNew').onclick = function () {
      if (!S.map.items.length) return;
      if (!window.confirm('Clear the map? You can undo this.')) return;
      mut(function () { S.map.items = []; S.sel = null; });
    };
    $('bShare').onclick = function () {
      var url = shareUrl(), b = $('sharebox'), inp = $('shareurl');
      b.hidden = false; inp.value = url; inp.focus(); inp.select();
      try { if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); }, function () { /* manual copy */ }); } catch (e) { /* ignore */ }
    };
    $('shareurl').onfocus = function () { this.select(); };

    var plane = $('plane'), stage = $('stage');
    plane.addEventListener('pointerdown', function (e) {
      var el = e.target.closest('.mp');
      if (!el) { setSel(null); return; }
      var it = find(+el.dataset.u); if (!it) return;
      setSel(it.u);
      if (e.button > 0) return;
      var r = plane.getBoundingClientRect(), z = CELL * S.zoom;
      drag = { it: it, el: el, ox: (e.clientX - r.left) / z - it.x, oy: (e.clientY - r.top) / z - it.y, moved: false, id: e.pointerId };
      try { el.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      e.preventDefault();
    });
    plane.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var r = plane.getBoundingClientRect(), z = CELL * S.zoom, it = drag.it;
      var nx = sn((e.clientX - r.left) / z - drag.ox), ny = sn((e.clientY - r.top) / z - drag.oy);
      var d = dims(it); nx = Math.max(0, Math.min(nx, Math.max(0, S.map.cols - d.w))); ny = Math.max(0, Math.min(ny, Math.max(0, S.map.rows - d.h)));
      if (nx === it.x && ny === it.y) return;
      if (!drag.moved) { push(); drag.moved = true; }
      it.x = nx; it.y = ny; drag.el.style.left = px(nx) + 'px'; drag.el.style.top = px(ny) + 'px';
      var rect = stage.getBoundingClientRect(), edge = 36;
      if (e.clientX > rect.right - edge) stage.scrollLeft += 14; else if (e.clientX < rect.left + edge) stage.scrollLeft -= 14;
      if (e.clientY > rect.bottom - edge) stage.scrollTop += 14; else if (e.clientY < rect.top + edge) stage.scrollTop -= 14;
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      var moved = drag.moved; drag = null;
      if (moved) { renderBar(); renderWarn(); autosave(); }
    }
    plane.addEventListener('pointerup', endDrag); plane.addEventListener('pointercancel', endDrag);
    plane.addEventListener('focusin', function (e) { var el = e.target.closest('.mp'); if (el && S.sel !== +el.dataset.u) setSel(+el.dataset.u); });
    plane.addEventListener('dblclick', function (e) { if (e.target.closest('.mp')) act('flip'); });
    plane.addEventListener('dragover', function (e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types, 'text/x-hts-piece') >= 0) e.preventDefault(); });
    plane.addEventListener('drop', function (e) {
      var k = e.dataTransfer && e.dataTransfer.getData('text/x-hts-piece'); if (!k || !P[k]) return;
      e.preventDefault();
      var r = plane.getBoundingClientRect(), z = CELL * S.zoom;
      addPiece(k, { x: (e.clientX - r.left) / z, y: (e.clientY - r.top) / z });
    });
    $('pieces').addEventListener('dragstart', function (e) {
      var c = e.target.closest('.mcard'); if (!c) return;
      e.dataTransfer.setData('text/x-hts-piece', c.dataset.key); e.dataTransfer.setData('text/plain', c.dataset.key); e.dataTransfer.effectAllowed = 'copy';
    });
    stage.addEventListener('wheel', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault(); setZoom(S.zoom + (e.deltaY < 0 ? 0.05 : -0.05), true);
    }, { passive: false });
    document.addEventListener('keydown', function (e) {
      if (!$('mmodal').hidden) { if (e.key === 'Escape') closeView(); return; }
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
      var mod = e.ctrlKey || e.metaKey, k = e.key;
      if (mod && (k === 'z' || k === 'Z')) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
      if (mod && (k === 'y' || k === 'Y')) { e.preventDefault(); redo(); return; }
      if (mod || e.altKey) return;
      if (!selItem()) return;
      if (k === 'ArrowLeft') { e.preventDefault(); nudge(-1, 0); }
      else if (k === 'ArrowRight') { e.preventDefault(); nudge(1, 0); }
      else if (k === 'ArrowUp') { e.preventDefault(); nudge(0, -1); }
      else if (k === 'ArrowDown') { e.preventDefault(); nudge(0, 1); }
      else if (k === 'r') act('rr'); else if (k === 'R') act('rl');
      else if (k === 'f' || k === 'F') act('flip');
      else if (k === 'd' || k === 'D') act('dup');
      else if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); act('del'); }
      else if (k === 'Escape') setSel(null);
    });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (!S.zoomSet && S.tab === 'map') fit(); }, 150); });
    window.addEventListener('hashchange', function () { loadHash(true); });
  }

  function loadHash(fromEvent) {
    var m = /[#&]m=([A-Za-z0-9_-]+)/.exec(location.hash);
    if (!m) return false;
    try {
      var map = decode(m[1]);
      if (fromEvent || S.map.items.length) push();
      S.map = map; S.sel = null; renderMap(); autosave(); fit();
      toast('Shared map loaded');
      return true;
    } catch (e) { toast('That map link could not be read'); return false; }
  }

  function init() {
    var j = lsGet();
    if (j.theme) S.theme = j.theme;
    if (typeof j.zoom === 'number') { S.zoom = Math.min(1.2, Math.max(0.15, j.zoom)); S.zoomSet = true; }
    if (j.snap === 0 || j.snap === 0.5 || j.snap === 1) S.snap = j.snap;
    if (typeof j.grid === 'boolean') S.grid = j.grid;
    if (j.b && box(j.b)) S.b = j.b;
    if (Array.isArray(j.saved)) S.saved = j.saved.filter(function (s) { return s && s.name && s.map; });
    if (j.work) S.map = clean(j.work);
    var p = new URLSearchParams(location.search);
    if (box(p.get('b'))) S.b = p.get('b');
    if (p.get('q')) S.q = p.get('q');
    var d = box(S.b);
    if (p.get('g') && d.groups.indexOf(p.get('g')) >= 0) S.g = p.get('g');
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    $('q').value = S.q;
    bind();
    setTab(window.matchMedia('(max-width:899px)').matches && !S.map.items.length ? 'pieces' : 'map');
    renderAll();
    if (!loadHash(false) && !S.zoomSet) fit();
  }
  init();
  window.HTS_MAPS_UI = { state: S, add: addPiece, undo: undo, redo: redo, warnings: warnings, encode: encode };
})();
