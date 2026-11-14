import type {Metadata} from 'next';
import {SiteFrame} from '@/components/marketing/SiteFrame';
export const metadata:Metadata={title:'Page not found',robots:{index:false,follow:true}};
export default function NotFound(){return <SiteFrame><section className="collection-intro"><p className="product-eyebrow">PAGE NOT FOUND</p><h1>We couldn’t find that page.</h1><p>The link may be old or mistyped. Try the coding tools or the practice exercises instead.</p><div className="product-actions"><a className="product-button dark" href="/tools">Browse coding tools →</a><a className="product-button light" href="/practice">Coding practice →</a></div></section></SiteFrame>}
