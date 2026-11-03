import {configured,supabaseConfig} from '../platform/config';
export type Release={id:string;title:string;version:string;platform:string;download_url:string;sha256:string};
export function validRelease(value:unknown):value is Release{
 if(!value||typeof value!=='object')return false;const r=value as Release;
 if(!['id','title','version','platform','download_url','sha256'].every(key=>typeof r[key as keyof Release]==='string')||!/^[a-f0-9]{64}$/i.test(r.sha256))return false;
 try{const url=new URL(r.download_url);return url.protocol==='https:'&&!url.username&&!url.password}catch{return false}
}
export async function publishedReleases():Promise<{releases:Release[];unavailable:boolean}>{
 if(!configured())return {releases:[],unavailable:false};
 try{const {url,key}=supabaseConfig();const response=await fetch(url+'/rest/v1/releases?published=eq.true&select=id,title,version,platform,download_url,sha256&order=created_at.desc&limit=30',{headers:{apikey:key},cache:'no-store',signal:AbortSignal.timeout(8000)});if(!response.ok)throw new Error('Release lookup failed');const rows:unknown=await response.json();if(!Array.isArray(rows))throw new Error('Invalid releases');return {releases:rows.filter(validRelease),unavailable:false}}catch{return {releases:[],unavailable:true}}
}
