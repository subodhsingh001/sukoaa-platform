'use client';
import {useEffect,useState} from 'react';
import {practiceExercises} from '@/lib/marketing/practice';
import {lessonHref} from '@/lib/marketing/practice-lessons';
const KEY='sukoaa-practice-progress-v1';
type Progress={completed:string[];last:string|null};
const empty:Progress={completed:[],last:null};
function read():Progress{try{const p=JSON.parse(localStorage.getItem(KEY)||'null');const valid=new Set<string>(practiceExercises.map(e=>e.id));return {completed:Array.isArray(p?.completed)?[...new Set<string>(p.completed.filter((id:unknown)=>typeof id==='string'&&valid.has(id)))]:[],last:typeof p?.last==='string'&&valid.has(p.last)?p.last:null}}catch{return empty}}
export function PracticeProgress({exerciseId}:{exerciseId?:string}){
 const [progress,setProgress]=useState<Progress>(empty),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{const p=read();if(exerciseId){p.last=exerciseId;try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}setProgress(p);setReady(true)},[exerciseId]);
 function toggle(){if(!exerciseId)return;const p=read();const completed=p.completed.includes(exerciseId)?p.completed.filter(id=>id!==exerciseId):[...p.completed,exerciseId];const next={completed,last:exerciseId};try{localStorage.setItem(KEY,JSON.stringify(next));setProgress(next);setNotice(completed.includes(exerciseId)?'Marked complete on this device.':'Marked as still practising.')}catch{setNotice('Device storage is unavailable. Progress could not be saved.')}}
 if(!ready)return null;const last=practiceExercises.find(e=>e.id===progress.last);const complete=exerciseId&&progress.completed.includes(exerciseId);
 return <section className="practice-progress" aria-label="Your practice progress"><div><h2>{exerciseId?'Keep your progress':'Your next small step'}</h2><p>{progress.completed.length} of {practiceExercises.length} exercises marked complete. Saved on this device; this is a self-check, not an automated grade.</p></div>{exerciseId?<button className="product-button dark" onClick={toggle} aria-pressed={!!complete}>{complete?'✓ Completed · mark unfinished':'Mark as completed'}</button>:last?<a className="product-button dark" href={lessonHref(last)}>Continue: {last.title} →</a>:<a className="product-button dark" href={lessonHref(practiceExercises[0])}>Start your first exercise →</a>}<p className="product-fineprint" role="status">{notice||'No sign-in required. Browser storage can be cleared; progress does not sync between devices.'}</p></section>
}
