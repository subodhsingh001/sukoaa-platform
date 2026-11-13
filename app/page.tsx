import Home from '@/components/Home';import {pageMetadata} from '@/lib/marketing/site';
const baseMetadata=pageMetadata('Sukoaa — Online Compilers for JavaScript, Python & More','Run JavaScript and Python online with Sukoaa’s compiler playgrounds. Practise coding, inspect console output, build React projects and preview HTML/CSS.','/');
export const metadata={...baseMetadata,title:{absolute:'Sukoaa — Online Compilers for JavaScript, Python & More'}};
export default function Page(){return <Home/>}
