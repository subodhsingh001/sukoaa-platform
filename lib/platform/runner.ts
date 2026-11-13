import {isRemoteLanguage,runnerLanguageEnv,remoteLanguageNames,type RemoteLanguage} from './remote-languages';
import {HttpError} from './http';
export type RunnerResponse={token?:string;status?:{id:number;description:string};stdout?:string;stderr?:string;compile_output?:string;message?:string;time?:string;memory?:number};
export function runnerConfig(language:RemoteLanguage){
 if(!isRemoteLanguage(language))throw new HttpError(400,'Unsupported runner language.');
 const base=process.env.JUDGE0_URL?.replace(/\/$/,'');const id=Number(process.env[runnerLanguageEnv[language]]);
 if(!base||!Number.isInteger(id)||id<=0)throw new HttpError(503,remoteLanguageNames[language]+' runner is not configured. Set JUDGE0_URL and '+runnerLanguageEnv[language]+'.','RUNNER_NOT_CONFIGURED');
 if(!validRunnerUrl(base))throw new HttpError(503,'The remote runner must use HTTPS.');
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

function validRunnerUrl(raw:string){try{const url=new URL(raw);return url.protocol==='https:'&&!url.username&&!url.password&&!url.search&&!url.hash}catch{return false}}
export function runnerAvailable(language:RemoteLanguage){try{runnerConfig(language);return true}catch{return false}}
export function runnerSubmission(language:RemoteLanguage,source:string,stdin:string){const {id}=runnerConfig(language);return {source_code:toBase64(source),stdin:toBase64(stdin),language_id:id,cpu_time_limit:2,wall_time_limit:5,memory_limit:language==='java'||language==='csharp'?256000:128000,max_processes_and_or_threads:language==='java'||language==='csharp'?64:16,max_file_size:1024,enable_network:false,number_of_runs:1}}
