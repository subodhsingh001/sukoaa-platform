import {pythonHttpWrapper} from './python-http-wrapper.mjs';
// Runs once per worker. The parent uses an opaque-origin iframe, a restrictive
// CSP, and hard termination; this worker never receives session credentials.
export const pythonWrapper = String.raw`
import sys as _sys, io as _io, json as _json, traceback as _traceback

def _sukoaa_run(source, standard_input):
    previous_stdin = _sys.stdin
    _sys.stdin = _io.StringIO(standard_input)
    try:
        exec(compile(source, "main.py", "exec"), {"__name__": "__main__", "__file__": "main.py"})
        return _json.dumps({"ok": True})
    except BaseException as error:
        if isinstance(error, SystemExit) and error.code in (None, 0):
            return _json.dumps({"ok": True})
        frames = [f for f in _traceback.extract_tb(error.__traceback__) if f.filename == "main.py"]
        line = error.lineno if isinstance(error, SyntaxError) else (frames[-1].lineno if frames else None)
        column = error.offset if isinstance(error, SyntaxError) else None
        message = type(error).__name__ + ": " + str(error)
        return _json.dumps({"ok": False, "diagnostic": {"message": message[:2000], "line": line, "column": column, "source": "main.py"}, "traceback": "".join(_traceback.format_exception(type(error), error, error.__traceback__))[-12000:]})
    finally:
        _sys.stdin = previous_stdin
`;

export function installPythonWorker(loadPyodide, createPyodideModule) {
  let started = false, nextRequest=0;const pending=new Map();
  self.sukoaaHttpRequest=(url,method,headers,timeout)=>new Promise(resolve=>{const id=++nextRequest;const timer=setTimeout(()=>{pending.delete(id);resolve(JSON.stringify({ok:false,kind:'timeout',error:'API request timed out.'}))},Math.min(10000,Math.max(1,Number(timeout)||10000)));pending.set(id,{resolve,timer});self.postMessage({httpRequest:{id,url:String(url),method:String(method),headers:String(headers),timeout:Number(timeout)}})});
  self.onmessage = async ({data}) => {
    if(data?.httpResult){const p=pending.get(data.httpResult.id);if(p){clearTimeout(p.timer);pending.delete(data.httpResult.id);p.resolve(JSON.stringify(data.httpResult.result))}return}
    if (started) return;
    started = true;
    const send = self.postMessage.bind(self);
    try {
      if (typeof data.source !== 'string' || data.source.length > 50000 || typeof data.stdin !== 'string' || data.stdin.length > 5000) throw new Error('Source or input exceeds the playground limits.');
      const assets = data.assets;
      // Pyodide's loader expects fetchable filenames. Supply its retained bytes
      // in memory; no request from the untrusted worker reaches the network.
      const base='https://runtime.invalid/';
      self.fetch = async input => {
        const url=typeof input==='string'?input:input.url||String(input);
        if(url===base+'pyodide.asm.wasm')return new Response(assets.wasm,{headers:{'Content-Type':'application/wasm'}});
        if(url===base+'python_stdlib.zip')return new Response(assets.stdlib,{headers:{'Content-Type':'application/zip'}});
        throw new Error('Network access is disabled in the Python playground.');
      };
      let lines = 0, bytes = 0;
      const output = (line) => {
        const text = String(line).slice(0, 2000);
        if (++lines > 200 || (bytes += text.length) > 30000) {
          send({line:'Output limit reached. Execution stopped.', diagnostic:{message:'Output exceeded 200 lines or 30,000 characters.'}, done:true});
          return;
        }
        send({line:text});
      };
      const pyodide = await loadPyodide({indexURL:base, createPyodideModule, lockFileContents:JSON.parse(assets.lock), stdout:output, stderr:output});
      if(assets.packages){const path=pyodide.runPython("import sysconfig; sysconfig.get_paths()['purelib']");for(const bytes of Object.values(assets.packages))pyodide.unpackArchive(new Uint8Array(bytes),'zip',{extractDir:path});pyodide.runPython(pythonHttpWrapper)}
      pyodide.runPython(pythonWrapper);
      send({ready:true});
      const run = pyodide.globals.get('_sukoaa_run');
      try {
        // A Promise-capable entrypoint lets asyncio.run() suspend without
        // returning early. Keep ordinary Python usable on non-JSPI engines.
        const supportsStackSwitching = typeof WebAssembly.promising === 'function' && typeof WebAssembly.Suspending === 'function';
        const result = JSON.parse(supportsStackSwitching
          ? await run.callPromising(data.source, data.stdin)
          : run(data.source, data.stdin));
        if (!result.ok) send({line:result.traceback, diagnostic:result.diagnostic});
        send({done:true});
      } finally {run.destroy();}
    } catch (error) {
      const message = 'Python runtime failed: ' + (error?.message || String(error));
      send({line:message, diagnostic:{message}, done:true});
    }
  };
}
