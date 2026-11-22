import {notFound} from 'next/navigation';
import {SiteFrame,Crumbs} from '@/components/marketing/SiteFrame';
import {pageMetadata} from '@/lib/marketing/site';
import {genLessons,genSummaries,genHref} from '@/lib/genai/catalog';
import {CourseLesson} from '@/components/genai/CourseLesson';
import '@/components/genai/genai.css';
export const dynamicParams=false;
export function generateStaticParams(){return genLessons.map(l=>({slug:l.id}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const l=genLessons.find(x=>x.id===slug);return l?pageMetadata(l.title+' Tutorial: GenAI Engineering and Interview Practice',l.simple,genHref(slug)):{};}
export default async function GenAILesson({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const l=genLessons.find(x=>x.id===slug);if(!l)notFound();return <SiteFrame><Crumbs name={l.title} parent={{label:'GenAI preparation',href:'/learn/gen-ai'}}/><CourseLesson key={l.id} lesson={l} items={genSummaries}/></SiteFrame>;}
