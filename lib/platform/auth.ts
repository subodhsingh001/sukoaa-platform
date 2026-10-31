import {cookies} from 'next/headers';
import {configured,supabaseConfig} from './config';
import {HttpError} from './http';
import {rateLimit} from './redis';
export type User={id:string;email?:string};
export type Session={access_token:string;refresh_token:string;expires_in:number;user?:User};
const secure=()=>process.env.NODE_ENV==='production';
const cookieName=(kind:string)=>(secure()?'__Host-':'')+'sukoaa-'+kind;
export async function authFetch(path:string,init:RequestInit={},token?:string){
 const {url,key}=supabaseConfig();return fetch(url+'/auth/v1/'+path,{...init,headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...init.headers},cache:'no-store',signal:AbortSignal.timeout(10000)});
}
export async function setSession(session:Session){
 if(typeof session.access_token!=='string'||typeof session.refresh_token!=='string'||!Number.isFinite(session.expires_in))throw new HttpError(502,'Invalid authentication response.');
 const jar=await cookies();const options={httpOnly:true,secure:secure(),sameSite:'lax' as const,path:'/'};
 jar.set(cookieName('access'),session.access_token,{...options,maxAge:session.expires_in});
 jar.set(cookieName('refresh'),session.refresh_token,{...options,maxAge:60*60*24*14});
}
export async function clearSession(){const jar=await cookies();for(const kind of ['access','refresh'])jar.set(cookieName(kind),'',{httpOnly:true,secure:secure(),sameSite:'lax',path:'/',maxAge:0})}
export async function session(){
 if(!configured())throw new HttpError(503,'Connect Supabase to enable accounts and cloud projects.','SETUP_REQUIRED');
 const jar=await cookies();let token=jar.get(cookieName('access'))?.value;const refresh=jar.get(cookieName('refresh'))?.value;
 if(token){const response=await authFetch('user',{},token);if(response.ok)return {user:await response.json() as User,token};if(response.status!==401&&response.status!==403)throw new HttpError(503,'Authentication service unavailable.')}
 if(refresh){const response=await authFetch('token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:refresh})});if(response.ok){const data=await response.json() as Session;await setSession(data);token=data.access_token;const userResponse=await authFetch('user',{},token);if(userResponse.ok)return {user:await userResponse.json() as User,token}}}
 throw new HttpError(401,'Sign in to continue.','UNAUTHENTICATED');
}
export async function requireUser(scope:string,limit=60){const value=await session();await rateLimit(`${scope}:${value.user.id}`,limit);return value}
export async function db(path:string,token:string,init:RequestInit={}){
 const {url,key}=supabaseConfig();const response=await fetch(url+'/rest/v1/'+path,{...init,headers:{apikey:key,Authorization:`Bearer ${token}`,'Content-Type':'application/json',Prefer:'return=representation',...init.headers},cache:'no-store',signal:AbortSignal.timeout(10000)});
 if(!response.ok){if(response.status===409)throw new HttpError(409,'A conflicting record already exists.');throw new HttpError(503,'Database request failed. Check the migration and database permissions.','DATABASE_ERROR')}
 if(response.status===204||response.headers.get('content-length')==='0')return null;
 const raw=await response.text();return raw?JSON.parse(raw):null;
}
export async function requireAdmin(){
 const value=await requireUser('admin',20);
 const rows=await db(`app_roles?user_id=eq.${value.user.id}&select=role&limit=1`,value.token) as {role:string}[];
 if(rows?.[0]?.role!=='admin')throw new HttpError(403,'Administrator access required.','FORBIDDEN');return value;
}
