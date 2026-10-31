import {remoteDiagnostics} from '@/lib/platform/diagnostics';
import {fromBase64} from '@/lib/platform/runner';
import {route,json,HttpError,uuid} from '@/lib/platform/http';import {requireUser} from '@/lib/platform/auth';import {redis} from '@/lib/platform/redis';import {runnerFetch,runnerOutput} from '@/lib/platform/runner';
export async function GET(_req:Request,ctx:{params:Promise<{id:string}>}){return route(async()=>{
 const {user}=await requireUser('remote-poll',120);const {id}=await ctx.params;const raw=await redis<string|null>(['GET','sukoaa:job:'+uuid(id)]);if(!raw)throw new HttpError(404,'Execution expired or not found.');
 const job=typeof raw==='string'?JSON.parse(raw):raw;if(job.owner!==user.id)throw new HttpError(404,'Execution not found.');
 const result=await runnerFetch(`/submissions/${encodeURIComponent(job.token)}?base64_encoded=true&fields=stdout,stderr,compile_output,message,status,time,memory`);
 return json({id,status:result.status?.description||'Unknown',done:![1,2].includes(result.status?.id??0),output:runnerOutput(result),time:result.time,memory:result.memory,diagnostics:job.language&&(result.status?.id??0)>3?remoteDiagnostics(job.language,[fromBase64(result.stderr),fromBase64(result.compile_output)].filter(Boolean).join('\n')):[]});
})}
