import {filePath,validateProject,MAX_FILES,type StudioProject as ProjectDocument} from './project';
import {isAngularProject,supportsAngularNode} from './angular';
import type {WebContainer,WebContainerProcess} from '@webcontainer/api';
import type {StudioProject} from './project';
import {observerScript,type ObserverConfig} from './observer';
import {dependencyKey} from './dependency-key';
import {scopedContainer} from './runtime-scope';
import {runtimeWait} from './runtime-wait';
export type NodeCallbacks={log:(text:string)=>void;ready:(url:string)=>void;issue:(message:string,stack?:string)=>void;failed?:(message:string)=>void;phase?:(message:string)=>void};
export function nodePreflight(){
 if(!window.isSecureContext)return 'Node runtime needs HTTPS or http://localhost. This preview host is not a secure browser context.';
 if(!window.crossOriginIsolated||typeof SharedArrayBuffer==='undefined')return 'Node runtime needs cross-origin isolation. Serve /studio with COOP: same-origin and COEP: credentialless, then reload.';
 if(process.env.NEXT_PUBLIC_WEBCONTAINER_MODE==='disabled')return 'Node runtime is disabled by the site owner.';
 if(process.env.NEXT_PUBLIC_WEBCONTAINER_MODE==='licensed'&&!process.env.NEXT_PUBLIC_WEBCONTAINER_API_KEY)return 'The site owner needs to configure the WebContainer commercial API key.';
}
const checkedVersions=new WeakMap<WebContainer,string>();
let bootPromise:Promise<WebContainer>|undefined;const activeRuntimes=new Set<NodeRuntime>();
async function acquireContainer(){
 const api=await import('@webcontainer/api');
 if(!bootPromise){
  if(process.env.NEXT_PUBLIC_WEBCONTAINER_API_KEY)api.configureAPIKey(process.env.NEXT_PUBLIC_WEBCONTAINER_API_KEY);
  bootPromise=api.WebContainer.boot({coep:'credentialless',workdirName:'sukoaa',forwardPreviewErrors:'exceptions-only'}).catch(error=>{bootPromise=undefined;throw error});
 }
 return bootPromise;
}
export function warmNodeRuntime(){if(nodePreflight())return;void acquireContainer().catch(()=>{});}
export function serverKey(project:StudioProject){return JSON.stringify([project.id,project.files['package.json'],...Object.entries(project.files).filter(([name])=>/^(?:angular\.json|(?:next|vite)\.config\.|tsconfig)/.test(name))]);}
export function projectPort(project:StudioProject){let script='';try{script=JSON.parse(project.files['package.json']||'{}').scripts?.dev||''}catch{}const explicit=script.match(/(?:--port(?:=|\s+)|(?:^|\s)-p\s+|(?:^|\s)PORT=)(\d+)/);if(explicit)return Number(explicit[1]);if(/\bng\s+serve\b/.test(script))return 4200;if(/\bnext\s+dev\b/.test(script))return 3000;return undefined;}
type RuntimeLimits={boot:number;probe:number;files:number;install:number;server:number};
const defaultLimits:RuntimeLimits={boot:45000,probe:15000,files:30000,install:180000,server:120000};
export class NodeRuntime{
 private container?:WebContainer;private processes=new Set<WebContainerProcess>();private listeners:(()=>void)[]=[];private mounted=new Set<string>();private sources=new Map<string,string>();private installed='';private attempted='';private session=0;private controller?:AbortController;private liveUrl='';private liveKey='';private pending?:Promise<void>;private pendingKey='';private failed=false;private port?:number;
 constructor(private callbacks:NodeCallbacks,private options:{acquire?:()=>Promise<WebContainer>;limits?:Partial<RuntimeLimits>;scope?:string}={}){}
 updateCallbacks(callbacks:NodeCallbacks){this.callbacks=callbacks}
 canResume(){return !this.failed&&!!(this.pending||this.liveUrl||this.installed||this.attempted)}
 async start(project:StudioProject,observer:ObserverConfig):Promise<void>{
  const key=serverKey(project);
  if(this.pending&&this.pendingKey===key){this.callbacks.phase?.('Continuing existing project setup');await this.pending;return this.begin(project,observer);}
  const pending=this.begin(project,observer);this.pending=pending;this.pendingKey=key;
  try{await pending}finally{if(this.pending===pending){this.pending=undefined;this.pendingKey=''}}
 }
 private async begin(project:StudioProject,observer:ObserverConfig){
  this.failed=false;
  const blocked=nodePreflight();if(blocked)throw new Error(blocked);
  if(this.liveUrl&&this.liveKey===serverKey(project)&&this.container&&activeRuntimes.has(this)){
   const current=this.session;this.callbacks.phase?.('Updating running preview');
   await this.container.setPreviewScript(observerScript({...observer,mode:'node',mocks:{}}));
   await this.sync(project);if(current===this.session&&this.liveUrl)this.callbacks.ready(this.liveUrl);return;
  }
  const port=projectPort(project);const retainedScopes=['projects/angular','projects/nextjs'];
  for(const other of activeRuntimes){if(other===this)continue;const separate=retainedScopes.includes(this.options.scope||'')&&retainedScopes.includes(other.options.scope||'')&&port!==undefined&&other.port!==undefined&&port!==other.port;if(!separate)other.stop();}
  this.stop();this.port=port;activeRuntimes.add(this);
  const current=++this.session;const controller=new AbortController();this.controller=controller;
  const limits={...defaultLimits,...this.options.limits};
  const step=<T>(label:string,work:()=>Promise<T>,ms:number)=>{
   this.callbacks.phase?.(label);this.callbacks.log('\n'+label+'…\n');
   return runtimeWait(Promise.resolve().then(work),ms,label+' timed out. Open Terminal for details. Check your connection and browser restrictions, or export and run locally.',controller.signal);
  };
  try{
   const base=await step('Loading browser Node runtime',this.options.acquire||acquireContainer,limits.boot);
   if(current!==this.session)return;const container=this.container??(this.options.scope?await scopedContainer(base,this.options.scope):base);this.container=container;
   if(isAngularProject(project)){
    const version=await step('Checking Angular Node compatibility',async()=>{
     const cached=checkedVersions.get(base);if(cached)return cached;
     const probe=await base.spawn('node',['-p','process.versions.node']);this.processes.add(probe);const reader=probe.output.getReader();let output='';
     const read=async()=>{while(true){const chunk=await reader.read();if(chunk.done)throw new Error('Node did not print its version.');output+=chunk.value;const match=output.match(/^\s*v?(\d+\.\d+\.\d+)\s*$/m);if(match)return match[1];if(output.length>4000)throw new Error('Unexpected Node version response.');}};
     try{const [value]=await runtimeWait(Promise.all([read(),probe.exit.then(code=>{if(code!==0)throw new Error('Could not read the browser Node version.');})]),limits.probe,'Node did not answer its version check. Retry startup; if it repeats, use Save draft & reload to restart the browser runtime.',controller.signal);checkedVersions.set(base,value);return value;}
     finally{void reader.cancel().catch(()=>{});probe.kill();this.processes.delete(probe);}
    },limits.probe+5);
    if(!supportsAngularNode(version))throw new Error('Angular 22 needs Node 22.22.3+, 24.15+ or 26+. This browser runtime reports '+version+'. Export the project and run it with a supported local Node version.');
   }
   if(current!==this.session)return;
   let previewReady=false;let resolveReady!:(url:string)=>void;let rejectReady!:(error:Error)=>void;
   const ready=new Promise<string>((resolve,reject)=>{resolveReady=resolve;rejectReady=reject;});ready.catch(()=>{});
   const fail=(error:Error)=>{
    if(current!==this.session)return;
    if(previewReady){this.callbacks.failed?.(error.message);this.stop();}
    else{rejectReady(error);controller.abort(error);}
   };
   this.listeners.push(container.on('server-ready',(port,url)=>{if(current===this.session&&(this.port===undefined||port===this.port)){previewReady=true;resolveReady(url);}}));
   this.listeners.push(container.on('preview-message',message=>{if(current===this.session&&(this.port===undefined||message.port===this.port)&&'message'in message)this.callbacks.issue(message.message,message.stack);}));
   this.listeners.push(container.on('error',error=>fail(new Error('Browser runtime: '+error.message))));
   await step('Writing project files',async()=>{
    await container.setPreviewScript(observerScript({...observer,mode:'node',mocks:{}}));
    await this.sync(project);
   },limits.files);
   const packageJson=await dependencyKey(project.files);
   if(this.installed!==packageJson){
    if(this.attempted!==packageJson){
    this.attempted=packageJson;
    await container.fs.rm('node_modules',{recursive:true,force:true});
    for(const path of ['.next','.next-dev','.angular'])await container.fs.rm(path,{recursive:true,force:true});
    if(!project.files['package-lock.json'])await container.fs.rm('package-lock.json',{force:true});
    }
    await step('Installing npm dependencies',async()=>{
     const process=await container.spawn('npm',['install','--no-audit','--no-fund','--ignore-scripts','--no-progress','--prefer-offline']);this.track(process,current);
     const code=await process.exit;this.processes.delete(process);
     if(code!==0)throw new Error('npm install failed with exit code '+code+'. Read Terminal and check package.json.');
    },limits.install);
    this.installed=packageJson;
   }
   const url=await step('Compiling project and starting preview',async()=>{
    const server=await container.spawn('npm',['run','dev'],isAngularProject(project)?{env:{CI:'false',NG_CLI_ANALYTICS:'false'}}:undefined);this.track(server,current);
    server.exit.then(code=>{this.processes.delete(server);if(current===this.session)fail(new Error(previewReady?'Development server stopped (exit '+code+'). Run the project again.':'Development server exited before the preview was ready (exit '+code+'). Read Terminal for the compiler error.'));}).catch(error=>fail(error instanceof Error?error:new Error(String(error))));
    return ready;
   },limits.server);
   if(current===this.session){this.liveUrl=url;this.liveKey=serverKey(project);this.callbacks.ready(url);}
  }catch(error){if(current===this.session){this.stop();this.failed=true;}throw error;}
 }
 private track(process:WebContainerProcess,current:number){if(current!==this.session){process.kill();return;}this.processes.add(process);process.output.pipeTo(new WritableStream({write:text=>{if(current===this.session)this.callbacks.log(text)}})).catch(()=>{})}
 async sync(project:StudioProject){if(!this.container)return;const fs=this.container.fs;const next=new Set(Object.keys(project.files));const parents=(paths:Iterable<string>)=>new Set([...paths].flatMap(path=>path.split('/').slice(0,-1).map((_part,index)=>path.split('/').slice(0,index+1).join('/'))));const keepDirs=new Set([...parents(next),...project.folders]);const oldDirs=[...parents(this.mounted)].sort((a,b)=>b.length-a.length);for(const path of this.mounted)if(!next.has(path))await fs.rm(path,{force:true});for(const dir of oldDirs)if(!keepDirs.has(dir)){try{if(!(await fs.readdir(dir)).length)await fs.rm(dir,{recursive:true,force:true})}catch{}}for(const path of project.folders)await fs.mkdir(path,{recursive:true});for(const [path,source]of Object.entries(project.files)){if(this.sources.get(path)===source)continue;const parent=path.slice(0,path.lastIndexOf('/'));if(path.includes('/'))await fs.mkdir(parent,{recursive:true});await fs.writeFile(path,source)}this.mounted=next;this.sources=new Map(Object.entries(project.files))}
 async pull(project:ProjectDocument){
  if(!this.container)throw new Error('Start the Node runtime first.');
  const files:Record<string,string>={};const folders:string[]=[];
  const walk=async(dir:string)=>{for(const item of await this.container!.fs.readdir(dir||'.',{withFileTypes:true})){
   const path=dir?dir+'/'+item.name:item.name;
   try{filePath(path)}catch{continue}
   if(item.isDirectory()){if(item.name.startsWith('.')||['coverage','build'].includes(item.name))continue;folders.push(path);if(folders.length>300)throw new Error('Runtime contains too many source folders. Export locally instead.');await walk(path);}
   else if(!['package-lock.json','npm-shrinkwrap.json'].includes(path)&&/\.(?:[cm]?[jt]sx?|json|html|css|scss|sass|less|md|svg|txt)$/.test(path)||path.endsWith('.gitignore')){
    if(Object.keys(files).length>=MAX_FILES)throw new Error('Runtime source exceeds the project file limit.');
    files[path]=await this.container!.fs.readFile(path,'utf-8');
   }
  }};
  await walk('');return validateProject({...project,files,folders});
 }
 async command(command:string){if(!this.container)throw new Error('Start Node runtime before using the terminal.');const process=await this.container.spawn('jsh',['-c',command]);this.track(process,this.session);const code=await process.exit;this.processes.delete(process);return code}
 stop(){this.liveUrl='';this.liveKey='';this.session++;this.controller?.abort();this.controller=undefined;for(const process of this.processes)process.kill();this.processes.clear();this.listeners.forEach(fn=>fn());this.listeners=[];activeRuntimes.delete(this)}
 dispose(){this.stop();if(this.container){this.container.teardown();this.container=undefined;bootPromise=undefined;this.installed='';this.attempted='';this.mounted.clear();this.sources.clear()}}
}
