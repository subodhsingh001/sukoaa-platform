import {SiteFrame} from '@/components/marketing/SiteFrame';
import {RegexPlayground} from '@/components/play/RegexPlayground';
import {pageMetadata} from '@/lib/marketing/site';import {WebAppSchema} from '@/components/marketing/WebAppSchema';
import '@/components/play/play.css';
export const metadata=pageMetadata('Regex Playground — Test JavaScript Expressions','Test regular expressions and inspect matches and capture groups in a bounded browser worker.','/tools/regex');
export default function Page(){return <SiteFrame><WebAppSchema name="Regex Playground" description="Test regular expressions and inspect matches and capture groups in a bounded browser worker." path="/tools/regex"/><RegexPlayground/></SiteFrame>;}
