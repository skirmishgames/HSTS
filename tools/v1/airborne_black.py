"""Split first edition US black stripes into generic black (K) and airborne black (KA).

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

PATH = Path(__file__).resolve().parents[2] / 'data' / 'hon-v1-us.js'
AIRBORNE_OPTION_SETS = {'hon1-sainte-mere-eglise', 'hon1-us-airborne'}
AIRBORNE_TILE_SETS = {'hon1-sainte-mere-eglise', 'hon1-us-airborne', 'hon1-gazette-3',
                      'hon1-private-bryan', 'hon1-carentan'}

src = PATH.read_text(encoding='utf-8')
m = re.search(r'(HTS_DATA\["hon-v1-us"\] = )(\{.*\})(;\s*)$', src, re.S)
head, body, tail = src[:m.start(2)], m.group(2), src[m.end(2):]
d = json.loads(body)

opts = tiles = 0
for o in d['options']:
    if o.get('set') in AIRBORNE_OPTION_SETS and 'K' in o['stripes']:
        o['stripes'] = ['KA' if s == 'K' else s for s in o['stripes']]
        opts += 1
for t in d['tiles']:
    if t.get('set') not in AIRBORNE_TILE_SETS:
        continue
    for s in t['slots']:
        if 'K' in s['stripes'] and 'KA' not in s['stripes']:
            s['stripes'].append('KA')
            tiles += 1

PATH.write_text(head + json.dumps(d, indent=1, ensure_ascii=False) + tail, encoding='utf-8')
print(f'options set to KA: {opts}, airborne slots given KA: {tiles}')
