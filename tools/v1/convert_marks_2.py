import json,cv2,numpy as np
E='/mnt/user-data/uploads/Heroes System/Sorted/Boxes/First edition/Expansions/'
def snap(g,x0,y0,x1,y1,win=45):
    gx=np.abs(cv2.Sobel(g,cv2.CV_32F,1,0,ksize=3)); gy=np.abs(cv2.Sobel(g,cv2.CV_32F,0,1,ksize=3)); H,W=g.shape
    def best(arr,c): a=max(0,c-win); b=min(len(arr)-1,c+win); return a+int(np.argmax(arr[a:b+1]))
    ys=slice(max(0,y0+60),min(H,y1-60)); xs=slice(max(0,x0+60),min(W,x1-60))
    return best(gx[ys,:].mean(axis=0),x0),best(gy[:,xs].mean(axis=1),y0),best(gx[ys,:].mean(axis=0),x1),best(gy[:,xs].mean(axis=1),y1)
K=['K']
import sys
WIDE=('Commandos','Section K-Gun','Section Anti-Tank','SOE Agents','Gebirgsjäger','Gunners Squad','Zugpersonal','FFI Squad','Saboteurs','Hundestaffel','Untersuchung','M8 Scott','Panzer II Luchs','Sailors')
KO=['KO']
CFG={
 'a/cuf_1':dict(set='hon1-civilians-under-fire',slots={'Alexandre Renaud':[['H_renaud']],'Bernard Ferrand':[['H_ferrand']]},opt={},default='BWR'),
 'a/cuf_3':dict(set='hon1-civilians-under-fire',slots={'Ilda':[['KWKI','K'],['KWKI','K'],['K','KWKI']]},opt={'Heroic':'BWR'},default='K',typ={'Ilda':'platoon'}),
 'a/cuf_4':dict(set='hon1-civilians-under-fire',slots={'FFI':[['BWR'],['BWR'],['BWR']]},opt={},default='BWR',typ={'FFI':'platoon'}),
 'b/lovat_1':dict(set='hon1-lord-lovat-s-commandos',slots={},opt={},default='NRN',typ={"Lord Lovat's Commandos":'platoon'},rel={"Lord Lovat's Commandos":[[0.02,0.22,0.185,0.73,'n',['NRN']],[0.21,0.22,0.185,0.73,'n',['NRN','K']],[0.795,0.22,0.185,0.73,'w',['K','NRN']]]}),
 'b/extra_us':dict(set='hon1-extra-units-us-and-ge',slots={},opt={},default='K'),
 'b/extra_ge':dict(set='hon1-extra-units-us-and-ge',slots={},opt={},default='K'),
 'b/gazette_6':dict(set='hon1-gazette-6',slots={'Feldwebel':[KO,KO],'Sergeant':[KO,KO]},opt={},default='KO',typ={'Feldwebel':'command','Sergeant':'command'}),
 'b/ventura_1':dict(set='hon1-the-ventura-and-smugglers',nat='fr',slots={'Ventura':[['WG']]},opt={},default='WG',typ={'Ventura':'platoon'},rel={'Seb "Trouvetou" Delobel':[[0.05,0.25,0.28,0.66,'n',['WG']],[0.67,0.25,0.28,0.66,'n',['WG']]]}),
}
BASE='m3/'
for n,C in CFG.items():
    M=json.load(open(BASE+'%s.json'%n)); sh=cv2.imread(E+M['src']); g=cv2.cvtColor(sh,cv2.COLOR_BGR2GRAY); out=[]
    for p in M['pieces']:
        nm=p['name']
        if nm in C.get('skip',[]): continue
        if p.get('cost') is None and nm not in C.get('cost0',[]): continue
        x0,y0,x1,y1=p['box']
        if p.get('snap',True): x0,y0,x1,y1=snap(g,x0,y0,x1,y1)
        rot=p.get('rot',0); kindp='option' if nm in C.get('asopt',[]) else p['kind']
        q={'kind':kindp,'name':nm,'cost':p.get('cost') or 0,'rot':rot,'snap':False,'squares':p.get('squares') or 0}
        if p.get('nat'): q['nat']=p['nat']
        if C.get('nat'): q['nat']=C['nat']
        if nm in C.get('rel',{}): q['slots_rel']=C['rel'][nm]
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
            size='w' if nm in WIDE else 'n'
            if p.get('snap',True):
                if rot in(0,180): x0-=30; x1+=30
                else: y0-=30; y1+=30
            nc=(p.get('name_colour') or '').lower()
            q.update(box=[x0,y0,x1,y1],stripes=[C['opt'].get(nm,C['default'])],size=size,cat='order' if nc=='yellow' else ('gear' if nc=='red' else ('support' if us else 'gear')))
            if us: q['units']=us
            if p.get('markers'): q['note']='Markers: %s.'%p['markers']
        if 'French FFI' in (p.get('notes') or ''): q['note']=(q.get('note','')+' French FFI, filed under United States until there is a French nation.').strip()
        out.append(q)
    json.dump({'src':M['src'],'nat':M.get('nat','us'),'set':C['set'],'sheet':M['sheet'],'pieces':out},open('manual/%s.json'%n.replace('/','_'),'w'),indent=1,ensure_ascii=False)
    print(n,len(out))
