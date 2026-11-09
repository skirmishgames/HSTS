#!/usr/bin/env python3
"""Build data/hon-boxes.js: the box descriptions and counts used by the landing page (index.html)
and the box pages (box.html). Counts are read from the data files, so run this after data changes:
    python3 tools/boxes_stats.py --write
Without --write it prints the result."""
import json, sys, collections

def L(f, sep='= {'):
    s = open(f, encoding='utf-8').read()
    k = s.index(sep) + (2 if sep == '= {' else len(sep))
    return json.loads(s[k:].strip().rstrip(';'))

nat = {n: L('data/hon-bro-%s.js' % n, '["hon-bro-%s"] = ' % n) for n in ('us', 'ge', 'uk')}
def tiles(sets, typ=None):
    return [t for n in nat.values() for t in n['tiles'] if t.get('set') in sets and (typ is None or t['type'] == typ)]
def options(sets):
    return [o for n in nat.values() for o in n['options'] if o.get('set') in sets]
rules = {b: L('data/hon-%s-rules.js' % b) for b in ('bro', 'omaha', 'caen')}
scen = {b: L('data/hon-%s-scenarios.js' % b) for b in ('bro', 'omaha', 'caen', 'ws')}
toks = {b: L('data/hon-%s-tokens.js' % b) for b in ('bro', 'omaha', 'caen')}
hist = {b: L('data/hon-%s-history.js' % b) for b in ('bro', 'caen')}
cards = L('data/hon-bro-cards.js')
maps = {b['id']: b for b in json.loads(open('data/maps.js', encoding='utf-8').read().split('=', 1)[1].strip().rstrip(';'))['boxes']}
icons = {}
s = open('data/hon-icons.js', encoding='utf-8').read()
import re
for m in re.finditer(r'HTS_ICONS\["hon-(\w+)"\] = ', s):
    k = m.end(); depth = 0; i = k
    # parse one JSON object starting at k
    dec = json.JSONDecoder(); obj, _ = dec.raw_decode(s[k:]); icons[m.group(1)] = obj

lib = json.loads(open('data/hon-library.js', encoding='utf-8').read().split('=', 1)[1].strip().rstrip(';'))
def ndocs(g): return len([d for d in lib['docs'] if d['group'] == g])
def n_scen(b): return len([e for e in scen[b]['entries'] if e['type'] != 'Booklet rules and reference'])
def plural(n, one, many=None): return '%d %s' % (n, one if n == 1 else (many or one + 's'))

def links(b, sets, nation, heroes_box, maps_box, hist_box, extra=None):
    out = []
    out.append({'id': 'rules', 'label': 'Rules', 'href': 'rules.html?b=' + b, 'count': plural(len(rules[b]['chunks']), 'rule entry', 'rule entries'), 'text': 'The rulebook split into searchable entries, with the pictures.'})
    out.append({'id': 'scenarios', 'label': 'Scenarios', 'href': 'scenarios.html?b=' + b, 'count': plural(n_scen(b), 'scenario'), 'text': 'Every scenario as a web page with maps and recruitment pictures, plus the booklet PDF.'})
    out.append({'id': 'units', 'label': 'Unit index', 'href': 'units.html?b=' + b + '&n=' + nation, 'count': '%d tiles, %d options' % (len(tiles(sets)), len(options(sets))), 'text': 'Every recruitment tile and option, with costs and the units on them.'})
    out.append({'id': 'heroes', 'label': 'Heroes', 'href': 'heroes.html?b=' + heroes_box, 'count': plural(len(tiles(sets, 'hero')), 'hero tile'), 'text': 'Hero tiles, what fits their slots, and the equipment cards.'})
    if b == 'bro':
        out.append({'id': 'cards', 'label': 'Cards', 'href': 'cards.html', 'count': plural(len(cards['entries']), 'card'), 'text': 'The Battle Event card decks, both sides.'})
    else:
        out.append({'id': 'cards', 'label': 'Cards', 'href': None, 'count': 'not archived yet', 'text': 'The Battle Event cards for this box are not in the files yet.'})
    out.append({'id': 'tokens', 'label': 'Tokens', 'href': 'tokens.html?b=' + b, 'count': plural(len(toks[b]['entries']), 'marker'), 'text': 'The markers and what each one does.'})
    out.append({'id': 'icons', 'label': 'Icons', 'href': 'icons.html?b=' + b, 'count': plural(len(icons[b]['entries']), 'entry', 'entries') if b in icons else '', 'text': 'The icon glossary.'})
    out.append({'id': 'maps', 'label': 'Maps', 'href': 'maps.html?b=' + maps_box, 'count': plural(len(maps[maps_box]['pieces']), 'piece'), 'text': 'Boards and terrain pieces, and a map maker.'})
    h = len(hist[hist_box]['entries'])
    out.append({'id': 'history', 'label': 'History', 'href': 'history.html?b=' + hist_box, 'count': plural(h, 'entry', 'entries') + (', shared with Big Red One' if b == 'omaha' else ''), 'text': 'The real units, weapons and vehicles behind the game.'})
    out.append({'id': 'builder', 'label': 'Army builder', 'href': 'builder.html', 'count': '', 'text': 'Build an army from the real tiles and options.'})
    return out

