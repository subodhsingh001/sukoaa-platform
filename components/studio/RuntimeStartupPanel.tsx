'use client';
type Props={phase:string;seconds:number;output:string;error?:string;onLogs:()=>void;onStop:()=>void;onRetry:()=>void;onReload:()=>void;onExport:()=>void};
export function RuntimeStartupPanel({phase,seconds,output,error,onLogs,onStop,onRetry,onReload,onExport}:Props){
 return <section className={'runtime-startup-panel'+(error?' failed':'')} aria-label="Project runtime startup">
  <p className="product-eyebrow">{error?'STARTUP NEEDS ATTENTION':'STARTING YOUR PROJECT'}</p>
  <h2 role={error?'alert':'status'} aria-live="polite">{error||phase||'Preparing project'}</h2>
  {!error&&<p>{seconds}s elapsed · The first setup downloads packages. Further runs in this tab reuse them.</p>}
  <p>{error?'Your source files are safe. Inspect the terminal, retry, or export the project.':'After startup, Run updates your existing server without reinstalling packages.'}</p>
  <pre aria-label="Latest runtime output">{output.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g,'').slice(-1800)||'Waiting for the browser runtime to respond…'}</pre>
  {!error&&seconds>=30&&<p className="runtime-slow-note">This setup is taking longer than a quick practice session should. You can keep editing, stop setup, or export and run locally.</p>}
  <div>{!error&&seconds>=30&&<button onClick={onExport}>Export project</button>}<button onClick={onLogs}>Show terminal</button>{error?<><button onClick={onRetry}>Retry startup</button><button onClick={onReload}>Save draft &amp; reload</button><button onClick={onExport}>Export project</button></>:<button onClick={onStop}>Stop startup</button>}</div>
 </section>;
}
