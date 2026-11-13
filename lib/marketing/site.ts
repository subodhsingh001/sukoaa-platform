import {isPubliclyReady} from './availability';
import {practiceHubPaths} from './practice-hubs';
import {practiceLessonPaths} from './practice-lessons';
import type {Metadata} from 'next';
export function canonicalOrigin(){
 const raw=process.env.SITE_URL||process.env.APP_ORIGIN;
 if(!raw)return undefined;
 try{const url=new URL(raw);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname)||/^(localhost|127\.|\[::1\])/.test(url.hostname))return undefined;return url.origin}catch{return undefined}
}
export function indexingEnabled(){return !!canonicalOrigin()&&process.env.SITE_INDEXING_ENABLED==='true'&&process.env.VERCEL_ENV!=='preview'}
export function pageMetadata(title:string,description:string,path:string):Metadata{
 const origin=canonicalOrigin();return {title,description,alternates:origin?{canonical:origin+path}:undefined,robots:{index:indexingEnabled()&&isPubliclyReady(path),follow:true},openGraph:{type:'website',siteName:'Sukoaa',title,description,...(origin?{url:origin+path}:{}),images:[{url:'/social/sukoaa.png',width:1200,height:630,alt:'Sukoaa — Browse. Build. Make everyday easier.'}]},twitter:{card:'summary_large_image',title,description,images:['/social/sukoaa.png']}};
}
export function jsonLd(value:unknown){return JSON.stringify(value).replace(/</g,'\\u003c')}
export function breadcrumbs(items:{name:string;path:string}[]){const origin=canonicalOrigin();return origin?{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:origin+item.path}))}:undefined}
export function storeLink(value:string|undefined){if(!value)return undefined;try{const url=new URL(value);if(url.protocol!=='https:'||url.hostname!=='chromewebstore.google.com'||url.username||url.password||url.search||url.hash||!/^\/detail\/(?:[a-z0-9-]+\/)?[a-p]{32}\/?$/.test(url.pathname))return undefined;return url.href}catch{return undefined}}
export function extensionLinks(){return {'quick-replies':storeLink(process.env.CHROME_STORE_QUICK_REPLIES_URL),'web-pdf-studio':storeLink(process.env.CHROME_STORE_WEB_PDF_STUDIO_URL)}}
export const publicPaths=[...practiceLessonPaths,...practiceHubPaths,'/about','/contact','/','/tools/react-native','/tools/c','/tools/cpp','/tools/rust','/tools/csharp','/tools/java','/tools','/practice','/tools/typescript','/tools/python','/tools/sql','/tools/json','/browser','/extensions','/extensions/quick-replies','/extensions/web-pdf-studio','/tools/javascript','/tools/react','/tools/html-css','/tools/nextjs','/downloads','/privacy','/publishing'].filter(isPubliclyReady);
