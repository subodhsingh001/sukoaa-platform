import type {Plugin} from 'esbuild-wasm';
import {resolveFile,type StudioProject} from './project';
export function projectPlugin(project:StudioProject):Plugin{
 let dependencies:Record<string,string>={};try{dependencies=JSON.parse(project.files['package.json']||'{}').dependencies||{}}catch{throw new Error('Fix package.json: it must be valid JSON.')}
 return {name:'sukoaa-project',setup(build){
  build.onResolve({filter:/.*/},args=>{
   const spec=args.path;
   if(spec==='react-native'&&project.files['sukoaa.native.json'])return {path:spec,namespace:'sukoaa-builtins'};
   if(['react','react-dom','react-dom/client','react/jsx-runtime','react/jsx-dev-runtime'].includes(spec))return {path:spec,namespace:'sukoaa-builtins'};
   if(spec.startsWith('.')||spec.startsWith('@/')||args.kind==='entry-point'){
    const resolved=resolveFile(project.files,args.importer,spec);if(!resolved)return {errors:[{text:'Cannot find '+spec+'. Check the file name and import path.'}]};return {path:resolved,namespace:'sukoaa-project'};
   }
   const parts=spec.split('/');const pkg=spec.startsWith('@')?parts.slice(0,2).join('/'):parts[0];const sub=parts.slice(spec.startsWith('@')?2:1).join('/');
   if(pkg==='next'||spec.startsWith('node:'))return {errors:[{text:'This import needs the Node runtime. React Fast preview cannot run Next.js or Node built-ins.'}]};
   if(!/^(?:@[\w.-]+\/)?[\w.-]+$/.test(pkg)||!/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(dependencies[pkg]||''))return {errors:[{text:`Add an exact version for “${pkg}” in package.json dependencies (for example 1.2.3), or use Node runtime for npm version ranges.`}]};
   if(sub.split('/').some(p=>p==='..'||!/^[-\w.]*$/.test(p)))return {errors:[{text:'Unsupported package subpath.'}]};
   return {path:`https://esm.sh/${pkg}@${dependencies[pkg]}${sub?'/'+sub:''}?bundle&external=react,react-dom`,external:true};
  });
  build.onLoad({filter:/.*/,namespace:'sukoaa-builtins'},args=>({contents:args.path==='react-native'?'module.exports=globalThis.ReactNativeWeb;':args.path==='react'?'module.exports=globalThis.React;':args.path.startsWith('react-dom')?'module.exports=globalThis.ReactDOM;':'module.exports={Fragment:globalThis.React.Fragment,jsx:(type,props,key)=>globalThis.React.createElement(type,{...props,key}),jsxs:(type,props,key)=>globalThis.React.createElement(type,{...props,key}),jsxDEV:(type,props,key)=>globalThis.React.createElement(type,{...props,key})};',loader:'js'}));
  build.onLoad({filter:/.*/,namespace:'sukoaa-project'},args=>{const ext=args.path.split('.').pop()?.toLowerCase();const loader=ext==='tsx'?'tsx':ext==='ts'?'ts':ext==='jsx'?'jsx':ext==='json'?'json':ext==='css'?'css':ext==='svg'?'dataurl':'js';return {contents:project.files[args.path],loader}});
 }};
}
export const buildOptions={bundle:true,write:false,format:'esm' as const,platform:'browser' as const,target:'es2020',sourcemap:'external' as const,sourcesContent:true,outfile:'/out/project.js',jsx:'automatic' as const,define:{'process.env.NODE_ENV':'"development"'},logLevel:'silent' as const};
