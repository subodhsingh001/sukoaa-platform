export const fieldTypes=['string','number','integer','boolean','array','object'] as const;
export type FieldType=typeof fieldTypes[number]|'unknown';
export type Required='yes'|'no'|'review';
export type Field={name:string;type:FieldType;description:string;required:Required;enumText:string;minimum:string;maximum:string;itemsType:FieldType;children:Field[]};
export type ToolDraft={name:string;description:string;fields:Field[]};
export type ExportFormat='generic'|'chat'|'responses'|'claude'|'gemini';
export type Issue={path:string;message:string};
export type JsonSchema={type:string;description?:string;properties?:Record<string,JsonSchema>;required?:string[];additionalProperties?:boolean;items?:JsonSchema;enum?:unknown[];minimum?:number;maximum?:number};
export const LIMITS={tools:20,fields:150,depth:6,input:12000,json:100000};
const blocked=new Set(['__proto__','prototype','constructor']);
export const snakeCase=(text:string)=>text.replace(/([a-z0-9])([A-Z])/g,'$1_$2').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
export const newField=(name=''):Field=>({name,type:'unknown',description:'',required:'review',enumText:'',minimum:'',maximum:'',itemsType:'unknown',children:[]});
export const newTool=():ToolDraft=>({name:'new_function',description:'',fields:[]});
function enumValues(field:Field):unknown[]{return field.enumText.split('|').map(s=>s.trim()).filter(Boolean).map(value=>field.type==='string'?value:JSON.parse(value));}
function primitive(value:unknown,type:string){return type==='number'?typeof value==='number'&&Number.isFinite(value):type==='integer'?Number.isInteger(value):typeof value===type;}
export function validateDraft(tools:ToolDraft[]):Issue[]{
 const errors:Issue[]=[];let count=0;
 const add=(path:string,message:string)=>errors.push({path,message});
 if(!tools.length||tools.length>LIMITS.tools)add('tools',`Add 1–${LIMITS.tools} functions.`);
 const names=new Set<string>();
 function fields(list:Field[],path:string,depth:number){
  if(depth>LIMITS.depth){add(path,'Nesting is limited to six levels.');return;}
  const seen=new Set<string>();
  for(const field of list){
   if(++count>LIMITS.fields){add('tools','Keep the total below 151 fields.');return;}
   const at=path+'.'+(field.name||'(unnamed)');
   if(!/^[A-Za-z_][A-Za-z0-9_]{0,63}$/.test(field.name)||blocked.has(field.name))add(at,'Use a safe parameter name of 1–64 letters, digits or underscores.');
   if(seen.has(field.name))add(at,'Duplicate parameter name.');seen.add(field.name);
   if(!(fieldTypes as readonly string[]).includes(field.type))add(at,'Choose a parameter type.');
   if(field.required==='review')add(at,'Choose required or optional.');
   if(!['yes','no','review'].includes(field.required))add(at,'Invalid required state.');
   if(field.description.length>500)add(at,'Parameter descriptions are limited to 500 characters.');
   if(field.type==='array'&&(!(fieldTypes as readonly string[]).includes(field.itemsType)||field.itemsType==='array'))add(at,'Choose an item type. Arrays of arrays are not supported in this editor.');
   if(field.type==='object'||field.type==='array'&&field.itemsType==='object')fields(field.children,at+(field.type==='array'?'[]':''),depth+1);
   if(field.enumText){
    if(!['string','number','integer','boolean'].includes(field.type))add(at,'Enums are supported on primitive parameters only.');
    try{const values=enumValues(field);if(!values.length||values.length>30||values.some(v=>!primitive(v,field.type)))throw Error();if(new Set(values.map(v=>JSON.stringify(v))).size!==values.length)add(at,'Enum values must be unique.');}catch{add(at,'Use up to 30 enum values separated by |. Numeric and boolean values must match the selected type.');}
   }
   if(field.minimum!==''||field.maximum!==''){
    if(!['number','integer'].includes(field.type))add(at,'Minimum and maximum apply to numbers only.');
    const min=field.minimum===''?undefined:Number(field.minimum),max=field.maximum===''?undefined:Number(field.maximum);
    if(min!==undefined&&!Number.isFinite(min)||max!==undefined&&!Number.isFinite(max))add(at,'Bounds must be finite numbers.');
    if(min!==undefined&&max!==undefined&&min>max)add(at,'Minimum cannot exceed maximum.');
   }
  }
 }
 for(const [i,tool] of tools.entries()){
  const path=`tools[${i+1}]`;
  if(!/^[a-z_][a-z0-9_]{0,63}$/.test(tool.name)||blocked.has(tool.name))add(path,'Use a snake_case function name of 1–64 characters, starting with a letter or underscore.');
  if(names.has(tool.name))add(path,'Function names must be unique.');names.add(tool.name);
  if(!tool.description.trim()||tool.description.length>500)add(path,'Write a description of 1–500 characters.');
  fields(tool.fields,path,1);
 }
 return errors;
}
function objectSchema(fields:Field[]):JsonSchema{
 const properties:Record<string,JsonSchema>=Object.create(null);
 for(const field of fields){
  const node:JsonSchema=field.type==='object'?objectSchema(field.children):{type:field.type};
  if(field.description.trim())node.description=field.description.trim();
  if(field.type==='array')node.items=field.itemsType==='object'?objectSchema(field.children):{type:field.itemsType};
  if(field.enumText)node.enum=enumValues(field);
  if(field.minimum!=='')node.minimum=Number(field.minimum);
  if(field.maximum!=='')node.maximum=Number(field.maximum);
  properties[field.name]=node;
 }
 return {type:'object',properties,required:fields.filter(f=>f.required==='yes').map(f=>f.name),additionalProperties:false};
}
type StrictSchema=Omit<JsonSchema,'type'|'properties'|'items'>&{type:string|string[];properties?:Record<string,StrictSchema>;items?:StrictSchema};
function strictSchema(source:JsonSchema,optional=false):StrictSchema{
 const out:StrictSchema={...source,type:optional?[source.type,'null']:source.type};
 if(source.enum&&optional)out.enum=[...source.enum,null];
 if(source.properties){out.properties=Object.fromEntries(Object.entries(source.properties).map(([key,value])=>[key,strictSchema(value,!source.required?.includes(key))]));out.required=Object.keys(source.properties);out.additionalProperties=false;}
 if(source.items)out.items=strictSchema(source.items);
 return out;
}
export function exportTools(tools:ToolDraft[],format:ExportFormat='generic',strict=false):unknown{
 const errors=validateDraft(tools);if(errors.length)throw Error(errors.map(e=>e.path+': '+e.message).join('\n'));
 const items=tools.map(tool=>({name:tool.name,description:tool.description.trim(),parameters:objectSchema(tool.fields)}));
 if(format==='gemini')return {tools:[{functionDeclarations:items.map(({name,description,parameters})=>({name,description,parametersJsonSchema:parameters}))}]};
 if(format==='claude')return {tools:items.map(({name,description,parameters})=>({name,description,input_schema:parameters}))};
 if(format==='responses')return {tools:items.map(item=>({...item,type:'function',parameters:strict?strictSchema(item.parameters):item.parameters,strict}))};
 return {tools:items.map(item=>({type:'function',function:{...item,...(format==='chat'?{parameters:strict?strictSchema(item.parameters):item.parameters,strict}:{})}}))};
}
export function validateArguments(tool:ToolDraft,text:string):Issue[]{
 if(text.length>LIMITS.json)return [{path:'arguments',message:'Keep sample JSON under 100,000 characters.'}];
 const definition=validateDraft([tool]);if(definition.length)return definition;
 let value:unknown;try{value=JSON.parse(text);}catch{return [{path:'arguments',message:'Enter valid JSON. Comments and trailing commas are not JSON.'}];}
 const errors:Issue[]=[];let count=0;
 function visit(node:JsonSchema,data:unknown,path:string,depth:number){
  if(++count>5000||depth>10){if(errors.length<100)errors.push({path,message:'Sample exceeds the validation size/depth limit.'});return;}
  const fail=(message:string)=>{if(errors.length<100)errors.push({path,message});};
  if(node.type==='object'){
   if(!data||typeof data!=='object'||Array.isArray(data)){fail('Expected an object.');return;}
   const record=data as Record<string,unknown>;
   for(const key of node.required||[])if(!Object.hasOwn(record,key))fail(`Missing required parameter: ${key}.`);
   for(const [key,entry] of Object.entries(record)){if(count>5000)break;const child=node.properties?.[key];if(!child)fail(`Unknown parameter: ${key}.`);else visit(child,entry,path+'.'+key,depth+1);}
  }else if(node.type==='array'){
   if(!Array.isArray(data)){fail('Expected an array.');return;}
   for(let i=0;i<data.length&&count<=5000;i++)visit(node.items!,data[i],path+`[${i}]`,depth+1);
  }else if(!primitive(data,node.type))fail('Expected '+node.type+'.');
  if(node.enum&&!node.enum.some(v=>v===data))fail('Value is outside the allowed enum.');
  if(typeof data==='number'){if(node.minimum!==undefined&&data<node.minimum)fail('Value is below minimum.');if(node.maximum!==undefined&&data>node.maximum)fail('Value exceeds maximum.');}
 }
 visit(objectSchema(tool.fields),value,'arguments',0);return errors;
}

