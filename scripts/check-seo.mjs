import {basename} from 'node:path';

export function seoIssues({origin,robots,sitemap,pages}){
 const issues=[];
 if(/^\s*Disallow:\s*\/\s*$/mi.test(robots))issues.push('robots.txt blocks the entire website. Set SITE_INDEXING_ENABLED=true in Vercel Production and redeploy.');
 if(!robots.includes(origin+'/sitemap.xml'))issues.push('robots.txt does not reference the expected production sitemap.');
 const locations=[...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match=>match[1]);
 if(!locations.length)issues.push('The sitemap is empty.');
 for(const path of ['/','/tools','/practice','/tools/javascript','/tools/typescript','/tools/python','/tools/sql','/tools/json'])if(!locations.includes(origin+path))issues.push('Sitemap is missing '+path);
 for(const url of locations){try{if(new URL(url).origin!==origin)issues.push('Sitemap uses a different origin: '+url)}catch{issues.push('Invalid sitemap URL: '+url)}if(/\/(account|admin|api|workspace|studio)(?:\/|$|\?)/.test(url))issues.push('Sitemap includes a private or editor URL: '+url)}
 const titles=new Set();
 for(const {path,status,html,headerRobots='',finalUrl} of pages){
  if(status!==200)issues.push(path+' returned HTTP '+status);
  if(finalUrl&&new URL(finalUrl).origin!==origin)issues.push(path+' redirects to a different origin.');
  const tags=html.match(/<meta\b[^>]*>/gi)||[];
  const meta=(name)=>tags.find(tag=>new RegExp('name=["\']'+name+'["\']','i').test(tag))?.match(/content=["\']([^"\']*)/i)?.[1]||'';
  if(/noindex|none/i.test(meta('robots')+' '+headerRobots))issues.push(path+' has noindex. Enable production indexing and redeploy.');
  const title=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if(!title)issues.push(path+' is missing a title.');else if(titles.has(title))issues.push(path+' has a duplicate title.');else titles.add(title);
  if(!meta('description'))issues.push(path+' is missing a description.');
  if(!/<h1(?:\s|>)/i.test(html))issues.push(path+' has no server-rendered main heading.');
  const canonical=(html.match(/<link\b[^>]*>/gi)||[]).find(tag=>/rel=["']canonical["']/i.test(tag))?.match(/href=["']([^"']+)/i)?.[1];
  try{if(!canonical||new URL(canonical).href!==new URL(origin+path).href)issues.push(path+' has a missing or incorrect canonical URL.')}catch{issues.push(path+' has an invalid canonical URL.')}
 }
 return issues;
}
async function main(){
 const value=process.argv[2]||process.env.SITE_URL||process.env.APP_ORIGIN;
 if(!value)throw new Error('Run: node scripts/check-seo.mjs https://www.sukoaa.com');
 const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname))throw new Error('Supply a public HTTPS origin without a path, query or credentials.');
 const origin=url.origin;const read=async(path)=>{const response=await fetch(origin+path,{redirect:'follow',headers:{Accept:'text/html,application/xml,text/plain'},signal:AbortSignal.timeout(20000)});return {path,status:response.status,html:await response.text(),headerRobots:response.headers.get('x-robots-tag')||'',finalUrl:response.url}};
 const robots=await read('/robots.txt'),sitemap=await read('/sitemap.xml');
 const lessonPaths=[...sitemap.html.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match=>{try{const u=new URL(match[1]);return u.origin===origin&&/^\/practice\/[a-z-]+(?:\/[a-z-]+)?$/.test(u.pathname)?u.pathname:null}catch{return null}}).filter(Boolean).slice(0,50);const paths=[...new Set(['/','/about','/contact','/tools','/practice','/tools/javascript','/tools/typescript','/tools/python','/tools/sql','/tools/json',...lessonPaths])];const pages=[];
 for(let index=0;index<paths.length;index+=3)pages.push(...await Promise.all(paths.slice(index,index+3).map(read)));
 const issues=seoIssues({origin,robots:robots.html,sitemap:sitemap.html,pages});
 if(robots.status!==200)issues.unshift('robots.txt returned HTTP '+robots.status);
 if(sitemap.status!==200)issues.unshift('sitemap.xml returned HTTP '+sitemap.status);
 if(issues.length){console.error('SEO launch checks failed:\n'+issues.map(issue=>' - '+issue).join('\n'));process.exitCode=1}else console.log('SEO launch checks passed for '+origin+' ('+paths.length+' public pages, robots.txt and sitemap). This does not guarantee indexing or rankings.');
}
if(process.argv[1]&&basename(process.argv[1])==='check-seo.mjs')main().catch(error=>{console.error(error.message);process.exitCode=1});
