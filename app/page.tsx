import Home from '@/components/Home';import {pageMetadata} from '@/lib/marketing/site';
const baseMetadata=pageMetadata('Online Compilers: PHP, Laravel, SQL, Python & JS | Sukoaa','Run PHP, Laravel, PostgreSQL, Python, JavaScript, Tailwind and FastAPI in your browser with no install. Free practice, a RAG playground, token counter and developer tools.','/');
export const metadata={...baseMetadata,title:{absolute:'Online Compilers: PHP, Laravel, SQL, Python & JS | Sukoaa'}};
export default function Page(){return <Home/>}
