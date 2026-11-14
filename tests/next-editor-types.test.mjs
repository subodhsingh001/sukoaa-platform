import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
test('bundled Next declarations resolve next and next/app without suppressing source type errors',()=>{
 const files=new Map();for(const name of ['react','next'])for(const [uri,text]of Object.entries(JSON.parse(fs.readFileSync(`public/runtime/monaco/${name}-types.json`,'utf8'))))files.set(uri.replace('file://',''),text);
 const entry='/sukoaa-editor-test/pages/_app.tsx';files.set(entry,`import type {NextPage} from 'next'; import type {AppProps} from 'next/app'; const Page:NextPage=()=>null; export default function App({Component,pageProps}:AppProps){return <Component {...pageProps}/>}; const broken:string=42;`);
 const options={target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.NodeJs,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,skipLibCheck:true,noEmit:true,types:[]};
 const host=ts.createCompilerHost(options),read=host.readFile,exists=host.fileExists,dirs=new Set();
 for(const file of files.keys()){let dir=file.slice(0,file.lastIndexOf('/'));while(dir){dirs.add(dir);dir=dir.slice(0,dir.lastIndexOf('/'))}}
 host.readFile=file=>files.get(file)??read(file);host.fileExists=file=>files.has(file)||exists(file);host.directoryExists=dir=>dirs.has(dir)||ts.sys.directoryExists(dir);
 host.getSourceFile=(file,languageVersion)=>{const text=host.readFile(file);return text===undefined?undefined:ts.createSourceFile(file,text,languageVersion,true)};
 const program=ts.createProgram([entry],options,host),diagnostics=ts.getPreEmitDiagnostics(program).filter(d=>d.file?.fileName===entry);
 assert.equal(diagnostics.some(d=>d.code===2307),false,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:f=>f,getNewLine:()=> '\n'}));
 assert.ok(diagnostics.some(d=>d.code===2322),'real source errors must remain visible');
});
