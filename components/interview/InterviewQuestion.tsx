'use client';
import type {Question, QuestionSummary} from '@/lib/interview/types';
import {emptyEntry} from '@/lib/interview/progress';
import {QuestionPractice} from './QuestionPractice';
import {downloadText, useInterviewProgress} from './useProgress';
import './interview.css';
export function InterviewQuestion({question, catalog}: {question: Question; catalog: Pick<QuestionSummary, 'id'>[]}) {
  const progress = useInterviewProgress(catalog);
  return <><div className="ip-question-save-bar"><span>Local drafts · no account or AI calls</span><button className="ip-text-button" disabled={!progress.ready} onClick={() => downloadText('sukoaa-interview-backup.json', JSON.stringify(progress.data, null, 2))}>Export progress backup</button></div>{progress.error && <div className="ip-alert" role="alert">{progress.error} {progress.conflict && <button onClick={() => window.location.reload()}>Reload saved progress</button>}</div>}<QuestionPractice question={question} ready={progress.ready} entry={progress.data.records[question.id] || emptyEntry()} onChange={entry => progress.setData(p => ({...p, records: {...p.records, [question.id]: entry}}))}/></>;
}
