export type ObserverConfig={channel:string;mode:'fast'|'node';origins:string[];mocks:Record<string,{status?:number;delay?:number;body?:unknown}>;responses:boolean};
// Deliberately self-contained: this function is serialized into the preview, never the editor origin.
function observe(config:ObserverConfig){
 const win=window as Window & {__sukoaaObserved?:boolean};if(win.__sukoaaObserved)return;win.__sukoaaObserved=true;let count=0,requestCount=0;
 const secret=/password|token|secret|authorization|cookie|api[-_]?key/i;
 const clean=(value:unknown)=>{try{return (typeof value==='string'?value:JSON.stringify(value,(key,val)=>secret.test(key)?'[redacted]':val)).replace(/((?:token|password|secret|api_key)\s*[=:]\s*)[^\s&,"']+/gi,'$1[redacted]').slice(0,5000)}catch{return String(value).slice(0,2000)}};
 const urlText=(value:string)=>{try{const url=new URL(value,location.protocol==='about:'?'https://preview.invalid':location.href);for(const key of [...url.searchParams.keys()])if(secret.test(key))url.searchParams.set(key,'[redacted]');url.username='';url.password='';return value.startsWith('/')?url.pathname+url.search:url.href}catch{return value.slice(0,500)}};
 const send=(kind:string,value:unknown)=>{parent.postMessage({channel:config.channel,kind,value},'*')};
 const originalConsole={log:console.log,info:console.info,warn:console.warn,error:console.error,debug:console.debug};
 for(const level of ['log','info','warn','error','debug'] as const){console[level]=(...args:unknown[])=>{originalConsole[level](...args);if(count++<300)send('console',{level,text:args.map(clean).join(' '),time:new Date().toISOString()})}}
 const issue=(error:unknown,file?:string,line?:number,column?:number)=>{const err=error as Error;send('issue',{message:clean(err?.message?`${err.name}: ${err.message}`:error),stack:err?.stack?.slice(0,8000),file,line,column,source:'Preview'})};
 window.addEventListener('error',e=>issue(e.error||e.message,e.filename,e.lineno,e.colno));window.addEventListener('unhandledrejection',e=>issue(e.reason));
 const nativeFetch=window.fetch.bind(window);
 const nativeXHR=window.XMLHttpRequest;
 const capture=async(response:Response)=>{if(!config.responses)return undefined;const type=response.headers.get('content-type')||'';if(!/json|text/.test(type))return '[binary response omitted]';const reader=response.clone().body?.getReader();if(!reader)return '';let size=0,result='';const decoder=new TextDecoder();try{while(size<4096){const chunk=await reader.read();if(chunk.done)break;const take=chunk.value.subarray(0,4096-size);size+=take.length;result+=decoder.decode(take,{stream:true});if(take.length<chunk.value.length)break}}finally{reader.cancel().catch(()=>{})}try{return clean(JSON.parse(result))}catch{return clean(result)+(size>=4096?' …[truncated]':'')}};
 window.fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
  const request=input instanceof Request?input:undefined;const raw=request?.url||String(input);const method=(init?.method||request?.method||'GET').toUpperCase();const start=performance.now();const id=String(++requestCount)+'-'+Date.now();let url:URL;try{url=new URL(raw,location.protocol==='about:'?'https://preview.invalid':location.href)}catch{throw new Error('Invalid request URL')}
  const mock=config.mode==='fast'?config.mocks[method+' '+url.pathname]:undefined;const mode=mock?'mock':config.mode==='node'||config.origins.includes(url.origin)?'live':'blocked';
  if(requestCount>200)throw new Error('Preview request capture limit reached (200). Run again to reset.');
  const base={id,method,url:urlText(raw),mode};send('network',{...base,status:0,duration:0});
  try{
   if(mode==='blocked')throw new Error('Live API blocked. Add this origin in Project settings, then Run. Browser CORS still applies.');
   let response:Response;
   if(mock){await new Promise(resolve=>setTimeout(resolve,Math.min(Math.max(mock.delay||0,0),5000)));response=new Response(JSON.stringify(mock.body??{}),{status:mock.status||200,headers:{'Content-Type':'application/json'}})}
   else response=await nativeFetch(input,{...init,credentials:config.mode==='fast'?'omit':init?.credentials});
   const done={...base,status:response.status,duration:Math.round(performance.now()-start)};send('network',done);capture(response).then(preview=>{if(preview!==undefined)send('network',{...done,response:preview})}).catch(()=>{});return response;
  }catch(e){send('network',{...base,status:0,duration:Math.round(performance.now()-start),error:clean((e as Error).message)});throw e}
 };
 // XHR is observed without changing native response semantics; mocks use fetch only.
 const open=nativeXHR.prototype.open,sendXHR=nativeXHR.prototype.send;const records=new WeakMap<XMLHttpRequest,{method:string;url:string;start:number;id:string}>();
 nativeXHR.prototype.open=function(method:string,url:string|URL,...args:unknown[]){records.set(this,{method:method.toUpperCase(),url:String(url),start:0,id:''});return (open as Function).call(this,method,url,...args)};
 nativeXHR.prototype.send=function(body?:Document|XMLHttpRequestBodyInit|null){const record=records.get(this);if(record){let url:URL;try{url=new URL(record.url,location.href)}catch{url=new URL('https://preview.invalid')}
  if(config.mode==='fast'&&!config.origins.includes(url.origin))throw new Error('Live XHR blocked. Add the API origin in Project settings.');
  record.start=performance.now();record.id=String(++requestCount)+'-'+Date.now();this.addEventListener('loadend',()=>send('network',{...record,url:urlText(record.url),mode:'live',status:this.status,duration:Math.round(performance.now()-record.start)}),{once:true});
 }return sendXHR.call(this,body)};
}
export function observerScript(config:ObserverConfig){return `(${observe.toString()})(${JSON.stringify(config)});`}
