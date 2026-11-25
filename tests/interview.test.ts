import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import previousHashes from './fixtures/interview-v024-question-hashes.json';
import {filterQuestions, type LibraryFilters} from '../lib/interview/filter';
import {questions, questionSummaries, interviewPaths, getQuestion, mockRounds} from '../lib/interview/catalog';
import {emptyEntry, emptyProgress, pauseSession, recordAttempt, selectShortSession, timeLeft, validateProgress, type MockSession} from '../lib/interview/progress';
import {publicPaths, pageMetadata} from '../lib/marketing/site';

test('interview catalog contains 100 complete questions with 50 per track and 16/18/16 level coverage', () => {
  assert.equal(questions.length, 100); assert.equal(new Set(questions.map(q => q.id)).size, 100);
  assert.equal(new Set(interviewPaths).size, interviewPaths.length);
  for (const track of ['genai', 'frontend']) {
    assert.equal(questions.filter(q => q.track === track).length, 50);
    for (const [level, count] of [['foundation', 16], ['practitioner', 18], ['senior', 16]] as const) assert.equal(questions.filter(q => q.track === track && q.level === level).length, count);
  }
  for (const q of questions) {
    assert.ok(q.lesson.length > 100, q.id); assert.ok(q.answer.split(/\s+/).length >= 60, q.id);
    assert.ok(q.example.length > 40, q.id); assert.equal(q.rubric.length, 3, q.id);
    assert.equal(q.hints.length, 2, q.id); assert.equal(q.followUps.length, 2, q.id);
    assert.ok(q.mistakes.length); assert.ok(q.exercise.length > 45); assert.ok(q.sources.length);
    assert.ok(publicPaths.includes(q.tool), q.id + ': related tool must be a registered public page'); assert.ok(q.sources.every(s => s.url.startsWith('https://') || s.url.startsWith('/tools/')));
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
  assert.match(mockRounds.find(r => r.id === 'genai-foundations')!.note, /^Practice round covering GenAI foundations and coding\.$/);
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

test('all original question IDs, URLs and complete content remain unchanged', () => {
  const stable = (value: unknown): unknown => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([k, v]) => [k, stable(v)])) : value;
  assert.equal(Object.keys(previousHashes).length, 60);
  for (const [id, expected] of Object.entries(previousHashes)) {
    const q = questions.find(q => q.id === id);
    assert.ok(q, id);
    assert.equal(createHash('sha256').update(JSON.stringify(stable(q))).digest('hex'), expected, id);
  }
});
test('the 40 new questions cover the agreed subject split and include 12 runnable examples', () => {
  const added = questions.filter(q => q.addedIn === '0.25.0');
  assert.equal(added.length, 40);
  assert.equal(added.filter(q => q.track === 'genai' && q.topic === 'Python & APIs').length, 8);
  assert.equal(added.filter(q => q.track === 'genai' && ['RAG debugging', 'Retrieval experiments', 'Evaluation practice'].includes(q.topic)).length, 8);
  assert.equal(added.filter(q => q.track === 'genai' && ['Agent operations', 'Agent evaluation', 'Deployment & contracts'].includes(q.topic)).length, 4);
  assert.equal(added.filter(q => q.track === 'frontend' && q.topic.startsWith('React')).length, 6);
  assert.equal(added.filter(q => q.track === 'frontend' && q.topic.startsWith('Angular')).length, 6);
  assert.equal(added.filter(q => q.track === 'frontend' && !/^(React|Angular)/.test(q.topic)).length, 8);
  assert.equal(questions.filter(q => q.code?.language === 'python').length, 6);
  assert.equal(questions.filter(q => q.code?.language === 'javascript').length, 6);
});
test('backups from the 60-question release keep answers, bookmarks and an active mock under the larger catalog', () => {
  const p = emptyProgress();
  const originalIds = Object.keys(previousHashes);
  for (const id of originalIds) p.records[id] = {...emptyEntry(), draft: 'Existing answer for ' + id, bookmarked: true, notes: 'Revisit my example', checked: [0], review: 'revisit', attempts: [{at: 123, covered: 1, total: 3}]};
  p.project = {name: 'My existing project', ownership: 'I wrote the frontend.'};
  p.session = {ids: originalIds.slice(0, 3), index: 1, title: 'Existing mock', remaining: 600000, deadline: 123456789, ended: false};
  const restored = validateProgress(JSON.parse(JSON.stringify(p)), questionSummaries);
  assert.deepEqual(restored, p);
  assert.equal(Object.keys(restored.records).length, 60);
  assert.ok(questions.filter(q => q.addedIn).every(q => !restored.records[q.id]));
});
test('library filters compose topic, release, search and local progress without mixing tracks or levels', () => {
  const base: LibraryFilters = {track: 'genai', level: 'foundation', query: '', round: 'all', topic: 'all', progress: 'all', release: 'all'};
  assert.equal(filterQuestions(questionSummaries, base, {}).length, 16);
  assert.equal(filterQuestions(questionSummaries, {...base, release: '0.25.0'}, {}).length, 6);
  assert.equal(filterQuestions(questionSummaries, {...base, topic: 'Python & APIs'}, {}).length, 8);
  const target = getQuestion('genai', 'python-copying')!;
  const records = {[target.id]: {...emptyEntry(), bookmarked: true, review: 'revisit' as const, attempts: [{at: 1, covered: 1, total: 3}]}};
  const filters = {...base, topic: 'Python & APIs', release: '0.25.0' as const, query: '  copied python  ', progress: 'bookmarked' as const};
  assert.deepEqual(filterQuestions(questionSummaries, filters, records).map(q => q.id), [target.id]);
  assert.equal(filterQuestions(questionSummaries, {...filters, progress: 'unreviewed'}, records).length, 0);
  assert.equal(filterQuestions(questionSummaries, {...filters, level: 'senior'}, records).length, 0);
  assert.equal(filterQuestions(questionSummaries, {...base, track: 'frontend', topic: 'Python & APIs'}, {}).length, 0);
});
for (const q of questions.filter(q => q.code?.language === 'javascript')) {
  test(`interview JavaScript example produces its published output: ${q.slug}`, () => {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', q.code!.source], {encoding: 'utf8', timeout: 5000});
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout.trim(), q.code!.expected);
  });
}
