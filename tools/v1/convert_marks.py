import json,cv2,numpy as np
E='/mnt/user-data/uploads/Heroes System/Sorted/Boxes/First edition/Expansions/'
def snap(g,x0,y0,x1,y1,win=45):
    gx=np.abs(cv2.Sobel(g,cv2.CV_32F,1,0,ksize=3)); gy=np.abs(cv2.Sobel(g,cv2.CV_32F,0,1,ksize=3)); H,W=g.shape
    def best(arr,c): a=max(0,c-win); b=min(len(arr)-1,c+win); return a+int(np.argmax(arr[a:b+1]))
    ys=slice(max(0,y0+60),min(H,y1-60)); xs=slice(max(0,x0+60),min(W,x1-60))
    return best(gx[ys,:].mean(axis=0),x0),best(gy[:,xs].mean(axis=1),y0),best(gx[ys,:].mean(axis=0),x1),best(gy[:,xs].mean(axis=1),y1)
K=['K']
CFG={
 'us_airborne':dict(set='hon1-us-airborne',slots={'Jamie "Clem" Kilmister':[K,['H_clem','K']]},opt={},default='K'),
 'us_private_bryan':dict(set='hon1-private-bryan',slots={'James F. Bryan':[['K','H_bryan']]},opt={'Bazooka':'H_bryan'},default='K'),
 'gazette_1':dict(set='hon1-gazette-1',slots={},opt={},default='K',skip=['Achtung Minen!']),
 'ge_airborne':dict(set='hon1-ge-airborne',slots={'Sebastian Jakobus':[K,['H_jakobus','K']]},opt={},default='K',asopt=['Feldwebel']),
 'ge_goering_1':dict(set='hon1-goering-and-his-armoured-train',slots={'Panzerzug N32':[['KWKZ'],['KWKZ','K'],['K','KWKZ'],['K','KWKZ']]},opt={"Goering's Baton of Power":'H_goering','MP40':'H_goering'},default='KWKZ',asopt=['Zugpersonal'],cost0=['Panzerzug N32']),
 'ge_karl_von_croc':dict(set='hon1-karl-von-kroc',slots={'Karl von Croc':[['K','H_croc']]},opt={'Geballte Ladung':'H_croc'},default='K'),
 'ge_steiner':dict(set='hon1-steiner-kampfgruppe',slots={'Steiner Kampfgruppe':[['TKT','K']]*4},opt={},default='K'),
 'cw_airborne':dict(set='hon1-uk-airborne',slots={'Sir Julian Binus':[['RR','K'],['H_binus','RR']]},opt={},default='RR'),
 'gazette_7_1':dict(set='hon1-gazette-7',slots={'Commandos':[['YBY'],['YBY','RBR'],['K','RBR'],['K','YBY']],'Philippe Kieffer':[['K','cmd']]},opt={},default='YBY',typ={'Commandos':'platoon'}),
 'gazette_8':dict(set='hon1-gazette-8',slots={'Maquisards':[['BWR'],['H_maq','BWR']],'Reserve Gebirgsjäger Regiment I':[['WBW'],['H_geb','K']]},opt={"Garde d'Honneur":'RWBWR','Gebirgsjäger':'WBW'},default='BWR'),
 'pointe_du_hoc':dict(set='hon1-pointe-du-hoc',slots={'Lt Col James Earl Rudder':[['cmd','K'],K,['K','cmd']],'Joseph Legalec':[['H_legalec']],'Rangers Weapon Platoon':[['RKR','K'],K,['K','RKR']]},opt={'Offensive Grenades':'K','Incendiary Grenades':'K','Artillery':'cmd'},default='RKR',skip=['Oar'],typ={'Lt Col James Earl Rudder':'command'}),
}
for n,C in CFG.items():
    M=json.load(open('m2/%s.json'%n)); sh=cv2.imread(E+M['src']); g=cv2.cvtColor(sh,cv2.COLOR_BGR2GRAY); out=[]
    for p in M['pieces']:
        nm=p['name']
        if nm in C.get('skip',[]): continue
        if p.get('cost') is None and nm not in C.get('cost0',[]): continue
        x0,y0,x1,y1=p['box']
        if p.get('snap',True): x0,y0,x1,y1=snap(g,x0,y0,x1,y1)
        rot=p.get('rot',0); kindp='option' if nm in C.get('asopt',[]) else p['kind']
        q={'kind':kindp,'name':nm,'cost':p.get('cost') or 0,'rot':rot,'snap':False,'squares':p.get('squares') or 0}
        if p.get('nat'): q['nat']=p['nat']
        us=[[u[0],u[1],'infantry'] for u in (p.get('units') or []) if u and u[0]]
        if kindp=='tile':
            sl=[]; codes=C['slots'].get(nm,[])
            for s,c in zip(p.get('slots') or [],codes):
                a,b,cc,d=s['box']; sl.append({'box':s['box'],'size':'w' if ((cc-a)/(d-b)>0.87 and (p.get('type') or 'hero')!='hero') else 'n','stripes':c})
            q.update(box=[x0,y0,x1,y1],sub=p.get('sub') or '',type=C.get('typ',{}).get(nm,p.get('type') or 'hero'),slots=sl)
            if q['type']=='hero': us=[[u[0],u[1],'character'] for u in us]
            if us: q['units']=us
            if nm in C.get('cost0',[]): q['note']='The cost tab on the tile prints N/A. Entered as 0 points.'
        else:
            bw,bh=(x1-x0,y1-y0) if rot in(0,180) else (y1-y0,x1-x0)
            size='w' if nm in ('Commandos','Section K-Gun','Section Anti-Tank','SOE Agents','Gebirgsjäger','Gunners Squad','Zugpersonal') or (nm=='Artillery' and p.get('cost')==50) else 'n'
            if p.get('snap',True):
                if rot in(0,180): x0-=30; x1+=30
                else: y0-=30; y1+=30
            nc=(p.get('name_colour') or '').lower()
            q.update(box=[x0,y0,x1,y1],stripes=[C['opt'].get(nm,C['default'])],size=size,cat='order' if nc=='yellow' else ('gear' if nc=='red' else ('support' if us else 'gear')))
            if us: q['units']=us
            if p.get('markers'): q['note']='Markers: %s.'%p['markers']
        if 'French FFI' in (p.get('notes') or ''): q['note']=(q.get('note','')+' French FFI, filed under United States until there is a French nation.').strip()
        out.append(q)
    json.dump({'src':M['src'],'nat':M.get('nat','us'),'set':C['set'],'sheet':M['sheet'],'pieces':out},open('manual/%s.json'%n,'w'),indent=1,ensure_ascii=False)
    print(n,len(out))
