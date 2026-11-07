(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'all', name: 'All boxes' }, { id: 'bro', name: 'Big Red One' }, { id: 'omaha', name: 'Bloody Omaha' }];
  var S = { b: 'all', q: '', g: 'all', theme: 'light' };
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
  function markFn(toks) {
    if (!toks.length) return esc;
    var re = new RegExp('(' + toks.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return function (s) { return esc(s).replace(re, '<mark>$1</mark>'); };
  }

  function data() {
    if (cache[S.b]) return cache[S.b];
    var ids = S.b === 'all' ? ['bro', 'omaha'] : [S.b], entries = [], groups = [];
    ids.forEach(function (id) {
      var d = window.HTS_ICONS['hon-' + id];
      d.groups.forEach(function (g) { if (groups.indexOf(g) < 0) groups.push(g); });
      d.entries.forEach(function (e) {
        var c = { e: e, box: id, boxName: d.name };
        c.head = norm(e.name);
        c.hay = norm(e.name + ' ' + e.group + ' ' + e.text + ' ' + d.name);
        entries.push(c);
      });
    });
    cache[S.b] = { entries: entries, groups: groups };
    return cache[S.b];
  }

  function controls(d) {
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="' + (S.b === b.id ? 'on' : '') + '" aria-pressed="' + (S.b === b.id) + '">' + b.name + '</button>';
    }).join('');
    $('groups').innerHTML = '<button type="button" class="chip' + (S.g === 'all' ? ' on' : '') + '" data-group="all">All</button>' +
      d.groups.map(function (c) { return '<button type="button" class="chip' + (S.g === c ? ' on' : '') + '" data-group="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $('q').value = S.q;
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function card(x, mk) {
    var e = x.e;
    return '<article class="gcard" id="' + esc(e.id) + '"><div class="gicons">' + e.icons.map(function (i) {
      return '<img src="' + esc(i.img) + '" alt="' + esc(e.name + ' icon') + '" width="' + i.w + '" height="' + i.h + '" loading="lazy">';
    }).join('') + '</div><div class="gtext"><h3>' + mk(e.name) + '</h3>' +
      '<p class="gmeta"><span class="rbadge">' + esc(e.group) + '</span> ' + (S.b === 'all' ? '<span class="gbox">' + esc(x.boxName) + '</span> ' : '') + '<span class="gpg">Rulebook p.' + esc(e.page) + '</span></p>' +
      '<p>' + mk(e.text) + '</p>' +
      '<p class="hfind"><a href="rules.html?b=' + x.box + '&amp;q=' + encodeURIComponent(e.name) + '">Find in the rules</a></p></div></article>';
  }

  function render() {
    var d = data(), toks = tokens(S.q), mk = markFn(toks), res = [];
    controls(d);
    d.entries.forEach(function (x, i) {
      if (S.g !== 'all' && x.e.group !== S.g) return;
      var score = 0;
      if (toks.length) {
        var padded = ' ' + x.hay + ' ', hp = ' ' + x.head + ' ';
        if (!toks.every(function (t) { return hit(x.hay, padded, t); })) return;
        toks.forEach(function (t) { score += countOf(x.hay, t) + (hit(x.head, hp, t) ? 20 : 0); });
      }
      res.push({ x: x, score: score, i: i });
    });
    if (toks.length) res.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
    if (!res.length) {
      $('out').innerHTML = '<p class="empty2">No icon matches. Try fewer or simpler words, or clear the filter.</p>';
      $('stat').textContent = '0 icons.';
    } else {
      $('out').innerHTML = '<div class="ggrid">' + res.map(function (r) { return card(r.x, mk); }).join('') + '</div>';
      $('stat').textContent = res.length + ' of ' + d.entries.length + ' entries' + (toks.length ? ', best match first' : '') + '.';
    }
    url();
  }

  function url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b);
      if (S.q) p.set('q', S.q); if (S.g !== 'all') p.set('g', S.g);
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-box]'))) { S.b = el.dataset.box; S.g = 'all'; render(); return; }
      if ((el = t.closest('[data-group]'))) { S.g = el.dataset.group; render(); }
    });
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
    var d = data();
    if (p.get('g') && d.groups.indexOf(p.get('g')) >= 0) S.g = p.get('g');
    bind(); render();
  }
  init();
  window.HTS_ICONS_UI = { state: S, data: data };
})();
