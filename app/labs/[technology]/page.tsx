import '@/components/learning/backend-playground.css';
import BackendPlayground from '@/components/learning/BackendPlayground';
import {notFound} from 'next/navigation';
import {SiteFrame} from '@/components/marketing/SiteFrame';
import {PostgresLab,TailwindLab,NodeLab} from '@/components/learning/BrowserLabs';
import {learningModules,findModule} from '@/lib/learning/modules';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export function generateStaticParams(){return learningModules.filter(m=>m.lab).map(m=>({technology:m.id}));}
export async function generateMetadata({params}:{params:Promise<{technology:string}>}){const {technology}=await params;const m=findModule(technology);return m?.lab?pageMetadata(m.name+' Online Compiler',m.description,'/labs/'+technology):{};}
export default async function Page({params}:{params:Promise<{technology:string}>}){const {technology}=await params;const m=findModule(technology);if(!m?.lab)notFound();return <SiteFrame><div className="pl"><div className="lab-intro"><div><h1>{m.name} online compiler</h1><p>Write on the left. Run and see results on the right.</p></div><a href={'/play/tracks/'+m.id}>Examples & practice →</a></div>{technology==='fastapi'||technology==='php'||technology==='laravel'?<BackendPlayground technology={technology}/>:technology==='postgresql'?<PostgresLab writable/>:technology==='tailwindcss'?<TailwindLab/>:<NodeLab/>}</div></SiteFrame>;}
