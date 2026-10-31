import * as esbuild from 'esbuild-wasm';
import {buildOptions,projectPlugin} from './bundler';
import {checkedRuntimeAsset} from './runtime-assets';
import type {StudioProject} from './project';
let initialized:Promise<void>|undefined;
let queue:Promise<unknown>=Promise.resolve();
export function fallbackBundle(project:StudioProject,signal?:AbortSignal){
 const task=queue.catch(()=>{}).then(async()=>{
  signal?.throwIfAborted();
  initialized??=checkedRuntimeAsset('/runtime/studio/esbuild.wasm','wasm').then(bytes=>WebAssembly.compile(bytes as ArrayBuffer)).then(wasmModule=>esbuild.initialize({wasmModule,worker:false})).catch(error=>{initialized=undefined;throw error});
  await initialized;signal?.throwIfAborted();
  const result=await esbuild.build({...buildOptions,entryPoints:[project.entry],plugins:[projectPlugin(project)]});
  signal?.throwIfAborted();const files=result.outputFiles||[];
  return {code:files.find(f=>f.path.endsWith('.js'))?.text||'',css:files.find(f=>f.path.endsWith('.css'))?.text||'',map:files.find(f=>f.path.endsWith('.js.map'))?.text};
 });queue=task;return task;
}
