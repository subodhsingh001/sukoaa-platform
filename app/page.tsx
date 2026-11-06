import Home from '@/components/Home';import {pageMetadata} from '@/lib/marketing/site';
const baseMetadata=pageMetadata('Sukoaa — Browser, Chrome Extensions & Developer Tools','Explore Sukoaa browser releases, Chrome extension projects, and online JavaScript, Python, HTML/CSS, React and Next.js developer workspaces.','/');
export const metadata={...baseMetadata,title:{absolute:'Sukoaa — Browser, Chrome Extensions & Developer Tools'}};
export default function Page(){return <Home/>}
