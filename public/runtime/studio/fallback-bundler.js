(()=>{var Bt=Object.create;var nt=Object.defineProperty;var Vt=Object.getOwnPropertyDescriptor;var zt=Object.getOwnPropertyNames;var Jt=Object.getPrototypeOf,Gt=Object.prototype.hasOwnProperty;var qt=(V,z)=>()=>(z||V((z={exports:{}}).exports,z),z.exports);var Ht=(V,z,Y,G)=>{if(z&&typeof z=="object"||typeof z=="function")for(let I of zt(z))!Gt.call(V,I)&&I!==Y&&nt(V,I,{get:()=>z[I],enumerable:!(G=Vt(z,I))||G.enumerable});return V};var Yt=(V,z,Y)=>(Y=V!=null?Bt(Jt(V)):{},Ht(z||!V||!V.__esModule?nt(Y,"default",{value:V,enumerable:!0}):Y,V));var rt=qt((Qt,Fe)=>{(V=>{"use strict";var z=Object.defineProperty,Y=Object.getOwnPropertyDescriptor,G=Object.getOwnPropertyNames,I=Object.prototype.hasOwnProperty,J=(e,t)=>{for(var r in t)z(e,r,{get:t[r],enumerable:!0})},Q=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let p of G(t))!I.call(e,p)&&p!==r&&z(e,p,{get:()=>t[p],enumerable:!(a=Y(t,p))||a.enumerable});return e},ge=e=>Q(z({},"__esModule",{value:!0}),e),ee=(e,t,r)=>new Promise((a,p)=>{var m=i=>{try{x(r.next(i))}catch(b){p(b)}},f=i=>{try{x(r.throw(i))}catch(b){p(b)}},x=i=>i.done?a(i.value):Promise.resolve(i.value).then(m,f);x((r=r.apply(e,t)).next())}),Ae={};J(Ae,{analyzeMetafile:()=>Ct,analyzeMetafileSync:()=>It,build:()=>At,buildSync:()=>Ot,context:()=>Pt,default:()=>Ft,formatMessages:()=>Rt,formatMessagesSync:()=>Nt,initialize:()=>Ut,stop:()=>Dt,transform:()=>Tt,transformSync:()=>$t,version:()=>_t}),V.exports=ge(Ae);function We(e){let t=a=>{if(a===null)r.write8(0);else if(typeof a=="boolean")r.write8(1),r.write8(+a);else if(typeof a=="number")r.write8(2),r.write32(a|0);else if(typeof a=="string")r.write8(3),r.write(ae(a));else if(a instanceof Uint8Array)r.write8(4),r.write(a);else if(a instanceof Array){r.write8(5),r.write32(a.length);for(let p of a)t(p)}else{let p=Object.keys(a);r.write8(6),r.write32(p.length);for(let m of p)r.write(ae(m)),t(a[m])}},r=new Be;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),t(e.value),Me(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function ut(e){let t=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return ye(r.read());case 4:return r.read();case 5:{let f=r.read32(),x=[];for(let i=0;i<f;i++)x.push(t());return x}case 6:{let f=r.read32(),x={};for(let i=0;i<f;i++)x[ye(r.read())]=t();return x}default:throw new Error("Invalid packet")}},r=new Be(e),a=r.read32(),p=(a&1)===0;a>>>=1;let m=t();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:a,isRequest:p,value:m}}var Be=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let t=new Uint8Array((this.len+e)*2);t.set(this.buf),this.buf=t}return this.len+=e,this.len-e}write8(e){let t=this._write(1);this.buf[t]=e}write32(e){let t=this._write(4);Me(this.buf,e,t)}write(e){let t=this._write(4+e.length);Me(this.buf,e.length,t),this.buf.set(e,t+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return Ve(this.buf,this._read(4))}read(){let e=this.read32(),t=new Uint8Array(e),r=this._read(t.length);return t.set(this.buf.subarray(r,r+e)),t}},ae,ye,Ue;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,t=new TextDecoder;ae=r=>e.encode(r),ye=r=>t.decode(r),Ue='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ae=e=>Buffer.from(e),ye=e=>{let{buffer:t,byteOffset:r,byteLength:a}=e;return Buffer.from(t,r,a).toString()},Ue='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ae("")instanceof Uint8Array))throw new Error(`Invariant violation: "${Ue} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function Ve(e,t){return(e[t++]|e[t++]<<8|e[t++]<<16|e[t++]<<24)>>>0}function Me(e,t,r){e[r++]=t,e[r++]=t>>8,e[r++]=t>>16,e[r++]=t>>24}var ue=String.fromCharCode;function ie(e,t,r){let a=e[t],p=1,m=0;for(let f=0;f<t;f++)e[f]===10?(p++,m=0):m++;throw new SyntaxError(r||(t===e.length?"Unexpected end of input while parsing JSON":a>=32&&a<=126?`Unexpected character ${ue(a)} in JSON at position ${t} (line ${p}, column ${m})`:`Unexpected byte 0x${a.toString(16)} in JSON at position ${t} (line ${p}, column ${m})`))}function ft(e){if(!(e instanceof Uint8Array))throw new Error("JSON input must be a Uint8Array");let t=[],r=[],a=[],p=e.length,m=null,f=0,x,i=0;for(;i<p;){let b=e[i++];if(b<=32)continue;let k;switch(f===2&&m===null&&b!==34&&b!==125&&ie(e,--i),b){case 116:{(e[i++]!==114||e[i++]!==117||e[i++]!==101)&&ie(e,--i),k=!0;break}case 102:{(e[i++]!==97||e[i++]!==108||e[i++]!==115||e[i++]!==101)&&ie(e,--i),k=!1;break}case 110:{(e[i++]!==117||e[i++]!==108||e[i++]!==108)&&ie(e,--i),k=null;break}case 45:case 46:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:{let _=i;for(k=ue(b),b=e[i];;){switch(b){case 43:case 45:case 46:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 101:case 69:{k+=ue(b),b=e[++i];continue}}break}k=+k,isNaN(k)&&ie(e,--_,"Invalid number");break}case 34:{for(k="";i>=p&&ie(e,p),b=e[i++],b!==34;)if(b===92)switch(e[i++]){case 34:k+='"';break;case 47:k+="/";break;case 92:k+="\\";break;case 98:k+="\b";break;case 102:k+="\f";break;case 110:k+=`
`;break;case 114:k+="\r";break;case 116:k+="	";break;case 117:{let _=0;for(let M=0;M<4;M++)b=e[i++],_<<=4,b>=48&&b<=57?_|=b-48:b>=97&&b<=102?_|=b+-87:b>=65&&b<=70?_|=b+-55:ie(e,--i);k+=ue(_);break}default:ie(e,--i);break}else if(b<=127)k+=ue(b);else if((b&224)===192)k+=ue((b&31)<<6|e[i++]&63);else if((b&240)===224)k+=ue((b&15)<<12|(e[i++]&63)<<6|e[i++]&63);else if((b&248)==240){let _=(b&7)<<18|(e[i++]&63)<<12|(e[i++]&63)<<6|e[i++]&63;_>65535&&(_-=65536,k+=ue(_>>10&1023|55296),_=56320|_&1023),k+=ue(_)}k[0];break}case 91:{k=[],t.push(m),r.push(x),a.push(f),m=null,x=k,f=1;continue}case 123:{k={},t.push(m),r.push(x),a.push(f),m=null,x=k,f=2;continue}case 93:{f!==1&&ie(e,--i),k=x,m=t.pop(),x=r.pop(),f=a.pop();break}case 125:{f!==2&&ie(e,--i),k=x,m=t.pop(),x=r.pop(),f=a.pop();break}default:ie(e,--i)}for(b=e[i];b<=32;)b=e[++i];switch(f){case 0:{if(i===p)return k;break}case 1:{if(x.push(k),b===44){i++;continue}if(b===93)continue;break}case 2:{if(m===null){if(m=k,b===58){i++;continue}}else{if(x[m]=k,m=null,b===44){i++;continue}if(b===125)continue}break}}break}ie(e,i)}var Z=JSON.stringify,ze="warning",Je="silent";function xe(e,t){let r=[];for(let a of e){if(ne(a,t),a.indexOf(",")>=0)throw new Error(`Invalid ${t}: ${a}`);r.push(a)}return r.join(",")}var Pe=()=>null,q=e=>typeof e=="boolean"?null:"a boolean",C=e=>typeof e=="string"?null:"a string",Te=e=>e instanceof RegExp?null:"a RegExp object",we=e=>typeof e=="number"&&e===(e|0)?null:"an integer",dt=e=>typeof e=="number"&&e===(e|0)&&e>=0&&e<=65535?null:"a valid port number",Ge=e=>typeof e=="function"?null:"a function",fe=e=>Array.isArray(e)?null:"an array",te=e=>Array.isArray(e)&&e.every(t=>typeof t=="string")?null:"an array of strings",se=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",ht=e=>typeof e=="object"&&e!==null?null:"an array or an object",pt=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",qe=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",He=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",mt=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",Ye=e=>typeof e=="string"||Array.isArray(e)&&e.every(t=>typeof t=="string")?null:"a string or an array of strings",Xe=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",gt=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function s(e,t,r,a){let p=e[r];if(t[r+""]=!0,p===void 0)return;let m=a(p);if(m!==null)throw new Error(`${Z(r)} must be ${m}`);return p}function X(e,t,r){for(let a in e)if(!(a in t))throw new Error(`Invalid option ${r}: ${Z(a)}`)}function yt(e){let t=Object.create(null),r=s(e,t,"wasmURL",gt),a=s(e,t,"wasmModule",pt),p=s(e,t,"worker",q);return X(e,t,"in initialize() call"),{wasmURL:r,wasmModule:a,worker:p}}function Ke(e){let t;if(e!==void 0){t=Object.create(null);for(let r in e){let a=e[r];if(typeof a=="string"||a===!1)t[r]=a;else throw new Error(`Expected ${Z(r)} in mangle cache to map to either a string or false`)}}return t}function Re(e,t,r,a,p){let m=s(t,r,"color",q),f=s(t,r,"logLevel",C),x=s(t,r,"logLimit",we),i=s(t,r,"logStyle",C);m!==void 0?e.push(`--color=${m}`):a&&e.push("--color=true"),e.push(`--log-level=${f||p}`),e.push(`--log-limit=${x||0}`),i&&e.push(`--log-style=${i}`)}function ne(e,t,r){if(typeof e!="string")throw new Error(`Expected value for ${t}${r!==void 0?" "+Z(r):""} to be a string, got ${typeof e} instead`);return e}function Ze(e,t,r){let a=s(t,r,"legalComments",C),p=s(t,r,"sourceRoot",C),m=s(t,r,"sourcesContent",q),f=s(t,r,"target",Ye),x=s(t,r,"format",C),i=s(t,r,"globalName",C),b=s(t,r,"mangleProps",Te),k=s(t,r,"reserveProps",Te),_=s(t,r,"mangleQuoted",q),M=s(t,r,"minify",q),N=s(t,r,"minifySyntax",q),L=s(t,r,"minifyWhitespace",q),W=s(t,r,"minifyIdentifiers",q),R=s(t,r,"lineLimit",we),H=s(t,r,"drop",te),T=s(t,r,"dropLabels",te),P=s(t,r,"charset",C),y=s(t,r,"treeShaking",q),h=s(t,r,"ignoreAnnotations",q),o=s(t,r,"jsx",C),u=s(t,r,"jsxFactory",C),d=s(t,r,"jsxFragment",C),w=s(t,r,"jsxImportSource",C),j=s(t,r,"jsxDev",q),c=s(t,r,"jsxSideEffects",q),g=s(t,r,"define",se),E=s(t,r,"logOverride",se),$=s(t,r,"supported",se),n=s(t,r,"pure",te),l=s(t,r,"keepNames",q),v=s(t,r,"platform",C),A=s(t,r,"tsconfigRaw",mt),D=s(t,r,"absPaths",te);if(a&&e.push(`--legal-comments=${a}`),p!==void 0&&e.push(`--source-root=${p}`),m!==void 0&&e.push(`--sources-content=${m}`),f&&e.push(`--target=${xe(Array.isArray(f)?f:[f],"target")}`),x&&e.push(`--format=${x}`),i&&e.push(`--global-name=${i}`),v&&e.push(`--platform=${v}`),A&&e.push(`--tsconfig-raw=${typeof A=="string"?A:JSON.stringify(A)}`),M&&e.push("--minify"),N&&e.push("--minify-syntax"),L&&e.push("--minify-whitespace"),W&&e.push("--minify-identifiers"),R&&e.push(`--line-limit=${R}`),P&&e.push(`--charset=${P}`),y!==void 0&&e.push(`--tree-shaking=${y}`),h&&e.push("--ignore-annotations"),H)for(let S of H)e.push(`--drop:${ne(S,"drop")}`);if(T&&e.push(`--drop-labels=${xe(T,"drop label")}`),D&&e.push(`--abs-paths=${xe(D,"abs paths")}`),b&&e.push(`--mangle-props=${$e(b)}`),k&&e.push(`--reserve-props=${$e(k)}`),_!==void 0&&e.push(`--mangle-quoted=${_}`),o&&e.push(`--jsx=${o}`),u&&e.push(`--jsx-factory=${u}`),d&&e.push(`--jsx-fragment=${d}`),w&&e.push(`--jsx-import-source=${w}`),j&&e.push("--jsx-dev"),c&&e.push("--jsx-side-effects"),g)for(let S in g){if(S.indexOf("=")>=0)throw new Error(`Invalid define: ${S}`);e.push(`--define:${S}=${ne(g[S],"define",S)}`)}if(E)for(let S in E){if(S.indexOf("=")>=0)throw new Error(`Invalid log override: ${S}`);e.push(`--log-override:${S}=${ne(E[S],"log override",S)}`)}if($)for(let S in $){if(S.indexOf("=")>=0)throw new Error(`Invalid supported: ${S}`);let B=$[S];if(typeof B!="boolean")throw new Error(`Expected value for supported ${Z(S)} to be a boolean, got ${typeof B} instead`);e.push(`--supported:${S}=${B}`)}if(n)for(let S of n)e.push(`--pure:${ne(S,"pure")}`);l&&e.push("--keep-names")}function wt(e,t,r,a,p){var m;let f=[],x=[],i=Object.create(null),b=null,k=null;Re(f,t,i,r,a),Ze(f,t,i);let _=s(t,i,"sourcemap",He),M=s(t,i,"bundle",q),N=s(t,i,"splitting",q),L=s(t,i,"preserveSymlinks",q),W=s(t,i,"metafile",q),R=s(t,i,"outfile",C),H=s(t,i,"outdir",C),T=s(t,i,"outbase",C),P=s(t,i,"tsconfig",C),y=s(t,i,"resolveExtensions",te),h=s(t,i,"nodePaths",te),o=s(t,i,"mainFields",te),u=s(t,i,"conditions",te),d=s(t,i,"external",te),w=s(t,i,"packages",C),j=s(t,i,"alias",se),c=s(t,i,"loader",se),g=s(t,i,"outExtension",se),E=s(t,i,"publicPath",C),$=s(t,i,"entryNames",C),n=s(t,i,"chunkNames",C),l=s(t,i,"assetNames",C),v=s(t,i,"inject",te),A=s(t,i,"banner",se),D=s(t,i,"footer",se),S=s(t,i,"entryPoints",ht),B=s(t,i,"absWorkingDir",C),F=s(t,i,"stdin",se),U=(m=s(t,i,"write",q))!=null?m:p,re=s(t,i,"allowOverwrite",q),K=s(t,i,"mangleCache",se);if(i.plugins=!0,X(t,i,`in ${e}() call`),_&&f.push(`--sourcemap${_===!0?"":`=${_}`}`),M&&f.push("--bundle"),re&&f.push("--allow-overwrite"),N&&f.push("--splitting"),L&&f.push("--preserve-symlinks"),W&&f.push("--metafile"),R&&f.push(`--outfile=${R}`),H&&f.push(`--outdir=${H}`),T&&f.push(`--outbase=${T}`),P&&f.push(`--tsconfig=${P}`),w&&f.push(`--packages=${w}`),y&&f.push(`--resolve-extensions=${xe(y,"resolve extension")}`),E&&f.push(`--public-path=${E}`),$&&f.push(`--entry-names=${$}`),n&&f.push(`--chunk-names=${n}`),l&&f.push(`--asset-names=${l}`),o&&f.push(`--main-fields=${xe(o,"main field")}`),u&&f.push(`--conditions=${xe(u,"condition")}`),d)for(let O of d)f.push(`--external:${ne(O,"external")}`);if(j)for(let O in j){if(O.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${O}`);f.push(`--alias:${O}=${ne(j[O],"alias",O)}`)}if(A)for(let O in A){if(O.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${O}`);f.push(`--banner:${O}=${ne(A[O],"banner",O)}`)}if(D)for(let O in D){if(O.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${O}`);f.push(`--footer:${O}=${ne(D[O],"footer",O)}`)}if(v)for(let O of v)f.push(`--inject:${ne(O,"inject")}`);if(c)for(let O in c){if(O.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${O}`);f.push(`--loader:${O}=${ne(c[O],"loader",O)}`)}if(g)for(let O in g){if(O.indexOf("=")>=0)throw new Error(`Invalid out extension: ${O}`);f.push(`--out-extension:${O}=${ne(g[O],"out extension",O)}`)}if(S)if(Array.isArray(S))for(let O=0,pe=S.length;O<pe;O++){let oe=S[O];if(typeof oe=="object"&&oe!==null){let ce=Object.create(null),me=s(oe,ce,"in",C),le=s(oe,ce,"out",C);if(X(oe,ce,"in entry point at index "+O),me===void 0)throw new Error('Missing property "in" for entry point at index '+O);if(le===void 0)throw new Error('Missing property "out" for entry point at index '+O);x.push([le,me])}else x.push(["",ne(oe,"entry point at index "+O)])}else for(let O in S)x.push([O,ne(S[O],"entry point",O)]);if(F){let O=Object.create(null),pe=s(F,O,"contents",Xe),oe=s(F,O,"resolveDir",C),ce=s(F,O,"sourcefile",C),me=s(F,O,"loader",C);X(F,O,'in "stdin" object'),ce&&f.push(`--sourcefile=${ce}`),me&&f.push(`--loader=${me}`),oe&&(k=oe),typeof pe=="string"?b=ae(pe):pe instanceof Uint8Array&&(b=pe)}let he=[];if(h)for(let O of h)O+="",he.push(O);return{entries:x,flags:f,write:U,stdinContents:b,stdinResolveDir:k,absWorkingDir:B,nodePaths:he,mangleCache:Ke(K)}}function bt(e,t,r,a){let p=[],m=Object.create(null);Re(p,t,m,r,a),Ze(p,t,m);let f=s(t,m,"sourcemap",He),x=s(t,m,"sourcefile",C),i=s(t,m,"loader",C),b=s(t,m,"banner",C),k=s(t,m,"footer",C),_=s(t,m,"mangleCache",se);return X(t,m,`in ${e}() call`),f&&p.push(`--sourcemap=${f===!0?"external":f}`),x&&p.push(`--sourcefile=${x}`),i&&p.push(`--loader=${i}`),b&&p.push(`--banner=${b}`),k&&p.push(`--footer=${k}`),{flags:p,mangleCache:Ke(_)}}function vt(e){let t={},r={didClose:!1,reason:""},a={},p=0,m=0,f=new Uint8Array(16*1024),x=0,i=P=>{let y=x+P.length;if(y>f.length){let o=new Uint8Array(y*2);o.set(f),f=o}f.set(P,x),x+=P.length;let h=0;for(;h+4<=x;){let o=Ve(f,h);if(h+4+o>x)break;h+=4,L(f.subarray(h,h+o)),h+=o}h>0&&(f.copyWithin(0,h,x),x-=h)},b=P=>{r.didClose=!0,P&&(r.reason=": "+(P.message||P));let y="The service was stopped"+r.reason;for(let h in a)a[h](y,null);a={}},k=(P,y,h)=>{if(r.didClose)return h("The service is no longer running"+r.reason,null);let o=p++;a[o]=(u,d)=>{try{h(u,d)}finally{P&&P.unref()}},P&&P.ref(),e.writeToStdin(We({id:o,isRequest:!0,value:y}))},_=(P,y)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);e.writeToStdin(We({id:P,isRequest:!1,value:y}))},M=(P,y)=>ee(null,null,function*(){try{if(y.command==="ping"){_(P,{});return}if(typeof y.key=="number"){let h=t[y.key];if(!h)return;let o=h[y.command];if(o){yield o(P,y);return}}throw new Error("Invalid command: "+y.command)}catch(h){let o=[be(h,e,null,void 0,"")];try{_(P,{errors:o})}catch{}}}),N=!0,L=P=>{if(N){N=!1;let h=String.fromCharCode(...P);if(h!=="0.28.2")throw new Error(`Cannot start service: Host version "0.28.2" does not match binary version ${Z(h)}`);return}let y=ut(P);if(y.isRequest)M(y.id,y.value);else{let h=a[y.id];delete a[y.id],y.value.error?h(y.value.error,{}):h(null,y.value)}};return{readFromStdout:i,afterClose:b,service:{buildOrContext:({callName:P,refs:y,options:h,isTTY:o,defaultWD:u,callback:d})=>{let w=0,j=m++,c={},g={ref(){++w===1&&y&&y.ref()},unref(){--w===0&&(delete t[j],y&&y.unref())}};t[j]=c,g.ref(),xt(P,j,k,_,g,e,c,h,o,u,(E,$)=>{try{d(E,$)}finally{g.unref()}})},transform:({callName:P,refs:y,input:h,options:o,isTTY:u,fs:d,callback:w})=>{let j=Qe(),c=g=>{try{if(typeof h!="string"&&!(h instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:E,mangleCache:$}=bt(P,o,u,Je),n={command:"transform",flags:E,inputFS:g!==null,input:g!==null?ae(g):typeof h=="string"?ae(h):h};$&&(n.mangleCache=$),k(y,n,(l,v)=>{if(l)return w(new Error(l),null);let A=ke(v.errors,j),D=ke(v.warnings,j),S=1,B=()=>{if(--S===0){let F={warnings:D,code:v.code,map:v.map,mangleCache:void 0,legalComments:void 0};"legalComments"in v&&(F.legalComments=v?.legalComments),v.mangleCache&&(F.mangleCache=v?.mangleCache),w(null,F)}};if(A.length>0)return w(je("Transform failed",A,D),null);v.codeFS&&(S++,d.readFile(v.code,(F,U)=>{F!==null?w(F,null):(v.code=U,B())})),v.mapFS&&(S++,d.readFile(v.map,(F,U)=>{F!==null?w(F,null):(v.map=U,B())})),B()})}catch(E){let $=[];try{Re($,o,{},u,Je)}catch{}let n=be(E,e,j,void 0,"");k(y,{command:"error",flags:$,error:n},()=>{n.detail=j.load(n.detail),w(je("Transform failed",[n],[]),null)})}};if((typeof h=="string"||h instanceof Uint8Array)&&h.length>1024*1024){let g=c;c=()=>d.writeFile(h,g)}c(null)},formatMessages:({callName:P,refs:y,messages:h,options:o,callback:u})=>{if(!o)throw new Error(`Missing second argument in ${P}() call`);let d={},w=s(o,d,"kind",C),j=s(o,d,"color",q),c=s(o,d,"terminalWidth",we),g=s(o,d,"logStyle",C);if(X(o,d,`in ${P}() call`),w===void 0)throw new Error(`Missing "kind" in ${P}() call`);if(w!=="error"&&w!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${P}() call`);let E={command:"format-msgs",messages:de(h,"messages",null,"",c),isWarning:w==="warning"};j!==void 0&&(E.color=j),c!==void 0&&(E.terminalWidth=c),g!==void 0&&(E.logStyle=g),k(y,E,($,n)=>{if($)return u(new Error($),null);u(null,n.messages)})},analyzeMetafile:({callName:P,refs:y,metafile:h,options:o,callback:u})=>{o===void 0&&(o={});let d={},w=s(o,d,"color",q),j=s(o,d,"verbose",q);X(o,d,`in ${P}() call`);let c={command:"analyze-metafile",metafile:h};w!==void 0&&(c.color=w),j!==void 0&&(c.verbose=j),k(y,c,(g,E)=>{if(g)return u(new Error(g),null);u(null,E.result)})}}}}function xt(e,t,r,a,p,m,f,x,i,b,k){let _=Qe(),M=e==="context",N=(R,H)=>{let T=[];try{Re(T,x,{},i,ze)}catch{}let P=be(R,m,_,void 0,H);r(p,{command:"error",flags:T,error:P},()=>{P.detail=_.load(P.detail),k(je(M?"Context failed":"Build failed",[P],[]),null)})},L;if(typeof x=="object"){let R=x.plugins;if(R!==void 0){if(!Array.isArray(R))return N(new Error('"plugins" must be an array'),"");L=R}}if(L&&L.length>0){if(m.isSync)return N(new Error("Cannot use plugins in synchronous API calls"),"");kt(t,r,a,p,m,f,x,L,_).then(R=>{if(!R.ok)return N(R.error,R.pluginName);try{W(R.requestPlugins,R.runOnEndCallbacks,R.scheduleOnDisposeCallbacks)}catch(H){N(H,"")}},R=>N(R,""));return}try{W(null,(R,H)=>H([],[]),()=>{})}catch(R){N(R,"")}function W(R,H,T){let P=m.hasFS,{entries:y,flags:h,write:o,stdinContents:u,stdinResolveDir:d,absWorkingDir:w,nodePaths:j,mangleCache:c}=wt(e,x,i,ze,P);if(o&&!m.hasFS)throw new Error('The "write" option is unavailable in this environment');let g={command:"build",key:t,entries:y,flags:h,write:o,stdinContents:u,stdinResolveDir:d,absWorkingDir:w||b,nodePaths:j,context:M};R&&(g.plugins=R),c&&(g.mangleCache=c);let E=(l,v)=>{let A={errors:ke(l.errors,_),warnings:ke(l.warnings,_),outputFiles:void 0,metafile:void 0,mangleCache:void 0},D=A.errors.slice(),S=A.warnings.slice();l.outputFiles&&(A.outputFiles=l.outputFiles.map(jt)),l.metafile&&l.metafile.length&&(A.metafile=St(l.metafile)),l.mangleCache&&(A.mangleCache=l.mangleCache),l.writeToStdout!==void 0&&console.log(ye(l.writeToStdout).replace(/\n$/,"")),H(A,(B,F)=>{if(D.length>0||B.length>0){let U=je("Build failed",D.concat(B),S.concat(F));return v(U,null,B,F)}v(null,A,B,F)})},$,n;M&&(f["on-end"]=(l,v)=>new Promise(A=>{E(v,(D,S,B,F)=>{let U={errors:B,warnings:F};n&&n(D,S),$=void 0,n=void 0,a(l,U),A()})})),r(p,g,(l,v)=>{if(l)return k(new Error(l),null);if(!M)return E(v,(S,B)=>(T(),k(S,B)));if(v.errors.length>0)return k(je("Context failed",v.errors,v.warnings),null);let A=!1,D={rebuild:()=>($||($=new Promise((S,B)=>{let F;n=(re,K)=>{F||(F=()=>re?B(re):S(K))};let U=()=>{r(p,{command:"rebuild",key:t},(K,he)=>{K?B(new Error(K)):F?F():U()})};U()})),$),watch:(S={})=>new Promise((B,F)=>{if(!m.hasFS)throw new Error('Cannot use the "watch" API in this environment');let U={},re=s(S,U,"delay",we);X(S,U,"in watch() call");let K={command:"watch",key:t};re&&(K.delay=re),r(p,K,he=>{he?F(new Error(he)):B(void 0)})}),serve:(S={})=>new Promise((B,F)=>{if(!m.hasFS)throw new Error('Cannot use the "serve" API in this environment');let U={},re=s(S,U,"port",dt),K=s(S,U,"host",C),he=s(S,U,"servedir",C),O=s(S,U,"keyfile",C),pe=s(S,U,"certfile",C),oe=s(S,U,"fallback",C),ce=s(S,U,"cors",se),me=s(S,U,"onRequest",Ge);X(S,U,"in serve() call");let le={command:"serve",key:t,onRequest:!!me};if(re!==void 0&&(le.port=re),K!==void 0&&(le.host=K),he!==void 0&&(le.servedir=he),O!==void 0&&(le.keyfile=O),pe!==void 0&&(le.certfile=pe),oe!==void 0&&(le.fallback=oe),ce){let _e={},Ee=s(ce,_e,"origin",Ye);X(ce,_e,'on "cors" object'),Array.isArray(Ee)?le.corsOrigin=Ee:Ee!==void 0&&(le.corsOrigin=[Ee])}r(p,le,(_e,Ee)=>{if(_e)return F(new Error(_e));me&&(f["serve-request"]=(Lt,Wt)=>{me(Wt.args),a(Lt,{})}),B(Ee)})}),cancel:()=>new Promise(S=>{if(A)return S();r(p,{command:"cancel",key:t},()=>{S()})}),dispose:()=>new Promise(S=>{if(A)return S();A=!0,r(p,{command:"dispose",key:t},()=>{S(),T(),p.unref()})})};p.ref(),k(null,D)})}}var kt=(e,t,r,a,p,m,f,x,i)=>ee(null,null,function*(){let b=[],k=[],_={},M={},N=[],L=0,W=0,R=[],H=!1;x=[...x];for(let y of x){let h={};if(typeof y!="object")throw new Error(`Plugin at index ${W} must be an object`);let o=s(y,h,"name",C);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${W} is missing a name`);try{let u=s(y,h,"setup",Ge);if(typeof u!="function")throw new Error("Plugin is missing a setup function");X(y,h,`on plugin ${Z(o)}`);let d={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};W++;let j=u({initialOptions:f,resolve:(c,g={})=>{if(!H)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof c!="string")throw new Error("The path to resolve must be a string");let E=Object.create(null),$=s(g,E,"pluginName",C),n=s(g,E,"importer",C),l=s(g,E,"namespace",C),v=s(g,E,"resolveDir",C),A=s(g,E,"kind",C),D=s(g,E,"pluginData",Pe),S=s(g,E,"with",se);return X(g,E,"in resolve() call"),new Promise((B,F)=>{let U={command:"resolve",path:c,key:e,pluginName:o};if($!=null&&(U.pluginName=$),n!=null&&(U.importer=n),l!=null&&(U.namespace=l),v!=null&&(U.resolveDir=v),A!=null)U.kind=A;else throw new Error('Must specify "kind" when calling "resolve"');D!=null&&(U.pluginData=i.store(D)),S!=null&&(U.with=Et(S,"with")),t(a,U,(re,K)=>{re!==null?F(new Error(re)):B({errors:ke(K.errors,i),warnings:ke(K.warnings,i),path:K.path,external:K.external,sideEffects:K.sideEffects,namespace:K.namespace,suffix:K.suffix,pluginData:i.load(K.pluginData)})})})},onStart(c){let g='This error came from the "onStart" callback registered here:',E=Ce(new Error(g),p,"onStart");b.push({name:o,callback:c,note:E}),d.onStart=!0},onEnd(c){let g='This error came from the "onEnd" callback registered here:',E=Ce(new Error(g),p,"onEnd");k.push({name:o,callback:c,note:E}),d.onEnd=!0},onResolve(c,g){let E='This error came from the "onResolve" callback registered here:',$=Ce(new Error(E),p,"onResolve"),n={},l=s(c,n,"filter",Te),v=s(c,n,"namespace",C);if(X(c,n,`in onResolve() call for plugin ${Z(o)}`),l==null)throw new Error("onResolve() call is missing a filter");let A=L++;_[A]={name:o,callback:g,note:$},d.onResolve.push({id:A,filter:$e(l),namespace:v||""})},onLoad(c,g){let E='This error came from the "onLoad" callback registered here:',$=Ce(new Error(E),p,"onLoad"),n={},l=s(c,n,"filter",Te),v=s(c,n,"namespace",C);if(X(c,n,`in onLoad() call for plugin ${Z(o)}`),l==null)throw new Error("onLoad() call is missing a filter");let A=L++;M[A]={name:o,callback:g,note:$},d.onLoad.push({id:A,filter:$e(l),namespace:v||""})},onDispose(c){N.push(c)},esbuild:p.esbuild});j&&(yield j),R.push(d)}catch(u){return{ok:!1,error:u,pluginName:o}}}m["on-start"]=(y,h)=>ee(null,null,function*(){i.clear();let o={errors:[],warnings:[]};yield Promise.all(b.map(u=>ee(null,[u],function*({name:d,callback:w,note:j}){try{let c=yield w();if(c!=null){if(typeof c!="object")throw new Error(`Expected onStart() callback in plugin ${Z(d)} to return an object`);let g={},E=s(c,g,"errors",fe),$=s(c,g,"warnings",fe);X(c,g,`from onStart() callback in plugin ${Z(d)}`),E!=null&&o.errors.push(...de(E,"errors",i,d,void 0)),$!=null&&o.warnings.push(...de($,"warnings",i,d,void 0))}}catch(c){o.errors.push(be(c,p,i,j&&j(),d))}}))),r(y,o)}),m["on-resolve"]=(y,h)=>ee(null,null,function*(){let o={},u="",d,w;for(let j of h.ids)try{({name:u,callback:d,note:w}=_[j]);let c=yield d({path:h.path,importer:h.importer,namespace:h.namespace,resolveDir:h.resolveDir,kind:h.kind,pluginData:i.load(h.pluginData),with:h.with});if(c!=null){if(typeof c!="object")throw new Error(`Expected onResolve() callback in plugin ${Z(u)} to return an object`);let g={},E=s(c,g,"pluginName",C),$=s(c,g,"path",C),n=s(c,g,"namespace",C),l=s(c,g,"suffix",C),v=s(c,g,"external",q),A=s(c,g,"sideEffects",q),D=s(c,g,"pluginData",Pe),S=s(c,g,"errors",fe),B=s(c,g,"warnings",fe),F=s(c,g,"watchFiles",te),U=s(c,g,"watchDirs",te);X(c,g,`from onResolve() callback in plugin ${Z(u)}`),o.id=j,E!=null&&(o.pluginName=E),$!=null&&(o.path=$),n!=null&&(o.namespace=n),l!=null&&(o.suffix=l),v!=null&&(o.external=v),A!=null&&(o.sideEffects=A),D!=null&&(o.pluginData=i.store(D)),S!=null&&(o.errors=de(S,"errors",i,u,void 0)),B!=null&&(o.warnings=de(B,"warnings",i,u,void 0)),F!=null&&(o.watchFiles=Oe(F,"watchFiles")),U!=null&&(o.watchDirs=Oe(U,"watchDirs"));break}}catch(c){o={id:j,errors:[be(c,p,i,w&&w(),u)]};break}r(y,o)}),m["on-load"]=(y,h)=>ee(null,null,function*(){let o={},u="",d,w;for(let j of h.ids)try{({name:u,callback:d,note:w}=M[j]);let c=yield d({path:h.path,namespace:h.namespace,suffix:h.suffix,pluginData:i.load(h.pluginData),with:h.with});if(c!=null){if(typeof c!="object")throw new Error(`Expected onLoad() callback in plugin ${Z(u)} to return an object`);let g={},E=s(c,g,"pluginName",C),$=s(c,g,"contents",Xe),n=s(c,g,"resolveDir",C),l=s(c,g,"pluginData",Pe),v=s(c,g,"loader",C),A=s(c,g,"errors",fe),D=s(c,g,"warnings",fe),S=s(c,g,"watchFiles",te),B=s(c,g,"watchDirs",te);X(c,g,`from onLoad() callback in plugin ${Z(u)}`),o.id=j,E!=null&&(o.pluginName=E),$ instanceof Uint8Array?o.contents=$:$!=null&&(o.contents=ae($)),n!=null&&(o.resolveDir=n),l!=null&&(o.pluginData=i.store(l)),v!=null&&(o.loader=v),A!=null&&(o.errors=de(A,"errors",i,u,void 0)),D!=null&&(o.warnings=de(D,"warnings",i,u,void 0)),S!=null&&(o.watchFiles=Oe(S,"watchFiles")),B!=null&&(o.watchDirs=Oe(B,"watchDirs"));break}}catch(c){o={id:j,errors:[be(c,p,i,w&&w(),u)]};break}r(y,o)});let T=(y,h)=>h([],[]);k.length>0&&(T=(y,h)=>{ee(null,null,function*(){let o=[],u=[];for(let{name:d,callback:w,note:j}of k){let c,g;try{let E=yield w(y);if(E!=null){if(typeof E!="object")throw new Error(`Expected onEnd() callback in plugin ${Z(d)} to return an object`);let $={},n=s(E,$,"errors",fe),l=s(E,$,"warnings",fe);X(E,$,`from onEnd() callback in plugin ${Z(d)}`),n!=null&&(c=de(n,"errors",i,d,void 0)),l!=null&&(g=de(l,"warnings",i,d,void 0))}}catch(E){c=[be(E,p,i,j&&j(),d)]}if(c){o.push(...c);try{y.errors.push(...c)}catch{}}if(g){u.push(...g);try{y.warnings.push(...g)}catch{}}}h(o,u)})});let P=()=>{for(let y of N)setTimeout(()=>y(),0)};return H=!0,{ok:!0,requestPlugins:R,runOnEndCallbacks:T,scheduleOnDisposeCallbacks:P}});function Qe(){let e=new Map,t=0;return{clear(){e.clear()},load(r){return e.get(r)},store(r){if(r===void 0)return-1;let a=t++;return e.set(a,r),a}}}function Ce(e,t,r){let a,p=!1;return()=>{if(p)return a;p=!0;try{let m=(e.stack+"").split(`
`);m.splice(1,1);let f=et(t,m,r);if(f)return a={text:e.message,location:f},a}catch{}}}function be(e,t,r,a,p){let m="Internal error",f=null;try{m=(e&&e.message||e)+""}catch{}try{f=et(t,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:p,text:m,location:f,notes:a?[a]:[],detail:r?r.store(e):-1}}function et(e,t,r){let a="    at ";if(e.readFileSync&&!t[0].startsWith(a)&&t[1].startsWith(a))for(let p=1;p<t.length;p++){let m=t[p];if(m.startsWith(a))for(m=m.slice(a.length);;){let f=/^(?:new |async )?\S+ \((.*)\)$/.exec(m);if(f){m=f[1];continue}if(f=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(m),f){m=f[1];continue}if(f=/^(\S+):(\d+):(\d+)$/.exec(m),f){let x;try{x=e.readFileSync(f[1],"utf8")}catch{break}let i=x.split(/\r\n|\r|\n|\u2028|\u2029/)[+f[2]-1]||"",b=+f[3]-1,k=i.slice(b,b+r.length)===r?r.length:0;return{file:f[1],namespace:"file",line:+f[2],column:ae(i.slice(0,b)).length,length:ae(i.slice(b,b+k)).length,lineText:i+`
`+t.slice(1).join(`
`),suggestion:""}}break}}return null}function je(e,t,r){let a=5;e+=t.length<1?"":` with ${t.length} error${t.length<2?"":"s"}:`+t.slice(0,a+1).map((m,f)=>{if(f===a)return`
...`;if(!m.location)return`
error: ${m.text}`;let{file:x,line:i,column:b}=m.location,k=m.pluginName?`[plugin: ${m.pluginName}] `:"";return`
${x}:${i}:${b}: ERROR: ${k}${m.text}`}).join("");let p=new Error(e);for(let[m,f]of[["errors",t],["warnings",r]])Object.defineProperty(p,m,{configurable:!0,enumerable:!0,get:()=>f,set:x=>Object.defineProperty(p,m,{configurable:!0,enumerable:!0,value:x})});return p}function ke(e,t){for(let r of e)r.detail=t.load(r.detail);return e}function tt(e,t,r){if(e==null)return null;let a={},p=s(e,a,"file",C),m=s(e,a,"namespace",C),f=s(e,a,"line",we),x=s(e,a,"column",we),i=s(e,a,"length",we),b=s(e,a,"lineText",C),k=s(e,a,"suggestion",C);if(X(e,a,t),b){let _=b.slice(0,(x&&x>0?x:0)+(i&&i>0?i:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(_)&&!/\n/.test(b)&&(b=_)}return{file:p||"",namespace:m||"",line:f||0,column:x||0,length:i||0,lineText:b||"",suggestion:k||""}}function de(e,t,r,a,p){let m=[],f=0;for(let x of e){let i={},b=s(x,i,"id",C),k=s(x,i,"pluginName",C),_=s(x,i,"text",C),M=s(x,i,"location",qe),N=s(x,i,"notes",fe),L=s(x,i,"detail",Pe),W=`in element ${f} of "${t}"`;X(x,i,W);let R=[];if(N)for(let H of N){let T={},P=s(H,T,"text",C),y=s(H,T,"location",qe);X(H,T,W),R.push({text:P||"",location:tt(y,W,p)})}m.push({id:b||"",pluginName:k||a,text:_||"",location:tt(M,W,p),notes:R,detail:r?r.store(L):-1}),f++}return m}function Oe(e,t){let r=[];for(let a of e){if(typeof a!="string")throw new Error(`${Z(t)} must be an array of strings`);r.push(a)}return r}function Et(e,t){let r=Object.create(null);for(let a in e){let p=e[a];if(typeof p!="string")throw new Error(`key ${Z(a)} in object ${Z(t)} must be a string`);r[a]=p}return r}function jt({path:e,contents:t,hash:r}){let a=null;return{path:e,contents:t,hash:r,get text(){let p=this.contents;return(a===null||p!==t)&&(t=p,a=ye(p)),a}}}function $e(e){let t=e.source;return e.flags&&(t=`(?${e.flags})${t}`),t}function St(e){let t;try{t=ye(e)}catch{return ft(e)}return JSON.parse(t)}var _t="0.28.2",At=e=>Se().build(e),Pt=e=>Se().context(e),Tt=(e,t)=>Se().transform(e,t),Rt=(e,t)=>Se().formatMessages(e,t),Ct=(e,t)=>Se().analyzeMetafile(e,t),Ot=()=>{throw new Error('The "buildSync" API only works in node')},$t=()=>{throw new Error('The "transformSync" API only works in node')},Nt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},It=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Dt=()=>(Ne&&Ne(),Promise.resolve()),ve,Ne,Ie,Se=()=>{if(Ie)return Ie;throw ve?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Ut=e=>{e=yt(e||{});let t=e.wasmURL,r=e.wasmModule,a=e.worker!==!1;if(!t&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(ve)throw new Error('Cannot call "initialize" more than once');return ve=Mt(t||"",r,a),ve.catch(()=>{ve=void 0}),ve},Mt=(e,t,r)=>ee(null,null,function*(){let a,p,m=new Promise(_=>p=_);if(r){let _=new Blob([`onmessage=((postMessage) => {
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
    })(postMessage)`],{type:"text/javascript"});a=new Worker(URL.createObjectURL(_))}else{let _=(N=>{var L=(T,P,y)=>new Promise((h,o)=>{var u=j=>{try{w(y.next(j))}catch(c){o(c)}},d=j=>{try{w(y.throw(j))}catch(c){o(c)}},w=j=>j.done?h(j.value):Promise.resolve(j.value).then(u,d);w((y=y.apply(T,P)).next())});let W,R={};for(let T=self;T;T=Object.getPrototypeOf(T))for(let P of Object.getOwnPropertyNames(T))P in R||Object.defineProperty(R,P,{get:()=>self[P]});(()=>{let T=()=>{let h=new Error("not implemented");return h.code="ENOSYS",h};if(!R.fs){let h="";R.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1,O_DIRECTORY:-1},writeSync(o,u){h+=y.decode(u);let d=h.lastIndexOf(`
`);return d!=-1&&(console.log(h.substring(0,d)),h=h.substring(d+1)),u.length},write(o,u,d,w,j,c){if(d!==0||w!==u.length||j!==null){c(T());return}let g=this.writeSync(o,u);c(null,g)},chmod(o,u,d){d(T())},chown(o,u,d,w){w(T())},close(o,u){u(T())},fchmod(o,u,d){d(T())},fchown(o,u,d,w){w(T())},fstat(o,u){u(T())},fsync(o,u){u(null)},ftruncate(o,u,d){d(T())},lchown(o,u,d,w){w(T())},link(o,u,d){d(T())},lstat(o,u){u(T())},mkdir(o,u,d){d(T())},open(o,u,d,w){w(T())},read(o,u,d,w,j,c){c(T())},readdir(o,u){u(T())},readlink(o,u){u(T())},rename(o,u,d){d(T())},rmdir(o,u){u(T())},stat(o,u){u(T())},symlink(o,u,d){d(T())},truncate(o,u,d){d(T())},unlink(o,u){u(T())},utimes(o,u,d,w){w(T())}}}if(R.process||(R.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw T()},pid:-1,ppid:-1,umask(){throw T()},cwd(){throw T()},chdir(){throw T()}}),R.path||(R.path={resolve(...h){return h.join("/")}}),!R.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!R.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!R.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!R.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");let P=new TextEncoder("utf-8"),y=new TextDecoder("utf-8");R.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=n=>{n!==0&&console.warn("exit code:",n)},this._exitPromise=new Promise(n=>{this._resolveExitPromise=n}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;let h=(n,l)=>{this.mem.setUint32(n+0,l,!0),this.mem.setUint32(n+4,Math.floor(l/4294967296),!0)},o=(n,l)=>{this.mem.setUint32(n+0,l,!0)},u=n=>{let l=this.mem.getUint32(n+0,!0),v=this.mem.getInt32(n+4,!0);return l+v*4294967296},d=n=>{let l=this.mem.getFloat64(n,!0);if(l===0)return;if(!isNaN(l))return l;let v=this.mem.getUint32(n,!0);return this._values[v]},w=(n,l)=>{if(typeof l=="number"&&l!==0){if(isNaN(l)){this.mem.setUint32(n+4,2146959360,!0),this.mem.setUint32(n,0,!0);return}this.mem.setFloat64(n,l,!0);return}if(l===void 0){this.mem.setFloat64(n,0,!0);return}let A=this._ids.get(l);A===void 0&&(A=this._idPool.pop(),A===void 0&&(A=this._values.length),this._values[A]=l,this._goRefCounts[A]=0,this._ids.set(l,A)),this._goRefCounts[A]++;let D=0;switch(typeof l){case"object":l!==null&&(D=1);break;case"string":D=2;break;case"symbol":D=3;break;case"function":D=4;break}this.mem.setUint32(n+4,2146959360|D,!0),this.mem.setUint32(n,A,!0)},j=n=>{let l=u(n+0),v=u(n+8);return new Uint8Array(this._inst.exports.mem.buffer,l,v)},c=n=>{let l=u(n+0),v=u(n+8),A=new Array(v);for(let D=0;D<v;D++)A[D]=d(l+D*8);return A},g=n=>{let l=u(n+0),v=u(n+8);return y.decode(new DataView(this._inst.exports.mem.buffer,l,v))},E=(n,l)=>(this._inst.exports.testExport0(),this._inst.exports.testExport(n,l)),$=Date.now()-performance.now();this.importObject={_gotest:{add:(n,l)=>n+l,callExport:E},gojs:{"runtime.wasmExit":n=>{n>>>=0;let l=this.mem.getInt32(n+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(l)},"runtime.wasmWrite":n=>{n>>>=0;let l=u(n+8),v=u(n+16),A=this.mem.getInt32(n+24,!0);R.fs.writeSync(l,new Uint8Array(this._inst.exports.mem.buffer,v,A))},"runtime.resetMemoryDataView":n=>{n>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":n=>{n>>>=0,h(n+8,($+performance.now())*1e6)},"runtime.walltime":n=>{n>>>=0;let l=new Date().getTime();h(n+8,l/1e3),this.mem.setInt32(n+16,l%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":n=>{n>>>=0;let l=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(l,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(l);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},u(n+8))),this.mem.setInt32(n+16,l,!0)},"runtime.clearTimeoutEvent":n=>{n>>>=0;let l=this.mem.getInt32(n+8,!0);clearTimeout(this._scheduledTimeouts.get(l)),this._scheduledTimeouts.delete(l)},"runtime.getRandomData":n=>{n>>>=0,crypto.getRandomValues(j(n+8))},"syscall/js.finalizeRef":n=>{n>>>=0;let l=this.mem.getUint32(n+8,!0);if(this._goRefCounts[l]--,this._goRefCounts[l]===0){let v=this._values[l];this._values[l]=null,this._ids.delete(v),this._idPool.push(l)}},"syscall/js.stringVal":n=>{n>>>=0,w(n+24,g(n+8))},"syscall/js.valueGet":n=>{n>>>=0;let l=Reflect.get(d(n+8),g(n+16));n=this._inst.exports.getsp()>>>0,w(n+32,l)},"syscall/js.valueSet":n=>{n>>>=0,Reflect.set(d(n+8),g(n+16),d(n+32))},"syscall/js.valueDelete":n=>{n>>>=0,Reflect.deleteProperty(d(n+8),g(n+16))},"syscall/js.valueIndex":n=>{n>>>=0,w(n+24,Reflect.get(d(n+8),u(n+16)))},"syscall/js.valueSetIndex":n=>{n>>>=0,Reflect.set(d(n+8),u(n+16),d(n+24))},"syscall/js.valueCall":n=>{n>>>=0;try{let l=d(n+8),v=Reflect.get(l,g(n+16)),A=c(n+32),D=Reflect.apply(v,l,A);n=this._inst.exports.getsp()>>>0,w(n+56,D),this.mem.setUint8(n+64,1)}catch(l){n=this._inst.exports.getsp()>>>0,w(n+56,l),this.mem.setUint8(n+64,0)}},"syscall/js.valueInvoke":n=>{n>>>=0;try{let l=d(n+8),v=c(n+16),A=Reflect.apply(l,void 0,v);n=this._inst.exports.getsp()>>>0,w(n+40,A),this.mem.setUint8(n+48,1)}catch(l){n=this._inst.exports.getsp()>>>0,w(n+40,l),this.mem.setUint8(n+48,0)}},"syscall/js.valueNew":n=>{n>>>=0;try{let l=d(n+8),v=c(n+16),A=Reflect.construct(l,v);n=this._inst.exports.getsp()>>>0,w(n+40,A),this.mem.setUint8(n+48,1)}catch(l){n=this._inst.exports.getsp()>>>0,w(n+40,l),this.mem.setUint8(n+48,0)}},"syscall/js.valueLength":n=>{n>>>=0,h(n+16,parseInt(d(n+8).length))},"syscall/js.valuePrepareString":n=>{n>>>=0;let l=P.encode(String(d(n+8)));w(n+16,l),h(n+24,l.length)},"syscall/js.valueLoadString":n=>{n>>>=0;let l=d(n+8);j(n+16).set(l)},"syscall/js.valueInstanceOf":n=>{n>>>=0,this.mem.setUint8(n+24,d(n+8)instanceof d(n+16)?1:0)},"syscall/js.copyBytesToGo":n=>{n>>>=0;let l=j(n+8),v=d(n+32);if(!(v instanceof Uint8Array||v instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}let A=v.subarray(0,l.length);l.set(A),h(n+40,A.length),this.mem.setUint8(n+48,1)},"syscall/js.copyBytesToJS":n=>{n>>>=0;let l=d(n+8),v=j(n+16);if(!(l instanceof Uint8Array||l instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}let A=v.subarray(0,l.length);l.set(A),h(n+40,A.length),this.mem.setUint8(n+48,1)},debug:n=>{console.log(n)}}}}run(h){return L(this,null,function*(){if(!(h instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=h,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,R,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[R,5],[this,6]]),this._idPool=[],this.exited=!1;let o=4096,u=E=>{let $=o,n=P.encode(E+"\0");return new Uint8Array(this.mem.buffer,o,n.length).set(n),o+=n.length,o%8!==0&&(o+=8-o%8),$},d=this.argv.length,w=[];this.argv.forEach(E=>{w.push(u(E))}),w.push(0),Object.keys(this.env).sort().forEach(E=>{w.push(u(`${E}=${this.env[E]}`))}),w.push(0);let c=o;if(w.forEach(E=>{this.mem.setUint32(o,E,!0),this.mem.setUint32(o+4,0,!0),o+=8}),o>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(d,c),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(h){let o=this;return function(){let u={id:h,this:this,args:arguments};return o._pendingEvent=u,o._resume(),u.result}}}})(),W=({data:T})=>{let P=new TextDecoder,y=R.fs,h="";y.writeSync=(j,c)=>{if(j===1)N(c);else if(j===2){h+=P.decode(c);let g=h.split(`
`);g.length>1&&console.log(g.slice(0,-1).join(`
`)),h=g[g.length-1]}else throw new Error("Bad write");return c.length};let o=[],u,d=0;W=({data:j})=>(j.length>0&&(o.push(j),u&&u()),w),y.read=(j,c,g,E,$,n)=>{if(j!==0||g!==0||E!==c.length||$!==null)throw new Error("Bad read");if(o.length===0){u=()=>y.read(j,c,g,E,$,n);return}let l=o[0],v=Math.max(0,Math.min(E,l.length-d));c.set(l.subarray(d,d+v),g),d+=v,d===l.length&&(o.shift(),d=0),n(null,v)};let w=new R.Go;return w.argv=["","--service=0.28.2"],H(T,w).then(j=>{N(null),w.run(j)},j=>{N(j)}),w};function H(T,P){return L(this,null,function*(){if(T instanceof WebAssembly.Module)return WebAssembly.instantiate(T,P.importObject);let y=yield fetch(T);if(!y.ok)throw new Error(`Failed to download ${JSON.stringify(T)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(y.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(y,P.importObject)).instance;let h=yield y.arrayBuffer();return(yield WebAssembly.instantiate(h,P.importObject)).instance})}return T=>W(T)})(N=>a.onmessage({data:N})),M;a={onmessage:null,postMessage:N=>setTimeout(()=>{try{M=_({data:N})}catch(L){p(L)}}),terminate(){if(M)for(let N of M._scheduledTimeouts.values())clearTimeout(N)}}}let f,x,i=new Promise((_,M)=>{f=_,x=M});a.onmessage=({data:_})=>{a.onmessage=({data:M})=>b(M),_?x(_):f()},a.postMessage(t||new URL(e,location.href).toString());let{readFromStdout:b,service:k}=vt({writeToStdin(_){a.postMessage(_)},isSync:!1,hasFS:!1,esbuild:Ae});yield i,Ne=()=>{a.terminate(),ve=void 0,Ne=void 0,Ie=void 0},Ie={build:_=>new Promise((M,N)=>{m.then(N),k.buildOrContext({callName:"build",refs:null,options:_,isTTY:!1,defaultWD:"/",callback:(L,W)=>L?N(L):M(W)})}),context:_=>new Promise((M,N)=>{m.then(N),k.buildOrContext({callName:"context",refs:null,options:_,isTTY:!1,defaultWD:"/",callback:(L,W)=>L?N(L):M(W)})}),transform:(_,M)=>new Promise((N,L)=>{m.then(L),k.transform({callName:"transform",refs:null,input:_,options:M||{},isTTY:!1,fs:{readFile(W,R){R(new Error("Internal error"),null)},writeFile(W,R){R(null)}},callback:(W,R)=>W?L(W):N(R)})}),formatMessages:(_,M)=>new Promise((N,L)=>{m.then(L),k.formatMessages({callName:"formatMessages",refs:null,messages:_,options:M,callback:(W,R)=>W?L(W):N(R)})}),analyzeMetafile:(_,M)=>new Promise((N,L)=>{m.then(L),k.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof _=="string"?_:JSON.stringify(_),options:M,callback:(W,R)=>W?L(W):N(R)})})}}),Ft=Ae})(typeof Fe=="object"?Fe:{set exports(V){(typeof self<"u"?self:this).esbuild=V}})});var De=Yt(rt(),1);function st(V,z,Y){let G=Y.startsWith("@/")?(V["src/main.tsx"]!==void 0?"src/":"")+Y.slice(2):Y.startsWith(".")?z.slice(0,z.lastIndexOf("/")+1)+Y:Y,I=[];for(let J of G.split("/"))if(J===".."){if(!I.length)return;I.pop()}else J!=="."&&J&&I.push(J);G=I.join("/");for(let J of[G,...[".tsx",".ts",".jsx",".js",".json",".css"].map(Q=>G+Q),...[".tsx",".ts",".jsx",".js"].map(Q=>G+"/index"+Q)])if(V[J]!==void 0)return J}function it(V){let z={};try{z=JSON.parse(V.files["package.json"]||"{}").dependencies||{}}catch{throw new Error("Fix package.json: it must be valid JSON.")}return{name:"sukoaa-project",setup(Y){Y.onResolve({filter:/.*/},G=>{let I=G.path;if(I==="react-native"&&V.files["sukoaa.native.json"])return{path:I,namespace:"sukoaa-builtins"};if(["react","react-dom","react-dom/client","react/jsx-runtime","react/jsx-dev-runtime"].includes(I))return{path:I,namespace:"sukoaa-builtins"};if(I.startsWith(".")||I.startsWith("@/")||G.kind==="entry-point"){let ee=st(V.files,G.importer,I);return ee?{path:ee,namespace:"sukoaa-project"}:{errors:[{text:"Cannot find "+I+". Check the file name and import path."}]}}let J=I.split("/"),Q=I.startsWith("@")?J.slice(0,2).join("/"):J[0],ge=J.slice(I.startsWith("@")?2:1).join("/");return Q==="next"||I.startsWith("node:")?{errors:[{text:"This import needs the Node runtime. React Fast preview cannot run Next.js or Node built-ins."}]}:!/^(?:@[\w.-]+\/)?[\w.-]+$/.test(Q)||!/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(z[Q]||"")?{errors:[{text:`Add an exact version for \u201C${Q}\u201D in package.json dependencies (for example 1.2.3), or use Node runtime for npm version ranges.`}]}:ge.split("/").some(ee=>ee===".."||!/^[-\w.]*$/.test(ee))?{errors:[{text:"Unsupported package subpath."}]}:{path:`https://esm.sh/${Q}@${z[Q]}${ge?"/"+ge:""}?bundle&external=react,react-dom`,external:!0}}),Y.onLoad({filter:/.*/,namespace:"sukoaa-builtins"},G=>({contents:G.path==="react-native"?"module.exports=globalThis.ReactNativeWeb;":G.path==="react"?"module.exports=globalThis.React;":G.path.startsWith("react-dom")?"module.exports=globalThis.ReactDOM;":"module.exports={Fragment:globalThis.React.Fragment,jsx:(type,props,key)=>globalThis.React.createElement(type,{...props,key}),jsxs:(type,props,key)=>globalThis.React.createElement(type,{...props,key}),jsxDEV:(type,props,key)=>globalThis.React.createElement(type,{...props,key})};",loader:"js"})),Y.onLoad({filter:/.*/,namespace:"sukoaa-project"},G=>{let I=G.path.split(".").pop()?.toLowerCase(),J=I==="tsx"?"tsx":I==="ts"?"ts":I==="jsx"?"jsx":I==="json"?"json":I==="css"?"css":I==="svg"?"dataurl":"js";return{contents:V.files[G.path],loader:J}})}}}var ot={bundle:!0,write:!1,format:"esm",platform:"browser",target:"es2020",sourcemap:"external",sourcesContent:!0,outfile:"/out/project.js",jsx:"automatic",define:{"process.env.NODE_ENV":'"development"'},logLevel:"silent"};var Xt="0.12.0";function Kt(V){return V+"?v="+Xt}async function lt(V,z,Y){let G=await fetch(Kt(V),{cache:"no-store",signal:Y});if(!G.ok)throw new Error(`${V} returned HTTP ${G.status}. Run npm run prepare:runtimes in the Sukoaa platform folder, restart the app, then reload.`);if(z==="script"){let Q=await G.text();if(!/javascript|ecmascript/.test(G.headers.get("content-type")||"")||/^\s*</.test(Q))throw new Error(`${V} did not return JavaScript. Check your host's static-file routing and sign-in redirects.`);return Q}let I=await G.arrayBuffer(),J=new Uint8Array(I,0,Math.min(4,I.byteLength));if(J.length!==4||J.some((Q,ge)=>Q!==[0,97,115,109][ge]))throw new Error(`${V} is not a WebAssembly file. Regenerate the runtime assets and check static-file routing.`);return I}var Le,at=Promise.resolve();function ct(V,z){let Y=at.catch(()=>{}).then(async()=>{z?.throwIfAborted(),Le??=lt("/runtime/studio/esbuild.wasm","wasm").then(J=>WebAssembly.compile(J)).then(J=>De.initialize({wasmModule:J,worker:!1})).catch(J=>{throw Le=void 0,J}),await Le,z?.throwIfAborted();let G=await De.build({...ot,entryPoints:[V.entry],plugins:[it(V)]});z?.throwIfAborted();let I=G.outputFiles||[];return{code:I.find(J=>J.path.endsWith(".js"))?.text||"",css:I.find(J=>J.path.endsWith(".css"))?.text||"",map:I.find(J=>J.path.endsWith(".js.map"))?.text}});return at=Y,Y}window.sukoaaFallbackBundle=ct;})();
