import {SiteFrame,Crumbs} from '@/components/marketing/SiteFrame';
import {pageMetadata} from '@/lib/marketing/site';
import {genSummaries} from '@/lib/genai/catalog';
import {GenCourseDirectory} from '@/components/genai/CourseDirectory';
import '@/components/genai/genai.css';
export const metadata=pageMetadata('GenAI Engineering Preparation: Models, RAG, Agents and Interviews','Study 40 GenAI concepts with guided visuals, worked examples, coding tasks, GPU memory calculations, RAG evaluation and mock interview practice.','/learn/gen-ai');
export default function GenAICourse(){return <SiteFrame><Crumbs name="GenAI preparation"/><GenCourseDirectory items={genSummaries}/></SiteFrame>;}
