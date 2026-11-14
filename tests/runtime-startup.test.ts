import test from 'node:test';import assert from 'node:assert/strict';
import type {WebContainer,WebContainerProcess} from '@webcontainer/api';
import {scopedContainer} from '../lib/studio/runtime-scope';
import {detachRuntimeSession} from '../lib/studio/runtime-session';
import {template} from '../lib/studio/project';
import {NodeRuntime} from '../lib/studio/node-runtime';import {runtimeWait} from '../lib/studio/runtime-wait';import {angularTemplate} from '../lib/studio/angular';
const observer={channel:'startup-test',mode:'node' as const,origins:[],mocks:{},responses:false};
const limits={boot:25,probe:25,files:25,install:25,server:25};
function fakeContainer(failure=''){
 const handlers=new Map<string,Set<Function>>();let kills=0,installs=0,servers=0,probes=0;const spawns:{command:string;args:string[];options:unknown}[]=[];const writes:string[]=[],removed:string[]=[];
 const process=(output='',exit?:number):WebContainerProcess=>{
  let close!:()=>void;let resolveExit!:(code:number)=>void;
  const done=new Promise<number>(resolve=>{resolveExit=resolve;});
  const stream=new ReadableStream<string>({start(controller){if(output)controller.enqueue(output);close=()=>{try{controller.close();}catch{}};if(failure!=='open-stream'&&!(failure==='probe'&&output==='')){close();}}});
  if(exit!==undefined)resolveExit(exit);
  return {output:stream,exit:done,kill(){kills++;close();resolveExit(143);}} as WebContainerProcess;
 };
 const container={fs:{rm:async(path:string)=>{removed.push(path)},mkdir:async()=>{},writeFile:async(path:string)=>{writes.push(path)},readdir:async()=>[]},mount:async()=>{},export:async()=>new Uint8Array([1,2,3]),setPreviewScript:async()=>{},on(name:string,callback:Function){let listeners=handlers.get(name);if(!listeners){listeners=new Set();handlers.set(name,listeners)}listeners.add(callback);return()=>listeners!.delete(callback);},spawn:async(command:string,args:string[],options?:unknown)=>{
  spawns.push({command,args,options});
  if(command==='node'){probes++;return failure==='probe'?process(''):process('24.22.1',0);}
  if(args[0]==='install'){installs++;return process('',failure==='install'?undefined:0);}
  servers++;
  if(failure==='exit')return process('',0);
  const server=process();if(failure!=='server')queueMicrotask(()=>{const port=(options as {cwd?:string})?.cwd==='projects/nextjs'?3000:4200;for(const listener of handlers.get('server-ready')||[])listener(port,port===3000?'https://next-preview.example':'https://test-preview.example')});return server;
 }} as unknown as WebContainer;
 return {container,kills:()=>kills,installs:()=>installs,servers:()=>servers,probes:()=>probes,spawns,writes,removed};
}
async function browserTask(task:()=>Promise<void>){const descriptor=Object.getOwnPropertyDescriptor(globalThis,'window');Object.defineProperty(globalThis,'window',{value:{isSecureContext:true,crossOriginIsolated:true},configurable:true});try{await task();}finally{if(descriptor)Object.defineProperty(globalThis,'window',descriptor);else Reflect.deleteProperty(globalThis,'window');}}
test('background preparation installs dependencies without starting or auto-resuming application code',()=>browserTask(async()=>{
 for(const project of [angularTemplate(),template('nextjs')]){const mock=fakeContainer();const runtime=new NodeRuntime({log(){},issue(){},ready(){assert.fail('Preparation must not open a preview')}},{acquire:async()=>mock.container,limits,scope:project.files['angular.json']?'projects/angular':'projects/nextjs'});
 try{await runtime.prepare(project);assert.equal(mock.installs(),1);assert.equal(mock.servers(),0);assert.equal(runtime.canResume(),false);
 runtime.updateCallbacks({log(){},issue(){},ready(){}});await runtime.start(project,observer);assert.equal(mock.installs(),1);assert.equal(mock.servers(),1);
 }finally{runtime.stop();}}
}));
test('Run joins pending preparation and synchronizes the newest edits before starting one server',()=>browserTask(async()=>{
 const mock=fakeContainer();let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);const project=template('nextjs');const runtime=new NodeRuntime({log(){},issue(){},ready(){}},{acquire:async()=>{await gate;return mock.container;},limits:{...limits,boot:500},scope:'projects/nextjs'});
 try{const prepare=runtime.prepare(project);const edited={...project,files:{...project.files,'pages/index.tsx':'export default function Page(){return <h1>Latest edit</h1>}'}};const run=runtime.start(edited,observer);release();await Promise.all([prepare,run]);assert.equal(mock.installs(),1);assert.equal(mock.servers(),1);assert.equal(mock.writes.filter(path=>path==='projects/nextjs/pages/index.tsx').length,2);}
 finally{runtime.stop();}
}));
test('startup deadline and cancellation reject pending provider work',async()=>{
 await assert.rejects(runtimeWait(new Promise(()=>{}),5,'Provider timeout'),/Provider timeout/);
 const controller=new AbortController();const pending=runtimeWait(new Promise(()=>{}),1000,'unused',controller.signal);controller.abort();await assert.rejects(pending,{name:'AbortError'});
 assert.equal(await runtimeWait(Promise.resolve(0),50,'unused'),0);
});
test('Node startup reports phases and completes only after a preview exists',()=>browserTask(async()=>{
 const mock=fakeContainer();const phases:string[]=[];let preview='';const runtime=new NodeRuntime({log(){},issue(){},phase:text=>phases.push(text),ready:url=>{preview=url}},{acquire:async()=>mock.container,limits});
 try{await runtime.start(angularTemplate(),observer);assert.equal(preview,'https://test-preview.example');assert.deepEqual(phases,['Loading browser Node runtime','Checking Angular Node compatibility','Writing project files','Installing npm dependencies','Compiling project and starting preview']);}finally{runtime.stop();}
}));
test('a stalled version probe or dependency install fails and kills its process',()=>browserTask(async()=>{
 for(const kind of ['probe','install']){const mock=fakeContainer(kind);const runtime=new NodeRuntime({log(){},issue(){},ready(){assert.fail('No preview should be ready');}},{acquire:async()=>mock.container,limits});await assert.rejects(runtime.start(angularTemplate(),observer),/timed out|version check/);assert.ok(mock.kills()>0);}
}));
test('server exit before ready, missing preview port and stop cannot leave startup pending',()=>browserTask(async()=>{
 for(const kind of ['exit','server']){const mock=fakeContainer(kind);const runtime=new NodeRuntime({log(){},issue(){},ready(){assert.fail('Unexpected preview');}},{acquire:async()=>mock.container,limits});await assert.rejects(runtime.start(angularTemplate(),observer),kind==='exit'?/exited before the preview/:/timed out/);}
 const runtime=new NodeRuntime({log(){},issue(){},ready(){}},{acquire:()=>new Promise(()=>{}),limits});const pending=runtime.start(angularTemplate(),observer);runtime.stop();await assert.rejects(pending,{name:'AbortError'});
}));

