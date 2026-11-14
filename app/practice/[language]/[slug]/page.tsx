import {notFound} from 'next/navigation';
import {SiteFrame,Crumbs} from '@/components/marketing/SiteFrame';
import {StructuredData} from '@/components/marketing/StructuredData';
import {PracticeProgress} from '@/components/marketing/PracticeProgress';
import {practiceExercises,practiceHref} from '@/lib/marketing/practice';
import {practiceLessons,lessonHref,findPracticeLesson,completeSolution} from '@/lib/marketing/practice-lessons';
import {breadcrumbs,pageMetadata,canonicalOrigin} from '@/lib/marketing/site';
type Props={params:Promise<{language:string;slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return practiceExercises.map(e=>({language:e.language,slug:practiceLessons[e.id].slug}))}
export async function generateMetadata({params}:Props){const {language,slug}=await params;const e=findPracticeLesson(language,slug);if(!e)return {};const lesson=practiceLessons[e.id];return pageMetadata(lesson.title,lesson.description,lessonHref(e))}
export default async function PracticeLesson({params}:Props){const {language,slug}=await params;const e=findPracticeLesson(language,slug);if(!e)notFound();const lesson=practiceLessons[e.id];const origin=canonicalOrigin();const others=practiceExercises.filter(item=>item.id!==e.id);const related=[...others.filter(item=>item.language===e.language),...others.filter(item=>item.language!==e.language)].slice(0,2);return <SiteFrame>
 <StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'Coding practice',path:'/practice'},{name:lesson.title,path:lessonHref(e)}])}/>
 {origin&&<StructuredData data={{'@context':'https://schema.org','@type':'LearningResource',name:lesson.title,description:lesson.description,url:origin+lessonHref(e),inLanguage:'en',educationalLevel:'Beginner',learningResourceType:'Exercise',teaches:e.topic,timeRequired:'PT'+lesson.minutes+'M',isAccessibleForFree:true,isPartOf:{'@type':'CollectionPage',name:'Sukoaa coding practice',url:origin+'/practice'},publisher:{'@id':origin+'/#organization'}}}/>}
 <Crumbs name={e.title} parent={{label:'Coding practice',href:'/practice'}}/>
 <article className="practice-exercise practice-lesson">
 <p className="product-eyebrow">{e.language.toUpperCase()} · BEGINNER · ABOUT {lesson.minutes} MINUTES</p><h1>{lesson.title}</h1><p className="lesson-intro">{lesson.intro}</p><p><strong>Before you start:</strong> {lesson.prerequisites}</p>
 <section aria-labelledby="exercise-task"><h2 id="exercise-task">Your task</h2><p>{e.goal}</p><div className="practice-example"><div><h3>Starter code</h3><pre><code>{e.source}</code></pre></div><div className="practice-result"><h3>Expected result</h3><pre><code>{e.expected}</code></pre>{lesson.outputNote&&<p className="lesson-output-note">{lesson.outputNote}</p>}<div className="practice-exercise-action"><a className="product-button dark" href={practiceHref(e)}>Open this exercise →</a><p className="product-fineprint">Loads the starter in the workspace. Save or export existing work first. Return here for hints and the explanation.</p></div></div></div></section>
 <details className="practice-solution"><summary>Need a hint?</summary><p>{lesson.hint}</p></details>
 <details className="practice-solution"><summary>Show the complete solution and walkthrough</summary><pre><code>{completeSolution(e)}</code></pre><ol className="lesson-walkthrough">{lesson.steps.map(step=><li key={step}>{step}</li>)}</ol></details>
 <section className="lesson-note"><h2>A common mistake</h2><p>{lesson.mistake}</p></section><section className="lesson-note"><h2>Try an edge case</h2><p>{lesson.edgeCase}</p></section><section className="lesson-note"><h2>Take it one step further</h2><p>{lesson.variation}</p></section>
 <PracticeProgress exerciseId={e.id}/><a className="tool-guide-link" href={'/tools/'+e.tool}>Read the {e.language} tool guide →</a>
 </article><section className="lesson-related"><h2>What would you like to try next?</h2><div>{related.map(item=><a className="product-button light" href={lessonHref(item)} key={item.id}>{item.title} →</a>)}</div><a className="tool-guide-link" href="/practice">All practice exercises →</a></section>
 </SiteFrame>}
