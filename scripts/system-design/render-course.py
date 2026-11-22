#!/usr/bin/env python3
"""Render the course with offline Kokoro narration and native FFmpeg diagram motion.
Model weights are authoring inputs, not website dependencies. See docs/35-SYSTEM-DESIGN-REFRESH.md.
"""
from pathlib import Path
from caption_format import two_lines
from PIL import Image, ImageDraw, ImageFont
import argparse, fcntl, hashlib, json, math, os, re, shutil, subprocess, tempfile, textwrap, time
import numpy as np
import soundfile as sf
import onnxruntime as rt
from kokoro_onnx import Kokoro

ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'public/learn/system-design'
LESSONS=json.loads((ROOT/'lib/system-design/lessons.json').read_text())
TEACHING=json.loads((ROOT/'lib/system-design/teaching.json').read_text())
FONT=Path(os.environ.get('SUKOAA_FONT_DIR','/usr/share/fonts/truetype/dejavu'))
W,H,FPS=1280,720,12
INK='#20382f'; GREEN='#134741'; ACTIVE='#087f86'; MUTED='#52665b'; RED='#a52b39'
POSITIONS=[(155,260),(640,260),(1125,260),(395,411),(885,411)]
CHAPTER_TITLES=['Build an intuition','Follow the normal path','Predict a failure','Work through an example','Choose and apply','Explain it back']

def font(size,bold=False): return ImageFont.truetype(str(FONT/('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')),size)
def lines(draw,text,f,width):
 out=[];line=''
 for word in text.split():
  candidate=(line+' '+word).strip()
  if draw.textlength(candidate,font=f)>width and line:out.append(line);line=word
  else:line=candidate
 if line:out.append(line)
 return out

def write(draw,text,xy,size,width,color=INK,bold=False,max_lines=8):
 x,y=xy;f=font(size,bold);wrapped=lines(draw,text,f,width)
 if len(wrapped)>max_lines: raise ValueError('Text would overflow: '+text[:80])
 for line in wrapped:draw.text((x,y),line,font=f,fill=color);y+=round(size*1.4)
 return y

def endpoints(a,b):
 ax,ay=POSITIONS[a];bx,by=POSITIONS[b];dx,dy=bx-ax,by-ay
 scale=min(126/abs(dx) if dx else float('inf'),39/abs(dy) if dy else float('inf'))
 return (ax+dx*scale,ay+dy*scale),(bx-dx*scale,by-dy*scale)

