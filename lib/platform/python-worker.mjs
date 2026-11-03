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
  let started = false;
  self.onmessage = async ({data}) => {
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
      pyodide.runPython(pythonWrapper);
      send({ready:true});
      const run = pyodide.globals.get('_sukoaa_run');
      try {
        const result = JSON.parse(run(data.source, data.stdin));
        if (!result.ok) send({line:result.traceback, diagnostic:result.diagnostic});
        send({done:true});
      } finally {run.destroy();}
    } catch (error) {
      const message = 'Python runtime failed: ' + (error?.message || String(error));
      send({line:message, diagnostic:{message}, done:true});
    }
  };
}
