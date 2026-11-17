import test from 'node:test';import assert from 'node:assert/strict';import {portalPresets,validateRule,sizeBounds,checkOutput,dateLabel} from '../lib/portal-ready/rules';import {cropGeometry,defaultEdit} from '../lib/portal-ready/canvas';import {searchCompression} from '../lib/portal-ready/compress';import {validateRecords,parseBackup,mergeRecords,type ExamRecord} from '../lib/portal-ready/vault';
test('verified presets retain exam-specific sources and custom templates remain honest',()=>{assert.equal(portalPresets.filter(p=>p.verified).length,2);for(const r of portalPresets){assert.doesNotThrow(()=>validateRule(r));assert.doesNotThrow(()=>sizeBounds(r));if(r.verified){assert.match(r.source!,/^https:\/\/www.ibps.in\//);assert.equal(r.checked,'2026-11-17');assert.ok(r.note.includes('preferred'));}}assert.ok(!portalPresets.some(p=>p.id==='ssc-photo'||p.id==='passport-photo'));});
test('dimensions and conservative byte bounds reject invalid or misleading settings',()=>{const r=portalPresets[1];assert.deepEqual(sizeBounds(r),{min:20480,max:50000});assert.deepEqual(checkOutput(r,{width:200,height:230,bytes:30000,format:'image/jpeg'}),{dimensions:true,size:true,format:true});assert.equal(checkOutput(r,{width:200,height:230,bytes:50500,format:'image/jpeg'}).size,false);for(const p of [{width:0},{width:4000,height:4000},{minKB:50,maxKB:10},{minKB:NaN},{format:'png'}])assert.throws(()=>validateRule({...r,...p} as typeof r));assert.throws(()=>sizeBounds({minKB:.99,maxKB:1}));assert.equal(dateLabel('2026-11-17'),'17-11-2026');});
test('crop geometry preserves aspect ratio, rotation and stamp space',()=>{const r={width:400,height:500};const normal=cropGeometry(800,1000,r,defaultEdit);assert.equal(normal.scale,.5);assert.equal(normal.centerY,250);const rotated=cropGeometry(800,1000,r,{...defaultEdit,rotation:90,fit:'contain'});assert.equal(rotated.scale,.4);const stamp=cropGeometry(800,1000,r,{...defaultEdit,stamp:true,x:10,y:-10});assert.equal(stamp.imageHeight,420);assert.equal(stamp.centerX,240);assert.equal(stamp.centerY,168);});
test('compression searches actual final bytes and chooses a compliant high-quality candidate',async()=>{const result=await searchCompression(async q=>new Blob([new Uint8Array(Math.round(1000+q*40000))],{type:'image/jpeg'}),{min:10000,max:20000});assert.equal(result.compliant,true);assert.ok(result.bytes>=10000&&result.bytes<=20000);assert.ok(result.quality>.45);});
test('impossible size ranges produce explicit drafts without padding or false green checks',async()=>{const below=await searchCompression(async()=>new Blob([new Uint8Array(2000)]),{min:10000,max:20000});assert.equal(below.compliant,false);assert.equal(below.bytes,2000);assert.match(below.reason,/does not add fake padding/);const over=await searchCompression(async()=>new Blob([new Uint8Array(25000)]),{min:10000,max:20000});assert.equal(over.compliant,false);assert.equal(over.bytes,25000);const c=new AbortController();c.abort();await assert.rejects(()=>searchCompression(async()=>new Blob(),{min:0,max:20},c.signal));});
const record:ExamRecord={id:'exam-a',exam:'Example exam',registration:'TEST-1',roll:'TEST-2',date:'2026-11-17',notes:'Fictional test only',steps:[true,false,false,false,false],updatedAt:1};
test('checklist backup validation and merge preserve newer local records',()=>{assert.deepEqual(parseBackup(JSON.stringify({version:1,records:[record]})),[record]);const incoming={...record,notes:'New',updatedAt:2};assert.equal(mergeRecords([record],[incoming])[0].notes,'New');assert.equal(mergeRecords([incoming],[record])[0].notes,'New');assert.throws(()=>validateRecords([record,record]));assert.throws(()=>parseBackup('{"version":2,"records":[]}'));assert.throws(()=>validateRecords([{...record,steps:[true]}]));assert.throws(()=>validateRecords([{...record,notes:'x'.repeat(1001)}]));assert.throws(()=>validateRecords([{...record,id:'../unsafe'}]));});

import {panImage,zoomImage,wheelZoom} from '../lib/portal-ready/gestures';
test('drag movement follows displayed pixels at different preview sizes and with a stamp',()=>{
 const a=panImage(defaultEdit,40,-50,400,500);assert.equal(a.x,10);assert.equal(a.y,-10);
 const b=panImage(defaultEdit,20,-25,200,250);assert.deepEqual(a,b);
 const stamped=panImage({...defaultEdit,stamp:true},40,42,400,500);assert.equal(stamped.x,10);assert.equal(stamped.y,10);
 assert.deepEqual(panImage(defaultEdit,20,20,0,0),defaultEdit);
 const bounded=panImage(defaultEdit,10000,-10000,400,500);assert.equal(bounded.x,100);assert.equal(bounded.y,-100);
});
test('zoom preserves the image point under the cursor, including the stamp area',()=>{
 for(const stamp of [false,true]){
  const edit={...defaultEdit,stamp,x:10,y:-8,zoom:1};const next=zoomImage(edit,2,.7,.3);
  const before=cropGeometry(800,1000,{width:400,height:500},edit),after=cropGeometry(800,1000,{width:400,height:500},next);
  assert.ok(Math.abs((280-before.centerX)/before.scale-(280-after.centerX)/after.scale)<1e-8);
  assert.ok(Math.abs((150-before.centerY)/before.scale-(150-after.centerY)/after.scale)<1e-8);
 }
 assert.equal(zoomImage(defaultEdit,100).zoom,4);assert.equal(zoomImage(defaultEdit,.001).zoom,.25);
});
test('wheel zoom normalizes pixel and line scrolling and respects existing limits',()=>{
 assert.ok(wheelZoom(1,-100,0,500)>1);assert.ok(wheelZoom(1,100,0,500)<1);
 assert.equal(wheelZoom(1,2,1,500),wheelZoom(1,32,0,500));
 assert.equal(wheelZoom(4,-10000,0,500),4);assert.equal(wheelZoom(.25,10000,0,500),.25);
});
