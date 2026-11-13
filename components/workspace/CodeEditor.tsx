'use client';
import {forwardRef,useEffect,useImperativeHandle,useRef,useState} from 'react';
import type * as Monaco from 'monaco-editor';
import {loadMonaco} from '@/lib/platform/monaco-client';
import {editorKeyEdit} from '@/lib/platform/editor-keys';
import type {CodeDiagnostic} from '@/lib/platform/diagnostics';
type Props={value:string;language:string;fontSize:number;diagnostics:CodeDiagnostic[];onChange:(value:string)=>void;onRun:()=>void;onSave:()=>void};
export type CodeEditorHandle={jump:(issue:CodeDiagnostic)=>void};
export const CodeEditor=forwardRef<CodeEditorHandle,Props>(function CodeEditor(props,ref){
 const host=useRef<HTMLDivElement>(null),textarea=useRef<HTMLTextAreaElement>(null),editor=useRef<Monaco.editor.IStandaloneCodeEditor|null>(null),model=useRef<Monaco.editor.ITextModel|null>(null),monaco=useRef<typeof Monaco|null>(null),latest=useRef(props),updating=useRef(false);
 latest.current=props;
 const [ready,setReady]=useState(false),[fallback,setFallback]=useState(false);
 function jump(issue:CodeDiagnostic){if(!issue.line)return;const e=editor.current;if(e){e.revealLineInCenter(issue.line);e.setPosition({lineNumber:issue.line,column:issue.column||1});e.focus();return}const t=textarea.current;if(t){const rows=latest.current.value.split('\n');const offset=rows.slice(0,issue.line-1).reduce((n,row)=>n+row.length+1,0)+Math.min((issue.column||1)-1,rows[issue.line-1]?.length||0);t.focus();t.setSelectionRange(offset,offset+1);t.scrollTop=Math.max(0,(issue.line-3)*latest.current.fontSize*1.6)}}
 useImperativeHandle(ref,()=>({jump}),[]);
 useEffect(()=>{
  let cancelled=false;let change:Monaco.IDisposable|undefined,key:Monaco.IDisposable|undefined;
  loadMonaco().then(m=>{
   if(cancelled||!host.current)return;monaco.current=m;
   m.editor.defineTheme('sukoaa-quick',{base:'vs-dark',inherit:true,rules:[{token:'comment',foreground:'91A78E'},{token:'keyword',foreground:'C4A9D0'},{token:'string',foreground:'C4DCA0'},{token:'number',foreground:'DDC48F'}],colors:{'editor.background':'#20362c','editor.foreground':'#D0DEC6','editorLineNumber.foreground':'#91A78E','editorLineNumber.activeForeground':'#DAE9C1','editor.lineHighlightBackground':'#2B4435','editor.selectionBackground':'#526A4266','editorError.foreground':'#F29488','editorGutter.background':'#20362c'}});
   const p=latest.current;model.current=m.editor.createModel(p.value,editorLanguage(p.language));model.current.updateOptions({tabSize:p.language==='python'?4:2,insertSpaces:true});
   const e=m.editor.create(host.current,{model:model.current,theme:'sukoaa-quick',editContext:false,automaticLayout:true,fontFamily:'Consolas, monospace',fontSize:p.fontSize,lineHeight:Math.round(p.fontSize*1.6),minimap:{enabled:false},padding:{top:18,bottom:18},scrollBeyondLastLine:false,folding:true,showFoldingControls:'always',foldingHighlight:true,autoClosingBrackets:'always',autoClosingQuotes:'languageDefined',autoIndent:'full',formatOnType:true,wordWrap:'on',fixedOverflowWidgets:true,accessibilitySupport:'on',ariaLabel:'Source code',renderValidationDecorations:'on'});editor.current=e;
   change=e.onDidChangeModelContent(()=>{if(updating.current)return;const value=e.getValue();if(value.length>50000){updating.current=true;e.setValue(latest.current.value);updating.current=false;return}latest.current.onChange(value)});
   e.addCommand(m.KeyMod.CtrlCmd|m.KeyCode.Enter,()=>latest.current.onRun());e.addCommand(m.KeyMod.CtrlCmd|m.KeyCode.KeyS,()=>latest.current.onSave());
   key=e.onKeyDown(event=>{if(event.keyCode!==m.KeyCode.Tab||event.shiftKey||event.ctrlKey||event.metaKey||event.altKey)return;const selection=e.getSelection(),value=e.getValue(),mod=e.getModel();if(!selection?.isEmpty()||!mod)return;const offset=mod.getOffsetAt(selection.getStartPosition());const line=mod.getLineContent(selection.startLineNumber).slice(0,selection.startColumn-1);if(line.trim()!=='for')return;const next=editorKeyEdit(value,offset,offset,'Tab',latest.current.language);if(!next)return;event.preventDefault();event.stopPropagation();e.pushUndoStop();e.executeEdits('sukoaa-for',[{range:mod.getFullModelRange(),text:next.source}]);e.setPosition(mod.getPositionAt(next.start));e.pushUndoStop()});
   setReady(true);
  }).catch(()=>{if(!cancelled)setFallback(true)});
  return()=>{cancelled=true;change?.dispose();key?.dispose();editor.current?.dispose();model.current?.dispose();editor.current=null;model.current=null};
 },[]);
 useEffect(()=>{const m=monaco.current,mod=model.current;if(!m||!mod)return;updating.current=true;if(mod.getValue()!==props.value)mod.setValue(props.value);m.editor.setModelLanguage(mod,editorLanguage(props.language));mod.updateOptions({tabSize:props.language==='python'?4:2,insertSpaces:true});updating.current=false},[props.value,props.language,ready]);
 useEffect(()=>{editor.current?.updateOptions({fontSize:props.fontSize,lineHeight:Math.round(props.fontSize*1.6)})},[props.fontSize,ready]);
 useEffect(()=>{const m=monaco.current,mod=model.current;if(!m||!mod)return;m.editor.setModelMarkers(mod,'sukoaa-run',props.diagnostics.filter(d=>d.line).map(d=>({message:d.message,severity:m.MarkerSeverity.Error,startLineNumber:d.line!,endLineNumber:d.line!,startColumn:d.column||1,endColumn:(d.column||1)+1})))},[props.diagnostics,ready]);
 return <div className="quick-code-editor"><div className="quick-editor-toolbar"><span>{fallback?'Basic editor · folding unavailable':'Click the gutter chevrons to fold code'}</span><div><button type="button" disabled={!ready} onClick={()=>editor.current?.getAction('editor.foldAll')?.run()}>Fold all</button><button type="button" disabled={!ready} onClick={()=>editor.current?.getAction('editor.unfoldAll')?.run()}>Expand all</button></div></div>{!ready&&!fallback&&<div className="quick-editor-loading">Opening code editor…</div>}<div ref={host} className="quick-monaco" hidden={fallback}/>{fallback&&<textarea className="quick-editor-fallback" ref={textarea} aria-label="Source code" spellCheck={false} value={props.value} maxLength={50000} onChange={e=>props.onChange(e.target.value)} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();props.onRun();return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();props.onSave();return}if(e.nativeEvent.isComposing||e.ctrlKey||e.metaKey||e.altKey)return;const el=e.currentTarget,next=editorKeyEdit(el.value,el.selectionStart,el.selectionEnd,e.key,props.language,e.shiftKey);if(!next)return;e.preventDefault();if(next.source!==el.value)props.onChange(next.source);requestAnimationFrame(()=>el.setSelectionRange(next.start,next.end))}}/>}</div>;
});
function editorLanguage(language:string){return language==='c'?'cpp':language==='react'?'typescript':language==='nextjs'?'typescript':language}
