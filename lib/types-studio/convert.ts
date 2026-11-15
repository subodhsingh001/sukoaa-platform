import JSON5 from 'json5';
export type OutputMode='interface'|'type'|'zod';
export type Options={mode:OutputMode;root:string;optional:boolean;enums:boolean};
type Shape={kind:'string';values:string[];count:number}|{kind:'number'|'boolean'|'null'|'unknown'}|{kind:'array';item:Shape}|{kind:'object';fields:{key:string;shape:Shape;optional:boolean}[]}|{kind:'union';items:Shape[]};
const reserved=new Set(('z break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with implements interface let package private protected public static yield any boolean constructor declare get module require number set string symbol type from of unknown never undefined object bigint abstract as asserts async await infer keyof namespace readonly unique global').split(' '));
export function validateRoot(root:string){if(!/^[A-Za-z_$][\w$]*$/.test(root)||reserved.has(root))throw new Error('Use a TypeScript identifier such as Root, User or ApiResponse (no spaces or reserved words).');}
export function parseSample(source:string):unknown{
 if(source.length>100_000)throw new Error('Keep the sample under 100,000 characters. A few representative records are enough.');
 if(!source.trim())throw new Error('Paste a JSON sample to begin.');
 // JSON5 parses data only. No eval, executable expressions, or network calls.
 const value:unknown=JSON5.parse(source);let nodes=0;
 function check(v:unknown,depth:number){if(++nodes>20_000||depth>40)throw new Error('Use a smaller sample (maximum 20,000 values and 40 nesting levels).');if(typeof v==='number'&&!Number.isFinite(v))throw new Error('NaN and Infinity are not JSON values. Replace them with a finite number or null.');if(v&&typeof v==='object')for(const child of Object.values(v))check(child,depth+1);}
 check(value,0);return value;
}
function infer(values:unknown[]):Shape{
 const groups=new Map<string,unknown[]>();for(const v of values){const kind=v===null?'null':Array.isArray(v)?'array':typeof v;const group=groups.get(kind)||[];group.push(v);groups.set(kind,group);}
 const items:Shape[]=[];
 for(const [kind,group] of groups){
  if(kind==='object'){const objects=group as Record<string,unknown>[];const keys=new Set(objects.flatMap(o=>Object.keys(o)));items.push({kind:'object',fields:[...keys].map(key=>{const samples=objects.filter(o=>Object.hasOwn(o,key)).map(o=>o[key]);return {key,shape:infer(samples),optional:samples.length<objects.length};})});}
  else if(kind==='array')items.push({kind:'array',item:infer((group as unknown[][]).flat())});
  else if(kind==='string')items.push({kind:'string',values:[...new Set(group as string[])],count:group.length});
  else if(kind==='number'||kind==='boolean'||kind==='null')items.push({kind});
 }
 return items.length===0?{kind:'unknown'}:items.length===1?items[0]:{kind:'union',items};
}
const quoted=(s:string)=>JSON.stringify(s).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const keyName=(s:string)=>/^[A-Za-z_$][\w$]*$/.test(s)?s:quoted(s);
const segment=(s:string)=>s.replace(/[^A-Za-z0-9]+/g,' ').split(' ').filter(Boolean).map(v=>v[0].toUpperCase()+v.slice(1)).join('')||'Value';
export function convertValue(value:unknown,options:Options){
 validateRoot(options.root);const {mode,root}=options;const definitions:string[]=[];const used=new Set<string>([root]);let declarations=0;
 const allocate=(candidate:string)=>{let name=candidate,i=2;while(used.has(name)||reserved.has(name))name=candidate+i++;used.add(name);return name;};
 const render=(s:Shape,path:string,isRoot=false):string=>{
  const z=mode==='zod';
  if(s.kind==='object'){
   const name=isRoot?root:allocate(path),reference=z?name+'Schema':name;
   const fields=s.fields.map(f=>{const type=render(f.shape,name+segment(f.key));const optional=options.optional||f.optional;
    if(z)return '  '+(f.key==='__proto__'?'['+quoted(f.key)+']':quoted(f.key))+': '+type+(optional?'.optional()':'')+',';
    return '  '+keyName(f.key)+(optional?'?':'')+': '+type+';';
   });
   definitions.push(z?`export const ${reference} = z.object({\n${fields.join('\n')}\n});`:mode==='interface'?`export interface ${name} {\n${fields.join('\n')}\n}`:`export type ${name} = {\n${fields.join('\n')}\n};`);declarations++;return reference;
  }
  if(s.kind==='array'){const inner=render(s.item,path+'Item');return z?`z.array(${inner})`:`(${inner})[]`;}
  if(s.kind==='union'){const parts=s.items.map((item,i)=>render(item,path+(i+1)));return z?`z.union([${parts.join(', ')}])`:parts.join(' | ');}
  if(s.kind==='string'){
   // Only infer an enum when a field actually repeats; unique names stay strings.
   const enumeration=options.enums&&s.values.length>=2&&s.values.length<=12&&s.count>s.values.length;
   return enumeration?(z?`z.enum([${s.values.map(quoted).join(', ')}])`:s.values.map(quoted).join(' | ')):(z?'z.string()':'string');
  }
  return z?`z.${s.kind}()`:s.kind;
 };
 const shape=infer([value]),reference=render(shape,root,true);
 if(shape.kind!=='object'){definitions.push(mode==='zod'?`export const ${root}Schema = ${reference};`:`export type ${root} = ${reference};`);declarations++;}
 if(mode==='zod'){definitions.unshift('import { z } from "zod";');definitions.push(`export type ${root} = z.infer<typeof ${root}Schema>;`);declarations++;}
 const code=definitions.join('\n\n')+'\n';if(code.length>500_000)throw new Error('Generated output is too large. Reduce the sample.');
 return {code,count:declarations,lines:code.trimEnd().split('\n').length,filename:root+(mode==='zod'?'.schema':'')+'.ts'};
}
export function convertSample(source:string,options:Options){return convertValue(parseSample(source),options);}
