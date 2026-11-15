import {datasets,resources,type Row} from './data';
const verbs='GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':verbs,'Access-Control-Allow-Headers':'Content-Type','Access-Control-Expose-Headers':'X-Sukoaa-Simulated, Retry-After','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex','X-Sukoaa-Simulated':'true'};
const buckets=new Map<string,{n:number;until:number}>();
function response(data:unknown,status=200,cache=false,head=false){return new Response(head?null:JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json; charset=utf-8','Cache-Control':cache?'public, max-age=60, s-maxage=300':'no-store'}});}
function error(status:number,message:string,head=false){const r=response({error:message,status,simulated:true},status,false,head);if(status===429)r.headers.set('Retry-After','60');return r;}
function integer(v:string|null,fallback:number,min:number,max:number){if(v===null)return fallback;if(!/^\d+$/.test(v)||Number(v)<min||Number(v)>max)throw new Error(`Use a whole number from ${min} to ${max}.`);return Number(v);}
export async function demoRequest(req:Request,path:string[]=[]):Promise<Response>{
 const method=req.method,head=method==='HEAD';
 if(method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'Access-Control-Max-Age':'600'}});
 if(!verbs.split(', ').includes(method))return error(405,'Method not supported.',head);
 // Local per-instance abuse guard, never a claim of globally distributed quotas.
 const minute=String(Math.floor(Date.now()/60000));for(const [k,v] of buckets)if(v.until<Date.now())buckets.delete(k);
 const b=buckets.get(minute)||{n:0,until:Date.now()+60000};b.n++;buckets.set(minute,b);if(b.n>600)return error(429,'Demo capacity reached for this server instance. Retry shortly.',head);
 try{
 const u=new URL(req.url);const delay=integer(u.searchParams.get('delay'),0,0,1500);if(delay)await new Promise(r=>setTimeout(r,delay));
 if(!path.length){if(!['GET','HEAD'].includes(method))return error(405,'Use GET for API discovery.',head);return response({name:'Sukoaa Demo API',version:1,fictional:true,persistent:false,resources,documentation:'/demo-api',openapi:'/api/demo/openapi',limits:{limit:50,delay:1500,bodyBytes:20000}},200,true,head);}
 if(path[0]==='openapi'&&path.length===1&&['GET','HEAD'].includes(method))return response(openApi(u.origin),200,true,head);
 if(path[0]==='status'&&path.length===2&&['GET','HEAD'].includes(method)){const code=Number(path[1]);if(![400,401,404,429,500].includes(code))return error(400,'Available scenarios: 400, 401, 404, 429, 500.',head);return error(code,'Intentional demo error for practising error handling.',head);}
 if(path[0]==='images'&&path.length===2&&['GET','HEAD'].includes(method)){const n=integer(path[1],1,1,1000000);const small=u.searchParams.get('size')==='small';return new Response(head?null:`<svg xmlns="http://www.w3.org/2000/svg" width="${small?150:600}" height="${small?150:400}" viewBox="0 0 600 400"><rect width="600" height="400" fill="hsl(${n*47%360} 30% 80%)"/><text x="300" y="210" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#20362c">Sukoaa · ${n}</text></svg>`,{headers:{...cors,'Content-Type':'image/svg+xml','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'",'Cache-Control':'public, max-age=86400'}});}
 const [name,idText,relation]=path;const data=Object.hasOwn(datasets,name)?datasets[name]:undefined;if(!data||path.length>3)return error(404,'Unknown demo resource.',head);
 const id=idText===undefined?undefined:integer(idText,0,1,1000000);const item=id===undefined?undefined:data.find(r=>r.id===id);if(id!==undefined&&!item)return error(404,'Record not found.',head);
 if(['GET','HEAD'].includes(method)){
 let rows=data;
 if(relation){const relationships:Record<string,Record<string,string>>={users:{posts:'userId',todos:'userId',orders:'userId',carts:'userId',albums:'userId'},posts:{comments:'postId'},albums:{photos:'albumId'}};const key=relationships[name]?.[relation];if(!key||!id)return error(404,'Unknown relationship.',head);rows=datasets[relation].filter(r=>r[key]===id);}
 else if(item)return response(item,200,!delay,head);
 const allowed=['page','limit','q','sort','order','empty','delay','category','completed','inStock','userId','postId','albumId','status'];for(const key of u.searchParams.keys())if(!allowed.includes(key))return error(400,`Unknown parameter: ${key}`,head);
 for(const key of ['category','completed','inStock','userId','postId','albumId','status']){const value=u.searchParams.get(key);if(value!==null){if(!Object.hasOwn(datasets[relation||name][0],key))return error(400,`Filter ${key} is unavailable for this resource.`,head);if(['completed','inStock'].includes(key)&&!['true','false'].includes(value))return error(400,`${key} must be true or false.`,head);rows=rows.filter(r=>String(r[key])===value);}}
 const q=u.searchParams.get('q')||'';if(q.length>100)return error(400,'Keep search under 100 characters.',head);if(q)rows=rows.filter(r=>Object.values(r).some(v=>typeof v==='string'&&v.toLowerCase().includes(q.toLowerCase())));
 const sort=u.searchParams.get('sort')||'id',order=u.searchParams.get('order')||'asc';if(!['asc','desc'].includes(order)||!Object.hasOwn(datasets[relation||name][0],sort)||typeof datasets[relation||name][0][sort]==='object')return error(400,'Choose a scalar field to sort and asc or desc order.',head);
 rows=[...rows].sort((a,b)=>{const x=a[sort],y=b[sort];const result=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y));return order==='desc'?-result:result;});
 const empty=u.searchParams.get('empty');if(empty!==null&&!['true','false'].includes(empty))return error(400,'empty must be true or false.',head);if(empty==='true')rows=[];
 const page=integer(u.searchParams.get('page'),1,1,10000),limit=integer(u.searchParams.get('limit'),10,1,50);
 return response({data:rows.slice((page-1)*limit,page*limit),total:rows.length,page,limit},200,!delay,head);
 }
 if(relation)return error(405,'Nested resources are read-only.',head);
 if(method==='POST'&&id!==undefined||method!=='POST'&&id===undefined)return error(405,'POST uses a collection; PUT, PATCH and DELETE use a record URL.',head);
 if(method==='DELETE')return response({id,deleted:true,simulated:true,persisted:false});
 if(!req.headers.get('content-type')?.startsWith('application/json'))return error(415,'Use Content-Type: application/json.');
 const reader=req.body?.getReader();if(!reader)return error(400,'Send a JSON object.');let size=0;const chunks:Uint8Array[]=[];while(true){const p=await reader.read();if(p.done)break;size+=p.value.byteLength;if(size>20000){await reader.cancel();return error(413,'Keep JSON bodies under 20,000 bytes.');}chunks.push(p.value);}
 const all=new Uint8Array(size);let offset=0;for(const p of chunks){all.set(p,offset);offset+=p.byteLength;}let input:Record<string,unknown>;try{input=JSON.parse(new TextDecoder().decode(all));}catch{return error(400,'Invalid JSON.');}
 if(!input||Array.isArray(input)||typeof input!=='object'||Object.keys(input).some(k=>['__proto__','constructor','prototype','id'].includes(k)))return error(400,'Send a JSON object without id or prototype keys.');
 return response({data:{...(method==='PATCH'?item:{}),...input,id:method==='POST'?data.length+1:id},simulated:true,persisted:false,message:'This response is simulated. A later GET returns the original dataset.'},method==='POST'?201:200);
 }catch(e){return error(400,e instanceof Error?e.message:'Invalid demo request.',head);}
}
export function openApi(origin:string){return {openapi:'3.0.3',info:{title:'Sukoaa Demo API',version:'1.0.0',description:'Fictional data. Writes are simulated and never persisted. No key required.'},servers:[{url:origin+'/api/demo'}],paths:Object.fromEntries(resources.flatMap(name=>[[`/${name}`,{get:{summary:`List ${name}`,parameters:[{name:'page',in:'query',schema:{type:'integer',minimum:1,default:1}},{name:'limit',in:'query',schema:{type:'integer',minimum:1,maximum:50,default:10}},{name:'q',in:'query',schema:{type:'string'}},{name:'sort',in:'query',schema:{type:'string'}},{name:'order',in:'query',schema:{type:'string',enum:['asc','desc']}},{name:'delay',in:'query',schema:{type:'integer',maximum:1500}}],responses:{200:{description:'Object with data array, total, page and limit'}}},post:{summary:'Simulate creation',requestBody:{required:true,content:{'application/json':{schema:{type:'object'}}}},responses:{201:{description:'Simulated creation; not persisted'}}}}],[`/${name}/{id}`,{parameters:[{name:'id',in:'path',required:true,schema:{type:'integer'}}],...Object.fromEntries(['get','put','patch','delete'].map(method=>[method,{summary:method==='get'?'Get a record':'Simulated '+method,...(['put','patch'].includes(method)?{requestBody:{required:true,content:{'application/json':{schema:{type:'object'}}}}}:{}),responses:{200:{description:method==='get'?'A record':'Simulated response; not persisted'},404:{description:'Record not found'}}}]))}]]))};}
