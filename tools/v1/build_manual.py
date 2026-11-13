"""Hand-marked pieces from scanned punchboards. Reads manual/*.json, snaps each box to the nearest strong edges, cuts, and merges into data/hon-v1-*.js."""
import json,os,re,cv2,numpy as np,sys,glob
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
E='/mnt/user-data/uploads/Heroes System/Sorted/Boxes/First edition/Expansions/'
R='/home/claude/hsts/'
def slug(s): return re.sub(r'[^a-z0-9]+','_',s.lower().replace('é','e').replace('è','e').replace('ü','u').replace('ö','o')).strip('_')
def snap(g,x0,y0,x1,y1,win=45):
    """move each side to the strongest edge within +-win px"""
    gx=np.abs(cv2.Sobel(g,cv2.CV_32F,1,0,ksize=3)); gy=np.abs(cv2.Sobel(g,cv2.CV_32F,0,1,ksize=3))
    H,W=g.shape
    def best(arr,c,lo,hi):
        a=max(0,c-win); b=min(len(arr)-1,c+win); return a+int(np.argmax(arr[a:b+1]))
    ys=slice(max(0,y0+60),min(H,y1-60)); xs=slice(max(0,x0+60),min(W,x1-60))
    colx=gx[ys,:].mean(axis=0); rowy=gy[:,xs].mean(axis=1)
    return best(colx,x0,0,W),best(rowy,y0,0,H),best(colx,x1,0,W),best(rowy,y1,0,H)
data={}
for n in ('us','ge','uk'):
    s=open(R+'data/hon-v1-%s.js'%n).read(); data[n]=json.loads(s[s.index('= {')+2:s.rindex(';')])
dbg=[]
for f in sorted(glob.glob('manual/*.json')):
    M=json.load(open(f)); sh=cv2.imread(E+M['src']); g=cv2.cvtColor(sh,cv2.COLOR_BGR2GRAY)
    for it in M['pieces']:
        D=data[it.get('nat',M.get('nat'))]; nid=it.get('nat',M.get('nat')); setc=it.get('set',M['set'])
        x0,y0,x1,y1=it['box']
        if it.get('snap',True): x0,y0,x1,y1=snap(g,x0,y0,x1,y1)
        c=sh[y0:y1,x0:x1]; rot=it.get('rot',0)
        if rot: c=np.ascontiguousarray(np.rot90(c,k=(4-rot//90)%4))
        H,W=c.shape[:2]; nm=it['name']
        if it['kind']=='tile':
            slots=[]
            for sl in it.get('slots',[]):
                sx0,sy0,sx1,sy1=sl['box']  # sheet coords, only valid for rot 0
                slots.append({'x':round((sx0-x0)/W,4),'y':round((sy0-y0)/H,4),'w':round((sx1-sx0)/W,4),'h':round((sy1-sy0)/H,4),'size':sl.get('size','n'),'stripes':sl['stripes']})
            tid=slug(nm)
            if any(t['id']==tid for t in D['tiles']): tid+='_'+slug(M['sheet'])
            if any(t['id']==tid for t in D['tiles']): print('skip existing',tid); continue
            typ=it.get('type','hero')
            t={'id':tid,'name':nm,'sub':it.get('sub',''),'cost':it['cost'],'type':typ,'set':setc,'squares':it.get('squares',0),'img':'img/hon/v1/%s/tiles/%s.webp'%(nid,tid),'w':W,'h':H,'sheet':M['sheet'],'units':it.get('units') or ([[nm,1,'character']] if typ=='hero' else []),'slots':slots,'own':[]}
            if it.get('note'): t['note']=it['note']
            D['tiles'].append(t); Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(R+t['img'],'WEBP',quality=88,method=6)
            v=c.copy()
            for s in slots: cv2.rectangle(v,(int(s['x']*W),int(s['y']*H)),(int((s['x']+s['w'])*W),int((s['y']+s['h'])*H)),(0,0,255),6)
            dbg.append(v); print(nid,'T',nm,it['cost'],W,H,[s['size']+':'+'/'.join(s['stripes']) for s in slots])
        else:
            code=it['stripes']; size=it.get('size') or ('w' if W/H>0.95 else 'n'); oid=slug(nm)
            same=[o for o in D['options'] if o['name']==nm and o['cost']==it['cost'] and o['stripes']==code and o['size']==size]
            if same: print('dup',nm); continue
            if any(o['id']==oid for o in D['options']): oid+='_'+slug(M['sheet'])
            o={'id':oid,'name':nm,'cat':it.get('cat','gear'),'cost':it['cost'],'squares':it.get('squares',0),'set':setc,'size':size,'stripes':code,'img':'img/hon/v1/%s/options/%s.webp'%(nid,oid),'w':W,'h':H,'sheet':M['sheet']}
            if it.get('units'): o['units']=it['units']
            if it.get('note'): o['note']=it['note']
            D['options'].append(o); Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(R+o['img'],'WEBP',quality=88,method=6)
            dbg.append(c.copy()); print(nid,'O',nm,it['cost'],size,code,W,H)
if '--dry' not in sys.argv:
    for n,d in data.items(): open(R+'data/hon-v1-%s.js'%n,'w').write('window.HTS_DATA = window.HTS_DATA || {};\nHTS_DATA["hon-v1-%s"] = '%n+json.dumps(d,indent=1,ensure_ascii=False)+';\n')
Hh=260; ims=[Image.fromarray(cv2.cvtColor(v,cv2.COLOR_BGR2RGB)) for v in dbg]; ims=[i.resize((int(i.width*Hh/i.height),Hh)) for i in ims]
x=y=0; out=Image.new('RGB',(1500,3000),'#555')
for i in ims:
    if x+i.width>1500: x=0; y+=Hh+8
    out.paste(i,(x,y)); x+=i.width+8
out.crop((0,0,1500,y+Hh+8)).save('manual_check.png'); print({n:(len(d['tiles']),len(d['options'])) for n,d in data.items()})
