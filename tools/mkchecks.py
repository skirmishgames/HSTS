#!/usr/bin/env python3
"""Writes docs/community-checks.md: things the community is asked to check against their physical copies.
The hand-written part is HEAD below. The first edition tables are generated from data/hon-v1-*.js."""
import json,re,glob,os
HEAD = open(os.path.join(os.path.dirname(__file__),'community-checks-head.md')).read()
NAT={'us':'United States','ge':'Germany','uk':'Commonwealth','fr':'French (FFI)'}
out=[HEAD.rstrip(),'','## First edition tiles and options to check','','Each table comes straight from the site data. Check the name, the cost and the stripes against your tiles. "Platoon" means the tile\'s own colour stripes, "black" means the black band.','']
for f in sorted(glob.glob('data/hon-v1-*.js')):
    s=open(f).read(); d=json.loads(s[s.index('= {')+2:s.rindex(';')])
    out+=['### '+NAT.get(d['nation'],d['nation']),'','| Tile | Second line | Cost | Slots, left to right |','|---|---|---|---|']
    for t in d['tiles']:
        sl=', '.join(('long' if x['size']=='w' else 'narrow')+': '+' or '.join('black' if c=='K' else ('command' if c=='cmd' else 'platoon') for c in x['stripes']) for x in t['slots']) or 'no slots'
        out.append('| %s | %s | %s | %s |'%(t['name'],t.get('sub',''),t['cost'],sl))
    out+=['','| Option | Cost | Shape | Stripes | Filed as | From |','|---|---|---|---|---|---|']
    for o in d['options']:
        c=o['stripes'][0]; st='black' if c=='K' else ('command' if c=='cmd' else 'platoon ('+c+')')
        out.append('| %s | %s | %s | %s | %s | %s |'%(o['name'],o['cost'],'long' if o['size']=='w' else 'narrow',st,o['cat'],o.get('sheet','')))
    out.append('')
open('docs/community-checks.md','w').write('\n'.join(out)+'\n'); print('written',len(out),'lines')
