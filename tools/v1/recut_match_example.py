import cv2,numpy as np,json,glob,os,sys,re,subprocess
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
SH='/mnt/user-data/uploads/Heroes System/Sorted/Boxes/Bloody Omaha/Punchboards/'
R='/home/claude/hsts/'
js=subprocess.check_output(['node','-e','''
global.window={HTS_DATA:{}};global.HTS_DATA=window.HTS_DATA;["hon-bro-us","hon-bro-ge"].forEach(f=>require("/home/claude/hsts/data/"+f+".js"));
const out=[];for(const k in HTS_DATA){const D=HTS_DATA[k];D.tiles.filter(t=>t.set==="BO").forEach(t=>out.push({k,kind:"tile",id:t.id,img:t.img,w:t.w,h:t.h}));D.options.filter(o=>o.set==="BO").forEach(o=>out.push({k,kind:"opt",id:o.id,img:o.img,w:o.w,h:o.h}))}
console.log(JSON.stringify(out))'''])
items=json.loads(js)
scales=[0.34,0.37,0.40,0.43,0.46,0.50,0.55,0.60]
sheets={}
for f in sorted(glob.glob(SH+'*.png')):
    im=cv2.imread(f); sheets[os.path.basename(f)]=im
print(len(items),'items',len(sheets),'sheets')
small={}
for n,im in sheets.items():
    for s in scales: small[(n,s)]=cv2.cvtColor(cv2.resize(im,None,fx=s,fy=s,interpolation=cv2.INTER_AREA),cv2.COLOR_BGR2GRAY)
res=[]
for it in items:
    t=np.array(Image.open(R+it['img']).convert('RGBA'))
    a=t[:,:,3]; g=cv2.cvtColor(t[:,:,:3],cv2.COLOR_RGB2GRAY)
    mask=(a>200).astype(np.uint8)*255
    # central region only, avoids rounded corners
    h,w=g.shape; m=int(min(h,w)*0.08); gc=g[m:h-m,m:w-m]
    best=(-1,)
    for (n,s),sm in small.items():
        if gc.shape[0]>=sm.shape[0] or gc.shape[1]>=sm.shape[1]: continue
        r=cv2.matchTemplate(sm,gc,cv2.TM_CCOEFF_NORMED); _,mx,_,loc=cv2.minMaxLoc(r)
        if mx>best[0]: best=(mx,n,s,loc)
    mx,n,s,loc=best
    # refine scale
    full=cv2.cvtColor(sheets[n],cv2.COLOR_BGR2GRAY); bb=(mx,s,loc)
    for s2 in np.arange(s-0.03,s+0.031,0.005):
        x0=int((loc[0]-30)/s*s2); y0=int((loc[1]-30)/s*s2)
        sm=cv2.resize(full,None,fx=s2,fy=s2,interpolation=cv2.INTER_AREA)
        x0=max(0,x0); y0=max(0,y0); reg=sm[y0:y0+gc.shape[0]+90,x0:x0+gc.shape[1]+90]
        if reg.shape[0]<gc.shape[0] or reg.shape[1]<gc.shape[1]: continue
        r=cv2.matchTemplate(reg,gc,cv2.TM_CCOEFF_NORMED); _,m2,_,l2=cv2.minMaxLoc(r)
        if m2>bb[0]: bb=(m2,s2,(x0+l2[0],y0+l2[1]))
    mx,s,loc=bb
    X=(loc[0]-m)/s; Y=(loc[1]-m)/s; W=w/s; H=h/s
    it.update(score=round(float(mx),3),sheet=n,scale=round(float(s),4),box=[round(X),round(Y),round(W),round(H)])
    res.append(it); print(it['k'][-2:],it['kind'],it['id'],it['w'],it['h'],'->',it['score'],n[21:-4],it['scale'],it['box'][2:],flush=True)
json.dump(res,open('match.json','w'),indent=0)
