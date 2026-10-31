import {checkedRuntimeAsset,runtimeAsset} from './runtime-assets';
import type {StudioProject} from './project';
import type {BundleResult} from './client';
type LocalBundler=(project:StudioProject,signal?:AbortSignal)=>Promise<BundleResult>;
declare global{interface Window{sukoaaFallbackBundle?:LocalBundler}}
let loading:Promise<void>|undefined;
export async function fallbackBundle(project:StudioProject,signal?:AbortSignal){
 signal?.throwIfAborted();
 if(!window.sukoaaFallbackBundle){
  loading??=new Promise<void>((resolve,reject)=>{
   const script=document.createElement('script');script.src=runtimeAsset('/runtime/studio/fallback-bundler.js');script.async=true;
   const timer=setTimeout(()=>{script.remove();reject(new Error('The compatibility bundler did not load within 15 seconds.'))},15000);
   script.onload=()=>{clearTimeout(timer);window.sukoaaFallbackBundle?resolve():reject(new Error('The compatibility runtime did not initialize. Regenerate runtime assets.'))};
   script.onerror=()=>{clearTimeout(timer);script.remove();checkedRuntimeAsset('/runtime/studio/fallback-bundler.js','script',signal).then(()=>reject(new Error('The browser blocked the local compatibility script. Check script-src in your hosting CSP.')),reject)};
   document.head.appendChild(script);
  }).catch(error=>{loading=undefined;throw error});
  await loading;
 }
 signal?.throwIfAborted();return window.sukoaaFallbackBundle!(project,signal);
}
