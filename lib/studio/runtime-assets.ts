// A release suffix prevents an older worker from using a newer WASM binary.
export const RUNTIME_VERSION='0.12.0';
export function runtimeAsset(path:string){return path+'?v='+RUNTIME_VERSION}
export async function checkedRuntimeAsset(path:string,kind:'script'|'wasm',signal?:AbortSignal){
 const response=await fetch(runtimeAsset(path),{cache:'no-store',signal});
 if(!response.ok)throw new Error(`${path} returned HTTP ${response.status}. Run npm run prepare:runtimes in the Sukoaa platform folder, restart the app, then reload.`);
 if(kind==='script'){
  const source=await response.text();
  if(!/javascript|ecmascript/.test(response.headers.get('content-type')||'')||/^\s*</.test(source))throw new Error(`${path} did not return JavaScript. Check your host's static-file routing and sign-in redirects.`);
  return source;
 }
 const bytes=await response.arrayBuffer();const magic=new Uint8Array(bytes,0,Math.min(4,bytes.byteLength));
 if(magic.length!==4||magic.some((n,i)=>n!==[0,97,115,109][i]))throw new Error(`${path} is not a WebAssembly file. Regenerate the runtime assets and check static-file routing.`);
 return bytes;
}
