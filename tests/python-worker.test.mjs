import test from 'node:test';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {readFile} from 'node:fs/promises';
const base=new URL('../public/runtime/python/',import.meta.url);
const runner=await readFile(new URL('runner.js',base),'utf8');
const wasm=await readFile(new URL('pyodide.asm.wasm',base));
const stdlib=await readFile(new URL('python_stdlib.zip',base));
const lock=await readFile(new URL('pyodide-lock.json',base),'utf8');
async function execute(source,stdin=''){
 const worker=new Worker(`
  const {parentPort,workerData}=require('node:worker_threads');
  globalThis.process=undefined;
  Object.defineProperty(globalThis,'navigator',{value:{userAgent:'Sukoaa worker test'},configurable:true});
  globalThis.WorkerGlobalScope=class{static [Symbol.hasInstance](value){return value===globalThis}};
  globalThis.self=globalThis;
  globalThis.location={href:'blob:null/test',origin:'null',toString(){return this.href}};
  globalThis.importScripts=()=>{throw new Error('Unexpected native script import')};
  globalThis.postMessage=data=>parentPort.postMessage(data);
  globalThis.addEventListener=()=>{};globalThis.removeEventListener=()=>{};
  globalThis.fetch=()=>{throw new Error('Unexpected network request')};
  (0,eval)(workerData.runner);
  globalThis.onmessage({data:workerData.payload});
 `,{eval:true,workerData:{runner,payload:{source,stdin,assets:{wasm,stdlib,lock}}}});
 const messages=[];
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{worker.terminate();reject(new Error('Prepared Python worker timed out'))},20000);
  worker.on('message',async data=>{messages.push(data);if(data.done){clearTimeout(timer);await worker.terminate();resolve(messages)}});
  worker.on('error',error=>{clearTimeout(timer);worker.terminate();reject(error)});
 });
}
test('prepared bundled worker initializes real WASM without ESM imports or network',async()=>{
 const messages=await execute('import math\nprint("Hello, " + input())\nprint(math.factorial(5))','Sukoaa');
 assert.ok(messages.some(m=>m.ready),JSON.stringify(messages));
 assert.ok(messages.some(m=>m.line==='Hello, Sukoaa'),JSON.stringify(messages));
 assert.ok(messages.some(m=>m.line==='120'));
 assert.equal(messages.at(-1).done,true);assert.ok(!messages.some(m=>m.diagnostic));
});
test('prepared worker reports main.py runtime and syntax locations',async()=>{
 const messages=await execute('print("start")\nraise ValueError("bad value")');
 const error=messages.find(m=>m.diagnostic);assert.equal(error?.diagnostic.line,2,JSON.stringify(messages));assert.match(error.diagnostic.message,/ValueError: bad value/);
});
