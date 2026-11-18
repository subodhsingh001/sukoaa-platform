import {SiteFrame, Crumbs} from '@/components/marketing/SiteFrame';
import {MockInterview} from '@/components/interview/MockInterview';
import {questions, mockRounds} from '@/lib/interview/catalog';
export const metadata = {title: 'Interview Mock Rounds', description: 'Timed self-guided GenAI and frontend practice rounds with local drafts and self-review.', robots: {index: false, follow: true}};
export default function MockPage() {return <SiteFrame interviewWorkspace><Crumbs name="Mock interview" parent={{label: 'Interview preparation', href: '/interview-prep'}}/><MockInterview questions={questions} rounds={mockRounds}/></SiteFrame>;}
