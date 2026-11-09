(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var BOXES = [{ id: 'bro', name: 'Big Red One' }];
  var SIDES = [{ id: 'all', name: 'Both' }, { id: 'us', name: 'US' }, { id: 'ge', name: 'German' }];
  var SIDENAME = { us: 'United States', ge: 'Germany' };
  var S = { b: 'bro', side: 'all', q: '', ph: 'all', theme: 'light' };
  var shown = [], cur = -1, zoomed = false;

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

  var D = window.HTS_CARDS['hon-' + S.b];
  D.entries.forEach(function (e) {
    e.head = norm(e.name);
    e.hay = norm(e.name + ' ' + e.phase + ' ' + e.when + ' ' + e.text + ' ' + (SIDENAME[e.nation] || ''));
  });

  function renderControls() {
    $('boxes').innerHTML = BOXES.map(function (b) {
      return '<button type="button" data-box="' + b.id + '" class="on" aria-pressed="true">' + b.name + '</button>';
    }).join('');
    $('sides').innerHTML = SIDES.map(function (s) {
      return '<button type="button" data-side="' + s.id + '" class="' + (S.side === s.id ? 'on' : '') + '" aria-pressed="' + (S.side === s.id) + '">' + s.name + '</button>';
    }).join('');
    $('phases').innerHTML = '<button type="button" class="chip' + (S.ph === 'all' ? ' on' : '') + '" data-phase="all">All</button>' +
      D.phases.map(function (c) { return '<button type="button" class="chip' + (S.ph === c ? ' on' : '') + '" data-phase="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $('q').value = S.q;
    $('srcnote').textContent = 'Card text is typed from the ' + D.source + '.';
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
  }

  function tile(e, i, mk) {
    return '<button type="button" class="ccard" data-open="' + i + '" aria-label="Open ' + esc(e.name) + ', ' + esc(SIDENAME[e.nation]) + '">' +
      '<img src="' + esc(e.thumb) + '" alt="' + esc(e.name + ', ' + SIDENAME[e.nation] + ' card') + '" width="240" height="364" loading="lazy">' +
      '<span class="cn">' + mk(e.name) + '</span>' +
      '<span class="cm">' + (e.copies > 1 ? e.copies + ' copies' : '1 copy') + ' &middot; ' + esc(e.phase) + '</span>' +
      '<span class="cw">' + mk(e.when) + ' ' + mk(e.text) + '</span></button>';
  }

  function render() {
    renderControls();
    var toks = tokens(S.q), mk = markFn(toks), res = [];
    D.entries.forEach(function (e, i) {
      if (S.side !== 'all' && e.nation !== S.side) return;
      if (S.ph !== 'all' && e.phase !== S.ph) return;
      var score = 0;
      if (toks.length) {
        var padded = ' ' + e.hay + ' ', hp = ' ' + e.head + ' ';
        if (!toks.every(function (t) { return hit(e.hay, padded, t); })) return;
        toks.forEach(function (t) { score += countOf(e.hay, t) + (hit(e.head, hp, t) ? 20 : 0); });
      }
      res.push({ e: e, score: score, i: i });
    });
    if (toks.length) res.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
    shown = res.map(function (x) { return x.e; });
    if (!shown.length) {
      $('out').innerHTML = '<p class="empty2">Nothing matches. Try fewer or simpler words, or clear the filter.</p>';
      $('stat').textContent = '0 cards.';
    } else {
      var html = '', last = '';
      shown.forEach(function (e, i) {
        if (!toks.length && S.side === 'all' && e.nation !== last) {
          if (last) html += '</div>';
          html += '<h2 class="cside">' + esc(SIDENAME[e.nation]) + '</h2><div class="cgrid">'; last = e.nation;
        }
        if (toks.length || S.side !== 'all') { if (!i) html += '<div class="cgrid">'; }
        html += tile(e, i, mk);
      });
      $('out').innerHTML = html + '</div>';
      var copies = shown.reduce(function (n, e) { return n + e.copies; }, 0);
      $('stat').textContent = shown.length + ' different cards (' + copies + ' in the box)' + (toks.length ? ', best match first' : '') + '. Click one for the full size picture.';
    }
    url();
  }

  function show(i) {
    if (!shown.length) return;
    cur = (i + shown.length) % shown.length;
    var e = shown[cur];
    $('lbxImg').src = e.img; $('lbxImg').alt = e.name + ', ' + SIDENAME[e.nation] + ' card';
    $('lbxCap').textContent = e.name + ', ' + SIDENAME[e.nation] + ', ' + e.copies + (e.copies > 1 ? ' copies' : ' copy') + ' (' + e.ref + ')';
    $('lbxDl').href = e.img; $('lbxDl').setAttribute('download', e.id + '.webp');
    $('lbxBody').scrollTop = 0;
  }
  function openBox(i) {
    zoomed = false; $('lbxBody').classList.remove('z'); $('lbxZoom').textContent = 'Zoom in';
    show(i); $('lbx').hidden = false; document.body.classList.add('lbxopen');
  }
  function closeBox() { $('lbx').hidden = true; document.body.classList.remove('lbxopen'); $('lbxImg').removeAttribute('src'); }

  function url() {
    try {
      var p = new URLSearchParams(); p.set('b', S.b);
      if (S.side !== 'all') p.set('s', S.side); if (S.q) p.set('q', S.q); if (S.ph !== 'all') p.set('p', S.ph);
      history.replaceState(null, '', location.pathname + '?' + p.toString());
    } catch (e) { /* ignore */ }
  }

  function bind() {
    document.addEventListener('click', function (ev) {
      var t = ev.target, el;
      if ((el = t.closest('[data-side]'))) { S.side = el.dataset.side; render(); return; }
      if ((el = t.closest('[data-phase]'))) { S.ph = el.dataset.phase; render(); return; }
      if ((el = t.closest('[data-open]'))) openBox(+el.dataset.open);
    });
    $('lbxClose').onclick = closeBox;
    $('lbxPrev').onclick = function () { show(cur - 1); };
    $('lbxNext').onclick = function () { show(cur + 1); };
    $('lbxZoom').onclick = function () { zoomed = !zoomed; $('lbxBody').classList.toggle('z', zoomed); this.textContent = zoomed ? 'Fit to screen' : 'Zoom in'; };
    document.addEventListener('keydown', function (ev) {
      if ($('lbx').hidden) return;
      if (ev.key === 'Escape') closeBox();
      else if (ev.key === 'ArrowLeft') show(cur - 1);
      else if (ev.key === 'ArrowRight') show(cur + 1);
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
    if (SIDES.some(function (s) { return s.id === p.get('s'); })) S.side = p.get('s');
    if (p.get('q')) S.q = p.get('q');
    if (D.phases.indexOf(p.get('p')) >= 0) S.ph = p.get('p');
    bind(); render();
  }
  init();
  window.HTS_CARDS_UI = { state: S };
})();
