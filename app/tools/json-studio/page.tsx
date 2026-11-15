import {SiteFrame} from '@/components/marketing/SiteFrame';
import {LearningTools} from '@/components/play/LearningTools';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export const metadata=pageMetadata('JSON Studio — Format, Validate and Compare','Format and compare JSON locally, explore nested values and copy JSON paths.','/tools/json-studio');
export default function Page(){return <SiteFrame><LearningTools kind="json-studio"/></SiteFrame>;}
