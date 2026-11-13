import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['c'].title,toolPages['c'].description,'/tools/c');
export default function Page(){return <ToolPage slug="c"/>}