boxes = [
 {'id': 'bro', 'name': 'Big Red One', 'full': 'Heroes of Normandie: Big Red One Edition', 'kind': 'Core box', 'sides': 'United States and Germany', 'when': 'June 1944',
  'art': 'img/boxes/bro.webp',
  'blurb': 'The core box. American infantry of the 1st Infantry Division against German defenders in Normandy. It holds the full rulebook, the recruitment tiles and options for both sides, and the scenario and campaign booklet.',
  'links': links('bro', ['CB'], 'us', 'bro', 'bro', 'bro')},
 {'id': 'omaha', 'name': 'Bloody Omaha', 'full': 'Bloody Omaha', 'kind': 'Battle Pack #1', 'sides': 'United States and Germany', 'when': '6 June 1944',
  'art': 'img/boxes/omaha.webp',
  'blurb': 'The landings at Omaha Beach. Landing craft, seawalls, minefields, bangalores and aircraft. The booklet has the extra rules, four scenarios and a player generated landing mode.',
  'links': links('omaha', ['BO'], 'us', 'omaha', 'omaha', 'bro')},
 {'id': 'caen', 'name': 'Battle for Caen', 'full': 'Battle for Caen: Epsom, Charnwood & Goodwood', 'kind': 'Battle Pack #2', 'sides': 'Commonwealth and Germany', 'when': 'June and July 1944',
  'art': 'img/boxes/caen.webp',
  'blurb': 'Commonwealth forces against the German defence of Caen, with campaign scenarios for operations Epsom, Charnwood and Goodwood. Battle Pack #3, Windsor & Jupiter, is an expansion for this box and is covered here too.',
  'links': links('caen', ['ECG', 'BP3'], 'uk', 'caen-ecg', 'caen-ecg', 'caen'),
  'expansion': {'name': 'Battle Pack #3: Windsor & Jupiter', 'text': 'Operations Windsor and Jupiter, an expansion for Battle for Caen. Its units are in the unit index and the army builder with the box.', 'links': [
     {'label': 'Heroes', 'href': 'heroes.html?b=caen-wj', 'count': plural(len(tiles(['BP3'], 'hero')), 'hero tile')},
     {'label': 'Maps', 'href': 'maps.html?b=caen-wj', 'count': plural(len(maps['caen-wj']['pieces']), 'piece')}]}},
]
boxes.append({'id': 'ws', 'name': 'War Stories', 'full': 'War Stories #0 to #4', 'kind': 'Scenario sheets', 'sides': 'United States, Commonwealth and Germany', 'when': 'June 1944 to April 1945',
  'art': 'img/boxes/ws.webp',
  'blurb': 'Five single scenarios, each on one printed sheet: Hell\'s Fury, Blue and Grey at Moon-sur-Elle, Colombelles Castle, Juno Beach and The Black Baron. Each has its own rules, characters and new tiles, laid out here in full with the original PDF to download. They are played with the Big Red One rules and the battle packs the sheet names.',
  'links': [
    {'id': 'scenarios', 'label': 'Scenarios', 'href': 'scenarios.html?b=ws', 'count': plural(len(scen['ws']['entries']), 'scenario'), 'text': 'Every War Story as a web page with the map, armies, new tiles and the original sheet.'},
    {'id': 'expansions', 'label': 'Product catalogue', 'href': 'expansions.html?l=hon2&q=War%20Stories', 'count': '5 gazettes', 'text': 'The War Stories entries in the product catalogue, with the Heroes of Stalingrad and Pacific ones.'},
    {'id': 'units', 'label': 'Unit index', 'href': None, 'count': 'on each story page', 'text': 'The new tiles are shown on each scenario page. They are not in the unit index or the army builder yet.'}]})
