// Simulated chat-completions endpoint for learning. It never calls a real model and stores nothing.
// Shape follows the common OpenAI-style /chat/completions format so existing client code and SDKs can practise against it.
const MAX_BODY=20_000,MAX_MESSAGES=20,MAX_CONTENT=4_000;
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Expose-Headers':'X-Sukoaa-Simulated, Retry-After','X-Content-Type-Options':'nosniff','X-Sukoaa-Simulated':'true'};
const buckets=new Map<string,{n:number;until:number}>();
function limited(req:Request){const ip=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim().slice(0,64),now=Date.now();for(const [k,v] of buckets)if(v.until<now)buckets.delete(k);const b=buckets.get(ip)||{n:0,until:now+60_000};b.n++;buckets.set(ip,b);if(buckets.size>5000)buckets.clear();return b.n>30}
function json(data:unknown,status=200,extra:Record<string,string>={}){return new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra}})}
function fail(status:number,message:string,code:string,extra:Record<string,string>={}){return json({error:{message,type:status===429?'rate_limit_error':status>=500?'server_error':'invalid_request_error',code}},status,extra)}
export function estimateTokens(text:string){return Math.max(1,Math.ceil(text.length/4))}
export function replyFor(messages:{role:string;content:string}[],model:string,jsonMode:boolean){
 const last=[...messages].reverse().find(m=>m.role==='user')?.content||'';const preview=last.replace(/\s+/g,' ').trim().slice(0,120);
 if(jsonMode)return JSON.stringify({answer:'This is a simulated JSON reply.',echo:preview,confidence:0.5});
 const system=messages.find(m=>m.role==='system');
 return 'This is a simulated reply from the Sukoaa demo model ('+model+'). You asked: “'+preview+'”. '+(system?'A system message was present, so a real model would also follow its instructions. ':'')+'A real model would write something different, but this response has the same shape as a real chat completion, so you can practise parsing it, streaming it and handling errors.';
}
function parse(body:unknown){
 if(!body||typeof body!=='object')return 'Send a JSON object with a messages array.';
 const b=body as Record<string,unknown>;
 if(!Array.isArray(b.messages)||b.messages.length<1||b.messages.length>MAX_MESSAGES)return 'messages must be an array of 1 to '+MAX_MESSAGES+' items.';
 for(const m of b.messages){if(!m||typeof m!=='object')return 'Each message needs a role and content.';const {role,content}=m as Record<string,unknown>;if(!['system','user','assistant'].includes(String(role)))return 'role must be system, user or assistant.';if(typeof content!=='string'||content.length>MAX_CONTENT)return 'content must be a string of at most '+MAX_CONTENT+' characters.';}
 if(b.model!==undefined&&(typeof b.model!=='string'||b.model.length>60))return 'model must be a short string.';
 if(b.max_tokens!==undefined&&(!Number.isInteger(b.max_tokens)||(b.max_tokens as number)<1||(b.max_tokens as number)>400))return 'max_tokens must be a whole number from 1 to 400.';
 if(b.stream!==undefined&&typeof b.stream!=='boolean')return 'stream must be true or false.';
 return null;
}
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export async function chatRequest(req:Request):Promise<Response>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method==='GET')return json({endpoint:'POST /api/demo/chat/completions',simulated:true,body:{model:'demo-chat (optional)',messages:[{role:'user',content:'Hello'}],stream:'true or false',max_tokens:'1-400 (optional)',response_format:{type:'json_object'}},scenarios:{'demo-slow':'waits about 1.2 seconds','demo-error-429':'returns 429 with Retry-After','demo-error-500':'returns 500','demo-json':'same as response_format json_object'},limits:'30 requests per minute per address. Nothing is stored.'});
 if(req.method!=='POST')return fail(405,'Use POST.','method_not_allowed',{Allow:'GET, POST, OPTIONS'});
 if(limited(req))return fail(429,'Too many demo requests. Retry in a minute.','rate_limit_exceeded',{'Retry-After':'60'});
 const type=req.headers.get('content-type')||'';if(!type.includes('application/json'))return fail(415,'Send Content-Type: application/json.','unsupported_media_type');
 const text=await req.text();if(text.length>MAX_BODY)return fail(413,'Body is larger than '+MAX_BODY+' bytes.','body_too_large');
 let body:unknown;try{body=JSON.parse(text)}catch{return fail(400,'Body is not valid JSON.','invalid_json')}
 const problem=parse(body);if(problem)return fail(400,problem,'invalid_request');
 const b=body as {model?:string;messages:{role:string;content:string}[];stream?:boolean;max_tokens?:number;response_format?:{type?:string}};
 const model=b.model||'demo-chat';
 if(model==='demo-error-429')return fail(429,'Simulated rate limit. Wait and retry.','rate_limit_exceeded',{'Retry-After':'3'});
 if(model==='demo-error-500')return fail(500,'Simulated server error.','server_error');
 if(model==='demo-slow')await sleep(1200);
 const jsonMode=model==='demo-json'||b.response_format?.type==='json_object';
 let content=replyFor(b.messages,model,jsonMode),finish='stop';
 if(b.max_tokens&&!jsonMode){const maxChars=b.max_tokens*4;if(content.length>maxChars){content=content.slice(0,maxChars).replace(/\s+\S*$/,'');finish='length'}}
 const id='chatcmpl-demo-'+Math.random().toString(36).slice(2,10),created=Math.floor(Date.now()/1000);
 const promptTokens=estimateTokens(b.messages.map(m=>m.content).join(' ')),completionTokens=estimateTokens(content);
 if(!b.stream)return json({id,object:'chat.completion',created,model,choices:[{index:0,message:{role:'assistant',content},finish_reason:finish}],usage:{prompt_tokens:promptTokens,completion_tokens:completionTokens,total_tokens:promptTokens+completionTokens},simulated:true});
 const enc=new TextEncoder(),words=content.match(/\S+\s*/g)||[content];
 const frame=(delta:object,fr:string|null)=>enc.encode('data: '+JSON.stringify({id,object:'chat.completion.chunk',created,model,choices:[{index:0,delta,finish_reason:fr}]})+'\n\n');
 const stream=new ReadableStream({async start(c){try{c.enqueue(frame({role:'assistant',content:''},null));for(const w of words){await sleep(35);c.enqueue(frame({content:w},null))}c.enqueue(frame({},finish));c.enqueue(enc.encode('data: [DONE]\n\n'))}finally{c.close()}}});
 return new Response(stream,{status:200,headers:{...cors,'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-store','X-Accel-Buffering':'no'}});
}
