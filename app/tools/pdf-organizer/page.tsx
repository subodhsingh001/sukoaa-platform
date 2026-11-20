import { WorkbenchPage } from '@/components/workbench/WorkbenchPage';
import { workbenchTools } from '@/lib/workbench/catalog';
import { pageMetadata } from '@/lib/marketing/site';
const tool = workbenchTools.find(t => t.slug === 'pdf-organizer')!;
export const metadata = pageMetadata(tool.name + ' — Free Online File Tool', tool.description, '/tools/pdf-organizer');
export default function Page() { return <WorkbenchPage slug="pdf-organizer"/>; }
