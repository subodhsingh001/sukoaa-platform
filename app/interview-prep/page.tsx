import {SiteFrame, Crumbs} from '@/components/marketing/SiteFrame';
import {InterviewDirectory} from '@/components/interview/InterviewDirectory';
import {employerGuidance, questionSummaries} from '@/lib/interview/catalog';
import {pageMetadata} from '@/lib/marketing/site';
export const metadata = pageMetadata(`GenAI & Frontend Interview Preparation — ${questionSummaries.length} Explained Questions`, `Learn GenAI and frontend interview topics with ${questionSummaries.length} questions, lessons, reference answers, mock rounds and local progress. Choose your relevant subject experience.`, '/interview-prep');
export default function InterviewPrep() {return <SiteFrame interviewWorkspace><Crumbs name="Interview preparation"/><p className="product-intro"><a href="/learn/gen-ai">Study the GenAI engineering course: concepts, calculations and coding practice</a></p><InterviewDirectory questions={questionSummaries} research={employerGuidance}/></SiteFrame>;}
