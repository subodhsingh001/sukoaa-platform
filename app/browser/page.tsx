import {browserReleaseUrl} from '@/lib/marketing/browser-release';
import Link from 'next/link';import {SiteFrame,Crumbs,Questions,RelatedTools} from '@/components/marketing/SiteFrame';import {pageMetadata,breadcrumbs} from '@/lib/marketing/site';import {StructuredData} from '@/components/marketing/StructuredData';
export const metadata=pageMetadata('Sukoaa Browser — Downloads & Installation','Meet the Sukoaa browser project. Find published Windows and Android packages, version details, checksums, and installation guidance when releases are available.','/browser');
export default function Browser(){const releaseUrl=browserReleaseUrl();return <SiteFrame>
 <StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'Sukoaa Browser',path:'/browser'}])}/>
 <Crumbs name="Sukoaa Browser"/>
 <article className="prose-page browser-reference">
  <h1>Sukoaa Browser</h1>
  <p className="prose-lead">Sukoaa Browser is a separate browser application. Use its release information to check the supported operating system, version and installation requirements.</p>
  <div className="release-status" role="status"><strong>Release information</strong><p>{releaseUrl?'A publisher-linked GitHub release page is available. Check its assets and notes for the package you need.':'Use Downloads for the current package list. If no package is listed for your operating system, this website does not offer an installer for it.'}</p></div>
  <div className="product-actions"><a className="product-button dark" href={releaseUrl||'/downloads'} {...(releaseUrl?{target:'_blank',rel:'noopener noreferrer'}:{})}>{releaseUrl?'View GitHub release':'View published downloads'}</a><a className="product-button light" href="#installation">Installation instructions</a></div>
  <section id="installation"><h2>Installation</h2><ol>
   <li>Open Downloads and choose a package for your operating system and architecture.</li>
   <li>Read its version, publisher information, installation notes and recorded SHA256 checksum. Compare the checksum with your downloaded file.</li>
   <li>Follow the package’s instructions. A download does not establish code signing or automatic updates; check the release information for those details.</li>
  </ol><p>For Windows, check the installer’s stated architecture. Android APK distribution is separate from a Google Play listing.</p>
  <ul className="reference-links"><li><Link href="/downloads">Windows release availability</Link></li><li><Link href="/downloads">Android release availability</Link></li></ul></section>
 </article>
 <Questions items={[{q:'Is Sukoaa Browser a Chrome extension?',a:'No. A browser is a separate application with its own installer or app package. Sukoaa’s Chrome extensions are distributed separately through their store listings.'},{q:'Why is there no installer button for my platform?',a:'Download buttons appear only for packages the publisher has added to the release list. This website does not generate or verify a browser binary automatically.'},{q:'What does the SHA256 checksum tell me?',a:'It lets you compare a downloaded file with the publisher’s recorded hash. It does not prove publisher identity, replace code signing, or guarantee that a file is safe.'}]}/>
 <RelatedTools/>
 </SiteFrame>;}
