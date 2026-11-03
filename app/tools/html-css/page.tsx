import {ToolPage} from '@/components/marketing/ToolPage';import {pageMetadata} from '@/lib/marketing/site';import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['html-css'].title,toolPages['html-css'].description,'/tools/html-css');
export default function Page(){return <ToolPage slug="html-css"/>}
