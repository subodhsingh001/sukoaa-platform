'use client';
import {useEffect,useRef,useState,type KeyboardEvent,type PointerEvent,type RefObject} from 'react';
const STORAGE_KEY='sukoaa-workspace-widths-v1';
const defaults={editor:52,toolbox:190};
export function clampWidth(value:number,min:number,max:number){return Math.max(min,Math.min(max,value))}
export function editorPercent(clientX:number,left:number,width:number){
 const usable=width-8;if(usable<=0)return defaults.editor;
 const min=Math.max(25,Math.min(40,280/usable*100)),max=Math.min(75,Math.max(60,100-240/usable*100));
 return clampWidth((clientX-left)/usable*100,min,max);
}
type Widths={editor:number;toolbox:number};
export function useWorkspaceWidths(layout:RefObject<HTMLDivElement|null>,panels:RefObject<HTMLDivElement|null>){
 const [widths,setWidths]=useState<Widths>(defaults),[loaded,setLoaded]=useState(false),[dragging,setDragging]=useState<'editor'|'toolbox'|null>(null);
 const active=useRef<{kind:'editor'|'toolbox';pointer:number}|null>(null);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(saved&&Number.isFinite(saved.editor)&&Number.isFinite(saved.toolbox))setWidths({editor:clampWidth(saved.editor,25,75),toolbox:clampWidth(saved.toolbox,152,320)})}catch{}setLoaded(true)},[]);
 useEffect(()=>{if(loaded&&!dragging)try{localStorage.setItem(STORAGE_KEY,JSON.stringify(widths))}catch{}},[widths,loaded,dragging]);
 function start(kind:'editor'|'toolbox',event:PointerEvent<HTMLDivElement>){
  if(event.button!==0)return;event.preventDefault();active.current={kind,pointer:event.pointerId};event.currentTarget.setPointerCapture(event.pointerId);setDragging(kind);
 }
 function move(event:PointerEvent<HTMLDivElement>){
  if(!active.current||active.current.pointer!==event.pointerId)return;
  const kind=active.current.kind,box=(kind==='editor'?panels:layout).current?.getBoundingClientRect();if(!box)return;
  const value=kind==='editor'?editorPercent(event.clientX,box.left,box.width):clampWidth(event.clientX-box.left,152,Math.min(320,Math.max(152,box.width-620)));
  setWidths(current=>({...current,[kind]:value}));
 }
 function end(event:PointerEvent<HTMLDivElement>){if(active.current?.pointer!==event.pointerId)return;active.current=null;setDragging(null);if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}
 function key(kind:'editor'|'toolbox',event:KeyboardEvent<HTMLDivElement>){
  const step=kind==='editor'?2:8,box=(kind==='editor'?panels:layout).current?.getBoundingClientRect();
  const min=kind==='editor'&&box?editorPercent(box.left,box.left,box.width):kind==='editor'?25:152;
  const max=kind==='editor'&&box?editorPercent(box.right,box.left,box.width):kind==='editor'?75:box?Math.min(320,Math.max(152,box.width-620)):320;
  if(!['ArrowLeft','ArrowRight','Home','End','Enter'].includes(event.key))return;event.preventDefault();
  setWidths(current=>({...current,[kind]:event.key==='Home'?min:event.key==='End'?max:event.key==='Enter'?defaults[kind]:clampWidth(current[kind]+(event.key==='ArrowLeft'?-step:step),min,max)}));
 }
 function separator(kind:'editor'|'toolbox'){
  return {role:'separator' as const,tabIndex:0,'aria-orientation':'vertical' as const,'aria-label':kind==='editor'?'Resize code and output panels':'Resize toolbox','aria-valuemin':kind==='editor'?25:152,'aria-valuemax':kind==='editor'?75:320,'aria-valuenow':Math.round(widths[kind]),'aria-valuetext':kind==='editor'?`${Math.round(widths.editor)} percent code width`:`${Math.round(widths.toolbox)} pixels toolbox width`,title:'Drag to resize · Arrow keys to adjust · Double-click to reset',onPointerDown:(e:PointerEvent<HTMLDivElement>)=>start(kind,e),onPointerMove:move,onPointerUp:end,onPointerCancel:end,onLostPointerCapture:()=>{active.current=null;setDragging(null)},onKeyDown:(e:KeyboardEvent<HTMLDivElement>)=>key(kind,e),onDoubleClick:()=>setWidths(current=>({...current,[kind]:defaults[kind]}))};
 }
 return {editorShare:widths.editor,toolboxWidth:widths.toolbox,dragging,separator,resetWidths:()=>setWidths(defaults)};
}
