import {SiteFrame} from '@/components/marketing/SiteFrame';
import {DemoApiDocs} from '@/components/play/DemoApiDocs';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export const metadata=pageMetadata('Free Fake REST API for Tutorials and Prototypes','Use Sukoaa’s fictional REST API with users, products, posts, pagination, simulated writes and error scenarios.','/demo-api');
export default function Page(){return <SiteFrame><DemoApiDocs/></SiteFrame>;}
