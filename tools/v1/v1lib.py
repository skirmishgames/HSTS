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
import importlib
SETS=[]
VEH=re.compile(r'sherman|m10|panzer|stug|panther|tiger|sd\.?kfz|schwimmwagen|carrier|staghound|churchill|cromwell|firefly|willys|m20|goliath|halftrack|stummel|crab|ark|trailer',re.I)
OFF=re.compile(r'^(lt\.?|sgt\.?|ob\.?|c\.|cpt\.?|captain|col\.?|obersturmf|hauptsturmf)',re.I)
def kind(n,hero=False): return 'character' if hero else ('officer' if OFF.match(n) else ('vehicle' if VEH.search(n) else 'infantry'))
def slug(s): return re.sub(r'[^a-z0-9]+','_',s.lower().replace('é','e').replace('è','e').replace('ü','u')).strip('_')
def halfcode(c,x0,x1,y0,y1):
    reg=cv2.cvtColor(c[y0:y1,x0:x1],cv2.COLOR_BGR2HSV).reshape(-1,3).astype(int)
    vivid=((reg[:,1]>110)&(reg[:,2]>110)).mean(); white=((reg[:,1]<40)&(reg[:,2]>200)).mean()
    return 'T' if (vivid>0.18 or white>0.18) else 'K'
