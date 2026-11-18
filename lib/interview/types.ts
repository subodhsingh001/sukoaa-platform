export type TrackId = 'genai' | 'frontend';
export type Level = 'foundation' | 'practitioner' | 'senior';
export type Round = 'foundations' | 'deep-dive' | 'system-design' | 'behavioural';
export type Question = {
  id: string; track: TrackId; slug: string; level: Level; round: Round; topic: string;
  title: string; minutes: number; lesson: string; example: string; answer: string;
  hints: string[]; rubric: string[]; mistakes: string[]; followUps: string[];
  exercise: string; tool: string; sources: {title: string; url: string}[];
  origin: 'Sukoaa original' | 'User-provided interview topic';
};
export type QuestionSummary = Pick<Question, 'id' | 'track' | 'slug' | 'level' | 'round' | 'topic' | 'title' | 'minutes'>;
export const levels: {id: Level; name: string; description: string}[] = [
  {id: 'foundation', name: 'Foundations', description: 'New to this subject · roughly 0–1 year of relevant practice'},
  {id: 'practitioner', name: 'Applied practice', description: 'Building independently · roughly 1–3 years of relevant practice'},
  {id: 'senior', name: 'System design & leadership', description: 'Owning trade-offs and delivery · often 3+ relevant years'},
];
export const rounds: {id: Round; name: string}[] = [{id: 'foundations', name: 'Foundations & coding'}, {id: 'deep-dive', name: 'Technical deep dive'}, {id: 'system-design', name: 'System design'}, {id: 'behavioural', name: 'Project & behavioural'}];
export const tracks = [
  {id: 'genai' as const, name: 'GenAI Engineer', short: 'GenAI', eyebrow: 'FROM FIRST CONCEPT TO A DEFENSIBLE SYSTEM', description: 'Understand tokens and embeddings, explain a RAG pipeline, evaluate answers and defend your engineering decisions.', accent: 'violet', tools: [{name: 'RAG playground', href: '/tools/rag-playground'}, {name: 'Python playground', href: '/tools/python'}, {name: 'Token counter', href: '/tools/token-counter'}]},
  {id: 'frontend' as const, name: 'Frontend Engineer', short: 'Frontend', eyebrow: 'FROM WORKING UI TO ENGINEERING JUDGEMENT', description: 'Practise JavaScript, React, Angular and TypeScript, then discuss accessibility, rendering, performance and delivery.', accent: 'green', tools: [{name: 'JavaScript playground', href: '/tools/javascript'}, {name: 'React Studio', href: '/tools/react'}, {name: 'Angular Studio', href: '/tools/angular'}]},
];
