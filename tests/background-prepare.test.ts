import test from 'node:test';import assert from 'node:assert/strict';
import {preparationHold,scheduleBackgroundPreparation,type PreparationHost} from '../lib/studio/background-prepare';
function browser(){
 let id=0;const timers=new Map<number,()=>void>(),idle=new Map<number,()=>void>(),events=new Map<string,Set<()=>void>>();
 const add=(name:string,fn:()=>void)=>{if(!events.has(name))events.set(name,new Set());events.get(name)!.add(fn);};const remove=(name:string,fn:()=>void)=>{events.get(name)?.delete(fn);};
 const host:PreparationHost={document:{readyState:'loading',visibilityState:'visible',addEventListener:add,removeEventListener:remove},navigator:{onLine:true,hardwareConcurrency:8,deviceMemory:8,connection:{effectiveType:'4g',addEventListener:add,removeEventListener:remove}},setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:id=>{timers.delete(id);},requestIdleCallback:fn=>{idle.set(++id,fn);return id;},cancelIdleCallback:id=>{idle.delete(id);},addEventListener:add,removeEventListener:remove};
 const flush=(items:Map<number,()=>void>)=>{for(const [key,fn]of [...items]){items.delete(key);fn();}};
 return {host,timers,idle,emit:(name:string)=>{for(const fn of [...events.get(name)||[]])fn();},tick:()=>flush(timers),rest:()=>flush(idle),listeners:()=>[...events.values()].reduce((n,x)=>n+x.size,0)};
}
test('automatic preparation waits for full page load, a typing pause and an idle callback; runs once',()=>{
 const b=browser();let runs=0;const cancel=scheduleBackgroundPreparation(()=>runs++,()=>{},b.host);assert.equal(b.timers.size,0);b.host.document.readyState='complete';b.emit('load');b.tick();assert.equal(runs,0);assert.equal(b.idle.size,1);b.emit('keydown');assert.equal(b.idle.size,0);b.rest();assert.equal(runs,0);b.tick();b.rest();assert.equal(runs,1);assert.equal(b.listeners(),0);b.emit('keydown');b.tick();b.rest();assert.equal(runs,1);cancel();
});
test('slow connections, data saver, offline and low resource hints keep preparation manual',()=>{
 for(const hints of [{onLine:false},{connection:{saveData:true}},{connection:{effectiveType:'2g'}},{connection:{effectiveType:'3g'}},{deviceMemory:4},{hardwareConcurrency:2}])assert.ok(preparationHold(hints));
 assert.equal(preparationHold({}),'');const b=browser();b.host.document.readyState='complete';b.host.navigator.onLine=false;let runs=0,reason='';const cancel=scheduleBackgroundPreparation(()=>runs++,text=>reason=text,b.host);b.tick();b.rest();assert.equal(runs,0);assert.match(reason,/Offline/);b.host.navigator.onLine=true;b.emit('online');b.tick();b.rest();assert.equal(runs,1);cancel();
});
test('hidden pages and cancelled navigation never start scheduled downloads',()=>{
 const b=browser();b.host.document.readyState='complete';let runs=0;const cancel=scheduleBackgroundPreparation(()=>runs++,()=>{},b.host);b.tick();b.host.document.visibilityState='hidden';b.emit('visibilitychange');b.rest();assert.equal(runs,0);b.host.document.visibilityState='visible';b.emit('visibilitychange');cancel();b.tick();b.rest();assert.equal(runs,0);assert.equal(b.listeners(),0);
});
test('browsers without idle callbacks use the delayed fallback',()=>{const b=browser();b.host.document.readyState='complete';delete b.host.requestIdleCallback;let runs=0;scheduleBackgroundPreparation(()=>runs++,()=>{},b.host);assert.equal(runs,0);b.tick();assert.equal(runs,1);});
