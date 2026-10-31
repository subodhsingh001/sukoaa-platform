/* User code is only parsed/transpiled here, never evaluated in the compiler worker. */
importScripts('/runtime/typescript.js');
onmessage = (event) => {
  const {source,react,javascript}=event.data;
  const filename=react?'App.tsx':javascript?'main.js':'main.ts';
  const diagnostic=(d)=>{const pos=d.file&&typeof d.start==='number'?d.file.getLineAndCharacterOfPosition(d.start):undefined;return {message:ts.flattenDiagnosticMessageText(d.messageText,'\n'),line:pos?pos.line+1:undefined,column:pos?pos.character+1:undefined,source:filename}};
  try {
    const file=ts.createSourceFile(filename,source,ts.ScriptTarget.ES2020,true,react?ts.ScriptKind.TSX:javascript?ts.ScriptKind.JS:ts.ScriptKind.TS);
    const host={getSourceFile:name=>name===filename?file:undefined,writeFile(){},getDefaultLibFileName:()=>'',getCurrentDirectory:()=>'',getDirectories:()=>[],fileExists:name=>name===filename,readFile:name=>name===filename?source:undefined,getCanonicalFileName:name=>name,useCaseSensitiveFileNames:()=>true,getNewLine:()=>String.fromCharCode(10)};
    const program=ts.createProgram([filename],{noLib:true,noResolve:true,allowJs:true,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React},host);
    const errors=program.getSyntacticDiagnostics(file).filter(d=>d.category===ts.DiagnosticCategory.Error);
    if(errors.length){postMessage({error:'Syntax error',diagnostics:errors.slice(0,20).map(diagnostic)});return}
    let moduleNode;
    function visit(node){
      if(!moduleNode&&(ts.isImportDeclaration(node)||ts.isImportEqualsDeclaration(node)||ts.isExportDeclaration(node)||ts.isExportAssignment(node)||node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)||(ts.isCallExpression(node)&&node.expression.kind===ts.SyntaxKind.ImportKeyword)))moduleNode=node;
      ts.forEachChild(node,visit);
    }
    visit(file);
    if(moduleNode){const pos=file.getLineAndCharacterOfPosition(moduleNode.getStart(file));postMessage({error:'Unsupported module',diagnostics:[{message:'Imports and exports are unsupported in this single-file playground. For React, define App() and use the provided React global.',line:pos.line+1,column:pos.character+1,source:filename}]});return}
    if(javascript){postMessage({code:source});return}
    const result=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None,jsx:ts.JsxEmit.React,isolatedModules:true,sourceMap:true},fileName:filename,reportDiagnostics:true});
    const emitErrors=(result.diagnostics||[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
    if(emitErrors.length){postMessage({error:'Compilation error',diagnostics:emitErrors.slice(0,20).map(diagnostic)});return}
    postMessage({code:result.outputText,sourceMap:result.sourceMapText});
  } catch(error){postMessage({error:error.message,diagnostics:[{message:error.message}]})}
};
