(function () {
  'use strict';
  /* "My collection": which boxes, expansions and promos the player owns.
     Stored on this device only and shared by every page. Pages ask owns(code) or ownsAll(codes).
     Nothing ticked means the filter is off and everything shows. */
  var KEY = 'hts.hon.own.v1';
  var GROUPS = [
    { name: 'HoN: Big Red One', items: [
      { code: 'CB', name: 'Heroes of Normandie: Big Red One', note: 'The core box. US and German tiles.' },
      { code: 'BO', name: 'Heroes of Normandie: Bloody Omaha', note: 'US and German tiles for the Omaha landings.' }
    ] },
    { name: 'Battle for Caen', items: [
      { code: 'ECG', name: 'Battle for Caen: Epsom, Charnwood & Goodwood', note: 'Adds the Commonwealth and new German tiles.' },
      { code: 'BP3', name: 'Battle Pack #3: Windsor & Jupiter', note: 'Expansion for Battle for Caen.' }
    ] },
    { name: 'Heroes of Stalingrad', items: [
      { code: 'HoS-CB', name: 'Heroes of Stalingrad: Core Set', note: 'Red Army and German tiles and options.' },
      { code: 'HoS-BP', name: 'Heroes of Stalingrad: Battle Pack', note: 'Shturmovye Gruppy, Papa Koulikov and the German Panzergrenadiere III and Aufklärungsabteilung 40.' },
      { code: 'HoS-KS', name: 'Heroes of Stalingrad: Duel of Snipers', note: 'Zaytsev, König, aircraft and options.' },
      { code: 'HoS-HP', name: 'Heroes of Stalingrad: Heroic Platoons', note: 'Sasha and the Beasts, and Die Geisterabteilung.' }
    ] },
    { name: 'Promos', items: [
      { code: 'KS-9', name: 'Promo KS-9', note: 'Private Smithy (Smashing Pumpkins) and a Grenade.' },
      { code: 'SOLO', name: 'Promo SOLO', note: 'Luke Griff Brassert and a Sticky Bomb.' },
      { code: 'WS#0', name: 'Promo WS#0', note: 'Don "Wardaddy" Collier (Fury tank), SS Panzergrenadiere III. Bataillon and six German options.' },
      { code: 'P500', name: 'Promo P500', note: 'Recon Platoon 2e DB, Training and Guardian.' }
    ] }
  ];
  (window.HTS_PRODUCTS || []).forEach(function (g) { GROUPS.push(g); });
  var ALL = [];
  GROUPS.forEach(function (g) { g.items.forEach(function (i) { ALL.push(i); }); });
  var KNOWN = {};
  ALL.forEach(function (i) { KNOWN[i.code] = i; });

  var st = { own: {}, only: true };
  try {
    var j = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (j && j.own) { st.own = j.own; st.only = j.only !== false; }
  } catch (e) { /* storage can be blocked */ }
  var listeners = [];

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* ignore */ }
    listeners.forEach(function (f) { f(); });
  }
  function count() { return ALL.filter(function (i) { return st.own[i.code]; }).length; }
  /* The filter is on only when something is ticked and "only" is on. */
  function active() { return st.only && count() > 0; }
  function owns(code) { return !active() || !KNOWN[code] || !!st.own[code]; }
  /* True when every product in the list is owned. Unknown codes are ignored, and an empty list is true. */
  function ownsAll(codes) { return !active() || (codes || []).every(function (c) { return !KNOWN[c] || !!st.own[c]; }); }
  function missing(codes) { return (codes || []).filter(function (c) { return KNOWN[c] && !st.own[c]; }); }
  function setOnly(v) { st.only = !!v; save(); updateLabel(); }
  /* Short note for list pages: how many items the filter hides, with a way to switch it off or change it. */
  function note(hidden, what) {
    if (!active() || !hidden) return '';
    return '<p class="ownnote" role="status">' + hidden + ' ' + esc(what) + (hidden === 1 ? ' is' : ' are') + ' hidden because of My collection. ' +
      '<button type="button" class="linkish" data-own-off>Show everything</button> <button type="button" class="linkish" data-own-open>Change my collection</button></p>';
  }
  function label() { return count() ? count() + ' of ' + ALL.length + ' owned' + (st.only ? '' : ', filter off') : 'Not set, showing everything'; }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function stats(code) {
    var out = [];
    [['us', 'US'], ['ge', 'German'], ['uk', 'Commonwealth']].forEach(function (n) {
      var d = window.HTS_DATA && window.HTS_DATA['hon-bro-' + n[0]];
      if (!d) return;
      var t = d.tiles.filter(function (x) { return x.set === code; }).length;
      var o = d.options.filter(function (x) { return x.set === code; }).length;
      if (t || o) out.push(n[1] + ': ' + t + ' tile' + (t === 1 ? '' : 's') + ', ' + o + ' option' + (o === 1 ? '' : 's'));
    });
    return out.join('. ');
  }

  function render(root) {
    /* Groups start collapsed. A re-render (Tick all, Clear) keeps the groups the person had open. */
    var wasOpen = {};
    Array.prototype.forEach.call(root.querySelectorAll('details.ownsec[open]'), function (d) { wasOpen[d.getAttribute('data-g')] = true; });
    var h = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ownTitle"><header><div><h3 id="ownTitle">My collection</h3>' +
      '<p class="meta">Tick what you own. Every page that lists scenarios, boards, units and heroes then hides what you cannot use. Saved on this device only.</p></div>' +
      '<button id="ownClose" class="ghost" type="button">Done</button></header>' +
      '<div class="pick-tools"><label class="check"><input id="ownOnly" type="checkbox"' + (st.only ? ' checked' : '') + '> Only show what I own</label>' +
      '<span class="lrow-btns"><button id="ownAll" class="ghost" type="button">Tick all</button><button id="ownNone" class="ghost" type="button">Clear</button></span></div>';
    GROUPS.forEach(function (g) {
      var n = g.items.filter(function (i) { return st.own[i.code]; }).length;
      h += '<details class="ownsec" data-g="' + esc(g.name) + '"' + (wasOpen[g.name] ? ' open' : '') + '><summary class="pick-group">' + esc(g.name) + ' <span class="count">' + n + ' of ' + g.items.length + '</span></summary><div class="ownlist">';
      g.items.forEach(function (i) {
        h += '<label class="ownrow"><input type="checkbox" data-own="' + esc(i.code) + '"' + (st.own[i.code] ? ' checked' : '') + '>' +
          '<span><strong>' + esc(i.name) + '</strong><small>' + esc(i.note) + (stats(i.code) ? ' ' + esc(stats(i.code)) + '.' : '') + '</small></span></label>';
      });
      h += '</div></details>';
    });
    h += '<p class="count">Nothing ticked means the filter is off and every tile shows. Armies you already built or loaded keep their tiles, with a note if you do not own them.</p></div>';
    root.innerHTML = h;
  }

  function open() {
    var root = document.getElementById('own');
    if (!root) return;
    render(root); root.hidden = false;
    root.onclick = function (ev) { if (ev.target === root) close(); };
  }
  function close() { var r = document.getElementById('own'); if (r) r.hidden = true; }

  document.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.matches && t.matches('[data-own]')) { st.own[t.dataset.own] = t.checked; save(); updateLabel(); }
    else if (t.id === 'ownOnly') { st.only = t.checked; save(); updateLabel(); }
  });
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest && ev.target.closest('button');
    if (!el) return;
    if (el.id === 'btnOwn') open();
    else if (el.hasAttribute('data-own-off')) setOnly(false);
    else if (el.hasAttribute('data-own-open')) open();
    else if (el.id === 'ownClose') close();
    else if (el.id === 'ownAll' || el.id === 'ownNone') {
      ALL.forEach(function (i) { st.own[i.code] = el.id === 'ownAll'; });
      save(); render(document.getElementById('own')); updateLabel();
    }
  });
  function updateLabel() {
    var l = document.getElementById('ownState'); if (l) l.textContent = label();
    var b = document.getElementById('btnOwn');
    if (b && b.dataset.auto) b.textContent = 'My collection' + (count() ? (st.only ? ' (' + count() + ')' : ' (off)') : '');
  }
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') close(); });

  function mount() {
    if (!document.getElementById('own')) {
      var o = document.createElement('div'); o.id = 'own'; o.className = 'overlay'; o.hidden = true; document.body.appendChild(o);
    }
    if (!document.getElementById('btnOwn')) {
      var bar = document.querySelector('.top-actions'), th = document.getElementById('btnTheme');
      if (bar) {
        var b = document.createElement('button'); b.id = 'btnOwn'; b.type = 'button'; b.className = 'ghost'; b.dataset.auto = '1';
        b.setAttribute('aria-haspopup', 'dialog'); b.title = 'Choose which boxes and expansions you own. Pages then hide what you cannot use.';
        bar.insertBefore(b, th || null);
      }
    }
    updateLabel();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  window.HTS_OWN = {
    products: ALL, owns: owns, ownsAll: ownsAll, missing: missing, active: active, note: note, setOnly: setOnly, label: label, open: open, close: close,
    name: function (code) { return KNOWN[code] ? KNOWN[code].name : code; },
    onChange: function (f) { listeners.push(f); updateLabel(); }
  };
})();
