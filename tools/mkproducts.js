#!/usr/bin/env node
/* Builds data/hon-products.js (the extra products shown in My collection) from data/expansions.js.
   Run: node tools/mkproducts.js
   The 12 older products (Big Red One, Omaha, Caen, Stalingrad sets, promos) live in js/collection.js
   because the army builder tiles use their set codes. Everything else uses the Archive item id as its code. */
const fs = require('fs');
global.window = {};
require('../data/expansions.js');
const L = {}; window.HTS_EXPANSIONS.lines.forEach(l => { L[l.id] = l; });
const SKIP = new Set(['hon2-core-box-big-red-one', 'hon2-bloody-omaha', 'hon2-battle-for-caen-epsom-charnwood-and-goodwood',
  'hon2-battle-pack-3-windsor-and-jupiter', 'hon2-war-stories-0-hell-s-fury', 'hon2-errata-2023', 'hon2-pulp-stories-1-pumpkin-s-revenge',
  'hon1-ffi-order-tokens-and-dice']);
function first(t) { t = String(t || '').replace(/\s+/g, ' ').trim(); const m = t.match(/^.*?[.!?](\s|$)/); return (m ? m[0] : t).trim(); }
function pick(line, cats, extra) {
  return L[line].items.filter(i => !SKIP.has(i.id) && (cats.indexOf(i.cat) >= 0 || (extra || []).indexOf(i.id) >= 0))
    .map(i => ({ code: i.id, name: (i.id === 'hon1-core-box' ? 'First edition Core Box' : i.id === 'hos-battlefield-stories-1-all-quiet' ? 'Battlefield Stories #1: All Quiet' : i.name).replace(/P&P/g, 'Print and play').replace(/&/g, 'and'), note: first(i.text) }));
}
const groups = [
  { name: 'Heroes of Normandie V2: expansions', items: pick('hon2', ['Small box', 'Single punchboard', 'Gazette']) },
  { name: 'First edition: boxes and scenario packs', items: pick('hon1', ['Big box', 'Small box']) },
  { name: 'First edition: army boxes and punchboards', items: pick('hon1', ['Multiple punchboards', 'Single punchboard']) },
  { name: 'First edition: gazettes', items: pick('hon1', ['Gazette']) },
  { name: 'First edition: terrain', items: pick('hon1', ['Terrain']) },
  { name: 'Heroes of Stalingrad: extras', items: pick('hos', [], ['hos-battlegrounds-2019', 'hos-battleground-set-5-the-sewers', 'hos-battlefield-stories-1-all-quiet']) }
].filter(g => g.items.length);
fs.writeFileSync(__dirname + '/../data/hon-products.js', 'window.HTS_PRODUCTS = ' + JSON.stringify(groups, null, 1) + ';\n');
console.log(groups.map(g => g.name + ': ' + g.items.length).join('\n'));
