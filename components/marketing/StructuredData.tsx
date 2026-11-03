import {jsonLd} from '@/lib/marketing/site';
export function StructuredData({data}:{data:unknown}){return data?<script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(data)}}/>:null}
