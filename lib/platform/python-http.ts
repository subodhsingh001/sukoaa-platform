export const PYTHON_API_ORIGIN='https://jsonplaceholder.typicode.com';
export type PythonHttpRequest={id:number;url:string;method:string;headers?:string;timeout?:number};
export type PythonHttpResult={ok:boolean;status?:number;headers?:Record<string,string>;url?:string;body?:string;error?:string;kind?:'blocked'|'timeout'|'network'};
export type PythonNetworkRecord={id:number;url:string;method:string;status?:number;duration:number;error?:string;preview?:string};
export function validatePythonHttp(value:unknown):PythonHttpRequest{
 if(!value||typeof value!=='object')throw new Error('Invalid API request.');const r=value as PythonHttpRequest;
 if(!Number.isSafeInteger(r.id)||r.id<1||typeof r.url!=='string'||r.url.length>2048)throw new Error('Invalid API request.');
 const url=new URL(r.url);if(url.origin!==PYTHON_API_ORIGIN||url.username||url.password)throw new Error('Only https://jsonplaceholder.typicode.com is allowed in demo API mode.');
 if(!['GET','HEAD'].includes(r.method))throw new Error('Demo API mode supports GET and HEAD only.');
 if(typeof r.headers==='string'){if(r.headers.length>8192)throw new Error('Request headers are too large.');const headers=JSON.parse(r.headers);if(!headers||typeof headers!=='object'||Array.isArray(headers))throw new Error('Invalid request headers.');for(const name of Object.keys(headers)){if(/^(authorization|proxy-authorization|cookie|set-cookie)$/i.test(name))throw new Error('Credentials and cookies cannot be sent from the Python playground.')}}
 return {...r,url:url.href,timeout:Math.min(10000,Math.max(1,Number.isFinite(r.timeout)?r.timeout!:10000))};
}
export function createPythonHttpSession(enabled:boolean,onRecord:(record:PythonNetworkRecord)=>void,transport:typeof fetch=fetch){
 let count=0,closed=false;const controllers=new Set<AbortController>();
 return {abort(){closed=true;for(const c of controllers)c.abort();controllers.clear()},async request(value:unknown):Promise<PythonHttpResult>{
  const started=performance.now();let request:PythonHttpRequest|undefined,controller:AbortController|undefined,timer:ReturnType<typeof setTimeout>|undefined;
  try{
   if(closed||!enabled)throw new Error('API access is off. Enable demo API access before running requests.');
   if(++count>5)throw new Error('Maximum 5 API requests per run.');request=validatePythonHttp(value);
   controller=new AbortController();controllers.add(controller);timer=setTimeout(()=>controller?.abort(),request.timeout);
   const response=await transport(request.url,{method:request.method,headers:{Accept:'application/json'},credentials:'omit',mode:'cors',redirect:'error',cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});
   if(Number(response.headers.get('content-length'))>262144)throw new Error('API response exceeds 256 KB.');
   let bytes=0;const chunks:Uint8Array[]=[];const reader=response.body?.getReader();
   if(reader){try{while(true){const next=await reader.read();if(next.done)break;bytes+=next.value.byteLength;if(bytes>262144)throw new Error('API response exceeds 256 KB.');chunks.push(next.value)}}catch(error){await reader.cancel().catch(()=>{});throw error}finally{reader.releaseLock()}}
   if(closed||controller.signal.aborted)throw new Error('API request timed out or was stopped.');
   const body=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length}
   let binary='';for(const b of body)binary+=String.fromCharCode(b);
   const headers:Record<string,string>={};response.headers.forEach((v,k)=>{if(!/^(set-cookie|set-cookie2)$/i.test(k))headers[k]=v});
   onRecord({id:request.id,url:request.url,method:request.method,status:response.status,duration:Math.round(performance.now()-started),preview:new TextDecoder().decode(body).slice(0,4000)});
   return {ok:true,status:response.status,headers,url:request.url,body:btoa(binary)};
  }catch(error){
   const message=controller?.signal.aborted?'API request timed out or was stopped.':error instanceof Error?error.message:'API request failed (check CORS and connectivity).';
   if(!closed)onRecord({id:request?.id||0,url:request?.url||String((value as PythonHttpRequest)?.url||'').slice(0,2048),method:request?.method||String((value as PythonHttpRequest)?.method||''),duration:Math.round(performance.now()-started),error:message});
   return {ok:false,error:message,kind:controller?.signal.aborted?'timeout':request?'network':'blocked'};
  }finally{if(timer)clearTimeout(timer);if(controller)controllers.delete(controller)}
 }};
}
