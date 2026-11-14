import test from 'node:test';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {readFile} from 'node:fs/promises';
const base=new URL('../public/runtime/python/',import.meta.url);
const runner=await readFile(new URL('runner.js',base),'utf8');
const wasm=await readFile(new URL('pyodide.asm.wasm',base));
const stdlib=await readFile(new URL('python_stdlib.zip',base));
const lock=await readFile(new URL('pyodide-lock.json',base),'utf8');
const manifest=JSON.parse(await readFile(new URL('packages/manifest.json',base),'utf8'));
const packages=Object.fromEntries(await Promise.all(manifest.map(async p=>[p.filename,await readFile(new URL('packages/'+p.filename,base))])));
async function execute(source,stdin='',http=async()=>({ok:false,kind:'blocked',error:'API access is off.'}),includePackages=true){
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
  parentPort.on('message',data=>globalThis.onmessage({data}));
  globalThis.onmessage({data:workerData.payload});
 `,{eval:true,workerData:{runner,payload:{source,stdin,assets:{wasm,stdlib,lock,packages:includePackages?packages:{}}}}});
 const messages=[];
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>{worker.terminate();reject(new Error('Prepared Python worker timed out'))},20000);
  worker.on('message',async data=>{messages.push(data);if(data.httpRequest){try{const result=await http(data.httpRequest);worker.postMessage({httpResult:{id:data.httpRequest.id,result}})}catch(error){worker.postMessage({httpResult:{id:data.httpRequest.id,result:{ok:false,kind:'network',error:String(error)}}})}return}if(data.done){clearTimeout(timer);await worker.terminate();resolve(messages)}});
  worker.on('error',error=>{clearTimeout(timer);worker.terminate();reject(error)});
 });
}
test('prepared bundled worker initializes real WASM without ESM imports or network',async()=>{
 const messages=await execute('import math\nprint("Hello, " + input())\nprint(math.factorial(5))','Sukoaa',undefined,false);
 assert.ok(messages.some(m=>m.ready),JSON.stringify(messages));
 assert.ok(messages.some(m=>m.line==='Hello, Sukoaa'),JSON.stringify(messages));
 assert.ok(messages.some(m=>m.line==='120'));
 assert.equal(messages.at(-1).done,true);assert.ok(!messages.some(m=>m.diagnostic));
});
test('prepared worker reports main.py runtime and syntax locations',async()=>{
 const messages=await execute('print("start")\nraise ValueError("bad value")');
 const error=messages.find(m=>m.diagnostic);assert.equal(error?.diagnostic.line,2,JSON.stringify(messages));assert.match(error.diagnostic.message,/ValueError: bad value/);
});

test('prepared worker awaits the user asyncio.run and concurrent gather example',async()=>{
 const messages=await execute(`import asyncio

async def research_agent(name):
    await asyncio.sleep(3)
    print(f"{name}")

async def coding_agent(name):
    await asyncio.sleep(2)
    print(f"{name}")

async def main():
    await asyncio.gather(
        research_agent("Research completed"),
        coding_agent("Coding Completed"),
    )

asyncio.run(main())`);
 assert.ok(!messages.some(m=>m.diagnostic),JSON.stringify(messages));
 assert.deepEqual(messages.filter(m=>typeof m.line==='string').map(m=>m.line),['Coding Completed','Research completed']);
 assert.equal(messages.at(-1).done,true);
});


test('async exceptions still report the original user source location',async()=>{
 const messages=await execute('import asyncio\nasync def main():\n    await asyncio.sleep(0.01)\n    raise ValueError("async failed")\nasyncio.run(main())');
 const error=messages.find(m=>m.diagnostic);
 assert.equal(error?.diagnostic.line,4,JSON.stringify(messages));
 assert.equal(error?.diagnostic.source,'main.py');
 assert.match(error?.diagnostic.message,/ValueError: async failed/);
 assert.equal(messages.at(-1).done,true);
});


test('real bundled requests executes the user API example through the browser transport',async()=>{
 const calls=[];
 const messages=await execute(`import requests
try:
    response = requests.get("https://jsonplaceholder.typicode.com/users/1", timeout=10)
    response.raise_for_status()
    data = response.json()
    print(data["username"])
    print(data["email"])
    print(data["address"]["city"])
except requests.exceptions.Timeout:
    print("API request timed out")
except requests.exceptions.RequestException as error:
    print("API error:", error)`, '', async request=>{calls.push(request);return {ok:true,status:200,url:request.url,headers:{'content-type':'application/json; charset=utf-8'},body:Buffer.from(JSON.stringify({username:'Bret',email:'Sincere@april.biz',address:{city:'Gwenborough'}})).toString('base64')}});
 assert.ok(!messages.some(m=>m.diagnostic),JSON.stringify(messages));
 assert.deepEqual(messages.filter(m=>m.line).map(m=>m.line),['Bret','Sincere@april.biz','Gwenborough']);
 assert.equal(calls.length,1);assert.equal(calls[0].method,'GET');assert.equal(calls[0].url,'https://jsonplaceholder.typicode.com/users/1');
});

test('requests exposes native HTTPError and response details for HTTP failures',async()=>{
 const messages=await execute('import requests\ntry:\n    r=requests.get("https://jsonplaceholder.typicode.com/missing")\n    r.raise_for_status()\nexcept requests.exceptions.HTTPError as error:\n    print(error.response.status_code)', '', async request=>({ok:true,status:404,url:request.url,headers:{'content-type':'application/json'},body:Buffer.from('{}').toString('base64')}));
 assert.ok(!messages.some(m=>m.diagnostic),JSON.stringify(messages));assert.ok(messages.some(m=>m.line==='404'));
});

test('requests timeout and offline errors are catchable using the real library exceptions',async()=>{
 const source='import requests\ntry:\n    requests.get("https://jsonplaceholder.typicode.com/users/1", timeout=1)\nexcept requests.exceptions.Timeout:\n    print("API request timed out")\nexcept requests.exceptions.RequestException as error:\n    print("API error:", error)';
 const timeout=await execute(source,'',async()=>({ok:false,kind:'timeout',error:'Timed out'}));assert.ok(timeout.some(m=>m.line==='API request timed out'),JSON.stringify(timeout));
 const offline=await execute(source);assert.ok(offline.some(m=>m.line==='API error: API access is off.'),JSON.stringify(offline));
});
