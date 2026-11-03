export type PythonAssets={runner:string;loader:string;asm:string;wasm:ArrayBuffer;stdlib:ArrayBuffer;lock:string};
let cached:PythonAssets|undefined;
// Fetch only our pinned public assets in the authenticated parent page. Never
// grant a code worker the parent origin or session just to load its runtime.
export async function loadPythonAssets(signal:AbortSignal):Promise<PythonAssets>{
 if(cached)return cached;
 const abort=new AbortController();const cancel=()=>abort.abort();signal.addEventListener('abort',cancel,{once:true});if(signal.aborted)abort.abort();
 const timeout=setTimeout(cancel,45000);
 try{
  const names=['runner.mjs','pyodide.mjs','pyodide.asm.mjs','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json'];
  const data=await Promise.all(names.map(async name=>{const response=await fetch('/runtime/python/'+name,{signal:abort.signal,credentials:'same-origin'});if(!response.ok)throw new Error('Python runtime assets are missing. Run npm run prepare:runtimes and reload.');return response.arrayBuffer()}));
  if(abort.signal.aborted)throw new Error('Python runtime loading stopped or exceeded 45 seconds.');
  const decode=(i:number)=>new TextDecoder().decode(data[i]);
  if(![0,97,115,109].every((byte,i)=>new Uint8Array(data[3])[i]===byte)||![80,75,3,4].every((byte,i)=>new Uint8Array(data[4])[i]===byte))throw new Error('Python assets could not load. Check access to runtime files and reload.');
  cached={runner:decode(0),loader:decode(1),asm:decode(2),wasm:data[3],stdlib:data[4],lock:decode(5)};
  return cached;
 }catch(error){abort.abort();throw error}finally{clearTimeout(timeout);signal.removeEventListener('abort',cancel)}
}
