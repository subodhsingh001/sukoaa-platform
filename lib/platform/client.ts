import {DiagnosticError,type Compilation} from './diagnostics';
export class ApiError extends Error {constructor(message:string,public status:number,public code='REQUEST_FAILED'){super(message);this.name='ApiError'}}
export async function api<T=Record<string,unknown>>(path:string,method='GET',data?:unknown):Promise<T>{
 let response:Response;
 try{response=await fetch(path,{method,credentials:'same-origin',headers:data?{'Content-Type':'application/json'}:undefined,body:data?JSON.stringify(data):undefined,cache:'no-store',signal:AbortSignal.timeout(20000)})}catch(error){throw new ApiError(error instanceof Error&&(error.name==='TimeoutError'||error.name==='AbortError')?'The request took too long. Please try again.':'Unable to connect. Check your connection and try again.',0,'NETWORK_ERROR')}
 const raw=await response.text();let value:T&{error?:string;code?:string};
 try{value=JSON.parse(raw)}catch{throw new ApiError(response.status===403?'This request was blocked. Reload the website and try again. If it continues, contact support.':`The server returned an unexpected response (${response.status}). Please try again.`,response.status,'INVALID_RESPONSE')}
 if(!response.ok)throw new ApiError(value?.error||`The request failed (${response.status}). Please try again.`,response.status,value?.code);
 if(!value||typeof value!=='object')throw new ApiError('The server returned an incomplete response. Please try again.',response.status,'INVALID_RESPONSE');return value;
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
