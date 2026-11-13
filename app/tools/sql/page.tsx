import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['sql'].title,toolPages['sql'].description,'/tools/sql');
export default function Page(){return <ToolPage slug="sql"/>}
