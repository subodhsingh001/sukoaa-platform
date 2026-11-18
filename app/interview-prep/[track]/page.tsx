import {notFound} from 'next/navigation';
import {SiteFrame, Crumbs} from '@/components/marketing/SiteFrame';
import {InterviewDirectory} from '@/components/interview/InterviewDirectory';
import {employerGuidance, isTrack, questionSummaries} from '@/lib/interview/catalog';
import {tracks} from '@/lib/interview/types';
import {pageMetadata} from '@/lib/marketing/site';
export const dynamicParams = false;
export function generateStaticParams() {return tracks.map(t => ({track: t.id}));}
export async function generateMetadata({params}: {params: Promise<{track: string}>}) {const {track} = await params; const t = tracks.find(t => t.id === track); return t ? pageMetadata(`${t.short} Interview Preparation — 30 Questions & Practice Rounds`, t.description + ' Learn with hints, reference answers, self-review rubrics and local progress.', `/interview-prep/${track}`) : {};}
export default async function InterviewTrack({params}: {params: Promise<{track: string}>}) {const {track} = await params; if (!isTrack(track)) notFound(); return <SiteFrame interviewWorkspace><Crumbs name={tracks.find(t => t.id === track)!.name} parent={{label: 'Interview preparation', href: '/interview-prep'}}/><InterviewDirectory initialTrack={track} questions={questionSummaries} research={employerGuidance}/></SiteFrame>;}
