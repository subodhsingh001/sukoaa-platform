import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const root=process.cwd(),missing=[];
const extensions=['','.ts','.tsx','.js','.jsx','.mjs','.json','.css','.d.ts','.mts','.cts','/index.ts','/index.tsx','/index.js'];
function resolves(base){if(/\.[mc]js$/.test(base)&&fs.existsSync(base.slice(0,-2)+'ts'))return true;return extensions.some(ext=>fs.existsSync(base+ext)&&fs.statSync(base+ext).isFile())||(/\.js$/.test(base)&&extensions.slice(1,3).some(ext=>fs.existsSync(base.slice(0,-3)+ext)))}
function walk(dir){if(!fs.existsSync(dir))return;for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue}if(!/\.(?:[cm]?[jt]sx?)$/.test(file))continue;
 const source=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
 function visit(node){let spec;if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))spec=node.moduleSpecifier.text;else if(ts.isCallExpression(node)&&node.expression.kind===ts.SyntaxKind.ImportKeyword&&ts.isStringLiteral(node.arguments[0]))spec=node.arguments[0].text;
 if(spec&&(spec.startsWith('.')||spec.startsWith('@/'))){const base=spec.startsWith('@/')?path.join(root,spec.slice(2)):path.resolve(path.dirname(file),spec);if(!resolves(base))missing.push(path.relative(root,file)+' → '+spec)}ts.forEachChild(node,visit)}visit(source);
}}
for(const dir of ['app','components','lib','hooks','tests'])walk(path.join(root,dir));
for(const file of ['lib/marketing/practice-hubs.ts','lib/marketing/practice-lessons.ts'])if(!fs.existsSync(path.join(root,file)))missing.push(file);
if(missing.length){console.error('Incomplete project source. Extract the FULL release ZIP into a clean folder, then run npm ci --include=dev. Missing:\n'+[...new Set(missing)].join('\n'));process.exitCode=1}else console.log('Source completeness check passed.');
