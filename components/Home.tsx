'use client';
import {workbenchTools} from '@/lib/workbench/catalog';
import {learningModules} from '@/lib/learning/modules';
import {useAccount} from '@/components/AccountSession';
import {isPubliclyReady} from '@/lib/marketing/availability';
import {toolLandingHref} from '@/lib/marketing/tool-links';
import {SiteHeader} from '@/components/layout/SiteHeader';
import {SiteFooter} from '@/components/layout/SiteFooter';
import './home-extra.css';
import {useState,useEffect} from 'react';
import {Search,Globe,Code2,Puzzle,Bookmark,ChevronDown,Play,FileCode2,Terminal,BookOpen,FileText,Atom,FileJson,Regex,Diff,Workflow} from 'lucide-react';
const tools=[
 ...workbenchTools.map(t=>({href:'/tools/'+t.slug,name:t.name,category:t.group,desc:t.description,icon:'{}',color:'green',status:'Available',tags:['No AI','Local files']})),
 {href:'/tools/tool-schema-generator',name:'Tool Schema Generator',category:'Code',desc:'Draft and edit AI tool schemas locally. Review unclear inputs, validate arguments and export JSON for your API.',icon:'{ƒ}',color:'green',status:'Available',tags:['JSON Schema','No AI calls','Local']},
 {href:'/tools/portal-ready',name:'Portal Photo & PDF Fixer',category:'Documents',desc:'Crop, resize and compress photos or signatures, create an A4 PDF, and keep an exam checklist on your device.',icon:'PDF',color:'green',status:'Available',tags:['Photos','PDF','Local']},
 {href:'/tools/json-to-typescript',name:'Types Studio',category:'Code',desc:'Turn JSON into TypeScript interfaces, type aliases and Zod schemas. Merge arrays, infer optional fields and keep your data local.',icon:'TS',color:'purple',status:'Available',tags:['JSON to TS','Zod','No upload']},
 {href:'/interview-prep',name:'Interview Preparation',category:'Code',desc:'Study GenAI and Frontend interview questions, review reference answers and rehearse project explanations.',icon:'interview',color:'green',status:'Available',tags:['GenAI','Frontend']},
 {href:'/play',name:'Play & Learn',category:'Code',desc:'Predict output, order code, find bugs and solve practical CSS, SQL and API challenges. Guest progress stays on your device.',icon:'play',color:'green',status:'Available',tags:['Games','Learning']},
 {href:'/demo-api',name:'Sukoaa Demo API',category:'Code',desc:'Fictional users, products and posts for prototypes. Try pagination, error scenarios and simulated writes.',icon:'API',color:'green',status:'Available',tags:['REST','Fake data','Docs']},
 {href:'/tools/json-studio',name:'JSON Studio',category:'Code',desc:'Format, validate and compare JSON locally. Explore nested values and copy their paths.',icon:'{}',color:'green',status:'Available',tags:['JSON','Compare','Local']},
 {href:'/tools/regex',name:'Regex Playground',category:'Code',desc:'Test expressions, highlight matches and inspect capture groups in a bounded browser worker.',icon:'.*',color:'green',status:'Available',tags:['Regex','Text','Local']},
 {href:'/tools/text-compare',name:'Text Compare',category:'Write',desc:'Compare text line by line with additions, removals and optional whitespace handling.',icon:'±',color:'green',status:'Available',tags:['Diff','Text','Local']},
 {href:'/tools/notepad',name:'Online Notepad',category:'Write',desc:'Write, organize and recover notes. Local autosave, Markdown preview, snapshots and portable backups without sign-in.',icon:'N',color:'green',status:'Available',tags:['Notes','Markdown','Local autosave']},
 {href:'/studio?framework=angular',name:'Angular Project Studio',category:'Code',desc:'Build Angular 22 projects with templates, modules, signals, npm libraries and live preview. Browser runtime requirements apply.',icon:'A',color:'pink',status:'Available',tags:['Angular 22','CLI','Files']},
 {"href": "/workspace?language=c", "name": "C Compiler", "category": "Code", "desc": "Write C with standard-library imports, input and error locations. Execution requires runner setup and sign-in.", "icon": "C", "color": "blue", "status": "Needs runner", "tags": ["C", "Isolated runner", "Sign-in"]},
 {"href": "/workspace?language=cpp", "name": "C++ Compiler", "category": "Code", "desc": "Write C++ with standard-library imports, input and error locations. Execution requires runner setup and sign-in.", "icon": "C++", "color": "blue", "status": "Needs runner", "tags": ["C++", "Isolated runner", "Sign-in"]},
 {"href": "/workspace?language=rust", "name": "Rust Compiler", "category": "Code", "desc": "Write Rust with standard-library imports, input and error locations. Execution requires runner setup and sign-in.", "icon": "Rs", "color": "blue", "status": "Needs runner", "tags": ["Rust", "Isolated runner", "Sign-in"]},
 {"href": "/workspace?language=csharp", "name": "C# Compiler", "category": "Code", "desc": "Write C# with standard-library imports, input and error locations. Execution requires runner setup and sign-in.", "icon": "C#", "color": "blue", "status": "Needs runner", "tags": ["C#", "Isolated runner", "Sign-in"]},
 {"href": "/workspace?language=java", "name": "Java Compiler", "category": "Code", "desc": "Write Java with standard-library imports, input and error locations. Execution requires runner setup and sign-in.", "icon": "Jv", "color": "blue", "status": "Needs runner", "tags": ["Java", "Isolated runner", "Sign-in"]},

 {href:'/native',name:'React Native Playground',category:'Code',desc:'Edit React Native files and run a local web preview. Optional Expo mode supports phone testing.',icon:'RN',color:'blue',status:'Available',tags:['React Native','Web preview','TSX']},
 {href:'/workspace?language=python',name:'Python Playground',category:'Code',desc:'Run Python in your browser with standard input, console output and error locations. No account or local installation needed.',icon:'Py',color:'blue',status:'Available',tags:['Python','Browser runtime','No setup']},
 {href:'/workspace?language=sql',name:'SQL Playground',category:'Code',desc:'Create tables, run SQLite queries and explore results locally. No database server or sign-in needed.',icon:'terminal',color:'blue',status:'Available',tags:['SQLite','SQL','No setup']},
 {href:'/workspace?language=json',name:'JSON Validator',category:'Code',desc:'Validate JSON, locate syntax errors and read a neatly formatted result in your browser.',icon:'</>',color:'purple',status:'Available',tags:['JSON','Formatting','No setup']},
 {href:'/workspace?language=javascript',name:'JavaScript Playground',category:'Code',desc:'Run JavaScript in an isolated browser worker. Read console output and jump to error locations.',icon:'JS',color:'yellow',status:'Available',tags:['JavaScript','No setup']},
 {href:'/workspace?language=html',name:'HTML & CSS Studio',category:'Code',desc:'Edit HTML and CSS and inspect the result in a side-by-side browser preview.',icon:'</>',color:'orange',status:'Available',tags:['HTML','CSS','Live preview']},
 {href:'/browser',name:'Sukoaa Browser',category:'Browse',desc:'Check Sukoaa Browser release availability and installation requirements.',icon:'browser',color:'green',status:'In development',tags:['Desktop','Mobile']},
 {href:'/extensions/web-pdf-studio',name:'Web PDF Studio',category:'Extensions',desc:'Select web content and edit its layout before exporting a PDF.',icon:'pdf',color:'pink',status:'Planned',tags:['PDF','Productivity']},
 {href:'/extensions/quick-replies',name:'Quick Replies',category:'Extensions',desc:'Store reusable text snippets for replies and form fields.',icon:'reply',color:'purple',status:'Planned',tags:['Snippets','Everyday']},
 {href:'/studio?framework=react',name:'React Project Studio',category:'Code',desc:'Build React projects with files, folders, imports, preview and console.',icon:'react',color:'blue',status:'Available',tags:['React','TSX','Files']},
 {href:'/studio?framework=nextjs',name:'Next.js Project Studio',category:'Code',desc:'Try a Next.js project with a browser Node runtime and terminal. Runtime requirements apply.',icon:'N',color:'green',status:'Available',tags:['Next.js','Node','Files']},
 {href:'/workspace?language=typescript',name:'TypeScript Playground',category:'Code',desc:'Transpile TypeScript and inspect console output with source error locations.',icon:'TS',color:'blue',status:'Available',tags:['TypeScript','Console']}
].filter(tool=>isPubliclyReady(toolLandingHref(tool.href)));
const displayOrder=['JavaScript Playground','Python Playground','HTML & CSS Studio','React Project Studio','Angular Project Studio','Next.js Project Studio','React Native Playground','TypeScript Playground','SQL Playground','JSON Validator','C Compiler','C++ Compiler','Rust Compiler','C# Compiler','Java Compiler'];
tools.sort((a,b)=>(displayOrder.includes(a.name)?displayOrder.indexOf(a.name):99)-(displayOrder.includes(b.name)?displayOrder.indexOf(b.name):99));
type HomeStats = {activities: number; interviewQuestions: number};
function ToolIcon({name}: {name: string}) {
 const Icon = ({browser:Globe,pdf:FileText,reply:Puzzle,terminal:Terminal,interview:BookOpen,play:Play,react:Atom,'{}':FileJson,'</>':Code2,'.*':Regex,'±':Diff,'{ƒ}':Workflow} as Record<string,typeof Code2>)[name] || FileCode2;
 return <Icon size={22} aria-hidden="true"/>;
}
export default function Home({stats}: {stats: HomeStats}){
 const {user,loading:accountLoading}=useAccount();
 const [category,setCategory]=useState('All tools'),[query,setQuery]=useState(''),[saved,setSaved]=useState<string[]>([]),[onlySaved,setOnlySaved]=useState(false),[faq,setFaq]=useState<number|null>(0);
 useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem('sukoaa-favorites')||'[]'))}catch{}},[]);
 function favorite(name:string){const next=saved.includes(name)?saved.filter(x=>x!==name):[...saved,name];setSaved(next);localStorage.setItem('sukoaa-favorites',JSON.stringify(next))}
 const homeTools=tools.map(tool=>tool.name==='Interview Preparation'?{...tool,desc:`Study ${stats.interviewQuestions} GenAI and Frontend questions, review reference answers and rehearse project explanations.`,tags:[...tool.tags,`${stats.interviewQuestions} questions`]}:tool.name==='Play & Learn'?{...tool,tags:[...tool.tags,`${stats.activities} activities`]}:tool);
 const filtered=homeTools.filter(t=>(category==='All tools'||t.category===category)&&(!onlySaved||saved.includes(t.name))&&(t.name+' '+t.desc+' '+t.tags.join(' ')).toLowerCase().includes(query.toLowerCase()));
 return <>
 <SiteHeader/>
 <main id="main-content" tabIndex={-1} className="home-page">
  <section className="home-intro" aria-labelledby="home-title">
   <h1 id="home-title">Online coding tools. Learn by running real examples.</h1>
   <p>Run JavaScript and Python, build React interfaces, and practise with explained examples. Browser playgrounds work without an account; check each tool’s runtime requirements.</p>
   <a className="home-primary" href="/workspace?language=javascript">Open JavaScript compiler</a>
   {!accountLoading && user && <p className="home-session">You’re signed in. <a href="/workspace?language=javascript">Open your workspace</a>.</p>}
  </section>
  <section id="tools" className="home-directory" aria-labelledby="home-tools-title">
   <div className="home-section-heading"><h2 id="home-tools-title">Tools</h2><a href="/tools">All tool guides</a></div>
   <div className="home-filters">
    <div className="home-categories" role="group" aria-label="Filter tools by category">{['All tools','Code','Data','Images','Write','Documents','Browse','Extensions'].map(c=><button aria-pressed={category===c} onClick={()=>setCategory(c)} key={c}>{c}{c==='All tools'&&<span className="home-count">{homeTools.length}</span>}</button>)}</div>
    <div className="home-search-row"><div className="home-search" role="search"><Search size={18} aria-hidden="true"/><input aria-label="Search tools" placeholder="Search tools" value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="home-saved-filter" aria-label="Show saved tools" title="Show saved tools" aria-pressed={onlySaved} onClick={()=>setOnlySaved(!onlySaved)}><Bookmark size={18} aria-hidden="true"/>Saved</button></div>
   </div>
   <p className="home-results" role="status">{filtered.length} {filtered.length===1?'tool':'tools'}{onlySaved?' in your saved list':''}{category!=='All tools'?` in ${category}`:''}{query?` matching “${query}”`:''}</p>
   <div className="home-tool-grid">{filtered.map(t=><article className="home-tool-card" key={t.name}>
    <div className="home-card-heading"><span className="home-tool-icon"><ToolIcon name={t.icon}/></span>{t.status!=='Available'&&<span className="home-status">{t.status}</span>}<button className="home-save-tool" aria-label={(saved.includes(t.name)?'Unsave ':'Save ')+t.name} aria-pressed={saved.includes(t.name)} onClick={()=>favorite(t.name)}><Bookmark size={18} fill={saved.includes(t.name)?'currentColor':'none'} aria-hidden="true"/></button></div>
    <h3><a href={toolLandingHref(t.href)}>{t.name}</a></h3><p>{t.desc}</p>
    <ul className="home-tool-tags" aria-label={`${t.name} details`}>{t.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>
    <a className="home-tool-launch" aria-label={'Open '+t.name} href={toolLandingHref(t.href)}>Open {t.name}</a>
   </article>)}</div>
   {filtered.length===0&&<div className="home-empty"><h3>No tools found</h3><p>Change your search or reset the filters.</p><button className="home-secondary" onClick={()=>{setQuery('');setOnlySaved(false);setCategory('All tools')}}>Reset filters</button></div>}
   <p className="home-directory-note">Saved tools stay in this browser. <a href="#roadmap">Check runtime requirements</a> before opening a project studio.</p>
  </section>
  <section className="home-section" id="learning-tracks" aria-labelledby="home-learning-title">
   <div className="home-section-heading"><h2 id="home-learning-title">Backend and database practice</h2><a href="/play">All Play &amp; Learn activities</a></div>
   <p>{learningModules.length} technology tracks include exercises and browser labs. Download a local starter when you need external services or custom packages.</p>
   <div className="home-learning-grid">{learningModules.map(m=><article key={m.id}><div className="home-learning-title"><h3><a href={m.lab}>{m.name}</a></h3>{m.id==='nodejs'&&<span className="home-status">Experimental</span>}</div><p>{m.description}</p><div className="home-learning-actions"><a href={m.lab}>Open {m.name} compiler</a><a href={'/play/tracks/'+m.id}>{m.name} exercises</a></div></article>)}</div>
  </section>
  <section className="home-section home-example" aria-labelledby="home-example-title">
   <div><h2 id="home-example-title">Run a JavaScript example</h2><p>This function returns a string and prints it to the console. Open the compiler to edit and run the code.</p><a href="/workspace?language=javascript">Open JavaScript compiler</a></div>
   <div><pre aria-label="JavaScript example"><code>{`function makeSomething() {\n  return 'Something wonderful.';\n}\n\nconsole.log(makeSomething());`}</code></pre><p className="home-example-output">Console output: <code>Something wonderful.</code></p></div>
  </section>
  <section id="why" className="home-section" aria-labelledby="home-how-title">
   <h2 id="home-how-title">How Sukoaa works</h2>
   <dl className="home-facts"><div><dt>Execute code</dt><dd>Browser playgrounds run supported code in workers or isolated previews. Project studios have their own runtime requirements.</dd></div><div><dt>Save your work</dt><dd>Use Save local or export a file before leaving an editor. Cloud projects require sign-in and a configured deployment.</dd></div><div><dt>Choose external access</dt><dd>Some tools download runtime packages or contact external APIs when you enable the relevant action. <a href="/privacy">Read the privacy policy</a> for these data flows.</dd></div></dl>
  </section>
  <section id="more" className="home-section" aria-labelledby="home-more-title">
   <h2 id="home-more-title">Backend, database and AI learning tools</h2><p>Use the matching lab or utility to inspect a query, request or model prompt. Each page explains its supported features and limits.</p>
   <div className="home-resource-grid">{[['/learn/system-design','System design tutorials','Study 25 concepts with narrated animations, worked examples and interview practice.'],['/labs/php','PHP online compiler','Run PHP 8.3 with includes and request testing.'],['/labs/laravel','Laravel playground','Test supported routes, JSON responses and validation without Composer.'],['/labs/postgresql','PostgreSQL compiler','Run PostgreSQL queries with PGlite in a disposable browser database.'],['/labs/tailwindcss','Tailwind CSS playground','Compile CSS utilities and inspect responsive previews.'],['/labs/fastapi','FastAPI playground','Test supported Python APIs and validation errors.'],['/tools/rag-playground','RAG playground','Inspect chunking, embeddings, retrieval and the final prompt.'],['/tools/token-counter','LLM token counter','Count tokens with supported GPT encodings and estimate cost.'],['/demo-api','Free demo API','Test REST, GraphQL and simulated streaming chat responses.']].map(([href,title,description])=><article key={href}><h3><a href={href}>{title}</a></h3><p>{description}</p></article>)}</div>
  </section>
  <section id="roadmap" className="home-section" aria-labelledby="home-requirements-title">
   <h2 id="home-requirements-title">Runtime requirements and project status</h2>
   <div className="home-table-scroll" role="region" aria-label="Runtime requirements" tabIndex={0}><table className="home-runtime-table"><thead><tr><th scope="col">Environment</th><th scope="col">What to expect</th></tr></thead><tbody>
    <tr><th scope="row">Browser playgrounds</th><td>JavaScript, TypeScript, Python, HTML/CSS, SQL and JSON work without sign-in. PHP, Laravel, PostgreSQL, Tailwind CSS and FastAPI have dedicated labs with stated compatibility limits.</td></tr>
    <tr><th scope="row">Project Studio</th><td>React and React Native Web support multi-file projects and local previews. Angular and Next.js download project packages and need a compatible browser Node runtime.</td></tr>
    <tr><th scope="row">Remote compilers</th><td>C, C++, Java, C#, Rust and Go execution requires a configured isolated runner and sign-in. Read the language page before using it.</td></tr>
    <tr><th scope="row">AI learning tools</th><td>Token counting and RAG retrieval run in your browser. Embedding mode downloads a model; optional generation uses an external provider and your API key. Hosted platform AI agents are unavailable. The optional Gemini wording feature is restricted to explicitly enabled local development.</td></tr>
    <tr><th scope="row">Browser and extensions</th><td>Check <a href="/downloads">Downloads</a> for published packages and checksums, or visit the <a href="/extensions">extension pages</a> for store availability.</td></tr>
   </tbody></table></div>
  </section>
  <section className="home-section home-faq" aria-labelledby="home-faq-title">
   <h2 id="home-faq-title">Frequently asked questions</h2>
   <div>{[{q:'Can I use Sukoaa without an account?',a:'Yes. Browser-local JavaScript, TypeScript, Python, HTML/CSS, SQL and JSON tools work without an account. Local notes, Portal-Ready, practice and learning activities also work without sign-in. Cloud saves and configured remote execution require an account; individual studios have runtime requirements.'},{q:'Which coding tools work today?',a:'Quick snippets run in the playground. Project Studio adds multi-file React and Next.js projects, imports, preview and debugging. React Fast runs locally; Next.js needs its browser Node runtime prerequisites. Python runs locally in the browser without sign-in. Remote languages require configured execution and sign-in.'},{q:'Where can I download the browser and extensions?',a:'Open Downloads for published application packages and checksums. Extension pages link to Chrome Web Store when a listing is connected; otherwise they show their current availability.'},{q:'Will my code be saved?',a:'Use Save local to keep a draft on this device, or export your source file. Cloud project saving requires sign-in and availability on this deployment. Unsaved changes can be lost when you leave.'}].map((item,i)=><article key={item.q}><h3><button aria-expanded={faq===i} aria-controls={'home-faq-'+i} onClick={()=>setFaq(faq===i?null:i)}>{item.q}<ChevronDown size={18} aria-hidden="true" style={{transform:faq===i?'rotate(180deg)':''}}/></button></h3><p id={'home-faq-'+i} hidden={faq!==i}>{item.a}</p></article>)}</div>
  </section>
  <section className="home-section home-practice" aria-labelledby="home-practice-title">
   <h2 id="home-practice-title">Online compilers and coding practice.</h2><p>Run JavaScript or Python online, try HTML/CSS previews, or explore React projects. Practise arrays, Python dictionaries, typed functions and SQL queries with examples and expected output.</p>
   <p><a href="/practice">Explore practice exercises</a></p>
   <nav aria-label="Coding tool guides">{[['/interview-prep','GenAI & Frontend interview preparation'],['/tools/python','Run Python online'],['/tools/javascript','JavaScript console playground'],['/tools/typescript','TypeScript playground'],['/tools/sql','Practise SQLite queries'],['/tools/json','Validate JSON'],['/tools/html-css','HTML and CSS live preview'],['/tools/react','React project playground'],['/tools/react-native','React Native web preview'],['/tools','Browse all coding tools']].map(([href,label])=><a key={href} href={href}>{label}</a>)}</nav>
   <p className="home-back-link"><a href="#tools">Back to tools</a></p>
  </section>
 </main><SiteFooter/>

 </>
}
