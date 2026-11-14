import type {WebContainer,WebContainerProcess,SpawnOptions} from '@webcontainer/api';
// Keep actual filesystem objects in the live VM. No dependency export/restore.
export async function scopedContainer(base:WebContainer,scope:string):Promise<WebContainer>{
 if(!/^projects\/(angular|nextjs|react|native)$/.test(scope))throw new Error('Invalid runtime workspace');
 await base.fs.mkdir(scope,{recursive:true});
 const fs=new Proxy(base.fs,{get(target,key){const value=Reflect.get(target,key);if(typeof value!=='function')return value;if(['readFile','writeFile','rm','mkdir','readdir'].includes(String(key)))return (name:string,...args:unknown[])=>Reflect.apply(value,target,[scope+'/'+name,...args]);return value.bind(target);}});
 return new Proxy(base,{get(target,key){if(key==='fs')return fs;if(key==='spawn')return (command:string,args:string[],options?:SpawnOptions):Promise<WebContainerProcess>=>base.spawn(command,args,{...options,cwd:scope});const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value;}});
}
