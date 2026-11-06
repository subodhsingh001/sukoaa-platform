import {mkdir,copyFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
await mkdir('public/runtime',{recursive:true});
await copyFile(require.resolve('typescript/lib/typescript.js'),'public/runtime/typescript.js');
await copyFile(require.resolve('typescript/LICENSE.txt'),'public/runtime/typescript-LICENSE.txt');
// Use the pinned Vite dependency's esbuild. Also available in the portable package.
let esbuild;
try { esbuild=require('esbuild'); } catch { esbuild=createRequire(require.resolve('vite/package.json'))('esbuild'); }
const {build}=esbuild;
await build({stdin:{contents:'import * as React from "react"; import {createRoot} from "react-dom/client"; import * as ReactDom from "react-dom"; window.React=React; window.ReactDOM={...ReactDom,createRoot};',resolveDir:process.cwd(),sourcefile:'react-runtime-entry.js',loader:'js'},bundle:true,format:'iife',platform:'browser',minify:true,define:{'process.env.NODE_ENV':'"production"'},outfile:'public/runtime/react.js',legalComments:'eof'});
await writeFile('public/runtime/README.txt','Generated from the installed, lockfile-pinned TypeScript and React packages. Run npm run prepare:runtimes after installation. React MIT and TypeScript Apache-2.0 terms apply; see THIRD-PARTY-NOTICES.md.\n');
console.log('Prepared local TypeScript and React runtime assets.');

// Local multi-file bundler and editor. No editor/React CDN is needed.
await mkdir('public/runtime/studio',{recursive:true});
await copyFile(require.resolve('esbuild-wasm/esbuild.wasm'),'public/runtime/studio/esbuild.wasm');
await build({entryPoints:['lib/studio/bundle-worker.ts'],bundle:true,format:'iife',platform:'browser',outfile:'public/runtime/studio/bundle-worker.js',minify:true,legalComments:'eof'});
await build({stdin:{contents:"import {fallbackBundle} from './lib/studio/fallback-bundler';window.sukoaaFallbackBundle=fallbackBundle;",resolveDir:process.cwd(),loader:'js'},bundle:true,format:'iife',platform:'browser',outfile:'public/runtime/studio/fallback-bundler.js',minify:true,legalComments:'eof'});
await mkdir('public/runtime/monaco',{recursive:true});
await build({stdin:{contents:`import * as monaco from 'monaco-editor/editor/editor.main.js';
import * as monacoTS from 'monaco-editor/language/typescript/monaco.contribution.js';
import 'monaco-editor/languages/definitions/typescript/register.js';
import 'monaco-editor/languages/definitions/javascript/register.js';
import 'monaco-editor/languages/definitions/css/register.js';
import 'monaco-editor/languages/definitions/html/register.js';
import 'monaco-editor/languages/definitions/markdown/register.js';
import 'monaco-editor/languages/definitions/python/register.js';
import 'monaco-editor/languages/definitions/go/register.js';
import 'monaco-editor/languages/definitions/sql/register.js';
import 'monaco-editor/language/css/monaco.contribution.js';
import 'monaco-editor/language/html/monaco.contribution.js';
import 'monaco-editor/language/json/monaco.contribution.js';
self.MonacoEnvironment={getWorkerUrl:(_module,label)=>'/runtime/monaco/'+(['typescript','javascript'].includes(label)?'ts':['css','scss','less'].includes(label)?'css':label==='html'?'html':label==='json'?'json':'editor')+'.worker.js'};
window.sukoaaMonaco=monaco;window.sukoaaMonacoTS=monacoTS;`,resolveDir:process.cwd(),loader:'js'},bundle:true,format:'iife',platform:'browser',outfile:'public/runtime/monaco/editor.js',loader:{'.ttf':'file'},minify:true,legalComments:'eof'});
for(const [name,entry] of Object.entries({ts:'language/typescript/ts.worker.js',css:'language/css/css.worker.js',html:'language/html/html.worker.js',json:'language/json/json.worker.js',editor:'editor/editor.worker.js'})){
 await build({entryPoints:[require.resolve('monaco-editor/'+entry)],bundle:true,format:'iife',platform:'browser',outfile:'public/runtime/monaco/'+name+'.worker.js',minify:true,legalComments:'eof'});
}
const {readFile}=await import('node:fs/promises');
const {dirname,join}=await import('node:path');
const types={};
for(const file of ['index.d.ts','global.d.ts','jsx-runtime.d.ts','jsx-dev-runtime.d.ts'])types['file:///node_modules/@types/react/'+file]=await readFile(join(dirname(require.resolve('@types/react/package.json')),file),'utf8');
for(const file of ['index.d.ts','client.d.ts'])types['file:///node_modules/@types/react-dom/'+file]=await readFile(join(dirname(require.resolve('@types/react-dom/package.json')),file),'utf8');
const reactRequire=createRequire(require.resolve('@types/react/package.json'));
types['file:///node_modules/csstype/index.d.ts']=await readFile(reactRequire.resolve('csstype/index.d.ts'),'utf8');
await writeFile('public/runtime/monaco/react-types.json',JSON.stringify(types));
console.log('Prepared Studio bundler, Monaco editor and local language workers.');

// Pinned browser Python runtime. No CDN, remote execution key or account needed.
const pythonRoot=dirname(require.resolve('pyodide/package.json'));
await mkdir('public/runtime/python',{recursive:true});
for(const file of ['pyodide.mjs','pyodide.asm.mjs','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json'])await copyFile(join(pythonRoot,file),join('public/runtime/python',file));
await build({entryPoints:['lib/platform/python-entry.mjs'],bundle:true,format:'iife',platform:'browser',target:'es2022',outfile:'public/runtime/python/runner.js',minify:true,legalComments:'eof',banner:{js:'/* Sukoaa Python bundled worker v5 */\nself.importScripts = () => { throw new Error("Script imports are disabled in this self-contained worker."); };'},define:{'import.meta.url':JSON.stringify('https://runtime.invalid/pyodide.asm.mjs')},external:['node:*']});
console.log('Prepared local Pyodide 314.0.7 runtime.');

await mkdir('public/runtime/sql',{recursive:true});
await copyFile(require.resolve('sql.js/dist/sql-wasm-inline.js'),'public/runtime/sql/sql-wasm-inline.js');
await copyFile(join(dirname(require.resolve('sql.js/dist/sql-wasm-inline.js')),'..','LICENSE'),'public/runtime/sql/LICENSE.txt');
console.log('Prepared local SQLite SQL runtime.');

await copyFile(join(dirname(require.resolve('jsonc-parser/package.json')),'LICENSE.md'),'public/runtime/jsonc-parser-LICENSE.txt');

await import('./prepare-python-packages.mjs');
