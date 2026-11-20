'use client';
import {useEffect,useState,useCallback,useRef} from 'react';
import {emptyProgress,parseProgress,type CourseProgress} from '@/lib/system-design/progress';
const KEY='sukoaa-system-design-v1';
export function useProgress(ids:readonly string[]){
 const [progress,setProgress]=useState<CourseProgress>(emptyProgress),[ready,setReady]=useState(false),[storageError,setStorageError]=useState('');
 const current=useRef<CourseProgress>(emptyProgress());
 const allowed=ids.join('|');
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const saved=parseProgress(JSON.parse(raw),allowed.split('|'));current.current=saved;setProgress(saved);}}catch{setStorageError('Saved progress could not be read. Existing stored data has not been replaced.');}setReady(true);},[allowed]);
 const update=useCallback((fn:(p:CourseProgress)=>CourseProgress)=>{const next=fn(current.current);current.current=next;setProgress(next);try{localStorage.setItem(KEY,JSON.stringify(next));setStorageError('');}catch{setStorageError('This browser could not save progress. Export a backup before leaving.');}},[]);
 return {progress,ready,storageError,update};
}