/** Import only the documented editable subset; never discard unknown constraints. */
export function importTools(text:string):ToolDraft[]{
 if(text.length>LIMITS.json)throw Error('Import is limited to 100,000 characters.');
 const parsed:unknown=JSON.parse(text);let count=0;
 const object=(value:unknown):Record<string,unknown>=>{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Expected a schema object.');return value as Record<string,unknown>;};
 const root=object(parsed);if(Object.keys(root).some(k=>k!=='tools'))throw Error('Import a tools-only request fragment. Remove unrelated request fields.');if(!Array.isArray(root.tools)||root.tools.length>LIMITS.tools)throw Error('Import a wrapper with tools: [...] and up to 20 functions.');
 let rows:unknown[]=root.tools;
 if(rows.length===1&&Array.isArray(object(rows[0]).functionDeclarations))rows=object(rows[0]).functionDeclarations as unknown[];
 function readNode(raw:unknown,name:string,required:Required,depth:number):Field{
  if(++count>LIMITS.fields||depth>LIMITS.depth)throw Error('Imported schema exceeds the field/depth limit.');
  const node=object(raw),allowed=['type','description','properties','required','additionalProperties','items','enum','minimum','maximum'];
  for(const key of Object.keys(node))if(!allowed.includes(key))throw Error(`Unsupported keyword ${key} at ${name}; import would lose information.`);
  if(typeof node.type!=='string'||!(fieldTypes as readonly string[]).includes(node.type))throw Error(`Unsupported type at ${name}. Unions, null and references are not editable in this version.`);
  const applicable=['type','description',...(node.type==='object'?['properties','required','additionalProperties']:node.type==='array'?['items']:['enum']),...(['number','integer'].includes(node.type)?['minimum','maximum']:[])];
  for(const key of Object.keys(node))if(!applicable.includes(key))throw Error(`Unsupported keyword ${key} for ${node.type} at ${name}.`);
  if(node.description!==undefined&&typeof node.description!=='string')throw Error('Descriptions must be strings.');
  const field={...newField(name),type:node.type as FieldType,required,description:node.description as string||''};
  if(node.enum!==undefined){if(!Array.isArray(node.enum)||node.enum.some(v=>typeof v==='string'&&(v.includes('|')||!v.trim()||v!==v.trim())))throw Error('Enum values cannot be empty or contain | in this editor.');field.enumText=node.enum.map(v=>String(v)).join(' | ');}
  for(const key of ['minimum','maximum'] as const)if(node[key]!==undefined){if(typeof node[key]!=='number'||!Number.isFinite(node[key]))throw Error('Bounds must be finite numbers.');field[key]=String(node[key]);}
  if(node.type==='object')field.children=readObject(node,depth);
  else if(node.type==='array'){
   const item=object(node.items);if(Object.keys(item).some(k=>k!=='type')&&item.type!=='object')throw Error('Item constraints are not editable in this version.');
   if(typeof item.type!=='string'||item.type==='array'||!(fieldTypes as readonly string[]).includes(item.type))throw Error('Unsupported array item type.');
   field.itemsType=item.type as FieldType;if(item.type==='object'){const allowedItem=['type','properties','required','additionalProperties'];if(Object.keys(item).some(k=>!allowedItem.includes(k)))throw Error('Unsupported object item keyword.');field.children=readObject(item,depth);}
  }else if(['properties','required','additionalProperties','items'].some(k=>k in node))throw Error('Object/array keywords found on a primitive.');
  return field;
 }
 function readObject(node:Record<string,unknown>,depth:number):Field[]{
  if(node.additionalProperties!==false)throw Error('Imported objects must explicitly use additionalProperties: false; open dictionaries are not supported.');
  const props=object(node.properties);const required=node.required??[];
  if(!Array.isArray(required)||required.some(v=>typeof v!=='string'||!Object.hasOwn(props,v))||new Set(required).size!==required.length)throw Error('Invalid required parameter list.');
  return Object.entries(props).map(([name,value])=>readNode(value,name,required.includes(name)?'yes':'no',depth+1));
 }
 const tools=rows.map(raw=>{
  const row=object(raw),node=object(row.function??row);
  if(row.type!==undefined&&row.type!=='function'||node.strict!==undefined&&typeof node.strict!=='boolean')throw Error('Invalid tool type or strict flag.');
  const keys=['name','description','parameters','parametersJsonSchema','input_schema','strict','type'];
  if(Object.keys(row).some(k=>!(row.function?['type','function']:keys).includes(k))||Object.keys(node).some(k=>!keys.includes(k)))throw Error('Unsupported tool-level fields.');
  if(typeof node.name!=='string'||typeof node.description!=='string')throw Error('Each function needs a name and description.');
  if(['parameters','input_schema','parametersJsonSchema'].filter(k=>k in node).length!==1)throw Error('Use exactly one parameter schema field.');
  const params=object(node.parameters??node.input_schema??node.parametersJsonSchema);
  if(params.type!=='object'||Object.keys(params).some(k=>!['type','properties','required','additionalProperties'].includes(k)))throw Error('Parameters must be a supported object schema.');
  return {name:node.name,description:node.description,fields:readObject(params,0)};
 });
 const issues=validateDraft(tools);if(issues.length)throw Error(issues.map(v=>v.path+': '+v.message).join('\n'));return tools;
}
