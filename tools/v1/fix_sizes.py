"""Correct first edition option shapes that the cut sizes got wrong.

Sainte-Mere-Eglise options are cut tight to the card, so their width/height
ratio does not follow the usual small (0.73-0.85) and large (1.0-1.14) split.
Measured against the slots on the same sheet, the four below are large cards.
Sailors (FFI) matches the small slots on Ventura and Delobel.
Safe to run more than once.

Run: python3 tools/v1/fix_sizes.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / 'data'
FIX = {
    'us': {'willys_50_cal': 'w', 'engineers_squad': 'w', 'dropped': 'w',
           'pathfinders_squad_sainte_mere_eglise_80': 'w'},
    'fr': {'sailors': 'n'},
}

for nat, fixes in FIX.items():
    path = ROOT / f'hon-v1-{nat}.js'
    src = path.read_text(encoding='utf-8')
    m = re.search(r'(HTS_DATA\["hon-v1-' + nat + r'"\] = )(\{.*\})(;\s*)$', src, re.S)
    d = json.loads(m.group(2))
    done = 0
    for o in d['options']:
        if o['id'] in fixes and o['size'] != fixes[o['id']]:
            o['size'] = fixes[o['id']]
            done += 1
    path.write_text(src[:m.start(2)] + json.dumps(d, indent=1, ensure_ascii=False) + src[m.end(2):], encoding='utf-8')
    print(f'{nat}: {done} option shapes changed')