def scene(l,index,si):
 s=l['flow']['steps'][si];t=TEACHING[l['id']];im=Image.new('RGB',(W,H),'#f7faf8');d=ImageDraw.Draw(im)
 d.rectangle((0,0,W,85),fill=GREEN);d.text((32,16),'SUKOAA / SYSTEM DESIGN',font=font(16),fill='#b9dfd4');d.text((32,42),l['title'],font=font(27,True),fill='white')
 d.text((32,106),CHAPTER_TITLES[si],font=font(27,True),fill=INK);d.text((32,149),s['metric'],font=font(20),fill=ACTIVE)
 d.text((1090,27),f'{index+1:02d} / 25',font=font(22),fill='white')
 for ei,(a,b) in enumerate(l['flow']['edges']):
  p,q=endpoints(a,b);active=ei in s['edges'] and a not in s.get('failed',[]) and b not in s.get('failed',[]);c=ACTIVE if active else '#c7d3cb'
  d.line([p,q],fill=c,width=5 if active else 2);theta=math.atan2(q[1]-p[1],q[0]-p[0]);d.polygon([q,(q[0]-13*math.cos(theta-.5),q[1]-13*math.sin(theta-.5)),(q[0]-13*math.cos(theta+.5),q[1]-13*math.sin(theta+.5))],fill=c)
 active_nodes={n for edge in s['edges'] for n in l['flow']['edges'][edge]}
 for ni,label in enumerate(l['flow']['nodes']):
  x,y=POSITIONS[ni];failed=ni in s.get('failed',[]);outline=RED if failed else ACTIVE if ni in active_nodes else '#c7d3cb'
  d.rounded_rectangle((x-127,y-40,x+127,y+40),radius=9,fill='#fff0f1' if failed else '#e9f6f1' if ni in active_nodes else 'white',outline=outline,width=3)
  ls=lines(d,label,font(21,True),232);yy=y-len(ls)*15
  for line in ls:d.text((x-d.textlength(line,font=font(21,True))/2,yy),line,font=font(21,True),fill=RED if failed else INK);yy+=30
  if failed:d.text((x-75,y+46),'Unavailable',font=font(18,True),fill=RED)
 focus=[t['goals'][0],l['why'],t['prediction']['question'],l['worked']['calculation'],t['lab']['expected'],l['exercise']['prompt']][si]
 d.rounded_rectangle((28,514,1252,626),radius=9,fill='white',outline='#cbdad1',width=2)
 d.text((46,524),['Remember','Where it fits','Pause and predict','Reason with the example','Look for this result','Your turn'][si],font=font(15,True),fill=GREEN)
 # Use a concise graphic focus; full reasoning remains in narration and the transcript.
 f=font(22);wrapped=lines(d,focus,f,1184)
 if len(wrapped)>2:
  focus=focus.split('. ')[0]+'.';wrapped=lines(d,focus,f,1184)
 if len(wrapped)>2:focus=' '.join(focus.split()[:27])+'…'
 write(d,focus,(46,551),22,1184,max_lines=2)
 d.text((32,641),'Fictional SeatSpot example · active paths are teal; unavailable nodes are labelled',font=font(15),fill=MUTED)
 d.rectangle((0,674,W,H),fill=GREEN)
 for k in range(6):d.rounded_rectangle((32+k*205,687,202+k*205,695),radius=3,fill='#59cab5' if k<=si else '#37635c')
 return im

def speech_text(text):
 mapping={'RTO':'recovery time objective','RPO':'recovery point objective','API':'A P I','DNS':'D N S','CDN':'C D N','CPU':'C P U','RAM':'ram','TTL':'time to live','SQL':'sequel','DB':'database','DLQ':'dead letter queue','TLS':'T L S','HTTP':'H T T P','I/O':'input and output','p99':'ninety ninth percentile','p95':'ninety fifth percentile','SeatSpot':'Seat Spot','NGINX':'engine x','nginx':'engine x'}
 for a,b in mapping.items():text=re.sub(r'(?<!\w)'+re.escape(a)+r'(?!\w)',b,text)
 text=text.replace('99.9%','ninety nine point nine percent').replace('ceil(4 × 80 / 50)','four times eighty divided by fifty, rounded up').replace('/second',' per second').replace('×',' times ').replace(' = ',' equals ').replace(' / ',' divided by ').replace('%',' percent').replace('→',', then ')
 text=re.sub(r'\b(\d+)\s*ms\b',r'\1 milliseconds',text);text=re.sub(r'(?<=\d)\s*GB\b',' gigabytes',text);text=re.sub(r'(?<=\d)\s*MB\b',' megabytes',text)
 return text

def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'

def caption_parts(text):
 # Short phrase cues, at most two lines of 42 characters each.
 words=text.split();parts=[];line=''
 for word in words:
  if len(line)+len(word)+1>60 and line:parts.append(line);line=word
  else:line=(line+' '+word).strip()
 if line:parts.append(line)
 return [two_lines(x) for x in parts]

def run(args):subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)

