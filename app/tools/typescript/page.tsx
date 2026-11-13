import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['typescript'].title,toolPages['typescript'].description,'/tools/typescript');
export default function Page(){return <ToolPage slug="typescript"/>}
