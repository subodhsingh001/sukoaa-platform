import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {lessons,media,systemDesignPaths} from '../lib/system-design/catalog';
import {emptyProgress,parseProgress,mergeProgress} from '../lib/system-design/progress';
import {learningLinks} from '../lib/navigation';
const ids=lessons.map(x=>x.id);
test('system design course covers the exact 25 image topics in order',()=>{
 assert.deepEqual(lessons.map(x=>x.title),['Load balancing','Auto scaling','High availability','Fault tolerance','Horizontal scaling','Vertical scaling','Caching','CDN','API gateway','Rate limiting','Circuit breaker','Message queues','Event-driven architecture','Database replication','Database sharding','Data partitioning','Microservices','Service discovery','Reverse proxy','DNS management','Disaster recovery','Zero-downtime deployments','Distributed tracing','Network segmentation','Multi-region setup']);
 assert.equal(new Set(ids).size,25);assert.equal(new Set(systemDesignPaths).size,26);assert.ok(learningLinks.some(x=>x.href==='/learn/system-design'));
});
test('each lesson has a coherent graph, complete exercises and a playable narrated-media entry',()=>{
 for(const l of lessons){assert.ok(l.simple.length>70);assert.ok(l.analogy.length>100);assert.equal(l.engineering.length,3);assert.equal(l.interview.length,2);assert.equal(l.flow.steps.length,6);assert.ok(l.quiz.correct>=0&&l.quiz.correct<l.quiz.options.length);assert.ok(l.exercise.solution.length>50);assert.equal(l.exercise.hints.length,2);
  for(const [a,b] of l.flow.edges){assert.ok(a>=0&&a<l.flow.nodes.length);assert.ok(b>=0&&b<l.flow.nodes.length);assert.notEqual(a,b);}
  for(const s of l.flow.steps){assert.ok(s.detail.length>50);for(const e of s.edges)assert.ok(e>=0&&e<l.flow.edges.length);for(const n of s.failed||[])assert.ok(n>=0&&n<l.flow.nodes.length);}
  const clip=media[l.id];assert.ok(clip.duration>40);assert.equal(clip.chapters.length,6);assert.equal(clip.chapters[0].start,0);for(let i=1;i<6;i++)assert.equal(clip.chapters[i].start,clip.chapters[i-1].end);assert.ok(Math.abs(clip.duration-clip.chapters[5].end)<.02);
  for(const ext of ['mp4','vtt','jpg'])assert.ok(existsSync('public/learn/system-design/'+l.id+'.'+ext));
  const captions=readFileSync('public/learn/system-design/'+l.id+'.vtt','utf8');assert.ok(captions.startsWith('WEBVTT'));assert.equal((captions.match(/ --> /g)||[]).length,6);assert.ok(captions.includes(l.flow.steps[5].detail));for(const r of l.references)assert.equal(new URL(r.url).protocol,'https:');
 }
});
test('progress import validates shape, bounds notes and ignores unknown lesson IDs',()=>{
 assert.throws(()=>parseProgress(null,ids));assert.throws(()=>parseProgress({version:2,completed:[],notes:{}},ids));assert.throws(()=>parseProgress({version:1,completed:[7],notes:{}},ids));assert.throws(()=>parseProgress({version:1,completed:[],notes:{[ids[0]]:'x'.repeat(8001)}},ids));
 const result=parseProgress(JSON.parse('{"version":1,"completed":["load-balancing","unknown","load-balancing"],"notes":{"load-balancing":"my explanation","__proto__":"bad"}}'),ids);assert.deepEqual(result.completed,['load-balancing']);assert.equal(result.notes['load-balancing'],'my explanation');assert.equal(Object.prototype.hasOwnProperty.call(result.notes,'__proto__'),false);
});
test('progress merge retains existing non-empty notes and combines completion without duplicates',()=>{
 const local={...emptyProgress(),completed:[ids[0]],notes:{[ids[0]]:'local answer',[ids[1]]:''}};
 const incoming={...emptyProgress(),completed:[ids[0],ids[1]],notes:{[ids[0]]:'backup answer',[ids[1]]:'imported answer'}};
 const result=mergeProgress(local,incoming);assert.deepEqual(result.completed,[ids[0],ids[1]]);assert.equal(result.notes[ids[0]],'local answer');assert.equal(result.notes[ids[1]],'imported answer');assert.equal(local.notes[ids[0]],'local answer');
});

import {teaching} from '../lib/system-design/catalog';
import {activePaths} from '../lib/system-design/walkthrough';
test('every system-design topic has specific goals, a prediction and a practical task',()=>{
 assert.deepEqual(Object.keys(teaching).sort(),[...ids].sort());
 for(const l of lessons){const t=teaching[l.id];assert.equal(t.goals.length,3);assert.equal(new Set(t.goals).size,3);assert.equal(t.lab.steps.length,3);assert.ok(t.prerequisites.length>15);assert.ok(t.prediction.question.length>30);assert.ok(t.prediction.answer.length>60);assert.ok(t.lab.expected.length>40);assert.notEqual(t.misconception.claim,t.misconception.correction);for(const v of Object.values(t.interviewLevels))assert.ok(v.length>25);}
});
test('narration teaches the analogy, concrete reasoning and the actual lesson exercise',()=>{
 for(const l of lessons){const t=teaching[l.id];assert.equal(t.narration.length,6);assert.ok(t.narration[0].includes(l.analogy));assert.ok(t.narration[3].includes(l.worked.calculation));assert.ok(t.narration[5].includes(l.exercise.prompt));assert.ok(t.narration[5].includes(l.exercise.solution));for(const n of t.narration)assert.ok(n.length>120);assert.ok(new Set(t.narration).size===6);}
});
test('conceptual animation never presents an unavailable node as a live request path',()=>{
 for(const l of lessons)for(let i=0;i<l.flow.steps.length;i++){const failed=new Set(l.flow.steps[i].failed||[]),active=activePaths(l,i);for(const e of active){const [a,b]=l.flow.edges[e];assert.ok(!failed.has(a)&&!failed.has(b));}assert.deepEqual(active,l.flow.steps[i].edges.filter(e=>!l.flow.edges[e].some(n=>failed.has(n))));}
 assert.deepEqual(activePaths(lessons[0],-1),[]);
});


test('all refreshed lessons ship neural audio with aligned bounded caption cues',()=>{
 const manifest=JSON.parse(readFileSync('public/learn/system-design/manifest.json','utf8'));
 const seconds=(s:string)=>{const [h,m,v]=s.split(':').map(Number);return h*3600+m*60+v;};
 for(const lesson of lessons){const clip=manifest[lesson.id];assert.equal(clip.version,2);assert.equal(clip.sampleRate,24000);assert.equal(clip.chapters.length,6);assert.equal(clip.captionAlignment.method,'whisper-reference-word-alignment-v1');assert.ok(clip.captionAlignment.referenceWordMatchRatio>=.7);assert.ok(existsSync('public/learn/system-design/'+clip.audioFile));const vtt=readFileSync('public/learn/system-design/'+clip.captionsFile,'utf8');let last=0,count=0;for(const block of vtt.trim().split(/\n\n/).slice(1)){const rows=block.split('\n');const at=rows.findIndex((x:string)=>x.includes(' --> '));assert.ok(at>=0);const [a,b]=rows[at].split(' --> ').map(seconds);assert.ok(a>=last-.01);assert.ok(b>a);assert.ok(b<=clip.duration+.1);assert.ok(rows.slice(at+1).length<=2);last=b;count++;}assert.equal(count,clip.captionCues);}
});
