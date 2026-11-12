import json,os,re,cv2,numpy as np,sys
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
E='/mnt/user-data/uploads/Heroes System/Sorted/Boxes/First edition/Expansions/'
R='/home/claude/hsts/'
L4=[[0.019,0.19,0.213,0.76,'w'],[0.242,0.19,0.164,0.76,'n'],[0.592,0.19,0.164,0.76,'n'],[0.767,0.19,0.214,0.76,'w']]
LAY={'wittmann':[[0.030,0.225,0.227,0.70,'w'],[0.609,0.225,0.174,0.70,'n'],[0.794,0.225,0.174,0.70,'n']],
     'hobart':[[0.020,0.198,0.271,0.752,'w'],[0.549,0.198,0.208,0.752,'n'],[0.771,0.198,0.207,0.752,'n']],
     'para':[[0.0135,0.21,0.202,0.757,'w'],[0.225,0.21,0.156,0.757,'n'],[0.620,0.21,0.154,0.757,'n'],[0.785,0.21,0.202,0.757,'w']],
     'speirs':[[0.524,0.196,0.422,0.77,'n']]}
SETS=[
 dict(dir='gesspanzergran',src="GE SS Panzergranadiere/GE SS Panzergranadiere Punchboard 1 Front.png",nat='ge',set='hon1-ss-panzergrenadiere',code='KWK',K=['Magnetic Mine','Stummel'],sheet='SS Panzergrenadiere'),
 dict(dir='gewittmannstig',src="GE Wittmann's Tigers/GE Wittmann's Tigers Punchboard 1 Front.png",nat='ge',set='hon1-wittmann-s-tigers',code='KRK',K=[],CMD=['Blitzkrieg','Field Artillery','Artillery'],lay={'Hauptsturmführer M. Wittmann':'wittmann'},slotfix={'Hauptsturmführer M. Wittmann':[['KRK','cmd']]*3},typ={'Hauptsturmführer M. Wittmann':'platoon'},sheet="Wittmann's Tigers"),
 dict(dir='cwbritishweapo',src="CW British Weapons Platoon/CW British Weapons Platoon Punchboard 1 Front.png",nat='uk',set='hon1-east-yorkshire-regiment',code='WRW',K=['Universal Carrier','Hardboiled'],sheet='East Yorkshire Regiment'),
 dict(dir='cwcanadianplat',src="CW Canadian Platoon/CW Canadian Platoon Punchboard 1 Front.png",nat='uk',set='hon1-royal-winnipeg-rifles',code='GKG',K=['Grenade'],sheet='Royal Winnipeg Rifles',fixbox={'cwcanadianplat1_09.png':(0,0,70,0)}),
 dict(dir='gazette2',src="Gazette 2/Gazette 2 Punchboard 1 Front.png",nat='uk',set='hon1-gazette-2',code='cmd',K=['APC Shells','HE Shells','Sherman Crab','Churchill Crocodile','Churchill Ark Mark 1'],lay={'Percy Hobart':'hobart'},typ={'Percy Hobart':'command'},sheet='Gazette 2',fixbox={'gazette21_07.png':(0,70,0,0)}),
 dict(dir='gazette3',src="Gazette 3/Gazette 3 Punchboard 1 Front.png",nat='us',set='hon1-gazette-3',code='BGB',K=[],lay={'US Paratroopers':'para','Lt. Ronald Speirs':'speirs'},rotfix={'gazette31_13.png':180},sheet='Gazette 3'),
 dict(dir='usrifleplatoon',src="US Rifle Platoon/US Rifle Platoon Punchboard 1 Front.png",nat='us',set='hon1-us-rifle-platoon',code='YLB',K=['Halftrack','Grenade'],sheet='US Rifle Platoon'),
 dict(dir='usrangers',src="US Rangers/US Rangers Punchboard 1 Front.png",nat='us',set='hon1-us-rangers',code='BYB',K=[],sheet='US Rangers'),
]
VEH=re.compile(r'sherman|m10|panzer|stug|panther|tiger|sd\.?kfz|schwimmwagen|carrier|staghound|churchill|cromwell|firefly|willys|m20|goliath|halftrack|stummel|crab|ark|trailer',re.I)
OFF=re.compile(r'^(lt\.?|sgt\.?|ob\.?|c\.|cpt\.?|captain|col\.?|obersturmf|hauptsturmf)',re.I)
def kind(n,hero=False): return 'character' if hero else ('officer' if OFF.match(n) else ('vehicle' if VEH.search(n) else 'infantry'))
def slug(s): return re.sub(r'[^a-z0-9]+','_',s.lower().replace('é','e').replace('è','e').replace('ü','u')).strip('_')
def halfcode(c,x0,x1,y0,y1):
    reg=cv2.cvtColor(c[y0:y1,x0:x1],cv2.COLOR_BGR2HSV).reshape(-1,3).astype(int)
    vivid=((reg[:,1]>110)&(reg[:,2]>110)).mean(); white=((reg[:,1]<40)&(reg[:,2]>200)).mean()
    return 'T' if (vivid>0.18 or white>0.18) else 'K'
