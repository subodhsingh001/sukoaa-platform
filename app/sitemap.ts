import type {MetadataRoute} from 'next';import {canonicalOrigin,indexingEnabled,publicPaths} from '@/lib/marketing/site';
export default function sitemap():MetadataRoute.Sitemap{const origin=canonicalOrigin();if(!origin||!indexingEnabled())return [];return publicPaths.map(path=>({url:origin+path,changeFrequency:'monthly' as const,priority:path==='/'?1:path.startsWith('/tools/')?.8:.6}))}
