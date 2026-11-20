'use client';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SiteFooter} from '@/components/layout/SiteFooter';
import {AccountDataTools} from '@/components/AccountDataTools';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowLeft,CheckCircle2,AlertCircle,Mail,Eye,EyeOff,ShieldCheck,Code2,FolderOpen} from 'lucide-react';
import {SukoaaLogo} from '@/components/SukoaaLogo';
import {AccountNav,useAccount} from '@/components/AccountSession';
import {api} from '@/lib/platform/client';
import {accountDestination,validateAccount,type AccountFields,type AccountUser} from '@/lib/platform/account-feedback';
import './account.css';
type Setup={ready:boolean;missing:string[]};
type Result={user?:AccountUser|null;message?:string;confirmationRequired?:boolean;authenticated?:boolean};
type Notice={kind:'success'|'error'|'info';text:string};
export default function Account(){
 const {user,loading,setUser}=useAccount();
 const [mode,setMode]=useState<'login'|'signup'>('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState(''),[showPassword,setShowPassword]=useState(false),[errors,setErrors]=useState<AccountFields>({}),[notice,setNotice]=useState<Notice|null>(null),[busy,setBusy]=useState(false),[setup,setSetup]=useState<Setup|null>(null),[cooldown,setCooldown]=useState(0),[awaitingEmail,setAwaitingEmail]=useState(false);
 const feedback=useRef<HTMLDivElement>(null),callbackStarted=useRef(false);
 function show(kind:Notice['kind'],text:string){setNotice({kind,text});requestAnimationFrame(()=>feedback.current?.focus())}
 function finish(result:Result,confirmation=false){
  if(accountDestination(result)!=='home')throw new Error('A signed-in session could not be established. Please sign in again.');
  setUser(result.user!);try{sessionStorage.setItem('sukoaa-account-notice',confirmation?'Your email is confirmed. Welcome to Sukoaa!':'You are signed in. Welcome back to Sukoaa!')}catch{}
  location.replace('/');
 }
 useEffect(()=>{
  api<{accounts:Setup}>('/api/status').then(s=>setSetup(s.accounts)).catch(()=>{setSetup({ready:false,missing:[]});show('error','We could not reach the account service. Reload the page and try again.')});
  if(callbackStarted.current)return;callbackStarted.current=true;
  const query=new URLSearchParams(location.search),fragment=new URLSearchParams(location.hash.slice(1));
  const token=query.get('token_hash'),refresh=fragment.get('refresh_token'),error=fragment.get('error_description')||query.get('error_description');
  if(token||refresh||fragment.has('access_token')||error)history.replaceState({},'',location.pathname);
  if(error){show('error','This confirmation link has expired or could not be completed. Enter your email below to request a new link.');return}
  if(token||refresh){setBusy(true);show('info','Confirming your email…');api<Result>('/api/auth/'+(token?'confirm':'complete'),'POST',token?{token_hash:token}:{refresh_token:refresh}).then(result=>finish(result,true)).catch(e=>show('error',e.message)).finally(()=>setBusy(false))}
 },[]);
 useEffect(()=>{if(cooldown<=0)return;const timer=setTimeout(()=>setCooldown(value=>Math.max(0,value-1)),1000);return()=>clearTimeout(timer)},[cooldown]);
 function changeMode(value:'login'|'signup'){setMode(value);setErrors({});setNotice(null);setPassword('');setConfirmPassword('');setAwaitingEmail(false)}
 async function submit(event:React.FormEvent){
  event.preventDefault();if(busy)return;setNotice(null);const fields=validateAccount(mode,email,password,confirmPassword);setErrors(fields);
  if(Object.keys(fields).length){show('error','Please correct the highlighted fields.');return}
  setBusy(true);try{const result=await api<Result>('/api/auth/'+mode,'POST',{email:email.trim(),password});
   if(accountDestination(result)==='home'){show('success','Signed in successfully. Opening your homepage…');finish(result);return}
   if(mode==='login')throw new Error('Sign-in did not complete. Confirm your email, then try again.');
   setPassword('');setConfirmPassword('');setAwaitingEmail(true);setCooldown(60);show('success',result.message||'Check your email to finish creating your account. You are not signed in yet.');
  }catch(e){show('error',(e as Error).message)}finally{setBusy(false)}
 }
 async function resend(){if(busy||cooldown>0)return;const fields=validateAccount('login',email,'valid-password');if(fields.email){setErrors({email:fields.email});show('error','Enter your email address before requesting a confirmation link.');return}setBusy(true);try{const result=await api<{message:string}>('/api/auth/resend','POST',{email:email.trim()});show('info',result.message);setCooldown(60)}catch(e){show('error',(e as Error).message)}finally{setBusy(false)}}
 const checking=loading||!setup;const unavailable=setup?.ready===false&&!user;
 return <div className="account-page"><SiteHeader/>
 <main id="main-content" tabIndex={-1} className="account-layout"><aside className="account-story"><h1>Your Sukoaa account</h1><p>Sign in to save supported projects to your account and reopen them later.</p><div className="account-benefits"><div><FolderOpen/><span><strong>Cloud projects</strong>Choose Save cloud in a supported workspace to send that project to your account.</span></div><div><Code2/><span><strong>Local drafts</strong>Browser-local tools work without an account. Export files to keep a separate backup.</span></div></div><p>See each tool’s requirements before running code. Account storage and external runtimes have separate data flows.</p></aside>
 <section className="account-card" aria-busy={busy||checking}><h2>{user?'Signed in':awaitingEmail?'Confirm your email':mode==='signup'?'Create an account':'Sign in to your account'}</h2><p className="account-subtitle">{user?'Open a workspace or manage your saved account data.':awaitingEmail?'Confirm your email address to finish signing up.':mode==='signup'?'Use your email and password to create an account.':'Sign in to save and return to your projects.'}</p>
 <div ref={feedback} tabIndex={-1} className={notice?'account-feedback '+notice.kind:'account-feedback-empty'} role={notice?.kind==='error'?'alert':'status'} aria-live={notice?.kind==='error'?'assertive':'polite'}>{notice&&<>{notice.kind==='error'?<AlertCircle size={20}/>:notice.kind==='success'?<CheckCircle2 size={20}/>:<Mail size={20}/>}<span>{notice.text}</span></>}</div>
 {user?<div className="account-signed"><div className="account-identity"><CheckCircle2/><div><strong>Signed in as</strong><span>{user.email||'Sukoaa member'}</span></div></div><a className="btn primary" href="/">Go to homepage <ArrowRight size={17}/></a><a className="btn" href="/workspace">Open workspace <Code2 size={17}/></a><AccountNav/><AccountDataTools/></div>:<>
 {checking?<p className="account-service" role="status">Checking account availability…</p>:unavailable?<div className="account-service" role="alert"><strong>Sign-in is temporarily unavailable.</strong><p>The website’s account connection is not ready. Please try again later. Your local playgrounds are still available.</p></div>:null}
 {!awaitingEmail&&<><div className="account-mode" aria-label="Account options"><button type="button" aria-pressed={mode==='login'} disabled={busy} onClick={()=>changeMode('login')}>Sign in</button><button type="button" aria-pressed={mode==='signup'} disabled={busy} onClick={()=>changeMode('signup')}>Create account</button></div><form noValidate onSubmit={submit} className="account-form"><label htmlFor="account-email">Email address</label><input id="account-email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} disabled={busy} onChange={e=>{setEmail(e.target.value);setErrors(current=>({...current,email:undefined}))}} maxLength={254} aria-invalid={!!errors.email} aria-describedby={errors.email?'email-error':undefined}/>{errors.email&&<span className="field-error" id="email-error">{errors.email}</span>}
 <label htmlFor="account-password">Password</label><div className="account-password"><input id="account-password" type={showPassword?'text':'password'} minLength={8} maxLength={128} required disabled={busy} autoComplete={mode==='login'?'current-password':'new-password'} placeholder={mode==='signup'?'At least 8 characters':'Your password'} value={password} onChange={e=>setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password?'password-error':mode==='signup'?'password-help':undefined}/><button type="button" aria-label={showPassword?'Hide password':'Show password'} aria-pressed={showPassword} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>{errors.password?<span className="field-error" id="password-error">{errors.password}</span>:mode==='signup'?<small id="password-help">Use 8–128 characters. Choose a password you don’t use elsewhere.</small>:null}
 {mode==='signup'&&<><label htmlFor="account-confirm">Confirm password</label><input id="account-confirm" type={showPassword?'text':'password'} autoComplete="new-password" required disabled={busy} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword?'confirm-error':undefined}/>{errors.confirmPassword&&<span className="field-error" id="confirm-error">{errors.confirmPassword}</span>}</>}
 <button className="btn primary account-submit" disabled={busy||checking||unavailable}>{busy?'Please wait…':mode==='login'?'Sign in':'Create account'}<ArrowRight size={17}/></button></form></>}
 {awaitingEmail&&<div className="account-confirmation"><div className="account-mail-icon"><Mail size={28}/></div><strong>{email}</strong><p>If this address is eligible for signup, a confirmation email has been requested. Check your inbox and spam folder. You are not signed in yet.</p><button className="btn" disabled={busy} onClick={()=>changeMode('login')}>Back to sign in <ArrowRight size={16}/></button><button className="text-btn" disabled={busy} onClick={()=>changeMode('signup')}>Use a different email</button></div>}
 <details className="account-email-help" open={awaitingEmail||undefined}><summary>Waiting for a confirmation email?</summary>{awaitingEmail?<p>After confirming your email, you’ll return here and continue to the homepage.</p>:<label htmlFor="resend-email">Email address<input id="resend-email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254} disabled={busy}/></label>}<button type="button" className="text-btn" onClick={resend} disabled={busy||cooldown>0||checking||unavailable}>{cooldown>0?`Resend available in ${cooldown}s`:'Resend confirmation email'}</button></details>
 <a className="account-guest" href="/workspace">Explore playgrounds without an account <ArrowRight size={15}/></a><p className="account-privacy">By using Sukoaa, you agree to our <a href="/privacy">privacy practices</a>. Email and password sign-in is available; social login and self-service password reset are not yet supported.</p>
 </>}
 </section></main><SiteFooter/></div>;
}
