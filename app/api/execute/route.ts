import {body,route,json,sameOrigin,text,HttpError} from '@/lib/platform/http';import {requireUser} from '@/lib/platform/auth';import {redis,redisConfigured,rateLimit} from '@/lib/platform/redis';import {runnerConfig,runnerFetch,toBase64} from '@/lib/platform/runner';
export async function POST(req:Request){return route(async()=>{
 sameOrigin(req);if(!redisConfigured())throw new HttpError(503,'Remote execution requires Redis.','REDIS_REQUIRED');
 const {user}=await requireUser('remote-run',5);await rateLimit('remote-daily:'+user.id,50,86400);await rateLimit('remote-global',100,60);
 const input=await body(req,40000);if(input.language!=='python'&&input.language!=='go')throw new HttpError(400,'Remote execution supports Python and Go only.');
 const {id}=runnerConfig(input.language);const source=text(input.source,'Source',20000,1);const stdin=text(input.stdin??'','Standard input',5000);
 const submission=await runnerFetch('/submissions?base64_encoded=true&wait=false',{method:'POST',body:JSON.stringify({source_code:toBase64(source),stdin:toBase64(stdin),language_id:id,cpu_time_limit:2,wall_time_limit:5,memory_limit:128000,max_processes_and_or_threads:16,max_file_size:1024,enable_network:false,number_of_runs:1})});
 if(typeof submission.token!=='string'||!/^[a-zA-Z0-9-]{10,100}$/.test(submission.token))throw new HttpError(502,'Invalid runner response.');
 const executionId=crypto.randomUUID();await redis(['SET','sukoaa:job:'+executionId,JSON.stringify({owner:user.id,token:submission.token,language:input.language}), 'EX',300]);return json({id:executionId,status:'queued'},202);
})}
