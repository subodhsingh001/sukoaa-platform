import {FileText,MessagesSquare} from 'lucide-react';
import Link from 'next/link';import {extensions,type ExtensionSlug} from '@/lib/marketing/catalog';import {extensionLinks,breadcrumbs,canonicalOrigin} from '@/lib/marketing/site';import {SiteFrame,Crumbs,Questions,RelatedTools} from './SiteFrame';import {StructuredData} from './StructuredData';
export function ExtensionPage({slug}:{slug:ExtensionSlug}){const product=extensions[slug],url=extensionLinks()[slug],origin=canonicalOrigin();return <SiteFrame>
 <StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'Extensions',path:'/extensions'},{name:product.name,path:'/extensions/'+slug}])}/>
 {url&&origin&&<StructuredData data={{'@context':'https://schema.org','@type':'SoftwareApplication',name:product.name,description:product.description,url:origin+'/extensions/'+slug,installUrl:url,applicationCategory:'BrowserApplication',operatingSystem:'Chrome on desktop'}}/>}
 <Crumbs name={product.name} parent={{label:'Extensions',href:'/extensions'}}/>
 <article className="prose-page extension-reference">
  <div className="reference-title">{slug==='quick-replies'?<MessagesSquare size={28} aria-hidden="true"/>:<FileText size={28} aria-hidden="true"/>}<h1>{product.headline}</h1></div>
  <p className="prose-lead">{product.intro}</p>
  <div className="release-status" role="status"><strong>{url?'Store listing linked':'Store listing not linked here'}</strong><p>{url?'Check the Chrome Web Store listing for the current features, version, permissions and privacy policy.':'This page describes an extension project. It does not offer an installer. Confirm features and data handling in a published store listing before installing.'}</p></div>
  <div className="product-actions">{url&&<a className="product-button dark" href={url} target="_blank" rel="noopener noreferrer">Add to Chrome</a>}<a className="product-button light" href="#how-it-works">Workflow overview</a></div>
  <section id="how-it-works"><h2>{url?'Workflow overview':'Intended workflow'}</h2><ol>{product.steps.map(([title,copy])=><li key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol></section>
  <h2>Use cases</h2><ul>{product.ideas.map(idea=><li key={idea}>{idea}</li>)}</ul>
  <div className="product-actions">{url?<a className="product-button dark" href={url} target="_blank" rel="noopener noreferrer">View store listing</a>:<Link className="product-button dark" href="/tools/javascript">Open JavaScript playground</Link>}</div>
 </article>
 <Questions items={[...product.faq]}/><RelatedTools/>
 </SiteFrame>;}
