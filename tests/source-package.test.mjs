import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';
test('incomplete source reports the missing practice file before a framework build',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'sukoaa-source-'));
 try{await mkdir(join(dir,'lib/marketing'),{recursive:true});await writeFile(join(dir,'lib/marketing/site.ts'),"import {practiceHubPaths} from './practice-hubs';");
 const result=spawnSync(process.execPath,[new URL('../scripts/check-source.mjs',import.meta.url).pathname],{cwd:dir,encoding:'utf8'});
 assert.equal(result.status,1);assert.match(result.stderr,/practice-hubs/);assert.match(result.stderr,/FULL release ZIP/);
 }finally{await rm(dir,{recursive:true,force:true})}
});
