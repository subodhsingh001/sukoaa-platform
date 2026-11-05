/** Textarea edits use UTF-16 offsets, just like selectionStart/selectionEnd. */
export function editorKeyEdit(source:string,start:number,end:number,key:string,language='javascript',shift=false){
 const pairs:Record<string,string>={'(':')','[':']','{':'}','"':'"',"'":"'",'`':'`'};
 const before=source.slice(0,start),after=source.slice(end),selected=source.slice(start,end);
 const result=(text:string,a:number,b=a)=>({source:text,start:a,end:b});
 const line=before.slice(before.lastIndexOf('\n')+1),indent=line.match(/^\s*/)?.[0]||'',unit=language==='python'?'    ':'  ';
 if(key==='Tab'){
  if(shift){const count=Math.min(unit.length,line.match(/^ */)?.[0].length||0);return count?result(source.slice(0,start-line.length)+line.slice(count)+source.slice(start),start-count,Math.max(start-count,end-count)):null}
  if(start===end&&line.trim()==='for'&&['javascript','typescript','react','python'].includes(language)){
   const prefix=before.slice(0,-3),loop=language==='python'?'for i in range(10):\n'+indent+unit:'for (let i = 0; i < 10; i++) {\n'+indent+unit;
   return result(prefix+loop+(language==='python'?'':'\n'+indent+'}')+after,prefix.length+loop.length);
  }
  return result(before+unit+selected+after,start+unit.length,end+unit.length);
 }
 if(key==='Enter'){
  const opening=/[({[]$/.test(before)||(language==='python'&&/:$/.test(before));
  const extra=opening?unit:'';const paired=opening&&!!after&&pairs[before.at(-1)!]===after[0];
  return result(before+'\n'+indent+extra+(paired?'\n'+indent:'')+after,start+1+indent.length+extra.length);
 }
 if(key==='Backspace'&&start===end&&start>0&&!!after&&pairs[before.at(-1)!]===after[0])return result(before.slice(0,-1)+after.slice(1),start-1);
 if(start===end&&')]}\'"`'.includes(key)&&after[0]===key&&before.at(-1)!=='\\')return result(source,start+1);
 if(pairs[key]){
  const quote=['"',"'",'`'].includes(key);
  if(quote&&(before.at(-1)==='\\'||(!selected&&/[\w]/.test(before.at(-1)||''))))return null;
  if(!selected&&after&& !/[\s)\]}>,;:]/.test(after[0]))return null;
  return result(before+key+selected+pairs[key]+after,start+1,end+1);
 }
 return null;
}
