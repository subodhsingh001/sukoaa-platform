'use client';
import {useCallback,useEffect,useState} from 'react';
import {PLAY_KEY,emptyProgress,validateProgress,type Progress} from '@/lib/play/progress';
export function useProgress(){const [progress,setProgress]=useState<Progress>(emptyProgress),[ready,setReady]=useState(false),[error,setError]=useState('');
 useEffect(()=>{try{const raw=localStorage.getItem(PLAY_KEY);if(raw)setProgress(validateProgress(JSON.parse(raw)));}catch{setError('Stored progress could not be read. Download or recover it before replacing it. Saving is paused.');}setReady(true);const refresh=()=>{try{const raw=localStorage.getItem(PLAY_KEY);setProgress(raw?validateProgress(JSON.parse(raw)):emptyProgress());}catch{setError('Progress changed in another tab and could not be read. Saving is paused.');}};window.addEventListener('storage',refresh);return()=>window.removeEventListener('storage',refresh);},[]);
 const update=useCallback((fn:(p:Progress)=>Progress)=>{if(!ready||error)return false;try{const raw=localStorage.getItem(PLAY_KEY);const current=raw?validateProgress(JSON.parse(raw)):emptyProgress();const next=validateProgress(fn(current));localStorage.setItem(PLAY_KEY,JSON.stringify(next));setProgress(next);return true;}catch(e){setError('Progress could not be saved: '+(e as Error).message);return false;}},[ready,error]);
 return {progress,ready,error,update};}
