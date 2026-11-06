import {consoleValue,valueSummary,type ConsoleValue} from '@/lib/platform/console-values';
export function ConsoleOutput({text,structured,error}:{text:string;structured:boolean;error:boolean}){
 return <div className={'quick-console'+(error?' console-error':'')} role="log" aria-label="Console output" aria-live="polite">{text.split('\n').map((line,index)=>{const value=structured?consoleValue(line):undefined;return value?<div className="quick-console-row" key={index}><Value value={value} depth={0}/></div>:<pre key={index}>{line||' '}</pre>})}</div>;
}
function Value({value,depth,label}:{value:ConsoleValue;depth:number;label?:string}){
 if(value===null||typeof value!=='object')return <div className="console-property">{label!==undefined&&<span>{label}: </span>}<code>{valueSummary(value)}</code></div>;
 const items=Object.entries(value);
 return <details className="console-value" open={depth===0}><summary>{label!==undefined?label+': ':''}{valueSummary(value)}</summary>{depth>=6?<span className="console-cutoff">Maximum preview depth reached.</span>:<div>{items.slice(0,100).map(([key,item])=><Value key={key} value={item} label={key} depth={depth+1}/>)}{items.length>100&&<span className="console-cutoff">{items.length-100} more items omitted from this preview.</span>}</div>}</details>;
}
