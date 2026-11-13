"use client";
import {useEffect,useRef} from 'react';
export function StudioSplitter({value,onChange}:{value:number;onChange:(value:number)=>void}){
 const cleanup=useRef<()=>void>(()=>{});useEffect(()=>()=>cleanup.current(),[]);
 return <div className="studio-splitter" role="separator" aria-label="Resize code and preview" aria-orientation="vertical" aria-valuemin={25} aria-valuemax={75} aria-valuenow={Math.round(value)} tabIndex={0} title="Drag to resize · double-click to reset" onDoubleClick={()=>onChange(55)} onKeyDown={event=>{const key=event.key;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(key)){event.preventDefault();onChange(key==='Home'?25:key==='End'?75:Math.max(25,Math.min(75,value+(['ArrowLeft','ArrowUp'].includes(key)?-2:2))))}}} onPointerDown={event=>{
 if(event.button!==0)return;cleanup.current();const handle=event.currentTarget,parent=handle.parentElement!;handle.setPointerCapture(event.pointerId);parent.setAttribute('data-dragging','true');
 const move=(e:PointerEvent)=>{const box=parent.getBoundingClientRect(),stacked=window.matchMedia('(max-width:1100px)').matches;const extent=(stacked?box.height:box.width)-10;onChange(Math.max(25,Math.min(75,100*(stacked?e.clientY-box.top:e.clientX-box.left)/extent)))};
 const end=()=>{parent.removeAttribute('data-dragging');handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',end);handle.removeEventListener('pointercancel',end);handle.removeEventListener('lostpointercapture',end)};
 cleanup.current=end;handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
 }}><span/></div>
}
