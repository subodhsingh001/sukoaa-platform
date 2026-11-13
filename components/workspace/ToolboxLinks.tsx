
'use client';
import {toolLinks} from '@/lib/tool-order';
import type {Language} from '@/lib/platform/config';
export function ToolboxLinks({active,onChoose}:{active:string;onChoose:(value:Language)=>void}){return <nav className="toolbox-links" aria-label="Coding tools">{toolLinks.map(tool=>{const content=<><span aria-hidden="true" className={'language-icon '+tool.id}>{tool.icon}</span><span className="toolbox-copy">{tool.name}<small>{tool.info}</small></span><span className="toolbox-tooltip" aria-hidden="true"><strong>{tool.name}</strong>{tool.info}</span></>;return tool.id==='react-native'?<a key={tool.id} href={tool.href} aria-label={tool.name+' · '+tool.info} className={active===tool.id?'active':''}>{content}</a>:<button key={tool.id} aria-label={tool.name+' · '+tool.info} aria-pressed={active===tool.id} className={active===tool.id?'active':''} onClick={()=>onChoose(tool.id as Language)}>{content}</button>})}</nav>}
