import {SiteFrame} from '@/components/marketing/SiteFrame';
import {TechnicalActivity} from '@/components/learning/TechnicalActivity';
import {ActivityPlayer} from '@/components/play/ActivityPlayer';
import {dailyActivity} from '@/lib/play/catalog';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export function generateMetadata(){return pageMetadata('Daily Coding Challenge','Try a daily coding challenge with hints, explained solutions and a matching browser compiler. Practise reading code and keep your progress on this device.','/play/daily');}
// Only this page changes day to day, so only this page is rendered per request.
export const dynamic='force-dynamic';
export default function Page(){const a=dailyActivity();return <SiteFrame>{a.kind==='postgres'||a.kind==='tailwind'?<TechnicalActivity key={a.id} activity={a}/>:<ActivityPlayer key={a.id} activity={a} daily/>}</SiteFrame>;}
