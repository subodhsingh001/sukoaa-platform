import {ExtensionPage} from '@/components/marketing/ExtensionPage';import {pageMetadata} from '@/lib/marketing/site';import {extensions} from '@/lib/marketing/catalog';
export const metadata=pageMetadata('Quick Replies Chrome Extension',extensions['quick-replies'].description,'/extensions/quick-replies');export const dynamic='force-dynamic';
export default function Page(){return <ExtensionPage slug="quick-replies"/>}