test('editing and running an Angular project reuses the server, skips unchanged files and preserves caches',()=>browserTask(async()=>{
 const mock=fakeContainer(),project=angularTemplate();let ready=0;
 const runtime=new NodeRuntime({log(){},issue(){},ready(){ready++}},{acquire:async()=>mock.container,limits});
 try{await runtime.start(project,observer);const written=mock.writes.length,removed=mock.removed.length,killed=mock.kills();
 await runtime.start({...project,files:{...project.files,'src/app/home.html':'<h1>Changed</h1>'}},observer);
 assert.equal(mock.installs(),1);assert.equal(mock.servers(),1);assert.equal(mock.kills(),killed);assert.equal(mock.removed.length,removed);assert.equal(mock.writes.length,written+1);assert.equal(mock.writes.at(-1),'src/app/home.html');assert.equal(ready,2);
 runtime.stop();await runtime.start(project,observer);assert.equal(mock.installs(),1);assert.equal(mock.servers(),2);
 const pkg=JSON.parse(project.files['package.json']);pkg.dependencies.rxjs='7.8.1';await runtime.start({...project,files:{...project.files,'package.json':JSON.stringify(pkg)}},observer);assert.equal(mock.installs(),2);assert.equal(mock.servers(),3);
 }finally{runtime.stop()}
}));

