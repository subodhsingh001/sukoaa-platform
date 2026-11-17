// Shareable links: the code is compressed and stored in the URL fragment (#s=...).
// The fragment is never sent to the server, so shared code stays private to whoever has the link.
const MAX_TOKEN=7000; // keeps the full URL within what browsers, chat apps and forums reliably accept
const b64=(bytes:Uint8Array)=>{let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const unb64=(t:string)=>{const s=atob(t.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((t.length+3)%4));return Uint8Array.from(s,c=>c.charCodeAt(0))};
async function pipe(data:Uint8Array,stream:CompressionStream|DecompressionStream){const w=stream.writable.getWriter();w.write(data as BufferSource).catch(()=>{});w.close().catch(()=>{});return new Uint8Array(await new Response(stream.readable).arrayBuffer())}
export async function encodeShare(data:unknown){
 const raw=new TextEncoder().encode(JSON.stringify(data));let token:string;
 if(typeof CompressionStream!=='undefined')token='z.'+b64(await pipe(raw,new CompressionStream('deflate-raw')));else token='u.'+b64(raw);
 if(token.length>MAX_TOKEN)throw new Error('This project is too large for a link ('+Math.round(token.length/1000)+' KB). Use Export instead.');
 return token;
}
export async function decodeShare(token:string):Promise<unknown|null>{
 try{const [kind,body]=[token.slice(0,2),token.slice(2)];const bytes=unb64(body);
  const raw=kind==='z.'?await pipe(bytes,new DecompressionStream('deflate-raw')):kind==='u.'?bytes:null;
  if(!raw||raw.length>200_000)return null;return JSON.parse(new TextDecoder().decode(raw));}catch{return null}
}
export function shareTokenFromHash(){const m=/(?:^#|&)s=([A-Za-z0-9_.-]+)/.exec(location.hash);return m?m[1]:null}
