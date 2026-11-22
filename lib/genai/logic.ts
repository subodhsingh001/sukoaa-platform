import type {GenProgress} from './types';
function finite(n:number,min=0,max=1e12){if(!Number.isFinite(n)||n<min||n>max)throw new Error('Enter a finite number between '+min+' and '+max+'.');return n;}
function whole(n:number,min=1,max=1e9){finite(n,min,max);if(!Number.isInteger(n))throw new Error('Enter a whole number.');return n;}
export function probabilities(logits:number[],temperature:number){finite(temperature,.05,5);if(!logits.length||logits.length>100)throw new Error('Provide 1–100 logits.');logits.forEach(x=>finite(x,-1e4,1e4));const peak=Math.max(...logits);const exps=logits.map(x=>Math.exp((x-peak)/temperature));const sum=exps.reduce((a,b)=>a+b,0);return exps.map(x=>x/sum);}
export function tokenCost(input:number,output:number,inputRate:number,outputRate:number,requests:number){[input,output,inputRate,outputRate,requests].forEach(x=>finite(x));return (input*inputRate+output*outputRate)*requests/1e6;}
export function kvBytes(layers:number,heads:number,dimension:number,tokens:number,batch:number,bytes:number){[layers,heads,dimension,tokens,batch,bytes].forEach(x=>whole(x));const n=2*layers*heads*dimension*tokens*batch*bytes;if(!Number.isSafeInteger(n))throw new Error('The memory estimate is outside the supported numeric range.');return n;}
export function weightBytes(billions:number,bits:number){finite(billions,0,10000);if(![4,8,16,32].includes(bits))throw new Error('Choose 4, 8, 16 or 32 bits.');return billions*1e9*bits/8;}
export function loraParameters(input:number,output:number,rank:number,matrices:number){[input,output,rank,matrices].forEach(x=>whole(x));if(rank>Math.min(input,output))throw new Error('Rank must not exceed either matrix dimension.');return {adapter:rank*(input+output)*matrices,full:input*output*matrices};}
export function chainSuccess(p:number,steps:number){finite(p,0,1);whole(steps,0,10000);return p**steps;}
export function judgeMetrics(tp:number,fp:number,fn:number,tn:number){[tp,fp,fn,tn].forEach(x=>whole(x,0));const ratio=(a:number,b:number)=>b?a/b:null;return {precision:ratio(tp,tp+fp),recall:ratio(tp,tp+fn),accuracy:ratio(tp+tn,tp+fp+fn+tn)};}
export function contextBudget(total:number,instructions:number,history:number,output:number,evidence:number){[total,instructions,history,output,evidence].forEach(x=>whole(x,0));return total-instructions-history-output-evidence;}
export type AgentState={used:number;budget:number;evidence:boolean;approved:boolean;status:'ready'|'observed'|'awaiting_approval'|'complete'|'budget_exhausted'};
export const initialAgent=(budget=3):AgentState=>({used:0,budget:whole(budget,1,10),evidence:false,approved:false,status:'ready'});
export function advanceAgent(s:AgentState,action:'lookup'|'approve'|'send'):AgentState{
 if(s.status==='complete'||s.status==='budget_exhausted')return s;
 if(action==='approve')return s.status==='awaiting_approval'?{...s,approved:true,status:'observed'}:s;
 if(s.used>=s.budget)return {...s,status:'budget_exhausted'};
 if(action==='lookup')return {...s,used:s.used+1,evidence:true,status:'observed'};
 if(!s.evidence)return {...s,status:'ready'};
 if(!s.approved)return {...s,status:'awaiting_approval'};
 return {...s,used:s.used+1,status:'complete'};
}
export function authorizeAction(source:'document'|'user',allowed:boolean,approved:boolean){return source==='user'&&allowed&&approved;}
export const retrievalDocuments=[{id:'policy',title:'POL-448210: coverage clause',text:'Policy POL-448210 lapsed before the incident. Coverage dates determine eligibility.',semantic:.75},{id:'claim',title:'Claim CL-42: rejected',text:'Claim CL-42 was rejected after the policy expired.',semantic:.93},{id:'faq',title:'Rejected claim FAQ',text:'A declined claim may require checking coverage and dates.',semantic:.88},{id:'unrelated',title:'Parking permit',text:'Parking permit POL-448211 expires next month.',semantic:.1}];
export function retrieveToy(query:string,mode:'lexical'|'semantic'|'hybrid'){
 const words=query.toLowerCase().match(/[\p{L}\p{N}-]+/gu)||[];
 const scores=retrievalDocuments.map(d=>({...d,lexical:words.filter(w=>d.text.toLowerCase().includes(w)).length}));
 const lexical=[...scores].sort((a,b)=>b.lexical-a.lexical),semantic=[...scores].sort((a,b)=>b.semantic-a.semantic);
 return scores.map(d=>({...d,score:mode==='lexical'?d.lexical:mode==='semantic'?d.semantic:1/(61+lexical.findIndex(x=>x.id===d.id))+1/(61+semantic.findIndex(x=>x.id===d.id))})).sort((a,b)=>b.score-a.score);
}
export const blankProgress=():GenProgress=>({version:1,completed:[],bookmarks:[],notes:{}});
export function parseGenProgress(value:unknown,ids:readonly string[]):GenProgress{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid progress file.');const v=value as Record<string,unknown>;
 if(v.version!==1||!Array.isArray(v.completed)||!Array.isArray(v.bookmarks)||!v.notes||typeof v.notes!=='object'||Array.isArray(v.notes))throw new Error('Unsupported progress format.');
 const pick=(a:unknown[])=>{if(a.length>500||a.some(x=>typeof x!=='string'))throw new Error('Invalid lesson list.');return [...new Set(a as string[])].filter(x=>ids.includes(x));};
 const notes:Record<string,string>={};for(const [key,note] of Object.entries(v.notes)){if(typeof note!=='string'||note.length>12000)throw new Error('Notes must be text, with at most 12,000 characters per lesson.');if(ids.includes(key))Object.defineProperty(notes,key,{value:note,enumerable:true,writable:true,configurable:true});}
 return {version:1,completed:pick(v.completed),bookmarks:pick(v.bookmarks),notes};
}
export function mergeGenProgress(a:GenProgress,b:GenProgress):GenProgress{return {version:1,completed:[...new Set([...a.completed,...b.completed])],bookmarks:[...new Set([...a.bookmarks,...b.bookmarks])],notes:{...b.notes,...Object.fromEntries(Object.entries(a.notes).filter(([,v])=>v.trim()))}};}
