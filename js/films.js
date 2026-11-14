(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var S = { f: 'all', q: '', theme: 'light' };
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function D() { return window.HTS_FILMS; }
  function imdb(it) { return it.imdb || 'https://www.imdb.com/find/?q=' + encodeURIComponent(it.t.replace(/ \(.*\)$/, '') + ' ' + it.y); }
  function hay(it) { return norm([it.t, it.y, it.kind, it.about, it.note].concat(it.links.map(function (l) { return l.l + ' ' + l.n; })).join(' ')); }

  function card(it) {
    var h = '<li class="dcard fcard" id="' + esc(it.id) + '">';
    h += '<h3 class="fh">' + esc(it.t) + ' <span class="fy">(' + it.y + ')</span></h3>';
    h += '<span class="dbadges"><span class="hb">' + esc(it.kind) + '</span><span class="hb">' + it.links.length + (it.links.length === 1 ? ' link' : ' links') + ' to the game</span></span>';
    h += '<p class="fabout">' + esc(it.about) + '</p>';
    if (it.note) h += '<p class="hsnip">' + esc(it.note) + '</p>';
    h += '<details class="flinks" open><summary>In the game</summary><ul>' + it.links.map(function (l) {
      return '<li><a href="' + esc(l.href) + '">' + esc(l.l) + '</a> <span class="hsnip">' + esc(l.n) + '</span></li>';
    }).join('') + '</ul></details>';
    h += '<p class="hsrc"><a href="' + esc(imdb(it)) + '" rel="noopener" target="_blank">' + esc(it.t.replace(/ \(.*\)$/, '')) + ' on IMDb</a></p>';
    return h + '</li>';
  }

  function results() {
    var toks = norm(S.q).split(' ').filter(Boolean), h = '', total = 0;
    D().fronts.forEach(function (fr) {
      if (S.f !== 'all' && S.f !== fr.id) return;
      var items = fr.items.filter(function (it) { var x = hay(it); return toks.every(function (k) { return x.indexOf(k) >= 0; }); });
      if (!items.length) return;
      total += items.length;
      h += '<section class="ffront"><h2 id="' + fr.id + '">' + esc(fr.title) + ' <span class="hsnip">' + esc(fr.game) + '</span></h2>';
      if (!toks.length) h += '<p class="htext">' + esc(fr.intro) + '</p>';
      h += '<ul class="slist2">' + items.map(card).join('') + '</ul></section>';
    });
    $('fstat').textContent = total + (total === 1 ? ' film or series' : ' films and series') + (S.q ? ' match "' + S.q + '"' : '');
    $('fout').innerHTML = h || '<p class="htext">Nothing matches. Try a character, a tank or a battle.</p>';
    try { var p = new URLSearchParams(); if (S.f !== 'all') p.set('f', S.f); if (S.q) p.set('q', S.q); history.replaceState(null, '', 'films.html' + (p.toString() ? '?' + p : '') + location.hash); } catch (e) { /* ignore */ }
  }

  function render() {
    var d = D(), n = 0;
    d.fronts.forEach(function (fr) { n += fr.items.length; });
    var h = '<h1 class="stitle">Films and TV</h1><p class="htext">' + esc(d.intro) + '</p>';
    h += '<div class="field"><label class="label" for="fq">Search films, characters and game links</label><input id="fq" type="search" placeholder="Try: Oddball, sniper, T-34, Omaha" autocomplete="off" value="' + esc(S.q) + '"></div>';
    h += '<div class="chips" id="fchips" role="group" aria-label="Front"><button type="button" class="chip' + (S.f === 'all' ? ' on' : '') + '" data-f="all">All ' + n + '</button>' + d.fronts.map(function (fr) {
      return '<button type="button" class="chip' + (S.f === fr.id ? ' on' : '') + '" data-f="' + fr.id + '">' + esc(fr.title) + ' ' + fr.items.length + '</button>';
    }).join('') + '</div><p class="hsrc" id="fstat"></p><div id="fout"></div>';
    $('out').innerHTML = h;
    $('fq').oninput = function () { S.q = this.value; results(); };
    $('fchips').onclick = function (ev) { var b = ev.target.closest('[data-f]'); if (!b) return; S.f = b.dataset.f; Array.prototype.forEach.call(this.querySelectorAll('.chip'), function (x) { x.classList.toggle('on', x === b); }); results(); };
    results();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) { var dt = t.querySelector('details'); if (dt) dt.open = true; t.scrollIntoView(); } }
  }

  function init() {
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) S.theme = j.theme; } catch (e) { /* ignore */ }
    document.documentElement.setAttribute('data-theme', S.theme);
    $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    $('btnTheme').onclick = function () {
      S.theme = S.theme === 'dark' ? 'light' : 'dark';
      try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = S.theme; localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
      document.documentElement.setAttribute('data-theme', S.theme); $('btnTheme').textContent = S.theme === 'dark' ? 'Light' : 'Dark';
    };
    var p = new URLSearchParams(location.search);
    if (p.get('f') === 'east' || p.get('f') === 'west') S.f = p.get('f');
    if (p.get('q')) S.q = p.get('q').slice(0, 80);
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
