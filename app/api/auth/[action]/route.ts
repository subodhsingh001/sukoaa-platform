import {appOrigin} from '@/lib/platform/account-config';
import {authError} from '@/lib/platform/auth-errors';
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
 if(!['login','signup','confirm','resend','complete'].includes(action))throw new HttpError(404,'Not found.');
 const input=await body(req,10000);
 if(action==='complete'){
  const refresh_token=text(input.refresh_token,'Refresh token',2000,10);
  const response=await authFetch('token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token})});
  if(!response.ok)return authError(response,'Confirmation session is invalid or expired. Request another confirmation email.');
  const data=await response.json() as Session;
  if(!data.user?.id)throw new HttpError(502,'Invalid authentication response.');
  await setSession(data);return json({user:data.user,message:'Email confirmed. You are signed in.'});
 }
 if(action==='confirm'){
  const token_hash=text(input.token_hash,'Confirmation token',500,1);const response=await authFetch('verify',{method:'POST',body:JSON.stringify({token_hash,type:'email'})});
  if(!response.ok)throw new HttpError(400,'Confirmation link is invalid or expired.');const data=await response.json() as Session;if(data.access_token)await setSession(data);return json({ok:true,user:data.user});
 }
 const email=text(input.email,'Email',254,3).trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new HttpError(400,'Enter a valid email.');
 const redirect=new URL('/account',appOrigin()||new URL(req.url).origin).href;
 if(action==='resend'){
  await rateLimit('confirmation:'+email.toLowerCase(),1,60);
  const response=await authFetch('resend?redirect_to='+encodeURIComponent(redirect),{method:'POST',body:JSON.stringify({type:'signup',email})});
  if(!response.ok){const error=await response.clone().json().catch(()=>({})) as {code?:string};if(!['user_not_found','email_not_found','email_exists','user_already_exists'].includes(error.code||''))return authError(response,'Unable to request confirmation. Please try again later.');}
  return json({confirmationRequired:true,message:'If this address has an account awaiting confirmation, a new email has been requested. Check your inbox and spam folder.'});
 }
 const password=text(input.password,'Password',128,8);
 const endpoint=action==='login'?'token?grant_type=password':'signup?redirect_to='+encodeURIComponent(redirect);
 const response=await authFetch(endpoint,{method:'POST',body:JSON.stringify({email,password})});
 if(!response.ok)return authError(response,action==='login'?'Unable to sign in. Check your credentials and email confirmation.':'Unable to create account. Check your details or try signing in.');
 const data=await response.json() as Session;if(data.access_token)await setSession(data);
 return json({user:data.user||null,confirmationRequired:!data.access_token,message:data.access_token?'Signed in.':'If confirmation is required, check your inbox and spam folder. You can request another email below.'});
})}
