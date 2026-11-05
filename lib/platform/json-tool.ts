import {parseTree,type ParseError} from 'jsonc-parser/lib/esm/main.js';
import {DiagnosticError} from './diagnostics';
export function validateJson(source:string){
 try{const value:unknown=JSON.parse(source);const kind=value===null?'null':Array.isArray(value)?'array':typeof value;return {formatted:JSON.stringify(value,null,2),kind,count:value&&typeof value==='object'?Object.keys(value).length:undefined}}
 catch(error){const message=error instanceof Error?error.message:'Invalid JSON';const location=message.match(/line (\d+) column (\d+)/i),position=message.match(/position (\d+)/i);let line:number|undefined,column:number|undefined;
  if(location){line=Number(location[1]);column=Number(location[2])}else if(position){const before=source.slice(0,Number(position[1])).split('\n');line=before.length;column=before.at(-1)!.length+1}else {const errors:ParseError[]=[];try{parseTree(source,errors,{disallowComments:true,allowTrailingComma:false})}catch{}if(errors.length){const before=source.slice(0,errors[0].offset).split('\n');line=before.length;column=before.at(-1)!.length+1}}if(!line&&/end of JSON/i.test(message)){const lines=source.split('\n');line=lines.length;column=lines.at(-1)!.length+1}
  throw new DiagnosticError([{source:'data.json',line,column,message}]);
 }
}
