import {LIMITS,newField,snakeCase,type Field,type FieldType,type ToolDraft} from './schema';
export type DraftResult={tools:ToolDraft[];warnings:string[]};
const types:Record<string,FieldType>={string:'string',text:'string',number:'number',numeric:'number',integer:'integer',int:'integer',boolean:'boolean',bool:'boolean',array:'array',list:'array',object:'object'};
const requiredWords=/\b(required|mandatory|must|needed|compulsory)\b/i;
const optionalWords=/\b(optional|not required|not mandatory|not needed)\b/i;
const allRequired=/\b(?:both|all)\s+(?:are\s+)?(?:required|mandatory|needed|compulsory)\b/i;
const namePattern='[A-Za-z_][A-Za-z0-9_]*(?:\\[\\])?(?:\\.[A-Za-z_][A-Za-z0-9_]*(?:\\[\\])?)*';
const sentence=(text:string)=>{const s=text.trim().replace(/[.!?]+$/,'');return s?s+'.':'';};

/** A bounded parser for explicit function/parameter declarations, not an LLM. */
export function parseDescription(source:string):DraftResult {
 if(source.length>LIMITS.input)throw Error(`Keep descriptions under ${LIMITS.input.toLocaleString()} characters.`);
 const tools:ToolDraft[]=[],warnings:string[]=[];
 let current=null as ToolDraft|null,globalRequired=false,explicitDescription=false,totalFields=0;
 const conflicts=new Set<string>();
 const warn=(text:string)=>{if(warnings.length<100)warnings.push(text);};
 function finish(){
  if(!current)return;
  if(globalRequired)applyAll(current.fields);
  if(/\bmultiply\b/i.test(current.name.replace(/_/g,' '))&&/\breturn(?:s|ing)?\s+(?:their\s+|the\s+|a\s+)?sum\b/i.test(current.description))warn(`${current.name}: the name says multiply, but the description says return a sum. Multiplication normally returns a product; confirm the intended meaning.`);
  if(!explicitDescription)warn(`${current.name}: the description is a draft; review its meaning.`);
  if(!current.fields.length)warn(`${current.name}: no parameters were found. Confirm that this is a no-argument function.`);
  if(tools.length>=LIMITS.tools)throw Error('Use no more than 20 functions.');
  tools.push(current);current=null;globalRequired=false;explicitDescription=false;conflicts.clear();
 }
 function applyAll(fields:Field[]){for(const f of fields){if(f.required==='review'&&!conflicts.has(f.name))f.required='yes';}}
 function start(header:string,inline=''){
  finish();let clean=header.trim().replace(/^(?:please\s+)?(?:create|make|write|define|add)\s+(?:a\s+)?function\s+(?:(?:called|named)\s+)?/i,'').replace(/^function\s*:?\s*/i,'').replace(/^['"`]|['"`]$/g,'');
  const divided=clean.split(/\s+(?:that|which)\s+|\s+[—–]\s+|\s+-\s+/);clean=divided.shift()||'';
  const purpose=divided.join(' ');const name=snakeCase(clean);
  if(!name){warn('A function header did not contain a usable name.');return;}
  current={name,description:sentence(purpose||clean.replace(/_/g,' ')),fields:[]};explicitDescription=!!purpose;
  if(inline)argumentsText(inline);
 }
 function insert(field:Field,path:string){
  if(!current)return;
  const parts=path.split('.');if(parts.length>LIMITS.depth){warn(`${current.name}.${path}: nesting exceeds six levels; add a simpler structure manually.`);return;}let list=current.fields;
  for(const [index,raw] of parts.entries()){
   const array=raw.endsWith('[]'),name=snakeCase(raw.replace(/\[\]$/,''));
   if(index===parts.length-1){
    if(list.some(f=>f.name===name)){warn(`${current.name}.${path}: duplicate declaration; kept the first. Review it.`);return;}
    if(++totalFields>LIMITS.fields)throw Error('Use no more than 150 fields.');list.push({...field,name});return;
   }
   let parent=list.find(f=>f.name===name);
   if(!parent){parent={...newField(name),type:array?'array':'object',itemsType:array?'object':'unknown'};if(++totalFields>LIMITS.fields)throw Error('Use no more than 150 fields.');list.push(parent);warn(`${current.name}.${name}: inferred a parent object; choose its required status.`);}
   if(parent.type!=='object'&&!(parent.type==='array'&&parent.itemsType==='object')){warn(`${current.name}.${path}: parent is not an object; add this field manually.`);return;}
   list=parent.children;
  }
 }
 function parameter(text:string){
  if(!current)return;
  const cleaned=text.trim().replace(/^[-*]\s*|^\d+[.)]\s*/g,'').replace(/[.;]+$/,'').replace(/^parameters?\s*:\s*/i,'');
  const match=cleaned.match(new RegExp('^('+namePattern+')(?:\\s*[:(]\\s*|\\s+is\\s+(?:an?\\s+)?|\\s+)?(.*)$','i'));
  if(!match){warn(`${current.name}: could not read parameter “${cleaned.slice(0,80)}”.`);return;}
  const [,path,rest]=match;const field=newField(path);
  const explicit=rest.match(/\b(string|text|number|numeric|integer|int|boolean|bool|array|list|object)\b/i);
  const math=/\b(add|sum|subtract|multiply|divide|calculate|math|price|age|amount)\b/i.test(current.name.replace(/_/g,' ')+' '+current.description);
  if(explicit)field.type=types[explicit[1].toLowerCase()];
  else if(/(?:age|price|amount|total|cost|salary|number)$/i.test(path)||math)field.type='number';
  else if(/^(?:is_|has_|can_)/i.test(path))field.type='boolean';
  else if(/(?:name|email|city|country|message|text|query|address|title)$/i.test(path))field.type='string';
  else warn(`${current.name}.${path}: choose the type; it was not clear.`);
  // Explicit optionality takes precedence over a function-wide “all required”.
  const optional=optionalWords.test(rest),positive=requiredWords.test(rest.replace(/\bnot\s+(?:required|mandatory|needed)\b/gi,''));
  field.required=optional&&positive?'review':optional?'no':positive?'yes':'review';
  if(optional&&positive)conflicts.add(path.split('.')[0]);
  if(optional&&positive)warn(`${current.name}.${path}: conflicting required/optional instructions.`);
  if(field.type==='array'){
   const item=rest.match(/\b(?:of|items?\s*[:=]?)\s+(strings?|numbers?|integers?|booleans?|objects?)\b/i);
   if(item)field.itemsType=types[item[1].toLowerCase().replace(/s$/,'')];
   else warn(`${current.name}.${path}: choose the array item type.`);
  }
  const enumMatch=rest.match(/\benum\s*[:=]?\s*\[([^\]]+)\]/i);
  if(enumMatch)field.enumText=enumMatch[1].split(',').map(v=>v.trim().replace(/^['"]|['"]$/g,'')).join(' | ');
  const min=rest.match(/\bmin(?:imum)?\s*[:=]?\s*(-?\d+(?:\.\d+)?)/i),max=rest.match(/\bmax(?:imum)?\s*[:=]?\s*(-?\d+(?:\.\d+)?)/i);
  if(min)field.minimum=min[1];if(max)field.maximum=max[1];
  const description=rest.split(/\s+[—–]\s+|\s+-\s+/).slice(1).join(' ');field.description=description;
  if(/\b(default|pattern|format|nullable|union|oneof|anyof)\b/i.test(rest))warn(`${current.name}.${path}: extra constraints need manual review; they were not converted.`);
  if(!explicit&&field.type!=='unknown')warn(`${current.name}.${path}: inferred ${field.type}; confirm this type.`);
  insert(field,path);
 }
 function argumentsText(text:string){
  if(!current)return;
  if(allRequired.test(text))globalRequired=true;
  let cleaned=text.replace(allRequired,'').replace(/\b(?:two|three)\s+numbers?\s+/i,'').replace(/^[\s:]+|[\s,.]+$/g,'');
  // Commas inside an enum are retained; each explicit parameter line is preferred.
  const chunks=cleaned.split(/,(?![^\[]*\])|\s+and\s+/i).map(v=>v.trim()).filter(Boolean);
  for(const chunk of chunks){if(/^(?:both|all|parameters?|arguments?)$/i.test(chunk))continue;parameter(chunk);}
 }
 // Normalize pasted line endings and Markdown hard-break slashes. Also accept
 // separate supported declarations in a paragraph, rather than treating the
 // remaining functions as parameters of the first one.
 const lines=source.replace(/\r\n?|[\u2028\u2029]/g,'\n').replace(/\u00a0/g,' ').replace(/\\[ \t]*(?=\n|$)/g,'').replace(/;\s*(?=function\s*:)/gi,'\n').replace(/([.!?;])\s+(?=(?:function\s*:|[A-Za-z_][A-Za-z0-9_ -]{0,70}\s+(?:takes?|accepts?)\b))/gi,'$1\n').split('\n');
 for(const [index,raw] of lines.entries()){
  const line=raw.trim().replace(/^\d+[.)]\s*/, '');if(!line)continue;
  if(/^description\s*:/i.test(line)&&current){current.description=sentence(line.replace(/^description\s*:/i,''));explicitDescription=true;continue;}
  if(/^function\s*:/i.test(line)){const tail=line.replace(/^function\s*:\s*/i,'');const m=tail.match(/^(.*?)\s+\b(?:takes?|accepts?|with\s+parameters?|with\s+arguments?)\b\s*(.*)$/i);start(m?m[1]:tail,m?m[2]:'');continue;}
  const natural=line.match(/^(.*?)\s+\b(?:takes?|accepts?|with\s+parameters?|with\s+arguments?)\b\s*(.*)$/i);
  if(natural){start(natural[1],natural[2]);continue;}
  if(/^(?:create|make|write|define|add)\s+(?:a\s+)?function\b|^function\s+[A-Za-z_]/i.test(line)){start(line);continue;}
  if(current&&allRequired.test(line)&&line.replace(allRequired,'').replace(/[\s.,]/g,'')===''){globalRequired=true;continue;}
  if(current&&new RegExp('^(?:[-*]\\s*)?'+namePattern+'\\s*[:(]').test(line)){parameter(line);continue;}
  if(current&&/^parameters?\s*:/i.test(line)){argumentsText(line.replace(/^parameters?\s*:/i,''));continue;}
  warn(`Line ${index+1} was not converted: “${line.slice(0,90)}”. Use Function: name, then name: type, required/optional.`);
 }
 finish();
 if(!tools.length)warn('No function declarations were found. Use the examples or add a function manually.');
 return {tools,warnings};
}

export const examples=[
 {name:'Functions',text:'Function: add numbers\nDescription: Add two numbers and return their sum.\na: number, required\nb: number, required\n\nFunction: greet\nDescription: Build a greeting for a person.\nname: string, required\ngreeting: string, optional\n\nFunction: multiply numbers\nDescription: Multiply two numbers and return their product.\na: number, required\nb: number, required'},
 {name:'Plain English',text:'Add numbers takes a and b, both required.\nGet weather takes city string required and units string optional.\nMultiply two numbers takes a and b, both required.'},
 {name:'Nested order',text:'Function: create order\nDescription: Create an order for a customer.\ncustomer: object, required\ncustomer.name: string, required\ncustomer.email: string, optional\nitems: array of objects, required\nitems[].sku: string, required\nitems[].quantity: integer, required, minimum 1\nstatus: string, optional, enum [draft, confirmed]'},
 {name:'Needs review',text:'Function: find books\nDescription: Find books using the requested filters.\nfilters: object\nfilters.query: string, required\nlimit: integer, optional, minimum 1, maximum 100\nmetadata: array'},
];
