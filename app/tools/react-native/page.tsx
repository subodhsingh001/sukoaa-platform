import {ToolPage} from '@/components/marketing/ToolPage';
import {pageMetadata} from '@/lib/marketing/site';
import {toolPages} from '@/lib/marketing/tools';
export const metadata=pageMetadata(toolPages['react-native'].title,toolPages['react-native'].description,'/tools/react-native');
export default function Page(){return <ToolPage slug="react-native"/>}
