import test from 'node:test';
import assert from 'node:assert/strict';
import {assertLocalWordingRequest, generateWording, validateWordingInput} from '../lib/token-wording';
import {POST} from '../app/api/token-wording/route';

const localRequest = (origin = 'http://localhost:3000', payload: unknown = {text: 'Please be concise.', consent: true}) => new Request('http://localhost:3000/api/token-wording', {method: 'POST', headers: {origin, 'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
const answer = (text = 'Be concise.') => Response.json({candidates: [{finishReason: 'STOP', content: {parts: [{thought: true, text: 'Internal thought'}, {text}]}}]});
test('wording validates explicit consent, blank text and length', () => {
  assert.equal(validateWordingInput({text: 'Hello', consent: true}), 'Hello');
  for (const input of [{text: 'Hello'}, {text: '  ', consent: true}, {text: 'x'.repeat(8001), consent: true}, {text: [], consent: true}]) assert.throws(() => validateWordingInput(input));
});
test('wording guard fails closed in production and rejects nonlocal/cross-site origins', () => {
  const prior = {NODE_ENV: process.env.NODE_ENV, ENABLE_LOCAL_GEMINI_WORDING: process.env.ENABLE_LOCAL_GEMINI_WORDING};
  try {
    Object.assign(process.env, {NODE_ENV: 'production', ENABLE_LOCAL_GEMINI_WORDING: 'true'});
    assert.throws(() => assertLocalWordingRequest(localRequest()));
    Object.assign(process.env, {NODE_ENV: 'development'});
    assert.doesNotThrow(() => assertLocalWordingRequest(localRequest()));
    assert.throws(() => assertLocalWordingRequest(localRequest('https://evil.example')));
    assert.throws(() => assertLocalWordingRequest(new Request('https://www.sukoaa.com/api/token-wording', {headers: {origin: 'https://www.sukoaa.com'}})));
    process.env.ENABLE_LOCAL_GEMINI_WORDING = 'false';
    assert.throws(() => assertLocalWordingRequest(localRequest()));
  } finally {for (const [key, value] of Object.entries(prior)) {if (value === undefined) delete process.env[key]; else process.env[key] = value;}}
});
test('Gemini request keeps key in a header, uses fixed Google host and discards thought parts', async () => {
  const result = await generateWording('Please be concise.', {key: 'test-key', model: 'gemini-test', fetcher: async (url, init) => {
    assert.equal(String(url), 'https://generativelanguage.googleapis.com/v1beta/models/gemini-test:generateContent');
    assert.equal(new Headers(init?.headers).get('x-goog-api-key'), 'test-key');
    const data = JSON.parse(String(init?.body));
    assert.equal(data.contents[0].parts[0].text, JSON.stringify('Please be concise.'));
    assert.equal(data.tools, undefined);
    assert.equal(init?.cache, 'no-store');
    return answer();
  }});
  assert.deepEqual(result, {suggestion: 'Be concise.', model: 'gemini-test'});
});
test('wording does not call provider for missing key or unsafe model names', async () => {
  let calls = 0;
  const fetcher: typeof fetch = async () => {calls++; return answer();};
  await assert.rejects(() => generateWording('Text', {key: '', model: 'gemini-test', fetcher}));
  await assert.rejects(() => generateWording('Text', {key: 'key', model: '../../bad', fetcher}));
  assert.equal(calls, 0);
});
test('provider failures are actionable and never expose raw errors or secrets', async () => {
  for (const status of [400, 401, 403, 404, 429, 500]) {
    await assert.rejects(() => generateWording('Text', {key: 'secret-key', model: 'gemini-test', fetcher: async () => new Response('secret-provider-detail', {status})}), (error: Error) => !error.message.includes('secret') && (status !== 429 || error.message.includes('quota')));
  }
});
test('blocked, truncated, malformed and oversized responses never become suggestions', async () => {
  for (const response of [Response.json({promptFeedback: {blockReason: 'SAFETY'}}), Response.json({candidates: [{finishReason: 'MAX_TOKENS', content: {parts: [{text: 'Half an answer'}]}}]}), answer(''), answer('x'.repeat(12001)), new Response('{broken'), answer('x'.repeat(66000))]) {
    await assert.rejects(() => generateWording('Text', {key: 'key', model: 'gemini-test', fetcher: async () => response}));
  }
});
test('aborted wording request gets a safe timeout/cancel message', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(() => generateWording('Text', {key: 'key', model: 'gemini-test', signal: controller.signal, fetcher: async (_url, init) => {init?.signal?.throwIfAborted(); return answer();}}), /timed out or was cancelled/);
});
test('local endpoint enforces consent and per-process hourly budget; production never calls Google', async () => {
  const prior = {NODE_ENV: process.env.NODE_ENV, ENABLE_LOCAL_GEMINI_WORDING: process.env.ENABLE_LOCAL_GEMINI_WORDING, GEMINI_API_KEY: process.env.GEMINI_API_KEY, GEMINI_WORDING_MODEL: process.env.GEMINI_WORDING_MODEL};
  const fetcher = globalThis.fetch; let calls = 0;
  globalThis.fetch = async () => {calls++; return answer();};
  try {
    Object.assign(process.env, {NODE_ENV: 'production', ENABLE_LOCAL_GEMINI_WORDING: 'true', GEMINI_API_KEY: 'key', GEMINI_WORDING_MODEL: 'gemini-test'});
    assert.equal((await POST(localRequest())).status, 404); assert.equal(calls, 0);
    Object.assign(process.env, {NODE_ENV: 'development'});
    assert.equal((await POST(localRequest(undefined, {text: 'hello'}))).status, 400); assert.equal(calls, 0);
    assert.equal((await POST(localRequest('https://evil.example'))).status, 403);
    for (let i = 0; i < 10; i++) assert.equal((await POST(localRequest())).status, 200);
    const limited = await POST(localRequest()); assert.equal(limited.status, 429); assert.ok(limited.headers.get('Retry-After')); assert.equal(calls, 10);
  } finally {
    globalThis.fetch = fetcher;
    for (const [key, value] of Object.entries(prior)) {if (value === undefined) delete process.env[key]; else process.env[key] = value;}
  }
});
