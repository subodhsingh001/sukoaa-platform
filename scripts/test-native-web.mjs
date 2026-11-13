import {createRequire} from 'node:module';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);let esbuild;try{esbuild=require('esbuild')}catch{esbuild=createRequire(require.resolve('vite/package.json'))('esbuild')}
const dir=await mkdtemp(join(tmpdir(),'sukoaa-native-'));
try{
 await esbuild.build({stdin:{contents:`export {nativeTemplate} from './lib/studio/native';export {projectPlugin,buildOptions} from './lib/studio/bundler';export {resolveFile,projectMainFile} from './lib/studio/project';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'esm',outfile:join(dir,'native.mjs')});
 const {nativeTemplate,projectPlugin,buildOptions,resolveFile,projectMainFile}=await import(join(dir,'native.mjs'));
 for(const starter of ['counter','list']){
  const p=nativeTemplate(starter);assert.equal(projectMainFile(p),'App.tsx');assert.ok(resolveFile(p.files,p.entry,'../App'));
  const result=await esbuild.build({...buildOptions,entryPoints:[p.entry],plugins:[projectPlugin(p)]});
  const code=result.outputFiles.find(f=>f.path.endsWith('.js')).text;
  assert.ok(code.includes('globalThis.ReactNativeWeb'));assert.ok(!/from ["']react-native["']/.test(code));
  // A broken relative import must give the user a file and line rather than a blank preview.
  const broken={...p,files:{...p.files,'App.tsx':"import Missing from './not-here'; export default Missing"}};
  await assert.rejects(()=>esbuild.build({...buildOptions,entryPoints:[broken.entry],plugins:[projectPlugin(broken)]}),e=>e.errors.some(x=>x.location?.file.endsWith('App.tsx')&&x.location.line===1));
  console.log(starter+': multi-file TSX + React Native runtime binding + missing-import error location passed');
 }
}finally{await rm(dir,{recursive:true,force:true})}
