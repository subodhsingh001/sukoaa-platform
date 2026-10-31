export class HttpError extends Error {
  constructor(public status:number, message:string, public code='REQUEST_FAILED',public retryAfter?:number){super(message)}
}
export function json(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export function fail(error:unknown){
  const known=error instanceof HttpError;
  const response=json({error:known?error.message:'The service is temporarily unavailable. Please try again.',code:known?error.code:'SERVICE_ERROR'},known?error.status:503);
  if(known&&error.retryAfter)response.headers.set('Retry-After',String(error.retryAfter));
  return response;
}
export async function route(fn:()=>Promise<Response>){try{return await fn()}catch(e){return fail(e)}}
export function sameOrigin(request:Request){
  const origin=request.headers.get('origin');
  const expected=process.env.APP_ORIGIN || (process.env.NODE_ENV!=='production'?new URL(request.url).origin:'');
  if(!expected)throw new HttpError(503,'Set APP_ORIGIN before enabling account or remote-runner actions.','SETUP_REQUIRED');
  if(!origin || origin!==expected)throw new HttpError(403,'This request must come from the Sukoaa website.','ORIGIN_REJECTED');
  if(request.headers.get('sec-fetch-site')==='cross-site')throw new HttpError(403,'Cross-site request rejected.','ORIGIN_REJECTED');
}
export async function body(request:Request,max=100_000):Promise<Record<string,unknown>>{
  if(!request.headers.get('content-type')?.startsWith('application/json'))throw new HttpError(415,'Use application/json.');
  if(Number(request.headers.get('content-length'))>max)throw new HttpError(413,'Request too large.');
  const reader=request.body?.getReader();if(!reader)throw new HttpError(400,'Missing request body.');
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new HttpError(413,'Request too large.')}chunks.push(value)}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
  try{const value=JSON.parse(new TextDecoder().decode(bytes));if(!value||Array.isArray(value)||typeof value!=='object')throw new Error();return value}catch{throw new HttpError(400,'Invalid JSON object.')}
}
export function text(value:unknown,name:string,max:number,min=0){if(typeof value!=='string'||value.length<min||value.length>max)throw new HttpError(400,`${name} must contain ${min}–${max} characters.`,'VALIDATION_ERROR');return value}
export function uuid(value:string){if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))throw new HttpError(400,'Invalid ID.');return value}
