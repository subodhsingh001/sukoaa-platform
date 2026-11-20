import {SiteFrame,Crumbs} from '@/components/marketing/SiteFrame';
import {StructuredData} from '@/components/marketing/StructuredData';
import {canonicalOrigin,pageMetadata,breadcrumbs} from '@/lib/marketing/site';
import {summaries,media} from '@/lib/system-design/catalog';
import {CourseDirectory} from '@/components/system-design/CourseDirectory';
import '@/components/system-design/system-design.css';
export const metadata=pageMetadata('System Design Tutorials: 25 Concepts with Animated Videos','Learn 25 system design concepts with narrated animations, simple explanations, engineering examples, practical exercises and interview preparation.','/learn/system-design');
export default function SystemDesign(){
 const origin=canonicalOrigin();
 const crumbs=breadcrumbs([{name:'Home',path:'/'},{name:'System design tutorials',path:'/learn/system-design'}]);
 const minutes=Math.round(Object.values(media).reduce((n,x)=>n+x.duration,0)/60);
 const collection={'@context':'https://schema.org','@type':'CollectionPage',name:'System design tutorials',url:origin+'/learn/system-design',mainEntity:{'@type':'ItemList',numberOfItems:summaries.length,itemListElement:summaries.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.title,url:origin+'/learn/system-design/'+x.id}))}};
 return <SiteFrame><Crumbs name="System design tutorials"/>{crumbs&&<StructuredData data={crumbs}/>}<div className="sd-course">{origin&&<StructuredData data={collection}/>}<CourseDirectory items={summaries} minutes={minutes}/></div></SiteFrame>;
}
