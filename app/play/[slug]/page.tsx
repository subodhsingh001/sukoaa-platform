import {notFound} from 'next/navigation';
import {SiteFrame} from '@/components/marketing/SiteFrame';
import {TechnicalActivity} from '@/components/learning/TechnicalActivity';
import {ActivityPlayer} from '@/components/play/ActivityPlayer';
import {activities,dailyActivity,kindLabels} from '@/lib/play/catalog';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export function generateStaticParams(){return [...activities.map(a=>({slug:a.id})),{slug:'daily'}];}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const a=slug==='daily'?dailyActivity():activities.find(a=>a.id===slug);return a?pageMetadata(slug==='daily'?'Daily Coding Challenge':a.title+' — '+kindLabels[a.kind],a.goal||a.explanation,'/play/'+slug):{};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const a=slug==='daily'?dailyActivity():activities.find(a=>a.id===slug);if(!a)notFound();return <SiteFrame>{a.kind==='postgres'||a.kind==='tailwind'?<TechnicalActivity key={a.id} activity={a}/>:<ActivityPlayer key={a.id} activity={a} daily={slug==='daily'}/>}</SiteFrame>;}
// Daily selection must be evaluated per request, not frozen at deployment.
export const dynamic='force-dynamic';
