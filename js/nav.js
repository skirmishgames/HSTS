(function () {
  'use strict';
  /* Groups the header links into three menus: Play, Reference and Archive.
     The plain links stay in the html, so the header still works without this script. */
  var GROUPS = [
    { id: 'play', name: 'Play', pages: ['builder.html', 'maps.html', 'scenarios.html'] },
    { id: 'ref', name: 'Reference', pages: ['units.html', 'heroes.html', 'cards.html', 'tokens.html', 'icons.html', 'rules.html'] },
    { id: 'arc', name: 'Archive', pages: ['expansions.html', 'guides.html', 'history.html'] }
  ];
  function page(a) { return (a.getAttribute('href') || '').split(/[?#]/)[0]; }
  function mount() {
    var bar = document.querySelector('.top-actions');
    if (!bar || bar.querySelector('.navgrp')) return;
    var links = Array.prototype.slice.call(bar.querySelectorAll('a'));
    var here = (location.pathname.split('/').pop() || 'index.html');
    if (here === 'scenario.html') here = 'scenarios.html';
    if (here === 'box.html') here = 'index.html';
    var first = null;
    GROUPS.forEach(function (g) {
      var mine = [];
      g.pages.forEach(function (p) { links.forEach(function (a) { if (page(a) === p && mine.indexOf(a) < 0) mine.push(a); }); });
      if (!mine.length) return;
      var d = document.createElement('details'); d.className = 'navgrp'; d.setAttribute('data-nav', g.id);
      var s = document.createElement('summary'); s.textContent = g.name; d.appendChild(s);
      var box = document.createElement('div'); box.className = 'navmenu'; d.appendChild(box);
      if (!first) first = mine[0];
      bar.insertBefore(d, first === mine[0] ? mine[0] : null);
      mine.forEach(function (a) { box.appendChild(a); });
      if (g.pages.indexOf(here) >= 0) d.classList.add('here');
    });
    /* keep the menus together, right after Home */
    var home = bar.querySelector('a[href="index.html"]'), ref = home ? home.nextSibling : bar.firstChild;
    Array.prototype.forEach.call(bar.querySelectorAll('.navgrp'), function (d) { bar.insertBefore(d, ref); });
    document.addEventListener('click', function (ev) {
      Array.prototype.forEach.call(bar.querySelectorAll('.navgrp[open]'), function (d) { if (!d.contains(ev.target)) d.open = false; });
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      Array.prototype.forEach.call(bar.querySelectorAll('.navgrp[open]'), function (d) { d.open = false; d.querySelector('summary').focus(); });
    });
    bar.addEventListener('toggle', function (ev) {
      if (!ev.target.open) return;
      Array.prototype.forEach.call(bar.querySelectorAll('.navgrp[open]'), function (d) { if (d !== ev.target) d.open = false; });
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
