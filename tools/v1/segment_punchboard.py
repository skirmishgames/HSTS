import cv2,numpy as np,sys,os,json
from PIL import Image
Image.MAX_IMAGE_PIXELS=None
def segment(path,outdir,tag):
    im=cv2.imread(path); h,w=im.shape[:2]
    # background colour = median of border pixels
    border=np.concatenate([im[:40].reshape(-1,3),im[-40:].reshape(-1,3),im[:,:40].reshape(-1,3),im[:,-40:].reshape(-1,3)])
    bg=np.median(border,axis=0)
    d=np.abs(im.astype(int)-bg).sum(axis=2)
    hsv=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(int); bh=cv2.cvtColor(np.uint8([[bg]]),cv2.COLOR_BGR2HSV)[0,0].astype(int)
    dh=np.abs(hsv[:,:,0]-bh[0]); dh=np.minimum(dh,180-dh); green=((dh<14)|(bh[1]<45))&(np.abs(hsv[:,:,1]-bh[1])<(70 if bh[1]>=45 else 38))&(np.abs(hsv[:,:,2]-bh[2])<(75 if bh[1]>=45 else 55))
    fg=(~green).astype(np.uint8)*255
    fg=cv2.morphologyEx(fg,cv2.MORPH_OPEN,np.ones((7,7),np.uint8))
    K=int(os.environ.get('CLOSE','9')); fg=cv2.morphologyEx(fg,cv2.MORPH_CLOSE,np.ones((K,K),np.uint8))
    cs,_=cv2.findContours(fg,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE); fg[:]=0
    for c in cs:
        x,y,w2,h2=cv2.boundingRect(c)
        if w2>90 and h2>90: cv2.rectangle(fg,(x,y),(x+w2,y+h2),255,-1)
    n,lab,st,_=cv2.connectedComponentsWithStats(fg,8)
    os.makedirs(outdir,exist_ok=True); out=[]
    boxes=[st[i] for i in range(1,n) if st[i][4]>12000 and st[i][2]>90 and st[i][3]>90]
    boxes.sort(key=lambda b:(round(b[1]/250),b[0]))
    for k,(x,y,bw,bh,a) in enumerate(boxes):
        p=16; c=im[max(0,y-p):y+bh+p,max(0,x-p):x+bw+p]
        name='%s_%02d.png'%(tag,k+1); cv2.imwrite(os.path.join(outdir,name),c)
        out.append({'file':name,'x':int(x),'y':int(y),'w':int(bw),'h':int(bh)})
    vis=im.copy()
    for k,b in enumerate(out):
        cv2.rectangle(vis,(b['x'],b['y']),(b['x']+b['w'],b['y']+b['h']),(0,0,255),6); cv2.putText(vis,str(k+1),(b['x']+10,b['y']+70),cv2.FONT_HERSHEY_SIMPLEX,2.2,(255,255,255),8); cv2.putText(vis,str(k+1),(b['x']+10,b['y']+70),cv2.FONT_HERSHEY_SIMPLEX,2.2,(0,0,255),4)
    cv2.imwrite(os.path.join(outdir,tag+'_map.jpg'),cv2.resize(vis,None,fx=0.42,fy=0.42))
    json.dump(out,open(os.path.join(outdir,tag+'.json'),'w'))
    return len(out)
if __name__=='__main__': print(segment(sys.argv[1],sys.argv[2],sys.argv[3]))
