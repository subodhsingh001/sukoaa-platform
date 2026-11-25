import {SiteFrame} from '@/components/marketing/SiteFrame';
import {LearningTools} from '@/components/play/LearningTools';
import {LearningToolGuide} from '@/components/play/LearningToolGuide';
import {pageMetadata} from '@/lib/marketing/site';import {WebAppSchema} from '@/components/marketing/WebAppSchema';
import '@/components/play/play.css';
export const metadata=pageMetadata('Text Compare — Find Line Differences','Compare two texts locally with line additions, removals and an option to ignore whitespace.','/tools/text-compare');
export default function Page(){return <SiteFrame><WebAppSchema name="Text Compare" description="Compare two texts locally with line additions, removals and an option to ignore whitespace." path="/tools/text-compare"/><LearningTools kind="text-compare"/><LearningToolGuide kind="text-compare"/></SiteFrame>;}
