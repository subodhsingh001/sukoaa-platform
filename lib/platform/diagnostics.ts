export type CodeDiagnostic={message:string;line?:number;column?:number;source?:string};
export type Compilation={code:string;sourceMap?:string};
export class DiagnosticError extends Error{
 constructor(public diagnostics:CodeDiagnostic[]){super(diagnostics.map(d=>d.message).join('\n'));this.name='DiagnosticError'}
}
// Decode standard Source Map v3 segments. Each state is relative to the previous segment.
// Single-file playground maps have a single original source, with one-based UI positions.
export function originalPosition(mapText:string,line:number,column:number):{line:number;column:number}|undefined{
 try{
  const map=JSON.parse(mapText) as {mappings:string};if(typeof map.mappings!=='string')return;
  const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let originalLine=0,originalColumn=0,sourceIndex=0,nameIndex=0;
  const rows=map.mappings.split(';');let selected:{line:number;column:number}|undefined;
  for(let row=0;row<Math.min(line,rows.length);row++){
   let generatedColumn=0;let candidate:typeof selected;
   for(const segment of rows[row].split(',')){
    if(!segment)continue;const values:number[]=[];let value=0,shift=0;
    for(const char of segment){const digit=alphabet.indexOf(char);if(digit<0)return;value|=(digit&31)<<shift;if(digit&32){shift+=5;if(shift>30)return}else{values.push((value&1)?-(value>>>1):(value>>>1));value=0;shift=0}}
    if(shift)return;generatedColumn+=values[0];
    if(values.length>=4){sourceIndex+=values[1];originalLine+=values[2];originalColumn+=values[3];if(values.length===5)nameIndex+=values[4]}
    if(row===line-1&&generatedColumn<=column-1){candidate=values.length>=4&&sourceIndex===0?{line:originalLine+1,column:originalColumn+1}:undefined}
   }
   if(row===line-1)selected=candidate;
  }
  return selected;
 }catch{return}
}
export function editorDiagnostic(value:CodeDiagnostic,mapText:string|undefined,source:string):CodeDiagnostic{
 const mapped=value.line&&mapText?originalPosition(mapText,value.line,value.column||1):undefined;
 const line=mapped?.line??(mapText?undefined:value.line);const column=mapped?.column??(mapText?undefined:value.column);
 const lines=source.split('\n');const valid=line!==undefined&&Number.isInteger(line)&&line>=1&&line<=lines.length;
 return {message:value.message.slice(0,2000),source:value.source,line:valid?line:undefined,column:valid&&Number.isInteger(column)&&column!>0?Math.min(column!,lines[line!-1].length+1):valid?1:undefined};
}
export function remoteDiagnostics(language:'python'|'go',errorOutput:string):CodeDiagnostic[]{
 const lines=errorOutput.split('\n');const diagnostics:CodeDiagnostic[]=[];
 if(language==='go'){
  for(const text of lines){const match=text.match(/(?:^|[\s/])(?:main|prog)\.go:(\d+)(?::(\d+))?:\s*(.*)/);if(match)diagnostics.push({line:Number(match[1]),column:Number(match[2]||1),message:match[3]||'Go compilation error',source:'main.go'})}
 }else{
  let position:number|undefined;
  for(const text of lines){const match=text.match(/File ["'](?:[^"']*\/)?(?:main\.py|script\.py|<stdin>|<string>)["'], line (\d+)/);if(match)position=Number(match[1])}
  const summary=[...lines].reverse().find(text=>/^(?:[\w.]*Error|Exception|KeyboardInterrupt|SystemExit):/.test(text.trim()));
  if(position||summary)diagnostics.push({line:position,message:summary?.trim()||'Python execution error',source:'main.py'});
 }
 return diagnostics.slice(0,20);
}
