'use client';
import {useEffect,useMemo,useState} from 'react';
import './utility-tools.css';
import {TokenCounter} from './TokenCounter';
export type UtilityKind='jwt'|'base64'|'hash'|'uuid'|'color'|'tokens';
const MAX=200_000;
function useCopy(){const [done,setDone]=useState('');return {done,copy:async(text:string,id='x')=>{try{await navigator.clipboard.writeText(text);setDone(id);setTimeout(()=>setDone(''),1400)}catch{}}}}
const toHex=(b:ArrayBuffer|Uint8Array)=>[...new Uint8Array(b as ArrayBuffer)].map(x=>x.toString(16).padStart(2,'0')).join('');
function utf8ToB64(s:string){const bytes=new TextEncoder().encode(s);let bin='';for(let i=0;i<bytes.length;i+=8192)bin+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(bin)}
function b64ToUtf8(s:string){const bin=atob(s);return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(bin,c=>c.charCodeAt(0)))}
const b64url=(s:string)=>s.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const fromB64url=(s:string)=>{let t=s.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';return t};

function Jwt(){
 const sample=useMemo(()=>{const h=b64url(btoa(JSON.stringify({alg:'HS256',typ:'JWT'}))),p=b64url(btoa(JSON.stringify({sub:'1234567890',name:'Asha Learner',role:'student',iat:1700000000,exp:4102444800})));return h+'.'+p+'.sample-signature-not-verified'},[]);
 const [token,setToken]=useState(sample),{done,copy}=useCopy();
 const r=useMemo(()=>{const t=token.trim();if(!t)return null;const parts=t.split('.');if(parts.length<2)return {error:'A JWT has three parts separated by dots.'};
  try{const header=JSON.parse(b64ToUtf8(fromB64url(parts[0]))),payload=JSON.parse(b64ToUtf8(fromB64url(parts[1])));return {header,payload,signature:parts[2]||''}}catch{return {error:'Could not decode. Check that this is a JWT (header.payload.signature).'}}},[token]);
 const when=(v:unknown)=>typeof v==='number'?new Date(v*1000).toUTCString():null;
 const p=r&&'payload' in r?r.payload as Record<string,unknown>:null,now=Date.now()/1000;
 return <div className="ut"><section className="ut-card"><h2>Paste a token</h2><textarea aria-label="JWT" rows={5} value={token} onChange={e=>setToken(e.target.value.slice(0,20000))} spellCheck={false}/><div className="ut-row"><button onClick={()=>setToken(sample)}>Load sample</button><button onClick={()=>setToken('')}>Clear</button><span className="ut-note">Decoded in your browser. The token is never uploaded.</span></div></section>
 {r&&('error' in r?<p className="ut-warn" role="alert">{r.error}</p>:<div className="ut-grid2"><section className="ut-card"><h2>Header</h2><pre className="ut-pre">{JSON.stringify(r.header,null,2)}</pre></section><section className="ut-card"><h2>Payload <button onClick={()=>copy(JSON.stringify(r.payload,null,2),'p')}>{done==='p'?'Copied':'Copy'}</button></h2><pre className="ut-pre">{JSON.stringify(r.payload,null,2)}</pre>{p&&<ul className="ut-facts">{(['iat','nbf','exp'] as const).map(k=>when(p[k])&&<li key={k}><b>{k}</b> {when(p[k])}</li>)}{typeof p.exp==='number'&&<li><b>status</b> {p.exp<now?'Expired':'Not expired yet'}</li>}</ul>}</section></div>)}
 <p className="ut-note">This tool decodes only. It does <strong>not verify the signature</strong>, so never trust a token because it decodes. Verification needs the secret or public key on your server.</p></div>;
}

function Base64(){
 const [mode,setMode]=useState<'b64'|'b64url'|'url'>('b64'),[dir,setDir]=useState<'enc'|'dec'>('enc'),[input,setInput]=useState('Hello, Sukoaa! héllo ✓'),{done,copy}=useCopy();
 const out=useMemo<{text:string}|{error:string}>(()=>{try{const s=input.slice(0,MAX);
  if(mode==='url')return {text:dir==='enc'?encodeURIComponent(s):decodeURIComponent(s)};
  if(dir==='enc'){const e=utf8ToB64(s);return {text:mode==='b64url'?b64url(e):e}}
  return {text:b64ToUtf8(mode==='b64url'?fromB64url(s.trim()):s.trim())}}catch{return {error:dir==='dec'?'This is not valid '+(mode==='url'?'URL-encoded text.':'Base64 for UTF-8 text.'):'Could not encode this text.'}}},[mode,dir,input]);
 return <div className="ut"><section className="ut-card"><div className="ut-row"><div className="ut-seg" role="group" aria-label="Format">{([['b64','Base64'],['b64url','Base64URL'],['url','URL']] as const).map(([v,l])=><button key={v} aria-pressed={mode===v} onClick={()=>setMode(v)}>{l}</button>)}</div><div className="ut-seg" role="group" aria-label="Direction">{([['enc','Encode'],['dec','Decode']] as const).map(([v,l])=><button key={v} aria-pressed={dir===v} onClick={()=>setDir(v)}>{l}</button>)}</div>{'text' in out&&<button onClick={()=>{setInput(out.text);setDir(dir==='enc'?'dec':'enc')}}>Use result as input</button>}</div>
 <label className="ut-label">Input<textarea rows={6} value={input} onChange={e=>setInput(e.target.value)} spellCheck={false}/></label>
 <label className="ut-label">Output {'text' in out&&<button onClick={()=>copy(out.text,'o')}>{done==='o'?'Copied':'Copy'}</button>}{'error' in out?<p className="ut-warn" role="alert">{out.error}</p>:<textarea rows={6} readOnly value={out.text}/>}</label></section>
 <p className="ut-note">Handles Unicode correctly (UTF-8). Everything runs locally. Base64 is an encoding, not encryption.</p></div>;
}

function Hash(){
 const [text,setText]=useState('hello world'),[key,setKey]=useState(''),[rows,setRows]=useState<[string,string][]>([]),[file,setFile]=useState(''),{done,copy}=useCopy();
 const algos=['SHA-1','SHA-256','SHA-384','SHA-512'] as const;
 useEffect(()=>{let live=true;(async()=>{const data=new TextEncoder().encode(text.slice(0,MAX)),out:[string,string][]=[];
  for(const a of algos){out.push([a,toHex(await crypto.subtle.digest(a,data))]);
   if(key){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),{name:'HMAC',hash:a},false,['sign']);out.push(['HMAC-'+a,toHex(await crypto.subtle.sign('HMAC',k,data))])}}
  if(live)setRows(out)})();return()=>{live=false}},[text,key]);
 async function onFile(f?:File){if(!f)return;if(f.size>100*1024*1024){setFile('File is larger than 100 MB.');return}setFile('Hashing…');const buf=await f.arrayBuffer();const o=[];for(const a of algos)o.push(a+': '+toHex(await crypto.subtle.digest(a,buf)));setFile(f.name+'\n'+o.join('\n'))}
 return <div className="ut"><section className="ut-card"><label className="ut-label">Text<textarea rows={4} value={text} onChange={e=>setText(e.target.value)} spellCheck={false}/></label><label className="ut-label">HMAC secret (optional)<input value={key} onChange={e=>setKey(e.target.value)} placeholder="Leave empty for plain hashes"/></label>
 <table className="ut-table"><tbody>{rows.map(([n,h])=><tr key={n}><th>{n}</th><td><code>{h}</code></td><td><button onClick={()=>copy(h,n)}>{done===n?'Copied':'Copy'}</button></td></tr>)}</tbody></table></section>
 <section className="ut-card"><h2>Hash a file</h2><input type="file" onChange={e=>void onFile(e.target.files?.[0])}/>{file&&<pre className="ut-pre">{file}</pre>}</section>
 <p className="ut-note">Uses your browser’s Web Crypto. MD5 is not available there and is not safe for security anyway. Do not use plain SHA hashes to store passwords.</p></div>;
}

