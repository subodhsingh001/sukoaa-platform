import { WorkbenchPage } from '@/components/workbench/WorkbenchPage';
import { workbenchTools } from '@/lib/workbench/catalog';
import { pageMetadata } from '@/lib/marketing/site';
const tool = workbenchTools.find(t => t.slug === 'batch-images')!;
export const metadata = pageMetadata(tool.name + ' — Free Online File Tool', tool.description, '/tools/batch-images');
export default function Page() { return <WorkbenchPage slug="batch-images"/>; }
