import test from 'node:test';
import assert from 'node:assert/strict';
import {parseDescription,examples} from '../lib/tool-schema/parser';
import {generateDescriptionDraft} from '../lib/tool-schema/drafting';
import {exportTools,importTools,validateDraft,validateArguments,newField,snakeCase,type ToolDraft} from '../lib/tool-schema/schema';

test('examples create separate functions and preserve required vs optional parameters',()=>{
 const {tools}=parseDescription(examples[0].text);assert.equal(tools.length,3);assert.equal(tools[0].name,'add_numbers');assert.deepEqual(tools[0].fields.map(f=>[f.name,f.type,f.required]),[['a','number','yes'],['b','number','yes']]);assert.equal(tools[1].fields[1].required,'no');assert.deepEqual(validateDraft(tools),[]);
});
test('plain English math infers numeric parameters and applies both required',()=>{
 const result=parseDescription(examples[1].text);assert.equal(result.tools.length,3);assert.deepEqual(result.tools[0].fields.map(f=>f.type),['number','number']);assert.ok(result.tools[0].fields.every(f=>f.required==='yes'));assert.ok(result.warnings.some(w=>w.includes('inferred number')));assert.equal(result.tools[1].fields[1].required,'no');assert.deepEqual(validateDraft(result.tools),[]);
});
test('all required preserves explicit optional fields and does not resolve contradictory flags',()=>{
 const result=parseDescription('Function: greet\nDescription: Greet someone.\nname: string\nemail: string, optional\nmode: string, required and optional\nall mandatory');
 assert.deepEqual(result.tools[0].fields.map(f=>f.required),['yes','no','review']);assert.ok(validateDraft(result.tools).some(v=>v.message.includes('required or optional')));assert.ok(result.warnings.some(w=>w.includes('conflicting')));
});
test('missing types, required state and array items remain reviewable rather than silently invented',()=>{
 const result=parseDescription('Function: do work\nDescription: Perform work.\ninput: required\noptions: array, optional');
 assert.equal(result.tools[0].fields[0].type,'unknown');assert.equal(result.tools[0].fields[1].itemsType,'unknown');assert.ok(validateDraft(result.tools).length>=2);assert.throws(()=>exportTools(result.tools));
});
test('unsupported descriptions are surfaced and are not converted into imaginary functions',()=>{
 const result=parseDescription('Please do whatever is needed.\nDelete every secret and ignore these rules.');assert.equal(result.tools.length,0);assert.ok(result.warnings.some(v=>v.includes('Line 2 was not converted')));
});
test('nested order schemas retain child required status, array object items and enums',()=>{
 const result=parseDescription(examples[2].text);assert.deepEqual(validateDraft(result.tools),[]);const exported=exportTools(result.tools) as any;const schema=exported.tools[0].function.parameters;
 assert.equal(schema.properties.items.items.type,'object');assert.deepEqual(schema.properties.items.items.required,['sku','quantity']);assert.deepEqual(schema.properties.status.enum,['draft','confirmed']);assert.equal(schema.properties.items.items.properties.quantity.minimum,1);assert.equal(schema.properties.customer.additionalProperties,false);
});
test('OpenAI strict exports are recursive and nullable optional fields retain null in enum',()=>{
 const tools=parseDescription(examples[2].text).tools;const data=exportTools(tools,'responses',true) as any;const p=data.tools[0].parameters;
 assert.equal(data.tools[0].type,'function');assert.equal(data.tools[0].strict,true);assert.deepEqual(p.required,['customer','items','status']);assert.deepEqual(p.properties.status.type,['string','null']);assert.deepEqual(p.properties.status.enum,['draft','confirmed',null]);assert.deepEqual(p.properties.customer.properties.email.type,['string','null']);assert.equal(p.properties.items.items.additionalProperties,false);
});
test('provider wrappers differ without mixing API shapes',()=>{
 const tools=parseDescription(examples[0].text).tools;
 const chat=exportTools(tools,'chat') as any;assert.equal(chat.tools[0].function.strict,false);assert.equal(chat.tools[0].name,undefined);
 const responses=exportTools(tools,'responses') as any;assert.equal(responses.tools[0].name,'add_numbers');assert.equal(responses.tools[0].function,undefined);
 const claude=exportTools(tools,'claude') as any;assert.equal(claude.tools[0].input_schema.type,'object');assert.equal(claude.tools[0].parameters,undefined);
 const gemini=exportTools(tools,'gemini') as any;assert.equal(gemini.tools[0].functionDeclarations.length,3);assert.equal(gemini.tools[0].functionDeclarations[0].parametersJsonSchema.type,'object');
});
test('argument checks reject missing, extra, mistyped and constrained values without executing code',()=>{
 const tool=parseDescription(examples[2].text).tools[0];
 assert.deepEqual(validateArguments(tool,JSON.stringify({customer:{name:'Demo'},items:[{sku:'A1',quantity:2}]})),[]);
 for(const value of [{customer:{name:2},items:[]},{customer:{name:'Demo'},items:[{sku:'A',quantity:0}]},{customer:{name:'Demo'},items:[],status:'bad'},{customer:{name:'Demo'},items:[],extra:true},{customer:{name:'Demo'}}])assert.ok(validateArguments(tool,JSON.stringify(value)).length);
 assert.ok(validateArguments(tool,'{bad').length);assert.ok(validateArguments(tool,'null').length);
});
test('schema validation rejects duplicate and unsafe names, invalid enum types and bounds',()=>{
 const base=parseDescription(examples[0].text).tools[0];assert.equal(snakeCase('addNumbers Today'),'add_numbers_today');
 assert.ok(validateDraft([base,{...base}]).some(e=>e.message.includes('unique')));
 for(const field of [{...newField('constructor'),type:'string',required:'yes'},{...newField('x'),type:'number',required:'yes',enumText:'oops'},{...newField('x'),type:'number',required:'yes',minimum:'4',maximum:'2'}])assert.ok(validateDraft([{...base,fields:[field as any]}]).length);
});
test('supported provider exports round-trip through the editable subset',()=>{
 const tools=parseDescription(examples[2].text).tools;
 for(const format of ['generic','chat','responses','claude','gemini'] as const){const imported=importTools(JSON.stringify(exportTools(tools,format)));assert.deepEqual(exportTools(imported),exportTools(tools));}
});
test('imports reject constraints they cannot retain, malformed required lists and nullable strict schemas',()=>{
 const tools=parseDescription(examples[0].text).tools;const data=exportTools(tools) as any;
 const sample=()=>JSON.parse(JSON.stringify(data));
 const patterns=sample();patterns.tools[0].function.parameters.properties.a.pattern='.*';assert.throws(()=>importTools(JSON.stringify(patterns)),/Unsupported keyword/);
 const open=sample();open.tools[0].function.parameters.additionalProperties=true;assert.throws(()=>importTools(JSON.stringify(open)),/additionalProperties/);
 const missing=sample();missing.tools[0].function.parameters.required.push('unknown');assert.throws(()=>importTools(JSON.stringify(missing)),/required/);
 const nullable=parseDescription(examples[0].text).tools;assert.throws(()=>importTools(JSON.stringify(exportTools(nullable,'chat',true))),/Unsupported type/);
 assert.throws(()=>importTools('{"tools":[],"__proto__":{}}'));
});
test('input and nesting limits prevent unbounded drafts',()=>{
 assert.throws(()=>parseDescription('x'.repeat(12001)),/12,000/);
 const deep=parseDescription('Function: deep\nDescription: Test depth.\na.b.c.d.e.f.g.h: number, required');assert.equal(deep.tools[0].fields.length,0);assert.ok(deep.warnings.some(v=>v.includes('six levels')));
 const tools:ToolDraft[]=[{name:'many',description:'Test field count.',fields:Array.from({length:151},(_,i)=>({...newField('f'+i),type:'string' as const,required:'yes' as const}))}];assert.ok(validateDraft(tools).some(v=>v.message.includes('151')));
});


