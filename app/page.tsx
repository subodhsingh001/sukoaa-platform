import Home from '@/components/Home';import {pageMetadata} from '@/lib/marketing/site';
import {activities} from '@/lib/play/catalog';
import {questions} from '@/lib/interview/catalog';
const baseMetadata=pageMetadata('Online Compilers: PHP, Laravel, SQL, Python & JS | Sukoaa','Online compilers for PHP, Laravel, PostgreSQL, Python and JavaScript. Free practice, FastAPI, Tailwind, RAG playground, token counter and developer tools.','/');
export const metadata={...baseMetadata,title:{absolute:'Online Compilers: PHP, Laravel, SQL, Python & JS | Sukoaa'}};
export default function Page(){return <Home stats={{activities:activities.length,interviewQuestions:questions.length}}/>}
