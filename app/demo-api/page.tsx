import {SiteFrame} from '@/components/marketing/SiteFrame';
import {DemoApiDocs} from '@/components/play/DemoApiDocs';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export const metadata=pageMetadata('Free REST & GraphQL API Playground','Test REST CRUD, private temporary sandboxes and GraphQL. Generate fictional APIs from JSON/YAML or public GitHub configuration.','/demo-api');
export default function Page(){return <SiteFrame><DemoApiDocs/></SiteFrame>;}
