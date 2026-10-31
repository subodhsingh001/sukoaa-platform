import {HttpError} from './http';
export const redisConfigured=()=>Boolean(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN);
export async function redis<T>(command:(string|number)[]):Promise<T>{
  const url=process.env.UPSTASH_REDIS_REST_URL;const token=process.env.UPSTASH_REDIS_REST_TOKEN;
  if(!url?.startsWith('https://')||!token)throw new HttpError(503,'Redis configuration required.','REDIS_REQUIRED');
  const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(command),cache:'no-store',signal:AbortSignal.timeout(5000)});
  if(!response.ok)throw new HttpError(503,'Rate limiting is temporarily unavailable.','REDIS_UNAVAILABLE');
  const result=await response.json() as {result:T;error?:string};if(result.error)throw new HttpError(503,'Redis command failed.','REDIS_UNAVAILABLE');return result.result;
}
const local=new Map<string,{count:number;expires:number}>();
export async function rateLimit(identifier:string,limit=30,seconds=60){
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identifier)))).map(x=>x.toString(16).padStart(2,'0')).join('');
  const key=`sukoaa:rate:${hash}`;let count:number;
  if(redisConfigured()){
    const script="local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";
    count=await redis<number>(['EVAL',script,1,key,seconds]);
  }else if(process.env.NODE_ENV==='production'){
    throw new HttpError(503,'Set up Redis to enable protected production actions.','REDIS_REQUIRED');
  }else{
    const now=Date.now();for(const [k,v] of local){if(v.expires<=now)local.delete(k)}
    if(local.size>10000)throw new HttpError(503,'Local limiter capacity reached.');
    const entry=local.get(key);const next=entry&&entry.expires>now?{...entry,count:entry.count+1}:{count:1,expires:now+seconds*1000};local.set(key,next);count=next.count;
  }
  if(count>limit)throw new HttpError(429,'Too many requests. Please try again shortly.','RATE_LIMITED',seconds);
}
export function anonymousKey(request:Request){
  // Configure only a header your hosting proxy OVERWRITES. Never trust arbitrary X-Forwarded-For.
  const header=process.env.TRUSTED_CLIENT_IP_HEADER;
  return header?(request.headers.get(header)?.split(',')[0].trim()||'shared-anonymous'):'shared-anonymous';
}
