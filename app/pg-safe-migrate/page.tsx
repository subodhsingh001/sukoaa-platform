import {SiteFrame,Crumbs,Questions} from '@/components/marketing/SiteFrame';
import {pageMetadata,breadcrumbs} from '@/lib/marketing/site';
import {StructuredData} from '@/components/marketing/StructuredData';
import {CopyCommand} from './CopyCommand';
import styles from './product.module.css';

const path='/pg-safe-migrate';
const repo='https://github.com/subodhsingh001/pg-safe-migrate';
const npm='https://www.npmjs.com/package/@subodh001/pg-safe-migrate';
const marketplace='https://marketplace.visualstudio.com/items?itemName=sukoaa.pg-safe-migrate-vscode';
export const metadata=pageMetadata('PG Safe Migrate — PostgreSQL migration safety linter','Find risky PostgreSQL schema changes before deployment with an open-source CLI, migration advisor, CI policy gates and VS Code diagnostics.',path);
const features=[['Migration analysis','Detect destructive schema changes and potentially disruptive locks using PostgreSQL syntax analysis.'],['Safety advisor','Understand findings and review suggested migration alternatives.'],['CI policy gates','Apply team policies and generate machine-readable JSON, SARIF or Markdown reports.'],['Editor diagnostics','Review SQL findings in VS Code with cancellation and bounded lint scheduling.'],['Framework support','Analyze raw SQL and migration directories from Prisma, Drizzle and Flyway.'],['Migration simulation','Test migrations against disposable PostgreSQL databases before deployment.']];
export default function Page(){return <SiteFrame>
 <StructuredData data={breadcrumbs([{name:'Home',path:'/'},{name:'PG Safe Migrate',path}])}/>
 <Crumbs name="PG Safe Migrate"/>
 <article className={styles.page}>
 <section className={styles.hero}><div><p className={styles.eyebrow}>OPEN SOURCE / MIT LICENSE</p><h1>Catch risky PostgreSQL migrations before production.</h1><p>PG Safe Migrate helps developers identify destructive schema changes, understand migration risks and enforce review policies before deployment.</p><div className="product-actions"><a className="product-button dark" href="#install">Get started</a><a className="product-button light" href={repo}>View source on GitHub</a></div><p className={styles.versions}>CLI v2.6.0 · VS Code v0.7.0</p></div><div className={styles.terminal}><p>migration.sql</p><pre>ALTER TABLE users DROP COLUMN email;</pre><strong>PG002 · Destructive column removal</strong><p>Dropping this column can break older application instances.</p><p className={styles.advice}>Advisor: Stop referencing the column in deployed application versions before dropping it in a later release.</p><small>Illustrative diagnostic</small></div></section>
 <div className={styles.stats}><div><strong>265</strong><span>Automated tests passed for release</span></div><div><strong>14–18</strong><span>PostgreSQL integration versions tested</span></div><div><strong>MIT</strong><span>Open-source license</span></div></div>
 <section id="install"><h2>Get started</h2><p>Install the CLI as a development dependency, then analyze a saved migration file.</p><CopyCommand command="npm install --save-dev @subodh001/pg-safe-migrate@2.6.0"/><CopyCommand command="npx pg-safe-migrate migration.sql --advisor"/><p>Alternatively, run the CLI without adding it to your project:</p><CopyCommand command="npx --yes --package=@subodh001/pg-safe-migrate@2.6.0 pg-safe-migrate migration.sql --advisor"/><div className="product-actions"><a className="product-button light" href={npm}>npm package</a><a className="product-button light" href={marketplace}>Install VS Code extension</a></div></section>
 <section><h2>Built for migration review</h2><div className={styles.features}>{features.map(([title,description])=><div key={title}><h3>{title}</h3><p>{description}</p></div>)}</div></section>
 <section><h2>From local development to CI</h2><ol><li>Write and save your migration SQL.</li><li>Run the linter and review the findings with your team.</li><li>Revise risky operations and validate against representative data.</li><li>Enforce agreed policies in CI before deployment.</li></ol><p><a href={repo+'#readme'}>Read the CLI documentation</a> · <a href={repo+'/issues'}>Report an issue or share feedback</a></p></section>
 <aside className={styles.notice}><h2>Know the limits</h2><p>Static analysis and simulation do not guarantee zero downtime. Review findings with production workload, data volume and deployment order in mind. Large SQL files may consume significant memory; extension safeguards are not a hard memory cap.</p></aside>
 </article>
 <Questions items={[{q:'Is PG Safe Migrate free?',a:'Yes. The CLI and extension are open source under the MIT license.'},{q:'Does it connect to my production database?',a:'Ordinary static SQL linting does not require a database connection. Optional database inspection and simulation have separate configuration requirements.'},{q:'Does it guarantee zero downtime?',a:'No. It helps identify configured risks; production validation and operational review are still necessary.'}]}/>
 </SiteFrame>}
