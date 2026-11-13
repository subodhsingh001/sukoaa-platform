import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['cpp'].title,toolPages['cpp'].description,'/tools/cpp');
export default function Page(){return <ToolPage slug="cpp"/>}
