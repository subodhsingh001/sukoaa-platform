self.onmessage=event=>{
 try{
  const {pattern,flags,text,protocol}=event.data||{};
  if(typeof pattern!=='string'||typeof flags!=='string'||typeof text!=='string')throw new Error('Pattern, flags and test text must be strings.');
  if(pattern.length>500||text.length>20000)throw new Error('Keep the pattern at 500 and text at 20,000 characters or fewer.');
  if(!/^[dgimsuvy]*$/.test(flags)||new Set(flags).size!==flags.length)throw new Error('Use valid, non-duplicated JavaScript flags.');
  const re=new RegExp(pattern,flags),matches=[];
  if(protocol===2)postMessage({started:true});
  let m,truncated=false;
  while((m=re.exec(text))!==null){
   if(matches.length===200){truncated=true;break;}
   matches.push({text:m[0],index:m.index,groups:m.slice(1).map(v=>v??null),named:Object.fromEntries(Object.entries(m.groups||{}).map(([k,v])=>[k,v??null]))});
   if(!re.global&&!re.sticky)break;
   if(m[0]===''){
    const index=re.lastIndex,first=text.charCodeAt(index),second=text.charCodeAt(index+1);
    re.lastIndex=index+((re.unicode||re.unicodeSets)&&first>=0xD800&&first<=0xDBFF&&second>=0xDC00&&second<=0xDFFF?2:1);
   }
  }
  postMessage({matches,truncated});
 }catch(error){postMessage({error:String(error?.message||error)});}
};
