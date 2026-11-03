import {ToolPage} from '@/components/marketing/ToolPage';import {pageMetadata} from '@/lib/marketing/site';import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['react'].title,toolPages['react'].description,'/tools/react');
export default function Page(){return <ToolPage slug="react"/>}
