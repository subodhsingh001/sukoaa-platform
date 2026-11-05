'use client';
import {useEffect,useState,type CSSProperties} from 'react';
export function useEditorFont(){
 const [fontSize,setFontSize]=useState(16);
 useEffect(()=>{try{const value=Number(localStorage.getItem('sukoaa-editor-font'));if(Number.isFinite(value)&&value>=12&&value<=24)setFontSize(value)}catch{}},[]);
 function changeFont(next:number){const value=Math.max(12,Math.min(24,next));setFontSize(value);try{localStorage.setItem('sukoaa-editor-font',String(value))}catch{}}
 const fontStyle={'--code-font-size':fontSize+'px','--code-line-height':Math.round(fontSize*1.6)+'px'} as CSSProperties;
 return {fontSize,changeFont,fontStyle};
}
export function EditorFontControl({fontSize,onChange}:{fontSize:number;onChange:(value:number)=>void}){
 return <div className="editor-font-control" role="group" aria-label="Editor text size"><button type="button" aria-label="Decrease editor text size" disabled={fontSize<=12} onClick={()=>onChange(fontSize-2)}>A−</button><span aria-live="polite">{fontSize}px</span><button type="button" aria-label="Increase editor text size" disabled={fontSize>=24} onClick={()=>onChange(fontSize+2)}>A+</button></div>;
}
