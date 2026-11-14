export type ProjectKind='react'|'nextjs';
export type StudioProject={version:1;id:string;name:string;kind:ProjectKind;files:Record<string,string>;folders:string[];entry:string};
export type StudioIssue={message:string;file?:string;line?:number;column?:number;source?:string};
export type ConsoleEntry={id:string;level:string;text:string;time:string};
export type NetworkEntry={id:string;method:string;url:string;status:number;duration:number;mode:'mock'|'live'|'blocked';error?:string};
export const MAX_FILES=150,MAX_BYTES=1_000_000;
export function projectId(){return 'p-'+Array.from(crypto.getRandomValues(new Uint32Array(3)),n=>n.toString(16)).join('')}
export function filePath(value:string){
 if(!value||value.length>180||value.startsWith('/')||value.includes('\\')||value.includes(':')||/[?#%<>|]/.test(value)||/[\x00-\x1f]/.test(value))throw new Error('Use a relative project path, for example src/components/Card.tsx.');
 const parts=value.split('/');if(parts.some(p=>!p||p==='.'||p==='..'||p.trim()!==p))throw new Error('Paths cannot contain empty segments, . or ...');
 if(parts.some(p=>['node_modules','.git','.next','.next-dev','.angular','out-tsc','dist','__proto__'].includes(p)||(/^\.env(?:\.|$)/.test(p)&&p!=='.env.example')||/\.(pem|key|p12|pfx)$/i.test(p)))throw new Error('Dependencies, build folders and secret files are excluded. Use .env.example without real secrets.');
 return value;
}
export function validateProject(value:unknown):StudioProject{
 if(!value||typeof value!=='object')throw new Error('Invalid project.');const p=value as StudioProject;
 if(p.version!==1||!['react','nextjs'].includes(p.kind)||typeof p.name!=='string'||!p.files||typeof p.files!=='object'||Array.isArray(p.files))throw new Error('Unsupported project document.');
 const entries=Object.entries(p.files);if(!entries.length||entries.length>MAX_FILES)throw new Error(`Projects support 1–${MAX_FILES} files.`);
 let size=0;const files:Record<string,string>={};for(const [path,source]of entries){filePath(path);if(typeof source!=='string'||source.length>200000)throw new Error('Use text source files under 200 KB each.');size+=new TextEncoder().encode(source).length;files[path]=source}if(size>MAX_BYTES)throw new Error('Keep this browser project under 1 MB.');
 const folders=Array.isArray(p.folders)?p.folders.filter(x=>typeof x==='string').map(filePath):[];
 const entry=typeof p.entry==='string'?filePath(p.entry):p.kind==='react'?'src/main.tsx':'app/page.tsx';
 const allDirs=new Set(folders);for(const path of Object.keys(files)){let dir=path.slice(0,path.lastIndexOf('/'));if(!path.includes('/'))continue;while(dir){allDirs.add(dir);dir=dir.includes('/')?dir.slice(0,dir.lastIndexOf('/')):''}}
 for(const dir of allDirs)if(files[dir]!==undefined)throw new Error('A file and folder cannot have the same path: '+dir);
 return {...p,version:1,id:typeof p.id==='string'&&/^[a-zA-Z0-9-]+$/.test(p.id)?p.id:projectId(),name:p.name.slice(0,100)||'Untitled project',files,folders:[...allDirs].sort(),entry};
}
export function resolveFile(files:Record<string,string>,importer:string,specifier:string){
 let path=specifier.startsWith('@/')?(files['src/main.tsx']!==undefined?'src/':'')+specifier.slice(2):specifier.startsWith('.')?importer.slice(0,importer.lastIndexOf('/')+1)+specifier:specifier;
 const parts:string[]=[];for(const part of path.split('/')){if(part==='..'){if(!parts.length)return undefined;parts.pop()}else if(part!=='.'&&part)parts.push(part)}path=parts.join('/');
 for(const candidate of [path,...['.tsx','.ts','.jsx','.js','.json','.css'].map(e=>path+e),...['.tsx','.ts','.jsx','.js'].map(e=>path+'/index'+e)])if(files[candidate]!==undefined)return candidate;
}
export function relativeImport(importer:string,target:string){const a=importer.split('/').slice(0,-1),b=target.split('/');while(a[0]===b[0]&&a.length&&b.length){a.shift();b.shift()}const result=[...a.map(()=>'..'),...b].join('/');return result.startsWith('.')?result:'./'+result}
export function renameProjectPath(project:StudioProject,from:string,to:string){
 filePath(to);if(from===to)return project;if(to.startsWith(from+'/'))throw new Error('A folder cannot be moved inside itself.');
 const move=(path:string)=>path===from?to:path.startsWith(from+'/')?to+path.slice(from.length):path;
 const existing=new Set([...Object.keys(project.files),...project.folders]);for(const old of existing){const next=move(old);if(next!==old&&existing.has(next)&&move(next)===next)throw new Error('That destination already exists.');}
 const files:Record<string,string>={};for(const [old,source]of Object.entries(project.files)){const next=move(old);files[next]=/\.(?:[cm]?[jt]sx?)$/.test(old)?source.replace(/((?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s*)["'])([^"']+)(["'])/g,(all,prefix,spec,suffix)=>{
  if(!spec.startsWith('.')&&!spec.startsWith('@/'))return all;const resolved=resolveFile(project.files,old,spec);if(!resolved)return all;const target=move(resolved);if(next===old&&target===resolved)return all;let relative=relativeImport(next,target);if(!/\.[a-zA-Z]+$/.test(spec))relative=relative.replace(/\.(tsx?|jsx?)$/,'');return prefix+relative+suffix;
 }):source}
 return validateProject({...project,files,folders:project.folders.map(move),entry:move(project.entry)});
}
export function deleteProjectPath(project:StudioProject,path:string){const matches=(p:string)=>p===path||p.startsWith(path+'/');const files=Object.fromEntries(Object.entries(project.files).filter(([p])=>!matches(p)));if(!Object.keys(files).length)throw new Error('Keep at least one file in your project.');return validateProject({...project,files,folders:project.folders.filter(p=>!matches(p))})}
export function redactUrl(value:string){try{const u=new URL(value,'https://project.local');for(const key of [...u.searchParams.keys()])if(/key|token|secret|password|auth|code/i.test(key))u.searchParams.set(key,'[redacted]');u.username='';u.password='';return value.startsWith('/')?u.pathname+u.search:u.toString()}catch{return value.slice(0,500)}}
export function template(kind:ProjectKind,router:'pages'|'app'='pages'):StudioProject{
 const css='*{box-sizing:border-box}body{margin:0;background:#f4f6ef;color:#243e32;font-family:system-ui}main{max-width:760px;margin:auto;padding:60px 28px}.eyebrow{font-size:11px;letter-spacing:2px;color:#819568}h1{font-size:48px;letter-spacing:-2px;line-height:1.1}p{color:#7b8c70;line-height:1.8}.card{background:white;border:1px solid #dfe7d4;border-radius:18px;padding:24px;margin:24px 0}button{cursor:pointer;border:0;border-radius:8px;background:#294b35;color:white;padding:12px 18px;margin-right:9px}button.secondary{background:#e2ebd3;color:#426133}pre{white-space:pre-wrap;font-size:12px;color:#4d7040}.status{font-size:12px;margin-top:15px}';
 const files:Record<string,string>=kind==='react'?{
  'package.json':JSON.stringify({name:'sukoaa-react-project',version:'1.0.0',private:true,type:'module',scripts:{dev:'vite --host 0.0.0.0',build:'vite build'},dependencies:{react:'19.2.6','react-dom':'19.2.6'},devDependencies:{vite:'8.0.13',typescript:'5.9.3','@types/react':'19.2.14','@types/react-dom':'19.2.3'}},null,2),
  'postcss.config.mjs':'export default { plugins: {} };\n',
  'index.html':'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
  'src/main.tsx':'import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\nimport "./styles.css";\n\ncreateRoot(document.getElementById("root")!).render(<App />);\n',
  'src/App.tsx':'import React, { useState } from "react";\nimport Counter from "./components/Counter";\nimport { getGreeting } from "./lib/api";\n\nexport default function App() {\n  const [result, setResult] = useState("No requests yet.");\n  async function load() {\n    console.log("Loading your greeting…");\n    try {\n      const data = await getGreeting();\n      setResult(JSON.stringify(data, null, 2));\n      console.info("Greeting received", data);\n    } catch (error) {\n      console.error(error);\n    }\n  }\n  return <main>\n    <p className="eyebrow">YOUR NEXT IDEA STARTS HERE</p>\n    <h1>One project.<br/>A world of possibilities.</h1>\n    <p>This is a real multi-file React project. Edit a component, import a helper, and see what happens.</p>\n    <Counter />\n    <section className="card">\n      <h2>Meet your API inspector.</h2>\n      <button onClick={load}>Call /api/hello</button>\n      <pre>{result}</pre>\n      <p className="status">Fast preview uses the clearly labeled mock in sukoaa.mock.json. The Network panel shows each request.</p>\n    </section>\n  </main>;\n}\n',
  'src/components/Counter.tsx':'import React, { useState } from "react";\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return <section className="card">\n    <h2>A little interaction.</h2>\n    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>\n    <button className="secondary" onClick={() => setCount(0)}>Reset</button>\n  </section>;\n}\n',
  'src/lib/api.ts':'export async function getGreeting() {\n  const response = await fetch("/api/hello");\n  if (!response.ok) throw new Error("Request failed: " + response.status);\n  return response.json();\n}\n',
  'src/styles.css':css,
  'sukoaa.mock.json':JSON.stringify({'GET /api/hello':{status:200,delay:350,body:{message:'Hello from your Sukoaa mock API!',source:'local mock',next:'Edit this response in sukoaa.mock.json'}}},null,2),
  'README.md':'# My Sukoaa React project\n\nEdit files and press Run. Relative imports, CSS and JSON are bundled locally. React is preloaded. Add pinned browser npm dependencies in package.json to load them from esm.sh (requires internet).\n\nFor the normal Vite project on your computer: npm install, then npm run dev. The /api/hello route in Fast preview is a mock from sukoaa.mock.json; Vite alone does not implement that server route.\n',
  'tsconfig.json':JSON.stringify({compilerOptions:{jsx:'react-jsx',module:'ESNext',moduleResolution:'Bundler',target:'ES2020',allowSyntheticDefaultImports:true,esModuleInterop:true,skipLibCheck:true}},null,2)
 }:{
  'package.json':JSON.stringify({name:'sukoaa-nextjs-project',version:'1.0.0',private:true,scripts:{dev:'next dev --webpack --hostname 0.0.0.0',build:'next build --webpack',start:'next start --hostname 0.0.0.0'},dependencies:{next:'16.3.4',react:'19.2.6','react-dom':'19.2.6'},devDependencies:{typescript:'5.9.3','@types/node':'22.19.19','@types/react':'19.2.14','@types/react-dom':'19.2.3'}},null,2),
  'app/layout.tsx':'import "./globals.css";\nexport default function RootLayout({children}:{children:React.ReactNode}) {\n  return <html lang="en"><body>{children}</body></html>;\n}\n',
  'app/page.tsx':'import Counter from "../components/Counter";\nimport ApiCard from "../components/ApiCard";\n\nexport default function Home() {\n  return <main>\n    <p className="eyebrow">A REAL NEXT.JS PROJECT</p>\n    <h1>Build something<br/>worth opening.</h1>\n    <p>App Router, imported components, styles, and an actual route handler. Start the Node runtime to run this project.</p>\n    <Counter />\n    <ApiCard />\n  </main>;\n}\n',
  'components/Counter.tsx':'"use client";\nimport { useState } from "react";\nexport default function Counter(){\n  const [count,setCount]=useState(0);\n  return <section className="card"><h2>Your first component.</h2><button onClick={()=>setCount(count+1)}>Clicked {count} times</button></section>;\n}\n',
  'components/ApiCard.tsx':'"use client";\nimport { useState } from "react";\nexport default function ApiCard(){\n  const [result,setResult]=useState("Click to call your real Next.js route.");\n  async function load(){\n    console.log("Calling /api/hello");\n    const response=await fetch("/api/hello");\n    const data=await response.json();\n    setResult(JSON.stringify(data,null,2));\n    console.log("API response",data);\n  }\n  return <section className="card"><h2>An actual API route.</h2><button onClick={load}>Call /api/hello</button><pre>{result}</pre></section>;\n}\n',
  'app/api/hello/route.ts':'export async function GET(){\n  console.log("GET /api/hello handled by Next.js");\n  return Response.json({message:"Hello from your Next.js route!",server:true,time:new Date().toISOString()});\n}\n',
  'app/globals.css':css,
  'next.config.mjs':"export default { distDir:process.env.NODE_ENV==='development'?'.next-dev':'.next', typescript:{tsconfigPath:process.env.NODE_ENV==='production'?'tsconfig.build.json':'tsconfig.json'}, experimental: { useWasmBinary: true }, turbopack: { root: process.cwd() }, outputFileTracingRoot: process.cwd() };\n",
  'postcss.config.mjs':'export default { plugins: {} };\n',
  'tsconfig.json':JSON.stringify({compilerOptions:{target:'ES2017',lib:['dom','dom.iterable','esnext'],allowJs:true,skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'react-jsx',plugins:[{name:'next'}]},include:['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts'],exclude:['node_modules']},null,2),
  'tsconfig.build.json':JSON.stringify({extends:'./tsconfig.json',compilerOptions:{incremental:false},include:['types/next-production.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts'],exclude:['node_modules','next-env.d.ts','.next/dev','.next-dev']},null,2),
  'types/next-production.d.ts':'/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',
  'README.md':'# My Sukoaa Next.js project\n\nStart Node runtime inside Sukoaa to install packages and run next dev. Requires HTTPS/localhost, cross-origin isolation, a supported browser, and internet. WebContainer commercial production usage requires an eligible license.\n\nOr export the project ZIP and run locally: npm install, npm run dev, then open http://localhost:3000.\n\nThis is real Next.js; React Fast preview is not used to emulate server rendering.\n'
 };
 if(kind==='nextjs'&&router==='pages'){
  files['pages/index.tsx']='import Counter from "../components/Counter";\nimport ApiCard from "../components/ApiCard";\n\nexport default function Home(){\n return <main><p className="eyebrow">A REAL NEXT.JS PROJECT</p><h1>Build something<br/>worth opening.</h1><p>Files, imports, styles, and a real API route. This browser starter uses the Pages Router.</p><Counter/><ApiCard/></main>;\n}\n';
  files['pages/_app.tsx']='import "../styles/globals.css";\nimport type {AppProps} from "next/app";\nexport default function App({Component,pageProps}:AppProps){return <Component {...pageProps}/>;}\n';
  files['pages/api/hello.ts']='import type {NextApiRequest,NextApiResponse} from "next";\nexport default function handler(_req:NextApiRequest,res:NextApiResponse){\n console.log("GET /api/hello handled by Next.js");\n res.status(200).json({message:"Hello from your Next.js route!",server:true,time:new Date().toISOString()});\n}\n';
  files['styles/globals.css']=css;
  for(const path of Object.keys(files))if(path.startsWith('app/'))delete files[path];
  files['README.md']+="\nThe browser starter uses the real Next.js Pages Router to avoid the App Router request-context incompatibility reported in browser Node runtimes. Imported App Router projects are preserved; use native Node locally for full App Router behavior.\n";
 }
 return validateProject({version:1,id:projectId(),name:kind==='react'?'My React project':'My Next.js project',kind,files,folders:[],entry:kind==='react'?'src/main.tsx':router==='pages'?'pages/index.tsx':'app/page.tsx'});
}

export function projectMainFile(project:StudioProject){return ['src/app/app.ts','src/app/app.component.ts','App.tsx','App.js','src/App.tsx','app/page.tsx','src/app/page.tsx','pages/index.tsx','pages/index.jsx','pages/index.js','src/pages/index.tsx',project.entry].find(path=>project.files[path]!==undefined)||Object.keys(project.files)[0]}
export function isAppRouter(project:StudioProject){return project.kind==='nextjs'&&Object.keys(project.files).some(path=>/^(?:src\/)?app\/(?:.*\/)?page\.[jt]sx?$/.test(path))}
export function issueKey(issue:StudioIssue){return issue.file&&issue.line?[issue.file,issue.line,issue.column||1].join(':'):issue.message.replace(/^(?:Uncaught(?: \(in promise\))?\s+)?(?:[A-Za-z]*Error:\s*)+/,'')}
