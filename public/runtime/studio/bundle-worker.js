"use strict";(()=>{var Vt=Object.create;var nt=Object.defineProperty;var Bt=Object.getOwnPropertyDescriptor;var zt=Object.getOwnPropertyNames;var Jt=Object.getPrototypeOf,Gt=Object.prototype.hasOwnProperty;var qt=(I,N)=>()=>(N||I((N={exports:{}}).exports,N),N.exports);var Ht=(I,N,F,G)=>{if(N&&typeof N=="object"||typeof N=="function")for(let D of zt(N))!Gt.call(I,D)&&D!==F&&nt(I,D,{get:()=>N[D],enumerable:!(G=Bt(N,D))||G.enumerable});return I};var Yt=(I,N,F)=>(F=I!=null?Vt(Jt(I)):{},Ht(N||!I||!I.__esModule?nt(F,"default",{value:I,enumerable:!0}):F,I));var rt=qt((Qt,Fe)=>{(I=>{"use strict";var N=Object.defineProperty,F=Object.getOwnPropertyDescriptor,G=Object.getOwnPropertyNames,D=Object.prototype.hasOwnProperty,q=(e,t)=>{for(var r in t)N(e,r,{get:t[r],enumerable:!0})},te=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let h of G(t))!D.call(e,h)&&h!==r&&N(e,h,{get:()=>t[h],enumerable:!(a=F(t,h))||a.enumerable});return e},fe=e=>te(N({},"__esModule",{value:!0}),e),H=(e,t,r)=>new Promise((a,h)=>{var m=i=>{try{x(r.next(i))}catch(b){h(b)}},f=i=>{try{x(r.throw(i))}catch(b){h(b)}},x=i=>i.done?a(i.value):Promise.resolve(i.value).then(m,f);x((r=r.apply(e,t)).next())}),ee={};q(ee,{analyzeMetafile:()=>Ct,analyzeMetafileSync:()=>It,build:()=>Pt,buildSync:()=>Ot,context:()=>Tt,default:()=>Ft,formatMessages:()=>Rt,formatMessagesSync:()=>Nt,initialize:()=>Ut,stop:()=>Dt,transform:()=>At,transformSync:()=>$t,version:()=>_t}),I.exports=fe(ee);function We(e){let t=a=>{if(a===null)r.write8(0);else if(typeof a=="boolean")r.write8(1),r.write8(+a);else if(typeof a=="number")r.write8(2),r.write32(a|0);else if(typeof a=="string")r.write8(3),r.write(ce(a));else if(a instanceof Uint8Array)r.write8(4),r.write(a);else if(a instanceof Array){r.write8(5),r.write32(a.length);for(let h of a)t(h)}else{let h=Object.keys(a);r.write8(6),r.write32(h.length);for(let m of h)r.write(ce(m)),t(a[m])}},r=new Ve;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),t(e.value),Me(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function ut(e){let t=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return we(r.read());case 4:return r.read();case 5:{let f=r.read32(),x=[];for(let i=0;i<f;i++)x.push(t());return x}case 6:{let f=r.read32(),x={};for(let i=0;i<f;i++)x[we(r.read())]=t();return x}default:throw new Error("Invalid packet")}},r=new Ve(e),a=r.read32(),h=(a&1)===0;a>>>=1;let m=t();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:a,isRequest:h,value:m}}var Ve=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let t=new Uint8Array((this.len+e)*2);t.set(this.buf),this.buf=t}return this.len+=e,this.len-e}write8(e){let t=this._write(1);this.buf[t]=e}write32(e){let t=this._write(4);Me(this.buf,e,t)}write(e){let t=this._write(4+e.length);Me(this.buf,e.length,t),this.buf.set(e,t+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return Be(this.buf,this._read(4))}read(){let e=this.read32(),t=new Uint8Array(e),r=this._read(t.length);return t.set(this.buf.subarray(r,r+e)),t}},ce,we,Ue;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,t=new TextDecoder;ce=r=>e.encode(r),we=r=>t.decode(r),Ue='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ce=e=>Buffer.from(e),we=e=>{let{buffer:t,byteOffset:r,byteLength:a}=e;return Buffer.from(t,r,a).toString()},Ue='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ce("")instanceof Uint8Array))throw new Error(`Invariant violation: "${Ue} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function Be(e,t){return(e[t++]|e[t++]<<8|e[t++]<<16|e[t++]<<24)>>>0}function Me(e,t,r){e[r++]=t,e[r++]=t>>8,e[r++]=t>>16,e[r++]=t>>24}var de=String.fromCharCode;function oe(e,t,r){let a=e[t],h=1,m=0;for(let f=0;f<t;f++)e[f]===10?(h++,m=0):m++;throw new SyntaxError(r||(t===e.length?"Unexpected end of input while parsing JSON":a>=32&&a<=126?`Unexpected character ${de(a)} in JSON at position ${t} (line ${h}, column ${m})`:`Unexpected byte 0x${a.toString(16)} in JSON at position ${t} (line ${h}, column ${m})`))}function ft(e){if(!(e instanceof Uint8Array))throw new Error("JSON input must be a Uint8Array");let t=[],r=[],a=[],h=e.length,m=null,f=0,x,i=0;for(;i<h;){let b=e[i++];if(b<=32)continue;let k;switch(f===2&&m===null&&b!==34&&b!==125&&oe(e,--i),b){case 116:{(e[i++]!==114||e[i++]!==117||e[i++]!==101)&&oe(e,--i),k=!0;break}case 102:{(e[i++]!==97||e[i++]!==108||e[i++]!==115||e[i++]!==101)&&oe(e,--i),k=!1;break}case 110:{(e[i++]!==117||e[i++]!==108||e[i++]!==108)&&oe(e,--i),k=null;break}case 45:case 46:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:{let _=i;for(k=de(b),b=e[i];;){switch(b){case 43:case 45:case 46:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 101:case 69:{k+=de(b),b=e[++i];continue}}break}k=+k,isNaN(k)&&oe(e,--_,"Invalid number");break}case 34:{for(k="";i>=h&&oe(e,h),b=e[i++],b!==34;)if(b===92)switch(e[i++]){case 34:k+='"';break;case 47:k+="/";break;case 92:k+="\\";break;case 98:k+="\b";break;case 102:k+="\f";break;case 110:k+=`
`;break;case 114:k+="\r";break;case 116:k+="	";break;case 117:{let _=0;for(let W=0;W<4;W++)b=e[i++],_<<=4,b>=48&&b<=57?_|=b-48:b>=97&&b<=102?_|=b+-87:b>=65&&b<=70?_|=b+-55:oe(e,--i);k+=de(_);break}default:oe(e,--i);break}else if(b<=127)k+=de(b);else if((b&224)===192)k+=de((b&31)<<6|e[i++]&63);else if((b&240)===224)k+=de((b&15)<<12|(e[i++]&63)<<6|e[i++]&63);else if((b&248)==240){let _=(b&7)<<18|(e[i++]&63)<<12|(e[i++]&63)<<6|e[i++]&63;_>65535&&(_-=65536,k+=de(_>>10&1023|55296),_=56320|_&1023),k+=de(_)}k[0];break}case 91:{k=[],t.push(m),r.push(x),a.push(f),m=null,x=k,f=1;continue}case 123:{k={},t.push(m),r.push(x),a.push(f),m=null,x=k,f=2;continue}case 93:{f!==1&&oe(e,--i),k=x,m=t.pop(),x=r.pop(),f=a.pop();break}case 125:{f!==2&&oe(e,--i),k=x,m=t.pop(),x=r.pop(),f=a.pop();break}default:oe(e,--i)}for(b=e[i];b<=32;)b=e[++i];switch(f){case 0:{if(i===h)return k;break}case 1:{if(x.push(k),b===44){i++;continue}if(b===93)continue;break}case 2:{if(m===null){if(m=k,b===58){i++;continue}}else{if(x[m]=k,m=null,b===44){i++;continue}if(b===125)continue}break}}break}oe(e,i)}var Q=JSON.stringify,ze="warning",Je="silent";function ke(e,t){let r=[];for(let a of e){if(re(a,t),a.indexOf(",")>=0)throw new Error(`Invalid ${t}: ${a}`);r.push(a)}return r.join(",")}var Te=()=>null,Y=e=>typeof e=="boolean"?null:"a boolean",C=e=>typeof e=="string"?null:"a string",Ae=e=>e instanceof RegExp?null:"a RegExp object",be=e=>typeof e=="number"&&e===(e|0)?null:"an integer",dt=e=>typeof e=="number"&&e===(e|0)&&e>=0&&e<=65535?null:"a valid port number",Ge=e=>typeof e=="function"?null:"a function",pe=e=>Array.isArray(e)?null:"an array",ne=e=>Array.isArray(e)&&e.every(t=>typeof t=="string")?null:"an array of strings",ie=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",pt=e=>typeof e=="object"&&e!==null?null:"an array or an object",ht=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",qe=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",He=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",mt=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",Ye=e=>typeof e=="string"||Array.isArray(e)&&e.every(t=>typeof t=="string")?null:"a string or an array of strings",Xe=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",gt=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function s(e,t,r,a){let h=e[r];if(t[r+""]=!0,h===void 0)return;let m=a(h);if(m!==null)throw new Error(`${Q(r)} must be ${m}`);return h}function K(e,t,r){for(let a in e)if(!(a in t))throw new Error(`Invalid option ${r}: ${Q(a)}`)}function yt(e){let t=Object.create(null),r=s(e,t,"wasmURL",gt),a=s(e,t,"wasmModule",ht),h=s(e,t,"worker",Y);return K(e,t,"in initialize() call"),{wasmURL:r,wasmModule:a,worker:h}}function Ke(e){let t;if(e!==void 0){t=Object.create(null);for(let r in e){let a=e[r];if(typeof a=="string"||a===!1)t[r]=a;else throw new Error(`Expected ${Q(r)} in mangle cache to map to either a string or false`)}}return t}function Re(e,t,r,a,h){let m=s(t,r,"color",Y),f=s(t,r,"logLevel",C),x=s(t,r,"logLimit",be),i=s(t,r,"logStyle",C);m!==void 0?e.push(`--color=${m}`):a&&e.push("--color=true"),e.push(`--log-level=${f||h}`),e.push(`--log-limit=${x||0}`),i&&e.push(`--log-style=${i}`)}function re(e,t,r){if(typeof e!="string")throw new Error(`Expected value for ${t}${r!==void 0?" "+Q(r):""} to be a string, got ${typeof e} instead`);return e}function Ze(e,t,r){let a=s(t,r,"legalComments",C),h=s(t,r,"sourceRoot",C),m=s(t,r,"sourcesContent",Y),f=s(t,r,"target",Ye),x=s(t,r,"format",C),i=s(t,r,"globalName",C),b=s(t,r,"mangleProps",Ae),k=s(t,r,"reserveProps",Ae),_=s(t,r,"mangleQuoted",Y),W=s(t,r,"minify",Y),U=s(t,r,"minifySyntax",Y),B=s(t,r,"minifyWhitespace",Y),z=s(t,r,"minifyIdentifiers",Y),R=s(t,r,"lineLimit",be),X=s(t,r,"drop",ne),A=s(t,r,"dropLabels",ne),T=s(t,r,"charset",C),y=s(t,r,"treeShaking",Y),p=s(t,r,"ignoreAnnotations",Y),o=s(t,r,"jsx",C),u=s(t,r,"jsxFactory",C),d=s(t,r,"jsxFragment",C),w=s(t,r,"jsxImportSource",C),j=s(t,r,"jsxDev",Y),c=s(t,r,"jsxSideEffects",Y),g=s(t,r,"define",ie),E=s(t,r,"logOverride",ie),$=s(t,r,"supported",ie),n=s(t,r,"pure",ne),l=s(t,r,"keepNames",Y),v=s(t,r,"platform",C),P=s(t,r,"tsconfigRaw",mt),M=s(t,r,"absPaths",ne);if(a&&e.push(`--legal-comments=${a}`),h!==void 0&&e.push(`--source-root=${h}`),m!==void 0&&e.push(`--sources-content=${m}`),f&&e.push(`--target=${ke(Array.isArray(f)?f:[f],"target")}`),x&&e.push(`--format=${x}`),i&&e.push(`--global-name=${i}`),v&&e.push(`--platform=${v}`),P&&e.push(`--tsconfig-raw=${typeof P=="string"?P:JSON.stringify(P)}`),W&&e.push("--minify"),U&&e.push("--minify-syntax"),B&&e.push("--minify-whitespace"),z&&e.push("--minify-identifiers"),R&&e.push(`--line-limit=${R}`),T&&e.push(`--charset=${T}`),y!==void 0&&e.push(`--tree-shaking=${y}`),p&&e.push("--ignore-annotations"),X)for(let S of X)e.push(`--drop:${re(S,"drop")}`);if(A&&e.push(`--drop-labels=${ke(A,"drop label")}`),M&&e.push(`--abs-paths=${ke(M,"abs paths")}`),b&&e.push(`--mangle-props=${$e(b)}`),k&&e.push(`--reserve-props=${$e(k)}`),_!==void 0&&e.push(`--mangle-quoted=${_}`),o&&e.push(`--jsx=${o}`),u&&e.push(`--jsx-factory=${u}`),d&&e.push(`--jsx-fragment=${d}`),w&&e.push(`--jsx-import-source=${w}`),j&&e.push("--jsx-dev"),c&&e.push("--jsx-side-effects"),g)for(let S in g){if(S.indexOf("=")>=0)throw new Error(`Invalid define: ${S}`);e.push(`--define:${S}=${re(g[S],"define",S)}`)}if(E)for(let S in E){if(S.indexOf("=")>=0)throw new Error(`Invalid log override: ${S}`);e.push(`--log-override:${S}=${re(E[S],"log override",S)}`)}if($)for(let S in $){if(S.indexOf("=")>=0)throw new Error(`Invalid supported: ${S}`);let J=$[S];if(typeof J!="boolean")throw new Error(`Expected value for supported ${Q(S)} to be a boolean, got ${typeof J} instead`);e.push(`--supported:${S}=${J}`)}if(n)for(let S of n)e.push(`--pure:${re(S,"pure")}`);l&&e.push("--keep-names")}function wt(e,t,r,a,h){var m;let f=[],x=[],i=Object.create(null),b=null,k=null;Re(f,t,i,r,a),Ze(f,t,i);let _=s(t,i,"sourcemap",He),W=s(t,i,"bundle",Y),U=s(t,i,"splitting",Y),B=s(t,i,"preserveSymlinks",Y),z=s(t,i,"metafile",Y),R=s(t,i,"outfile",C),X=s(t,i,"outdir",C),A=s(t,i,"outbase",C),T=s(t,i,"tsconfig",C),y=s(t,i,"resolveExtensions",ne),p=s(t,i,"nodePaths",ne),o=s(t,i,"mainFields",ne),u=s(t,i,"conditions",ne),d=s(t,i,"external",ne),w=s(t,i,"packages",C),j=s(t,i,"alias",ie),c=s(t,i,"loader",ie),g=s(t,i,"outExtension",ie),E=s(t,i,"publicPath",C),$=s(t,i,"entryNames",C),n=s(t,i,"chunkNames",C),l=s(t,i,"assetNames",C),v=s(t,i,"inject",ne),P=s(t,i,"banner",ie),M=s(t,i,"footer",ie),S=s(t,i,"entryPoints",pt),J=s(t,i,"absWorkingDir",C),V=s(t,i,"stdin",ie),L=(m=s(t,i,"write",Y))!=null?m:h,se=s(t,i,"allowOverwrite",Y),Z=s(t,i,"mangleCache",ie);if(i.plugins=!0,K(t,i,`in ${e}() call`),_&&f.push(`--sourcemap${_===!0?"":`=${_}`}`),W&&f.push("--bundle"),se&&f.push("--allow-overwrite"),U&&f.push("--splitting"),B&&f.push("--preserve-symlinks"),z&&f.push("--metafile"),R&&f.push(`--outfile=${R}`),X&&f.push(`--outdir=${X}`),A&&f.push(`--outbase=${A}`),T&&f.push(`--tsconfig=${T}`),w&&f.push(`--packages=${w}`),y&&f.push(`--resolve-extensions=${ke(y,"resolve extension")}`),E&&f.push(`--public-path=${E}`),$&&f.push(`--entry-names=${$}`),n&&f.push(`--chunk-names=${n}`),l&&f.push(`--asset-names=${l}`),o&&f.push(`--main-fields=${ke(o,"main field")}`),u&&f.push(`--conditions=${ke(u,"condition")}`),d)for(let O of d)f.push(`--external:${re(O,"external")}`);if(j)for(let O in j){if(O.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${O}`);f.push(`--alias:${O}=${re(j[O],"alias",O)}`)}if(P)for(let O in P){if(O.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${O}`);f.push(`--banner:${O}=${re(P[O],"banner",O)}`)}if(M)for(let O in M){if(O.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${O}`);f.push(`--footer:${O}=${re(M[O],"footer",O)}`)}if(v)for(let O of v)f.push(`--inject:${re(O,"inject")}`);if(c)for(let O in c){if(O.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${O}`);f.push(`--loader:${O}=${re(c[O],"loader",O)}`)}if(g)for(let O in g){if(O.indexOf("=")>=0)throw new Error(`Invalid out extension: ${O}`);f.push(`--out-extension:${O}=${re(g[O],"out extension",O)}`)}if(S)if(Array.isArray(S))for(let O=0,ge=S.length;O<ge;O++){let le=S[O];if(typeof le=="object"&&le!==null){let ue=Object.create(null),ye=s(le,ue,"in",C),ae=s(le,ue,"out",C);if(K(le,ue,"in entry point at index "+O),ye===void 0)throw new Error('Missing property "in" for entry point at index '+O);if(ae===void 0)throw new Error('Missing property "out" for entry point at index '+O);x.push([ae,ye])}else x.push(["",re(le,"entry point at index "+O)])}else for(let O in S)x.push([O,re(S[O],"entry point",O)]);if(V){let O=Object.create(null),ge=s(V,O,"contents",Xe),le=s(V,O,"resolveDir",C),ue=s(V,O,"sourcefile",C),ye=s(V,O,"loader",C);K(V,O,'in "stdin" object'),ue&&f.push(`--sourcefile=${ue}`),ye&&f.push(`--loader=${ye}`),le&&(k=le),typeof ge=="string"?b=ce(ge):ge instanceof Uint8Array&&(b=ge)}let me=[];if(p)for(let O of p)O+="",me.push(O);return{entries:x,flags:f,write:L,stdinContents:b,stdinResolveDir:k,absWorkingDir:J,nodePaths:me,mangleCache:Ke(Z)}}function bt(e,t,r,a){let h=[],m=Object.create(null);Re(h,t,m,r,a),Ze(h,t,m);let f=s(t,m,"sourcemap",He),x=s(t,m,"sourcefile",C),i=s(t,m,"loader",C),b=s(t,m,"banner",C),k=s(t,m,"footer",C),_=s(t,m,"mangleCache",ie);return K(t,m,`in ${e}() call`),f&&h.push(`--sourcemap=${f===!0?"external":f}`),x&&h.push(`--sourcefile=${x}`),i&&h.push(`--loader=${i}`),b&&h.push(`--banner=${b}`),k&&h.push(`--footer=${k}`),{flags:h,mangleCache:Ke(_)}}function vt(e){let t={},r={didClose:!1,reason:""},a={},h=0,m=0,f=new Uint8Array(16*1024),x=0,i=T=>{let y=x+T.length;if(y>f.length){let o=new Uint8Array(y*2);o.set(f),f=o}f.set(T,x),x+=T.length;let p=0;for(;p+4<=x;){let o=Be(f,p);if(p+4+o>x)break;p+=4,B(f.subarray(p,p+o)),p+=o}p>0&&(f.copyWithin(0,p,x),x-=p)},b=T=>{r.didClose=!0,T&&(r.reason=": "+(T.message||T));let y="The service was stopped"+r.reason;for(let p in a)a[p](y,null);a={}},k=(T,y,p)=>{if(r.didClose)return p("The service is no longer running"+r.reason,null);let o=h++;a[o]=(u,d)=>{try{p(u,d)}finally{T&&T.unref()}},T&&T.ref(),e.writeToStdin(We({id:o,isRequest:!0,value:y}))},_=(T,y)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);e.writeToStdin(We({id:T,isRequest:!1,value:y}))},W=(T,y)=>H(null,null,function*(){try{if(y.command==="ping"){_(T,{});return}if(typeof y.key=="number"){let p=t[y.key];if(!p)return;let o=p[y.command];if(o){yield o(T,y);return}}throw new Error("Invalid command: "+y.command)}catch(p){let o=[ve(p,e,null,void 0,"")];try{_(T,{errors:o})}catch{}}}),U=!0,B=T=>{if(U){U=!1;let p=String.fromCharCode(...T);if(p!=="0.28.2")throw new Error(`Cannot start service: Host version "0.28.2" does not match binary version ${Q(p)}`);return}let y=ut(T);if(y.isRequest)W(y.id,y.value);else{let p=a[y.id];delete a[y.id],y.value.error?p(y.value.error,{}):p(null,y.value)}};return{readFromStdout:i,afterClose:b,service:{buildOrContext:({callName:T,refs:y,options:p,isTTY:o,defaultWD:u,callback:d})=>{let w=0,j=m++,c={},g={ref(){++w===1&&y&&y.ref()},unref(){--w===0&&(delete t[j],y&&y.unref())}};t[j]=c,g.ref(),xt(T,j,k,_,g,e,c,p,o,u,(E,$)=>{try{d(E,$)}finally{g.unref()}})},transform:({callName:T,refs:y,input:p,options:o,isTTY:u,fs:d,callback:w})=>{let j=Qe(),c=g=>{try{if(typeof p!="string"&&!(p instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:E,mangleCache:$}=bt(T,o,u,Je),n={command:"transform",flags:E,inputFS:g!==null,input:g!==null?ce(g):typeof p=="string"?ce(p):p};$&&(n.mangleCache=$),k(y,n,(l,v)=>{if(l)return w(new Error(l),null);let P=Ee(v.errors,j),M=Ee(v.warnings,j),S=1,J=()=>{if(--S===0){let V={warnings:M,code:v.code,map:v.map,mangleCache:void 0,legalComments:void 0};"legalComments"in v&&(V.legalComments=v?.legalComments),v.mangleCache&&(V.mangleCache=v?.mangleCache),w(null,V)}};if(P.length>0)return w(Se("Transform failed",P,M),null);v.codeFS&&(S++,d.readFile(v.code,(V,L)=>{V!==null?w(V,null):(v.code=L,J())})),v.mapFS&&(S++,d.readFile(v.map,(V,L)=>{V!==null?w(V,null):(v.map=L,J())})),J()})}catch(E){let $=[];try{Re($,o,{},u,Je)}catch{}let n=ve(E,e,j,void 0,"");k(y,{command:"error",flags:$,error:n},()=>{n.detail=j.load(n.detail),w(Se("Transform failed",[n],[]),null)})}};if((typeof p=="string"||p instanceof Uint8Array)&&p.length>1024*1024){let g=c;c=()=>d.writeFile(p,g)}c(null)},formatMessages:({callName:T,refs:y,messages:p,options:o,callback:u})=>{if(!o)throw new Error(`Missing second argument in ${T}() call`);let d={},w=s(o,d,"kind",C),j=s(o,d,"color",Y),c=s(o,d,"terminalWidth",be),g=s(o,d,"logStyle",C);if(K(o,d,`in ${T}() call`),w===void 0)throw new Error(`Missing "kind" in ${T}() call`);if(w!=="error"&&w!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${T}() call`);let E={command:"format-msgs",messages:he(p,"messages",null,"",c),isWarning:w==="warning"};j!==void 0&&(E.color=j),c!==void 0&&(E.terminalWidth=c),g!==void 0&&(E.logStyle=g),k(y,E,($,n)=>{if($)return u(new Error($),null);u(null,n.messages)})},analyzeMetafile:({callName:T,refs:y,metafile:p,options:o,callback:u})=>{o===void 0&&(o={});let d={},w=s(o,d,"color",Y),j=s(o,d,"verbose",Y);K(o,d,`in ${T}() call`);let c={command:"analyze-metafile",metafile:p};w!==void 0&&(c.color=w),j!==void 0&&(c.verbose=j),k(y,c,(g,E)=>{if(g)return u(new Error(g),null);u(null,E.result)})}}}}function xt(e,t,r,a,h,m,f,x,i,b,k){let _=Qe(),W=e==="context",U=(R,X)=>{let A=[];try{Re(A,x,{},i,ze)}catch{}let T=ve(R,m,_,void 0,X);r(h,{command:"error",flags:A,error:T},()=>{T.detail=_.load(T.detail),k(Se(W?"Context failed":"Build failed",[T],[]),null)})},B;if(typeof x=="object"){let R=x.plugins;if(R!==void 0){if(!Array.isArray(R))return U(new Error('"plugins" must be an array'),"");B=R}}if(B&&B.length>0){if(m.isSync)return U(new Error("Cannot use plugins in synchronous API calls"),"");kt(t,r,a,h,m,f,x,B,_).then(R=>{if(!R.ok)return U(R.error,R.pluginName);try{z(R.requestPlugins,R.runOnEndCallbacks,R.scheduleOnDisposeCallbacks)}catch(X){U(X,"")}},R=>U(R,""));return}try{z(null,(R,X)=>X([],[]),()=>{})}catch(R){U(R,"")}function z(R,X,A){let T=m.hasFS,{entries:y,flags:p,write:o,stdinContents:u,stdinResolveDir:d,absWorkingDir:w,nodePaths:j,mangleCache:c}=wt(e,x,i,ze,T);if(o&&!m.hasFS)throw new Error('The "write" option is unavailable in this environment');let g={command:"build",key:t,entries:y,flags:p,write:o,stdinContents:u,stdinResolveDir:d,absWorkingDir:w||b,nodePaths:j,context:W};R&&(g.plugins=R),c&&(g.mangleCache=c);let E=(l,v)=>{let P={errors:Ee(l.errors,_),warnings:Ee(l.warnings,_),outputFiles:void 0,metafile:void 0,mangleCache:void 0},M=P.errors.slice(),S=P.warnings.slice();l.outputFiles&&(P.outputFiles=l.outputFiles.map(jt)),l.metafile&&l.metafile.length&&(P.metafile=St(l.metafile)),l.mangleCache&&(P.mangleCache=l.mangleCache),l.writeToStdout!==void 0&&console.log(we(l.writeToStdout).replace(/\n$/,"")),X(P,(J,V)=>{if(M.length>0||J.length>0){let L=Se("Build failed",M.concat(J),S.concat(V));return v(L,null,J,V)}v(null,P,J,V)})},$,n;W&&(f["on-end"]=(l,v)=>new Promise(P=>{E(v,(M,S,J,V)=>{let L={errors:J,warnings:V};n&&n(M,S),$=void 0,n=void 0,a(l,L),P()})})),r(h,g,(l,v)=>{if(l)return k(new Error(l),null);if(!W)return E(v,(S,J)=>(A(),k(S,J)));if(v.errors.length>0)return k(Se("Context failed",v.errors,v.warnings),null);let P=!1,M={rebuild:()=>($||($=new Promise((S,J)=>{let V;n=(se,Z)=>{V||(V=()=>se?J(se):S(Z))};let L=()=>{r(h,{command:"rebuild",key:t},(Z,me)=>{Z?J(new Error(Z)):V?V():L()})};L()})),$),watch:(S={})=>new Promise((J,V)=>{if(!m.hasFS)throw new Error('Cannot use the "watch" API in this environment');let L={},se=s(S,L,"delay",be);K(S,L,"in watch() call");let Z={command:"watch",key:t};se&&(Z.delay=se),r(h,Z,me=>{me?V(new Error(me)):J(void 0)})}),serve:(S={})=>new Promise((J,V)=>{if(!m.hasFS)throw new Error('Cannot use the "serve" API in this environment');let L={},se=s(S,L,"port",dt),Z=s(S,L,"host",C),me=s(S,L,"servedir",C),O=s(S,L,"keyfile",C),ge=s(S,L,"certfile",C),le=s(S,L,"fallback",C),ue=s(S,L,"cors",ie),ye=s(S,L,"onRequest",Ge);K(S,L,"in serve() call");let ae={command:"serve",key:t,onRequest:!!ye};if(se!==void 0&&(ae.port=se),Z!==void 0&&(ae.host=Z),me!==void 0&&(ae.servedir=me),O!==void 0&&(ae.keyfile=O),ge!==void 0&&(ae.certfile=ge),le!==void 0&&(ae.fallback=le),ue){let Pe={},je=s(ue,Pe,"origin",Ye);K(ue,Pe,'on "cors" object'),Array.isArray(je)?ae.corsOrigin=je:je!==void 0&&(ae.corsOrigin=[je])}r(h,ae,(Pe,je)=>{if(Pe)return V(new Error(Pe));ye&&(f["serve-request"]=(Lt,Wt)=>{ye(Wt.args),a(Lt,{})}),J(je)})}),cancel:()=>new Promise(S=>{if(P)return S();r(h,{command:"cancel",key:t},()=>{S()})}),dispose:()=>new Promise(S=>{if(P)return S();P=!0,r(h,{command:"dispose",key:t},()=>{S(),A(),h.unref()})})};h.ref(),k(null,M)})}}var kt=(e,t,r,a,h,m,f,x,i)=>H(null,null,function*(){let b=[],k=[],_={},W={},U=[],B=0,z=0,R=[],X=!1;x=[...x];for(let y of x){let p={};if(typeof y!="object")throw new Error(`Plugin at index ${z} must be an object`);let o=s(y,p,"name",C);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${z} is missing a name`);try{let u=s(y,p,"setup",Ge);if(typeof u!="function")throw new Error("Plugin is missing a setup function");K(y,p,`on plugin ${Q(o)}`);let d={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};z++;let j=u({initialOptions:f,resolve:(c,g={})=>{if(!X)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof c!="string")throw new Error("The path to resolve must be a string");let E=Object.create(null),$=s(g,E,"pluginName",C),n=s(g,E,"importer",C),l=s(g,E,"namespace",C),v=s(g,E,"resolveDir",C),P=s(g,E,"kind",C),M=s(g,E,"pluginData",Te),S=s(g,E,"with",ie);return K(g,E,"in resolve() call"),new Promise((J,V)=>{let L={command:"resolve",path:c,key:e,pluginName:o};if($!=null&&(L.pluginName=$),n!=null&&(L.importer=n),l!=null&&(L.namespace=l),v!=null&&(L.resolveDir=v),P!=null)L.kind=P;else throw new Error('Must specify "kind" when calling "resolve"');M!=null&&(L.pluginData=i.store(M)),S!=null&&(L.with=Et(S,"with")),t(a,L,(se,Z)=>{se!==null?V(new Error(se)):J({errors:Ee(Z.errors,i),warnings:Ee(Z.warnings,i),path:Z.path,external:Z.external,sideEffects:Z.sideEffects,namespace:Z.namespace,suffix:Z.suffix,pluginData:i.load(Z.pluginData)})})})},onStart(c){let g='This error came from the "onStart" callback registered here:',E=Ce(new Error(g),h,"onStart");b.push({name:o,callback:c,note:E}),d.onStart=!0},onEnd(c){let g='This error came from the "onEnd" callback registered here:',E=Ce(new Error(g),h,"onEnd");k.push({name:o,callback:c,note:E}),d.onEnd=!0},onResolve(c,g){let E='This error came from the "onResolve" callback registered here:',$=Ce(new Error(E),h,"onResolve"),n={},l=s(c,n,"filter",Ae),v=s(c,n,"namespace",C);if(K(c,n,`in onResolve() call for plugin ${Q(o)}`),l==null)throw new Error("onResolve() call is missing a filter");let P=B++;_[P]={name:o,callback:g,note:$},d.onResolve.push({id:P,filter:$e(l),namespace:v||""})},onLoad(c,g){let E='This error came from the "onLoad" callback registered here:',$=Ce(new Error(E),h,"onLoad"),n={},l=s(c,n,"filter",Ae),v=s(c,n,"namespace",C);if(K(c,n,`in onLoad() call for plugin ${Q(o)}`),l==null)throw new Error("onLoad() call is missing a filter");let P=B++;W[P]={name:o,callback:g,note:$},d.onLoad.push({id:P,filter:$e(l),namespace:v||""})},onDispose(c){U.push(c)},esbuild:h.esbuild});j&&(yield j),R.push(d)}catch(u){return{ok:!1,error:u,pluginName:o}}}m["on-start"]=(y,p)=>H(null,null,function*(){i.clear();let o={errors:[],warnings:[]};yield Promise.all(b.map(u=>H(null,[u],function*({name:d,callback:w,note:j}){try{let c=yield w();if(c!=null){if(typeof c!="object")throw new Error(`Expected onStart() callback in plugin ${Q(d)} to return an object`);let g={},E=s(c,g,"errors",pe),$=s(c,g,"warnings",pe);K(c,g,`from onStart() callback in plugin ${Q(d)}`),E!=null&&o.errors.push(...he(E,"errors",i,d,void 0)),$!=null&&o.warnings.push(...he($,"warnings",i,d,void 0))}}catch(c){o.errors.push(ve(c,h,i,j&&j(),d))}}))),r(y,o)}),m["on-resolve"]=(y,p)=>H(null,null,function*(){let o={},u="",d,w;for(let j of p.ids)try{({name:u,callback:d,note:w}=_[j]);let c=yield d({path:p.path,importer:p.importer,namespace:p.namespace,resolveDir:p.resolveDir,kind:p.kind,pluginData:i.load(p.pluginData),with:p.with});if(c!=null){if(typeof c!="object")throw new Error(`Expected onResolve() callback in plugin ${Q(u)} to return an object`);let g={},E=s(c,g,"pluginName",C),$=s(c,g,"path",C),n=s(c,g,"namespace",C),l=s(c,g,"suffix",C),v=s(c,g,"external",Y),P=s(c,g,"sideEffects",Y),M=s(c,g,"pluginData",Te),S=s(c,g,"errors",pe),J=s(c,g,"warnings",pe),V=s(c,g,"watchFiles",ne),L=s(c,g,"watchDirs",ne);K(c,g,`from onResolve() callback in plugin ${Q(u)}`),o.id=j,E!=null&&(o.pluginName=E),$!=null&&(o.path=$),n!=null&&(o.namespace=n),l!=null&&(o.suffix=l),v!=null&&(o.external=v),P!=null&&(o.sideEffects=P),M!=null&&(o.pluginData=i.store(M)),S!=null&&(o.errors=he(S,"errors",i,u,void 0)),J!=null&&(o.warnings=he(J,"warnings",i,u,void 0)),V!=null&&(o.watchFiles=Oe(V,"watchFiles")),L!=null&&(o.watchDirs=Oe(L,"watchDirs"));break}}catch(c){o={id:j,errors:[ve(c,h,i,w&&w(),u)]};break}r(y,o)}),m["on-load"]=(y,p)=>H(null,null,function*(){let o={},u="",d,w;for(let j of p.ids)try{({name:u,callback:d,note:w}=W[j]);let c=yield d({path:p.path,namespace:p.namespace,suffix:p.suffix,pluginData:i.load(p.pluginData),with:p.with});if(c!=null){if(typeof c!="object")throw new Error(`Expected onLoad() callback in plugin ${Q(u)} to return an object`);let g={},E=s(c,g,"pluginName",C),$=s(c,g,"contents",Xe),n=s(c,g,"resolveDir",C),l=s(c,g,"pluginData",Te),v=s(c,g,"loader",C),P=s(c,g,"errors",pe),M=s(c,g,"warnings",pe),S=s(c,g,"watchFiles",ne),J=s(c,g,"watchDirs",ne);K(c,g,`from onLoad() callback in plugin ${Q(u)}`),o.id=j,E!=null&&(o.pluginName=E),$ instanceof Uint8Array?o.contents=$:$!=null&&(o.contents=ce($)),n!=null&&(o.resolveDir=n),l!=null&&(o.pluginData=i.store(l)),v!=null&&(o.loader=v),P!=null&&(o.errors=he(P,"errors",i,u,void 0)),M!=null&&(o.warnings=he(M,"warnings",i,u,void 0)),S!=null&&(o.watchFiles=Oe(S,"watchFiles")),J!=null&&(o.watchDirs=Oe(J,"watchDirs"));break}}catch(c){o={id:j,errors:[ve(c,h,i,w&&w(),u)]};break}r(y,o)});let A=(y,p)=>p([],[]);k.length>0&&(A=(y,p)=>{H(null,null,function*(){let o=[],u=[];for(let{name:d,callback:w,note:j}of k){let c,g;try{let E=yield w(y);if(E!=null){if(typeof E!="object")throw new Error(`Expected onEnd() callback in plugin ${Q(d)} to return an object`);let $={},n=s(E,$,"errors",pe),l=s(E,$,"warnings",pe);K(E,$,`from onEnd() callback in plugin ${Q(d)}`),n!=null&&(c=he(n,"errors",i,d,void 0)),l!=null&&(g=he(l,"warnings",i,d,void 0))}}catch(E){c=[ve(E,h,i,j&&j(),d)]}if(c){o.push(...c);try{y.errors.push(...c)}catch{}}if(g){u.push(...g);try{y.warnings.push(...g)}catch{}}}p(o,u)})});let T=()=>{for(let y of U)setTimeout(()=>y(),0)};return X=!0,{ok:!0,requestPlugins:R,runOnEndCallbacks:A,scheduleOnDisposeCallbacks:T}});function Qe(){let e=new Map,t=0;return{clear(){e.clear()},load(r){return e.get(r)},store(r){if(r===void 0)return-1;let a=t++;return e.set(a,r),a}}}function Ce(e,t,r){let a,h=!1;return()=>{if(h)return a;h=!0;try{let m=(e.stack+"").split(`
`);m.splice(1,1);let f=et(t,m,r);if(f)return a={text:e.message,location:f},a}catch{}}}function ve(e,t,r,a,h){let m="Internal error",f=null;try{m=(e&&e.message||e)+""}catch{}try{f=et(t,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:h,text:m,location:f,notes:a?[a]:[],detail:r?r.store(e):-1}}function et(e,t,r){let a="    at ";if(e.readFileSync&&!t[0].startsWith(a)&&t[1].startsWith(a))for(let h=1;h<t.length;h++){let m=t[h];if(m.startsWith(a))for(m=m.slice(a.length);;){let f=/^(?:new |async )?\S+ \((.*)\)$/.exec(m);if(f){m=f[1];continue}if(f=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(m),f){m=f[1];continue}if(f=/^(\S+):(\d+):(\d+)$/.exec(m),f){let x;try{x=e.readFileSync(f[1],"utf8")}catch{break}let i=x.split(/\r\n|\r|\n|\u2028|\u2029/)[+f[2]-1]||"",b=+f[3]-1,k=i.slice(b,b+r.length)===r?r.length:0;return{file:f[1],namespace:"file",line:+f[2],column:ce(i.slice(0,b)).length,length:ce(i.slice(b,b+k)).length,lineText:i+`
`+t.slice(1).join(`
`),suggestion:""}}break}}return null}function Se(e,t,r){let a=5;e+=t.length<1?"":` with ${t.length} error${t.length<2?"":"s"}:`+t.slice(0,a+1).map((m,f)=>{if(f===a)return`
...`;if(!m.location)return`
error: ${m.text}`;let{file:x,line:i,column:b}=m.location,k=m.pluginName?`[plugin: ${m.pluginName}] `:"";return`
${x}:${i}:${b}: ERROR: ${k}${m.text}`}).join("");let h=new Error(e);for(let[m,f]of[["errors",t],["warnings",r]])Object.defineProperty(h,m,{configurable:!0,enumerable:!0,get:()=>f,set:x=>Object.defineProperty(h,m,{configurable:!0,enumerable:!0,value:x})});return h}function Ee(e,t){for(let r of e)r.detail=t.load(r.detail);return e}function tt(e,t,r){if(e==null)return null;let a={},h=s(e,a,"file",C),m=s(e,a,"namespace",C),f=s(e,a,"line",be),x=s(e,a,"column",be),i=s(e,a,"length",be),b=s(e,a,"lineText",C),k=s(e,a,"suggestion",C);if(K(e,a,t),b){let _=b.slice(0,(x&&x>0?x:0)+(i&&i>0?i:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(_)&&!/\n/.test(b)&&(b=_)}return{file:h||"",namespace:m||"",line:f||0,column:x||0,length:i||0,lineText:b||"",suggestion:k||""}}function he(e,t,r,a,h){let m=[],f=0;for(let x of e){let i={},b=s(x,i,"id",C),k=s(x,i,"pluginName",C),_=s(x,i,"text",C),W=s(x,i,"location",qe),U=s(x,i,"notes",pe),B=s(x,i,"detail",Te),z=`in element ${f} of "${t}"`;K(x,i,z);let R=[];if(U)for(let X of U){let A={},T=s(X,A,"text",C),y=s(X,A,"location",qe);K(X,A,z),R.push({text:T||"",location:tt(y,z,h)})}m.push({id:b||"",pluginName:k||a,text:_||"",location:tt(W,z,h),notes:R,detail:r?r.store(B):-1}),f++}return m}function Oe(e,t){let r=[];for(let a of e){if(typeof a!="string")throw new Error(`${Q(t)} must be an array of strings`);r.push(a)}return r}function Et(e,t){let r=Object.create(null);for(let a in e){let h=e[a];if(typeof h!="string")throw new Error(`key ${Q(a)} in object ${Q(t)} must be a string`);r[a]=h}return r}function jt({path:e,contents:t,hash:r}){let a=null;return{path:e,contents:t,hash:r,get text(){let h=this.contents;return(a===null||h!==t)&&(t=h,a=we(h)),a}}}function $e(e){let t=e.source;return e.flags&&(t=`(?${e.flags})${t}`),t}function St(e){let t;try{t=we(e)}catch{return ft(e)}return JSON.parse(t)}var _t="0.28.2",Pt=e=>_e().build(e),Tt=e=>_e().context(e),At=(e,t)=>_e().transform(e,t),Rt=(e,t)=>_e().formatMessages(e,t),Ct=(e,t)=>_e().analyzeMetafile(e,t),Ot=()=>{throw new Error('The "buildSync" API only works in node')},$t=()=>{throw new Error('The "transformSync" API only works in node')},Nt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},It=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Dt=()=>(Ne&&Ne(),Promise.resolve()),xe,Ne,Ie,_e=()=>{if(Ie)return Ie;throw xe?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Ut=e=>{e=yt(e||{});let t=e.wasmURL,r=e.wasmModule,a=e.worker!==!1;if(!t&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(xe)throw new Error('Cannot call "initialize" more than once');return xe=Mt(t||"",r,a),xe.catch(()=>{xe=void 0}),xe},Mt=(e,t,r)=>H(null,null,function*(){let a,h,m=new Promise(_=>h=_);if(r){let _=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1, O_DIRECTORY: -1 },
            // unused
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substring(0, nl));
                outputBuf = outputBuf.substring(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.path) {
          globalThis.path = {
            resolve(...pathSegments) {
              return pathSegments.join("/");
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const setInt32 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const testCallExport = (a, b) => {
              this._inst.exports.testExport0();
              return this._inst.exports.testExport(a, b);
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              _gotest: {
                add: (a, b) => a + b,
                callExport: testCallExport
              },
              gojs: {
                // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                // This changes the SP, thus we have to update the SP used by the imported function.
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                // func resetMemoryDataView()
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                // func nanotime1() int64
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = (/* @__PURE__ */ new Date()).getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                // func scheduleTimeoutEvent(delay int64) int32
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8)
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                // func clearTimeoutEvent(id int32)
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                // func finalizeRef(v ref)
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                // func valueDelete(v ref, p string)
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                // func copyBytesToGo(dst []byte, src ref) (int, bool)
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                // func copyBytesToJS(dst ref, src []byte) (int, bool)
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                // JS values that Go currently has references to, indexed by reference id
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                // mapping from JS values to reference ids
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1) console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin) resumeStdin();
          }
          return go;
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.28.2"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
        return go;
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok) throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});a=new Worker(URL.createObjectURL(_))}else{let _=(U=>{var B=(A,T,y)=>new Promise((p,o)=>{var u=j=>{try{w(y.next(j))}catch(c){o(c)}},d=j=>{try{w(y.throw(j))}catch(c){o(c)}},w=j=>j.done?p(j.value):Promise.resolve(j.value).then(u,d);w((y=y.apply(A,T)).next())});let z,R={};for(let A=self;A;A=Object.getPrototypeOf(A))for(let T of Object.getOwnPropertyNames(A))T in R||Object.defineProperty(R,T,{get:()=>self[T]});(()=>{let A=()=>{let p=new Error("not implemented");return p.code="ENOSYS",p};if(!R.fs){let p="";R.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1,O_DIRECTORY:-1},writeSync(o,u){p+=y.decode(u);let d=p.lastIndexOf(`
`);return d!=-1&&(console.log(p.substring(0,d)),p=p.substring(d+1)),u.length},write(o,u,d,w,j,c){if(d!==0||w!==u.length||j!==null){c(A());return}let g=this.writeSync(o,u);c(null,g)},chmod(o,u,d){d(A())},chown(o,u,d,w){w(A())},close(o,u){u(A())},fchmod(o,u,d){d(A())},fchown(o,u,d,w){w(A())},fstat(o,u){u(A())},fsync(o,u){u(null)},ftruncate(o,u,d){d(A())},lchown(o,u,d,w){w(A())},link(o,u,d){d(A())},lstat(o,u){u(A())},mkdir(o,u,d){d(A())},open(o,u,d,w){w(A())},read(o,u,d,w,j,c){c(A())},readdir(o,u){u(A())},readlink(o,u){u(A())},rename(o,u,d){d(A())},rmdir(o,u){u(A())},stat(o,u){u(A())},symlink(o,u,d){d(A())},truncate(o,u,d){d(A())},unlink(o,u){u(A())},utimes(o,u,d,w){w(A())}}}if(R.process||(R.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw A()},pid:-1,ppid:-1,umask(){throw A()},cwd(){throw A()},chdir(){throw A()}}),R.path||(R.path={resolve(...p){return p.join("/")}}),!R.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!R.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!R.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!R.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");let T=new TextEncoder("utf-8"),y=new TextDecoder("utf-8");R.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=n=>{n!==0&&console.warn("exit code:",n)},this._exitPromise=new Promise(n=>{this._resolveExitPromise=n}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;let p=(n,l)=>{this.mem.setUint32(n+0,l,!0),this.mem.setUint32(n+4,Math.floor(l/4294967296),!0)},o=(n,l)=>{this.mem.setUint32(n+0,l,!0)},u=n=>{let l=this.mem.getUint32(n+0,!0),v=this.mem.getInt32(n+4,!0);return l+v*4294967296},d=n=>{let l=this.mem.getFloat64(n,!0);if(l===0)return;if(!isNaN(l))return l;let v=this.mem.getUint32(n,!0);return this._values[v]},w=(n,l)=>{if(typeof l=="number"&&l!==0){if(isNaN(l)){this.mem.setUint32(n+4,2146959360,!0),this.mem.setUint32(n,0,!0);return}this.mem.setFloat64(n,l,!0);return}if(l===void 0){this.mem.setFloat64(n,0,!0);return}let P=this._ids.get(l);P===void 0&&(P=this._idPool.pop(),P===void 0&&(P=this._values.length),this._values[P]=l,this._goRefCounts[P]=0,this._ids.set(l,P)),this._goRefCounts[P]++;let M=0;switch(typeof l){case"object":l!==null&&(M=1);break;case"string":M=2;break;case"symbol":M=3;break;case"function":M=4;break}this.mem.setUint32(n+4,2146959360|M,!0),this.mem.setUint32(n,P,!0)},j=n=>{let l=u(n+0),v=u(n+8);return new Uint8Array(this._inst.exports.mem.buffer,l,v)},c=n=>{let l=u(n+0),v=u(n+8),P=new Array(v);for(let M=0;M<v;M++)P[M]=d(l+M*8);return P},g=n=>{let l=u(n+0),v=u(n+8);return y.decode(new DataView(this._inst.exports.mem.buffer,l,v))},E=(n,l)=>(this._inst.exports.testExport0(),this._inst.exports.testExport(n,l)),$=Date.now()-performance.now();this.importObject={_gotest:{add:(n,l)=>n+l,callExport:E},gojs:{"runtime.wasmExit":n=>{n>>>=0;let l=this.mem.getInt32(n+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(l)},"runtime.wasmWrite":n=>{n>>>=0;let l=u(n+8),v=u(n+16),P=this.mem.getInt32(n+24,!0);R.fs.writeSync(l,new Uint8Array(this._inst.exports.mem.buffer,v,P))},"runtime.resetMemoryDataView":n=>{n>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":n=>{n>>>=0,p(n+8,($+performance.now())*1e6)},"runtime.walltime":n=>{n>>>=0;let l=new Date().getTime();p(n+8,l/1e3),this.mem.setInt32(n+16,l%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":n=>{n>>>=0;let l=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(l,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(l);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},u(n+8))),this.mem.setInt32(n+16,l,!0)},"runtime.clearTimeoutEvent":n=>{n>>>=0;let l=this.mem.getInt32(n+8,!0);clearTimeout(this._scheduledTimeouts.get(l)),this._scheduledTimeouts.delete(l)},"runtime.getRandomData":n=>{n>>>=0,crypto.getRandomValues(j(n+8))},"syscall/js.finalizeRef":n=>{n>>>=0;let l=this.mem.getUint32(n+8,!0);if(this._goRefCounts[l]--,this._goRefCounts[l]===0){let v=this._values[l];this._values[l]=null,this._ids.delete(v),this._idPool.push(l)}},"syscall/js.stringVal":n=>{n>>>=0,w(n+24,g(n+8))},"syscall/js.valueGet":n=>{n>>>=0;let l=Reflect.get(d(n+8),g(n+16));n=this._inst.exports.getsp()>>>0,w(n+32,l)},"syscall/js.valueSet":n=>{n>>>=0,Reflect.set(d(n+8),g(n+16),d(n+32))},"syscall/js.valueDelete":n=>{n>>>=0,Reflect.deleteProperty(d(n+8),g(n+16))},"syscall/js.valueIndex":n=>{n>>>=0,w(n+24,Reflect.get(d(n+8),u(n+16)))},"syscall/js.valueSetIndex":n=>{n>>>=0,Reflect.set(d(n+8),u(n+16),d(n+24))},"syscall/js.valueCall":n=>{n>>>=0;try{let l=d(n+8),v=Reflect.get(l,g(n+16)),P=c(n+32),M=Reflect.apply(v,l,P);n=this._inst.exports.getsp()>>>0,w(n+56,M),this.mem.setUint8(n+64,1)}catch(l){n=this._inst.exports.getsp()>>>0,w(n+56,l),this.mem.setUint8(n+64,0)}},"syscall/js.valueInvoke":n=>{n>>>=0;try{let l=d(n+8),v=c(n+16),P=Reflect.apply(l,void 0,v);n=this._inst.exports.getsp()>>>0,w(n+40,P),this.mem.setUint8(n+48,1)}catch(l){n=this._inst.exports.getsp()>>>0,w(n+40,l),this.mem.setUint8(n+48,0)}},"syscall/js.valueNew":n=>{n>>>=0;try{let l=d(n+8),v=c(n+16),P=Reflect.construct(l,v);n=this._inst.exports.getsp()>>>0,w(n+40,P),this.mem.setUint8(n+48,1)}catch(l){n=this._inst.exports.getsp()>>>0,w(n+40,l),this.mem.setUint8(n+48,0)}},"syscall/js.valueLength":n=>{n>>>=0,p(n+16,parseInt(d(n+8).length))},"syscall/js.valuePrepareString":n=>{n>>>=0;let l=T.encode(String(d(n+8)));w(n+16,l),p(n+24,l.length)},"syscall/js.valueLoadString":n=>{n>>>=0;let l=d(n+8);j(n+16).set(l)},"syscall/js.valueInstanceOf":n=>{n>>>=0,this.mem.setUint8(n+24,d(n+8)instanceof d(n+16)?1:0)},"syscall/js.copyBytesToGo":n=>{n>>>=0;let l=j(n+8),v=d(n+32);if(!(v instanceof Uint8Array||v instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}let P=v.subarray(0,l.length);l.set(P),p(n+40,P.length),this.mem.setUint8(n+48,1)},"syscall/js.copyBytesToJS":n=>{n>>>=0;let l=d(n+8),v=j(n+16);if(!(l instanceof Uint8Array||l instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}let P=v.subarray(0,l.length);l.set(P),p(n+40,P.length),this.mem.setUint8(n+48,1)},debug:n=>{console.log(n)}}}}run(p){return B(this,null,function*(){if(!(p instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=p,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,R,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[R,5],[this,6]]),this._idPool=[],this.exited=!1;let o=4096,u=E=>{let $=o,n=T.encode(E+"\0");return new Uint8Array(this.mem.buffer,o,n.length).set(n),o+=n.length,o%8!==0&&(o+=8-o%8),$},d=this.argv.length,w=[];this.argv.forEach(E=>{w.push(u(E))}),w.push(0),Object.keys(this.env).sort().forEach(E=>{w.push(u(`${E}=${this.env[E]}`))}),w.push(0);let c=o;if(w.forEach(E=>{this.mem.setUint32(o,E,!0),this.mem.setUint32(o+4,0,!0),o+=8}),o>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(d,c),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(p){let o=this;return function(){let u={id:p,this:this,args:arguments};return o._pendingEvent=u,o._resume(),u.result}}}})(),z=({data:A})=>{let T=new TextDecoder,y=R.fs,p="";y.writeSync=(j,c)=>{if(j===1)U(c);else if(j===2){p+=T.decode(c);let g=p.split(`
`);g.length>1&&console.log(g.slice(0,-1).join(`
`)),p=g[g.length-1]}else throw new Error("Bad write");return c.length};let o=[],u,d=0;z=({data:j})=>(j.length>0&&(o.push(j),u&&u()),w),y.read=(j,c,g,E,$,n)=>{if(j!==0||g!==0||E!==c.length||$!==null)throw new Error("Bad read");if(o.length===0){u=()=>y.read(j,c,g,E,$,n);return}let l=o[0],v=Math.max(0,Math.min(E,l.length-d));c.set(l.subarray(d,d+v),g),d+=v,d===l.length&&(o.shift(),d=0),n(null,v)};let w=new R.Go;return w.argv=["","--service=0.28.2"],X(A,w).then(j=>{U(null),w.run(j)},j=>{U(j)}),w};function X(A,T){return B(this,null,function*(){if(A instanceof WebAssembly.Module)return WebAssembly.instantiate(A,T.importObject);let y=yield fetch(A);if(!y.ok)throw new Error(`Failed to download ${JSON.stringify(A)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(y.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(y,T.importObject)).instance;let p=yield y.arrayBuffer();return(yield WebAssembly.instantiate(p,T.importObject)).instance})}return A=>z(A)})(U=>a.onmessage({data:U})),W;a={onmessage:null,postMessage:U=>setTimeout(()=>{try{W=_({data:U})}catch(B){h(B)}}),terminate(){if(W)for(let U of W._scheduledTimeouts.values())clearTimeout(U)}}}let f,x,i=new Promise((_,W)=>{f=_,x=W});a.onmessage=({data:_})=>{a.onmessage=({data:W})=>b(W),_?x(_):f()},a.postMessage(t||new URL(e,location.href).toString());let{readFromStdout:b,service:k}=vt({writeToStdin(_){a.postMessage(_)},isSync:!1,hasFS:!1,esbuild:ee});yield i,Ne=()=>{a.terminate(),xe=void 0,Ne=void 0,Ie=void 0},Ie={build:_=>new Promise((W,U)=>{m.then(U),k.buildOrContext({callName:"build",refs:null,options:_,isTTY:!1,defaultWD:"/",callback:(B,z)=>B?U(B):W(z)})}),context:_=>new Promise((W,U)=>{m.then(U),k.buildOrContext({callName:"context",refs:null,options:_,isTTY:!1,defaultWD:"/",callback:(B,z)=>B?U(B):W(z)})}),transform:(_,W)=>new Promise((U,B)=>{m.then(B),k.transform({callName:"transform",refs:null,input:_,options:W||{},isTTY:!1,fs:{readFile(z,R){R(new Error("Internal error"),null)},writeFile(z,R){R(null)}},callback:(z,R)=>z?B(z):U(R)})}),formatMessages:(_,W)=>new Promise((U,B)=>{m.then(B),k.formatMessages({callName:"formatMessages",refs:null,messages:_,options:W,callback:(z,R)=>z?B(z):U(R)})}),analyzeMetafile:(_,W)=>new Promise((U,B)=>{m.then(B),k.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof _=="string"?_:JSON.stringify(_),options:W,callback:(z,R)=>z?B(z):U(R)})})}}),Ft=ee})(typeof Fe=="object"?Fe:{set exports(I){(typeof self<"u"?self:this).esbuild=I}})});var De=Yt(rt());var Xt="0.12.0";function st(I){return I+"?v="+Xt}function Kt(){return"p-"+Array.from(crypto.getRandomValues(new Uint32Array(3)),I=>I.toString(16)).join("")}function Le(I){if(!I||I.length>180||I.startsWith("/")||I.includes("\\")||I.includes(":")||/[?#%<>|]/.test(I)||/[\x00-\x1f]/.test(I))throw new Error("Use a relative project path, for example src/components/Card.tsx.");let N=I.split("/");if(N.some(F=>!F||F==="."||F===".."||F.trim()!==F))throw new Error("Paths cannot contain empty segments, . or ...");if(N.some(F=>["node_modules",".git",".next",".next-dev",".angular","out-tsc","dist","__proto__"].includes(F)||/^\.env(?:\.|$)/.test(F)&&F!==".env.example"||/\.(pem|key|p12|pfx)$/i.test(F)))throw new Error("Dependencies, build folders and secret files are excluded. Use .env.example without real secrets.");return I}function it(I){if(!I||typeof I!="object")throw new Error("Invalid project.");let N=I;if(N.version!==1||!["react","nextjs"].includes(N.kind)||typeof N.name!="string"||!N.files||typeof N.files!="object"||Array.isArray(N.files))throw new Error("Unsupported project document.");let F=Object.entries(N.files);if(!F.length||F.length>150)throw new Error("Projects support 1\u2013150 files.");let G=0,D={};for(let[H,ee]of F){if(Le(H),typeof ee!="string"||ee.length>2e5)throw new Error("Use text source files under 200 KB each.");G+=new TextEncoder().encode(ee).length,D[H]=ee}if(G>1e6)throw new Error("Keep this browser project under 1 MB.");let q=Array.isArray(N.folders)?N.folders.filter(H=>typeof H=="string").map(Le):[],te=typeof N.entry=="string"?Le(N.entry):N.kind==="react"?"src/main.tsx":"app/page.tsx",fe=new Set(q);for(let H of Object.keys(D)){let ee=H.slice(0,H.lastIndexOf("/"));if(H.includes("/"))for(;ee;)fe.add(ee),ee=ee.includes("/")?ee.slice(0,ee.lastIndexOf("/")):""}for(let H of fe)if(D[H]!==void 0)throw new Error("A file and folder cannot have the same path: "+H);return{...N,version:1,id:typeof N.id=="string"&&/^[a-zA-Z0-9-]+$/.test(N.id)?N.id:Kt(),name:N.name.slice(0,100)||"Untitled project",files:D,folders:[...fe].sort(),entry:te}}function ot(I,N,F){let G=F.startsWith("@/")?(I["src/main.tsx"]!==void 0?"src/":"")+F.slice(2):F.startsWith(".")?N.slice(0,N.lastIndexOf("/")+1)+F:F,D=[];for(let q of G.split("/"))if(q===".."){if(!D.length)return;D.pop()}else q!=="."&&q&&D.push(q);G=D.join("/");for(let q of[G,...[".tsx",".ts",".jsx",".js",".json",".css"].map(te=>G+te),...[".tsx",".ts",".jsx",".js"].map(te=>G+"/index"+te)])if(I[q]!==void 0)return q}function lt(I){let N={};try{N=JSON.parse(I.files["package.json"]||"{}").dependencies||{}}catch{throw new Error("Fix package.json: it must be valid JSON.")}return{name:"sukoaa-project",setup(F){F.onResolve({filter:/.*/},G=>{let D=G.path;if(D==="react-native"&&I.files["sukoaa.native.json"])return{path:D,namespace:"sukoaa-builtins"};if(["react","react-dom","react-dom/client","react/jsx-runtime","react/jsx-dev-runtime"].includes(D))return{path:D,namespace:"sukoaa-builtins"};if(D.startsWith(".")||D.startsWith("@/")||G.kind==="entry-point"){let H=ot(I.files,G.importer,D);return H?{path:H,namespace:"sukoaa-project"}:{errors:[{text:"Cannot find "+D+". Check the file name and import path."}]}}let q=D.split("/"),te=D.startsWith("@")?q.slice(0,2).join("/"):q[0],fe=q.slice(D.startsWith("@")?2:1).join("/");return te==="next"||D.startsWith("node:")?{errors:[{text:"This import needs the Node runtime. React Fast preview cannot run Next.js or Node built-ins."}]}:!/^(?:@[\w.-]+\/)?[\w.-]+$/.test(te)||!/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(N[te]||"")?{errors:[{text:`Add an exact version for \u201C${te}\u201D in package.json dependencies (for example 1.2.3), or use Node runtime for npm version ranges.`}]}:fe.split("/").some(H=>H===".."||!/^[-\w.]*$/.test(H))?{errors:[{text:"Unsupported package subpath."}]}:{path:`https://esm.sh/${te}@${N[te]}${fe?"/"+fe:""}?bundle&external=react,react-dom`,external:!0}}),F.onLoad({filter:/.*/,namespace:"sukoaa-builtins"},G=>({contents:G.path==="react-native"?"module.exports=globalThis.ReactNativeWeb;":G.path==="react"?"module.exports=globalThis.React;":G.path.startsWith("react-dom")?"module.exports=globalThis.ReactDOM;":"module.exports={Fragment:globalThis.React.Fragment,jsx:(type,props,key)=>globalThis.React.createElement(type,{...props,key}),jsxs:(type,props,key)=>globalThis.React.createElement(type,{...props,key}),jsxDEV:(type,props,key)=>globalThis.React.createElement(type,{...props,key})};",loader:"js"})),F.onLoad({filter:/.*/,namespace:"sukoaa-project"},G=>{let D=G.path.split(".").pop()?.toLowerCase(),q=D==="tsx"?"tsx":D==="ts"?"ts":D==="jsx"?"jsx":D==="json"?"json":D==="css"?"css":D==="svg"?"dataurl":"js";return{contents:I.files[G.path],loader:q}})}}}var at={bundle:!0,write:!1,format:"esm",platform:"browser",target:"es2020",sourcemap:"external",sourcesContent:!0,outfile:"/out/project.js",jsx:"automatic",define:{"process.env.NODE_ENV":'"development"'},logLevel:"silent"};var ct;self.onmessage=async I=>{let N=!1;try{let F=it(I.data.project);ct??=De.initialize({wasmURL:new URL(st("/runtime/studio/esbuild.wasm"),self.location.origin).href,worker:!1}),await ct,N=!0;let D=(await De.build({...at,entryPoints:[F.entry],plugins:[lt(F)]})).outputFiles||[];self.postMessage({id:I.data.id,code:D.find(q=>q.path.endsWith(".js"))?.text||"",css:D.find(q=>q.path.endsWith(".css"))?.text||"",map:D.find(q=>q.path.endsWith(".js.map"))?.text})}catch(F){let G=F,D=(G.errors||[]).map(q=>({message:q.text,file:q.location?.file.replace(/^sukoaa-project:/,""),line:q.location?.line,column:q.location?q.location.column+1:void 0,source:"Build"}));self.postMessage({id:I.data.id,error:G.message,recoverable:!N,issues:D.length?D:[{message:G.message,source:"Build"}]})}};})();
