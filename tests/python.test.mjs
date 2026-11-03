import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPyodide} from 'pyodide';
import {pythonWrapper} from '../lib/platform/python-worker.mjs';
const output=[];
const pyodide=await loadPyodide({stdout:line=>output.push(line),stderr:line=>output.push(line)});
pyodide.runPython(pythonWrapper);
function execute(source,stdin=''){
 output.length=0;const run=pyodide.globals.get('_sukoaa_run');
 try{return {...JSON.parse(run(source,stdin)),output:output.join('\n')}}finally{run.destroy()}
}
test('real Python executes standard-library imports and Unicode input',()=>{
 const result=execute('import math\nname=input()\nprint(name)\nprint(math.factorial(5))','নমস্কার Sukoaa');
 assert.equal(result.ok,true);assert.equal(result.output,'নমস্কার Sukoaa\n120');
});
test('syntax errors preserve source line and column',()=>{
 const result=execute('print("first")\nif True print("bad")');
 assert.equal(result.ok,false);assert.equal(result.diagnostic.line,2);assert.ok(result.diagnostic.column>0);assert.match(result.diagnostic.message,/SyntaxError/);
});
test('runtime errors point to the failing user line inside functions',()=>{
 const result=execute('def divide():\n    return 10 / 0\ndivide()');
 assert.equal(result.diagnostic.line,2);assert.equal(result.diagnostic.source,'main.py');assert.match(result.traceback,/ZeroDivisionError/);
});
test('input consumes separate lines and reports EOF with its code location',()=>{
 assert.equal(execute('print(input())\nprint(input())','one\ntwo').output,'one\ntwo');
 const result=execute('input()','');assert.equal(result.diagnostic.line,1);assert.match(result.diagnostic.message,/EOFError/);
});
test('user variables and standard input do not leak between runs',()=>{
 assert.equal(execute('secret=123\ninput()','first').ok,true);
 const result=execute('print(secret)');assert.match(result.diagnostic.message,/NameError/);
 assert.match(execute('input()').diagnostic.message,/EOFError/);
});
test('normal SystemExit finishes and nonzero SystemExit is reported',()=>{
 assert.equal(execute('raise SystemExit(0)').ok,true);
 assert.match(execute('raise SystemExit(2)').diagnostic.message,/SystemExit: 2/);
});
