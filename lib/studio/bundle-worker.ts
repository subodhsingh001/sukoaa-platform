import * as esbuild from 'esbuild-wasm';import {runtimeAsset} from './runtime-assets';import {projectPlugin,buildOptions} from './bundler';import {validateProject,type StudioIssue} from './project';
let initialized:Promise<void>|undefined;
self.onmessage=async(event:MessageEvent)=>{let initializedHere=false;try{
 const project=validateProject(event.data.project);initialized??=esbuild.initialize({wasmURL:new URL(runtimeAsset('/runtime/studio/esbuild.wasm'),self.location.origin).href,worker:false});await initialized;initializedHere=true;
 const result=await esbuild.build({...buildOptions,entryPoints:[project.entry],plugins:[projectPlugin(project)]});
 const files=result.outputFiles||[];self.postMessage({id:event.data.id,code:files.find(f=>f.path.endsWith('.js'))?.text||'',css:files.find(f=>f.path.endsWith('.css'))?.text||'',map:files.find(f=>f.path.endsWith('.js.map'))?.text});
}catch(error){const e=error as {message:string;errors?:{text:string;location?:{file:string;line:number;column:number}}[]};const issues:StudioIssue[]=(e.errors||[]).map(d=>({message:d.text,file:d.location?.file.replace(/^sukoaa-project:/,''),line:d.location?.line,column:d.location?d.location.column+1:undefined,source:'Build'}));self.postMessage({id:event.data.id,error:e.message,recoverable:!initializedHere,issues:issues.length?issues:[{message:e.message,source:'Build'}]})}};