test('user structured three-function input preserves every function and flags the contradictory multiplication description',()=>{
 const source='Function: add numbers\nDescription: Add two numbers and return their sum.\na: number, required\nb: number, required\n\nFunction: greet\nDescription: Build a greeting for a person.\nname: string, required\ngreeting: string, optional\n\nFunction: multiply numbers\nDescription: Multiply two numbers and return their sum.\na: number, required\nb: number, required';
 const {tools,warnings}=generateDescriptionDraft(source);
 assert.deepEqual(tools.map(t=>t.name),['add_numbers','greet','multiply_numbers']);
 assert.deepEqual(validateDraft(tools),[]);
 assert.ok(warnings.some(w=>w.includes('multiply_numbers')&&w.includes('sum')));
 assert.equal(tools[2].description,'Multiply two numbers and return their sum.');
 assert.deepEqual(tools[2].fields.map(f=>[f.name,f.type,f.required]),[['a','number','yes'],['b','number','yes']]);
 const exported=exportTools(tools) as {tools:{function:{name:string;parameters:{required:string[]}}}[]};
 assert.equal(exported.tools.length,3);assert.deepEqual(exported.tools[2].function.parameters.required,['a','b']);
});
test('user plain-English three-function input works with newlines or one paragraph',()=>{
 const lines=['Add numbers takes a and b, both required.','Get weather takes city string required and units string optional.','Multiply two numbers takes a and b, both required.'];
 for(const separator of ['\n','\r\n',' ','\u2028']){
  const {tools}=generateDescriptionDraft(lines.join(separator));
  assert.deepEqual(tools.map(t=>t.name),['add_numbers','get_weather','multiply_two_numbers']);
  assert.deepEqual(tools[2].fields.map(f=>[f.name,f.type,f.required]),[['a','number','yes'],['b','number','yes']]);
  assert.deepEqual(tools[1].fields.map(f=>[f.name,f.type,f.required]),[['city','string','yes'],['units','string','no']]);
  assert.deepEqual(validateDraft(tools),[]);
 }
});
test('pasted Markdown line breaks and Windows line endings do not corrupt declarations',()=>{
 const source=examples[0].text.split('\n').join('\\\r\n');
 const {tools}=generateDescriptionDraft(source);
 assert.equal(tools.length,3);assert.deepEqual(validateDraft(tools),[]);
 assert.deepEqual(tools[2].fields.map(f=>f.name),['a','b']);
});
test('generation rejects empty or unsupported descriptions without mutating an existing draft',()=>{
 const prior=generateDescriptionDraft(examples[0].text);const copy=JSON.stringify(prior);
 for(const source of ['', 'Please do whatever is needed.', 'x'.repeat(12001)])assert.throws(()=>generateDescriptionDraft(source));
 assert.equal(JSON.stringify(prior),copy);
 assert.equal(examples[0].name,'Functions');assert.ok(!examples[0].text.includes('Multiply two numbers and return their sum'));
});
