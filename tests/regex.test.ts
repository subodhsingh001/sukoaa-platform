import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {regexInput} from '../lib/play/regex-input';
const worker=readFileSync('public/play/regex-worker.js','utf8');
function execute(input:unknown){const messages:any[]=[];const context=vm.createContext({self:{},postMessage:(v:unknown)=>messages.push(JSON.parse(JSON.stringify(v))),input});vm.runInContext(worker+'\nself.onmessage({data:input});',context,{timeout:250});return messages;}
test('regex: Unicode zero-width matches advance across whole code points',()=>{const result=execute({pattern:'(?:)',flags:'gu',text:'😀a'})[0];assert.deepEqual(result.matches.map((m:any)=>m.index),[0,2,3]);assert.equal(result.truncated,false);});
test('regex: capture groups preserve optional and named results',()=>{const result=execute({pattern:'(?<word>hello)(!)?',flags:'',text:'hello hello!'})[0];assert.equal(result.matches.length,1);assert.deepEqual(result.matches[0],{text:'hello',index:0,groups:['hello',null],named:{word:'hello'}});});
test('regex: result limit only reports truncation if another match exists',()=>{for(const count of [200,201]){const result=execute({pattern:'a',flags:'g',text:'a'.repeat(count)})[0];assert.equal(result.matches.length,200);assert.equal(result.truncated,count>200);}});
test('regex: malformed expressions and invalid inputs return errors',()=>{for(const input of [{pattern:'[',flags:'',text:'x'},{pattern:'a',flags:'gg',text:'a'},{pattern:'a',flags:'uv',text:'a'},{pattern:'a',flags:'z',text:'a'},{pattern:'a'.repeat(501),flags:'',text:''},{pattern:'a',flags:'',text:'a'.repeat(20001)},{pattern:3,flags:'',text:''}])assert.equal(typeof execute(input)[0].error,'string');});
test('regex: startup acknowledgement is opt-in for legacy clients',()=>{assert.equal(execute({pattern:'a',flags:'g',text:'a'}).length,1);const messages=execute({pattern:'a',flags:'g',text:'a',protocol:2});assert.deepEqual(messages[0],{started:true});assert.equal(messages[1].matches[0].text,'a');});
test('regex: pasted literals parse flags and escaped delimiters',()=>{assert.deepEqual(regexInput('/hello/gi','m'),{pattern:'hello',flags:'gi'});assert.deepEqual(regexInput('/a\\/b/g',''),{pattern:'a\\/b',flags:'g'});assert.deepEqual(regexInput('/[/]/g',''),{pattern:'[/]',flags:'g'});assert.deepEqual(regexInput('https://example.com','i'),{pattern:'https://example.com',flags:'i'});assert.throws(()=>regexInput('/a/gg',''));assert.throws(()=>regexInput('/a/uv',''));assert.throws(()=>regexInput('a'.repeat(501),''));});
