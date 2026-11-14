import {validateProject,projectId,type StudioProject,type StudioIssue} from './project';
export const ANGULAR_VERSION='22.2.6';
export const ANGULAR_CLI_VERSION='22.2.7';
export type AngularExample='essentials'|'modules'|'material';
export function isAngularProject(project:StudioProject){return Object.hasOwn(project.files,'angular.json');}
export function needsNode(project:StudioProject){return project.kind==='nextjs'||isAngularProject(project);}
export function studioStorageKey(project:StudioProject){return isAngularProject(project)?'angular':project.kind;}
export function angularTemplate(example:AngularExample='essentials'):StudioProject{
 const dependencies:Record<string,string>={};
 for(const name of ['common','compiler','core','forms','platform-browser','router'])dependencies['@angular/'+name]=ANGULAR_VERSION;
 Object.assign(dependencies,{rxjs:'7.8.2',tslib:'2.8.1'});
 if(example==='material')Object.assign(dependencies,{'@angular/material':'22.2.7','@angular/cdk':'22.2.7'});
 const files:Record<string,string>={
  'package.json':JSON.stringify({name:'sukoaa-angular-project',version:'1.0.0',private:true,scripts:{dev:'ng serve --host 0.0.0.0 --port 4200 --allowed-hosts',build:'ng build --configuration production'},dependencies,devDependencies:{'@angular/build':ANGULAR_CLI_VERSION,'@angular/cli':ANGULAR_CLI_VERSION,'@angular/compiler-cli':ANGULAR_VERSION,typescript:'6.0.3'}},null,2),
  'angular.json':JSON.stringify({version:1,cli:{analytics:false,cache:{enabled:true,environment:'all'}},projects:{playground:{projectType:'application',root:'',sourceRoot:'src',architect:{build:{builder:'@angular/build:application',options:{browser:'src/main.ts',index:'src/index.html',tsConfig:'tsconfig.app.json',styles:['src/styles.css'],outputPath:'dist/playground'},configurations:{production:{outputHashing:'all'},development:{optimization:false,extractLicenses:false,sourceMap:true}},defaultConfiguration:'development'},serve:{builder:'@angular/build:dev-server',configurations:{development:{buildTarget:'playground:build:development'}},defaultConfiguration:'development'}}}}},null,2),
  'tsconfig.json':JSON.stringify({compilerOptions:{target:'ES2022',module:'preserve',moduleResolution:'bundler',lib:['ES2022','dom'],strict:true,skipLibCheck:true,experimentalDecorators:true,importHelpers:true,isolatedModules:true},angularCompilerOptions:{strictTemplates:true}},null,2),
  'tsconfig.app.json':JSON.stringify({extends:'./tsconfig.json',compilerOptions:{outDir:'./out-tsc/app',types:[]},files:['src/main.ts'],include:['src/**/*.d.ts']},null,2),
  'src/index.html':'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>My Angular project</title><base href="/"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><app-root></app-root></body></html>',
  'src/main.ts':`import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/routes';
bootstrapApplication(App, { providers: [provideRouter(routes), provideHttpClient()] }).catch(console.error);
`,
  'src/app/app.ts':`import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({selector:'app-root', imports:[RouterLink, RouterOutlet], templateUrl:'./app.html'})
export class App {}
`,
  'src/app/app.html':`<main><header><span class="eyebrow">SUKOAA · ANGULAR 22</span><nav><a routerLink="/">Playground</a><a routerLink="/about">Lazy route</a></nav></header><router-outlet /></main>`,
  'src/app/routes.ts':`import { Routes } from '@angular/router';
import { Home } from './home';
export const routes: Routes = [
 {path:'', component:Home},
 {path:'about', loadComponent:()=>import('./about').then(m=>m.About)},
 {path:'**', redirectTo:''}
];
`,
  'src/app/about.ts':`import { Component } from '@angular/core';
@Component({selector:'app-about', template:'<section class="card"><h1>A lazy-loaded route.</h1><p>This component is loaded when you visit /about.</p></section>'})
export class About {}
`,
  'src/app/home.ts':`import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TodoService } from './todo.service';
import { Stats } from './stats';
@Component({selector:'app-home', imports:[FormsModule, Stats], templateUrl:'./home.html'})
export class Home {
 readonly todos=inject(TodoService);
 readonly http=inject(HttpClient);
 readonly count=signal(0);
 readonly doubled=computed(()=>this.count()*2);
 readonly response=signal('No API call yet.');
 draft='';
 add(){if(this.draft.trim()){this.todos.add(this.draft.trim());this.draft='';}}
 increment(){this.count.update(n=>n+1);console.log('Count:',this.count());}
 load(){this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe({next:data=>{this.response.set(JSON.stringify(data,null,2));console.log('API response',data);},error:error=>{this.response.set(error.message);console.error(error);}});}
}
`,
  'src/app/home.html':`<h1>Your Angular idea.<br>Ready to run.</h1><p>Signals, forms, dependency injection and lazy routing in a real project.</p>
<section class="card"><h2>Signals &amp; computed</h2><button (click)="increment()">Count: {{count()}}</button><p>Double: {{doubled()}}</p></section>
<section class="card"><h2>Forms &amp; control flow</h2><form (ngSubmit)="add()"><input name="task" [(ngModel)]="draft" placeholder="Add a task"><button type="submit">Add task</button></form>
@if(todos.items().length){<ul>@for(item of todos.items();track item.id){<li>{{item.text}}</li>}</ul>}@else{<p>No tasks yet. Add your first one.</p>}</section>
@defer (on idle) {<app-stats [total]="todos.items().length" />} @placeholder {<p>Loading statistics…</p>}
<section class="card"><h2>HTTP &amp; API inspector</h2><p>This button contacts JSONPlaceholder, a public demo API.</p><button (click)="load()">Load sample API</button><pre>{{response()}}</pre></section>
`,
  'src/app/todo.service.ts':`import { Injectable, signal } from '@angular/core';
@Injectable({providedIn:'root'})
export class TodoService {
 readonly items=signal<{id:number;text:string}[]>([]);
 add(text:string){this.items.update(items=>[...items,{id:Date.now(),text}]);}
}
`,
  'src/app/stats.ts':`import { Component, input } from '@angular/core';
@Component({selector:'app-stats', template:'<aside class="card">Tasks in your list: {{total()}}</aside>'})
export class Stats {readonly total=input.required<number>();}
`,
  'src/styles.css':'*{box-sizing:border-box}body{margin:0;background:#f4f6ef;color:#243e32;font-family:system-ui}main{max-width:850px;margin:auto;padding:32px 24px}header{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}nav{display:flex;gap:18px}a{color:#3d6137}.eyebrow{font-size:12px;letter-spacing:2px}h1{font-size:clamp(30px,6vw,52px);line-height:1.1}.card{background:white;border:1px solid #dfe7d4;border-radius:16px;padding:24px;margin:20px 0}button{background:#294b35;color:white;border:0;border-radius:8px;padding:12px 18px;cursor:pointer}input{padding:12px;border:1px solid #cbd8c0;border-radius:8px;margin-right:8px;max-width:100%}form{display:flex;gap:8px;flex-wrap:wrap}pre{white-space:pre-wrap;overflow-wrap:anywhere}p{line-height:1.6}',
  'README.md':`# My Sukoaa Angular project

Angular ${ANGULAR_VERSION}; Angular CLI ${ANGULAR_CLI_VERSION}; TypeScript 6.0.3.
Use a supported desktop Chromium browser, HTTPS and cross-origin isolation for browser Node execution. Initial npm install requires internet and can take a few minutes.

Run project to install dependencies and start ng serve. Save & sync sends editor changes to the running dev server.
Install a browser-compatible library in the terminal with npm install package-name@version. Copy installed dependency changes from the runtime using Pull runtime files before saving or exporting. Stop/restart after dependency changes.

All @angular/* framework packages must use matching versions. Check the Angular compatibility table before changing Angular or TypeScript.

Local alternative: export ZIP, npm install, npm run dev. Angular 22 needs Node ^22.22.3, ^24.15.0 or >=26.

Browser-compatible Angular libraries and NgModules are supported subject to their peer dependencies. Native addons, OS processes, arbitrary database servers, SSR deployment and unrestricted filesystem/network access are not guaranteed in a browser.

WebContainer commercial production usage requires an eligible provider license. AI is disabled in Sukoaa.
`
 };
 if(example==='modules'){
  files['src/main.ts']=`import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
platformBrowser().bootstrapModule(AppModule).catch(console.error);
`;
  files['src/app/app.ts']=`import { Component, signal } from '@angular/core';
@Component({selector:'app-root',standalone:false,templateUrl:'./app.html'})
export class App {readonly count=signal(0);name='Sukoaa';}
`;
  files['src/app/app.html']=`<main><p class="eyebrow">ANGULAR · NGMODULE EXAMPLE</p><h1>Hello, {{name}}.</h1><section class="card"><input name="name" [(ngModel)]="name"><button (click)="count.update(n => n + 1)">Count: {{count()}}</button></section></main>`;
  files['src/app/app.html']=files['src/app/app.html'].replace('count.update(n => n + 1)','count.set(count() + 1)');
  files['src/app/app.module.ts']=`import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { App } from './app';
@NgModule({declarations:[App],imports:[BrowserModule, FormsModule],providers:[provideZonelessChangeDetection()],bootstrap:[App]})
export class AppModule {}
`;
 }
 if(example==='material'){
  files['src/app/home.ts']=files['src/app/home.ts'].replace("import { FormsModule }", "import { MatButtonModule } from '@angular/material/button';\nimport { FormsModule }").replace('imports:[FormsModule, Stats]','imports:[FormsModule, Stats, MatButtonModule]');
  files['src/app/home.html']=files['src/app/home.html'].replace('<button (click)="increment()">','<button matButton="filled" (click)="increment()">');
  files['src/styles.css']="@import '@angular/material/prebuilt-themes/azure-blue.css';\n"+files['src/styles.css'];
 }
 return validateProject({version:1,id:projectId(),name:'My Angular project',kind:'react',files,folders:[],entry:'src/main.ts'});
}
export function angularTerminalIssue(text:string,files:Record<string,string>):StudioIssue|undefined {
 const clean=text.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g,'');
 const match=[...clean.matchAll(/([\w./-]+\.(?:tsx?|jsx?|html|s?css)):(\d+):(\d+)/g)].at(-1);
 if(!match)return;
 const file=Object.keys(files).find(path=>match[1]===path||match[1].endsWith('/'+path));
 if(!file)return;
 return {file,line:Number(match[2]),column:Number(match[3]),message:clean.slice(0,1500),source:'Angular compiler'};
}

export function supportsAngularNode(version:string){const [major,minor,patch]=version.replace(/^v/,'').split('.').map(Number);return major===22&&(minor>22||minor===22&&patch>=3)||major===24&&minor>=15||major>=26;}

export function angularExample(project:StudioProject):AngularExample{if(project.files['src/main.ts']?.includes('bootstrapModule'))return 'modules';return project.files['src/app/home.ts']?.includes('MatButtonModule')?'material':'essentials';}