data={}
for n in ('us','ge','uk'):
    s=open(R+'data/hon-v1-%s.js'%n).read(); data[n]=json.loads(s[s.index('= {')+2:s.rindex(';')])
rep=[]
for S in SETS:
    if S['set'] in {t['set'] for t in data[S['nat']]['tiles']}: print('already in',S['set']); continue
    L=[x for x in json.load(open('out2/%s/labels.json'%S['dir'])) if x['kind'] in('tile','option')]
    boxes=json.load(open('out2/%s/%s1.json'%(S['dir'],S['dir']))); sh=cv2.imread(E+S['src']); D=data[S['nat']]; nid=S['nat']
    for it in L:
        b=boxes[int(it['file'].split('_')[1][:2])-1]; x,y,w,h=b['x'],b['y'],b['w'],b['h']
        l,t,r,bt=S.get('fixbox',{}).get(it['file'],(0,0,0,0)); x-=l; y-=t; w+=l+r; h+=t+bt
        p=4; c=sh[max(0,y-p):y+h+p,max(0,x-p):x+w+p]
        rot=((it.get('rotation') or 0)+S.get('rotfix',{}).get(it['file'],0))%360
        if rot: c=np.ascontiguousarray(np.rot90(c,k=(4-rot//90)%4))
        H,W=c.shape[:2]; nm=it['name']
        if it['kind']=='tile':
            typ=S.get('typ',{}).get(nm) or ('hero' if W<1000 else 'platoon'); code='cmd' if typ=='command' else S['code']
            lay=LAY[S['lay'][nm]] if nm in S.get('lay',{}) else ([] if W<1000 else L4); slots=[]
            for i,(sx,sy,sw,shh,sz) in enumerate(lay):
                x0,x1,y0,y1=int(sx*W),int((sx+sw)*W),int((sy+0.32*shh)*H),int((sy+0.68*shh)*H); q=int((x1-x0)*0.16)
                st=[]
                for hc in (halfcode(c,x0+8,x0+q,y0,y1),halfcode(c,x1-q,x1-8,y0,y1)):
                    v=code if hc=='T' else 'K'
                    if v not in st: st.append(v)
                if nm in S.get('slotfix',{}): st=S['slotfix'][nm][i]
                slots.append({'x':sx,'y':sy,'w':sw,'h':shh,'size':sz,'stripes':st})
            tid=slug(nm)
            if any(t['id']==tid for t in D['tiles']): tid+='_'+slug(S['sheet'])
            t={'id':tid,'name':nm,'sub':it.get('sub') or '','cost':it['cost'],'type':typ,'set':S['set'],'squares':it.get('breaking_point') or 0,'img':'img/hon/v1/%s/tiles/%s.webp'%(nid,tid),'w':W,'h':H,'sheet':S['sheet'],'units':[[u[0],u[1],kind(u[0],typ=='hero')] for u in (it.get('units') or [])] or ([[nm,1,'character']] if typ=='hero' else []),'slots':slots,'own':[]}
            D['tiles'].append(t); Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(R+t['img'],'WEBP',quality=88,method=6)
            rep.append('%s T %-30s %4s %s %s'%(nid,nm[:30],it['cost'],typ,' | '.join(s['size']+':'+'/'.join(s['stripes']) for s in slots)))
        else:
            code='K' if nm in S['K'] else ('cmd' if nm in S.get('CMD',[]) else S['code'])
            nc=(it.get('name_colour') or '').lower(); cat='order' if nc=='yellow' else ('gear' if nc=='red' else 'support')
            size='w' if W>=330 else 'n'; oid=slug(nm)
            same=[o for o in D['options'] if o['name']==nm and o['cost']==it['cost'] and o['stripes']==[code] and o['size']==size]
            if same: rep.append('%s O %-22s duplicate of %s, skipped'%(nid,nm,same[0]['id'])); continue
            if any(o['id']==oid for o in D['options']): oid+='_'+slug(S['sheet'])
            o={'id':oid,'name':nm,'cat':cat,'cost':it['cost'],'squares':it.get('breaking_point') or 0,'set':S['set'],'size':size,'stripes':[code],'img':'img/hon/v1/%s/options/%s.webp'%(nid,oid),'w':W,'h':H,'sheet':S['sheet']}
            if it.get('units'): o['units']=[[u[0],u[1],kind(u[0])] for u in it['units']]
            if it.get('markers'): o['note']='Markers: '+it['markers']+'.'
            D['options'].append(o); Image.fromarray(cv2.cvtColor(c,cv2.COLOR_BGR2RGB)).save(R+o['img'],'WEBP',quality=88,method=6)
            rep.append('%s O %-22s %4s %s %s %s'%(nid,nm[:22],it['cost'],size,code,cat))
for n,d in data.items():
    open(R+'data/hon-v1-%s.js'%n,'w').write('window.HTS_DATA = window.HTS_DATA || {};\nHTS_DATA["hon-v1-%s"] = '%n+json.dumps(d,indent=1,ensure_ascii=False)+';\n'); print(n,len(d['tiles']),len(d['options']))
print('\n'.join(rep))
