import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {genLessons,genPaths} from '../lib/genai/catalog';
import {probabilities,tokenCost,kvBytes,weightBytes,loraParameters,chainSuccess,judgeMetrics,contextBudget,initialAgent,advanceAgent,authorizeAction,retrieveToy,parseGenProgress,mergeGenProgress,blankProgress} from '../lib/genai/logic';
import {codingTasks,mockRounds} from '../lib/genai/practice';
import {learningLinks} from '../lib/navigation';
test('GenAI curriculum covers all forty supplied concepts without duplicate routes',()=>{
 assert.equal(genLessons.length,40);assert.equal(new Set(genPaths).size,41);assert.equal(new Set(genLessons.map(x=>x.group)).size,10);
 assert.deepEqual(genLessons.slice(0,4).map(x=>x.title),['Tokens','Embeddings','Attention','Next token']);
 assert.deepEqual(genLessons.slice(-4).map(x=>x.title),['Token cost','KV cache','Quantization','Fine-tuning and LoRA']);
 assert.ok(learningLinks.some(x=>x.href==='/learn/gen-ai'));
 for(const l of genLessons){assert.equal(l.stages.length,4);assert.ok(l.interview.followUpAnswer.length>120);assert.ok(l.exercise.solution.length>90);assert.ok(l.engineering.length>=2);assert.equal(new URL(l.references[0].url).protocol,'https:');}
 assert.equal(mockRounds.length,5);
});
test('sampling calculation remains normalized and stable at extreme logits',()=>{
 const p=probabilities([10000,9999,-10000],.05);assert.ok(p.every(Number.isFinite));assert.ok(Math.abs(p.reduce((a,b)=>a+b,0)-1)<1e-12);assert.ok(p[0]>.99);assert.throws(()=>probabilities([1],0));assert.throws(()=>probabilities([NaN],1));
});
test('GPU and LoRA calculations preserve units and architecture-specific head counts',()=>{
 assert.equal(kvBytes(32,32,128,4096,1,2),2*2**30);assert.equal(kvBytes(32,8,128,4096,1,2),.5*2**30);assert.equal(weightBytes(7,16),14e9);assert.equal(weightBytes(7,4),3.5e9);assert.deepEqual(loraParameters(4096,4096,8,1),{adapter:65536,full:16777216});assert.throws(()=>kvBytes(32,0,128,4096,1,2));assert.throws(()=>loraParameters(4,4,8,1));
});
test('cost, context and reliability examples compute the stated results',()=>{
 assert.equal(tokenCost(1000,200,2,8,10000),36);assert.equal(contextBudget(8000,1000,2000,1000,4000),0);assert.equal(contextBudget(8000,1000,2000,1000,5000),-1000);assert.ok(Math.abs(chainSuccess(.95,20)-.3584859224)<1e-9);assert.equal(chainSuccess(.5,0),1);assert.throws(()=>chainSuccess(1.01,5));assert.throws(()=>tokenCost(-1,2,3,4,5));
});
test('judge metrics distinguish missed bad cases from agreement and undefined ratios',()=>{
 const m=judgeMetrics(4,1,2,13);assert.equal(m.precision,.8);assert.equal(m.recall,2/3);assert.equal(m.accuracy,.85);assert.deepEqual(judgeMetrics(0,0,0,0),{precision:null,recall:null,accuracy:null});assert.equal(judgeMetrics(0,0,1,99).accuracy,.99);assert.equal(judgeMetrics(0,0,1,99).recall,0);
});
test('agent simulation requires observed evidence, approval and remaining call budget',()=>{
 let s=initialAgent(2);assert.equal(advanceAgent(s,'send').status,'ready');assert.equal(advanceAgent(s,'approve').approved,false);s=advanceAgent(s,'lookup');s=advanceAgent(s,'send');assert.equal(s.status,'awaiting_approval');s=advanceAgent(s,'approve');s=advanceAgent(s,'send');assert.equal(s.status,'complete');assert.equal(s.used,2);assert.equal(advanceAgent(s,'lookup'),s);
 let b=advanceAgent(initialAgent(1),'lookup');b=advanceAgent(b,'send');assert.equal(b.status,'budget_exhausted');assert.equal(b.approved,false);
});
test('retrieved instructions cannot gain action authority through an approval checkbox',()=>{
 for(const allowed of [true,false])for(const approved of [true,false])assert.equal(authorizeAction('document',allowed,approved),false);
 assert.equal(authorizeAction('user',true,false),false);assert.equal(authorizeAction('user',false,true),false);assert.equal(authorizeAction('user',true,true),true);
});
test('toy hybrid retrieval makes the exact identifier visible and remains deterministic',()=>{
 assert.equal(retrieveToy('POL-448210','lexical')[0].id,'policy');assert.equal(retrieveToy('POL-448210','semantic')[0].id,'claim');const hybrid=retrieveToy('POL-448210','hybrid');assert.deepEqual(hybrid.slice(0,2).map(x=>x.id),['claim','policy']);assert.ok(Math.abs(hybrid[1].score-(1/61+1/63))<1e-12);assert.equal(new Set(retrieveToy('','hybrid').map(x=>x.id)).size,4);
});
test('progress import rejects invalid data, filters unknown IDs and merges without erasing local notes',()=>{
 const ids=genLessons.map(x=>x.id);assert.throws(()=>parseGenProgress({version:2},ids));assert.throws(()=>parseGenProgress({version:1,completed:[5],bookmarks:[],notes:{}},ids));assert.throws(()=>parseGenProgress({version:1,completed:[],bookmarks:[],notes:{tokens:'x'.repeat(12001)}},ids));
 const backup=parseGenProgress(JSON.parse('{"version":1,"completed":["tokens","tokens","unknown"],"bookmarks":["embeddings"],"notes":{"tokens":"incoming","__proto__":"poison"}}'),ids);
 assert.deepEqual(backup.completed,['tokens']);assert.equal(Object.hasOwn(backup.notes,'__proto__'),false);const local={...blankProgress(),notes:{tokens:'my answer'}};assert.equal(mergeGenProgress(local,backup).notes.tokens,'my answer');assert.equal(mergeGenProgress(blankProgress(),backup).notes.tokens,'incoming');
});
test('downloadable Python reference tasks run their actual example and boundary checks',()=>{
 for(const task of codingTasks){const result=spawnSync('python3',['-c',task.solution],{encoding:'utf8',timeout:5000});assert.equal(result.status,0,task.title+': '+result.stderr);assert.match(result.stdout,/checks passed/);}
});
