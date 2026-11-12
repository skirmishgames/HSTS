import json,sys
from PIL import Image,ImageDraw
n=sys.argv[1]; L=[x for x in json.load(open(n+'/labels.json')) if x['kind'] in('tile','option')]
H=210; W=1500; x=y=0; out=Image.new('RGB',(W,3000),'#666')
for it in L:
    im=Image.open(n+'/'+it['file']).convert('RGB').rotate(-(it.get('rotation') or 0),expand=True); im=im.resize((max(1,int(im.width*H/im.height)),H))
    if x+im.width>W: x=0; y+=H+30
    out.paste(im,(x,y+28)); d=ImageDraw.Draw(out)
    d.text((x+2,y+1),'%s %s'%(it['file'][:-4],(it.get('name') or '?')[:22]),fill='white'); d.text((x+2,y+13),'c%s %s s%s'%(it.get('cost'),','.join(c[:3] for c in (it.get('stripes') or [])),len(it.get('slots') or [])),fill='yellow'); x+=max(im.width,150)+8
out.crop((0,0,W,y+H+30)).save('/tmp/h/v1/cs_%s.png'%n); print(len(L),y)
