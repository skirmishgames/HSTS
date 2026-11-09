(function () {
  'use strict';
  var LSK = 'hts.hon.bro.v1';
  var theme = 'light';
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var D = (window.HTS_BOXES || {}).boxes || [];

  // old army links point at index.html#b=..., the builder now lives at builder.html
  if (/^#b=/.test(location.hash)) { location.replace('builder.html' + location.hash); return; }

  function setTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    var b = $('btnTheme'); if (b) b.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
  try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); if (j.theme) theme = j.theme; } catch (e) { /* ignore */ }
  setTheme();
  if ($('btnTheme')) $('btnTheme').addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    try { var j = JSON.parse(localStorage.getItem(LSK) || '{}'); j.theme = theme; localStorage.setItem(LSK, JSON.stringify(j)); } catch (e) { /* ignore */ }
    setTheme();
  });

  function pick(id) { return D.filter(function (b) { return b.id === id; })[0]; }
  function stat(b) {
    var g = {}; b.links.forEach(function (l) { g[l.id] = l.count || ''; });
    if (b.edition) return g.expansions || '';
    return [g.scenarios, g.units, g.rules].filter(Boolean).join(' · ');
  }

  function tile(b) {
    return '<li><a class="boxcard" href="box.html?b=' + b.id + '"><img src="' + esc(b.art) + '" width="760" height="760" alt="" loading="lazy">' +
      '<span class="bc-body"><span class="bc-kind">' + esc(b.kind) + ' · ' + esc(b.when) + '</span><strong>' + esc(b.name) + '</strong>' +
      '<span class="bc-sides">' + esc(b.sides) + '</span><span class="bc-stat">' + esc(stat(b)) + '</span></span></a></li>';
  }
  if ($('boxGrid')) $('boxGrid').innerHTML = D.filter(function (b) { return b.id !== 'bro'; }).map(tile).join('');
  if ($('goGrid')) {
    Array.prototype.forEach.call($('goGrid').querySelectorAll('.gocard'), function (a) {
      var ic = a.getAttribute('data-ic'); a.insertAdjacentHTML('afterbegin', '<img class="goic" src="img/nav/' + ic + '.svg" width="40" height="40" alt="">');
    });
  }

  if ($('boxHead')) {
    var id = new URLSearchParams(location.search).get('b');
    var b = pick(id) || D[0];
    document.title = b.name + ', Heroes System Tactical Scale';
    $('subtitle').textContent = 'Digital Archive · ' + b.name;
    $('boxHead').innerHTML = '<img class="bh-art" src="' + esc(b.art) + '" width="760" height="760" alt="' + esc(b.full) + ' box art">' +
      '<div class="bh-text"><p class="kicker">' + esc(b.kind) + ' · ' + esc(b.when) + '</p><h2>' + esc(b.full) + '</h2><p class="bh-sides">' + esc(b.sides) + '</p><p>' + esc(b.blurb) + '</p></div>';
    $('boxLinks').innerHTML = b.links.map(function (l) {
      var inner = '<img class="goic" src="img/nav/' + l.id + '.svg" width="44" height="44" alt=""><strong>' + esc(l.label) + '</strong>' +
        (l.count ? '<em>' + esc(l.count) + '</em>' : '') + '<span>' + esc(l.text) + '</span>';
      return l.href ? '<li><a class="gocard" href="' + esc(l.href) + '">' + inner + '</a></li>' : '<li><div class="gocard off" aria-disabled="true">' + inner + '</div></li>';
    }).join('');
    if (b.expansion) {
      var x = b.expansion;
      $('boxExp').innerHTML = '<h2 class="sec">Expansion: ' + esc(x.name) + '</h2><p class="lede">' + esc(x.text) + '</p><ul class="gogrid">' +
        x.links.map(function (l) { return '<li><a class="gocard" href="' + esc(l.href) + '"><img class="goic" src="img/nav/' + (/Maps/.test(l.label) ? 'maps' : 'heroes') + '.svg" width="44" height="44" alt=""><strong>' + esc(l.label) + '</strong><em>' + esc(l.count) + '</em></a></li>'; }).join('') + '</ul>';
    }
    $('boxOther').innerHTML = D.filter(function (o) { return o.id !== b.id; }).map(function (o) {
      return '<li><a href="box.html?b=' + o.id + '"><img src="' + esc(o.art) + '" width="760" height="760" alt="" loading="lazy"><span>' + esc(o.name) + '</span></a></li>';
    }).join('');
  }
})();
