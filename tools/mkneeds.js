#!/usr/bin/env node
/* Builds data/hon-needs.js: which products each scenario needs, used by the My collection filter.
   Run: node tools/mkneeds.js
   Key: "<box>:<scenario id>" for the box scenario pages, "lib:<document id>" for Library scenarios.
   Value: list of product codes. An item can itself be a list, meaning any one of them is enough.
   A scenario with no entry is "not tagged" and is never hidden.
   Box scenarios: boards come from the printed marks in the Setup line (C = Big Red One, OB = Bloody Omaha,
   EC = Epsom Charnwood Goodwood, WJ = Windsor and Jupiter), units are listed by hand below.
   Library scenarios: only what the scenario sheet itself states (requirements box or "necessary to play" line). */
const fs = require('fs');
global.window = {}; global.HTS_SCEN = (window.HTS_SCEN = {});
['bro', 'omaha', 'caen', 'ws'].forEach(f => require('../data/hon-' + f + '-scenarios.js'));
const S = window.HTS_SCEN;
const BOARD = { C: 'CB', OB: 'BO', EC: 'ECG', WJ: 'BP3' };
const need = {};
function boards(e) {
  const t = (e.facts || []).filter(f => f[0] === 'Setup').map(f => f[1]).join(' ');
  const out = new Set();
  (t.match(/\b(OB|EC|WJ|C)\d(?:-[AB])?\b/g) || []).forEach(m => { const k = m.match(/^[A-Z]+/)[0]; if (m !== 'C0' && !/^C0/.test(m)) out.add(BOARD[k]); });
  return [...out];
}
// Units by hand (read from the Armies and Starting forces lines).
const UNITS = {
  'hon-bro': { _all: ['CB'] },
  'hon-omaha': { _all: ['BO'] },
  'hon-caen': { _all: ['ECG'] },
  'hon-ws': {
    'hells-fury': ['WS#0', 'CB'],
    'blue-and-grey': ['hon2-war-stories-1-blue-and-grey', 'CB', 'BO'],
    'colombelles-castle': ['hon2-war-stories-2-colombelles-castle', 'CB', 'ECG'],
    'juno-beach': ['hon2-war-stories-3-juno-beach', 'BO', 'ECG'],
    'black-baron': ['hon2-war-stories-4-the-black-baron', 'CB', 'ECG']
  }
};
Object.keys(S).forEach(k => {
  const key = k.replace('hon-', '');
  S[k].entries.filter(e => !/rules|reference/i.test(e.type)).forEach(e => {
    const u = UNITS[k]; let list = (u._all || []).concat(u[e.id] || []).concat(boards(e));
    list = [...new Set(list)];
    if (list.length) need[key + ':' + e.id] = list;
  });
});
// Library scenarios. CORE: the V1 Core Box or Big Red One (C1 to C6 boards, assumed the same set).
const CORE = ['hon1-core-box', 'CB'];
const BGANY = ['hon1-battleground-1-fields-and-swamps', 'hon1-battleground-2-harbors-and-hills', 'hon1-battleground-3-roads-and-railroads', 'hon1-battleground-4-woods-and-hills'];
const BG1 = 'hon1-battleground-1-fields-and-swamps', BG3 = 'hon1-battleground-3-roads-and-railroads';
const US = 'hon1-army-box-us', GE = 'hon1-army-box-ge', CW = 'hon1-army-box-cw', SME = 'hon1-sainte-mere-eglise', CAR = 'hon1-carentan';
const CUF = 'hon1-civilians-under-fire', SS1 = 'hon1-1st-ss-panzer-ge', WIT = 'hon1-wittmann-s-tigers', FARM = 'hon1-the-fortified-farm', ET2 = 'hon1-extra-terrain-set-2';
const RANG = 'hon1-us-rangers', RIFLE = 'hon1-us-rifle-platoon', PZ21 = 'hon1-ge-reinforcement-21eme-pz', MILL = 'hon1-miller-s-rangers';
const LIB = {
  'slaughterhouse-bro': ['CB'],
  'hell-on-wheels': [BG1, US, RIFLE, PZ21],
  'the-proper-way': [CORE, US, 'hon1-steiner-kampfgruppe'],
  'the-giraffe-has-a-long-neck': [CUF, SS1],
  'the-tiny-town-tank-trashing': [CORE, 'hon1-pegasus-bridge', CW, GE, 'hon1-7th-armored-division-uk'],
  'whos-afraid-of-the-big-bad-wolf': [CORE, SME, CAR, US, GE, MILL, 'hon1-kelly-s-heroes', PZ21, 'hon1-ss-panzergrenadiere', BG1],
  'heroes-and-gold-01-its-straight-ahead': [SME],
  'heroes-and-gold-02-positive-waves-on-a-minor-bridge': [CORE, 'hon1-river-set', US],
  'heroes-and-gold-03-are-you-efficient-in-laying-out-a-mine-field': [BG1],
  'heroes-and-gold-04-weve-got-a-bank-to-rob': [CORE, CAR, SME, WIT, US],
  'gazette-7-02-place-your-bets-d-day-8-31-am': [CAR, CW],
  'gazette-8-01-ambush-at-the-croix-haute-pass': [CORE, GE, SS1, CUF],
  'gazette-8-02-valchevriere': [CORE, ['hon1-ffi-colonel-bastien', CUF]],
  'gazette-8-03-the-black-wings': [CORE, CUF, CAR],
  'hos-house-of-hell-scenario': ['HoS-CB'],
  'hos-stalingrad-hell-on-earth': ['HoS-CB', 'HoS-BP', BG3],
  'hos-battlefield-stories-1-all-quiet': ['HoS-CB'],
  'hos-war-stories-1-otto-carius': ['HoS-CB'],
  'hos-war-stories-2-aleksei-naumov': ['HoS-CB'],
  'fan-commando': [CORE, CW, GE, 'hon1-lord-lovat-s-commandos'],
  'fan-hit-the-road-fritz': [CORE, CAR, SME],
  'fan-stuartmania': [CORE, CAR, SME, BGANY],
  'fan-grains-of-sand': [CORE, BGANY, CW, SME, CAR],
  'fan-gold-for-berlin': [CORE, CW, WIT],
  'fan-hill-192': [CORE, FARM, ET2],
  'fan-isolated': [CORE, PZ21, FARM, ET2, RANG],
  'fan-another-town-another-river-another-bridge': [CORE, 'hon1-river-set', BGANY, CAR, SME, FARM],
  'fan-counter-offensive': [CORE, PZ21, RANG, RIFLE],
  'fan-wittmanns-charge': [CORE, 'hon1-d-day', CW, GE, WIT],
  'fan-strike-swiftly': [CORE, US],
  'fan-within-reach-of-an-88mm': [CORE, US, 'hon1-extra-units-us-and-ge', MILL, WIT],
  'fan-my-home': [CORE, 'hon1-d-day', 'hon1-lord-lovat-s-commandos', GE, WIT],
  'fan-cut-like-a-knife-through-butter': [CORE, FARM, ET2],
  'fan-the-german-strongpoint-at-foucarville': [CORE],
  'fan-the-la-manoir-farmhouse-6-june-1944': [CORE, FARM]
};
Object.keys(LIB).forEach(id => { need['lib:' + id] = LIB[id]; });
fs.writeFileSync(__dirname + '/../data/hon-needs.js', 'window.HTS_NEEDS = ' + JSON.stringify(need, null, 1) + ';\n');
console.log(Object.keys(need).length + ' scenarios tagged');
