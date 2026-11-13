"""Multi-sheet expansions (several sheets in one folder, mixed nations). Usage: python3 build4.py <config.json>"""
import json,sys,re,cv2,numpy as np
from PIL import Image
exec(open('/tmp/h/v1/v1lib.py').read())
C=json.load(open(sys.argv[1])); DRY='--dry' in sys.argv
data={}
for n in ('us','ge','uk'):
    s=open(R+'data/hon-v1-%s.js'%n).read(); data[n]=json.loads(s[s.index('= {')+2:s.rindex(';')])
L=[x for x in json.load(open(C['dir']+'/labels.json')) if x['kind'] in('tile','option') and x.get('cost') is not None and x['file'] not in C.get('skip',[])]
sheets={}; rep=[]
for it in L:
    tag=it['file'].split('_')[0]; idx=int(it['file'].split('_')[1][:2])-1
    if tag not in sheets: sheets[tag]=(cv2.imread(E+C['sheets'][tag]),json.load(open('%s/%s.json'%(C['dir'],tag))))
    sh,boxes=sheets[tag]; b=boxes[idx]; x,y,w,h=b['x'],b['y'],b['w'],b['h']
    l,t,r,bt=C.get('fixbox',{}).get(it['file'],(0,0,0,0)); x-=l; y-=t; w+=l+r; h+=t+bt
    p=4; c=sh[max(0,y-p):y+h+p,max(0,x-p):x+w+p]
    rot=((it.get('rotation') or 0)+C.get('rotfix',{}).get(it['file'],0))%360
    if rot: c=np.ascontiguousarray(np.rot90(c,k=(4-rot//90)%4))
    H,W=c.shape[:2]; nm=C.get('rename',{}).get(it['file'],it['name'])
    grp=C['groups'][C['group_of'].get(it['file'],C['group_of'].get(tag))]   # {nat,code,set?}
    nid=grp['nat']; D=data[nid]; setc=grp.get('set',C['set'])
    if it['kind']=='tile':
        typ=C.get('typ',{}).get(nm) or ('hero' if W<1000 else 'platoon'); code='cmd' if typ=='command' else grp['code']
        lay=LAY[C['layfile'][it['file']]] if it['file'] in C.get('layfile',{}) else LAY[C['lay'][nm]] if nm in C.get('lay',{}) else ([] if W<1000 else (L4 if W>1800 else [[0.024,0.19,0.207,0.76,'n'],[0.245,0.19,0.207,0.76,'n'],[0.707,0.19,0.270,0.76,'w']])); slots=[]
        for i,(sx,sy,sw,shh,sz) in enumerate(lay):
            x0,x1,y0,y1=int(sx*W),int((sx+sw)*W),int((sy+0.32*shh)*H),int((sy+0.68*shh)*H); q=int((x1-x0)*0.16); st=[]
            for hc in (halfcode(c,x0+8,x0+q,y0,y1),halfcode(c,x1-q,x1-8,y0,y1)):
                v=code if hc=='T' else 'K'
                if v not in st: st.append(v)
            if nm in C.get('slotfix',{}): st=C['slotfix'][nm][i]
            slots.append({'x':sx,'y':sy,'w':sw,'h':shh,'size':sz,'stripes':st})
        tid=slug(nm)
        if any(t['id']==tid for t in D['tiles']): tid+='_'+slug(C['sheet'])
        if any(t['id']==tid for t in D['tiles']): tid+='_'+str(it['cost'])
        if any(t['id']==tid for t in D['tiles']): rep.append('skip existing '+tid); continue
        t={'id':tid,'name':nm,'sub':it.get('sub') or '','cost':it['cost'],'type':typ,'set':setc,'squares':it.get('breaking_point') or 0,'img':'img/hon/v1/%s/tiles/%s.webp'%(nid,tid),'w':W,'h':H,'sheet':C['sheet'],'units':[[u[0],u[1],kind(u[0],typ=='hero')] for u in (it.get('units') or [])] or ([[nm,1,'character']] if typ=='hero' else []),'slots':slots,'own':[]}
        D['tiles'].append(t)
        if not DRY: Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(R+t['img'],'WEBP',quality=88,method=6)
        rep.append('%s T %-30s %4s %s %s'%(nid,nm[:30],it['cost'],typ,' | '.join(s['size']+':'+'/'.join(s['stripes']) for s in slots)))
    else:
        code=C.get('optcode',{}).get(it['file']) or ('K' if nm in C.get('K',[]) else ('cmd' if nm in C.get('CMD',[]) else grp['code']))
        nc=(it.get('name_colour') or '').lower(); cat='order' if nc=='yellow' else ('gear' if nc=='red' else 'support')
        size='w' if (W>=330 or W/H>0.98) else 'n'; oid=slug(nm)
        same=[o for o in D['options'] if o['name']==nm and o['cost']==it['cost'] and o['stripes']==[code] and o['size']==size]
        if same: rep.append('%s O %-22s duplicate of %s, skipped'%(nid,nm,same[0]['id'])); continue
        if any(o['id']==oid for o in D['options']): oid+='_'+slug(C['sheet'])
        if any(o['id']==oid for o in D['options']): oid+='_'+str(it['cost'])
        o={'id':oid,'name':nm,'cat':cat,'cost':it['cost'],'squares':it.get('breaking_point') or 0,'set':setc,'size':size,'stripes':[code],'img':'img/hon/v1/%s/options/%s.webp'%(nid,oid),'w':W,'h':H,'sheet':C['sheet']}
        if it.get('units'): o['units']=[[u[0],u[1],kind(u[0])] for u in it['units']]
        if it.get('markers'): o['note']='Markers: '+it['markers']+'.'
        D['options'].append(o)
        if not DRY: Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(R+o['img'],'WEBP',quality=88,method=6)
        rep.append('%s O %-22s %4s %s %s %s'%(nid,nm[:22],it['cost'],size,code,cat))
if not DRY:
    for n,d in data.items(): open(R+'data/hon-v1-%s.js'%n,'w').write('window.HTS_DATA = window.HTS_DATA || {};\nHTS_DATA["hon-v1-%s"] = '%n+json.dumps(d,indent=1,ensure_ascii=False)+';\n')
print('\n'.join(rep)); print({n:(len(d['tiles']),len(d['options'])) for n,d in data.items()})
