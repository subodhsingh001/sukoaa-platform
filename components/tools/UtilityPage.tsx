import dynamic from 'next/dynamic';
const ToolSchemaStudio=dynamic(()=>import('./ToolSchemaStudio').then(m=>m.ToolSchemaStudio));
import {SiteFrame,Crumbs,Questions} from '@/components/marketing/SiteFrame';
import {StructuredData} from '@/components/marketing/StructuredData';
import {breadcrumbs,canonicalOrigin,pageMetadata} from '@/lib/marketing/site';
import {utilityBySlug} from '@/lib/marketing/utility-tools';
import {UtilityTool} from '@/components/tools/UtilityTools';
import {RagPlayground} from '@/components/tools/RagPlayground';
import '@/components/tools/utility-tools.css';
export function utilityMetadata(slug:string){const t=utilityBySlug[slug];return pageMetadata(t.title,t.description,'/tools/'+slug)}
export function UtilityPage({slug}:{slug:string}){
 const t=utilityBySlug[slug],origin=canonicalOrigin();
 return <SiteFrame>
  <StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'Tools',path:'/tools'},{name:t.name,path:'/tools/'+slug}])}/>
  {origin&&<StructuredData data={{'@context':'https://schema.org','@type':'WebApplication',name:t.name,url:origin+'/tools/'+slug,description:t.description,applicationCategory:'DeveloperApplication',operatingSystem:'Any (web browser)',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@id':origin+'/#organization'}}}/>}
  <div className="pl"><Crumbs name={t.name} parent={{label:'Tools',href:'/tools'}}/>
   <div className="lab-intro"><div><h1>{t.h1}</h1><p>{t.lead.split('. ')[0]}.</p></div></div>
   {t.kind==='schema'?<ToolSchemaStudio/>:t.kind==='rag'?<RagPlayground/>:<UtilityTool kind={t.kind}/>}
   <section className="ut-seo" aria-labelledby="ut-about"><h2 id="ut-about">About this tool</h2><p>{t.lead}</p><h3>What you can do</h3><ul>{t.uses.map(u=><li key={u}>{u}</li>)}</ul><p><a href="/tools">All tools →</a> · <a href="/play/tracks/llm-api">LLM API exercises →</a> · <a href="/demo-api">Free demo API →</a></p><Questions items={t.faq}/></section>
  </div>
 </SiteFrame>;
}
