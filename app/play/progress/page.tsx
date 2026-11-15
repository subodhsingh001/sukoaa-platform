import {SiteFrame} from '@/components/marketing/SiteFrame';
import {PlayHub} from '@/components/play/PlayHub';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export const metadata=pageMetadata('Your Play & Learn Progress','Review coding activities, bookmarks and device progress. Optionally merge progress with your signed-in account.','/play/progress');
export default function Page(){return <SiteFrame><PlayHub progressOnly/></SiteFrame>;}
