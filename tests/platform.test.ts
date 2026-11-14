import './workspace-repair.test';
import {pageMetadata,publicPaths} from '../lib/marketing/site';
import {unlistedPaths} from '../lib/marketing/availability';
import test from 'node:test';import assert from 'node:assert/strict';
import {sameOrigin,body,HttpError} from '../lib/platform/http';import {projectInput} from '../lib/platform/validation';import {rateLimit} from '../lib/platform/redis';import {toBase64,fromBase64,runnerConfig} from '../lib/platform/runner';import {jsFrame,reactFrame} from '../lib/platform/sandbox';import {session,requireAdmin} from '../lib/platform/auth';import {POST as ai} from '../app/api/ai/run/route';import {POST as execute} from '../app/api/execute/route';
// next/headers is substituted by scripts/test-platform.mjs, keeping real credentials out of tests.
import {cookies} from 'next/headers';
const originalFetch=globalThis.fetch;
process.env.APP_ORIGIN='https://sukoaa.example';
const request=(origin:string,data:unknown={})=>new Request('https://sukoaa.example/api/projects',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)});

test('cross-site mutations are rejected even with a valid-looking request',()=>{assert.throws(()=>sameOrigin(request('https://evil.example')),e=>e instanceof HttpError&&e.status===403);assert.doesNotThrow(()=>sameOrigin(request('https://sukoaa.example')))});
test('mutation without Origin is rejected',()=>{assert.throws(()=>sameOrigin(new Request('https://sukoaa.example/api/projects',{method:'POST'})))});
test('stream size limits do not depend on Content-Length',async()=>{await assert.rejects(()=>body(request('https://sukoaa.example',{source:'x'.repeat(1000)}),100),e=>e instanceof HttpError&&e.status===413)});
test('project validator rejects unknown runtimes and oversized code',()=>{assert.throws(()=>projectInput({name:'x',language:'shell',source:''}));assert.throws(()=>projectInput({name:'x',language:'javascript',source:'x'.repeat(50001)}));assert.equal(projectInput({name:' example ',language:'go',source:'hello'}).name,'example')});
test('Unicode code and stdin survive the runner transport',()=>{const input='নমস্কার Sukoaa ✳';assert.equal(fromBase64(toBase64(input)),input)});
test('missing remote configuration returns an explicit setup error',()=>{delete process.env.JUDGE0_URL;assert.throws(()=>runnerConfig('python'),e=>e instanceof HttpError&&e.code==='RUNNER_NOT_CONFIGURED')});
test('sandbox frames escape script closing tags and block outbound connections',()=>{const code='console.log("</script><img src=x>")';const frame=jsFrame(code,'test-channel');assert.ok(frame.includes("connect-src 'none'"));assert.equal((frame.match(/<\/script>/g)||[]).length,1);const react=reactFrame('function App(){return null}',code,'react-channel');assert.equal((react.match(/<\/script>/g)||[]).length,1)});
test('AI remains disabled and never invokes a provider',async()=>{let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('Must not call')};try{const response=await ai();assert.equal(response.status,503);assert.equal((await response.json() as {code:string}).code,'AI_DISABLED');assert.equal(calls,0)}finally{globalThis.fetch=originalFetch}});
test('production writes fail closed when Redis is not configured',async()=>{const prior=process.env.NODE_ENV;Object.assign(process.env,{NODE_ENV:'production'});delete process.env.UPSTASH_REDIS_REST_URL;delete process.env.UPSTASH_REDIS_REST_TOKEN;try{await assert.rejects(()=>rateLimit('user',3),e=>e instanceof HttpError&&e.code==='REDIS_REQUIRED')}finally{Object.assign(process.env,{NODE_ENV:prior||'test'})}});
test('Redis rate limit uses an atomic Lua counter and enforces the limit',async()=>{process.env.UPSTASH_REDIS_REST_URL='https://redis.example';process.env.UPSTASH_REDIS_REST_TOKEN='test-token';let count=0;globalThis.fetch=async(_url,init)=>{const command=JSON.parse(String(init?.body));assert.equal(command[0],'EVAL');assert.ok(command[1].includes("'EXPIRE'"));return Response.json({result:++count})};try{await rateLimit('member',2);await rateLimit('member',2);await assert.rejects(()=>rateLimit('member',2),e=>e instanceof HttpError&&e.status===429)}finally{globalThis.fetch=originalFetch;delete process.env.UPSTASH_REDIS_REST_URL;delete process.env.UPSTASH_REDIS_REST_TOKEN}});
test('forged auth cookies are verified remotely and rejected',async()=>{process.env.SUPABASE_URL='https://database.example';process.env.SUPABASE_PUBLISHABLE_KEY='test-public';const jar=await cookies();jar.set('sukoaa-access','forged');let calls=0;globalThis.fetch=async(url)=>{assert.ok(String(url).endsWith('/auth/v1/user'));calls++;return Response.json({error:'invalid'}, {status:401})};try{await assert.rejects(()=>session(),e=>e instanceof HttpError&&e.status===401);assert.equal(calls,1)}finally{jar.delete('sukoaa-access');globalThis.fetch=originalFetch}});
test('member cannot access admin route based on client-supplied metadata',async()=>{const jar=await cookies();jar.set('sukoaa-access','verified-member');process.env.UPSTASH_REDIS_REST_URL='https://redis.example';process.env.UPSTASH_REDIS_REST_TOKEN='test';globalThis.fetch=async(url)=>{const u=String(url);if(u.includes('/auth/v1/user'))return Response.json({id:'00000000-0000-4000-8000-000000000001',user_metadata:{role:'admin'}});if(u.includes('redis.example'))return Response.json({result:1});return Response.json([{role:'member'}])};try{await assert.rejects(()=>requireAdmin(),e=>e instanceof HttpError&&e.status===403)}finally{jar.delete('sukoaa-access');globalThis.fetch=originalFetch;delete process.env.UPSTASH_REDIS_REST_URL;delete process.env.UPSTASH_REDIS_REST_TOKEN}});
test('remote run never starts without required Redis',async()=>{let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('Should not call')};try{const response=await execute(request('https://sukoaa.example',{language:'python',source:'print(1)'}));assert.equal(response.status,503);assert.equal(calls,0)}finally{globalThis.fetch=originalFetch}});

// Diagnostics tests exercise the actual browser-compiler worker with a local TS runtime.

import './diagnostics.test';
import './studio.test';

import './marketing.test';

import './python-sandbox.test';

import './accounts.test';
import './data-tools.test';

import "./editor-keys.test";

import "./console-values.test";

import "./python-http.test";

import './compiled-languages.test';

test('Unavailable releases stay out of search and the public sitemap',()=>{
 const prior={SITE_URL:process.env.SITE_URL,SITE_INDEXING_ENABLED:process.env.SITE_INDEXING_ENABLED,VERCEL_ENV:process.env.VERCEL_ENV};
 try {
  process.env.SITE_URL='https://www.sukoaa.com';process.env.SITE_INDEXING_ENABLED='true';process.env.VERCEL_ENV='production';
  for(const path of unlistedPaths){
   assert.deepEqual(pageMetadata('Release','Availability',path).robots,{index:false,follow:true});
   assert.equal(publicPaths.includes(path),false);
  }
  for(const path of ['/','/tools/javascript','/tools/python','/browser','/practice/python/count-words-dictionary']){
   assert.deepEqual(pageMetadata('Ready','Description',path).robots,{index:true,follow:true});
   assert.equal(publicPaths.includes(path),true);
  }
 } finally {for(const [key,value] of Object.entries(prior)){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});

import './angular.test';

import './runtime-startup.test';
