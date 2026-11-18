import type {Level, QuestionSummary, TrackId} from './types';
import type {RecordEntry} from './progress';

export type LibraryFilters = {
  track: TrackId; level: Level; query: string; round: string; topic: string;
  progress: 'all' | 'unreviewed' | 'bookmarked' | 'revisit';
  release: 'all' | '0.25.0';
};

export function filterQuestions(questions: QuestionSummary[], filters: LibraryFilters, records: Record<string, RecordEntry>) {
  const query = filters.query.trim().toLowerCase();
  return questions.filter(q => {
    const entry = records[q.id];
    return q.track === filters.track && q.level === filters.level
      && (filters.round === 'all' || q.round === filters.round)
      && (filters.topic === 'all' || q.topic === filters.topic)
      && (filters.release === 'all' || q.addedIn === filters.release)
      && (!query || `${q.title} ${q.topic}`.toLowerCase().includes(query))
      && (filters.progress === 'all'
        || filters.progress === 'bookmarked' && entry?.bookmarked
        || filters.progress === 'revisit' && entry?.review === 'revisit'
        || filters.progress === 'unreviewed' && !entry?.attempts.length);
  });
}
