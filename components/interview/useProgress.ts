'use client';
import {useEffect, useRef, useState} from 'react';
import {emptyProgress, INTERVIEW_KEY, validateProgress, type Progress} from '@/lib/interview/progress';
import type {QuestionSummary} from '@/lib/interview/types';

export function useInterviewProgress(catalog: Pick<QuestionSummary, 'id'>[]) {
  const [data, setData] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(false);
  const original = useRef<string | null>(null);
  const known = useRef(catalog);
  const blocked = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(INTERVIEW_KEY);
      original.current = raw;
      if (raw) setData(validateProgress(JSON.parse(raw), known.current));
    } catch {
      blocked.current = true;
      setError('Saved progress could not be read. Existing data was kept. Use a valid backup to replace it, or reset explicitly. New work can be exported from this page.');
    }
    setReady(true);
    const changed = (event: StorageEvent) => {
      if (event.key === INTERVIEW_KEY || event.key === null) {
        blocked.current = true; setConflict(true);
        setError('Another tab changed interview progress. Autosaving is paused to protect your draft. Export your current work, then reload the saved version.');
      }
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, []);
  useEffect(() => {
    if (!ready || blocked.current) return;
    try {
      if (localStorage.getItem(INTERVIEW_KEY) !== original.current) {
        blocked.current = true; setConflict(true);
        setError('Progress changed in another tab. Autosaving paused; export this draft before reloading.'); return;
      }
      const encoded = JSON.stringify(validateProgress(data, known.current));
      localStorage.setItem(INTERVIEW_KEY, encoded);
      original.current = encoded;
      setError('');
    } catch {setError('This browser could not save progress. Keep this page open and export a backup to keep your answers.');}
  }, [data, ready]);
  function replace(next: Progress) {
    try {
      const valid = validateProgress(next, known.current);
      original.current = localStorage.getItem(INTERVIEW_KEY);
      blocked.current = false; setConflict(false); setError(''); setData(valid);
    } catch {throw new Error('Could not replace progress. The browser may be blocking storage, or the backup is invalid.');}
  }
  return {data, setData, ready, error, conflict, replace};
}
export function downloadText(filename: string, text: string, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
