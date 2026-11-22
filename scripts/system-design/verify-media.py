#!/usr/bin/env python3
"""Decode all course media and report technical audio quality; not a listening review."""
from pathlib import Path
import concurrent.futures,json,re,subprocess,argparse
R=Path(__file__).resolve().parents[2];O=R/'public/learn/system-design'
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);args=p.parse_args()
manifest=json.loads((O/'manifest.json').read_text())
def inspect(item):
 name,clip=item;path=O/(name+'.mp4')
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
 audio=next(x for x in probe['streams'] if x['codec_type']=='audio');video=next(x for x in probe['streams'] if x['codec_type']=='video')
 decode=subprocess.run(['ffmpeg','-nostdin','-v','error','-i',str(path),'-f','null','-'],capture_output=True,text=True)
 if decode.returncode or decode.stderr.strip():raise ValueError(name+': media decode failed: '+decode.stderr)
 loud=subprocess.run(['ffmpeg','-nostdin','-hide_banner','-i',str(path),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 values=json.loads(re.search(r'\{\s*"input_i".*?\}',loud.stderr,re.S).group())
 duration=float(probe['format']['duration']);integrated=float(values['input_i']);peak=float(values['input_tp'])
 assert clip['version']==2 and abs(duration-clip['duration'])<.2,name
 assert audio['codec_name']=='aac' and int(audio['sample_rate'])==24000 and audio['channels']==1,name
 assert video['codec_name']=='h264' and video['width']==1280 and video['height']==720,name
 assert -17<=integrated<=-15 and peak<0,name+': audio level outside expected range'
 assert clip['captionAlignment']['referenceWordMatchRatio']>=.7,name
 return {'lesson':name,'durationSeconds':duration,'integratedLUFS':integrated,'truePeakDBTP':peak,'sampleRate':24000,'audioCodec':'AAC','videoCodec':'H.264','decodedWithoutErrors':True,'referenceWordMatchRatio':clip['captionAlignment']['referenceWordMatchRatio']}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:results=list(ex.map(inspect,manifest.items()))
args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps({'scope':'Technical verification, not a human listening or teaching-effectiveness review','lessons':results},indent=2)+'\n')
print('Verified',len(results),'videos;',round(sum(x['durationSeconds'] for x in results)/60,1),'minutes;',min(x['integratedLUFS'] for x in results),'to',max(x['integratedLUFS'] for x in results),'LUFS')
