import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'esbuild';

// Set CHROME_PATH when Chrome is installed outside the default Windows path.
const browser=process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':'chromium');
const profile=await mkdtemp(join(tmpdir(),'sukoaa-python-browser-'));
const bundle=await build({stdin:{contents:"export {pythonFrame} from './lib/platform/sandbox';export {loadPythonAssets} from './lib/platform/python-client';",resolveDir:process.cwd()},bundle:true,format:'iife',globalName:'sandbox',write:false});
const server=createServer(async(req,res)=>{
 try{
  if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><script src="/fixture.js"></script>');return;}
  if(req.url==='/fixture.js'){res.setHeader('Content-Type','text/javascript');res.end(bundle.outputFiles[0].text);return;}
  if(req.url==='/favicon.ico'){res.writeHead(204).end();return;}
  const name=req.url?.match(/^\/runtime\/python\/([\w.-]+)$/)?.[1];
  if(!name){res.writeHead(404).end();return;}
  res.end(await readFile(join('public/runtime/python',name)));
 }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const child=spawn(browser,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`],{stdio:'ignore',windowsHide:true});
let startupError;child.on('error',error=>{startupError=error});
let socket;
try{
 let port;
 for(let i=0;i<100;i++){
  if(startupError)throw startupError;
  try{port=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await new Promise(resolve=>setTimeout(resolve,100));}
 }
 if(!port)throw new Error('Chrome did not start. Set CHROME_PATH to a Chrome or Chromium executable.');
 const targets=await (await fetch(`http://127.0.0.1:${port}/json`)).json();
 socket=new WebSocket(targets.find(target=>target.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Chrome debugging connection timed out.')),10000);socket.onopen=()=>{clearTimeout(timer);resolve()};socket.onerror=error=>{clearTimeout(timer);reject(error)};});
 let id=0;const pending=new Map();
 socket.onmessage=event=>{const data=JSON.parse(event.data);if(data.id&&pending.has(data.id)){const request=pending.get(data.id);pending.delete(data.id);data.error?request.reject(data.error):request.resolve(data.result);}};
 const command=(method,params={})=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('CDP timeout: '+method)),60000);pending.set(++id,{resolve:value=>{clearTimeout(timer);resolve(value)},reject:error=>{clearTimeout(timer);reject(error)}});socket.send(JSON.stringify({id,method,params}));});
 await command('Page.enable');
 await command('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/`});
 for(let i=0;i<100;i++){
  const result=await command('Runtime.evaluate',{expression:'typeof sandbox'});
  if(result.result.value==='object')break;
  await new Promise(resolve=>setTimeout(resolve,100));
 }
 const result=await command('Runtime.evaluate',{awaitPromise:true,returnByValue:true,expression:`(async()=>{
  const results=[];
  for(const source of ['print(input())','if True print("bad")','print("run again")']){
   const assets=await sandbox.loadPythonAssets(new AbortController().signal);
   const channel=crypto.randomUUID();const iframe=document.createElement('iframe');iframe.sandbox='allow-scripts';
   const messages=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Browser Python run timed out')),50000);
    const messages=[];const listener=event=>{
     if(event.source!==iframe.contentWindow||event.data.channel!==channel)return;
     if(event.data.pythonReady){iframe.contentWindow.postMessage({channel,payload:{source,stdin:'Hello Python',assets}},'*');return;}
     messages.push(event.data);
     if(event.data.done){clearTimeout(timer);window.removeEventListener('message',listener);resolve(messages);}
    };
    window.addEventListener('message',listener);iframe.srcdoc=sandbox.pythonFrame(source,'Hello Python',channel,location.origin);document.body.append(iframe);
   });
   iframe.remove();results.push(messages);
  }
  return results;
 })()`});
 if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));
 const runs=result.result.value;
 assert.ok(runs[0].some(message=>message.line==='Hello Python'),JSON.stringify(runs[0]));
 assert.ok(runs[1].some(message=>message.diagnostic?.line===1&&message.diagnostic.message.includes('SyntaxError')),JSON.stringify(runs[1]));
 assert.ok(runs[2].some(message=>message.line==='run again'),JSON.stringify(runs[2]));
 console.log('Browser Python execution, syntax diagnostics and repeat runs passed.');
}finally{
 socket?.close();
 const exited=new Promise(resolve=>{if(startupError||child.exitCode!==null||child.signalCode!==null)resolve();else child.once('exit',resolve)});child.kill();await exited;
 server.closeAllConnections();
 await new Promise(resolve=>server.close(resolve));
 // This directory was created exclusively for this test under the OS temp directory.
 await rm(profile,{recursive:true,force:true,maxRetries:10,retryDelay:200});
}
