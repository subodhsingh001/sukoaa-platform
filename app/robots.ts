import type {MetadataRoute} from 'next';import {canonicalOrigin,indexingEnabled} from '@/lib/marketing/site';
export default function robots():MetadataRoute.Robots{const origin=canonicalOrigin();return indexingEnabled()?{rules:{userAgent:'*',allow:'/',disallow:['/api/']},sitemap:origin+'/sitemap.xml',host:origin}:{rules:{userAgent:'*',disallow:'/'}}}