p=argparse.ArgumentParser(description=__doc__);p.add_argument('--model',type=Path,required=True);p.add_argument('--voices',type=Path,required=True);p.add_argument('--voice',default='af_heart');p.add_argument('--cache',type=Path,required=True);p.add_argument('--threads',type=int,default=8);p.add_argument('--lesson',default=os.environ.get('LESSON_ID'));p.add_argument('--speed',type=float,default=.95);p.add_argument('--shard-count',type=int,default=1);p.add_argument('--shard-index',type=int,default=0);p.add_argument('--resume',action='store_true');args=p.parse_args()
if args.lesson and args.lesson not in TEACHING:raise SystemExit('Unknown lesson: '+args.lesson)
if args.shard_count<1 or not 0<=args.shard_index<args.shard_count:raise SystemExit('Invalid render shard')
args.cache.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
opt=rt.SessionOptions();opt.intra_op_num_threads=args.threads;opt.inter_op_num_threads=1
k=Kokoro.from_session(rt.InferenceSession(str(args.model),opt,providers=['CPUExecutionProvider']),str(args.voices))
manifest=json.loads((OUT/'manifest.json').read_text())
model_hash=hashlib.sha256(args.model.read_bytes()).hexdigest();started=time.monotonic()
for index,l in enumerate(LESSONS):
 if args.lesson and l['id']!=args.lesson:continue
 if index%args.shard_count!=args.shard_index:continue
 name=l['id'];t=TEACHING[name]
 current=json.loads((OUT/'manifest.json').read_text()).get(name,{})
 if args.resume and current.get('version')==2 and [c['text'] for c in current.get('chapters',[])]==t['narration'] and all((OUT/(name+e)).exists() for e in ['.mp4','.m4a','.en.vtt']):
  print('RESUME: already complete '+name,flush=True);continue
 chapters=[];cues=[];at=0
 with tempfile.TemporaryDirectory(prefix='sukoaa-course-') as tmp:
  tmp=Path(tmp);clips=[]
  for si,text in enumerate(t['narration']):
   spoken=speech_text(text);key=hashlib.sha256((model_hash+args.voice+str(args.speed)+spoken).encode()).hexdigest();cache=args.cache/(key+'.wav')
   if not cache.exists():
    samples,rate=k.create(spoken,voice=args.voice,speed=args.speed,lang='en-us',sentence_pause=.3,clause_pause=.12)
    if rate!=24000 or not np.all(np.isfinite(samples)) or len(samples)<rate:raise RuntimeError('Invalid narration output')
    sf.write(cache,samples,rate,subtype='PCM_16')
   samples,rate=sf.read(cache,dtype='float32');speech_duration=len(samples)/rate
   duration=math.ceil((speech_duration+.8)*FPS)/FPS;samples=np.pad(samples,(0,max(0,round(duration*rate)-len(samples))))
   wav=tmp/f'{si}.wav';sf.write(wav,samples,rate,subtype='PCM_16')
   image=scene(l,index,si);png=tmp/f'{si}.png';image.save(png)
   if si==0:image.save(OUT/(name+'.jpg'),quality=88)
   filters=[]
   for ei in l['flow']['steps'][si]['edges']:
    a,b=l['flow']['edges'][ei]
    if a in l['flow']['steps'][si].get('failed',[]) or b in l['flow']['steps'][si].get('failed',[]):continue
    v,z=endpoints(a,b)
    filters.append(f"drawtext=fontfile={FONT/'DejaVuSans.ttf'}:text='●':fontcolor=0x087f86:fontsize=24:x='{v[0]}+({z[0]-v[0]})*mod(t,2.8)/2.8-12':y='{v[1]}+({z[1]-v[1]})*mod(t,2.8)/2.8-12'")
   clip=tmp/f'{si}.mkv';cmd=['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-loop','1','-framerate',str(FPS),'-i',str(png),'-i',str(wav),'-t',str(duration)]
   if filters:cmd+=['-vf',','.join(filters)]
   cmd+=['-c:v','libx264','-preset','veryfast','-tune','stillimage','-crf','26','-threads','2','-pix_fmt','yuv420p','-r',str(FPS),'-c:a','pcm_s16le',str(clip)];run(cmd);clips.append(clip)
   chapters.append({'start':round(at,3),'end':round(at+duration,3),'title':CHAPTER_TITLES[si],'text':text,'flowStep':si})
   phrases=caption_parts(text);weights=[len(x.replace('\n',' ')) for x in phrases];weight=sum(weights);pos=at
   for j,(phrase,w) in enumerate(zip(phrases,weights)):
    end=at+speech_duration if j==len(phrases)-1 else pos+speech_duration*w/weight
    cues.append((pos,end,phrase));pos=end
   at+=duration
   print(f'{index+1:02d}/25 {name} chapter {si+1}/6 ready; elapsed {time.monotonic()-started:.0f}s',flush=True)
  concat=tmp/'concat.txt';concat.write_text(''.join("file '"+str(c)+"'\n" for c in clips))
  # Two-pass loudness matching keeps the voice steady without music or an aggressive noise gate.
  first=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-f','concat','-safe','0','-i',str(concat),'-vn','-af','highpass=f=65,loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
  match=re.search(r'\{\s*"input_i".*?\}',first.stderr,re.S);loud=json.loads(match.group())
  norm=f"highpass=f=65,loudnorm=I=-16:TP=-1.5:LRA=7:measured_I={loud['input_i']}:measured_TP={loud['input_tp']}:measured_LRA={loud['input_lra']}:measured_thresh={loud['input_thresh']}:offset={loud['target_offset']}:linear=true"
  temp_movie=tmp/(name+'.mp4');run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(concat),'-c:v','copy','-af',norm,'-ar','24000','-ac','1','-c:a','aac','-b:a','96k','-movflags','+faststart',str(temp_movie)])
  stage=OUT/(name+'.pending');shutil.copyfile(temp_movie,stage);os.replace(stage,OUT/(name+'.mp4'))
  # Audio-only downloads reuse the exact normalized track; no second synthesis/encoding.
  run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y','-i',str(OUT/(name+'.mp4')),'-vn','-c:a','copy','-movflags','+faststart',str(OUT/(name+'.m4a'))])
  (OUT/(name+'.en.vtt')).write_text('WEBVTT\n\n'+'\n\n'.join(f'{j+1}\n{stamp(a)} --> {stamp(b)}\n{text}' for j,(a,b,text) in enumerate(cues))+'\n')
  # Retain the legacy six-chapter VTT URL for saved links and chapter compatibility.
  (OUT/(name+'.vtt')).write_text('WEBVTT\n\n'+'\n\n'.join(f'{j+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{l["flow"]["steps"][j]["title"]}. {l["flow"]["steps"][j]["detail"]}' for j,c in enumerate(chapters))+'\n')
  manifest[name]={'version':2,'duration':round(at,3),'chapters':chapters,'bytes':(OUT/(name+'.mp4')).stat().st_size,'width':W,'height':H,'fps':FPS,'narration':'Kokoro v1.0 · af_heart · pre-generated English female voice','audioFile':name+'.m4a','captionsFile':name+'.en.vtt','voice':args.voice,'sampleRate':24000,'audioBitrate':96000,'captionCues':len(cues),'audioProduction':{'modelSHA256':model_hash,'speed':args.speed,'targetLUFS':-16,'targetTruePeakDB':-1.5,'sourceIntegratedLUFS':float(loud['input_i'])}}
  with (ROOT.parent/'.sukoaa-course-render.lock').open('w') as lock:
   fcntl.flock(lock,fcntl.LOCK_EX)
   latest=json.loads((OUT/'manifest.json').read_text());latest[name]=manifest[name]
   for target in [OUT/'manifest.json',ROOT/'lib/system-design/media.json']:
    pending=target.with_suffix(target.suffix+'.pending');pending.write_text(json.dumps(latest,indent=2)+'\n');os.replace(pending,target)
   fcntl.flock(lock,fcntl.LOCK_UN)
  print(f'COMPLETE {index+1:02d}/25 {name}: {at:.1f}s, {manifest[name]["bytes"]//1024} KiB; {len(cues)} caption cues',flush=True)
