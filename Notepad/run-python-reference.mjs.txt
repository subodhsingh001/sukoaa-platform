import {readFileSync} from 'node:fs';
import {loadPyodide} from 'pyodide';

// Run each unchanged reference solution in a fresh process using the same
// installed CPython/WASM runtime as the browser tests. No system Python needed.
try {
  const source = readFileSync(0, 'utf8');
  const python = await loadPyodide({
    stdout: line => process.stdout.write(line + '\n'),
    stderr: line => process.stderr.write(line + '\n'),
  });
  python.runPython(source);
} catch (error) {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
}
