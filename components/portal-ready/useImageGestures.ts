'use client';
import {useEffect,type RefObject,type Dispatch,type SetStateAction} from 'react';
import type {EditOptions} from '@/lib/portal-ready/canvas';
import {panImage,zoomImage,wheelZoom} from '@/lib/portal-ready/gestures';

export function useImageGestures(stageRef:RefObject<HTMLDivElement|null>,canvasRef:RefObject<HTMLCanvasElement|null>,enabled:boolean,setEdit:Dispatch<SetStateAction<EditOptions>>) {
 useEffect(()=>{
  const stage=stageRef.current;
  if(!enabled||!stage)return;
  let drag:{id:number;x:number;y:number}|null=null;
  function down(event:PointerEvent){
   if(!event.isPrimary||event.button!==0||!canvasRef.current)return;
   event.preventDefault();
   canvasRef.current.focus({preventScroll:true});
   drag={id:event.pointerId,x:event.clientX,y:event.clientY};
   stage!.setPointerCapture(event.pointerId);
   stage!.dataset.dragging='true';
  }
  function move(event:PointerEvent){
   if(!drag||drag.id!==event.pointerId)return;
   const rect=canvasRef.current?.getBoundingClientRect();
   if(!rect)return;
   const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
   drag={id:drag.id,x:event.clientX,y:event.clientY};
   setEdit(edit=>panImage(edit,dx,dy,rect.width,rect.height));
  }
  function end(event:PointerEvent){
   if(drag?.id!==event.pointerId)return;
   drag=null;delete stage!.dataset.dragging;
   if(stage!.hasPointerCapture(event.pointerId))stage!.releasePointerCapture(event.pointerId);
  }
  function wheel(event:WheelEvent){
   // Preserve the browser's Ctrl/Cmd-wheel accessibility zoom.
   if(event.ctrlKey||event.metaKey||!event.deltaY)return;
   const rect=canvasRef.current?.getBoundingClientRect();
   if(!rect?.width||!rect.height)return;
   event.preventDefault();
   const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
   setEdit(edit=>zoomImage(edit,wheelZoom(edit.zoom,event.deltaY,event.deltaMode,stage!.clientHeight),x,y));
  }
  function key(event:KeyboardEvent){
   const target=canvasRef.current;
   if(!target||event.ctrlKey||event.metaKey||event.altKey||event.target!==target)return;
   const directions:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
   const dir=directions[event.key],rect=target.getBoundingClientRect();
   if(dir){event.preventDefault();const step=event.shiftKey?10:2;setEdit(edit=>panImage(edit,dir[0]*rect.width*step/100,dir[1]*rect.height*step/100,rect.width,rect.height));}
   else if(['+','=','-','0'].includes(event.key)){event.preventDefault();setEdit(edit=>zoomImage(edit,event.key==='0'?1:edit.zoom*(event.key==='-'?1/1.1:1.1)));}
  }
  stage.addEventListener('pointerdown',down);
  stage.addEventListener('pointermove',move);
  stage.addEventListener('pointerup',end);
  stage.addEventListener('pointercancel',end);
  stage.addEventListener('lostpointercapture',end);
  stage.addEventListener('wheel',wheel,{passive:false});
  stage.addEventListener('keydown',key);
  return ()=>{
   if(drag&&stage.hasPointerCapture(drag.id))stage.releasePointerCapture(drag.id);
   drag=null;delete stage.dataset.dragging;
   stage.removeEventListener('pointerdown',down);stage.removeEventListener('pointermove',move);
   stage.removeEventListener('pointerup',end);stage.removeEventListener('pointercancel',end);stage.removeEventListener('lostpointercapture',end);
   stage.removeEventListener('wheel',wheel);stage.removeEventListener('keydown',key);
  };
 },[enabled,stageRef,canvasRef,setEdit]);
}
