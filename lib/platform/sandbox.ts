// Untrusted code executes only inside an opaque-origin iframe (no allow-same-origin).
// A sourceURL and a calibrated Function wrapper offset preserve user-code locations.
const errorHelpers=String.raw`
let wrapperOffset=2;
try {new Function('throw new Error("calibrate");\n//# sourceURL=sukoaa-calibration.js')()} catch(e){const m=String(e.stack||'').match(/sukoaa-calibration\.js:(\d+):(\d+)/);if(m)wrapperOffset=Number(m[1])-1}
const errorDetails=(error)=>{const message=error&&error.message?(error.name||'Error')+': '+error.message:String(error);const m=String(error&&error.stack||'').match(/sukoaa-user\.js:(\d+):(\d+)/);return {message:message.slice(0,2000),line:m?Math.max(1,Number(m[1])-wrapperOffset):undefined,column:m?Number(m[2]):undefined}};
`;
export function jsFrame(code:string,channel:string){
 const worker=errorHelpers+String.raw`
let count=0,totalLength=0;const send=postMessage.bind(self);
const safe=(value)=>{try{return typeof value==='string'?value:JSON.stringify(value)}catch{return String(value)}};
const log=(...args)=>{if(count++>=200)return;const line=args.map(safe).join(' ').slice(0,2000);totalLength+=line.length;if(totalLength<30000)send({line})};
console.log=log;console.error=log;console.warn=log;console.info=log;
const fail=(error)=>{const diagnostic=errorDetails(error);send({line:diagnostic.message,diagnostic,done:true})};
onerror=(e)=>{fail(e.error||e.message);e.preventDefault()};onunhandledrejection=(e)=>{fail(e.reason);e.preventDefault()};
onmessage=async(e)=>{try{await new (Object.getPrototypeOf(async function(){}).constructor)(e.data+'\n//# sourceURL=sukoaa-user.js')();send({done:true})}catch(error){fail(error)}};
`;
 const script=`const channel=${JSON.stringify(channel)};const report=(data)=>parent.postMessage({channel,...data},'*');const w=new Worker(URL.createObjectURL(new Blob([${JSON.stringify(worker)}],{type:'text/javascript'})));let lines=0;const timer=setTimeout(()=>{w.terminate();report({line:'Stopped after 3 seconds.',diagnostic:{message:'Execution exceeded the 3-second limit. Check for an infinite loop.'},done:true})},3000);w.onmessage=e=>{if(e.data.line)lines++;report(e.data);if(e.data.done){if(!lines)report({line:'Completed. No console output.'});clearTimeout(timer);w.terminate()}};w.onerror=e=>{clearTimeout(timer);w.terminate();report({line:e.message,diagnostic:{message:e.message},done:true})};w.postMessage(${JSON.stringify(code)});`;
 return frame(script,"default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none';");
}
export function htmlFrame(source:string,channel=''){
 const header=`<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>`;
 const bootstrap=`<script>const channel=${JSON.stringify(channel)};const sourcePrefix=Number("0000000000");const report=(error,line,column)=>{const message=error&&error.message?(error.name||'Error')+': '+error.message:String(error);parent.postMessage({channel,line:message,diagnostic:{message,line:line||undefined,column:column?Math.max(1,column-(line===1?sourcePrefix:0)):undefined}},'*')};window.addEventListener('error',e=>report(e.error||e.message,e.lineno,e.colno));window.addEventListener('unhandledrejection',e=>{const m=String(e.reason&&e.reason.stack||'').match(/about:srcdoc:(\\d+):(\\d+)/);report(e.reason,m?Number(m[1]):undefined,m?Number(m[2]):undefined)});</script>`;
 const prefix=(header+bootstrap).replace('0000000000',String((header+bootstrap).length).padStart(10,'0'));
 // Keep the bootstrap on the first line so original HTML line numbers stay intact.
 return prefix+source+'</body></html>';
}
function frame(script:string,csp:string){return `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="${csp}"></head><body><script>${script.replace(/<\/script/gi,'<\\/script')}</script></body></html>`}
export function reactFrame(source:string,runtime:string,channel:string){
 const reporting=`const channel=${JSON.stringify(channel)};const report=(data)=>parent.postMessage({channel,...data},'*');const fail=(error)=>{const diagnostic=errorDetails(error);report({line:diagnostic.message,diagnostic})};window.__sukoaaError=fail;window.onerror=(_m,_s,_l,_c,error)=>fail(error||_m);window.onunhandledrejection=e=>fail(e.reason);let logs=0;console.log=(...args)=>{if(logs++<200)report({line:args.join(' ').slice(0,2000)})};`;
 const mount='\nReactDOM.createRoot(document.getElementById("root"),{onUncaughtError:window.__sukoaaError}).render(React.createElement(App));\n//# sourceURL=sukoaa-user.js';
 return frame(errorHelpers+reporting+runtime+'\ntry { new Function('+JSON.stringify(source+mount)+')(); }catch(error){fail(error)}',"default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; form-action 'none'; base-uri 'none';").replace('<body>','<body><div id="root"></div>');
}
