import {DiagnosticError,type Compilation} from './diagnostics';
export async function api<T=Record<string,unknown>>(path:string,method='GET',data?:unknown):Promise<T>{
 const response=await fetch(path,{method,headers:data?{'Content-Type':'application/json'}:undefined,body:data?JSON.stringify(data):undefined,cache:'no-store'});
 const value=await response.json() as T & {error?:string};if(!response.ok)throw new Error(value.error||'Request failed.');return value;
}
let reactRuntime:string|undefined;
export async function loadReactRuntime(){if(!reactRuntime){const response=await fetch('/runtime/react.js');if(!response.ok)throw new Error('React runtime is missing. Run npm run prepare:runtimes.');reactRuntime=await response.text()}return reactRuntime}
export function transpile(source:string,react=false,javascript=false){return new Promise<Compilation>((resolve,reject)=>{
 const worker=new Worker('/runtime/transpile-worker.js');const timer=setTimeout(()=>{worker.terminate();reject(new Error('TypeScript compilation timed out.'))},8000);
 worker.onmessage=e=>{clearTimeout(timer);worker.terminate();e.data.error?reject(new DiagnosticError(e.data.diagnostics||[{message:e.data.error}])):resolve({code:e.data.code,sourceMap:e.data.sourceMap})};
 worker.onerror=()=>{clearTimeout(timer);worker.terminate();reject(new Error('TypeScript runtime could not load. Run npm run prepare:runtimes.'))};worker.postMessage({source,react,javascript});
})}
export function download(name:string,source:string,type='text/plain'){const url=URL.createObjectURL(new Blob([source],{type}));const anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

let sqlRuntime:string|undefined;
export async function loadSqlRuntime(signal?:AbortSignal){if(sqlRuntime)return sqlRuntime;const response=await fetch('/runtime/sql/sql-wasm-inline.js',{signal});if(!response.ok)throw new Error('SQL runtime files are unavailable. Please reload or contact support.');const text=await response.text();if(!text.includes('initSqlJs')||text.trimStart().startsWith('<'))throw new Error('SQL runtime could not load. Please reload.');return sqlRuntime=text}
