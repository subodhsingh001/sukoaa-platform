import {SiteFrame} from '@/components/marketing/SiteFrame';
import {LearningTools} from '@/components/play/LearningTools';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export const metadata=pageMetadata('Text Compare — Find Line Differences','Compare two texts locally with line additions, removals and an option to ignore whitespace.','/tools/text-compare');
export default function Page(){return <SiteFrame><LearningTools kind="text-compare"/></SiteFrame>;}
