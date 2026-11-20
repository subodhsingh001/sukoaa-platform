#!/usr/bin/env python3
"""Render original narrated architecture diagrams. Requires Python Pillow and FFmpeg with libflite/libx264.
No network/model service is used. All diagrams are conceptual, not benchmark recordings.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,subprocess,wave,math,tempfile,os
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'public/learn/system-design';OUT.mkdir(parents=True,exist_ok=True)
LESSONS=json.loads((ROOT/'lib/system-design/lessons.json').read_text())
FONT=Path(os.environ.get('SUKOAA_FONT_DIR','/usr/share/fonts/truetype/dejavu'));regular=lambda n:ImageFont.truetype(str(FONT/'DejaVuSans.ttf'),n);bold=lambda n:ImageFont.truetype(str(FONT/'DejaVuSans-Bold.ttf'),n)
W,H,FPS=960,540,12
NAVY='#071e36';INK='#182c3b';TEAL='#087f86';MUTED='#526776';BORDER='#cedbe1';RED='#b33f4a'
POSITIONS=[(125,205),(475,205),(825,205),(125,310),(475,310),(825,310)]
def wrapped(draw,text,font,width):
 lines=[];line=''
 for word in text.split():
  candidate=(line+' '+word).strip()
  if draw.textlength(candidate,font=font)>width and line:lines.append(line);line=word
  else:line=candidate
 if line:lines.append(line)
 return lines

def write_lines(d,text,pos,font,width,fill,line_height):
 x,y=pos
 for line in wrapped(d,text,font,width):d.text((x,y),line,font=font,fill=fill);y+=line_height
 return y

def endpoints(a,b):
 ax,ay=POSITIONS[a];bx,by=POSITIONS[b];dx,dy=bx-ax,by-ay
 scale1=min(88/abs(dx) if dx else float('inf'),30/abs(dy) if dy else float('inf'))
 return (ax+dx*scale1,ay+dy*scale1),(bx-dx*scale1,by-dy*scale1)

def diagram(lesson,index,step_index):
 step=lesson['flow']['steps'][step_index];im=Image.new('RGB',(W,H),'#f5f8fa');d=ImageDraw.Draw(im)
 d.rectangle((0,0,W,70),fill=NAVY);d.text((28,14),'SUKOAA  /  SYSTEM DESIGN',font=regular(14),fill='#9ddbdc');d.text((28,36),f'{index+1:02d}  {lesson["title"]}',font=bold(23),fill='white')
 d.text((28,88),step['title'],font=bold(21),fill=INK);d.text((28,119),step['metric'],font=regular(16),fill=TEAL)
 for ei,(a,b) in enumerate(lesson['flow']['edges']):
  p,q=endpoints(a,b);active=ei in step['edges'];color=TEAL if active else '#aabdc6';d.line([p,q],fill=color,width=4 if active else 2)
  theta=math.atan2(q[1]-p[1],q[0]-p[0]);d.polygon([q,(q[0]-10*math.cos(theta-.5),q[1]-10*math.sin(theta-.5)),(q[0]-10*math.cos(theta+.5),q[1]-10*math.sin(theta+.5))],fill=color)
 for ni,label in enumerate(lesson['flow']['nodes']):
  x,y=POSITIONS[ni];failed=ni in step.get('failed',[]);d.rounded_rectangle((x-88,y-30,x+88,y+30),radius=7,fill='#fff0f0' if failed else 'white',outline=RED if failed else BORDER,width=2)
  lines=wrapped(d,label,bold(15),158);yy=y-len(lines)*10
  for line in lines:d.text((x-d.textlength(line,font=bold(15))/2,yy),line,font=bold(15),fill=RED if failed else INK);yy+=20
  if failed:d.text((x+73,y-45),'×',font=bold(22),fill=RED)
 d.rounded_rectangle((24,365,936,494),radius=8,fill='white',outline=BORDER)
 d.text((42,378),f'STEP {step_index+1} / 6',font=bold(12),fill=TEAL);write_lines(d,step['detail'],(42,402),regular(19),872,INK,26)
 d.text((28,515),'Conceptual walkthrough · timings are illustrative',font=regular(12),fill=MUTED)
 return im

def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'

def say(text):
 for a,b in [('RTO','recovery time objective'),('RPO','recovery point objective'),('API','A P I'),('DNS','D N S'),('CPU','C P U'),('TTL','time to live'),('SQL','S Q L'),('DB','database'),('429','four twenty nine'),('99.9%','ninety nine point nine percent')]:text=text.replace(a,b)
 return text

selected=os.environ.get('LESSON_ID')
if selected and selected not in {lesson['id'] for lesson in LESSONS}:
 raise SystemExit('Unknown LESSON_ID: '+selected)
manifest=json.loads((OUT/'manifest.json').read_text()) if selected and (OUT/'manifest.json').exists() else {}
with tempfile.TemporaryDirectory(prefix='sukoaa-diagrams-') as tmp:
 tmp=Path(tmp)
 for index,lesson in enumerate(LESSONS):
  if selected and lesson['id']!=selected:continue
  name=lesson['id'];durations=[];chunks=[];rate=None;params=None
  for si,step in enumerate(lesson['flow']['steps']):
   text=(lesson['title']+'. ' if si==0 else '')+step['title']+'. '+step['detail'];txt=tmp/f'{name}-{si}.txt';txt.write_text(say(text));audio=tmp/f'{name}-{si}.wav'
   subprocess.run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-f','lavfi','-i',f'flite=textfile={txt}:voice=slt','-ar','22050','-ac','1','-y',str(audio)],check=True)
   with wave.open(str(audio),'rb') as w:
    rate=w.getframerate();params=w.getparams();samples=w.readframes(w.getnframes());duration=w.getnframes()/rate
   # Align each chapter to a video frame and leave a short comprehension pause.
   frames=math.ceil((duration+1.0)*FPS);duration=frames/FPS;target=round(duration*rate);samples+=b'\0\0'*max(0,target-len(samples)//2);chunks.append(samples);durations.append(duration)
  wav=tmp/f'{name}.wav'
  with wave.open(str(wav),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(chunks))
  movie=OUT/f'{name}.mp4';command=['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','pipe:0','-i',str(wav),'-c:v','libx264','-preset','veryfast','-crf','25','-pix_fmt','yuv420p','-c:a','aac','-b:a','48k','-movflags','+faststart','-shortest',str(movie)]
  proc=subprocess.Popen(command,stdin=subprocess.PIPE);chapters=[];at=0
  try:
   for si,(step,duration) in enumerate(zip(lesson['flow']['steps'],durations)):
    background=diagram(lesson,index,si)
    if si==0:background.save(OUT/f'{name}.jpg',quality=82)
    chapters.append({'start':round(at,3),'end':round(at+duration,3),'title':step['title'],'text':step['detail']})
    for frame in range(round(duration*FPS)):
     im=background.copy();d=ImageDraw.Draw(im);progress=(frame/FPS)%2.4/2.4
     for edge_index in step['edges']:
      a,b=lesson['flow']['edges'][edge_index];p,q=endpoints(a,b);x=p[0]+(q[0]-p[0])*progress;y=p[1]+(q[1]-p[1])*progress;d.ellipse((x-6,y-6,x+6,y+6),fill=TEAL,outline='white',width=2)
     elapsed=at+frame/FPS;d.rectangle((0,503,int(W*elapsed/sum(durations)),507),fill=TEAL);proc.stdin.write(im.tobytes())
    at+=duration
  finally:proc.stdin.close()
  if proc.wait()!=0:raise RuntimeError('Video render failed: '+name)
  (OUT/f'{name}.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["title"]}. {c["text"]}' for i,c in enumerate(chapters))+'\n')
  manifest[name]={'duration':round(at,2),'chapters':chapters,'bytes':movie.stat().st_size,'width':W,'height':H,'fps':FPS,'narration':'Offline computer-generated English voice (Flite SLT)'}
  (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(f'{index+1:02d}/25 {name}: {at:.1f}s {movie.stat().st_size//1024} KiB',flush=True)
# The small metadata file is imported by server components; videos themselves are not bundled in JavaScript.
(ROOT/'lib/system-design/media.json').write_text(json.dumps(manifest,indent=2)+'\n')