function uuid7(){const b=new Uint8Array(16);crypto.getRandomValues(b);let t=Date.now();for(let i=5;i>=0;i--){b[i]=t%256;t=Math.floor(t/256)}b[6]=(b[6]&0x0f)|0x70;b[8]=(b[8]&0x3f)|0x80;const h=toHex(b);return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)}
function Uuid(){
 const [ver,setVer]=useState<'v4'|'v7'>('v4'),[n,setN]=useState(5),[upper,setUpper]=useState(false),[dashes,setDashes]=useState(true),[list,setList]=useState<string[]>([]),{done,copy}=useCopy();
 const make=()=>setList(Array.from({length:n},()=>{let u=ver==='v4'?crypto.randomUUID():uuid7();if(!dashes)u=u.replace(/-/g,'');return upper?u.toUpperCase():u}));
 useEffect(make,[ver,n,upper,dashes]);
 return <div className="ut"><section className="ut-card"><div className="ut-row"><div className="ut-seg" role="group" aria-label="Version">{(['v4','v7'] as const).map(v=><button key={v} aria-pressed={ver===v} onClick={()=>setVer(v)}>UUID {v}</button>)}</div><label>How many <input type="number" min={1} max={100} value={n} onChange={e=>setN(Math.max(1,Math.min(100,+e.target.value||1)))}/></label><label><input type="checkbox" checked={upper} onChange={e=>setUpper(e.target.checked)}/> Uppercase</label><label><input type="checkbox" checked={dashes} onChange={e=>setDashes(e.target.checked)}/> Hyphens</label><button className="ut-primary" onClick={make}>Generate again</button><button onClick={()=>copy(list.join('\n'),'all')}>{done==='all'?'Copied':'Copy all'}</button></div>
 <ul className="ut-list">{list.map((u,i)=><li key={u+i}><code>{u}</code><button onClick={()=>copy(u,u)}>{done===u?'Copied':'Copy'}</button></li>)}</ul></section>
 <p className="ut-note">v4 is random. v7 starts with a millisecond timestamp, so values sort roughly by creation time, which is friendlier to database indexes. Generated with your browser’s secure random source.</p></div>;
}

