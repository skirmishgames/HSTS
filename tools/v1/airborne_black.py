"""Split first edition US and German black stripes into generic black (K) and airborne black (KA).

Airborne option cards (Sainte-Mere-Eglise and US Airborne sets) carry the same
grey band with a black line as the generic black gear, but they are printed on
camouflage and only go on paratrooper tiles. This script:
  - gives every K option from the airborne sets the stripe KA instead of K;
  - adds KA to every slot holding K on an airborne tile.
Generic K options still fit airborne slots. Safe to run more than once.

Run: python3 tools/v1/airborne_black.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / 'data'
# per nation: option sets that are airborne as a whole, single airborne options, and airborne tiles (by set or id)
CONF = {
    'us': {'opt_sets': {'hon1-sainte-mere-eglise', 'hon1-us-airborne'}, 'opt_ids': set(),
           'tile_sets': {'hon1-sainte-mere-eglise', 'hon1-us-airborne', 'hon1-gazette-3', 'hon1-private-bryan', 'hon1-carentan'},
           'tile_ids': set()},
    # German Fallschirmjager: Carentan cards whose counters carry the Fallschirmjager badge, Lions of Carentan, and the
    # German Airborne pack. Carentan gear with no badge (Heroic, Camo, Overwatch, Fortified) and the Carentan units with
    # the plain cross (Flak 38 Quad, Sd Kfz 10/5, Osttruppen) stay generic.
    'ge': {'opt_sets': {'hon1-ge-airborne'},
           'opt_ids': {'panzerschreck', 'scharfschutzen', '8cm_granatwerfer', 'puppchen', '10_5_cm_leichtgeschutz_42', 'mg42_hmg',
                       'kettenkrad', 'pak_40', 'stug_iv_carentan_65', 'stug_h_42_g', 'lions_of_carentan'},
           'tile_sets': {'hon1-ge-airborne'},
           'tile_ids': {'fallschirmj_ger', 'fallschirmj_ger_carentan', 'emil_preischkat'}},
}

for nat, c in CONF.items():
    path = ROOT / f'hon-v1-{nat}.js'
    src = path.read_text(encoding='utf-8')
    m = re.search(r'(HTS_DATA\["hon-v1-' + nat + r'"\] = )(\{.*\})(;\s*)$', src, re.S)
    d = json.loads(m.group(2))
    opts = tiles = 0
    for o in d['options']:
        if (o.get('set') in c['opt_sets'] or o['id'] in c['opt_ids']) and 'K' in o['stripes']:
            o['stripes'] = ['KA' if x == 'K' else x for x in o['stripes']]
            opts += 1
    for t in d['tiles']:
        if t.get('set') not in c['tile_sets'] and t['id'] not in c['tile_ids']:
            continue
        for sl in t['slots']:
            if 'K' in sl['stripes'] and 'KA' not in sl['stripes']:
                sl['stripes'].append('KA')
                tiles += 1
    path.write_text(src[:m.start(2)] + json.dumps(d, indent=1, ensure_ascii=False) + src[m.end(2):], encoding='utf-8')
    print(f'{nat}: options set to KA: {opts}, airborne slots given KA: {tiles}')
