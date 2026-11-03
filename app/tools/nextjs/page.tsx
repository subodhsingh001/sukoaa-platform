import {ToolPage} from '@/components/marketing/ToolPage';import {pageMetadata} from '@/lib/marketing/site';import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['nextjs'].title,toolPages['nextjs'].description,'/tools/nextjs');
export default function Page(){return <ToolPage slug="nextjs"/>}
