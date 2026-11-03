export type PythonAssets={runner:string;wasm:ArrayBuffer;stdlib:ArrayBuffer;lock:string};
let cached:PythonAssets|undefined;
// Fetch only our pinned public assets in the authenticated parent page. Never
// grant a code worker the parent origin or session just to load its runtime.
export async function loadPythonAssets(signal:AbortSignal):Promise<PythonAssets>{
 if(cached)return cached;
 const abort=new AbortController();const cancel=()=>abort.abort();signal.addEventListener('abort',cancel,{once:true});if(signal.aborted)abort.abort();
 const timeout=setTimeout(cancel,45000);
 try{
  const names=['runner.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json'];
  const data=await Promise.all(names.map(async name=>{const response=await fetch('/runtime/python/'+name+'?revision=3',{signal:abort.signal,credentials:'same-origin'});if(!response.ok)throw new Error('Python runtime files are unavailable. Reload the page or contact support.');return response.arrayBuffer()}));
  if(abort.signal.aborted)throw new Error('Python runtime loading stopped or exceeded 45 seconds.');
  const decode=(i:number)=>new TextDecoder().decode(data[i]);
  if(![0,97,115,109].every((byte,i)=>new Uint8Array(data[1])[i]===byte)||![80,75,3,4].every((byte,i)=>new Uint8Array(data[2])[i]===byte))throw new Error('Python assets could not load. Check access to runtime files and reload.');
  const runner=decode(0);if(!runner.startsWith('/* Sukoaa Python bundled worker v3 */'))throw new Error('Python runtime files are out of date. Reload the page or contact support.');
  cached={runner,wasm:data[1],stdlib:data[2],lock:decode(3)};
  return cached;
 }catch(error){abort.abort();throw error}finally{clearTimeout(timeout);signal.removeEventListener('abort',cancel)}
}
