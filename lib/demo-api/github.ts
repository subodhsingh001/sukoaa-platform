import {HttpError} from '../platform/http';
import {parseConfig,generateTables} from './builder';
import type {RepoSource,Sandbox} from './sandbox-store';
export function repoInput(input:Record<string,unknown>):RepoSource{
 const owner=String(input.owner||''),repo=String(input.repo||''),ref=String(input.ref||'main'),path=String(input.path||'sukoaa-api.yml');
 if(!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/.test(owner)||!/^[a-zA-Z0-9_.-]{1,100}$/.test(repo)||repo==='.'||repo==='..'||!ref||ref.length>100||/[\x00-\x20?#\\]/.test(ref)||!path||path.length>180||path.startsWith('/')||path.split('/').some(p=>!p||p==='.'||p==='..')||!/^[-a-zA-Z0-9_./]+\.(json|ya?ml)$/.test(path))throw new HttpError(400,'Use a public GitHub owner, repository, branch and JSON/YAML file path.');
 return {owner,repo,ref,path,sha:'',autoSync:input.autoSync===true,checkedAt:0};
}
export async function loadRepo(source:RepoSource){
 const url=`https://api.github.com/repos/${encodeURIComponent(source.owner)}/${encodeURIComponent(source.repo)}/contents/${source.path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(source.ref)}`;
 const response=await fetch(url,{headers:{Accept:'application/vnd.github+json','User-Agent':'Sukoaa-Demo-API'},redirect:'error',signal:AbortSignal.timeout(8000),cache:'no-store'});
 if(!response.ok)throw new HttpError(response.status===404?404:502,'GitHub could not load the public configuration. Check the file, branch or GitHub rate limit.');
 if(Number(response.headers.get('content-length'))>50000)throw new HttpError(413,'Configuration is too large.');
 const reader=response.body!.getReader();let bytes=0;const chunks=[];while(true){const r=await reader.read();if(r.done)break;bytes+=r.value.length;if(bytes>50000){await reader.cancel();throw new HttpError(413,'Configuration is too large.');}chunks.push(r.value);}const b=new Uint8Array(bytes);let offset=0;for(const c of chunks){b.set(c,offset);offset+=c.length;}
 const data=JSON.parse(new TextDecoder().decode(b));if(data.type!=='file'||data.encoding!=='base64'||data.size>20000||typeof data.content!=='string')throw new HttpError(400,'Use a regular JSON/YAML file under 20KB.');
 const binary=atob(data.content.replace(/\s/g,''));const text=new TextDecoder().decode(Uint8Array.from(binary,c=>c.charCodeAt(0)));const config=parseConfig(text);return {config,text,source:{...source,sha:String(data.sha),checkedAt:Date.now()}};
}
export async function refreshRepo(s:Sandbox,force=false):Promise<Sandbox>{if(!s.source||!force&&(!s.source.autoSync||Date.now()-s.source.checkedAt<300000))return s;const loaded=await loadRepo(s.source);return {...s,source:loaded.source,...(loaded.source.sha!==s.source.sha?{config:loaded.config,tables:generateTables(loaded.config)}:{})};}
