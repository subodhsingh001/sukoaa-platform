import { WorkbenchPage } from '@/components/workbench/WorkbenchPage';
import { workbenchTools } from '@/lib/workbench/catalog';
import { pageMetadata } from '@/lib/marketing/site';
const tool = workbenchTools.find(t => t.slug === 'spreadsheet-compare')!;
export const metadata = pageMetadata(tool.name + ' — Free Online File Tool', tool.description, '/tools/spreadsheet-compare');
export default function Page() { return <WorkbenchPage slug="spreadsheet-compare"/>; }
