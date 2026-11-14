import {installEditorMenuStyles} from './editor-menus';
import type * as Monaco from 'monaco-editor';
type M=typeof Monaco;type TS=typeof Monaco.typescript;
declare global{interface Window{sukoaaMonaco?:M;sukoaaMonacoTS?:TS}}
let loadPromise:Promise<M>|undefined;
export function loadMonaco(){installEditorMenuStyles();return loadPromise??=new Promise((resolve,reject)=>{if(window.sukoaaMonaco){resolve(window.sukoaaMonaco);return}if(!document.querySelector('link[data-sukoaa-editor]')){const css=document.createElement('link');css.rel='stylesheet';css.href='/runtime/monaco/editor.css';css.dataset.sukoaaEditor='true';document.head.appendChild(css)}const script=document.createElement('script');script.src='/runtime/monaco/editor.js';script.onload=()=>window.sukoaaMonaco?resolve(window.sukoaaMonaco):reject(new Error('Editor unavailable'));script.onerror=()=>{loadPromise=undefined;reject(new Error('Editor assets could not load.'))};document.head.appendChild(script)})}
