import {SiteFrame} from '@/components/marketing/SiteFrame';
import {DemoApiDocs} from '@/components/play/DemoApiDocs';
import {pageMetadata,breadcrumbs} from '@/lib/marketing/site';
import {StructuredData} from '@/components/marketing/StructuredData';
import '@/components/play/play.css';
export const metadata=pageMetadata('Free REST & GraphQL API Playground','Test REST CRUD, private temporary sandboxes and GraphQL. Generate fictional APIs from JSON/YAML or public GitHub configuration.','/demo-api');
export default function Page(){return <SiteFrame><StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'Demo API',path:'/demo-api'}])}/><DemoApiDocs/></SiteFrame>;}
