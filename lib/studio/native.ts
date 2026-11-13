import {nativeStarters,type NativeStarter} from '@/lib/platform/react-native';
import {projectId,validateProject,type StudioProject} from './project';
export function isNativeProject(p:StudioProject){return p.files['sukoaa.native.json']!==undefined}
export function nativeTemplate(starter:NativeStarter='counter'):StudioProject{return validateProject({version:1,id:projectId(),name:nativeStarters[starter].name,kind:'react',entry:'src/main.tsx',folders:['components','src'],files:{...Object.fromEntries(Object.entries(nativeStarters[starter].files).map(([p,f])=>[p,f.contents])),
 'sukoaa.native.json':'{"runtime":"react-native-web"}',
 'src/main.tsx':`import React from 'react';
import {createRoot} from 'react-dom/client';
import App from '../App';
import './style.css';
createRoot(document.getElementById('root')!).render(<App/>);`,
 'src/style.css':'html,body,#root{height:100%;margin:0}body{font-family:system-ui}#root{display:flex;flex-direction:column}',
 'package.json':JSON.stringify({name:'sukoaa-native-web',private:true,dependencies:{react:'19.2.6','react-dom':'19.2.6','react-native-web':'0.21.2'}},null,2)}})}
export async function loadNativeRuntime(){const response=await fetch('/runtime/react-native.js');if(!response.ok)throw new Error('React Native Web runtime is missing. Run npm run prepare:runtimes and redeploy.');const text=await response.text();if(!text.includes('ReactNativeWeb'))throw new Error('React Native Web runtime could not load.');return text}
