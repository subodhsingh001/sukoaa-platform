import type {NodeCallbacks} from './node-runtime';
import {NodeRuntime} from './node-runtime';
import type {StudioProject} from './project';
import {isAngularProject} from './angular';
const sessions=new Map<string,NodeRuntime>();
const quiet:NodeCallbacks={log(){},issue(){},ready(){}};
export function runtimeSessionKey(project:StudioProject){return project.files['sukoaa.native.json']?'native':isAngularProject(project)?'angular':project.kind;}
export function peekRuntimeSession(project:StudioProject){return sessions.get(runtimeSessionKey(project));}
export function getRuntimeSession(project:StudioProject,callbacks:NodeCallbacks){const key=runtimeSessionKey(project);let runtime=sessions.get(key);if(!runtime){runtime=new NodeRuntime(callbacks,{scope:'projects/'+key});sessions.set(key,runtime)}else runtime.updateCallbacks(callbacks);return runtime;}
export function detachRuntimeSession(runtime:NodeRuntime|null){runtime?.updateCallbacks(quiet);}
