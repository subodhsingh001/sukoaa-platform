'use client';
import {useEffect,useState} from 'react';
import {blankProgress,parseGenProgress} from '@/lib/genai/logic';
import type {GenProgress} from '@/lib/genai/types';
const KEY='sukoaa-genai-course-v1';
export function useGenProgress(ids:readonly string[]){
 const [progress,setProgress]=useState<GenProgress>(blankProgress),[ready,setReady]=useState(false),[error,setError]=useState('');
 const key=ids.join('|');
 useEffect(()=>{try{const saved=localStorage.getItem(KEY);if(saved)setProgress(parseGenProgress(JSON.parse(saved),key.split('|')));}catch{setError('Saved progress could not be read. Export your notes before leaving this page.');}setReady(true);},[key]);
 function update(next:GenProgress){setProgress(next);try{localStorage.setItem(KEY,JSON.stringify(next));setError('');}catch{setError('This browser could not save progress. Export a backup before leaving.');}}
 return {progress,ready,error,update};
}
