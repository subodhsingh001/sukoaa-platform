import type {Level, QuestionSummary, TrackId} from './types';
export const INTERVIEW_KEY = 'sukoaa.interview.v1';
export const MAX_BACKUP_BYTES = 2_000_000;
export const projectFields = [
  {id: 'name', label: 'Project and real maturity', prompt: 'What is it called? Personal prototype, internal tool or production system?'},
  {id: 'problem', label: 'Problem and users', prompt: 'Who has the problem, and what does success mean?'},
  {id: 'ownership', label: 'Your own contribution', prompt: 'What did you implement yourself? What came from teammates, a library or a tutorial?'},
  {id: 'architecture', label: 'One request, end to end', prompt: 'Trace data, state, permissions and failure boundaries.'},
  {id: 'tradeoff', label: 'A decision you can defend', prompt: 'What alternatives did you consider, and what evidence informed your choice?'},
  {id: 'failure', label: 'Failure and learning', prompt: 'What went wrong? Separate diagnosis, mitigation and prevention.'},
  {id: 'evidence', label: 'Evidence and honest limits', prompt: 'What did you actually measure? Say what you have not tested; do not invent metrics.'},
  {id: 'next', label: 'Next experiment', prompt: 'What would you change first, and how would you verify that it helps?'},
] as const;
export type ProjectField = typeof projectFields[number]['id'];
export type Review = 'new' | 'revisit' | 'confident';
export type Attempt = {at: number; covered: number; total: number};
export type RecordEntry = {draft: string; notes: string; checked: number[]; review: Review; bookmarked: boolean; attempts: Attempt[]};
export type MockSession = {ids: string[]; index: number; title: string; remaining: number; deadline: number | null; ended: boolean};
export type Progress = {version: 1; records: Record<string, RecordEntry>; project: Partial<Record<ProjectField, string>>; session: MockSession | null};
export const emptyProgress = (): Progress => ({version: 1, records: {}, project: {}, session: null});
export const emptyEntry = (): RecordEntry => ({draft: '', notes: '', checked: [], review: 'new', bookmarked: false, attempts: []});
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const finiteInt = (v: unknown, min: number, max: number): v is number => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
function invalid(): never {throw new Error('This is not a valid Sukoaa interview backup. Your current progress was kept.');}
export function validateProgress(value: unknown, catalog: Pick<QuestionSummary, 'id'>[]): Progress {
  if (!object(value) || value.version !== 1 || !object(value.records) || !object(value.project)) return invalid();
  const ids = new Set(catalog.map(q => q.id));
  const next = emptyProgress();
  for (const [id, record] of Object.entries(value.records)) {
    if (!ids.has(id) || !object(record)) return invalid();
    if (typeof record.draft !== 'string' || record.draft.length > 8000 || typeof record.notes !== 'string' || record.notes.length > 1000 || !['new', 'revisit', 'confident'].includes(String(record.review)) || typeof record.bookmarked !== 'boolean') return invalid();
    if (!Array.isArray(record.checked) || record.checked.length > 4 || !record.checked.every(n => finiteInt(n, 0, 3)) || new Set(record.checked).size !== record.checked.length) return invalid();
    if (!Array.isArray(record.attempts) || record.attempts.length > 5) return invalid();
    const attempts: Attempt[] = record.attempts.map(a => {
      if (!object(a) || !finiteInt(a.at, 0, 8640000000000000) || !finiteInt(a.total, 1, 4) || !finiteInt(a.covered, 0, a.total)) return invalid();
      return {at: a.at, total: a.total, covered: a.covered};
    });
    next.records[id] = {draft: record.draft, notes: record.notes, checked: record.checked, review: record.review as Review, bookmarked: record.bookmarked, attempts};
  }
  for (const [key, text] of Object.entries(value.project)) {
    if (!projectFields.some(f => f.id === key) || typeof text !== 'string' || text.length > 3000) return invalid();
    next.project[key as ProjectField] = text;
  }
  if (value.session !== null) {
    const s = value.session;
    if (!object(s) || !Array.isArray(s.ids) || !s.ids.length || s.ids.length > 10 || !s.ids.every(id => typeof id === 'string' && ids.has(id)) || new Set(s.ids).size !== s.ids.length || !finiteInt(s.index, 0, s.ids.length - 1) || typeof s.title !== 'string' || s.title.length > 150 || !finiteInt(s.remaining, 0, 7200000) || !(s.deadline === null || finiteInt(s.deadline, 0, 8640000000000000)) || typeof s.ended !== 'boolean') return invalid();
    next.session = {ids: s.ids, index: s.index, title: s.title, remaining: s.remaining, deadline: s.deadline, ended: s.ended};
  }
  if (new TextEncoder().encode(JSON.stringify(next)).byteLength > MAX_BACKUP_BYTES) return invalid();
  return next;
}
export function recordAttempt(entry: RecordEntry, total: number, at = Date.now()): RecordEntry {
  if (!entry.draft.trim()) throw new Error('Write an answer before saving a self-review.');
  const covered = entry.checked.filter(n => n >= 0 && n < total).length;
  return {...entry, review: entry.review === 'new' ? 'revisit' : entry.review, attempts: [{at, covered, total}, ...entry.attempts].slice(0, 5)};
}
export function timeLeft(session: Pick<MockSession, 'deadline' | 'remaining'>, now = Date.now()) {
  return Math.max(0, session.deadline === null ? session.remaining : session.deadline - now);
}
export function pauseSession(session: MockSession, now = Date.now()): MockSession {return {...session, remaining: timeLeft(session, now), deadline: null};}

export function selectShortSession(catalog: Pick<QuestionSummary, 'id' | 'track' | 'level'>[], track: TrackId, level: Level, random: () => number = Math.random): string[] {
  const pool = catalog.filter(q => q.track === track && q.level === level).map(q => q.id);
  for (let i = pool.length - 1; i > 0; i--) {const j = Math.min(i, Math.max(0, Math.floor(random() * (i + 1)))); [pool[i], pool[j]] = [pool[j], pool[i]];}
  return pool.slice(0, 3);
}
