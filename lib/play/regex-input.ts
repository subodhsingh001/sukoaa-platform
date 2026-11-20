export type RegexMatch={text:string;index:number;groups:(string|null)[];named:Record<string,string|null>};
export function regexInput(value:string,suppliedFlags:string){
 let pattern=value,flags=suppliedFlags;
 if(value.startsWith('/')){
  let escaped=false,inClass=false,last=-1;
  for(let i=1;i<value.length;i++){const c=value[i];if(escaped){escaped=false;continue;}if(c==='\\'){escaped=true;continue;}if(c==='[')inClass=true;else if(c===']')inClass=false;else if(c==='/'&&!inClass)last=i;}
  if(last>0){pattern=value.slice(1,last);flags=value.slice(last+1);}
 }
 if(pattern.length>500)throw new Error('Keep the pattern at 500 characters or fewer.');
 if(!/^[dgimsuvy]*$/.test(flags)||new Set(flags).size!==flags.length)throw new Error('Use valid JavaScript flags without duplicates: d, g, i, m, s, u, v or y.');
 if(flags.includes('u')&&flags.includes('v'))throw new Error('Choose either u or v; JavaScript does not allow both.');
 return {pattern,flags};
}
