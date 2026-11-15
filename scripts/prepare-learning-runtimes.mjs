import {createRequire} from 'node:module';import {dirname,join} from 'node:path';import {mkdir,copyFile,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);let esbuild;try{esbuild=require('esbuild')}catch{esbuild=createRequire(require.resolve('vite/package.json'))('esbuild')}
const base='public/runtime/learning';await mkdir(base+'/postgres',{recursive:true});const pg=dirname(require.resolve('@electric-sql/pglite'));
for(const name of ['pglite.wasm','initdb.wasm','pglite.data'])await copyFile(join(pg,name),base+'/postgres/'+name);
await esbuild.build({entryPoints:['lib/learning/postgres-worker.ts'],bundle:true,format:'esm',platform:'browser',external:['node:*'],outfile:base+'/postgres-worker.js',minify:true,legalComments:'eof'});
await copyFile(require.resolve('@tailwindcss/browser'),base+'/tailwind-browser.js');
for(const [pkg,label] of [['@electric-sql/pglite','pglite'],['@tailwindcss/browser','tailwind']]){const dir=dirname(require.resolve(pkg));try{await copyFile(join(dir,'../LICENSE'),base+'/'+label+'-LICENSE.txt')}catch{await copyFile(join(dir,'../LICENSE.md'),base+'/'+label+'-LICENSE.txt')}}
await writeFile(base+'/README.txt','Learning-only assets: PGlite 0.5.15 (Apache-2.0 with bundled PostgreSQL notices) and Tailwind browser 4.2.1 (MIT). Browser engine assets load only when a lab is opened and Run is chosen. See bundled licences and THIRD-PARTY-NOTICES.md.\n');
console.log('Prepared separate PostgreSQL and Tailwind learning runtimes.');

await copyFile('lib/learning/POSTGRESQL-LICENSE.txt',base+'/postgresql-LICENSE.txt');

await import('./prepare-api-runtimes.mjs');
