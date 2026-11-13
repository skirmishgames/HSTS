"""Check tool for hand-marked pieces. Usage: python3 mark_check.py <marks.json> <out.png>
Cuts every piece in the marks file from its sheet (snapping each side to the nearest strong edge unless "snap": false),
draws slot boxes in red, and writes a contact sheet with the name and cost above each cut. Writes nothing else."""
import json,sys,cv2,numpy as np
from PIL import Image,ImageDraw
Image.MAX_IMAGE_PIXELS=None
E='/mnt/user-data/uploads/Heroes System/Sorted/Boxes/First edition/Expansions/'
def snap(g,x0,y0,x1,y1,win=45):
    gx=np.abs(cv2.Sobel(g,cv2.CV_32F,1,0,ksize=3)); gy=np.abs(cv2.Sobel(g,cv2.CV_32F,0,1,ksize=3)); H,W=g.shape
    def best(arr,c): a=max(0,c-win); b=min(len(arr)-1,c+win); return a+int(np.argmax(arr[a:b+1]))
    ys=slice(max(0,y0+60),min(H,y1-60)); xs=slice(max(0,x0+60),min(W,x1-60))
    colx=gx[ys,:].mean(axis=0); rowy=gy[:,xs].mean(axis=1)
    return best(colx,x0),best(rowy,y0),best(colx,x1),best(rowy,y1)
M=json.load(open(sys.argv[1])); sh=cv2.imread(E+M['src']); g=cv2.cvtColor(sh,cv2.COLOR_BGR2GRAY); cells=[]
for it in M['pieces']:
    x0,y0,x1,y1=it['box']
    if it.get('snap',True): x0,y0,x1,y1=snap(g,x0,y0,x1,y1)
    v=sh[y0:y1,x0:x1].copy()
    for s in it.get('slots',[]):
        a,b,c,d=s['box']; cv2.rectangle(v,(a-x0,b-y0),(c-x0,d-y0),(0,0,255),6)
    rot=it.get('rot',0)
    if rot: v=np.ascontiguousarray(np.rot90(v,k=(4-rot//90)%4))
    im=Image.fromarray(cv2.cvtColor(v,cv2.COLOR_BGR2RGB)); Hh=250; im=im.resize((max(1,int(im.width*Hh/im.height)),Hh))
    c=Image.new('RGB',(max(im.width,230),Hh+16),'#333'); c.paste(im,(0,16)); ImageDraw.Draw(c).text((2,2),'%s %s c%s [%d,%d,%d,%d]'%(it['kind'][0].upper(),it['name'][:20],it.get('cost'),x0,y0,x1,y1),fill='white'); cells.append(c)
x=y=0; out=Image.new('RGB',(1500,4000),'#666')
for c in cells:
    if x+c.width>1500: x=0; y+=274
    out.paste(c,(x,y)); x+=c.width+8
out.crop((0,0,1500,y+274)).save(sys.argv[2]); print(len(cells),'pieces')
