import sys
from PIL import Image,ImageDraw,ImageFont
Image.MAX_IMAGE_PIXELS=None
src,out=sys.argv[1],sys.argv[2]; step=int(sys.argv[3]) if len(sys.argv)>3 else 200; crop=[int(v) for v in sys.argv[4].split(',')] if len(sys.argv)>4 else None
im=Image.open(src).convert('RGB'); ox=oy=0
if crop: im=im.crop(crop); ox,oy=crop[0],crop[1]
d=ImageDraw.Draw(im); f=ImageFont.load_default(size=max(22,im.width//75))
for x in range(-(ox%step) if ox%step else 0,im.width,step):
    X=x+ox
    d.line([(x,0),(x,im.height)],fill=(255,0,255),width=3); d.text((x+5,5),str(X),fill='white',font=f,stroke_width=3,stroke_fill='black')
for y in range(-(oy%step) if oy%step else 0,im.height,step):
    Y=y+oy
    d.line([(0,y),(im.width,y)],fill=(0,255,255),width=3); d.text((5,y+5),str(Y),fill='yellow',font=f,stroke_width=3,stroke_fill='black')
im.thumbnail((1500,1500)); im.save(out); print(im.size)
