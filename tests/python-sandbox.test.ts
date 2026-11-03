import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';
import {pythonFrame} from '../lib/platform/sandbox';
function fixture(){
 const html=pythonFrame('print(1)','Sukoaa','channel','https://sukoaa.example');
 const code=html.match(/<script>([\s\S]*)<\/script>/)![1];const messages:Record<string,unknown>[]=[];const timers=new Map<number,{callback:()=>void;ms:number}>();let id=0;
 class Worker{static instance:Worker;onmessage!:(e:{data:Record<string,unknown>})=>void;onerror!:()=>void;terminated=false;constructor(){Worker.instance=this}postMessage(){}terminate(){this.terminated=true}}
 const parent={postMessage:(data:Record<string,unknown>)=>messages.push(data)};const window:{onmessage?:(e:unknown)=>void}={};
 vm.runInNewContext(code,{window,Worker,Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}},parent,setTimeout:(callback:()=>void,ms:number)=>{timers.set(++id,{callback,ms});return id},clearTimeout:(key:number)=>timers.delete(key)});
 window.onmessage!({source:parent,data:{channel:'channel',payload:{source:'print(1)',stdin:'',assets:{runner:'',wasm:new ArrayBuffer(0),stdlib:new ArrayBuffer(0)}}}});
 return {messages,timers,worker:Worker.instance};
}
test('Python frame blocks network access and escapes source markup',()=>{
 const frame=pythonFrame('print("</script><script>alert(1)</script>")','','token','https://sukoaa.example');
 assert.equal((frame.match(/<\/script>/g)||[]).length,1);assert.ok(frame.includes("connect-src 'none'"));assert.ok(frame.includes("default-src 'none'"));
});
test('Python loading and execution have separate enforced deadlines',()=>{
 const f=fixture();assert.equal([...f.timers.values()][0].ms,45000);
 f.worker.onmessage({data:{ready:true}});assert.equal(f.timers.size,1);assert.equal([...f.timers.values()][0].ms,10000);
 [...f.timers.values()][0].callback();assert.equal(f.worker.terminated,true);assert.ok(f.messages.some(m=>m.done===true&&String(m.line).includes('10-second')));
});
test('Python worker completion terminates compute and discards late messages',()=>{
 const f=fixture();f.worker.onmessage({data:{done:true}});assert.equal(f.worker.terminated,true);assert.equal(f.timers.size,0);const count=f.messages.length;f.worker.onmessage({data:{line:'late'}});assert.equal(f.messages.length,count);
});

test('user code cannot extend execution time by repeating ready events',()=>{
 const f=fixture();f.worker.onmessage({data:{ready:true}});const timer=[...f.timers.values()][0];f.worker.onmessage({data:{ready:true}});assert.equal([...f.timers.values()][0],timer);
});
test('the frame enforces output bounds even when worker messages bypass Python logging',()=>{
 const f=fixture();for(let i=0;i<201;i++)f.worker.onmessage({data:{line:'output'}});assert.equal(f.worker.terminated,true);assert.ok(f.messages.some(m=>String(m.line).includes('Output exceeded')));
});
