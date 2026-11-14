import test from 'node:test';
import assert from 'node:assert/strict';
import {toolLinks} from '../lib/tool-order';
import {workspaceTool} from '../lib/platform/workspace-tools';
import {loadPythonAssets,needsPythonPackages} from '../lib/platform/python-client';
test('every toolbox item has a safe project destination or a real snippet template',()=>{
 for(const tool of toolLinks){const selected=workspaceTool(tool.id);assert.ok(selected,tool.id);if(selected.kind==='snippet'){assert.equal(typeof selected.template.source,'string');assert.ok(selected.template.filename)}else assert.equal(selected.href,tool.href)}
 assert.deepEqual(workspaceTool('angular'),{kind:'project',href:'/studio?framework=angular'});
 assert.equal(workspaceTool('typescript')?.kind,'snippet');
 for(const value of ['__proto__','constructor','unknown',null,{}])assert.equal(workspaceTool(value),null);
});
test('Python standard-library runs skip wheels; Requests loads and caches verified packages',async()=>{
 assert.equal(needsPythonPackages('import asyncio\nasyncio.run(main())'),false);
 for(const source of ['import requests','import os, requests as r','from requests.sessions import Session',"__import__('requests')"])assert.equal(needsPythonPackages(source),true);
 const original=globalThis.fetch,calls:string[]=[],wheel=new Uint8Array([1,2,3]);
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',wheel)),v=>v.toString(16).padStart(2,'0')).join('');
 globalThis.fetch=async input=>{const url=String(input);calls.push(url);if(url.includes('manifest.json'))return Response.json(Array.from({length:5},(_,i)=>({filename:`test${i}.whl`,sha256:hash})));
 if(url.includes('.whl'))return new Response(wheel);
 if(url.includes('runner.js'))return new Response('/* Sukoaa Python bundled worker v6 */');
 if(url.includes('.wasm'))return new Response(new Uint8Array([0,97,115,109]));
 if(url.includes('.zip'))return new Response(new Uint8Array([80,75,3,4]));
 return new Response('{}');};
 try{const signal=new AbortController().signal;const core=await loadPythonAssets(signal);assert.equal(calls.length,4);assert.equal(Object.keys(core.packages).length,0);
 const full=await loadPythonAssets(signal,{packages:true});assert.equal(Object.keys(full.packages).length,5);assert.equal(calls.length,10);
 await loadPythonAssets(signal,{packages:true});assert.equal(calls.length,10);
 assert.equal(Object.keys((await loadPythonAssets(signal)).packages).length,0);
 const cancelled=new AbortController();cancelled.abort();await assert.rejects(loadPythonAssets(cancelled.signal),{name:'AbortError'});
 }finally{globalThis.fetch=original}
});