test('a printed Node version and successful exit do not wait for stream EOF',()=>browserTask(async()=>{
 const mock=fakeContainer('open-stream');const runtime=new NodeRuntime({log(){},issue(){},ready(){}},{acquire:async()=>mock.container,limits});
 try{await runtime.start(angularTemplate(),observer);runtime.stop();await runtime.start(angularTemplate(),observer);assert.equal(mock.probes(),1,'compatible VM is checked once')}finally{runtime.stop()}
}));
test('detaching a Studio view preserves its live server for return navigation',()=>browserTask(async()=>{
 const mock=fakeContainer(),project=angularTemplate();const runtime=new NodeRuntime({log(){},issue(){},ready(){}},{acquire:async()=>mock.container,limits});
 try{await runtime.start(project,observer);const kills=mock.kills();detachRuntimeSession(runtime);assert.equal(mock.kills(),kills);assert.equal(runtime.canResume(),true);let resumed=false;runtime.updateCallbacks({log(){},issue(){},ready(){resumed=true}});await runtime.start(project,observer);assert.equal(resumed,true);assert.equal(mock.installs(),1);assert.equal(mock.servers(),1)}finally{runtime.stop()}
}));
test('returning during startup joins the existing install instead of killing it',()=>browserTask(async()=>{
 const mock=fakeContainer(),project=angularTemplate();let release!:()=>void;const gate=new Promise<void>(r=>{release=r});
 const runtime=new NodeRuntime({log(){},issue(){},ready(){}},{acquire:async()=>{await gate;return mock.container},limits:{...limits,boot:1000}});
 const first=runtime.start(project,observer);detachRuntimeSession(runtime);const returning=runtime.start(project,observer);release();try{await Promise.all([first,returning]);assert.equal(mock.installs(),1);assert.equal(mock.servers(),1)}finally{runtime.stop()}
}));
test('Angular and Next keep separate filesystem folders in one browser VM',async()=>{
 const mock=fakeContainer();const angular=await scopedContainer(mock.container,'projects/angular'),next=await scopedContainer(mock.container,'projects/nextjs');
 await angular.fs.writeFile('package.json','angular');await next.fs.writeFile('package.json','next');assert.deepEqual(mock.writes,['projects/angular/package.json','projects/nextjs/package.json']);
 await angular.spawn('node',['-p','process.versions.node']);await next.spawn('node',['-p','process.versions.node']);assert.deepEqual(mock.spawns.map(s=>(s.options as {cwd:string}).cwd),['projects/angular','projects/nextjs']);
 await assert.rejects(scopedContainer(mock.container,'../other'));
});
test('returning to Angular after Next reuses its retained dependencies',()=>browserTask(async()=>{
 const mock=fakeContainer(),callbacks={log(){},issue(){},ready(){}},a=new NodeRuntime(callbacks,{acquire:async()=>mock.container,scope:'projects/angular',limits}),n=new NodeRuntime(callbacks,{acquire:async()=>mock.container,scope:'projects/nextjs',limits});
 const project=angularTemplate();try{await a.start(project,observer);await n.start(template('nextjs'),observer);await a.start(project,observer);assert.equal(mock.installs(),2);assert.equal(mock.probes(),1);assert.equal(mock.servers(),2)}finally{a.stop();n.stop()}
}));

test('concurrent Angular and Next startup route server events to the correct preview',()=>browserTask(async()=>{
 const mock=fakeContainer(),angular=angularTemplate(),next=template('nextjs');let aUrl='',nUrl='';const a=new NodeRuntime({log(){},issue(){},ready(url){aUrl=url}},{acquire:async()=>mock.container,scope:'projects/angular',limits}),n=new NodeRuntime({log(){},issue(){},ready(url){nUrl=url}},{acquire:async()=>mock.container,scope:'projects/nextjs',limits});
 try{await Promise.all([a.start(angular,observer),n.start(next,observer)]);assert.equal(aUrl,'https://test-preview.example');assert.equal(nUrl,'https://next-preview.example');const installs=mock.installs();await a.start(angular,observer);await n.start(next,observer);assert.equal(mock.installs(),installs);assert.equal(mock.servers(),2)}finally{a.stop();n.stop()}
}));