ex = json.loads(open('data/expansions.js', encoding='utf-8').read().split('=', 1)[1].strip().rstrip(';'))
v1 = [l for l in ex['lines'] if l['id'] == 'hon1'][0]
n1 = len(v1['items'])
boxes.append({'id': 'hon1', 'name': 'Heroes of Normandie, 1st edition', 'full': 'Heroes of Normandie, 1st edition (V1)', 'kind': '1st edition', 'sides': 'United States and Germany', 'when': 'Normandy, 1944',
  'art': 'img/boxes/hon1.webp', 'edition': 1,
  'blurb': 'The original edition, from before the second edition (V2). Its line has a core box, scenario packs such as Sainte Mère Eglise, Carentan, Pegasus Bridge and D-Day, army boxes, small expansions, gazettes and print-and-play sets. The archive catalogues all of it and holds its rules sheets, scenario packs and unit references as documents. Where the two editions differ, the V2 rules override the V1 rules.',
  'links': [
    {'id': 'expansions', 'label': 'Product catalogue', 'href': 'expansions.html?l=hon1', 'count': plural(n1, 'product'), 'text': 'Every first edition product, with what it holds and previews of the punchboards.'},
    {'id': 'rules', 'label': 'Rules', 'href': 'guides.html?c=rules', 'count': plural(ndocs('rules'), 'document'), 'text': 'First edition rules sheets, special abilities, mines, Commandos, errata and the FAQ. The core rulebook itself is not in the files yet.'},
    {'id': 'scenarios', 'label': 'Scenarios', 'href': 'guides.html?c=scenarios', 'count': plural(ndocs('scenarios'), 'scenario pack'), 'text': 'The D-Day and Pegasus Bridge packs and the unofficial rewrite of the core scenario book, as pages you can read online.'},
    {'id': 'units', 'label': 'Unit index', 'href': 'guides.html?c=units', 'count': plural(ndocs('units'), 'unit reference'), 'text': 'Unit bibles for every first edition box. They are pictures of the tiles, not the searchable unit index yet.'}]})
gd = json.loads(open('data/hon-guides.js', encoding='utf-8').read().split('=', 1)[1].strip().rstrip(';'))
boxes[0]['links'].append({'id': 'guides', 'label': 'Guides', 'href': 'guides.html', 'count': plural(len(gd['guides']), 'guide') + ', ' + plural(len(lib['docs']), 'document'), 'text': 'Buying advice, strategy tips, the people behind the heroes, and the first edition documents.'})
for b in boxes:
    if b['id'] == 'hon1':
        b['links'].append({'id': 'guides', 'label': 'Guides', 'href': 'guides.html?g=v1-to-v2', 'count': plural(len(gd['guides']), 'guide') + ', ' + plural(len(lib['docs']), 'document'), 'text': 'How to play the old scenario packs with Big Red One platoons, a buying guide, strategy tips, and all the first edition documents.'})
out = 'window.HTS_BOXES = ' + json.dumps({'boxes': boxes}, ensure_ascii=False, indent=1) + ';\n'
if '--write' in sys.argv:
    open('data/hon-boxes.js', 'w', encoding='utf-8').write(out); print('wrote data/hon-boxes.js')
else:
    print(out[:3000])
