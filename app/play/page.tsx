import {SiteFrame} from '@/components/marketing/SiteFrame';
import {PlayHub} from '@/components/play/PlayHub';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export const metadata=pageMetadata('Play & Learn — Coding Games and Challenges','Learn JavaScript, Python, CSS and SQL through output puzzles, code ordering, bug hunts and practical challenges.','/play');
export default function Page(){return <SiteFrame><PlayHub/></SiteFrame>;}
