import test from 'node:test';import assert from 'node:assert/strict';
import {angularTemplate,isAngularProject,needsNode,studioStorageKey,angularTerminalIssue,supportsAngularNode} from '../lib/studio/angular';
import {template,validateProject} from '../lib/studio/project';
import {importFiles} from '../lib/studio/client';
test('Angular projects preserve their source format and use their own draft and Node runtime',()=>{
 const project=angularTemplate();assert.equal(isAngularProject(project),true);assert.equal(needsNode(project),true);assert.equal(studioStorageKey(project),'angular');assert.equal(needsNode(template('react')),false);assert.equal(studioStorageKey(template('react')),'react');assert.equal(needsNode(template('nextjs')),true);assert.deepEqual(validateProject(JSON.parse(JSON.stringify(project))),project);
 const pkg=JSON.parse(project.files['package.json']);assert.equal(pkg.dependencies['@angular/core'],'22.2.6');assert.equal(pkg.dependencies['@angular/forms'],'22.2.6');assert.equal(pkg.devDependencies.typescript,'6.0.3');
});
test('Angular starters retain external templates, NgModules and Material imports',()=>{
 const modern=angularTemplate();assert.match(modern.files['src/app/home.html'],/@for/);assert.match(modern.files['src/app/home.html'],/@defer/);assert.match(modern.files['src/app/routes.ts'],/loadComponent/);
 const modules=angularTemplate('modules');assert.match(modules.files['src/app/app.ts'],/standalone:false/);assert.match(modules.files['src/app/app.module.ts'],/FormsModule/);
 const material=angularTemplate('material');assert.ok(JSON.parse(material.files['package.json']).dependencies['@angular/material']);assert.match(material.files['src/app/home.ts'],/MatButtonModule/);
});
test('Angular ZIP import detects angular.json and keeps Sass source and the entry',async()=>{
 const {zipSync,strToU8}=await import('fflate');const project=angularTemplate();project.files['src/styles.scss']='p {color: green}';const zipped=zipSync(Object.fromEntries(Object.entries(project.files).map(([path,value])=>[path,strToU8(value)])));
 const file={name:'project.zip',size:zipped.length,arrayBuffer:async()=>zipped.buffer} as File;const result=await importFiles([file] as unknown as FileList,template('react'));assert.equal(isAngularProject(result.project),true);assert.equal(result.project.entry,'src/main.ts');assert.equal(result.project.files['src/styles.scss'],'p {color: green}');
});
test('Angular diagnostics target real TS, HTML and Sass files; Node compatibility follows Angular 22',()=>{
 const files={'src/app/home.html':'<p>Example</p>','src/styles.scss':'p{}'};assert.equal(angularTerminalIssue('src/app/home.html:4:9 error',files)?.line,4);assert.equal(angularTerminalIssue('/sukoaa/src/styles.scss:2:1 error',files)?.file,'src/styles.scss');assert.equal(angularTerminalIssue('missing.ts:2:1',files),undefined);
 for(const version of ['22.22.3','24.15.0','26.0.0'])assert.equal(supportsAngularNode(version),true);for(const version of ['20.19.0','22.22.2','24.14.9','23.1.0','garbage'])assert.equal(supportsAngularNode(version),false);
});
