import {notFound} from 'next/navigation';
import {SiteFrame} from '@/components/marketing/SiteFrame';
import {PlayHub} from '@/components/play/PlayHub';
import {tracks} from '@/lib/play/catalog';
import {pageMetadata} from '@/lib/marketing/site';
import '@/components/play/play.css';
export function generateStaticParams(){return tracks.map(t=>({track:t.id}));}
export async function generateMetadata({params}:{params:Promise<{track:string}>}){const {track}=await params;const t=tracks.find(t=>t.id===track);return t?pageMetadata(t.name+' — Play & Learn',t.description,'/play/tracks/'+track):{};}
export default async function Page({params}:{params:Promise<{track:string}>}){const {track}=await params;if(!tracks.some(t=>t.id===track))notFound();return <SiteFrame><PlayHub track={track}/></SiteFrame>;}