type RGB=[number,number,number];
function parseColor(v:string):RGB|null{const s=v.trim().toLowerCase();let m=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s);
 if(m){let h=m[1];if(h.length===3)h=h.split('').map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)) as RGB}
 m=/^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/.exec(s);if(m){const a=[+m[1],+m[2],+m[3]];return a.every(x=>x<=255)?a as RGB:null}
 m=/^hsla?\(\s*(-?\d+(?:\.\d+)?)(?:deg)?[\s,]+(\d+(?:\.\d+)?)%[\s,]+(\d+(?:\.\d+)?)%/.exec(s);if(m){const h=((+m[1]%360)+360)%360/360,sat=Math.min(100,+m[2])/100,l=Math.min(100,+m[3])/100;const q=l<.5?l*(1+sat):l+sat-l*sat,p=2*l-q;const f=(t:number)=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return sat===0?[l,l,l].map(x=>Math.round(x*255)) as RGB:[f(h+1/3),f(h),f(h-1/3)].map(x=>Math.round(x*255)) as RGB}
 return null}
function toHsl([r,g,b]:RGB){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360}return [Math.round(h),Math.round(s*100),Math.round(l*100)]}
const lum=([r,g,b]:RGB)=>{const f=(c:number)=>{c/=255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
const ratio=(a:RGB,b:RGB)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
function Color(){
 const [v,setV]=useState('#5c8a4e'),rgb=parseColor(v),{done,copy}=useCopy();
 const hex=rgb?'#'+rgb.map(x=>x.toString(16).padStart(2,'0')).join(''):'',hsl=rgb?toHsl(rgb):null;
 const rows:[string,string][]=rgb&&hsl?[['HEX',hex],['RGB','rgb('+rgb.join(', ')+')'],['HSL','hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)']]:[];
 const cw=rgb?ratio(rgb,[255,255,255]):0,cb=rgb?ratio(rgb,[0,0,0]):0;
 const grade=(x:number)=>x>=7?'AAA':x>=4.5?'AA':x>=3?'AA large text only':'Fails';
 return <div className="ut"><section className="ut-card"><div className="ut-row"><label>Colour <input value={v} onChange={e=>setV(e.target.value)} placeholder="#5c8a4e, rgb(92,138,78) or hsl(104,28%,43%)"/></label><input type="color" aria-label="Pick a colour" value={hex||'#000000'} onChange={e=>setV(e.target.value)}/></div>
 {!rgb?<p className="ut-warn" role="alert">Enter a HEX, rgb() or hsl() colour.</p>:<><div className="ut-swatch" style={{background:hex}}><span style={{color:'#fff'}}>White text {cw.toFixed(2)}:1 · {grade(cw)}</span><span style={{color:'#000'}}>Black text {cb.toFixed(2)}:1 · {grade(cb)}</span></div>
 <table className="ut-table"><tbody>{rows.map(([n,t])=><tr key={n}><th>{n}</th><td><code>{t}</code></td><td><button onClick={()=>copy(t,n)}>{done===n?'Copied':'Copy'}</button></td></tr>)}</tbody></table></>}</section>
 <p className="ut-note">Contrast uses the WCAG formula. Body text needs at least 4.5:1 to meet level AA.</p></div>;
}

export function UtilityTool({kind}:{kind:UtilityKind}){return kind==='jwt'?<Jwt/>:kind==='base64'?<Base64/>:kind==='hash'?<Hash/>:kind==='uuid'?<Uuid/>:kind==='color'?<Color/>:<TokenCounter/>}
