#!/usr/bin/env python3
"""Align reference captions to synthesized audio, using local Whisper word timestamps.
Only authoring uses this model. Captions retain the authored text, never ASR guesses.
"""
from pathlib import Path
from caption_format import two_lines
import argparse,difflib,fcntl,hashlib,json,os,re,subprocess,time,textwrap
import numpy as np
from faster_whisper import WhisperModel
R=Path(__file__).resolve().parents[2];O=R/'public/learn/system-design';T=json.loads((R/'lib/system-design/teaching.json').read_text())
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--model',type=Path,required=True);p.add_argument('--cache',type=Path,required=True);p.add_argument('--threads',type=int,default=2);p.add_argument('--watch',action='store_true');p.add_argument('--lesson');args=p.parse_args();args.cache.mkdir(parents=True,exist_ok=True)
if not (args.model/'model.bin').is_file():
 candidates=list(args.model.rglob('model.bin'))
 if len(candidates)!=1:raise SystemExit('Choose the local Whisper model directory containing model.bin')
 args.model=candidates[0].parent
m=WhisperModel(str(args.model),device='cpu',compute_type='int8',cpu_threads=args.threads,local_files_only=True)
nums=dict(zip('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(),map(str,range(21))))
def norm(s):
 s=re.sub(r'[^a-z0-9]','',s.lower());return nums.get(s,s)
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02d}:{n//60000%60:02d}:{n//1000%60:02d}.{n%1000:03d}'
def groups(words):
 out=[];start=0;text=''
 for i,w in enumerate(words):
  if text and len(text)+len(w)+1>60:out.append((start,i,text));start=i;text=w
  else:text=(text+' '+w).strip()
  if len(text)>34 and re.search(r'[.!?]$',w):out.append((start,i+1,text));start=i+1;text=''
 if text:out.append((start,len(words),text))
 return out
seen=set()
while True:
 manifest=json.loads((O/'manifest.json').read_text());pending=[]
 for name,entry in manifest.items():
  if args.lesson and name!=args.lesson:continue
  if entry.get('version')!=2 or name in seen:continue
  if entry.get('captionAlignment',{}).get('method')=='whisper-reference-word-alignment-v1':seen.add(name);continue
  pending.append((name,entry))
 for name,entry in pending:
  path=O/(name+'.m4a');audio_hash=hashlib.sha256(path.read_bytes()).hexdigest();cache=args.cache/(audio_hash+'.json')
  if cache.exists():words=json.loads(cache.read_text())
  else:
   pcm=subprocess.check_output(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-i',str(path),'-ar','16000','-ac','1','-f','f32le','pipe:1']);samples=np.frombuffer(pcm,dtype=np.float32)
   segments,_=m.transcribe(samples,language='en',beam_size=3,word_timestamps=True,vad_filter=False,condition_on_previous_text=False)
   words=[{'word':w.word.strip(),'start':w.start,'end':w.end,'probability':w.probability} for s in segments for w in (s.words or [])]
   cache.write_text(json.dumps(words))
  ref=' '.join(T[name]['narration']).split();a=[norm(w) for w in ref];b=[norm(w['word']) for w in words]
  match=difflib.SequenceMatcher(None,a,b,autojunk=False);timings=[None]*len(ref);matched=0
  for block in match.get_matching_blocks():
   for k in range(block.size):timings[block.a+k]=(words[block.b+k]['start'],words[block.b+k]['end']);matched+=1
  ratio=matched/len(ref)
  if ratio<.70:
   print(f'REVIEW {name}: matched {ratio:.1%}; retaining approximate captions',flush=True);seen.add(name);continue
  # Fill only unmatched reference spans between reliable word anchors.
  i=0
  while i<len(timings):
   if timings[i] is not None:i+=1;continue
   start=i
   while i<len(timings) and timings[i] is None:i+=1
   lo=timings[start-1][1] if start else 0;hi=timings[i][0] if i<len(timings) else entry['duration']
   hi=max(lo+.02*(i-start),hi);weights=[max(1,len(w)) for w in ref[start:i]];total=sum(weights);at=lo
   for j,w in enumerate(weights,start):end=at+(hi-lo)*w/total;timings[j]=(at,end);at=end
  cues=[];previous=0
  for start,end,text in groups(ref):
   begin=max(previous,timings[start][0]);finish=max(begin+.08,timings[end-1][1]);finish=min(entry['duration'],finish)
   if finish<=begin:continue
   wrapped=two_lines(text);cues.append((begin,finish,wrapped));previous=finish
  (O/(name+'.en.vtt')).write_text('WEBVTT\n\n'+'\n\n'.join(f'{j+1}\n{stamp(a)} --> {stamp(b)}\n{text}' for j,(a,b,text) in enumerate(cues))+'\n')
  with (R.parent/'.sukoaa-course-render.lock').open('w') as lock:
   fcntl.flock(lock,fcntl.LOCK_EX);latest=json.loads((O/'manifest.json').read_text());latest[name]['captionCues']=len(cues);latest[name]['captionAlignment']={'method':'whisper-reference-word-alignment-v1','referenceWordMatchRatio':round(ratio,4),'audioSHA256':audio_hash}
   for target in [O/'manifest.json',R/'lib/system-design/media.json']:
    tmp=target.with_suffix(target.suffix+'.pending');tmp.write_text(json.dumps(latest,indent=2)+'\n');os.replace(tmp,target)
   fcntl.flock(lock,fcntl.LOCK_UN)
  print(f'ALIGNED {name}: {ratio:.1%} reference words matched; {len(cues)} cues',flush=True);seen.add(name)
 expected={args.lesson} if args.lesson else set(T)
 if not args.watch or expected.issubset(seen):break
 time.sleep(5)
