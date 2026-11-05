import test from 'node:test';import assert from 'node:assert/strict';
import {validateJson} from '../lib/platform/json-tool';import {DiagnosticError} from '../lib/platform/diagnostics';import {projectInput} from '../lib/platform/validation';import {sqlFrame} from '../lib/platform/sandbox';
test('JSON validator pretty-prints data and preserves primitive values',()=>{assert.equal(validateJson('{"name":"Sukoaa","enabled":false}').formatted,'{\n  "name": "Sukoaa",\n  "enabled": false\n}');assert.equal(validateJson('null').kind,'null');assert.equal(validateJson('[1,2]').count,2)});
test('JSON parser errors include the failing multiline source location',()=>{assert.throws(()=>validateJson('{\n  "name":\n}'),error=>error instanceof DiagnosticError&&error.diagnostics[0].line===3)});
test('data tools share project validation and SQL frames retain sandbox network denial',()=>{for(const language of ['sql','json'])assert.equal(projectInput({name:'Data',language,source:'x'}).language,language);const frame=sqlFrame('select "</script>"','/* runtime */','channel');assert.ok(frame.includes("connect-src 'none'"));assert.equal((frame.match(/<\/script>/g)||[]).length,1)});

import {Worker as NodeWorker} from 'node:worker_threads';import {readFile} from 'node:fs/promises';import vm from 'node:vm';
test('SQL sandbox executes its actual inline WASM worker without network access',async()=>{
 const runtime=await readFile('public/runtime/sql/sql-wasm-inline.js','utf8');
 const frame=sqlFrame('SELECT 6 * 7 AS answer;',runtime,'sql-test');
 let workerBlob:Blob|undefined;
 class BrowserWorker{constructor(_url:string){}postMessage(){}terminate(){}}
 vm.runInNewContext(frame.match(/<script>([\s\S]*)<\/script>/)![1],{Blob,Worker:BrowserWorker,URL:{createObjectURL:(blob:Blob)=>{workerBlob=blob;return 'blob:test'},revokeObjectURL:()=>{}},parent:{postMessage:()=>{}},setTimeout:()=>1,clearTimeout:()=>{}});
 const code=await workerBlob!.text();
 const lines=await new Promise<string[]>((resolve,reject)=>{
  const worker=new NodeWorker(`const {parentPort,workerData}=require('node:worker_threads');globalThis.process=undefined;globalThis.self=globalThis;globalThis.location={href:'blob:null/sql'};globalThis.importScripts=()=>{throw Error('Unexpected import')};globalThis.fetch=()=>{throw Error('Unexpected network')};globalThis.postMessage=data=>parentPort.postMessage(data);(0,eval)(workerData);self.onmessage({data:'SELECT 6 * 7 AS answer;'});`,{eval:true,workerData:code});
  const output:string[]=[];const timer=setTimeout(()=>{worker.terminate();reject(new Error('SQL worker timed out'))},15000);
  worker.on('error',error=>{clearTimeout(timer);worker.terminate();reject(error)});
  worker.on('message',async data=>{if(data.line)output.push(data.line);if(data.done){clearTimeout(timer);await worker.terminate();if(data.diagnostic)reject(new Error(data.diagnostic.message));else resolve(output)}});
 });
 assert.ok(lines.includes('{"answer":42}'));
});
