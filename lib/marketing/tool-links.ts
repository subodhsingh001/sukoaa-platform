const quickGuides:Record<string,string>={javascript:'javascript',python:'python',typescript:'typescript',html:'html-css',sql:'sql',json:'json',c:'c',cpp:'cpp',rust:'rust',csharp:'csharp',java:'java'};
const actionLabels:Record<string,string>={
 '/tools/angular':'Open Angular project studio',
 '/tools/html-css':'Open HTML and CSS studio',
 '/tools/javascript':'Open JavaScript playground',
 '/tools/json':'Open JSON validator',
 '/tools/nextjs':'Open Next.js project studio',
 '/tools/notepad':'Open online notepad',
 '/labs/postgresql':'Open PostgreSQL compiler',
 '/tools/python':'Open Python playground',
 '/tools/rag-playground':'Open RAG playground',
 '/tools/react':'Open React project studio',
 '/tools/token-counter':'Open LLM token counter',
 '/tools/tool-schema-generator':'Open tool schema generator',
 '/tools/typescript':'Open TypeScript playground'
};
export function toolActionLabel(href:string){return actionLabels[href]||'Open coding tool';}
export function toolLandingHref(href:string){const url=new URL(href,'https://sukoaa.invalid');if(url.pathname==='/workspace'){const slug=quickGuides[url.searchParams.get('language')||''];return slug?'/tools/'+slug:'/tools'}if(url.pathname==='/studio')return '/tools/'+(url.searchParams.get('framework')==='angular'?'angular':url.searchParams.get('framework')==='nextjs'?'nextjs':'react');if(url.pathname==='/native')return '/tools/react-native';return href}
