import {StructuredData} from '@/components/marketing/StructuredData';
import {breadcrumbs,canonicalOrigin} from '@/lib/marketing/site';
// Breadcrumbs plus WebApplication data for a free in-browser tool page.
export function WebAppSchema({name,description,path}:{name:string;description:string;path:string}){const origin=canonicalOrigin();return <><StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'Coding tools',path:'/tools'},{name,path}])}/>{origin&&<StructuredData data={{'@context':'https://schema.org','@type':'WebApplication',name,url:origin+path,description,applicationCategory:'DeveloperApplication',operatingSystem:'Any (web browser)',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@id':origin+'/#organization'}}}/>}</>}
