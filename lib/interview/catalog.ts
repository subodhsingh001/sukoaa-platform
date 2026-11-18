import raw from './questions.json';
import type {Question, QuestionSummary, TrackId} from './types';
export const questions = raw as Question[];
export const questionSummaries: QuestionSummary[] = questions.map(({id, track, slug, level, round, topic, title, minutes}) => ({id, track, slug, level, round, topic, title, minutes}));
export const questionHref = (q: Pick<Question, 'track' | 'slug'>) => `/interview-prep/${q.track}/${q.slug}`;
export const interviewPaths = ['/interview-prep', '/interview-prep/genai', '/interview-prep/frontend', ...questions.map(questionHref)];
export function isTrack(value: string): value is TrackId {return value === 'genai' || value === 'frontend';}
export function getQuestion(track: string, slug: string) {return questions.find(q => q.track === track && q.slug === slug);}
export const mockRounds = [
  {id: 'genai-foundations', track: 'genai' as const, name: 'Foundations & coding', minutes: 45, note: 'Sukoaa-designed round; not supplied in the screenshots.', slugs: ['tokens-and-context', 'embeddings', 'prompt-structure', 'python-concurrency', 'structured-output']},
  {id: 'genai-rag', track: 'genai' as const, name: 'RAG deep dive', minutes: 60, note: 'The five RAG questions from your screenshots.', slugs: ['rag-pipeline', 'validate-chunking', 'exact-product-codes', 'bi-cross-encoder', 'missing-evidence']},
  {id: 'genai-evaluation', track: 'genai' as const, name: 'LLM evaluation system design', minutes: 75, note: 'The four evaluation questions from your screenshots.', slugs: ['support-eval-pipeline', 'llm-judge-reliability', 'rag-metrics', 'two-point-gain']},
  {id: 'genai-behavioural', track: 'genai' as const, name: 'Hiring manager & HR', minutes: 40, note: 'The four project and HR questions from your screenshots.', slugs: ['production-failure', 'genai-vs-ml', 'two-year-direction', 'notice-and-expectations']},
  {id: 'frontend-foundations', track: 'frontend' as const, name: 'JavaScript & UI foundations', minutes: 45, note: 'Sukoaa practice format, inspired by public role competencies.', slugs: ['closures', 'state-snapshot', 'typescript-boundaries', 'accessible-form', 'event-loop']},
  {id: 'frontend-applied', track: 'frontend' as const, name: 'Applied frontend engineering', minutes: 60, note: 'Explain, debug and test a realistic UI workflow.', slugs: ['fetch-races', 'complex-forms', 'angular-streams', 'server-client-boundary', 'testing-behavior']},
  {id: 'frontend-design', track: 'frontend' as const, name: 'Frontend system design', minutes: 60, note: 'Requirements, boundaries, trade-offs and verification.', slugs: ['workspace-design', 'offline-conflicts', 'performance-budget', 'personalized-cache']},
  {id: 'frontend-behavioural', track: 'frontend' as const, name: 'Project ownership & leadership', minutes: 40, note: 'Use truthful personal examples and defensible decisions.', slugs: ['incident-story', 'technical-leadership', 'project-defence']},
];
export const employerGuidance = [
  {name: 'Amazon', url: 'https://www.amazon.jobs/content/en/how-we-hire/fee-interview-prep', summary: 'Frontend competence, technical reasoning and evidence from past behaviour. Practise concrete personal examples as well as implementation.', practice: 'Use the project-defence worksheet and explain why you chose a design.'},
  {name: 'Microsoft', url: 'https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html', summary: 'Public guidance covers problem-solving, design, coding and testing. It specifically asks candidates to consider boundaries, errors and security.', practice: 'State assumptions, implement clearly, then test edge cases before calling a solution done.'},
  {name: 'Google', url: 'https://www.youtube.com/watch?v=we7ba0slWrc', summary: 'The official Life at Google preparation video covers coding, testing, data structures and system design. Role-specific details still come from the recruiter.', practice: 'Explain the approach and its trade-offs, work through examples and verify the result.'},
];
