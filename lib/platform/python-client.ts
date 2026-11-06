export type PythonAssets={runner:string;wasm:ArrayBuffer;stdlib:ArrayBuffer;lock:string;packages:Record<string,ArrayBuffer>};
let cached:PythonAssets|undefined;
// Fetch only our pinned public assets in the authenticated parent page. Never
// grant a code worker the parent origin or session just to load its runtime.
export async function loadPythonAssets(signal:AbortSignal):Promise<PythonAssets>{
 if(cached)return cached;
 const abort=new AbortController();const cancel=()=>abort.abort();signal.addEventListener('abort',cancel,{once:true});if(signal.aborted)abort.abort();
 const timeout=setTimeout(cancel,45000);
 try{
  const names=['runner.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json'];
  const data=await Promise.all(names.map(async name=>{const response=await fetch('/runtime/python/'+name+'?revision=5',{signal:abort.signal,credentials:'same-origin'});if(!response.ok)throw new Error('Python runtime files are unavailable. Reload the page or contact support.');return response.arrayBuffer()}));
  if(abort.signal.aborted)throw new Error('Python runtime loading stopped or exceeded 45 seconds.');
  const decode=(i:number)=>new TextDecoder().decode(data[i]);
  if(![0,97,115,109].every((byte,i)=>new Uint8Array(data[1])[i]===byte)||![80,75,3,4].every((byte,i)=>new Uint8Array(data[2])[i]===byte))throw new Error('Python assets could not load. Check access to runtime files and reload.');
  const runner=decode(0);if(!runner.startsWith('/* Sukoaa Python bundled worker v5 */'))throw new Error('Python runtime files are out of date. Reload the page or contact support.');
  const manifestResponse=await fetch('/runtime/python/packages/manifest.json?revision=5',{signal:abort.signal,credentials:'same-origin'});if(!manifestResponse.ok)throw new Error('Python packages are unavailable. Reload after deployment.');
  const manifest=await manifestResponse.json() as {filename:string;sha256:string}[];if(!Array.isArray(manifest)||manifest.length!==5)throw new Error('Invalid Python package manifest.');
  const packages:Record<string,ArrayBuffer>={};await Promise.all(manifest.map(async item=>{if(!/^[a-zA-Z0-9_.-]+\.whl$/.test(item.filename)||!/^[a-f0-9]{64}$/.test(item.sha256))throw new Error('Invalid package metadata.');const response=await fetch('/runtime/python/packages/'+item.filename+'?revision=5',{signal:abort.signal,credentials:'same-origin'});if(!response.ok)throw new Error('Python package could not load.');const bytes=await response.arrayBuffer();const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');if(hash!==item.sha256)throw new Error('Python package integrity check failed.');packages[item.filename]=bytes}));
  cached={runner,wasm:data[1],stdlib:data[2],lock:decode(3),packages};
  return cached;
 }catch(error){abort.abort();throw error}finally{clearTimeout(timeout);signal.removeEventListener('abort',cancel)}
}
