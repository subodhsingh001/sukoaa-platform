import Home from '@/components/Home';import {pageMetadata} from '@/lib/marketing/site';
const baseMetadata=pageMetadata('Sukoaa — Online Coding Practice, Playgrounds & Browser Tools','Practise JavaScript, Python, TypeScript and SQL online. Try coding exercises, console playgrounds, React projects and HTML/CSS previews with Sukoaa.','/');
export const metadata={...baseMetadata,title:{absolute:'Sukoaa — Online Coding Practice, Playgrounds & Browser Tools'}};
export default function Page(){return <Home/>}
