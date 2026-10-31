import {HttpError} from './http';
export type RunnerResponse={token?:string;status?:{id:number;description:string};stdout?:string;stderr?:string;compile_output?:string;message?:string;time?:string;memory?:number};
export function runnerConfig(language:'python'|'go'){
 const base=process.env.JUDGE0_URL?.replace(/\/$/,'');const id=Number(process.env[language==='python'?'JUDGE0_PYTHON_ID':'JUDGE0_GO_ID']);
 if(!base||!Number.isInteger(id)||id<=0)throw new HttpError(503,'Connect an isolated Judge0 runner and configure its language IDs first.','RUNNER_NOT_CONFIGURED');
 if(!base.startsWith('https://'))throw new HttpError(503,'The remote runner must use HTTPS.');
 return {base,id};
}
export async function runnerFetch(path:string,init:RequestInit={}){
 const base=process.env.JUDGE0_URL?.replace(/\/$/,'');if(!base)throw new HttpError(503,'Runner is not configured.');
 const headers:Record<string,string>={'Content-Type':'application/json'};
 if(process.env.JUDGE0_AUTH_TOKEN)headers['X-Auth-Token']=process.env.JUDGE0_AUTH_TOKEN;
 if(process.env.JUDGE0_RAPIDAPI_KEY){headers['X-RapidAPI-Key']=process.env.JUDGE0_RAPIDAPI_KEY;headers['X-RapidAPI-Host']=new URL(base).host}
 const response=await fetch(base+path,{...init,headers:{...headers,...init.headers},cache:'no-store',signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new HttpError(502,'The isolated runner rejected this request.','RUNNER_ERROR');return response.json() as Promise<RunnerResponse>;
}
export function toBase64(value:string){const bytes=new TextEncoder().encode(value);let s='';for(const byte of bytes)s+=String.fromCharCode(byte);return btoa(s)}
export function fromBase64(value:string|null|undefined){if(!value)return '';try{const raw=atob(value);return new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0)))}catch{return 'Unable to decode runner output.'}}
export function runnerOutput(value:RunnerResponse){return ['stdout','stderr','compile_output','message'].map(key=>fromBase64(value[key as keyof RunnerResponse] as string)).filter(Boolean).join('\n').slice(0,30000)}
