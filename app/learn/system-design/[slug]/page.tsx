import {notFound} from 'next/navigation';
import {SiteFrame,Crumbs} from '@/components/marketing/SiteFrame';
import {StructuredData} from '@/components/marketing/StructuredData';
import {pageMetadata,breadcrumbs} from '@/lib/marketing/site';
import {lessons,getLesson,summaries,media,lessonHref} from '@/lib/system-design/catalog';
import {LessonMentor} from '@/components/system-design/LessonMentor';
import '@/components/system-design/system-design.css';
export function generateStaticParams(){return lessons.map(({id})=>({slug:id}));}
export const dynamicParams=false;
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lesson=getLesson(slug);if(!lesson)return {};return pageMetadata(lesson.title+' Tutorial: Animation, Examples & Interview Practice',lesson.simple,lessonHref(slug));}
export default async function SystemDesignLesson({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lesson=getLesson(slug);if(!lesson)notFound();const crumbs=breadcrumbs([{name:'Home',path:'/'},{name:'System design',path:'/learn/system-design'},{name:lesson.title,path:lessonHref(slug)}]);return <SiteFrame><Crumbs name={lesson.title} parent={{label:'System design',href:'/learn/system-design'}}/>{crumbs&&<StructuredData data={crumbs}/>}<div className="sd-course"><LessonMentor lesson={lesson} items={summaries} clip={media[slug]}/></div></SiteFrame>}
