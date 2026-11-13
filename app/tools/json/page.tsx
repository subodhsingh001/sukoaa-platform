import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['json'].title,toolPages['json'].description,'/tools/json');
export default function Page(){return <ToolPage slug="json"/>}
