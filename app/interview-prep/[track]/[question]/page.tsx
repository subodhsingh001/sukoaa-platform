import {notFound} from 'next/navigation';
import {SiteFrame, Crumbs} from '@/components/marketing/SiteFrame';
import {StructuredData} from '@/components/marketing/StructuredData';
import {InterviewQuestion} from '@/components/interview/InterviewQuestion';
import {getQuestion, questionHref, questions} from '@/lib/interview/catalog';
import {levels, rounds, tracks} from '@/lib/interview/types';
import {breadcrumbs, pageMetadata} from '@/lib/marketing/site';
export const dynamicParams = false;
export function generateStaticParams() {return questions.map(q => ({track: q.track, question: q.slug}));}
export async function generateMetadata({params}: {params: Promise<{track: string; question: string}>}) {const p = await params; const q = getQuestion(p.track, p.question); return q ? pageMetadata(q.title, q.lesson + ' Practise an answer, explore hints and review with a self-assessment rubric.', questionHref(q)) : {};}
export default async function QuestionPage({params}: {params: Promise<{track: string; question: string}>}) {
 const p = await params; const q = getQuestion(p.track, p.question); if (!q) notFound();
 const track = tracks.find(t => t.id === q.track)!;
 const siblings = questions.filter(item => item.track === q.track);
 const index = siblings.findIndex(item => item.id === q.id); const next = siblings[index + 1];
 const crumbs = breadcrumbs([{name: 'Home', path: '/'}, {name: 'Interview preparation', path: '/interview-prep'}, {name: track.name, path: '/interview-prep/' + q.track}, {name: q.title, path: questionHref(q)}]);
 return <SiteFrame interviewWorkspace><Crumbs name="Question practice" parent={{label: track.short + ' interview prep', href: '/interview-prep/' + q.track}}/>{crumbs && <StructuredData data={crumbs}/>}<article className="ip-question-page"><header className="ip-question-intro"><h1>{q.title}</h1><div className="ip-card-meta"><span>{q.topic}</span><span>{rounds.find(r => r.id === q.round)!.name}</span><span>About {q.minutes} minutes</span></div><p>Understand the idea, explain it in your own words and use the rubric to find your next learning gap.</p></header><InterviewQuestion question={q} catalog={questions.map(item => ({id: item.id}))}/><nav className="ip-question-bottom" aria-label="Continue interview preparation"><a href={'/interview-prep/' + q.track}>Back to {track.short} questions</a>{next ? <a href={questionHref(next)}>Next: {next.title}</a> : <a href={'/interview-prep/' + q.track}>Track complete? Review your saved gaps</a>}</nav></article></SiteFrame>;
}
