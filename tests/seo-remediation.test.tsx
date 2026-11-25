import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CourseLesson} from '../components/genai/CourseLesson';
import {genLessons} from '../lib/genai/catalog';
import {contentLastModified} from '../lib/marketing/content-updates';
import {toolActionLabel} from '../lib/marketing/tool-links';
import {questions} from '../lib/interview/catalog';
import {publicPaths} from '../lib/marketing/site';

test('page revisions preserve unchanged dates and reject malformed sitemap overrides', () => {
  const date = (path: string, override = '') => contentLastModified(path, '2026-11-18', override).toISOString().slice(0, 10);
  assert.equal(date('/tools/token-counter'), '2026-11-24');
  assert.equal(date('/learn/gen-ai/rag'), '2026-11-24');
  assert.equal(date('/tools/python'), '2026-11-18');
  assert.equal(date('/tools/python', 'invalid'), '2026-11-18');
  assert.equal(date('/tools/python', '2026-02-30'), '2026-11-18');
  assert.equal(date('/tools/token-counter', '2026-11-18'), '2026-11-24');
  assert.equal(date('/tools/python', '2026-11-24'), '2026-11-24');
  assert.equal(contentLastModified('/play/daily', '2026-11-18', '', new Date('2026-11-25T12:00:00Z')).toISOString(), '2026-11-25T00:00:00.000Z');
  assert.equal(contentLastModified('/tools/python', '2026-11-18', '', new Date('2026-11-25T12:00:00Z')).toISOString(), '2026-11-18T00:00:00.000Z');
});

test('GenAI lesson HTML contains engineering and interview content while inactive panels remain hidden', () => {
  const items = genLessons.map(({id, order, title, group, minutes, simple}) => ({id, order, title, group, minutes, simple}));
  for (const id of ['tokens', 'rag']) {
    const lesson = genLessons.find(item => item.id === id)!;
    const markup = renderToStaticMarkup(createElement(CourseLesson, {lesson, items}));
    assert.match(markup, /<section hidden=""><h2>Engineering details and trade-offs/);
    assert.match(markup, /<section hidden="" class="ga-interview">/);
    const text = markup.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    assert.ok(text.includes(lesson.engineering[0]), id);
    assert.ok(text.includes(lesson.interview.answer), id);
    assert.ok(text.includes(lesson.interview.followUpAnswer), id);
    assert.match(markup, /<div hidden="" class="ga-answer">/);
    assert.ok(!markup.includes('class="ga-lab"'), 'Interactive lab still mounts only when selected');
  }
});

test('every interview related-tool link has a registered destination and a specific action name', () => {
  for (const question of questions) {
    assert.ok(publicPaths.includes(question.tool), question.id);
    assert.notEqual(toolActionLabel(question.tool), 'Open coding tool', question.id);
  }
  const pagination = questions.find(question => question.id === 'frontend-cursor-pagination-table')!;
  assert.equal(pagination.tool, '/labs/postgresql');
  assert.equal(toolActionLabel(pagination.tool), 'Open PostgreSQL compiler');
});
