import {ExtensionPage} from '@/components/marketing/ExtensionPage';import {pageMetadata} from '@/lib/marketing/site';import {extensions} from '@/lib/marketing/catalog';
export const metadata=pageMetadata('Web PDF Studio Chrome Extension',extensions['web-pdf-studio'].description,'/extensions/web-pdf-studio');export const dynamic='force-dynamic';
export default function Page(){return <ExtensionPage slug="web-pdf-studio"/>}
