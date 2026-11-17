import test from 'node:test';
import assert from 'node:assert/strict';
import {chunkText,bm25,cosine,rank,parseSse,buildPrompt,SAMPLE_DOCS} from '../lib/rag/core';
import {chatRequest} from '../lib/demo-api/chat';
import {encodeShare,decodeShare} from '../lib/share-link';
import {utilityTools,utilityPaths} from '../lib/marketing/utility-tools';
import {publicPaths} from '../lib/marketing/site';
import {activities,tracks} from '../lib/play/catalog';

test('chunking respects size, never loses text and handles empty input',()=>{
 assert.deepEqual(chunkText('',200),[]);
 const chunks=chunkText(SAMPLE_DOCS,300,40);
 assert.ok(chunks.length>=3);
 assert.ok(chunks.every(c=>c.text.length<=360&&c.text.length>0));
 const joined=chunks.map(c=>c.text).join(' ');
 for(const word of ['PGlite','ten second limit','Tailwind CSS 4'])assert.ok(joined.includes(word),word);
 assert.ok(chunkText('word '.repeat(2000),200,20).every(c=>c.text.length<=260));
});
test('keyword retrieval ranks the relevant chunk first and returns nothing for unrelated text',()=>{
 const chunks=chunkText(SAMPLE_DOCS,300,40);
 const top=rank(bm25(chunks,'How long can a PHP script run?'),1)[0];
 assert.ok(top.chunk.text.includes('ten second'));
 assert.equal(rank(bm25(chunks,'weather in Paris'),3).length,0);
 assert.equal(cosine([1,0],[0.6,0.8]),0.6);
 assert.equal(cosine([0,0],[1,1]),0);
});
test('prompt builder labels sources and survives empty retrieval',()=>{
 const chunks=chunkText(SAMPLE_DOCS,300,40);
 const p=buildPrompt('Q?',rank(bm25(chunks,'PHP limit'),2));
 assert.ok(p.user.includes('[Source 1]')&&p.user.includes('<context>'));
 assert.ok(buildPrompt('Q?',[]).user.includes('no matching context'));
});
test('SSE parser handles split frames, [DONE] and junk',()=>{
 const r=parseSse('data: {"choices":[{"delta":{"content":"Hel"}}]}\n\ndata: not json\n\ndata: {"choices":[{"delta":{"content":"lo"}}]}\n\ndata: [DONE]\n\ndata: {"cho');
 assert.deepEqual(r.pieces,['Hel','lo']);assert.equal(r.done,true);assert.ok(r.rest.startsWith('data: {"cho'));
});
const post=(body:unknown,ip='10.0.0.1',type='application/json')=>chatRequest(new Request('https://x.test/api/demo/chat/completions',{method:'POST',headers:{'content-type':type,'x-forwarded-for':ip},body:typeof body==='string'?body:JSON.stringify(body)}));
test('fake chat API returns OpenAI-shaped, simulated replies and validates input',async()=>{
 const ok=await post({messages:[{role:'user',content:'What is RAG?'}]});
 assert.equal(ok.status,200);assert.equal(ok.headers.get('x-sukoaa-simulated'),'true');
 const j=await ok.json() as {choices:{message:{content:string};finish_reason:string}[];usage:{total_tokens:number}};
 assert.ok(j.choices[0].message.content.includes('What is RAG?'));assert.equal(j.choices[0].finish_reason,'stop');assert.ok(j.usage.total_tokens>0);
 assert.equal((await post({messages:[]})).status,400);
 assert.equal((await post({messages:[{role:'hacker',content:'x'}]})).status,400);
 assert.equal((await post({messages:[{role:'user',content:'x'}],max_tokens:99999})).status,400);
 assert.equal((await post('{bad')).status,400);
 assert.equal((await post({messages:[{role:'user',content:'x'}]},'10.0.0.2','text/plain')).status,415);
 assert.equal((await post({messages:[{role:'user',content:'x'.repeat(25000)}]})).status,413);
 const e=await post({model:'demo-error-429',messages:[{role:'user',content:'x'}]});assert.equal(e.status,429);assert.equal(e.headers.get('retry-after'),'3');
 assert.equal((await post({model:'demo-error-500',messages:[{role:'user',content:'x'}]})).status,500);
 const cut=await(await post({messages:[{role:'user',content:'x'}],max_tokens:5})).json() as {choices:{finish_reason:string}[]};assert.equal(cut.choices[0].finish_reason,'length');
 const js=await(await post({model:'demo-json',messages:[{role:'user',content:'x'}]})).json() as {choices:{message:{content:string}}[]};assert.doesNotThrow(()=>JSON.parse(js.choices[0].message.content));
 assert.equal((await chatRequest(new Request('https://x.test/',{method:'DELETE'}))).status,405);
});
test('fake chat API streams server-sent events that end with [DONE]',async()=>{
 const res=await post({messages:[{role:'user',content:'hi'}],stream:true},'10.0.0.3');
 assert.ok((res.headers.get('content-type')||'').startsWith('text/event-stream'));
 const text=await res.text(),parsed=parseSse(text+'\n');
 assert.equal(parsed.done,true);assert.ok(parsed.pieces.join('').includes('simulated reply'));
});
test('fake chat API rate-limits one address',async()=>{let last=200;for(let i=0;i<32;i++)last=(await post({messages:[{role:'user',content:'x'}]},'10.9.9.9')).status;assert.equal(last,429);});
test('share links round-trip and reject tampered data',async()=>{
 const data={l:'python',c:'print("héllo ✓")\n'.repeat(40),i:'x'};
 const token=await encodeShare(data);assert.deepEqual(await decodeShare(token),data);
 assert.equal(await decodeShare('z.@@@'),null);assert.equal(await decodeShare('q.abcd'),null);assert.equal(await decodeShare('z.AAAA'),null);
 let big='';for(let i=0;i<30000;i++)big+=Math.random().toString(36);
 await assert.rejects(()=>encodeShare({c:big}),/too large/);
});
test('utility tools and AI tracks are complete and discoverable',()=>{
 assert.equal(new Set(utilityTools.map(t=>t.slug)).size,utilityTools.length);
 for(const t of utilityTools){assert.ok(t.title.length>20&&t.description.length>60&&t.lead.length>80);assert.ok(t.faq.length>=2&&t.uses.length>=3);assert.ok(publicPaths.includes('/tools/'+t.slug),t.slug)}
 assert.deepEqual(utilityPaths,utilityTools.map(t=>'/tools/'+t.slug));
 for(const id of ['llm-api','rag']){assert.ok(tracks.some(t=>t.id===id));assert.ok(activities.filter(a=>a.track===id).length>=6,id);assert.ok(publicPaths.includes('/play/tracks/'+id))}
});
