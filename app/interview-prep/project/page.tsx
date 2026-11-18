import {SiteFrame, Crumbs} from '@/components/marketing/SiteFrame';
import {ProjectDefence} from '@/components/interview/ProjectDefence';
import {questionSummaries} from '@/lib/interview/catalog';
export const metadata = {title: 'Interview Project-Defence Worksheet', description: 'Practise explaining your own engineering project with honest ownership, trade-offs and evidence.', robots: {index: false, follow: true}};
export default function ProjectPage() {return <SiteFrame interviewWorkspace><Crumbs name="Project-defence worksheet" parent={{label: 'Interview preparation', href: '/interview-prep'}}/><ProjectDefence catalog={questionSummaries}/></SiteFrame>;}
