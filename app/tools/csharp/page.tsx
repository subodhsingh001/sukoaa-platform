import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['csharp'].title,toolPages['csharp'].description,'/tools/csharp');
export default function Page(){return <ToolPage slug="csharp"/>}
