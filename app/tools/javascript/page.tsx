import {ToolPage} from '@/components/marketing/ToolPage';import {pageMetadata} from '@/lib/marketing/site';import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['javascript'].title,toolPages['javascript'].description,'/tools/javascript');
export default function Page(){return <ToolPage slug="javascript"/>}
