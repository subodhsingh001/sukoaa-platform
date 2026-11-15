import {redis,redisConfigured} from '../platform/redis';
import {HttpError} from '../platform/http';
import type {ApiConfig,Tables} from './builder';
export type RepoSource={owner:string;repo:string;ref:string;path:string;sha:string;autoSync:boolean;checkedAt:number};
export type Sandbox={id:string;auth:string;expiresAt:number;revision:number;tables:Tables;config?:ApiConfig;source?:RepoSource};
const local=new Map<string,string>();
export const lifetime=24*60*60;
export async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),v=>v.toString(16).padStart(2,'0')).join('');}
export function secret(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');}
function check(){if(!redisConfigured()&&process.env.NODE_ENV==='production')throw new HttpError(503,'Private sandboxes are not enabled on this deployment. The public demo remains available.','SANDBOX_UNAVAILABLE');}
const key=(id:string)=>'sukoaa:demo:sandbox:'+id;
export async function readSandbox(id:string,token:string):Promise<Sandbox>{
 check();if(!/^[0-9a-f-]{36}$/.test(id)||!/^[a-f0-9]{64}$/.test(token))throw new HttpError(401,'Use the sandbox Bearer token.');
 const raw=redisConfigured()?await redis<string|null>(['GET',key(id)]):local.get(id);
 if(!raw)throw new HttpError(404,'Sandbox not found or expired.');const s=JSON.parse(raw) as Sandbox;
 if(s.auth!==await digest(token))throw new HttpError(401,'Incorrect sandbox token.');if(s.expiresAt<=Date.now()){local.delete(id);throw new HttpError(410,'Sandbox expired. Create a new one.');}return s;
}
export async function insertSandbox(s:Sandbox){check();if(JSON.stringify(s).length>500000)throw new HttpError(413,'Generated data exceeds 500KB. Reduce record counts or fields.');if(redisConfigured()){const ok=await redis<string|null>(['SET',key(s.id),JSON.stringify(s),'EX',lifetime,'NX']);if(!ok)throw new HttpError(409,'Try creating a sandbox again.');}else{for(const[id,raw]of local)if(JSON.parse(raw).expiresAt<Date.now())local.delete(id);if(local.size>=100)throw new HttpError(429,'Local sandbox capacity reached.');local.set(s.id,JSON.stringify(s));}}
export async function commitSandbox(before:Sandbox,after:Sandbox){check();after.revision=before.revision+1;const raw=JSON.stringify(after);if(raw.length>500000)throw new HttpError(413,'Sandbox storage limit reached.');const ttl=Math.floor((before.expiresAt-Date.now())/1000);if(ttl<=0)throw new HttpError(410,'Sandbox expired.');let ok:boolean;if(redisConfigured()){const script="if redis.call('GET',KEYS[1])==ARGV[1] then redis.call('SET',KEYS[1],ARGV[2],'EX',ARGV[3]);return 1 else return 0 end";ok=Boolean(await redis<number>(['EVAL',script,1,key(before.id),JSON.stringify(before),raw,ttl]));}else{ok=local.get(before.id)===JSON.stringify(before);if(ok)local.set(before.id,raw);}if(!ok)throw new HttpError(409,'Another request changed the sandbox. Reload and retry.');}
export async function removeSandbox(s:Sandbox){if(redisConfigured()){const n=await redis<number>(['EVAL',"if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end",1,key(s.id),JSON.stringify(s)]);if(!n)throw new HttpError(409,'Sandbox changed. Retry deletion.');}else if(local.get(s.id)===JSON.stringify(s))local.delete(s.id);else throw new HttpError(409,'Sandbox changed. Retry deletion.');}
export function publicSandbox(s:Sandbox){return {id:s.id,expiresAt:s.expiresAt,revision:s.revision,resources:Object.fromEntries(Object.entries(s.tables).map(([k,v])=>[k,v.length])),config:s.config||null,source:s.source||null,storage:redisConfigured()?'redis':'development-memory'};}
