import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['java'].title,toolPages['java'].description,'/tools/java');
export default function Page(){return <ToolPage slug="java"/>}
