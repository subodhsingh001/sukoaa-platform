import {supportContacts} from '@/lib/platform/support';
import {practiceExercises} from '@/lib/marketing/practice';
import {activities} from '@/lib/play/catalog';
import {questionSummaries} from '@/lib/interview/catalog';
import {SiteFrame,Crumbs} from '@/components/marketing/SiteFrame';
import {StructuredData} from '@/components/marketing/StructuredData';
import {pageMetadata,breadcrumbs} from '@/lib/marketing/site';
export const metadata=pageMetadata('About Sukoaa: Browser Coding Tools & Practice','Learn what Sukoaa is building: browser coding playgrounds, practical exercises and a growing collection of developer tools with clear runtime limits.','/about');
export default function About(){
 const {support}=supportContacts();
 const collections=[
  {name:'Coding practice exercises',count:practiceExercises.length,href:'/practice'},
  {name:'Play & Learn activities',count:activities.length,href:'/play'},
  {name:'Interview preparation questions',count:questionSummaries.length,href:'/interview-prep'}
 ];
 return <SiteFrame>
  <StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'About Sukoaa',path:'/about'}])}/>
  <Crumbs name="About Sukoaa"/>
  <article className="prose-page">
   <h1>About Sukoaa</h1>
   <p className="prose-lead">Sukoaa provides browser-based coding tools, project studios and self-guided developer practice. You can write code, inspect its output and save or export work using the controls in each tool.</p>
   <h2>Code execution</h2>
   <p>JavaScript, TypeScript, Python, HTML/CSS and SQLite playgrounds run code on your device. Project studios support files, imports and previews for React, React Native Web, Angular and Next.js, with different runtime requirements. PHP, Laravel, FastAPI, PostgreSQL and Tailwind labs have their own documented scope. Check the matching tool guide for package support, execution limits and browser requirements.</p>
   <p>Languages that depend on a remote compiler require an available isolated runner. An editor or starter file does not establish that execution is available. The guide and workspace show the relevant requirements.</p>
   <h2>Learning content</h2>
   <p>Practice exercises include starters, hints, expected results and written solutions. Play &amp; Learn activities include task-specific checks. Interview preparation provides reference answers and self-review rubrics. These are learning aids, not qualifications or hiring assessments.</p>
   <div className="fact-table"><table><thead><tr><th scope="col">Collection</th><th scope="col">Items</th></tr></thead><tbody>{collections.map(item=><tr key={item.href}><th scope="row"><a href={item.href}>{item.name}</a></th><td>{item.count}</td></tr>)}</tbody></table></div>
   <h2>AI and external services</h2>
   <p>Sukoaa does not run server-side AI agents. Token counting and the RAG playground’s retrieval and embedding steps run in your browser; the embedding option downloads its model when you use it. Tool schema generation uses a local rules-based parser.</p>
   <p>The RAG playground can send text to an external API when you select that option and supply the destination and your own key. Its demo answer is simulated. A separate Gemini wording option is available only on an explicitly enabled local development server, with consent; production requests to that endpoint are blocked. The <a href="/privacy">Privacy page</a> explains these data flows.</p>
   <h2>Saving your work</h2>
   <p>Basic browser tools work without signing in. Local drafts and progress stay in this browser and can be lost when site data is cleared. Supported tools offer optional cloud saving when accounts are available. Export important work before clearing storage or changing devices.</p>
   <h2>Browser and extension projects</h2>
   <p>Sukoaa Browser is a separate application. Chrome extensions are separate products with their own permissions and privacy policies. Use the published release or store listing to confirm what you can install; a project description is not evidence of a released package.</p>
   <h2>Maker</h2>
   <dl className="maker-details">
    <div><dt>Name</dt><dd>Subo</dd></div>
    <div><dt>Biography</dt><dd>Frontend developer working with React, Angular and Next.js. Sukoaa brings browser coding tools and self-guided developer practice into one site.</dd></div>
    <div><dt>Source</dt><dd><a href="https://github.com/subodhsingh001/sukoaa-platform" target="_blank" rel="noopener noreferrer">Sukoaa Platform repository on GitHub</a></dd></div>
    <div><dt>Contact</dt><dd>{support?<a href={'mailto:'+support}>{support}</a>:<span>A private support email is not available yet. <a href="/contact">See public feedback options</a>.</span>}</dd></div>
   </dl>
   <p>For a reproducible issue or available support channels, visit <a href="/contact">Contact and feedback</a>.</p>
   <div className="product-actions"><a className="product-button dark" href="/practice">Start coding practice</a><a className="product-button light" href="/tools">Browse coding tools</a></div>
  </article>
 </SiteFrame>;
}
