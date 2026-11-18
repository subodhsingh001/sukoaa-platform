import {SiteFrame, Crumbs} from '@/components/marketing/SiteFrame';
import {InterviewDirectory} from '@/components/interview/InterviewDirectory';
import {employerGuidance, questionSummaries} from '@/lib/interview/catalog';
import {pageMetadata} from '@/lib/marketing/site';
export const metadata = pageMetadata('GenAI & Frontend Interview Preparation — 60 Explained Questions', 'Learn GenAI and frontend interview topics with 60 questions, lessons, reference answers, mock rounds and local progress. Choose your relevant subject experience.', '/interview-prep');
export default function InterviewPrep() {return <SiteFrame interviewWorkspace><Crumbs name="Interview preparation"/><InterviewDirectory questions={questionSummaries} research={employerGuidance}/></SiteFrame>;}
