'use client';
import {createContext,useCallback,useContext,useEffect,useState} from 'react';
import {LogOut,UserRound} from 'lucide-react';
import {api,ApiError} from '@/lib/platform/client';
import {authenticatedUser,type AccountUser} from '@/lib/platform/account-feedback';
type SessionState={user:AccountUser|null;loading:boolean;setUser:(user:AccountUser|null)=>void;refresh:()=>Promise<void>};
const Context=createContext<SessionState>({user:null,loading:true,setUser:()=>{},refresh:async()=>{}});
export function AccountSession({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<AccountUser|null>(null),[loading,setLoading]=useState(true);
 const refresh=useCallback(async()=>{try{const result=await api<{user:unknown}>('/api/auth/me');setUser(authenticatedUser(result.user)?result.user:null)}catch(error){if(error instanceof ApiError&&(error.status===401||error.status===503))setUser(null)}finally{setLoading(false)}},[]);
 useEffect(()=>{void refresh();const focus=()=>{void refresh()};window.addEventListener('focus',focus);return()=>window.removeEventListener('focus',focus)},[refresh]);
 return <Context.Provider value={{user,loading,setUser,refresh}}>{children}</Context.Provider>;
}
export const useAccount=()=>useContext(Context);
export function AccountNav(){
 const {user,loading,setUser}=useAccount();const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function logout(){setBusy(true);setError('');try{await api('/api/auth/logout','POST',{});setUser(null);sessionStorage.setItem('sukoaa-account-notice','You have signed out.');location.assign('/')}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <div className="account-nav">{loading?<span className="account-checking account-placeholder" role="status" aria-label="Loading account status"/>:user?<><a href="/account" className="account-link" title={user.email||'Your account'}><UserRound size={15}/><span>My account</span></a><button type="button" title="Sign out" aria-label="Sign out" disabled={busy} onClick={logout}><LogOut size={15}/></button></>:<a className="account-link" href="/account"><UserRound size={15}/> Sign in</a>}{error&&<span className="account-nav-error" role="alert">{error}</span>}</div>;
}
export function AccountNotice(){
 const [message,setMessage]=useState('');useEffect(()=>{try{const value=sessionStorage.getItem('sukoaa-account-notice');if(value){setMessage(value);sessionStorage.removeItem('sukoaa-account-notice')}}catch{}},[]);
 return message?<div className="account-toast" role="status"><span>{message}</span><button aria-label="Dismiss notification" onClick={()=>setMessage('')}>×</button></div>:null;
}
