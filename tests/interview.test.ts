import test from 'node:test';
import assert from 'node:assert/strict';
import {questions, questionSummaries, interviewPaths, getQuestion, mockRounds} from '../lib/interview/catalog';
import {emptyEntry, emptyProgress, pauseSession, recordAttempt, selectShortSession, timeLeft, validateProgress, type MockSession} from '../lib/interview/progress';
import {publicPaths, pageMetadata} from '../lib/marketing/site';

test('interview catalog contains 60 unique complete questions, 10 per subject level', () => {
  assert.equal(questions.length, 60); assert.equal(new Set(questions.map(q => q.id)).size, 60);
  assert.equal(new Set(interviewPaths).size, interviewPaths.length);
  for (const track of ['genai', 'frontend']) for (const level of ['foundation', 'practitioner', 'senior']) assert.equal(questions.filter(q => q.track === track && q.level === level).length, 10);
  for (const q of questions) {
    assert.ok(q.lesson.length > 100, q.id); assert.ok(q.answer.split(/\s+/).length >= 60, q.id);
    assert.ok(q.example.length > 40, q.id); assert.equal(q.rubric.length, 3, q.id);
    assert.equal(q.hints.length, 2, q.id); assert.equal(q.followUps.length, 2, q.id);
    assert.ok(q.mistakes.length); assert.ok(q.exercise.length > 45); assert.ok(q.sources.length);
    assert.ok(q.tool.startsWith('/tools/')); assert.ok(q.sources.every(s => s.url.startsWith('https://') || s.url.startsWith('/tools/')));
    assert.equal(getQuestion(q.track, q.slug)?.id, q.id);
  }
});
test('all 13 distinct supplied questions are preserved in the three screenshot rounds', () => {
  const supplied = questions.filter(q => q.origin === 'User-provided interview topic');
  assert.equal(supplied.length, 13);
  const screenshotRounds = mockRounds.filter(r => ['genai-rag', 'genai-evaluation', 'genai-behavioural'].includes(r.id));
  assert.deepEqual(screenshotRounds.map(r => [r.minutes, r.slugs.length]), [[60, 5], [75, 4], [40, 4]]);
  const slugs = screenshotRounds.flatMap(r => r.slugs);
  assert.equal(new Set(slugs).size, 13);
  assert.deepEqual(new Set(slugs), new Set(supplied.map(q => q.slug)));
  assert.match(mockRounds.find(r => r.id === 'genai-foundations')!.note, /not supplied/);
});
test('every mock question resolves and short sessions honor subject experience without duplicates', () => {
  for (const r of mockRounds) for (const slug of r.slugs) assert.ok(getQuestion(r.track, slug), slug);
  for (const track of ['genai', 'frontend'] as const) for (const level of ['foundation', 'practitioner', 'senior'] as const) {
    const ids = selectShortSession(questionSummaries, track, level, () => .4);
    assert.equal(ids.length, 3); assert.equal(new Set(ids).size, 3);
    for (const id of ids) assert.ok(questions.some(q => q.id === id && q.track === track && q.level === level));
  }
});
test('interview backups round-trip drafts, review history, worksheet and paused session', () => {
  const p = emptyProgress(), q = questions[0];
  p.records[q.id] = {...emptyEntry(), draft: 'My honest explanation.', checked: [0, 2], review: 'revisit', bookmarked: true, attempts: [{at: 123, covered: 2, total: 3}]};
  p.project = {name: 'Personal prototype', ownership: 'I wrote the UI.'};
  p.session = {ids: [q.id], index: 0, title: 'Practice', remaining: 60000, deadline: null, ended: false};
  assert.deepEqual(validateProgress(JSON.parse(JSON.stringify(p)), questionSummaries), p);
});
test('invalid and hostile backups reject unknown IDs, large drafts and corrupt timers', () => {
  const base = emptyProgress(), q = questions[0];
  for (const bad of [null, [], {version: 2}, {...base, records: {other: emptyEntry()}}, {...base, records: {[q.id]: {...emptyEntry(), draft: 'x'.repeat(8001)}}}, {...base, records: {[q.id]: {...emptyEntry(), checked: [0, 0]}}}, {...base, project: {secret: 'unknown field'}}, {...base, session: {ids: [q.id], index: 2, title: 'bad', remaining: -1, deadline: null, ended: false}}, JSON.parse('{"version":1,"records":{"__proto__":{}},"project":{},"session":null}')]) assert.throws(() => validateProgress(bad, questionSummaries));
  assert.equal(Object.getPrototypeOf(validateProgress(base, questionSummaries).records), Object.prototype);
});
test('self-reviews require a written answer, keep the latest five summaries and preserve drafting', () => {
  assert.throws(() => recordAttempt(emptyEntry(), 3));
  let entry = {...emptyEntry(), draft: 'I explain my design.', checked: [0, 2]};
  for (let at = 0; at < 8; at++) entry = recordAttempt(entry, 3, at);
  assert.equal(entry.draft, 'I explain my design.'); assert.equal(entry.review, 'revisit');
  assert.deepEqual(entry.attempts.map(a => a.at), [7, 6, 5, 4, 3]); assert.equal(entry.attempts[0].covered, 2);
});
test('mock timers use wall-clock deadlines, pause exactly and never go negative', () => {
  const s: MockSession = {ids: [questions[0].id], index: 0, title: 'Mock', remaining: 900000, deadline: 1000000, ended: false};
  assert.equal(timeLeft(s, 100000), 900000); assert.equal(timeLeft(s, 999999), 1); assert.equal(timeLeft(s, 2000000), 0);
  const paused = pauseSession(s, 400000); assert.equal(paused.deadline, null); assert.equal(paused.remaining, 600000); assert.equal(timeLeft(paused, 2000000), 600000);
});
test('learning pages are discoverable and private-state mock/worksheet pages stay out of sitemap', () => {
  for (const path of interviewPaths) assert.ok(publicPaths.includes(path), path);
  assert.equal(publicPaths.includes('/interview-prep/mock'), false); assert.equal(publicPaths.includes('/interview-prep/project'), false);
  assert.equal(getQuestion('genai', 'not-a-question'), undefined);
  const previous = {SITE_URL: process.env.SITE_URL, SITE_INDEXING_ENABLED: process.env.SITE_INDEXING_ENABLED, VERCEL_ENV: process.env.VERCEL_ENV};
  try {
    process.env.SITE_URL = 'https://www.sukoaa.com'; process.env.SITE_INDEXING_ENABLED = 'true'; process.env.VERCEL_ENV = 'production';
    assert.deepEqual(pageMetadata('Question', 'Learn', interviewPaths[3]).robots, {index: true, follow: true});
  } finally {for (const [key, value] of Object.entries(previous)) {if (value === undefined) delete process.env[key]; else process.env[key] = value;}}
});
