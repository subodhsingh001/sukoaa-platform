import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='public/runtime/python/';
const lock=JSON.parse(await readFile(root+'pyodide-lock.json','utf8'));
const names=['requests','urllib3','certifi','idna','charset-normalizer'];
await mkdir(root+'packages',{recursive:true});
const manifest=[];
for(const name of names){
 const p=lock.packages[name];if(!p||!p.file_name.endsWith('-py3-none-any.whl'))throw new Error('Expected a pinned pure-Python wheel: '+name);
 const path=root+'packages/'+p.file_name;let bytes;try{bytes=await readFile(path)}catch{}
 if(!bytes||createHash('sha256').update(bytes).digest('hex')!==p.sha256){const response=await fetch('https://cdn.jsdelivr.net/pyodide/v314.0.7/full/'+p.file_name,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw new Error('Python package download failed: '+name+' '+response.status);bytes=Buffer.from(await response.arrayBuffer());if(createHash('sha256').update(bytes).digest('hex')!==p.sha256)throw new Error('Python package integrity mismatch: '+name);await writeFile(path,bytes)}
 manifest.push({name,filename:p.file_name,version:p.version,sha256:p.sha256});
}
await writeFile(root+'packages/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared and verified '+manifest.length+' pinned Python packages.');
