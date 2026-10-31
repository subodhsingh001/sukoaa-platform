import {body,route,json,sameOrigin,HttpError,text} from '@/lib/platform/http';
import {authFetch,setSession,clearSession,session,type Session} from '@/lib/platform/auth';
import {rateLimit,anonymousKey} from '@/lib/platform/redis';
import {configured} from '@/lib/platform/config';
type Context={params:Promise<{action:string}>};
export async function GET(_req:Request,ctx:Context){return route(async()=>{const {action}=await ctx.params;if(action!=='me')throw new HttpError(404,'Not found.');const {user}=await session();return json({user})})}
export async function POST(req:Request,ctx:Context){return route(async()=>{
 sameOrigin(req);const {action}=await ctx.params;
 if(action==='logout'){try{const {token}=await session();await authFetch('logout',{method:'POST'},token)}catch{}await clearSession();return json({ok:true})}
 if(!configured())throw new HttpError(503,'Supabase is not configured. Follow the setup guide.','SETUP_REQUIRED');
 await rateLimit('auth:'+anonymousKey(req),10,60);
 if(action==='refresh'){const {user}=await session();return json({user})}
 if(!['login','signup','confirm'].includes(action))throw new HttpError(404,'Not found.');
 const input=await body(req,10000);
 if(action==='confirm'){
  const token_hash=text(input.token_hash,'Confirmation token',500,1);const response=await authFetch('verify',{method:'POST',body:JSON.stringify({token_hash,type:'email'})});
  if(!response.ok)throw new HttpError(400,'Confirmation link is invalid or expired.');const data=await response.json() as Session;if(data.access_token)await setSession(data);return json({ok:true,user:data.user});
 }
 const email=text(input.email,'Email',254,3).trim();const password=text(input.password,'Password',128,8);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new HttpError(400,'Enter a valid email.');
 const endpoint=action==='login'?'token?grant_type=password':'signup';
 const response=await authFetch(endpoint,{method:'POST',body:JSON.stringify({email,password})});
 if(!response.ok)throw new HttpError(400,action==='login'?'Unable to sign in. Check your credentials and email confirmation.':'Unable to create account. Check your details or try signing in.');
 const data=await response.json() as Session;if(data.access_token)await setSession(data);
 return json({user:data.user||null,confirmationRequired:!data.access_token,message:data.access_token?'Signed in.':'Check your email to confirm your account.'});
})}
