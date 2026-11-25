import {SiteFrame} from '@/components/marketing/SiteFrame';
import {LearningTools} from '@/components/play/LearningTools';
import {LearningToolGuide} from '@/components/play/LearningToolGuide';
import {pageMetadata} from '@/lib/marketing/site';import {WebAppSchema} from '@/components/marketing/WebAppSchema';
import '@/components/play/play.css';
export const metadata=pageMetadata('JSON Studio — Format, Validate and Compare','Format and compare JSON locally, explore nested values and copy JSON paths.','/tools/json-studio');
export default function Page(){return <SiteFrame><WebAppSchema name="JSON Studio" description="Format and compare JSON locally, explore nested values and copy JSON paths." path="/tools/json-studio"/><LearningTools kind="json-studio"/><LearningToolGuide kind="json-studio"/></SiteFrame>;}
