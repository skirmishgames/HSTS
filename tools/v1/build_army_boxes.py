import json,os,re,cv2,numpy as np
from PIL import Image
P=json.load(open('pieces/all.json'))
OUT='build/'; 
NAT={'us':('us','hon1-army-box-us','United States'),'ge':('ge','hon1-army-box-ge','Germany'),'cw':('uk','hon1-army-box-cw','Commonwealth')}
# sheet -> platoon stripe code (compound code, one per tile)
SHEET={'us2':'YRB','us3':'GOG','us4':'GLG','ge1':'RWR','ge2':'GWG','ge3':'GW','cw2':'RWM','cw3':'YR','cw5':'YGY'}
CMD={'us1','ge4','cw1','cw4'}
L4=[[0.019,0.19,0.213,0.76,'w'],[0.242,0.19,0.164,0.76,'n'],[0.592,0.19,0.164,0.76,'n'],[0.767,0.19,0.214,0.76,'w']]
L3=[[0.024,0.19,0.207,0.76,'n'],[0.245,0.19,0.207,0.76,'n'],[0.707,0.19,0.270,0.76,'w']]
def slug(s): return re.sub(r'[^a-z0-9]+','_',s.lower().replace('é','e').replace('è','e')).strip('_')
def halfcode(c,x0,x1,y0,y1):
    reg=cv2.cvtColor(c[y0:y1,x0:x1],cv2.COLOR_BGR2HSV).reshape(-1,3).astype(int)
    S=np.percentile(reg[:,1],80); V=np.percentile(reg[:,2],80)
    # dark band present and no vivid colour -> K
    vivid=((reg[:,1]>110)&(reg[:,2]>110)).mean(); white=((reg[:,1]<40)&(reg[:,2]>200)).mean()
    return 'T' if (vivid>0.18 or white>0.18) else 'K'
data={}; rep=[]
for it in P:
    n=it['nation']; nid,setc,_=NAT[n]; sh=it['file'].split('_')[0]
    c=cv2.imread('up/%s/%s'%(n,it['file']))
    if it['file']=='ge2_01.png': c=c[0:605,298:2200]
    D=data.setdefault(nid,{'tiles':[],'options':[]})
    if it['kind']=='tile':
        H,W=c.shape[:2]; tid=slug(it['name']+('_'+it['sub'].split(',')[0] if it.get('tile_type')=='command' and it.get('sub') else ''))
        typ='hero' if W<700 else ('command' if sh in CMD and W>1000 else 'platoon')
        code='cmd' if typ=='command' else SHEET.get(sh)
        lay=[] if typ=='hero' else (L4 if W>1800 else L3); slots=[]
        for (x,y,w,h,sz) in lay:
            x0,x1,y0,y1=int(x*W),int((x+w)*W),int((y+0.32*h)*H),int((y+0.68*h)*H); q=int((x1-x0)*0.16)
            a=halfcode(c,x0+8,x0+q,y0,y1); b=halfcode(c,x1-q,x1-8,y0,y1)
            st=[]
            for hc in (a,b):
                v=code if hc=='T' else 'K'
                if v not in st: st.append(v)
            slots.append({'x':x,'y':y,'w':w,'h':h,'size':sz,'stripes':st})
        nm=it['name']; note=it.get('notes') or ''
        t={'id':tid,'name':nm,'sub':it.get('sub') or '','cost':it['cost'],'type':typ,'set':setc,'squares':it.get('breaking_point') or 0,'img':'img/hon/v1/%s/tiles/%s.webp'%(nid,tid),'w':W,'h':H,'sheet':'Army Box '+sh,'units':[[u[0],u[1]] for u in (it.get('units') or [])],'slots':slots,'own':[]}
        m=re.search(r'(\d00\+)',note); 
        if m: t['note']='Army size '+m.group(1)+' points.'
        D['tiles'].append(t); os.makedirs(OUT+'img/hon/v1/%s/tiles'%nid,exist_ok=True)
        Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(OUT+t['img'],'WEBP',quality=88,method=6)
        rep.append('%s T %-34s %4s %s %s'%(nid,nm[:34],it['cost'],typ,' | '.join(s['size']+':'+'/'.join(s['stripes']) for s in slots)))
    else:
        H,W=c.shape[:2]; oid=slug(it['name'] or 'smoke')
        if it['file']=='cw1_16.png': it['name']='Smoke'; it['cost']=10; it['markers']='X3'; oid='smoke'
        # edge darkness -> K
        e=cv2.cvtColor(np.concatenate([c[int(H*.3):int(H*.7),2:14],c[int(H*.3):int(H*.7),W-14:W-2]],axis=1),cv2.COLOR_BGR2HSV).reshape(-1,3).astype(int)
        vivid=((e[:,1]>110)&(e[:,2]>110)).mean(); white=((e[:,1]<40)&(e[:,2]>200)).mean(); dark=(e[:,2]<70).mean()
        ls=[x.lower() for x in (it.get('stripes') or [])]
        isK=('black' in ls) and not any(x in ls for x in ('red','white','blue','yellow','orange','light blue'))
        code='K' if isK else ('cmd' if sh in CMD else SHEET.get(sh,'K'))
        nc=(it.get('name_colour') or '').lower(); cat='order' if nc=='yellow' else ('gear' if nc=='red' else ('support' if nc=='white' else ('order' if code=='cmd' else 'support')))
        ids=[o['id'] for o in D['options']]
        if oid in ids:
            prev=[o for o in D['options'] if o['id']==oid][0]
            if prev['cost']==it['cost'] and prev['stripes']==[code]: continue
            oid=oid+'_'+str(it['cost'])
            if oid in ids: oid+= '_'+sh
        o={'id':oid,'name':it['name'],'cat':cat,'cost':it['cost'],'squares':it.get('breaking_point') or 0,'set':setc,'size':'w' if W>=330 else 'n','stripes':[code],'img':'img/hon/v1/%s/options/%s.webp'%(nid,oid),'w':W,'h':H,'sheet':'Army Box '+sh}
        if it.get('units'): o['units']=[[u[0],u[1]] for u in it['units']]
        if it.get('markers'): o['note']='Markers: '+it['markers']+'.'
        D['options'].append(o); os.makedirs(OUT+'img/hon/v1/%s/options'%nid,exist_ok=True)
        Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(OUT+o['img'],'WEBP',quality=88,method=6)
        rep.append('%s O %-22s %4s %s %s %s %dx%d'%(nid,(it['name'] or '')[:22],it['cost'],o['size'],code,cat,W,H))
json.dump(data,open(OUT+'v1.json','w'),indent=1); print('\n'.join(rep))
for k,v in data.items(): print(k,len(v['tiles']),len(v['options']))
