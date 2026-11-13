import {isRemoteLanguage} from '@/lib/platform/remote-languages';
import {body,route,json,sameOrigin,text,HttpError} from '@/lib/platform/http';import {requireUser} from '@/lib/platform/auth';import {redis,redisConfigured,rateLimit} from '@/lib/platform/redis';import {runnerConfig,runnerFetch,runnerSubmission} from '@/lib/platform/runner';
export async function POST(req:Request){return route(async()=>{
 sameOrigin(req);if(!redisConfigured())throw new HttpError(503,'Remote execution requires Redis.','REDIS_REQUIRED');
 const {user}=await requireUser('remote-run',5);await rateLimit('remote-daily:'+user.id,50,86400);await rateLimit('remote-global',100,60);
 const input=await body(req,40000);if(!isRemoteLanguage(input.language))throw new HttpError(400,'Unsupported remote execution language.');
 runnerConfig(input.language);const source=text(input.source,'Source',20000,1);const stdin=text(input.stdin??'','Standard input',5000);
 const submission=await runnerFetch('/submissions?base64_encoded=true&wait=false',{method:'POST',body:JSON.stringify(runnerSubmission(input.language,source,stdin))});
 if(typeof submission.token!=='string'||!/^[a-zA-Z0-9-]{10,100}$/.test(submission.token))throw new HttpError(502,'Invalid runner response.');
 const executionId=crypto.randomUUID();await redis(['SET','sukoaa:job:'+executionId,JSON.stringify({owner:user.id,token:submission.token,language:input.language}), 'EX',300]);return json({id:executionId,status:'queued'},202);
})}
