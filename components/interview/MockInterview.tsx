'use client';
import {useEffect, useState} from 'react';
import {ArrowRight, Clock3, Pause, Play} from 'lucide-react';
import {levels, tracks, type Level, type Question, type TrackId} from '@/lib/interview/types';
import {emptyEntry, pauseSession, selectShortSession, timeLeft, type MockSession} from '@/lib/interview/progress';
import {QuestionPractice} from './QuestionPractice';
import {downloadText, useInterviewProgress} from './useProgress';
import './interview.css';
type RoundDef = {id: string; track: TrackId; name: string; minutes: number; note: string; slugs: string[]};
export function MockInterview({questions, rounds}: {questions: Question[]; rounds: RoundDef[]}) {
  const progress = useInterviewProgress(questions);
  const [track, setTrack] = useState<TrackId>('genai');
  const [level, setLevel] = useState<Level>('foundation');
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('track') === 'frontend') setTrack('frontend');
    const l = params.get('level'); if (l === 'foundation' || l === 'practitioner' || l === 'senior') setLevel(l);
    setNow(Date.now());
  }, []);
  const session = progress.data.session;
  useEffect(() => {if (!session || session.ended || session.deadline === null) return; const timer = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(timer);}, [session?.deadline, session?.ended]);
  const left = session ? timeLeft(session, now || Date.now()) : 0;
  const active = session ? questions.find(q => q.id === session.ids[session.index]) : undefined;
  function setSession(next: MockSession | null) {progress.setData(p => ({...p, session: next}));}
  function start(ids: string[], title: string, minutes: number) {
    if (session && !session.ended && !window.confirm('Replace the current mock round? Written answers and self-reviews are kept; its timer and question order will be replaced.')) return;
    const startAt = Date.now(); setNow(startAt);
    setSession({ids, title, index: 0, remaining: minutes * 60000, deadline: startAt + minutes * 60000, ended: false});
    setMessage('Round started. Answers are self-guided; the timer will not submit or delete them.');
    document.getElementById('ip-mock-stage')?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  function shortRound() {
    const ids = selectShortSession(questions, track, level);
    start(ids, `${tracks.find(t => t.id === track)!.short} · 15-minute practice`, 15);
  }
  const summary = session ? session.ids.map(id => ({q: questions.find(q => q.id === id)!, entry: progress.data.records[id]})) : [];
  return <div className="ip ip-mock"><section className="ip-mock-intro"><h1>Mock interview practice</h1><p>Choose three questions for 15 minutes or a complete practice round. Write your reasoning, use hints when needed and review your own coverage. No microphone, recording or AI interviewer is used.</p><p className="ip-muted">Drafts and the active mock session can resume in this browser. A running timer continues while the tab is closed; pause it before a break. Existing answers are kept when starting another round.</p></section>
    <div className="ip-mock-picker"><label className="ip-label">Track<select value={track} onChange={e => setTrack(e.target.value as TrackId)}>{tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><label className="ip-label">Relevant experience for the short round<select value={level} onChange={e => setLevel(e.target.value as Level)}>{levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></label><button className="ip-btn ip-btn-dark" disabled={!progress.ready} onClick={shortRound}><Clock3 size={16}/> Start 15-minute practice</button></div>
    <div className="ip-round-grid">{rounds.filter(r => r.track === track).map(r => <article key={r.id}><span className="ip-mini-label">{r.minutes} MINUTES · {r.slugs.length} QUESTIONS</span><h2>{r.name}</h2><p>{r.track==='genai'?'GenAI practice round':'Frontend practice round'}</p><button className="ip-btn" disabled={!progress.ready} onClick={() => start(r.slugs.map(slug => questions.find(q => q.track === r.track && q.slug === slug)!.id), r.name, r.minutes)}>Start round <ArrowRight size={16}/></button></article>)}</div>
    {progress.error && <div className="ip-alert" role="alert">{progress.error}</div>}
    <div className="ip-mock-stage" id="ip-mock-stage">
      {!session && <div className="ip-empty"><Clock3 size={30}/><h2>Choose a practice round</h2><p>Choose a short session or one of the round cards above.</p></div>}
      {session && active && <><div className="ip-session-header"><div><span className="ip-mini-label">{session.ended ? 'ROUND REVIEW' : `QUESTION ${session.index + 1} OF ${session.ids.length}`}</span><h2>{session.title}</h2></div><div className="ip-session-clock"><Clock3 size={19}/><output aria-label="Mock round time remaining">{Math.floor(left / 60000)}:{String(Math.floor(left / 1000) % 60).padStart(2, '0')}</output>{!session.ended && left > 0 && <button className="ip-btn" onClick={() => {if (session.deadline !== null) setSession(pauseSession(session)); else {setNow(Date.now()); setSession({...session, deadline: Date.now() + session.remaining});}}}>{session.deadline === null ? <><Play size={14}/> Resume</> : <><Pause size={14}/> Pause</>}</button>}<button className="ip-btn" onClick={() => downloadText('sukoaa-interview-backup.json', JSON.stringify(progress.data, null, 2))}>Backup</button></div></div>
      {left === 0 && !session.ended && <p className="ip-alert" role="status">Time is up. Your answers remain editable. Finish the round when you are ready; nothing is submitted automatically.</p>}
      {!session.ended ? <><nav className="ip-session-nav" aria-label="Mock round questions">{session.ids.map((id, i) => <button key={id} aria-current={i === session.index ? 'step' : undefined} onClick={() => setSession({...session, index: i})}>{i + 1}{progress.data.records[id]?.attempts.length ? ' ✓' : ''}</button>)}</nav><div className="ip-mock-question-title"><span>{active.topic} · {levels.find(l => l.id === active.level)!.name}</span><h2>{active.title}</h2></div><QuestionPractice key={active.id} question={active} ready={progress.ready} mock entry={progress.data.records[active.id] || emptyEntry()} onChange={entry => progress.setData(p => ({...p, records: {...p.records, [active.id]: entry}}))} onNext={session.index < session.ids.length - 1 ? () => setSession({...session, index: session.index + 1}) : undefined}/><div className="ip-finish-round"><button className="ip-btn ip-btn-dark" onClick={() => {if (window.confirm('Finish this practice round and view your summary? Answers are kept; you can return to them.')) {setSession({...pauseSession(session), ended: true}); setMessage('Round finished. Review the gaps you identified; there is no automated pass/fail score.');}}}>Finish round & review</button><span>Saving an answer is separate from saving its self-review.</span></div></> : <div className="ip-round-summary"><h2>Round summary</h2><p>{summary.filter(s => s.entry?.draft.trim()).length}/{summary.length} answers drafted · {summary.filter(s => s.entry?.attempts.length).length}/{summary.length} questions with a saved self-review. These are your records, not a hiring prediction.</p>{summary.map(({q, entry}) => <article key={q.id}><div><h3>{q.title}</h3><p>{entry?.review === 'confident' ? 'Self-rated confident' : entry?.review === 'revisit' ? 'Needs another try' : 'Not yet self-assessed'} · {entry?.draft.trim() ? 'Answer drafted' : 'No answer yet'}</p>{entry?.notes && <p>Next improvement: {entry.notes}</p>}</div><a href={`/interview-prep/${q.track}/${q.slug}`}>Revisit</a></article>)}<div className="ip-review-actions"><button className="ip-btn" onClick={() => setSession({...session, ended: false, remaining: 0, deadline: null})}>Reopen answers without timer</button><a className="ip-btn" href="/interview-prep/project">Practise defending your project</a></div></div>}</>}
    </div><p className="ip-status" role="status">{message}</p><a className="ip-quiet-link" href="/interview-prep">Back to the question library</a>
  </div>;
}
