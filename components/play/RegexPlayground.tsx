'use client';
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {Copy,Play,Square} from 'lucide-react';
import {regexInput,type RegexMatch} from '@/lib/play/regex-input';
import './regex-playground.css';
const examples=[
 {name:'Email addresses',pattern:'[\\w.+-]+@[\\w.-]+\\.[a-z]{2,}',flags:'gi',text:'Contact learner@example.com or hello@example.org.'},
 {name:'Numbers',pattern:'\\b\\d+(?:\\.\\d+)?\\b',flags:'g',text:'Order 12 has 3 items and costs 45.50 dollars.'},
 {name:'Named groups',pattern:'(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})',flags:'g',text:'Created 2026-11-19. Due 2026-12-01.'},
 {name:'Line anchors',pattern:'^TODO: (.+)$',flags:'gm',text:'Notes\nTODO: Test the form\nDone: Add labels\nTODO: Review the output'}
];
const flagLabels:Record<string,string>={g:'All matches',i:'Ignore case',m:'Line anchors',s:'Dot matches newline',u:'Unicode'};
export function RegexPlayground(){
 const [pattern,setPattern]=useState(examples[0].pattern),[flags,setFlags]=useState('gi'),[text,setText]=useState(examples[0].text);
 const [matches,setMatches]=useState<RegexMatch[]|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState('Ready to test.'),[truncated,setTruncated]=useState(false);
 const active=useRef<{worker:Worker;timer:ReturnType<typeof setTimeout>}|null>(null),generation=useRef(0);
 function dispose(){const job=active.current;if(job){job.worker.terminate();clearTimeout(job.timer);active.current=null;}}
 useEffect(()=>()=>{generation.current++;const job=active.current;if(job){job.worker.terminate();clearTimeout(job.timer);}},[]);
 function changed(){dispose();generation.current++;setBusy(false);setMatches(null);setError('');setTruncated(false);setStatus('Inputs changed. Test the expression to update results.');}
 function run(){
  dispose();const id=++generation.current;setBusy(false);setMatches(null);setError('');setTruncated(false);
  try{
   const input=regexInput(pattern,flags);setPattern(input.pattern);setFlags(input.flags);
   if(text.length>20000)throw new Error('Keep the test text at 20,000 characters or fewer.');
   const worker=new Worker('/play/regex-worker.js');
   const finish=()=>{if(id!==generation.current)return false;dispose();setBusy(false);return true;};
   const timeout=(message:string)=>{if(finish()){setError(message);setStatus('Test stopped. Edit the pattern and try again.');}};
   active.current={worker,timer:setTimeout(()=>timeout('The regex worker could not start within 5 seconds. Reload and try again.'),5000)};
   setBusy(true);setStatus('Testing expression…');
   worker.onerror=()=>{if(finish())setError('The regex worker could not load. Reload this page and try again.');};
   worker.onmessage=event=>{
    if(id!==generation.current)return;
    if(event.data.started){clearTimeout(active.current!.timer);active.current!.timer=setTimeout(()=>timeout('Stopped after 1 second. This pattern is too expensive for the playground.'),1000);return;}
    if(!finish())return;
    if(event.data.error){setError(event.data.error);setStatus('Expression could not be tested.');return;}
    const result=event.data.matches as RegexMatch[];setMatches(result);setTruncated(!!event.data.truncated);setStatus(result.length?`${result.length} ${result.length===1?'match':'matches'}${event.data.truncated?' · first 200 shown':''}.`:'No matches. Check the pattern, flags and test text.');
   };
   worker.postMessage({...input,text,protocol:2});
  }catch(e){dispose();setBusy(false);setError(e instanceof Error?e.message:String(e));setStatus('Expression could not be tested.');}
 }
 function highlighted(){if(!matches?.length)return text||'Enter test text to see matches here.';const parts:ReactNode[]=[];let at=0;matches.forEach((m,i)=>{parts.push(text.slice(at,m.index));parts.push(<mark key={i} className={m.text?'':'rx-zero'} title={`Match ${i+1} at index ${m.index}${m.text?'':' (zero-width)'}`}>{m.text}</mark>);at=m.index+m.text.length;});parts.push(text.slice(at));return parts;}
 return <div className="rx"><header className="rx-heading"><div><h1>Regex Playground</h1><p>Test JavaScript regular expressions. Inspect matches, positions and capture groups in your browser.</p></div><a href="/tools">All tools</a></header>
 <section className="rx-pattern" aria-label="Expression controls"><div className="rx-fields"><label>Pattern<input spellCheck={false} autoCapitalize="off" autoComplete="off" value={pattern} maxLength={520} onChange={e=>{changed();setPattern(e.target.value);}} placeholder="Pattern or /pattern/flags"/></label><label>Flags<input spellCheck={false} autoCapitalize="off" autoComplete="off" value={flags} maxLength={8} onChange={e=>{changed();setFlags(e.target.value);}}/></label>{busy?<button className="rx-primary" onClick={()=>{generation.current++;dispose();setBusy(false);setStatus('Test stopped.');}}><Square size={16}/>Stop test</button>:<button className="rx-primary" onClick={run}><Play size={16}/>Test expression</button>}</div>
 <div className="rx-flags" role="group" aria-label="Common regex flags">{Object.entries(flagLabels).map(([flag,label])=><button key={flag} aria-pressed={flags.includes(flag)} aria-label={flag+': '+label} title={label} onClick={()=>{changed();setFlags(v=>v.includes(flag)?v.replace(flag,''):v+flag);}}><code>{flag}</code><span>{label}</span></button>)}</div><p className="rx-help">Paste a bare pattern or a JavaScript literal such as <code>/hello/gi</code>. Literal flags replace the flags field.</p></section>
 <div className="rx-examples"><span>Examples</span>{examples.map(example=><button key={example.name} onClick={()=>{changed();setPattern(example.pattern);setFlags(example.flags);setText(example.text);}}>{example.name}</button>)}</div>
 {error&&<p className="rx-error" role="alert">{error}</p>}<p className="rx-status" role="status" aria-live="polite">{status}</p>
 <div className="rx-panels"><section><div className="rx-panel-heading"><h2>Test text</h2><span>{text.length.toLocaleString()} / 20,000 characters</span></div><textarea aria-label="Test text" spellCheck={false} value={text} maxLength={20000} onChange={e=>{changed();setText(e.target.value);}}/><p className="rx-help">Change the text, then select Test expression.</p></section><section><div className="rx-panel-heading"><h2>Highlighted matches</h2><span>{matches===null?'Not tested':`${matches.length} matches`}</span></div><pre className="rx-highlight">{matches===null?'Run the expression to see highlighted matches.':highlighted()}</pre><p className="rx-help">A vertical marker indicates a zero-width match.</p></section></div>
 <section className="rx-results"><div className="rx-panel-heading"><h2>Matches and capture groups</h2><button disabled={!matches?.length} onClick={()=>void navigator.clipboard.writeText(JSON.stringify(matches,null,2)).then(()=>setStatus('Matches copied as JSON.')).catch(()=>setStatus('Clipboard unavailable. Select and copy the match text manually.'))}><Copy size={16}/>Copy JSON</button></div>{matches===null?<p>Test an expression to inspect its results.</p>:matches.length===0?<p>No matches found.</p>:<ol>{matches.map((m,i)=>{const before=text.slice(0,m.index),line=before.split('\n').length,column=before.length-before.lastIndexOf('\n');return <li key={i}><div className="rx-match-title"><strong>Match {i+1}</strong><span>Index {m.index} · line {line}, column {column}</span></div><pre>{m.text||'(zero-width match)'}</pre>{(m.groups.length>0||Object.keys(m.named).length>0)&&<details open><summary>Capture groups ({m.groups.length})</summary><dl>{m.groups.map((group,n)=><div key={n}><dt>Group {n+1}</dt><dd><code>{group===null?'(not matched)':JSON.stringify(group)}</code></dd></div>)}{Object.entries(m.named).map(([name,value])=><div key={name}><dt>{name}</dt><dd><code>{value===null?'(not matched)':JSON.stringify(value)}</code></dd></div>)}</dl></details>}</li>;})}</ol>}{truncated&&<p>Only the first 200 matches are displayed.</p>}</section>
 <section className="rx-guide"><h2>How to use this playground</h2><p>Enter a pattern and test text, choose the flags you need, then select Test expression. Use parentheses to capture parts of a match. Named groups use <code>(?&lt;name&gt;…)</code>.</p><p><code>g</code> finds all matches; <code>i</code> ignores case; <code>m</code> enables line anchors; <code>s</code> lets dot match newlines; <code>u</code> enables Unicode mode.</p><h3>Limits and privacy</h3><p>This uses your browser’s JavaScript RegExp engine, not PCRE. Supported syntax depends on the browser. Testing runs in a separate worker with a one-second execution limit, a 500-character pattern limit and a 200-match result limit. Indices and columns count UTF-16 code units; line and column numbers start at 1. Inputs are not uploaded or saved automatically.</p><a href="/tools/text-compare">Compare text</a> · <a href="/tools/json-studio">Open JSON Studio</a></section></div>;
}
