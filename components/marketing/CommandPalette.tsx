'use client';
import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {workbenchTools} from '@/lib/workbench/catalog';
import {toolLinks} from '@/lib/tool-order';
import {isPubliclyReady,unavailableToolSlugs} from '@/lib/marketing/availability';
import {Search, X} from 'lucide-react';
import './command-palette.css';
type Item={label:string;hint:string;href:string;group:string};
const extra:Item[]=[
 ...workbenchTools.map(t=>({label:t.name,hint:t.description,href:'/tools/'+t.slug,group:'File and data tools'})),
 {label:'File and data tools',hint:'CSV, Excel, images, PDF and test fixtures',href:'/tools/data-workbench',group:'Tools'},
 {label:'System design tutorials',hint:'25 concepts, narrated animations and interview practice',href:'/learn/system-design',group:'Learn'},
 {label:'Interview preparation',hint:'GenAI, React, Angular, mock rounds and project defence',href:'/interview-prep',group:'Learn'},
 {label:'GenAI interview preparation',hint:'RAG, evaluation, agents and engineering judgement',href:'/interview-prep/genai',group:'Learn'},
 {label:'Frontend interview preparation',hint:'JavaScript, React, Angular, TypeScript and system design',href:'/interview-prep/frontend',group:'Learn'},
 {label:'Tool Schema Generator',hint:'Draft, edit and validate function schemas locally',href:'/tools/tool-schema-generator',group:'AI & LLM'},
 {label:'Portal Photo & PDF Fixer',hint:'Crop, resize, compress and exam checklist',href:'/tools/portal-ready',group:'Photo & Document Tools'},
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
 const [open,setOpen]=useState(false),[q,setQ]=useState(''),[i,setI]=useState(0);
 const input=useRef<HTMLInputElement>(null),dialog=useRef<HTMLDivElement>(null),opener=useRef<HTMLElement|null>(null);
 const id=useId(),listId=id+'-results';
 const items=useMemo(build,[]);
 const list=useMemo(()=>{const n=q.trim().toLowerCase();if(!n)return items;return items.filter(x=>(x.label+' '+x.hint).toLowerCase().includes(n)).sort((a,b)=>Number(b.label.toLowerCase().startsWith(n))-Number(a.label.toLowerCase().startsWith(n)));},[q,items]);
 const visible=list.slice(0,40);
 function show(){opener.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setOpen(true);}
 useEffect(()=>{const k=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(open)setOpen(false);else show();}else if(e.key==='Escape')setOpen(false);else if(e.key==='/'&&!/input|textarea|select/i.test((e.target as HTMLElement)?.tagName||'')&&!(e.target as HTMLElement)?.isContentEditable){e.preventDefault();show();}};window.addEventListener('keydown',k);return()=>window.removeEventListener('keydown',k)},[open]);
 useEffect(()=>{
  if(!open)return;
  setQ('');setI(0);
  const previous=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const frame=requestAnimationFrame(()=>input.current?.focus());
  return()=>{cancelAnimationFrame(frame);document.body.style.overflow=previous;if(opener.current?.isConnected)opener.current.focus();};
 },[open]);
 useEffect(()=>setI(0),[q]);
 useEffect(()=>{if(open)document.getElementById(listId+'-'+i)?.scrollIntoView({block:'nearest'});},[open,i,listId]);
 function go(x?:Item){if(x){setOpen(false);location.href=x.href;}}
 return <>
  <button type="button" className="cp-trigger" onClick={show} aria-label="Search tools and pages (Ctrl+K)" aria-haspopup="dialog" aria-expanded={open}><Search size={17} aria-hidden="true"/><span>Search</span><kbd>Ctrl K</kbd></button>
  {open&&<div className="cp-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div ref={dialog} className="cp-box" role="dialog" aria-modal="true" aria-labelledby={id+'-title'} onKeyDown={e=>{
   if(e.key!=='Tab')return;
   const focusable=dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input,[href],[tabindex="0"]');
   if(!focusable?.length)return;
   const first=focusable[0],last=focusable[focusable.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }}>
   <div className="cp-heading"><h2 id={id+'-title'}>Search tools and pages</h2><button className="cp-close" type="button" aria-label="Close search" onClick={()=>setOpen(false)}><X size={20} aria-hidden="true"/></button></div>
   <input ref={input} role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={listId} aria-activedescendant={visible[i]?listId+'-'+i:undefined} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search compilers, tools, exercises…" aria-label="Search" onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setI(v=>Math.min(v+1,Math.max(0,visible.length-1)));}else if(e.key==='ArrowUp'){e.preventDefault();setI(v=>Math.max(v-1,0));}else if(e.key==='Enter'){e.preventDefault();go(visible[i]);}}}/>
   <p className="cp-count" role="status">{list.length} {list.length===1?'result':'results'}{list.length>40?' · showing the first 40; type to narrow your search':''}</p>
   <ul id={listId} role="listbox" aria-label="Search results">{visible.map((x,n)=><li id={listId+'-'+n} key={x.href+x.label} role="option" aria-selected={n===i} className={n===i?'is-active':''} onMouseEnter={()=>setI(n)} onMouseDown={e=>e.preventDefault()} onClick={()=>go(x)}><b>{x.label}</b><span>{x.hint}</span><em>{x.group}</em></li>)}</ul>
   {visible.length===0&&<p className="cp-empty">No match. Try “python”, “sql” or “json”.</p>}
   <p className="cp-foot"><span>Arrow keys to move</span><span>Enter to open</span><span>Escape to close</span></p>
  </div></div>}
 </>;
}
