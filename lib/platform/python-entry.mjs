// Prepared as a self-contained classic IIFE worker (script imports disabled by its banner): no ESM/blob imports at browser startup.
import {loadPyodide} from 'pyodide';
import createPyodideModule from 'pyodide/pyodide.asm.mjs';
import {installPythonWorker} from './python-worker.mjs';
installPythonWorker(loadPyodide, createPyodideModule);
