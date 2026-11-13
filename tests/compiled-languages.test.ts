import test from 'node:test';
import assert from 'node:assert/strict';
import {cookies} from 'next/headers';
import {compiledLanguages,runnerLanguageEnv} from '../lib/platform/remote-languages';
import {runnerConfig,runnerSubmission,fromBase64,toBase64} from '../lib/platform/runner';
import {templates} from '../lib/platform/templates';
import {remoteDiagnostics} from '../lib/platform/diagnostics';
import {projectInput} from '../lib/platform/validation';
import {POST as execute} from '../app/api/execute/route';
import {GET as poll} from '../app/api/execute/[id]/route';
const samples={c:'main.c:8:5: error: undeclared identifier',cpp:'main.cpp:9:7: error: name was not declared',rust:'error[E0425]: cannot find value\n --> main.rs:4:9',csharp:'Main.cs(10,9): error CS0103: name does not exist',java:'Main.java:11: error: cannot find symbol'};
for(const language of compiledLanguages){
 test(language+' runner configuration, limits, imports and source round trip',()=>{
  const before={...process.env};try{
   process.env.JUDGE0_URL='https://runner.example';delete process.env[runnerLanguageEnv[language]];assert.throws(()=>runnerConfig(language));
   process.env[runnerLanguageEnv[language]]='0';assert.throws(()=>runnerConfig(language));process.env[runnerLanguageEnv[language]]='91';
   const payload=runnerSubmission(language,templates[language].source,'Sukoaa\n');assert.equal(payload.language_id,91);assert.equal(fromBase64(payload.source_code),templates[language].source);assert.equal(fromBase64(payload.stdin),'Sukoaa\n');assert.equal(payload.enable_network,false);assert.equal(payload.cpu_time_limit,2);assert.equal(payload.wall_time_limit,5);assert.ok(payload.memory_limit<=256000);assert.ok(payload.max_processes_and_or_threads<=64);assert.ok(templates[language].source.includes(language==='c'||language==='cpp'?'#include':language==='rust'?'use std::io':language==='java'?'import java.util':'using System'));
   assert.equal(projectInput({name:'Demo',language,source:templates[language].source}).language,language);
   process.env.JUDGE0_URL='http://runner.example';assert.throws(()=>runnerConfig(language));process.env.JUDGE0_URL='https://user:secret@runner.example';assert.throws(()=>runnerConfig(language));
  }finally{for(const key of Object.keys(process.env))if(!(key in before))delete process.env[key];Object.assign(process.env,before)}
 });
 test(language+' compiler errors carry an original source line',()=>{const result=remoteDiagnostics(language,samples[language]);assert.equal(result.length,1);assert.ok(result[0].line!>0);assert.ok(result[0].column!>0);assert.equal(result[0].source,templates[language].filename)});
 test(language+' authenticated submission and polling protect ownership and decode errors',async()=>{
  const before={...process.env},originalFetch=globalThis.fetch,jar=await cookies();let job:string|undefined;let posted=false;
  Object.assign(process.env,{APP_ORIGIN:'https://sukoaa.example',SUPABASE_URL:'https://database.example',SUPABASE_PUBLISHABLE_KEY:'public-test',UPSTASH_REDIS_REST_URL:'https://redis.example',UPSTASH_REDIS_REST_TOKEN:'test',JUDGE0_URL:'https://runner.example',[runnerLanguageEnv[language]]:'91'});jar.set('sukoaa-access','test-session');
  globalThis.fetch=async(url,init)=>{const u=String(url);
   if(u.includes('/auth/v1/user'))return Response.json({id:'00000000-0000-4000-8000-000000000001'});
   if(u.startsWith('https://redis.example')){const args=JSON.parse(String(init?.body));if(args[0]==='SET'){job=args[2];return Response.json({result:'OK'})}if(args[0]==='GET')return Response.json({result:job});return Response.json({result:1})}
   if(u.startsWith('https://runner.example/submissions?')){posted=true;const data=JSON.parse(String(init?.body));assert.equal(data.language_id,91);assert.equal(data.enable_network,false);assert.equal(fromBase64(data.source_code),templates[language].source);assert.equal(data.additional_files,undefined);assert.equal(data.compiler_options,undefined);return Response.json({token:'sample-token-12345'})}
   if(u.startsWith('https://runner.example/submissions/'))return Response.json({status:{id:6,description:'Compilation Error'},compile_output:toBase64(samples[language])});throw new Error('Unexpected request');
  };
  try{const result=await execute(new Request('https://sukoaa.example/api/execute',{method:'POST',headers:{origin:'https://sukoaa.example','Content-Type':'application/json'},body:JSON.stringify({language,source:templates[language].source,stdin:'Sukoaa\n',enable_network:true})}));assert.equal(result.status,202);assert.ok(posted);const data=await result.json() as {id:string;token?:string};assert.equal(data.token,undefined);assert.equal(JSON.parse(job!).language,language);
   const output=await poll(new Request('https://sukoaa.example/api/execute/'+data.id),{params:Promise.resolve({id:data.id})});const body=await output.json() as {done:boolean;diagnostics:{line:number}[];token?:string};assert.equal(body.done,true);assert.equal(body.diagnostics.length,1);assert.equal(body.token,undefined);
   job=JSON.stringify({...JSON.parse(job!),owner:'other-user'});const denied=await poll(new Request('https://sukoaa.example/api/execute/'+data.id),{params:Promise.resolve({id:data.id})});assert.equal(denied.status,404);
  }finally{jar.delete('sukoaa-access');globalThis.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in before))delete process.env[key];Object.assign(process.env,before)}
 });
}
