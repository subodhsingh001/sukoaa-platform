import {json,route} from '@/lib/platform/http';import {publishedReleases} from '@/lib/marketing/releases';
export async function GET(){return route(async()=>json(await publishedReleases()));}
