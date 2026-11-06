import test from 'node:test';import assert from 'node:assert/strict';
import {createPythonHttpSession,validatePythonHttp,type PythonNetworkRecord} from '../lib/platform/python-http';
const request={id:1,url:'https://jsonplaceholder.typicode.com/users/1',method:'GET',timeout:1000};
test('Python API policy rejects alternate hosts, insecure URLs, writes and credentials',()=>{
 for(const url of ['http://jsonplaceholder.typicode.com/users/1','https://jsonplaceholder.typicode.com.attacker.com','https://jsonplaceholder.typicode.com:444','https://localhost','https://127.0.0.1','https://[::1]','https://user:pass@jsonplaceholder.typicode.com/'])assert.throws(()=>validatePythonHttp({...request,url}));
 assert.throws(()=>validatePythonHttp({...request,method:'POST'}));
 assert.throws(()=>validatePythonHttp({...request,headers:'{"Authorization":"secret"}'}));
 assert.throws(()=>validatePythonHttp({...request,headers:'{"Cookie":"secret"}'}));
 assert.equal(validatePythonHttp({...request,timeout:999999}).timeout,10000);
});
test('Python API calls require opt-in and never forward cookies, redirects, or user headers',async()=>{
 let calls=0;const records:PythonNetworkRecord[]=[];
 const transport:typeof fetch=async(url,options)=>{calls++;assert.equal(String(url),request.url);assert.equal(options?.credentials,'omit');assert.equal(options?.redirect,'error');assert.equal(options?.referrerPolicy,'no-referrer');assert.equal(options?.mode,'cors');assert.deepEqual(options?.headers,{Accept:'application/json'});return new Response('{"username":"Bret"}',{status:200,headers:{'Content-Type':'application/json','Set-Cookie':'secret'}})};
 assert.equal((await createPythonHttpSession(false,r=>records.push(r),transport).request(request)).kind,'blocked');assert.equal(calls,0);
 const result=await createPythonHttpSession(true,r=>records.push(r),transport).request(request);assert.equal(result.status,200);assert.equal(atob(result.body!),'{"username":"Bret"}');assert.equal(result.headers?.['set-cookie'],undefined);assert.equal(records.at(-1)?.status,200);
});
test('request budget and response bounds are enforced independently of worker code',async()=>{
 let calls=0;const session=createPythonHttpSession(true,()=>{},async()=>{calls++;return new Response('{}')});
 for(let id=1;id<=5;id++)assert.equal((await session.request({...request,id})).ok,true);
 assert.equal((await session.request({...request,id:6})).kind,'blocked');assert.equal(calls,5);
 const large=createPythonHttpSession(true,()=>{},async()=>new Response('x'.repeat(262145)));assert.match((await large.request(request)).error!,/256 KB/);
});
test('timeouts abort transport and stopped runs discard network records',async()=>{
 let aborted=false;const records:PythonNetworkRecord[]=[];
 const transport:typeof fetch=async(_url,options)=>new Promise((_resolve,reject)=>{options?.signal?.addEventListener('abort',()=>{aborted=true;reject(new Error('Aborted'))},{once:true})});
 const session=createPythonHttpSession(true,r=>records.push(r),transport);assert.equal((await session.request({...request,timeout:1})).kind,'timeout');assert.equal(aborted,true);
 const stopped=createPythonHttpSession(true,r=>records.push(r),transport);const pending=stopped.request(request);stopped.abort();await pending;assert.equal(records.length,1);assert.equal((await stopped.request(request)).ok,false);
});
