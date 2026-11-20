import { WorkbenchPage } from '@/components/workbench/WorkbenchPage';
import { workbenchTools } from '@/lib/workbench/catalog';
import { pageMetadata } from '@/lib/marketing/site';
const tool = workbenchTools.find(t => t.slug === 'test-data-generator')!;
export const metadata = pageMetadata(tool.name + ' — Free Online File Tool', tool.description, '/tools/test-data-generator');
export default function Page() { return <WorkbenchPage slug="test-data-generator"/>; }
