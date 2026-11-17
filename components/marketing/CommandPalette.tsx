'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {toolLinks} from '@/lib/tool-order';
import {isPubliclyReady,unavailableToolSlugs} from '@/lib/marketing/availability';
import './command-palette.css';
type Item={label:string;hint:string;href:string;group:string};
const extra:Item[]=[
 {label:'Portal Photo & PDF Fixer',hint:'Crop, resize, compress and exam checklist',href:'/portal-ready',group:'Photo & Document Tools'},
 {label:'Online tools',hint:'All compilers and playgrounds',href:'/tools',group:'Pages'},
 {label:'Coding practice',hint:'JavaScript, Python, SQL, TypeScript, JSON',href:'/practice',group:'Practice'},
 {label:'JavaScript exercises',hint:'Practice',href:'/practice/javascript',group:'Practice'},
 {label:'Python exercises',hint:'Practice',href:'/practice/python',group:'Practice'},
 {label:'SQL exercises',hint:'Practice',href:'/practice/sql',group:'Practice'},
 {label:'Play & Learn',hint:'Puzzles, bug hunts and challenges',href:'/play',group:'Practice'},
 {label:'Daily coding challenge',hint:'A new one every day',href:'/play/daily',group:'Practice'},
 {label:'Free demo API',hint:'REST, GraphQL and sandboxes',href:'/demo-api',group:'Pages'},
 {label:'Online notepad',hint:'Autosave and Markdown',href:'/tools/notepad',group:'Tools'},
 {label:'JSON Studio',hint:'Format, validate, compare',href:'/tools/json-studio',group:'Tools'},
 {label:'JSON to TypeScript',hint:'Interfaces, types and Zod',href:'/tools/json-to-typescript',group:'Tools'},
 {label:'Regex playground',hint:'Test expressions',href:'/tools/regex',group:'Tools'},
 {label:'Text compare',hint:'Find line differences',href:'/tools/text-compare',group:'Tools'},
 {label:'RAG playground',hint:'Chunking, embeddings and retrieval',href:'/tools/rag-playground',group:'AI'},
 {label:'LLM token counter',hint:'Count GPT tokens',href:'/tools/token-counter',group:'AI'},
 {label:'JWT decoder',hint:'Inspect header, payload and expiry',href:'/tools/jwt-decoder',group:'Tools'},
 {label:'Base64 & URL encoder',hint:'Encode and decode',href:'/tools/base64-url-encoder',group:'Tools'},
 {label:'Hash generator',hint:'SHA-256, HMAC',href:'/tools/hash-generator',group:'Tools'},
 {label:'UUID generator',hint:'v4 and v7',href:'/tools/uuid-generator',group:'Tools'},
 {label:'Colour converter',hint:'HEX, RGB, HSL, contrast',href:'/tools/color-converter',group:'Tools'},
 {label:'LLM API exercises',hint:'Messages, streaming, keys',href:'/play/tracks/llm-api',group:'Practice'},
 {label:'RAG exercises',hint:'Chunks, embeddings, retrieval',href:'/play/tracks/rag',group:'Practice'},
 {label:'Downloads',hint:'Browser and extensions',href:'/downloads',group:'Pages'},
 {label:'About',hint:'What Sukoaa is building',href:'/about',group:'Pages'},
 {label:'Contact',hint:'Feedback and bug reports',href:'/contact',group:'Pages'},
];
function build():Item[]{
 const seen=new Set<string>();const out:Item[]=[];
 const hidden=(unavailableToolSlugs as readonly string[]);
 for(const t of toolLinks){if(hidden.includes(t.id)||t.id==='go')continue;if(!isPubliclyReady(t.href))continue;out.push({label:t.name,hint:t.info,href:t.href,group:t.href.startsWith('/labs/')?'Compilers':'Compilers'});}
 for(const e of extra){if(!seen.has(e.href)&&!out.some(o=>o.href===e.href))out.push(e);seen.add(e.href);}
 return out;
}
export function CommandPalette(){
 const [open,setOpen]=useState(false),[q,setQ]=useState(''),[i,setI]=useState(0),input=useRef<HTMLInputElement>(null);
 const items=useMemo(build,[]);
 const list=useMemo(()=>{const n=q.trim().toLowerCase();if(!n)return items;return items.filter(x=>(x.label+' '+x.hint).toLowerCase().includes(n)).sort((a,b)=>Number(b.label.toLowerCase().startsWith(n))-Number(a.label.toLowerCase().startsWith(n)));},[q,items]);
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setOpen(o=>!o);}else if(e.key==='Escape')setOpen(false);else if(e.key==='/'&&!/input|textarea|select/i.test((e.target as HTMLElement)?.tagName||'')&&!(e.target as HTMLElement)?.isContentEditable){e.preventDefault();setOpen(true);}};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[]);
 useEffect(()=>{if(open){setQ('');setI(0);setTimeout(()=>input.current?.focus(),0);}},[open]);
 useEffect(()=>setI(0),[q]);
 function go(x?:Item){if(x){setOpen(false);location.href=x.href;}}
 return <>
  <button className="cp-trigger" onClick={()=>setOpen(true)} aria-label="Search tools and pages (Ctrl+K)"><svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></svg><span>Search</span><kbd>Ctrl K</kbd></button>
  {open&&<div className="cp-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="cp-box" role="dialog" aria-modal="true" aria-label="Search tools and pages">
   <input ref={input} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search compilers, tools, exercises…" aria-label="Search" onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setI(v=>Math.min(v+1,list.length-1));}else if(e.key==='ArrowUp'){e.preventDefault();setI(v=>Math.max(v-1,0));}else if(e.key==='Enter')go(list[i]);}}/>
   <ul role="listbox">{list.length===0&&<li className="cp-empty">No match. Try “python”, “sql” or “json”.</li>}{list.slice(0,40).map((x,n)=><li key={x.href+x.label} role="option" aria-selected={n===i} className={n===i?'is-active':''} onMouseEnter={()=>setI(n)} onClick={()=>go(x)}><b>{x.label}</b><span>{x.hint}</span><em>{x.group}</em></li>)}</ul>
   <p className="cp-foot"><span>↑↓ move</span><span>↵ open</span><span>Esc close</span><span>/ or Ctrl K anywhere</span></p>
  </div></div>}
 </>;
}
