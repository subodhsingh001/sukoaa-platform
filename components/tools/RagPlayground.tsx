'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {bm25,buildPrompt,chunkText,cosine,parseSse,rank,SAMPLE_DOCS,type Hit} from '@/lib/rag/core';
import './utility-tools.css';
type Mode='keyword'|'embeddings';
type Gen='demo'|'own';
const safeBase=(v:string)=>{try{const u=new URL(v);return (u.protocol==='https:'||u.hostname==='localhost'||u.hostname==='127.0.0.1')&&!u.username&&!u.password?u.origin+u.pathname.replace(/\/+$/,''):null}catch{return null}};
export function RagPlayground(){
 const [docs,setDocs]=useState(SAMPLE_DOCS),[size,setSize]=useState(300),[overlap,setOverlap]=useState(40);
 const [mode,setMode]=useState<Mode>('keyword'),[vectors,setVectors]=useState<number[][]|null>(null),[indexed,setIndexed]=useState<string[]|null>(null);
 const [status,setStatus]=useState(''),[busy,setBusy]=useState(false),[progress,setProgress]=useState('');
 const [question,setQuestion]=useState('How long can a PHP script run?'),[k,setK]=useState(3),[minScore,setMinScore]=useState(0.2),[hits,setHits]=useState<Hit[]|null>(null);
 const [gen,setGen]=useState<Gen>('demo'),[base,setBase]=useState('https://api.openai.com/v1'),[model,setModel]=useState('gpt-4o-mini'),[key,setKey]=useState(''),[answer,setAnswer]=useState(''),[generating,setGenerating]=useState(false),[copied,setCopied]=useState(false);
 const worker=useRef<Worker|null>(null),pending=useRef(new Map<number,{resolve:(v:number[][])=>void;reject:(e:Error)=>void}>()),seq=useRef(0),abort=useRef<AbortController|null>(null);
 const chunks=useMemo(()=>chunkText(docs,size,overlap),[docs,size,overlap]);
 const texts=useMemo(()=>chunks.map(c=>c.text),[chunks]);
 const stale=indexed!==null&&(indexed.length!==texts.length||indexed.some((t,i)=>t!==texts[i]));
 useEffect(()=>()=>{worker.current?.terminate();abort.current?.abort()},[]);
 function ensureWorker(){
  if(worker.current)return worker.current;
  const w=new Worker('/rag-worker.mjs',{type:'module'});
  w.onmessage=e=>{const m=e.data||{};
   if(m.type==='progress'&&typeof m.progress==='number')setProgress('Downloading model… '+Math.round(m.progress)+'%');
   else if(m.type==='embedProgress')setProgress('Embedding '+m.done+' of '+m.total);
   else if(m.type==='embedded'){pending.current.get(m.id)?.resolve(m.vectors);pending.current.delete(m.id)}
   else if(m.type==='error'){const p=pending.current.get(m.id);if(p){p.reject(new Error(m.message));pending.current.delete(m.id)}}};
  w.onerror=()=>{for(const p of pending.current.values())p.reject(new Error('The embedding worker could not start in this browser.'));pending.current.clear()};
  worker.current=w;return w;
 }
 function embed(list:string[]){return new Promise<number[][]>((resolve,reject)=>{const id=++seq.current;pending.current.set(id,{resolve,reject});ensureWorker().postMessage({type:'embed',id,texts:list})})}
 async function buildIndex(){
  setHits(null);setAnswer('');
  if(mode==='keyword'){setVectors(null);setIndexed(texts);setStatus('Keyword index ready: '+texts.length+' chunks. Nothing was downloaded.');return}
  setBusy(true);setStatus('Starting the embedding model. The first run downloads about 25 MB, then it is cached by your browser.');
  try{const v=await embed(texts);setVectors(v);setIndexed(texts);setStatus('Embedding index ready: '+v.length+' chunks, '+(v[0]?.length||0)+' numbers each.')}
  catch(e){setStatus((e as Error).message+' You can still use keyword mode.')}
  finally{setBusy(false);setProgress('')}
 }
 async function search(){
  if(!indexed||stale){setStatus('Build the index first (step 2).');return}
  setAnswer('');setBusy(true);
  try{
   let scored:Hit[];
   if(mode==='keyword')scored=bm25(chunks,question);
   else{const [q]=await embed([question]);scored=chunks.map((chunk,i)=>({chunk,score:cosine(q,vectors![i])}))}
   setHits(rank(scored,k,mode==='keyword'?0:minScore));
  }catch(e){setStatus((e as Error).message)}finally{setBusy(false);setProgress('')}
 }
 const prompt=useMemo(()=>hits?buildPrompt(question,hits):null,[hits,question]);
 async function generate(){
  if(!prompt)return;
  const url=gen==='demo'?'/api/demo/chat/completions':(()=>{const b=safeBase(base);return b?b+'/chat/completions':null})();
  if(!url){setAnswer('Enter an https:// base URL (or http://localhost).');return}
  if(gen==='own'&&!key.trim()){setAnswer('Paste an API key for your provider. It stays in this page and is sent only to the URL above.');return}
  abort.current?.abort();const ac=new AbortController();abort.current=ac;setGenerating(true);setAnswer('');
  try{
   const res=await fetch(url,{method:'POST',signal:ac.signal,headers:{'Content-Type':'application/json',...(gen==='own'?{Authorization:'Bearer '+key.trim()}:{})},body:JSON.stringify({model:gen==='demo'?'demo-chat':model,stream:true,messages:[{role:'system',content:prompt.system},{role:'user',content:prompt.user}]})});
   if(!res.ok||!res.body){const t=await res.text().catch(()=>'');setAnswer('HTTP '+res.status+(t?': '+t.slice(0,300):''));return}
   const reader=res.body.getReader(),dec=new TextDecoder();let buf='',out='';
   for(;;){const {value,done}=await reader.read();if(done)break;buf+=dec.decode(value,{stream:true});const p=parseSse(buf);buf=p.rest;if(p.pieces.length){out+=p.pieces.join('');setAnswer(out)}if(p.done)break}
   if(!out)setAnswer('The provider returned no text. Check the model name and that it supports streaming.');
  }catch(e){if((e as Error).name!=='AbortError')setAnswer('Request failed: '+(e as Error).message+'. Browsers block some providers (CORS). The demo model always works.')}
  finally{setGenerating(false)}
 }
 async function copyPrompt(){if(!prompt)return;try{await navigator.clipboard.writeText('SYSTEM:\n'+prompt.system+'\n\nUSER:\n'+prompt.user);setCopied(true);setTimeout(()=>setCopied(false),1500)}catch{}}
 const max=hits&&hits.length?Math.max(...hits.map(h=>h.score),0.0001):1;
 return <div className="ut ut-rag">
  <section className="ut-card"><h2><b>1</b> Your documents</h2>
   <textarea aria-label="Documents" value={docs} maxLength={50000} onChange={e=>setDocs(e.target.value)} rows={9}/>
   <div className="ut-row"><label>Chunk size <input type="range" min={100} max={1200} step={50} value={size} onChange={e=>setSize(+e.target.value)}/><em>{size} chars</em></label><label>Overlap <input type="range" min={0} max={200} step={10} value={overlap} onChange={e=>setOverlap(+e.target.value)}/><em>{overlap} chars</em></label><span className="ut-pill">{chunks.length} chunks</span><button type="button" onClick={()=>setDocs(SAMPLE_DOCS)}>Reset sample</button></div>
   <details><summary>See the chunks</summary><ol className="ut-chunks">{chunks.map(c=><li key={c.id}><small>chunk {c.id} · {c.text.length} chars</small>{c.text}</li>)}</ol></details>
  </section>
  <section className="ut-card"><h2><b>2</b> Build an index</h2>
   <div className="ut-row" role="radiogroup" aria-label="Retrieval method">
    <label className={'ut-opt'+(mode==='keyword'?' on':'')}><input type="radio" name="mode" checked={mode==='keyword'} onChange={()=>{setMode('keyword');setIndexed(null);setHits(null)}}/> <strong>Keyword (BM25)</strong><span>Instant. Matches words, so “reset” will not match “resets”.</span></label>
    <label className={'ut-opt'+(mode==='embeddings'?' on':'')}><input type="radio" name="mode" checked={mode==='embeddings'} onChange={()=>{setMode('embeddings');setIndexed(null);setHits(null)}}/> <strong>Embeddings (meaning)</strong><span>Downloads a small model (~25 MB) once and runs it in your browser.</span></label>
   </div>
   <div className="ut-row"><button type="button" className="ut-primary" disabled={busy||chunks.length===0} onClick={buildIndex}>{busy&&!hits?'Working…':'Build index'}</button>{stale&&<span className="ut-warn">Documents changed. Rebuild the index.</span>}<span className="ut-status" role="status">{progress||status}</span></div>
  </section>
  <section className="ut-card"><h2><b>3</b> Ask and retrieve</h2>
   <div className="ut-row"><input aria-label="Question" value={question} maxLength={300} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void search()}}/><label>Top-k <input type="number" min={1} max={8} value={k} onChange={e=>setK(Math.max(1,Math.min(8,+e.target.value||1)))}/></label>{mode==='embeddings'&&<label>Min similarity <input type="number" min={0} max={0.9} step={0.05} value={minScore} onChange={e=>setMinScore(Math.max(0,Math.min(0.9,+e.target.value||0)))}/></label>}<button type="button" className="ut-primary" disabled={busy||!indexed} onClick={search}>Search</button></div>
   {hits&&(hits.length===0?<p className="ut-note">Nothing passed the score threshold. A good RAG app should say the documents do not cover this, rather than sending weak context to the model.</p>:<ol className="ut-hits">{hits.map((h,i)=><li key={h.chunk.id}><div className="ut-bar"><i style={{width:Math.max(4,h.score/max*100)+'%'}}/></div><small>#{i+1} · chunk {h.chunk.id} · score {h.score.toFixed(3)}</small><p>{h.chunk.text}</p></li>)}</ol>)}
  </section>
  <section className="ut-card"><h2><b>4</b> The prompt the model would receive</h2>
   {prompt?<><pre className="ut-pre">{'SYSTEM:\n'+prompt.system+'\n\nUSER:\n'+prompt.user}</pre><div className="ut-row"><button type="button" onClick={copyPrompt}>{copied?'Copied':'Copy prompt'}</button></div></>:<p className="ut-note">Run a search to see how retrieved chunks are placed into a prompt.</p>}
  </section>
  <section className="ut-card"><h2><b>5</b> Generate an answer (optional)</h2>
   <div className="ut-row" role="radiogroup" aria-label="Answer source">
    <label className={'ut-opt'+(gen==='demo'?' on':'')}><input type="radio" name="gen" checked={gen==='demo'} onChange={()=>setGen('demo')}/> <strong>Sukoaa demo model</strong><span>A simulated streaming reply. Free, no key. It does not read your context.</span></label>
    <label className={'ut-opt'+(gen==='own'?' on':'')}><input type="radio" name="gen" checked={gen==='own'} onChange={()=>setGen('own')}/> <strong>My own API</strong><span>Any OpenAI-compatible endpoint. Your key is not saved and goes only to that URL.</span></label>
   </div>
   {gen==='own'&&<div className="ut-row"><label>Base URL <input value={base} onChange={e=>setBase(e.target.value)}/></label><label>Model <input value={model} onChange={e=>setModel(e.target.value)}/></label><label>API key <input type="password" autoComplete="off" value={key} onChange={e=>setKey(e.target.value)} placeholder="Use a restricted key"/></label></div>}
   <div className="ut-row"><button type="button" className="ut-primary" disabled={!prompt||generating} onClick={generate}>{generating?'Streaming…':'Generate'}</button>{generating&&<button type="button" onClick={()=>abort.current?.abort()}>Stop</button>}</div>
   {answer&&<pre className="ut-pre ut-answer" aria-live="polite">{answer}</pre>}
  </section>
 </div>;
}
