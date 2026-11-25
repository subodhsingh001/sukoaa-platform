import type {MetadataRoute} from 'next';import {canonicalOrigin,indexingEnabled,publicPaths,contentUpdated} from '@/lib/marketing/site';
import {contentLastModified} from '@/lib/marketing/content-updates';
// Use recorded page revisions. SITE_LASTMOD is only for a genuine whole-site content revision.
// Refresh the sitemap for the existing UTC daily challenge without re-dating other pages.
export const revalidate=3600;
const priority=(path:string)=>path==='/'?1:path==='/tools'||path==='/practice'||path==='/play'?.9:path.startsWith('/tools/')||path.startsWith('/labs/')||path==='/demo-api'?.8:path.startsWith('/practice/')||path.startsWith('/play/tracks/')?.7:.5;
export default function sitemap():MetadataRoute.Sitemap{const origin=canonicalOrigin();if(!origin||!indexingEnabled())return [];return publicPaths.map(path=>({url:origin+path,lastModified:contentLastModified(path,contentUpdated),changeFrequency:path==='/play/daily'?'daily' as const:'monthly' as const,priority:priority(path)}))}
