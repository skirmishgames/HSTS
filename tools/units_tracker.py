#!/usr/bin/env python3
"""Unit and History coverage tracker.

Reads every data/hon-<box>-<nation>.js file (units, recruitment tiles,
options) and data/hon-<box>-history.js, then reports which units have no
History entry.  Run after every box import:

    python3 tools/units_tracker.py            # print the gap report
    python3 tools/units_tracker.py --write    # also write docs/units-tracker.md and .csv

A unit counts as covered when a History entry names it (entry name, aka, id)
or points at it ("find" query matches the unit or its tile).
"""
import csv, glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load(path):
    s = open(path, encoding='utf-8').read()
    return json.loads(s[s.index('= {') + 2:].rstrip().rstrip(';'))

def norm(x):
    return re.sub(r'[^a-z0-9]+', ' ', (x or '').lower()).strip()

def collect():
    boxes = {}
    for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'hon-*-history.js'))):
        box = os.path.basename(f).split('-')[1]
        boxes.setdefault(box, {'hist': load(f), 'nations': {}})
    for f in sorted(glob.glob(os.path.join(ROOT, 'data', 'hon-*-*.js'))):
        parts = os.path.basename(f)[:-3].split('-')
        if len(parts) != 3 or parts[2] in ('history', 'heroes', 'rules', 'tokens', 'scenarios', 'icons'):
            continue
        d = load(f)
        if 'tiles' not in d:
            continue
        boxes.setdefault(parts[1], {'hist': None, 'nations': {}})['nations'][parts[2]] = d
    return boxes

def keys_for(entry):
    ks = {norm(entry['name']), norm(entry['id'])}
    ks.update(norm(a) for a in entry.get('aka') or [])
    f = entry.get('find')
    if f:
        ks.add(norm(f['q']))
    return {k for k in ks if len(k) > 2}

def covered(names, entries, nation):
    ns = [norm(n) for n in names if n]
    for e in entries:
        side = e.get('side')
        if side and side not in (nation, 'both', 'all') and nation not in (e.get('also') or []):
            continue
        for k in keys_for(e):
            for n in ns:
                if n and (k == n or (len(k) > 4 and k in n) or (len(n) > 4 and n in k)):
                    return e['id']
    return ''

def exclusions():
    return json.load(open(os.path.join(ROOT, 'tools', 'tracker_exclusions.json'), encoding='utf-8'))

# Units and options live in the legacy hon-bro-<nation>.js files; the set code says which game box
# they belong to. Each box has its own History file (data/hon-<box>-history.js).
SET_BOX = {'ECG': 'caen', 'BP3': 'caen'}

def rows():
    ex = exclusions()
    bx = collect()
    def hist(box):
        return (bx.get(box, {}).get('hist') or {}).get('entries', [])
    out = []
    for fbox, b in bx.items():
        for nat, d in b['nations'].items():
            for t in d['tiles']:
                box = SET_BOX.get(t.get('set'), fbox)
                entries = hist(box)
                tile_hit = covered([t['name'], t.get('sub', '')], entries, nat)
                for u in t['units']:
                    hit = covered([u[0]], entries, nat) or tile_hit or ex['types'].get(u[2], '') or ex['names'].get(u[0], '')
                    out.append([box, nat, 'unit', u[0], u[2], t['name'], t.get('sub', ''), hit])
                tile_hit = tile_hit or ex['types'].get(t['type'], '') or ex['names'].get(t['name'], '')
                out.append([box, nat, 'tile', t['name'], t['type'], t['name'], t.get('sub', ''), tile_hit])
            for o in d.get('options', []):
                box = SET_BOX.get(o.get('set'), fbox)
                entries = hist(box)
                # a support option is covered when its own name or any unit it lists is covered
                hit = covered([o['name']] + [u[0] for u in (o.get('units') or [])], entries, nat) or ex['cats'].get(o['cat'], '')
                out.append([box, nat, 'option', o['name'], o['cat'], '', '', hit])
    return out

def main():
    r = rows()
    seen, uniq = set(), []
    for x in r:
        k = (x[0], x[1], x[2], x[3])
        if k in seen:
            continue
        seen.add(k); uniq.append(x)
    nohist = {b for b, v in collect().items() if not v['hist']}
    pending = [x for x in uniq if not x[7] and x[0] in nohist]
    gaps = [x for x in uniq if not x[7] and x[0] not in nohist]
    print('rows %d, covered %d, gaps %d' % (len(uniq), len(uniq) - len(gaps) - len(pending), len(gaps)))
    if pending:
        print('  %d items in boxes with no History file yet (%s), not counted as gaps' % (len(pending), ', '.join(sorted(nohist))))
    for x in gaps:
        print('  GAP %s/%s %s: %s (%s)' % (x[0], x[1], x[2], x[3], x[4]))
    if '--write' in sys.argv:
        os.makedirs(os.path.join(ROOT, 'docs'), exist_ok=True)
        with open(os.path.join(ROOT, 'docs', 'units-tracker.csv'), 'w', newline='', encoding='utf-8') as fh:
            w = csv.writer(fh)
            w.writerow(['box', 'nation', 'kind', 'name', 'type', 'tile', 'tile_sub', 'history_entry'])
            w.writerows(uniq)
        with open(os.path.join(ROOT, 'docs', 'units-tracker.md'), 'w', encoding='utf-8') as fh:
            fh.write('# Units and History coverage\n\nGenerated by `tools/units_tracker.py --write`. %d items, %d without a History entry.\n\n' % (len(uniq), len(gaps)))
            fh.write('| Box | Nation | Kind | Name | Type | History |\n|---|---|---|---|---|---|\n')
            for x in uniq:
                fh.write('| %s | %s | %s | %s | %s | %s |\n' % (x[0], x[1], x[2], x[3], x[4], x[7] or '**missing**'))
    return 1 if gaps and '--strict' in sys.argv else 0

if __name__ == '__main__':
    sys.exit(main())
