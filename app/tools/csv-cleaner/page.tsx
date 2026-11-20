import { WorkbenchPage } from '@/components/workbench/WorkbenchPage';
import { workbenchTools } from '@/lib/workbench/catalog';
import { pageMetadata } from '@/lib/marketing/site';
const tool = workbenchTools.find(t => t.slug === 'csv-cleaner')!;
export const metadata = pageMetadata(tool.name + ' — Free Online File Tool', tool.description, '/tools/csv-cleaner');
export default function Page() { return <WorkbenchPage slug="csv-cleaner"/>; }
