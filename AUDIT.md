# Sukoaa presentation and copy audit

## Phase 2 implementation scope, approved 19 November 2026

This addendum records homepage replacement candidates before edits. The Phase 0 findings below remain a historical baseline. Phase 1 is documented in `CHANGES.md`.

| Homepage block in `components/Home.tsx` | Planned treatment |
| --- | --- |
| Hero illustration, intro strip and final promotional CTA | Remove decorative browser chrome and slogans. Retain the existing H1 words and primary compiler destination, with a concise introduction and tool-directory access. |
| Filterable tool directory (over 150 words across its cards) | Retain every current publicly listed tool, category value, favorite identifier and destination. Rewrite discovery descriptions; replace redundant Available badges with exception-only status and compute counts. This content is reorganized, not deleted. |
| LearningTracks discovery block (over 150 words across its cards) | Render the same six module links, descriptions and practice destinations in a homepage-specific documentation layout. Derive the count from learningModules. The shared component used by `/tools` is left for Phase 3. No curriculum content is removed. |
| Playground banner and why section | Replace promotional presentation with a plain JavaScript example and technical execution/storage guidance. Preserve the JavaScript sample and output, without mock editor tabs or decorative window chrome. |
| Backend/database/AI links and roadmap (potentially over 150 words when combined) | Retain every existing discovery link and substantive execution constraint. Present a plain link directory and a runtime/status table. Replace speculative marketing with source-verified limits and accurate optional model-call wording. |
| Homepage FAQ (over 150 words across the answers) | Retain all four questions and functional expand/collapse controls; keep substantive account, runtime, download and saving explanations. Tighten visitor-facing copy. |
| Online compilers and coding practice SEO section | Retain its heading keywords, explanatory paragraph and all existing guide links, while removing decorative symbols and slogans. |
| Legacy modal UI | Preserve actions and code samples. Replace leaked starter/privacy notes with links to the existing privacy page. Dead state and legacy global CSS remain for Phase 5. |

The homepage metadata, routes, canonical, JSON-LD and all educational data files remain protected. No code sample, question, exercise, grading rule or API contract is being rewritten. Phase 2 does not include a GitHub push or deployment.

Phase 0 only. Prepared 19 November 2026 (Asia/Kolkata).

## Decision and scope

Proceed with the documentation-style redesign, subject to explicit approval of Phase 1. **No application code has been modified by this audit.** The only addition to the project root is this report. Do not start Phase 1 automatically.

This is a source-level product, copy, visual-system and accessibility audit, not a claim that software was AI-generated, a full security assessment, an independent accessibility certification, or a guarantee of Google indexing. Visual concerns are design judgments; static accessibility findings are identified as such.

Audited source: `Sukoaa-Platform-Interview-Prep-v0.25.0.zip`, package version `0.25.0`, 673 source/package files. Baseline SHA-256: `43cd0fe9a807bc56903f1762ad1629155522afec016d89b42ed822f474240f37`. This is the latest source supplied in this conversation; it is not proof that GitHub or sukoaa.com contains the same version. No production environment variables or customer data were read.

Architecture: root-level Next.js App Router (`app/`, not `src/app`), Next dependency `^16.4.6` with a committed lockfile, React 19.2.6, strict TypeScript 5.9.3, `@/*` mapped to the repository root, Tailwind CSS 4 and substantial handwritten CSS. `lucide-react` is already installed. No new design or icon dependency is required. The package requests Node 24.x.

Inventory: 67 `app/**/page.tsx` modules, 7 layout modules, 115 TSX components, 25 CSS files. Dynamic families are mapped to their current concrete URLs in Appendix A. The sitemap data currently contains 278 unique public paths. API routes and non-page framework entry points are also inventoried below.

## Approval boundaries and interpretation

- Preserve every route, URL, redirect target, query parameter, canonical, indexing rule and JSON-LD value. Do not remove or change sitemap entries in this presentation task.
- Freeze current title/meta-description values by default. Reword H1s only while retaining their existing target SEO keywords; where the H1 is a slogan, use the actual product/page name. Keep the ` — ` delimiter in metadata and `lib/learning/lab-seo.ts`; the labs structured-data name actually splits on it.
- Keep all existing `/tools/*` and `/labs/*` About, FAQ, use-case, limit and practice-link sections. A static code example is instructional text, not decorative hero art; retain useful examples while removing misleading window chrome.
- Do not rewrite interview lessons, reference answers, question banks, exercise instructions, solutions, code samples, play activities or technical documentation to satisfy a blanket vocabulary grep. Only remove identified leaked editorial notes from those surfaces. Preserve IDs, slugs, progress keys, scoring, durations, filter values and data formats.
- `draft`, `release`, `placeholder`, `source`, `model` and `TODO` are not inherently leaks. Keep real saved-draft labels, real release/download management, HTML placeholder attributes, TypeScript/library terms and fictional `/todos` resources.
- Preserve the behavior of the recently-added question filter; give it a neutral visitor-facing label rather than deleting the control or changing its matching value. Preserve mock-round content and question provenance internally.
- Shared chrome should mean the same navigation components and destinations, with a compact editor variant. Do not insert a large document footer into fixed-height Studio/fullscreen grids or reduce editor area. Existing fullscreen controls, splitters and runtime startup panels must continue to work.
- Do not delete an entire section with more than 150 words under a CSS-cleanup pretext. Protected long sections and any deletion candidates are listed below.
- No repository Git metadata is present in the supplied ZIP. Future small commits require a Git checkout; do not fabricate commit/push history. This audit makes no deployment.

## Highest-priority findings

| ID / priority | Evidence | Finding and proposed treatment |
| --- | --- | --- |
| F01 / High | `components/Home.tsx:16`; `lib/play/catalog.ts:6` | Homepage says “78 activities”; the combined catalog contains 90. Compute discovery totals from lightweight shared catalog statistics, without bundling every question/solution into the homepage client bundle. |
| F02 / High | `app/about/page.tsx:5`; `app/api/ai/run/route.ts:3`; `app/api/token-wording/route.ts`; `lib/token-wording.ts:15` | “AI features are disabled in this release” is too broad. Platform agent endpoint returns 503, but optional localhost-only Gemini wording makes a server-to-Google request. Production denies that endpoint. RAG embeddings execute locally; optional BYOK generation calls the chosen provider directly from the browser. Publish this scoped account, not a blanket no-AI claim. |
| F03 / High | `app/globals.css:2`; `components/marketing/marketing.css:1`; all CSS inventory below | Base body is 14px. Static scan finds 441 rules with explicit font sizes below 12px, including responsive overrides and editor rules. These are declarations, not 441 unique visible violations. Establish scoped typography and test the final cascade; IDE exception permits 12px, not 8–11px. |
| F04 / High | `components/marketing/SiteFrame.tsx:6`; `components/Home.tsx:58`; Studio/workspace/native/account headers | Chrome is duplicated. SiteFrame footer has link groups of 12, 10 and 12 links; homepage has another footer. Replace with common components and four labelled columns, at most six links each, preserving omitted destinations through Tools/Learn/search. |
| F05 / Medium | `components/Home.tsx:60–73`; `app/browser/page.tsx:5`; `components/marketing/ExtensionPage.tsx:3` | Fake browser UI, code-window artwork, concept mockups, poetic slogans and repeated all-caps eyebrows dominate content. Remove decorative mockups and restyle useful text/code as documentation. Keep functional previews, real status, FAQs and instructions. |
| F06 / Medium | `components/interview/InterviewDirectory.tsx:53,59`; `lib/interview/catalog.ts:10–13` | Visitor-facing screenshot provenance, “Sources checked”, release labels and expansion changelog prose leak the construction history. Rewrite only editorial interface notes, retaining source links, the exact 13 supplied questions, all 100 lessons and all mock structures. |
| F07 / High | `components/marketing/marketing.css:1`; `app/globals.css:2`; `components/portal-ready/portal-ready.css` | Some small-text color pairs fail 4.5:1 in their declared light-theme combinations: #84917b on #fafbf7 = 3.20:1; #87907e on #fafbf8 = 3.20:1; #748263 on #fafbf7 = 3.95:1; #74876a on #fafbf7 = 3.73:1. Verify rendered backgrounds/overrides before changing them. Preserve explicit Monaco menu and lab-output contrast fixes. |
| F08 / Medium | `components/marketing/CommandPalette.tsx:39–51` | Dialog has basic roles/focus-on-open, but no explicit focus trap, focus restoration, combobox-to-listbox linkage or active-descendant relationship. The list renders at most 40 entries while keyboard indexing uses the full list. Flag keyboard-index mismatch as a separate behavior issue; accessibility wiring can be improved without changing destinations. |
| F09 / Medium | `app/api/status/route.ts:5`; `package.json:3` | Status API reports 0.23.0 while the package is 0.25.0. Confirmed stale metadata. Do not alter this API payload as part of a UI-only phase; list it for a separately scoped follow-up. |
| F10 / Medium | `components/Home.tsx:74`; `app/privacy/page.tsx:3`; `app/contact/page.tsx:5` | Legacy modal says the starter privacy summary must be completed before public launch. Dedicated privacy/contact/security pages already contain more detailed flows. Route visitors to those pages while retaining immediate action-specific consent and safety notices. Deployment support inboxes remain unverified. |

### F11 / High: confirmed responsive overflow in the unchanged homepage

Browser baseline captures confirm horizontal overflow at all three requested widths. At 375px the header account area ends near x=426 and the menu button near x=475; at 768px header links/account controls extend near x=1245. The 1280px document also scrolls horizontally to 1450px. This is an observed layout defect, not merely a CSS suspicion. Phase 1 must fix shared header sizing/breakpoints; Phase 2 must confirm the homepage directory and hero no longer create overflow. Do not hide it with global `overflow-x: hidden`, which could conceal keyboard focus or editor panels.

## AI and data-flow facts checked in source

| Feature / exact source | What the source actually does | Wording boundary |
| --- | --- | --- |
| `app/api/ai/run/route.ts:3`, `lib/platform/config.ts:1` | `POST` returns 503 / `AI_DISABLED`; `AI_ENABLED = false`. No model invocation here. | “Platform AI agents are unavailable.” Do not change response status or code in a copy task. |
| `app/api/token-wording/route.ts`, `lib/token-wording.ts:15–24` | Gate requires development mode, explicit enable flag, localhost/loopback and matching Origin. It is blocked in production even if flags are copied. | Optional **local development** feature, not a public hosted AI capability. |
| `lib/token-wording.ts:26–40`, `components/tools/TokenWording.tsx` | Consented text goes via the local Node server to Google with a server-configured Gemini key. The operator configures the key; there is no visitor key field for this action. | Do not imply all external model calls are browser-direct or require a visitor-supplied key. |
| `components/tools/TokenCounter.tsx`, `public/runtime/tokenizers/*` | Token counting uses locally served tokenizer workers. Optional wording is shown only behind its development UI gate. | Local token counting is not generative model inference or a model's full billable request size. |
| `components/tools/RagPlayground.tsx`, `lib/rag/core.ts` | Chunking/BM25 run locally. BYOK generation sends the constructed prompt to the user-selected provider URL from the browser. | Distinguish local retrieval from optional external generation and provider charges. |
| `public/rag-worker.mjs:3–13` | Transformer library/model download from external hosts; embedding inference runs in a worker. | Local processing does not mean no network traffic: model/CDN hosts receive connection metadata. |
| `app/api/demo/chat/completions/route.ts`, `lib/demo-api/chat.ts` | Server returns simulated completion-shaped responses and streams; no real model call. | “Simulated API response”, not AI-generated text. Preserve demo API contracts. |

Suggested factual production summary, subject to verifying the deployed version: “Sukoaa does not host a generative model. Token counting and RAG retrieval run in your browser. Embedding mode downloads a model. You can send a RAG prompt to an external provider using your own API key. Optional Gemini wording is available only on an explicitly enabled local development server.” Keep privacy detail and consent close to the relevant action.

This audit has not invoked any AI endpoint or sent example text to a provider. It establishes source behavior, not the contents of production environment variables or a hosted endpoint penetration test.

## Route and page-module audit

Each source page has its own row. `P1` means shared design/chrome; `P2` homepage; `P3` page/tool copy and layout; `P4` factual/editorial notes; `P5` proven dead-asset cleanup. All plans are pending approval. Shared findings apply transitively to every consumer; a row need not repeat every inherited CSS defect.

| Route / audit ID | Exact source paths | Current issues | Planned changes (not implemented) |
| --- | --- | --- | --- |
| T01 `/about` | `app/about/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx` | Slogan H1/eyebrow, outdated blanket AI-disabled sentence and overly broad runner description; no attributable Maker profile or configured contact in source. | P3/P4: About Sukoaa H1, runtime distinctions and scoped AI facts; grounded Maker section with explicit placeholders for unverified details. Keep GitHub link and all substantive sections. |
| T02 `/account` | `app/account/page.tsx`<br>UI: `components/AccountDataTools.tsx`, `components/SukoaaLogo.tsx`, `components/AccountSession.tsx` | Independent header/story/footer treatment, slogan H1, repeated benefits and tiny help text. Auth messages are functional. | P1/P3: common compact chrome; Account H1 and short form help; preserve auth modes, redirects, pending confirmation, session state, export and validation behavior. |
| T03 `/admin` | `app/admin/page.tsx`<br>UI: `components/SukoaaLogo.tsx` | Standalone release manager chrome and technical operational guidance; this is an administrative tool, not a marketing leak. | P1/P3: compact shared chrome and accessible fields; retain real release terminology, authorization and publish semantics. Do not add fictional products/checksums. |
| T04 `/admin/setup` | `app/admin/setup/page.tsx`<br>UI: `components/admin/SetupGuide.tsx` | Administrator-gated documentation; internal setup instructions are appropriate here. | P1/P3: documentation typography and common chrome only after verifying admin layout. Preserve access check and operational detail. |
| T05 `/brand-preview` | `app/brand-preview/page.tsx`<br>UI: `components/SukoaaLogo.tsx` | Publicly routable, noindex design approval page with “Your approved artwork”, fake hero, slogans and decorative mock layout. | P3/P4: retain URL/noindex. Present the actual approved wordmark variants factually; remove fake product mockup and conversational approval language. Do not redraw the logo. |
| T06 `/browser` | `app/browser/page.tsx`<br>UI: `components/SukoaaLogo.tsx`, `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx` | Concept screenshot substitute, slogan H1, repeated platform caveats. Empty source fallback release list does not prove no externally published binary. | P3/P4: Sukoaa Browser H1; one factual status/installation section, actual configured release link when present. Remove conceptual browser scene; preserve installer destinations and real metadata. Need publisher confirmation before asserting no release exists. |
| T07 `/contact` | `app/contact/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx` | All-caps intro, long shared disclaimers; support email appears only if SUPPORT_EMAIL is configured. No fixed monitored address in source. | P3/P4: concise reporting instructions, private/public distinction and real contact fallback; do not invent an inbox or promise a response SLA. Preserve data export/deletion guidance. |
| T08 `/demo-api` | `app/demo-api/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/play/DemoApiDocs.tsx`, `components/marketing/StructuredData.tsx` | Content owned by DemoApiDocs/ApiStudio; dense REST/GraphQL docs use competing headers, small labels and card chrome. | P1/P3: documentation hierarchy and readable examples. Preserve REST paths, methods, variables, generated snippets, sandbox tokens, TTL and simulated-write explanations. |
| T09 `/downloads` | `app/downloads/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx` | Slogan H1, repetitive eyebrows and platform/release warnings. Release cards are functional, not redundant Available badges. | P3/P4: Downloads H1 and factual package/status table. Preserve publishedReleases validation, SHA-256 fields, unavailable state, store links and starter-download URL. |
| T10 `/extensions` | `app/extensions/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx` | Slogan H1, all-caps intro, large rounded themed cards and raw symbol icons; real store-availability labels matter. | P3: Extensions H1; restrained listing with exception status and actual links. Preserve catalog entries and installation warning without repetitive promotional copy. |
| T11 `/extensions/quick-replies` | `app/extensions/quick-replies/page.tsx`<br>UI: `components/marketing/ExtensionPage.tsx` | ExtensionPage uses slogan headline, mockup paper scene, concept preview labels and repeated publication caveats. The current availability policy is noindex. | P3/P4: factual product heading/capabilities and actual store status. Remove concept artwork while retaining FAQ, permissions caveats and existing store URL/noindex policy. |
| T12 `/extensions/web-pdf-studio` | `app/extensions/web-pdf-studio/page.tsx`<br>UI: `components/marketing/ExtensionPage.tsx` | ExtensionPage uses slogan headline, mockup paper scene, concept preview labels and repeated publication caveats. The current availability policy is noindex. | P3/P4: factual product heading/capabilities and actual store status. Remove concept artwork while retaining FAQ, permissions caveats and existing store URL/noindex policy. |
| T13 `/interview-prep/[track]/[question]` | `app/interview-prep/[track]/[question]/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx`, `components/interview/InterviewQuestion.tsx` | Question content is protected. Shared toolbar has small metadata and editorial provenance labels. | P1/P3/P4: improve chrome, tabs, focus, body width and readable code. Remove only construction-history notes in display; preserve q.title, lesson, answer, examples, hints, IDs, further-reading URLs and self-review behavior. |
| T14 `/interview-prep/[track]` | `app/interview-prep/[track]/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/interview/InterviewDirectory.tsx` | Same InterviewDirectory issues; title count already computed, but hero always displays a GenAI sample even on Frontend. | P3/P4: track-specific factual heading; reuse directory and actual counts. Remove decorative sample panel; do not alter the questions or recommendation logic. |
| T15 `/interview-prep/mock` | `app/interview-prep/mock/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/interview/MockInterview.tsx` | Slogan intro, screenshot notes from mock catalog, small timer/round metadata. | P3/P4: Mock interview H1 and neutral round descriptions; retain eight curated rounds, question order, 15-minute short sessions, pause/resume and self-assessment. |
| T16 `/interview-prep` | `app/interview-prep/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/interview/InterviewDirectory.tsx` | InterviewDirectory slogan hero, decorative sample, many eyebrows, stale editorial release/screenshot voice. | P1/P3/P4: Interview preparation H1, neutral directory intro, compact track/level selection and dynamic counts; retain all lessons, mocks, progress and filter semantics. |
| T17 `/interview-prep/project` | `app/interview-prep/project/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/interview/ProjectDefence.tsx` | Poetic worksheet presentation; all actual prompt fields are educational content. | P3: Project-defence worksheet H1 and readable form layout; keep all eight fields, stored data and export behavior. |
| T18 `/labs/[technology]` | `app/labs/[technology]/page.tsx`<br>UI: `components/learning/BackendPlayground.tsx`, `components/marketing/SiteFrame.tsx`, `components/learning/BrowserLabs.tsx`, `components/marketing/StructuredData.tsx`, `components/marketing/SiteFrame.tsx` | SEO sections and accurate environment caveats already exist; intro sentence is repeated in About section; dense lab chrome and cards use lime/rounded styling. | P1/P3: preserve each seo.h1/title/description, structured data, About and FAQ. Tighten only surrounding interface prose; keep PHP/FastAPI/Laravel/PGlite/Tailwind/Node limits and existing lab contrast overrides. Do not alter title split delimiter. |
| T19 `/native` | `app/native/page.tsx`<br>UI: `components/studio/StudioWorkspace.tsx` | Delegates to StudioWorkspace by default and ExpoWorkspace optionally; both have standalone chrome, welcome slogans and tight runtime controls. | P1/P3: compact shared chrome and factual React Native heading/status; keep native/web/Expo modes, embedded provider, explicit start action and full-page preview. |
| T20 `/` | `app/page.tsx`<br>UI: `components/Home.tsx` | Homepage has fake “sukoaa://a-fresh-start” chrome, multiple slogans/eyebrows, lime/decorative art, duplicate header/footer, 78 versus 90 activities, hard-coded question badges and many Available badges. Legacy privacy/modal code remains. | P1/P2: common chrome; concise factual value statement; one primary CTA; move existing filterable directory into the first viewport; preserve favorites, filtering, tool links and SEO/FAQ content; replace decorative icons with Lucide. Retain h1 keywords online/coding/tools/learn/running/examples. |
| T21 `/play/[slug]` | `app/play/[slug]/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/learning/TechnicalActivity.tsx`, `components/play/ActivityPlayer.tsx` | Activity/TechnicalActivity components own content; surrounding hint/feedback chrome has filler and raw icons. | P3/P4: interface and accessibility only. Do not rewrite activity instructions, code, explanation, hint or grading criteria, except an actual developer note. |
| T22 `/play/daily` | `app/play/daily/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/learning/TechnicalActivity.tsx`, `components/play/ActivityPlayer.tsx` | Same player chrome. “A new one every day” can imply novel content, while dailyActivity rotates among the first 30 records. | P3/P4: call this a daily selection, retain UTC schedule and current algorithm. Algorithm changes are outside the redesign. |
| T23 `/play` | `app/play/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/play/PlayHub.tsx` | Slogan hero, repetitive triplet intro, all-caps labels and tiny card metadata; counts in PlayHub are otherwise computed. | P3: Play & Learn H1 and factual activity directory. Keep the 90 activity records, solutions, scoring, track IDs, daily selection algorithm and cloud/local progress unchanged. |
| T24 `/play/progress` | `app/play/progress/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/play/PlayHub.tsx` | Poetic progress H1 and several repeated local-storage explanations; protected/noindex private-state surface. | P3: Learning progress H1 and concise local/cloud explanation; preserve import/export/reset/merge and current indexing policy. |
| T25 `/play/tracks/[track]` | `app/play/tracks/[track]/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/play/PlayHub.tsx` | Track hub presentation inherits PlayHub filler; catalog descriptions are UI discovery text but activity content is protected. | P3: plain track introduction and dynamic available count; retain every track/URL/activity and prerequisites. No curriculum rewrite. |
| T26 `/portal-ready/[preset]` | `app/portal-ready/[preset]/page.tsx` | Legacy valid-preset redirect and notFound logic. | No presentation change; preserve current redirect validation and targets for all five preset IDs. |
| T27 `/portal-ready` | `app/portal-ready/page.tsx` | Existing permanent redirect to /tools/portal-ready. | No presentation change; preserve redirect, URL and status. |
| T28 `/practice/[language]/[slug]` | `app/practice/[language]/[slug]/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx`, `components/marketing/PracticeProgress.tsx` | Full lesson is substantive educational content; small progress/control labels and decorative headings are interface concerns. | P3: readable lesson width, accessible disclosures and Lucide UI icons; keep exact lesson title, starter, expected result, solution, edge case and exercise URL. |
| T29 `/practice/[language]` | `app/practice/[language]/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx`, `components/marketing/PracticeProgress.tsx` | Data-backed hubs have spelled-out counts in prose/metadata; on-page count already computed. Prose is educational. | P3/P4: only presentation/discovery totals; retain topic instructions, learning text and target keywords. Do not rewrite protected exercise content to satisfy banned-word searches. |
| T30 `/practice` | `app/practice/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx`, `components/marketing/PracticeProgress.tsx` | Slogan second H1 line, hard-coded 100-question interview banner and repeated card styles. Exercises already use real links and data-derived exercise count. | P3: Coding practice H1; concise intro and dynamic interview teaser. Preserve all 19 starter links, lessons and protected educational content. |
| T31 `/privacy` | `app/privacy/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx` | Detailed real data-flow sections exist, including local-development Gemini exception; intro eyebrow and repeated cross-page notices can be reduced. | P3/P4: preserve every substantive flow and retention caveat. No invented provider retention, legal assurances, support details or broad “nothing leaves device” claim. |
| T32 `/publishing` | `app/publishing/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx` | Slogan H1, all-caps intro, repeated illustrative download guidance; source is instructional. | P3/P4: Installation guide H1, factual platform sections and existing checksum command. Preserve package distinctions, commands and all destination URLs. |
| T33 `/security` | `app/security/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx` | Useful scoped technical boundaries and unset-contact fallback; global prose typography and footer are inconsistent. | P1/P3: readable documentation layout; retain report privacy, worker/iframe/remote limitations and absence of independent certification. Do not imply a completed security audit. |
| T34 `/setup` | `app/setup/page.tsx` | Redirects to /admin/setup; no public promotional content. | No change to redirect/auth route behavior. |
| T35 `/studio` | `app/studio/page.tsx`<br>UI: `components/studio/StudioWorkspace.tsx` | Fixed-height IDE with separate header/footer, slogan welcome screen and tiny labels. Runtime initialization is functional. | P1/P3: use common compact header; factual React/Next.js/Angular start text; retain terminal, files, npm preparation, splitters and runtime messages. No runtime changes. |
| T36 `/tools/angular` | `app/tools/angular/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve angular target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T37 `/tools/base64-url-encoder` | `app/tools/base64-url-encoder/page.tsx`<br>UI: `components/tools/UtilityPage.tsx` | UtilityPage has real About/FAQ sections and keyword-specific H1; repeated lead and small utility labels need cleanup. AI/privacy claims depend on the selected feature. | P3/P4: preserve metadata, H1 keywords, JSON-LD, About/FAQ and operations; consolidate interface prose only. For token/RAG, use the verified data-flow distinctions in this report. Do not alter tokens, crypto, validation or color calculations. |
| T38 `/tools/c` | `app/tools/c/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | Unavailable compiler guide; source policy intentionally sets noindex and keeps it out of public listings. Backend terms appear in content and samples. | P3/P4: explain unavailable execution without exposing admin setup jargon in visitor prose; retain ability to edit/export and preserve route/noindex/current runner behavior. Do not claim a working local compiler. |
| T39 `/tools/color-converter` | `app/tools/color-converter/page.tsx`<br>UI: `components/tools/UtilityPage.tsx` | UtilityPage has real About/FAQ sections and keyword-specific H1; repeated lead and small utility labels need cleanup. AI/privacy claims depend on the selected feature. | P3/P4: preserve metadata, H1 keywords, JSON-LD, About/FAQ and operations; consolidate interface prose only. For token/RAG, use the verified data-flow distinctions in this report. Do not alter tokens, crypto, validation or color calculations. |
| T40 `/tools/cpp` | `app/tools/cpp/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | Unavailable compiler guide; source policy intentionally sets noindex and keeps it out of public listings. Backend terms appear in content and samples. | P3/P4: explain unavailable execution without exposing admin setup jargon in visitor prose; retain ability to edit/export and preserve route/noindex/current runner behavior. Do not claim a working local compiler. |
| T41 `/tools/csharp` | `app/tools/csharp/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | Unavailable compiler guide; source policy intentionally sets noindex and keeps it out of public listings. Backend terms appear in content and samples. | P3/P4: explain unavailable execution without exposing admin setup jargon in visitor prose; retain ability to edit/export and preserve route/noindex/current runner behavior. Do not claim a working local compiler. |
| T42 `/tools/hash-generator` | `app/tools/hash-generator/page.tsx`<br>UI: `components/tools/UtilityPage.tsx` | UtilityPage has real About/FAQ sections and keyword-specific H1; repeated lead and small utility labels need cleanup. AI/privacy claims depend on the selected feature. | P3/P4: preserve metadata, H1 keywords, JSON-LD, About/FAQ and operations; consolidate interface prose only. For token/RAG, use the verified data-flow distinctions in this report. Do not alter tokens, crypto, validation or color calculations. |
| T43 `/tools/html-css` | `app/tools/html-css/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve html-css target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T44 `/tools/java` | `app/tools/java/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | Unavailable compiler guide; source policy intentionally sets noindex and keeps it out of public listings. Backend terms appear in content and samples. | P3/P4: explain unavailable execution without exposing admin setup jargon in visitor prose; retain ability to edit/export and preserve route/noindex/current runner behavior. Do not claim a working local compiler. |
| T45 `/tools/javascript` | `app/tools/javascript/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve javascript target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T46 `/tools/json` | `app/tools/json/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve json target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T47 `/tools/json-studio` | `app/tools/json-studio/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/play/LearningTools.tsx` | LearningTools owns the working local editor; shared card/headline treatment and small labels need consistency. | P3: JSON Studio H1 and documentation shell; preserve parse/format/tree/diff semantics and local-only behavior. |
| T48 `/tools/json-to-typescript` | `app/tools/json-to-typescript/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/types-studio/TypesStudio.tsx`, `components/marketing/StructuredData.tsx` | Existing clear SEO H1; three-step surrounding copy and “Your next step” CTA can be more specific. TypesStudio has tiny stats and colored card treatment. | P3: preserve H1/title/description/JSON-LD and conversion behavior; simplify panels/labels and use explicit Copy/Download/Format actions. Keep input examples/code unchanged. |
| T49 `/tools/jwt-decoder` | `app/tools/jwt-decoder/page.tsx`<br>UI: `components/tools/UtilityPage.tsx` | UtilityPage has real About/FAQ sections and keyword-specific H1; repeated lead and small utility labels need cleanup. AI/privacy claims depend on the selected feature. | P3/P4: preserve metadata, H1 keywords, JSON-LD, About/FAQ and operations; consolidate interface prose only. For token/RAG, use the verified data-flow distinctions in this report. Do not alter tokens, crypto, validation or color calculations. |
| T50 `/tools/nextjs` | `app/tools/nextjs/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve nextjs target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T51 `/tools/notepad` | `app/tools/notepad/page.tsx`<br>UI: `components/notepad/Notepad.tsx`, `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx` | Task-first tool exists, but page heading adds “Room for your next idea”; duplicated marketing/SEO framing and small secondary controls. | P3: Online notepad heading; keep first-screen notebook and scrollable docs below. Preserve autosave, folders, tags, snapshots, Trash, print, backup and conflict handling. |
| T52 `/tools` | `app/tools/page.tsx`<br>UI: `components/learning/LearningDiscovery.tsx`, `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx` | Slogan H1, multiple eyebrows/teaser sections and redundant rounded wrappers; five lab IDs and unavailable-language list are duplicated manually. | P3/P4: Tools heading retaining coding/practice keywords; factual directory grouped by actual capability. Preserve ItemList JSON-LD and all current URLs/availability gates; compute any visible total from deduplicated visible entries. |
| T53 `/tools/portal-ready/[preset]` | `app/tools/portal-ready/[preset]/page.tsx`<br>UI: `components/portal-ready/PortalPage.tsx` | Same formatter; preset attribution/check date is useful provenance, unlike an interview construction note. | P3: preserve rules, values, source URL, technical acceptance boundaries and route metadata. Do not assert government approval or re-verify official notices as part of this source-only audit. |
| T54 `/tools/portal-ready` | `app/tools/portal-ready/page.tsx`<br>UI: `components/portal-ready/PortalPage.tsx` | Full-width formatter, numerous small labels; source-check/acceptance cautions and local-vault privacy are substantive. | P3/P4: factual Portal-Ready heading, readable three-column controls and single relevant limitation summary. Keep crop/pan/zoom, size validation, name/date options, offline checklist and privacy behavior. |
| T55 `/tools/python` | `app/tools/python/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve python target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T56 `/tools/rag-playground` | `app/tools/rag-playground/page.tsx`<br>UI: `components/tools/UtilityPage.tsx` | UtilityPage has real About/FAQ sections and keyword-specific H1; repeated lead and small utility labels need cleanup. AI/privacy claims depend on the selected feature. | P3/P4: preserve metadata, H1 keywords, JSON-LD, About/FAQ and operations; consolidate interface prose only. For token/RAG, use the verified data-flow distinctions in this report. Do not alter tokens, crypto, validation or color calculations. |
| T57 `/tools/react` | `app/tools/react/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve react target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T58 `/tools/react-native` | `app/tools/react-native/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve react-native target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T59 `/tools/regex` | `app/tools/regex/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/play/LearningTools.tsx` | Regex Playground via LearningTools; decorative shell and small labels; pattern warnings/time bounds matter. | P3: consistent typography, errors and focus; preserve worker timeout, capture output and all literal regex/code examples. |
| T60 `/tools/rust` | `app/tools/rust/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | Unavailable compiler guide; source policy intentionally sets noindex and keeps it out of public listings. Backend terms appear in content and samples. | P3/P4: explain unavailable execution without exposing admin setup jargon in visitor prose; retain ability to edit/export and preserve route/noindex/current runner behavior. Do not claim a working local compiler. |
| T61 `/tools/sql` | `app/tools/sql/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve sql target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T62 `/tools/text-compare` | `app/tools/text-compare/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/play/LearningTools.tsx` | Text Compare via LearningTools; repetitive card layout and small metadata. | P3: simplify input/result layout while preserving diff and whitespace options, outputs and local processing. |
| T63 `/tools/token-counter` | `app/tools/token-counter/page.tsx`<br>UI: `components/tools/UtilityPage.tsx` | UtilityPage has real About/FAQ sections and keyword-specific H1; repeated lead and small utility labels need cleanup. AI/privacy claims depend on the selected feature. | P3/P4: preserve metadata, H1 keywords, JSON-LD, About/FAQ and operations; consolidate interface prose only. For token/RAG, use the verified data-flow distinctions in this report. Do not alter tokens, crypto, validation or color calculations. |
| T64 `/tools/tool-schema-generator` | `app/tools/tool-schema-generator/page.tsx`<br>UI: `components/marketing/SiteFrame.tsx`, `components/marketing/StructuredData.tsx`, `components/tools/ToolSchemaStudio.tsx` | Functionality already repaired; instruction section has numbering and 20-function/150-field/six-level text duplicated from constraints. “This release” appears in FAQ. | P3/P4: factual interface and FAQ; derive displayed limits from LIMITS, preserve parser/review/undo/export behavior and schemas. No AI generation added. |
| T65 `/tools/typescript` | `app/tools/typescript/page.tsx`<br>UI: `components/marketing/ToolPage.tsx` | ToolPage uses eyebrow/headline strings from lib/marketing/tools.ts, decorative code-window dots, numbered feature cards, repeated generic steps/FAQ wrappers and tiny metadata. Runtime-specific caveats must remain. | P3: preserve typescript target keywords and metadata, useful example code/output, all limits, FAQs and practice links. Replace only decorative chrome and filler. Keep current launcher URL, runtime and consent behavior. |
| T66 `/tools/uuid-generator` | `app/tools/uuid-generator/page.tsx`<br>UI: `components/tools/UtilityPage.tsx` | UtilityPage has real About/FAQ sections and keyword-specific H1; repeated lead and small utility labels need cleanup. AI/privacy claims depend on the selected feature. | P3/P4: preserve metadata, H1 keywords, JSON-LD, About/FAQ and operations; consolidate interface prose only. For token/RAG, use the verified data-flow distinctions in this report. Do not alter tokens, crypto, validation or color calculations. |
| T67 `/workspace` | `app/workspace/page.tsx`<br>UI: `components/learning/LearningDiscovery.tsx`, `components/workspace/ToolboxLinks.tsx`, `components/AccountSession.tsx`, `components/SukoaaLogo.tsx`, `components/workspace/CodeEditor.tsx`, `components/workspace/ConsoleOutput.tsx`, `components/EditorFontControl.tsx` | Snippet IDE has separate header, AI-disabled upsell card and tiny toolbox/help text. Query parameters select language/exercise. | P1/P3/P4: common compact chrome and neutral labels; remove decorative disabled-agent promotion without changing endpoint or flags. Preserve navigation, templates, errors, stdin, networking consent, cloud/local save, run/stop, split/fullscreen. |

Concrete page URLs covered by these 67 modules: **303**, including legacy redirect variants. This is a source enumeration, not a crawl or a claim that every page is indexable. See Appendix A for every URL and owner.

## Shared layout, component and stylesheet audit

| Layout | Current issues / constraints | Planned change |
| --- | --- | --- |
| `app/account/layout.tsx` | Current metadata/robots boundaries and children rendering must remain intact. Route currently relies on page-owned chrome. | P1: preserve metadata byte-for-byte and auth/runtime context; reuse appropriate shared compact/document chrome through page owners. |
| `app/admin/layout.tsx` | Current metadata/robots boundaries and children rendering must remain intact. Route currently relies on page-owned chrome. | P1: preserve metadata byte-for-byte and auth/runtime context; reuse appropriate shared compact/document chrome through page owners. |
| `app/layout.tsx` | Loads global unscoped CSS and account provider; Organization/WebSite JSON-LD and canonical metadata are protected. | P1: retain providers/metadata/structured data; introduce scoped shared design tokens. Do not wrap every IDE blindly in a marketing main/footer. |
| `app/native/layout.tsx` | Current metadata/robots boundaries and children rendering must remain intact. Route currently relies on page-owned chrome. | P1: preserve metadata byte-for-byte and auth/runtime context; reuse appropriate shared compact/document chrome through page owners. |
| `app/setup/layout.tsx` | Current metadata/robots boundaries and children rendering must remain intact. Route currently relies on page-owned chrome. | P1: preserve metadata byte-for-byte and auth/runtime context; reuse appropriate shared compact/document chrome through page owners. |
| `app/studio/layout.tsx` | Current metadata/robots boundaries and children rendering must remain intact. Route currently relies on page-owned chrome. | P1: preserve metadata byte-for-byte and auth/runtime context; reuse appropriate shared compact/document chrome through page owners. |
| `app/workspace/layout.tsx` | Current metadata/robots boundaries and children rendering must remain intact. Route currently relies on page-owned chrome. | P1: preserve metadata byte-for-byte and auth/runtime context; reuse appropriate shared compact/document chrome through page owners. |

| Component | Current issues / evidence | Planned change |
| --- | --- | --- |
| `components/AccountDataTools.tsx` | Data export controls and privacy-critical status/errors. | P3: plain labels and minimum targets; preserve export behavior and confirmations. |
| `components/AccountSession.tsx` | Shared account state and account notices; hosts authentication-loading UI, not marketing content. | P1/P3: compact consistent account controls and accessible status only; preserve provider, sessions and navigation. |
| `components/EditorFontControl.tsx` | Global editor font preference control; short A-/A+ labels need accessible naming/targets. | P1/P3: maintain settings and editor-size behavior; enlarge targets without imposing prose width on code. |
| `components/Home.tsx` | See T20; independent chrome, decorative mockups and duplicated catalogs. | P1/P2: common chrome and task-first directory; do not change openTool/favorites/filter/runtime logic. |
| `components/SukoaaLogo.tsx` | Approved raster artwork is cropped by SVG variants; tagline variant includes “Next Big Thing” and longer accessible name. | P1: use the existing wordmark/mark appropriately; preserve original artwork and dimensions, no invented new logo. Keep informative alt text and decorative hiding. |
| `components/admin/SetupGuide.tsx` | Internal setup content is intentional behind admin authorization, not a public leak. | P3: readable documentation layout; preserve examples and instructions. |
| `components/connector-error.tsx` | Connector error surface is not reachable from current app-entry import graph; keep diagnostic detail truthful. | P5: verify integration-generated usage before any removal; never strip errors to satisfy a vocabulary grep. |
| `components/interview/InterviewDirectory.tsx` | F01/F06: slogans, screenshot/release notes, hard-coded 2/40/12/13 counts, decorative hero and tiny metadata. | P3/P4: factual discovery copy and data-derived totals; retain filters/progress/backups; do not rewrite educational data. |
| `components/interview/InterviewQuestion.tsx` | Question wrapper, local-progress errors and backup action. | P3: typography/focus/icons; preserve question records and draft persistence. |
| `components/interview/MockInterview.tsx` | Slogan intro and screenshot-derived catalog note; timer/session UI is functional. | P3/P4: factual round labels and readable timing; preserve mock selection/resume/results. |
| `components/interview/ProjectDefence.tsx` | Worksheet has promotional heading/chrome; field prompts are learning material. | P3: factual worksheet shell, no field/schema or instructional-content changes. |
| `components/interview/QuestionPractice.tsx` | Small origin/rubric labels and generic framework/help prose; code examples and answers are protected. | P3/P4: display provenance neutrally and improve tabs/controls; keep all educational strings, copied code, timer and reviews. |
| `components/learning/BackendPlayground.tsx` | PHP/FastAPI/Laravel editor status/errors and request form. Architecture and execution logic are outside presentation scope. | P3: action labels, runtime-specific help and accessible targets; no execution changes. |
| `components/learning/BrowserLabs.tsx` | Lab wrappers with developer-style details and small controls. | P3: factual display and consistent tool chrome; preserve project and runtime delegation. |
| `components/learning/LabIDE.tsx` | Shared compact compiler controls need 44px touch targets and 12px minimum metadata. Strong local contrast overrides exist. | P3: preserve dark editor/output contrast, resize/full-page flow, file tabs and runtime controls; style only. |
| `components/learning/LearningDiscovery.tsx` | Hard-coded 100 question string, “Six focused tracks”, all-caps cards and Unicode arrows. | P1/P3/P4: derive counts from summaries/module data, sentence case and Lucide icons; preserve six lab/track links. |
| `components/learning/NodePlayground.tsx` | Experimental Node lab and runtime prerequisites; no npm-install support here. | P3/P4: keep Experimental exception visible, avoid unsupported library promises; retain execution and request tester. |
| `components/learning/SQLPlayground.tsx` | SQL controls and result tables; database/query limits are functional. | P3: readable headers, scroll containers and touch controls; preserve SQL/result data. |
| `components/learning/TailwindPlayground.tsx` | Working preview and multiple source tabs; colorful editor chrome can be restrained. | P3: preserve viewport previews, source files, update timing and sandbox; change interface styles only. |
| `components/learning/TechnicalActivity.tsx` | Technical activity instructions/examples are protected; surrounding progress controls use page-specific chrome. | P3: interface/accessibility only, no code/instruction/test changes. |
| `components/learning/TrackGuide.tsx` | Module descriptions/requirements and code starter guide are educational. | P3: document layout and computed catalog totals; retain starter requirements and examples. |
| `components/marketing/CommandPalette.tsx` | Dialog accessibility concerns F08; raw Unicode keyboard legends; list clamp differs from render cap. | P1: semantic labels, focus trapping/return and 44px results. Keep shortcuts and URLs. Treat index-cap behavior as separately scoped unless explicitly approved. |
| `components/marketing/ExtensionPage.tsx` | Concept scene and paper mockup, several filler sections and promotional CTAs. | P3/P4: factual capability/status sections; remove fake media; keep official store links and FAQ content. |
| `components/marketing/MarketingStyles.tsx` | Client graph imports broad marketing stylesheet. | P1/P5: preserve required CSS loading order; remove only proven-unused rules after route QA. |
| `components/marketing/PracticeProgress.tsx` | Small progress/action labels; local progress semantics are functional. | P3: typography and target sizes only; preserve per-exercise identifiers and storage. |
| `components/marketing/SiteFrame.tsx` | Slogan footer; 34 links across three unlabelled-by-category visual groups; repetitive Questions eyebrow and RelatedTools arrows; multiple header variants. | P1: common header; four labelled footer columns; factual FAQ heading; Lucide icons; retain all slot flags/children and route destinations. |
| `components/marketing/StructuredData.tsx` | No presentation-copy issue; escaped JSON-LD is protected. | No edits; compare structured-data output before/after. |
| `components/marketing/ToolPage.tsx` | Repeated slogans, all-caps eyebrows, code-window dots, generic steps and feature cards; supports many tool routes. | P3: document-style example and sections; keep WebApplication/Breadcrumb JSON-LD, code, limitations, FAQs and exercise links. |
| `components/notepad/MarkdownPreview.tsx` | Markdown renderer with safety boundaries and code output. | P3: prose typography only, no parser/link/security or code-content changes. |
| `components/notepad/Notepad.tsx` | Many task controls and small metadata; notebook is task-first and functional, not a decoration. | P3: body/toolbar target sizes and compact shared chrome; preserve all note states, print/backup/conflict behavior. |
| `components/play/ActivityPlayer.tsx` | Hint/feedback filler and Unicode icons; CSS/sample strings and activities are protected. | P3: change only interface text such as “A little hint”; retain grading, literal code, previews and progress. |
| `components/play/ApiStudio.tsx` | Dense REST/GraphQL builder and sandbox panels; developer instruction here is legitimate documentation. | P3: clearer labels, selected states, focus and typography; no endpoint/auth/config/CRUD behavior changes. |
| `components/play/DemoApiDocs.tsx` | Long instructional API page; examples/counts should be tied to resource data when promotional, not blindly rewritten. | P3: documentation hierarchy and minimal card chrome; keep endpoint reference, CRUD semantics, API examples and limitations. |
| `components/play/LearningNoteInbox.tsx` | Explicit notepad import/learning-note bridge; consent and preservation messages are functional. | P3: improve naming/targets only; preserve opt-in integration and data. |
| `components/play/LearningTools.tsx` | JSON/regex/diff interfaces with small metadata and independent panel style. | P3: consistent controls, focus/error messages and readable results; retain worker limits and algorithms. |
| `components/play/PlayHub.tsx` | Slogan H1/eyebrows, “journey”, raw bookmark stars, rounded panels and repeated progress notices. | P3: factual shell, Lucide bookmarks, 44px controls; preserve daily-selection algorithm and learning content. |
| `components/portal-ready/ExamChecklist.tsx` | Offline personal records and backup dialogs; technical privacy warning must remain near backup. | P3: restrained panels and readable controls; preserve IndexedDB, merge, deletion and export. |
| `components/portal-ready/OfflineTool.tsx` | Service-worker/offline status action, not a development leak. | P3: concise status; no registration/cache behavior changes. |
| `components/portal-ready/PortalEditor.tsx` | Three-column formatter and icon-heavy controls with small hints. | P3: clear groups/labels/targets and body copy; preserve geometry/gestures/validation/download filename behavior. |
| `components/portal-ready/PortalPage.tsx` | Editorial “this release” phrasing alongside substantive local-processing and authority-limit text. | P3/P4: shorten editorial wording only; preserve rules table, notices, FAQ, privacy and technical limits. |
| `components/studio/ProjectEditor.tsx` | Monaco integration; portaled menu contrast previously repaired. | P3: retain menu/theme contrast, edit models, hints, keyboard commands and folding; no editor logic changes. |
| `components/studio/RuntimeStartupPanel.tsx` | Functional dependency/runtime progress, not filler. Timeout and diagnostic actions must remain. | P3: factual startup labels and readable error panel; no spinner-only simplification or runtime changes. |
| `components/studio/StudioSplitter.tsx` | Functional resizer; focus visibility and touch-target review needed. | P3: accessible handle/labels without changing min/max sizes or drag behavior. |
| `components/studio/StudioWorkspace.tsx` | Separate header/footer, slogan preview welcome, many compact controls and runtime messages. | P1/P3: common compact chrome, factual welcome and 12px minimum status text; preserve files/imports/terminal/preview/debugger/layout/runtime lifetime. |
| `components/tools/RagPlayground.tsx` | Local/embedding/demo/BYOK modes need scoped network disclosure; model-download size is approximate. | P3/P4: group the existing mode explanations; retain key handling, worker downloads, prompts and provider URLs. |
| `components/tools/TokenCounter.tsx` | Runtime failure message suggests npm preparation to ordinary visitors; dense output metadata. | P3/P4: visitor retry guidance; retain an appropriate administrator diagnostic location and exact tokenizer computation. |
| `components/tools/TokenWording.tsx` | Development-only Gemini feature with explicit consent, limits and provider details. | P3/P4: preserve consent and accurate developer-only labeling; do not advertise it on production or change its gate. |
| `components/tools/ToolSchemaStudio.tsx` | Numbered panels, uppercase badges and duplicated numeric limits; actual editable draft terminology is legitimate. | P3: restrained layout, derived displayed limits and exact action labels; preserve schema generation, review gating and undo. |
| `components/tools/UtilityPage.tsx` | Repeated lead sentence and oversized wrappers; About/FAQ/JSON-LD are mandatory retained sections. | P3: documentation sections and neutral shared heading; preserve data/metadata. |
| `components/tools/UtilityTools.tsx` | Crypto/color/encoding forms and output controls have separate styles. | P3: visual consistency and accessible targets; no calculations, parsing or output-format changes. |
| `components/types-studio/TypesStudio.tsx` | Small counters, numbered labels and saturated card accents; input/output conversion is functional. | P3: document-style panels, readable metadata and consistent controls; preserve converter/options/copy/download. |
| `components/ui/accordion.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/alert-dialog.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/alert.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/aspect-ratio.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/attachment.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/avatar.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/badge.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/breadcrumb.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/bubble.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/button-group.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/button.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/calendar.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/card.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/carousel.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/chart.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/checkbox.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/collapsible.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/combobox.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/command.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/context-menu.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/dialog.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/direction.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/drawer.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/dropdown-menu.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/empty.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/field.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/form.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/hover-card.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/input-group.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/input-otp.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/input.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/item.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/kbd.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/label.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/marker.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/menubar.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/message-scroller.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/message.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/native-select.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/navigation-menu.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/pagination.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/popover.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/progress.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/radio-group.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/resizable.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/scroll-area.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/select.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/separator.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/sheet.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/sidebar.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/skeleton.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/slider.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/sonner.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/spinner.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/switch.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/table.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/tabs.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/textarea.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/toggle-group.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/toggle.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/ui/tooltip.tsx` | No app-entry import path found by static import graph; candidate unused generic primitive, not proof of runtime dead code. | P5: verify string/dynamic imports, exports and test use before removing any candidate. P1 styles only if active; preserve semantics and interaction contracts. |
| `components/workspace/CodeEditor.tsx` | Code editor and diagnostics; code font preference can be below UI body size by explicit choice. | P3: preserve editor preferences, folding and diagnostic navigation; change only surrounding labels/targets if needed. |
| `components/workspace/ConsoleOutput.tsx` | Console output must preserve user values, whitespace and error semantics. | P3: contrast/type/scroll containers only; do not sanitize away displayed code output or change serialized values. |
| `components/workspace/ToolboxLinks.tsx` | Icon rail/hover help uses text and Unicode tool glyphs; needs accessible names/touch access. | P3: Lucide UI actions, keep meaningful language abbreviations; preserve all compiler menu destinations and selection. |

### Stylesheets (every owned CSS file)

| CSS file | Static findings | Planned change |
| --- | --- | --- |
| `app/account/account.css` | 0 explicit sub-12px rule(s); 0 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `app/brand-preview/preview.css` | 1 explicit sub-12px rule(s); 0 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `app/globals.css` | 130 explicit sub-12px rule(s); 5 focus-visible occurrence(s); 1 reduced-motion occurrence(s). Global header/nav/footer/heading selectors can leak across tools; base 14px body; homepage art and accumulating overrides. | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. |
| `app/native/native.css` | 5 explicit sub-12px rule(s); 0 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `app/studio/studio.css` | 109 explicit sub-12px rule(s); 3 focus-visible occurrence(s); 1 reduced-motion occurrence(s). Fixed-height grids and 109 small-font declarations; changing heights requires full editor QA. | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. |
| `app/workspace/workspace.css` | 5 explicit sub-12px rule(s); 3 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/home-extra.css` | 0 explicit sub-12px rule(s); 0 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/interview/interview.css` | 26 explicit sub-12px rule(s); 2 focus-visible occurrence(s); 1 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. |
| `components/learning/backend-playground.css` | 2 explicit sub-12px rule(s); 2 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/learning/lab-ide-theme.css` | 1 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 1 reduced-motion occurrence(s). Deliberate dark-editor/light-output contrast overrides loaded late; do not replace with a blanket light theme. | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. |
| `components/learning/learning-discovery.css` | 9 explicit sub-12px rule(s); 2 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/marketing/command-palette.css` | 1 explicit sub-12px rule(s); 0 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/marketing/marketing.css` | 53 explicit sub-12px rule(s); 3 focus-visible occurrence(s); 1 reduced-motion occurrence(s). Small breadcrumbs/fine print, multiple repeated overrides, rounded mock scenes and oversized hero styles. | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. |
| `components/notepad/notepad.css` | 13 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/play/api-studio.css` | 0 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/play/demo-api.css` | 0 explicit sub-12px rule(s); 0 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/play/play.css` | 6 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 1 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. |
| `components/portal-ready/portal-ready.css` | 26 explicit sub-12px rule(s); 3 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/tools/token-wording.css` | 1 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/tools/tool-schema-studio.css` | 24 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/tools/utility-tools.css` | 0 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `components/types-studio/types-studio.css` | 10 explicit sub-12px rule(s); 1 focus-visible occurrence(s); 1 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. |
| `examples/learning/tailwindcss/public/output.css` | 0 explicit sub-12px rule(s); 4 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `examples/learning/tailwindcss/src/input.css` | 0 explicit sub-12px rule(s); 0 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |
| `public/runtime/monaco/editor.css` | 19 explicit sub-12px rule(s); 10 focus-visible occurrence(s); 0 reduced-motion occurrence(s). | P1/P3: scoped tokens, 16px prose, >=12px UI, 44px touch targets, visible focus/reduced motion; 6–8px surface radii. Preserve code, overlays, fullscreen and previously fixed contrast. P5 remove only proven unused selectors. Missing local rules may be inherited; verify computed styles, not grep alone. |

## Shared copy, catalog, FAQ and protected data files

| Exact file | Current role / finding | Planned treatment |
| --- | --- | --- |
| `lib/marketing/tools.ts` | Names, titles, descriptions, headlines, eyebrows, examples, feature and limit strings for 16 tool definitions. Slogan headlines and duplicated runtime notes. | P3: update marketing/interface fields only; preserve SEO keywords, examples/code, limits and hrefs. |
| `lib/marketing/utility-tools.ts` | 8 utility definitions, H1/title/description, uses and FAQs. | P3: preserve SEO and FAQ sections; refine only interface wording and accurately scope local/external processing. |
| `lib/marketing/catalog.ts` | Two extension descriptions/headlines/steps/FAQs with poetic wording and concept symbols. | P3/P4: factual capabilities and publication status; preserve product IDs and store link validation. |
| `lib/marketing/practice.ts` | 19 exercise records, starters, expected results and topics. | Protected educational data: no content/code rewrites. Derive display counts from this array. |
| `lib/marketing/practice-lessons.ts` | Full worked lessons and stable slugs; historical worded counts are not generic marketing. | Protected; retain lesson IDs, titles, solutions, instructions and expected output. |
| `lib/marketing/practice-hubs.ts` | 5 educational language hubs; worded counts in intro/description, static type-safety caveats. | Preserve instructional content; any discovery count change must retain keywords and not mutate lessons. Metadata values remain the default baseline. |
| `lib/marketing/site.ts` | Canonical, indexing, OpenGraph, JSON-LD helpers and publicPaths. Global contentUpdated date is used as sitemap fallback. | Protected; do not rewrite publicPaths, titles, canonicals, structured data or dates just to make the site appear fresh. |
| `lib/marketing/availability.ts` | Explicit hidden/noindex policy for C/C++/Rust/C#/Java, Node lab and unpublished extension pages. | Protected route/availability policy; presentation must not imply these now execute publicly. |
| `lib/marketing/tool-links.ts` | Workspace/studio links to SEO landing-page mapping. | No route/URL changes. Preserve exact map. |
| `lib/marketing/releases.ts` | Published release schema/lookup/fallback and HTTPS/checksum validation. | No behavior changes; “verified” must not be inflated to independent binary verification. |
| `lib/marketing/browser-release.ts` | Validates optional GitHub release-page setting. | No change to allowed URL shapes or destinations. |
| `lib/learning/modules.ts` | 6 module descriptors, requirements, modes and doc/lab URLs. | Plain discovery wording; distinguish downloadable local requirements from browser lab limits. No framework-version promises without checking bundled/runtime source. |
| `lib/learning/lab-seo.ts` | 6 search-facing titles/H1s/descriptions, use cases and FAQs. The — delimiter is machine-consumed. | Keep keywords, separator, full About/FAQ content, version claims and limits pending a source fact check. No blanket prose replace on metadata. |
| `lib/learning/starters.ts` | Local starter metadata/selection and download path generation. | Protected IDs/URLs; retain accurate installation requirements. |
| `lib/learning/starters.json` | Local starter project file contents and code examples. | Protected educational/code content; no vocabulary cleanup. |
| `lib/learning/backend-projects.ts` | Multi-file runtime project models and export/import boundaries. | Preserve logic and filenames; change only genuine UI descriptions if encountered. |
| `lib/learning/backend-samples.ts` | Executable PHP/FastAPI/Laravel sample files. | Protected code samples. |
| `lib/learning/tailwind-project.ts` | Tailwind sample project/source files. | Protected code samples. |
| `lib/play/catalog.ts` | 90 merged activities, 13 tracks, label map and 30-item daily rotation. | Compute counts from arrays; change only interface/discovery text. Keep daily algorithm and all activity data. |
| `lib/play/activities.json` | Foundational learning activities/questions/code/solutions. | Protected; do not edit banned words in educational literals. |
| `lib/play/backend-activities.json` | Backend learning activity content. | Protected. |
| `lib/play/ai-activities.json` | AI/RAG learning activity content and fictional request examples. | Protected; simulated examples are not claims of model execution. |
| `lib/interview/types.ts` | 2 track descriptions, 3 level labels, 4 round labels and shared question types. | P3: plain interface descriptions; no level IDs or schema changes. |
| `lib/interview/catalog.ts` | 100 questions, summaries, 8 mock definitions, employer further-reading summaries and screenshot-origin editorial notes. | P4: remove only leaked display notes; preserve slugs, source links and all mock structures. |
| `lib/interview/questions.json` | 100 complete lessons/answers, 12 code samples, 13 supplied-topic provenance markers. | Protected. Keep the 60-question integrity hashes unchanged by leaving content intact; map provenance to neutral display text instead. |
| `lib/interview/filter.ts` | Topic/release/search/progress matching; “0.25.0” is an internal functional release value. | Keep behavior. Rename the visible filter label, not stored matching values. |
| `lib/interview/progress.ts` | Stable local storage key/schema, timers, backup validation and short sessions. | Protected behavior. |
| `data/portalPresets.json` | 5 templates, including 2 source-attributed IBPS presets. Checked date is meaningful provenance. | Preserve numeric rules and source links. Do not relabel dimensions official or change live-capture/editing caveats. |
| `lib/portal-ready/rules.ts` | Preset exports, labels, validation constraints and technical compliance. | Preserve all validation. Factual labels only if needed. |
| `lib/portal-ready/canvas.ts` | Image loader and exact crop/draw logic; error has “in this release”. | P4: visitor wording may be shortened; preserve accepted formats, errors and algorithm. |
| `data/publicReleases.json` | Empty fallback array. Real releases may still be fetched from Supabase or linked externally. | Do not add fictional records or infer no browser binaries exist anywhere. |
| `lib/tool-order.ts` | Shared compiler/menu IDs, order, icons, hrefs and brief descriptions. | P3: readable descriptions and consistent UI icons; preserve order/IDs/URLs. |
| `lib/platform/templates.ts` | Snippet starter source/code and filenames. | Protected code; no blanket banned-word replacements. |
| `lib/studio/project.ts` | React/Next.js project starter source and project models. | Protected code and behavior; only remove actual dev-history notes from visible UI. |
| `lib/studio/angular.ts` | Angular templates and module examples. | Protected code examples and dependency/runtime behavior. |
| `lib/studio/native.ts` | React Native project templates. | Protected code examples. |
| `lib/rag/core.ts` | Chunking/ranking/prompt helpers and educational SAMPLE_DOCS. SAMPLE_DOCS says “its compilers” run locally, which overgeneralizes remote-runner languages. | Record factual overbreadth, but sample text is protected by the code-sample guardrail; do not silently rewrite it. Resolve separately if approved. |
| `lib/demo-api/data.ts` | Fictional resources and record-count source. | Compute documentation resource counts here; do not alter fictional records or endpoint data. |
| `lib/demo-api/builder.ts` | Example JSON/YAML API configuration and generator limits. | Protected examples/semantics; genuine administrative leaked notes only. |
| `lib/demo-api/chat.ts` | Simulated completion text and tokens estimate, not a model. | Keep simulated labeling and contract. Avoid rewriting responses as a design change. |
| `lib/token-wording.ts` | Local development guard and Gemini outbound request. | Protected behavior and source-accurate disclosure; do not alter gates or use a global “AI off” replacement. |
| `lib/platform/support.ts` | SUPPORT_EMAIL / SECURITY_EMAIL runtime validation. | Read source validation; never invent address values. |

Remaining `lib/` modules implement runtime isolation, authentication, HTTP validation, compilers, storage, conversions and helpers. They are not prose cleanup targets. Appendix C lists every source file, so these modules are accounted for without claiming a new backend/security audit. No new API, database or compiler logic belongs in this redesign.

## Hard-coded counts and where to compute them

Counts below distinguish drift-prone product totals from intentional numerical limits. No question/task numbers or examples should be rewritten to make a global number search empty.

| Current hard-coded count / exact location | Current source truth | Proposed source / action |
| --- | --- | --- |
| 78 activities — components/Home.tsx:16 | 90 activities | activities.length from lib/play/catalog.ts. This is confirmed drift. |
| 100 explained questions / 100 questions — components/Home.tsx:15; components/learning/LearningDiscovery.tsx:5; app/practice/page.tsx:9 | 100 questions | questionSummaries.length / a lightweight generated summary, not a full client import of lesson JSON. |
| 2 focused tracks / two tracks — components/interview/InterviewDirectory.tsx:41,59 | 2 interview tracks | tracks.length from lib/interview/types.ts. |
| 40 additions / Twelve lessons / 13 screenshot questions — components/interview/InterviewDirectory.tsx:59 | 40 addedIn-marked questions; 12 code examples; 13 supplied-topic questions | Remove changelog/screenshot narrative; if useful current totals remain, derive from question metadata in server/precomputed summary. Do not add full lessons to directory bundle. |
| Six focused tracks — components/learning/LearningDiscovery.tsx:6 | 6 technology modules, distinct from 13 total play tracks | learningModules.length. Say technology modules rather than conflating every play track. |
| six/four/three/two exercises — lib/marketing/practice-hubs.ts:2–6 | JS 6; Python 4; TypeScript 3; SQL 4; JSON 2 | practiceExercises.filter(e => e.language === language).length. These are currently accurate; protected instructional copy/metadata must not be casually rewritten. |
| five lab IDs / five unavailable language labels — app/tools/page.tsx:10–11 | 5 public lab launch cards; Node is an experimental exception | Derive visible presentation counts from existing visibility policy and catalogs. Do not change which URLs are listed or the protected ItemList JSON-LD. |
| Footer link groups — components/marketing/SiteFrame.tsx:6 | 12 + 10 + 12 links | Four explicit navigation arrays (Compilers/Practice/Resources/Company), at most six links each; no route deletion. Retain search/Tools access to all destinations. |
| Tool total / category badges — components/Home.tsx:61–64 | Visible tool total already uses filtered.length; category badges use filtered source data | Keep data-derived count. There is no literal “21 tools” in the current inspected UI, so do not invent a 21-tool defect. |
| 20 functions, 150 fields, six levels — components/tools/ToolSchemaStudio.tsx:53; lib/tool-schema/parser.ts:23; schema.ts:113 | LIMITS.tools / LIMITS.fields / LIMITS.depth in lib/tool-schema/schema.ts | Where displayed, interpolate exported constants; preserve parser validation and exact numeric behavior. |
| 19 exercises / 5 hubs / 100 questions / 50 per track / 16–18–16 levels / 8 mocks / 12 runnable examples — tests | Intentional content-integrity assertions | Keep tests. Dynamic visible totals do not justify weakening catalog-integrity tests. |
| three questions / 15 minutes — components/interview/MockInterview.tsx:39; lib/interview/progress.ts | Intentional short mock behavior | Keep as functional specification, not a catalog count. |
| 30 daily pool — lib/play/catalog.ts:10 | dailyActivity selects from first 30 entries, not all 90 | Keep algorithm under no-functionality-change guardrail; describe as rotating selection. Any pool expansion needs separate behavioral approval. |
| Demo API record counts — lib/demo-api/data.ts; DemoApiDocs; lib/demo-api/builder.ts | Counts depend on actual fictional resource arrays or user configuration | Derive doc totals from arrays when printed; never change records just to match prose or alter APIs. |
| 0.23.0 — app/api/status/route.ts:5 | package.json says 0.25.0 | Stale version metadata, separate backend follow-up. Not a UI count change. |
| Runtime versions, seconds, bytes, row limits, snapshot retention, token sizes, colors and exam KB dimensions throughout UI/data | Technical constraints, not marketing counts | Verify against implementation and preserve. Never replace with catalog.length or a blanket number rewrite. |

Current catalog totals, computed from the actual exported data: 16 tool-guide definitions; 8 developer utility definitions; 6 technology modules; 90 play activities in 13 tracks; 19 practice exercises in 5 language hubs; 100 interview questions in 2 tracks; 8 full mock formats; 12 code examples; 5 Portal-Ready templates (2 source-attributed IBPS records). Definitions overlap across directories, so **do not add these numbers together and call that the site tool count**. Count deduplicated, publicly listed canonical destinations for any visible tool total.

## Stale, misleading and unverified claims

These are repository findings, not guesses about a production deployment:

| Claim / location | Assessment | Required action / guardrail |
| --- | --- | --- |
| “78 activities” — Home | False against current source: 90. | Data-derived visible total. |
| “AI features are disabled in this release” — About | Outdated/overbroad: local embeddings and optional local-development Gemini exist. | Scoped feature facts from AI table; retain production gate. |
| “Sukoaa runs no server-side AI today” — Home roadmap | Ambiguous: no hosted model/production agent is present, but an optional localhost server invokes Google. | Differentiate hosting/inference, proxy requests, development and production. |
| “Any model call is made only if you choose to use your own key” — Home | Not a universal visitor flow: Gemini uses a server-configured local key after consent. | Scope BYOK wording to RAG, describe local development separately. |
| status version 0.23.0 — API | False relative to package release 0.25.0. | Separate API metadata correction, not visual refactor. |
| “This starter privacy summary must be completed…” — Home legacy modal | Stale public-facing construction note; dedicated pages now exist. Whether the modal is reachable must be proved before deletion. | Consolidate to real privacy/contact pages; retain immediate warnings at actions. |
| “A new one every day” — CommandPalette/daily discovery | May imply newly authored content; code rotates a fixed 30-item pool. | Use “Daily activity selection”; preserve schedule/algorithm. |
| “Sukoaa runs its compilers inside your browser” — lib/rag/core.ts SAMPLE_DOCS | Overbroad because configured C/C++/C#/Rust/Java/Go are remote. | Educational sample is protected; flag for separately approved factual sample edit rather than modify now. |
| “Verified browser releases” / verified installers — Home | Plans/schema validation are not binary scanning, publisher signing or independent verification. | Describe only published metadata and recorded hashes. The repo cannot establish a binary is safe. |
| No browser binary released — proposed review assumption | Not established. data/publicReleases.json is empty, but Supabase and BROWSER_RELEASE_URL can supply releases. Historical user-supplied GitHub links are not current artifact verification. | Do not assert no release exists; inspect actual configured publisher metadata before a future factual update. |
| IBPS preset verification/check dates — data/portalPresets.json | Source-attributed in repository but official notice was not independently re-fetched in this audit. Not proven false. | Preserve exact notice/version/date and acceptance caveats; no fresh “officially verified today” claim. |
| Maker identity, employment history, support inbox — About/contact | GitHub URL is present; a legal/public maker name and monitored email are not attributable in source. A “Subodh” sample value is not a verified bio. | Use explicit placeholders for missing profile facts; never manufacture an address or credentials. |
| Runtime versions / provider charges / free tiers | Source includes pins and limits, but current outside-provider policy and deployment settings were not audited. | Keep implementation-specific descriptions; no “all libraries”, forever-free or universal browser-support promise. |
| Tool schema drafts are fully automatic accurate English understanding | Current FAQ correctly describes bounded local parsing and required human review. | Do not simplify into a false AI/NLU guarantee; preserve review and unsupported-case warnings. |
| Local only means encrypted, permanent, offline-ready or no network traffic | Current detailed policies distinguish these; CDN/model/runtime and BYOK calls exist. | Preserve those distinctions and local-backup limits; avoid site-wide “nothing leaves your device” banners. |

## Marker search and false-positive handling

A repo-wide text scan was run for `release`, `screenshot`, `draft`, `placeholder`, `TODO`, `FIXME`, `AI features are disabled`, and `Sources checked`, including documentation/tests and generated text assets where decodable. Binary WASM/images/archives were not searched as text. Lockfiles, licences, minified third-party runtime bundles and historical release notes were counted but are not public-copy rewrite targets. The narrower application scan covers `app/`, `components/`, `lib/`, `data/`.

| Requested marker | Raw whole-repo occurrences | Classification / treatment |
| --- | --- | --- |
| release | 1175 | Keep real package, download, admin and historical version terms. Rewrite conversational “this release” on visitor pages only. |
| screenshot | 35 | Remove construction-history references/concept mock labels when the mock is removed. Keep bug-report screenshot guidance and real screenshots. |
| draft | 469 | Keep saved source/note/schema drafts, database fields and backup schema keys. They are product functionality. |
| placeholder | 526 | HTML input placeholder attributes are legitimate; unknown Maker facts will deliberately use requested [PLACEHOLDER: ...] tags. |
| TODO | 283 | Mostly runtime/library comments and legitimate fictional todo resources. Do not rewrite /todos or sample code. |
| FIXME | 3 | All three occur in generated tokenizer bundles (cl100k_base.js: two; o200k_base.js: one). No owned-source FIXME comment was found before writing this report. |
| AI features are disabled | 1 | One confirmed stale About sentence; see F02. |
| Sources checked | 1 | One visitor-facing interview directory label; remove from interface, preserve further-reading URLs. |

The whole scan found 2493 raw marker occurrences: 831 in 163 application/documentation/test files and 1662 in 23 generated/runtime files. Raw substring counts include normal words, identifiers and bundled libraries; they are not issue counts.

### Confirmed construction-history leaks in owned app/data source

| File / line | Matched text | Local context | Planned treatment |
| --- | --- | --- | --- |
| `app/about/page.tsx`:5 | this release | arantee execution is available. AI features are disabled in this release.</p><h2>Your code and your choices</h2><p>Basic browser playgrounds can be tried without an account | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `app/api/ai/run/route.ts`:2 | this release | AI SDK, no provider requests, and no secret provisioning in this release. export async function POST(){return json({error:'AI agents are disabled in this release.',code:'AI | Internal/API contract or comment: no UI-only mutation. Keep status/code; any response wording requires contract review. |
| `app/api/ai/run/route.ts`:3 | this release | nction POST(){return json({error:'AI agents are disabled in this release.',code:'AI_DISABLED'},503)}  | Internal/API contract or comment: no UI-only mutation. Keep status/code; any response wording requires contract review. |
| `app/brand-preview/page.tsx`:5 | Your approved artwork | me="brand-preview-note"><strong>Approved logo</strong><span>Your approved artwork is now used throughout the site.</span><a href="/">Back to Sukoaa ↗</a></div><section className="br | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `app/browser/page.tsx`:5 | ILLUSTRATIVE CONCEPT | wse</span><span>Build</span><span>Create</span></div><small>ILLUSTRATIVE CONCEPT · NOT A RELEASE SCREENSHOT</small></div></div></section><section className="product-steps" id="inst | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `app/tools/tool-schema-generator/page.tsx`:7 | This release | </p><Questions items={[{q:'Does this use an AI API?',a:'No. This release uses a bounded rules-based parser plus an editable schema builder. It does not send your descriptio | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `app/workspace/page.tsx`:80 | this release | kles size={17}/><strong>AI agents</strong><span>Disabled in this release</span></div></aside><div className="workspace-resizer toolbox-resizer" aria-controls="workspace-too | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `components/Home.tsx`:70 | one release at a time | l steps. A bigger toolkit.</h2></div><p>Thoughtfully built, one release at a time.</p></div><div className="roadmap-grid"><article><span className="step active">01 <Check size={15}/ | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `components/Home.tsx`:74 | starter privacy summary | <p>Use Save local, Save cloud, or Export to keep code. This starter privacy summary must be completed with your actual provider, retention and contact details before a public launch.< | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `components/interview/InterviewDirectory.tsx`:53 | New in this release | ion value="all">All releases</option><option value="0.25.0">New in this release</option></select></label></div>       <p className="ip-library-note">Choose a level above, then nar | Rename visible filter to neutral “Additional questions”; keep internal value and matching behavior. |
| `components/interview/InterviewDirectory.tsx`:59 | Sources checked | TS</span><h2>What major employers emphasize</h2></div><span>Sources checked 18 November 2026</span></div><p>These original practice questions reflect public competencies. They | Remove visitor editorial timestamp; retain further-reading URLs and actual source attribution. |
| `components/interview/InterviewDirectory.tsx`:59 | This release | s><summary>Coverage and question-count guidance</summary><p>This release has {questions.length} questions across two tracks. {tracks.map(t => `${t.short}: ${questions.filte | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `components/interview/InterviewDirectory.tsx`:59 | from your screenshots | target role.</p><p>GenAI includes the 13 distinct questions from your screenshots. The missing foundations round is Sukoaa-designed. Topic lessons and reference answers are educatio | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `components/marketing/ExtensionPage.tsx`:3 | CONCEPT PREVIEW | riant="mark" height={30} decorative /> {product.name}<small>CONCEPT PREVIEW</small></div><div className="scene-symbol">{product.icon}</div><div className="scene-paper"><span>Y | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `components/portal-ready/PortalPage.tsx`:3 | This release | h to custom settings and test again.':p?.kind==='document'?'This release converts one document image into one PDF page. It does not compress existing PDF files, preserve a  | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `components/portal-ready/PortalPage.tsx`:3 | this release |  AI background changes and face editing are not included in this release.</p><h3>Why can a file fail the minimum-size check?</h3><p>A small image with a simple white backgr | Rewrite visitor-facing editorial phrasing; keep technical meaning. |
| `lib/interview/catalog.ts`:10 | not supplied in the screenshots | tions & coding', minutes: 45, note: 'Sukoaa-designed round; not supplied in the screenshots.', slugs: ['tokens-and-context', 'embeddings', 'prompt-structure', 'python-concurrency', 'structure | Neutral mock description; keep slugs/times/round identities. One string-only test assertion may need updating (see tests section). |
| `lib/interview/catalog.ts`:11 | from your screenshots | 'RAG deep dive', minutes: 60, note: 'The five RAG questions from your screenshots.', slugs: ['rag-pipeline', 'validate-chunking', 'exact-product-codes', 'bi-cross-encoder', 'missing | Neutral mock description; keep slugs/times/round identities. One string-only test assertion may need updating (see tests section). |
| `lib/interview/catalog.ts`:12 | from your screenshots |  design', minutes: 75, note: 'The four evaluation questions from your screenshots.', slugs: ['support-eval-pipeline', 'llm-judge-reliability', 'rag-metrics', 'two-point-gain']},   { | Neutral mock description; keep slugs/times/round identities. One string-only test assertion may need updating (see tests section). |
| `lib/interview/catalog.ts`:13 | from your screenshots |  HR', minutes: 40, note: 'The four project and HR questions from your screenshots.', slugs: ['production-failure', 'genai-vs-ml', 'two-year-direction', 'notice-and-expectations']},  | Neutral mock description; keep slugs/times/round identities. One string-only test assertion may need updating (see tests section). |
| `lib/portal-ready/canvas.ts`:9 | this release | PNG or WebP image. PDF and HEIC inputs are not supported in this release.');const image=await createImageBitmap(file,{imageOrientation:'from-image'});if(image.width*image.h | Functional error: remove release framing only if approved; preserve formats and failure condition. |

### Vocabulary, symbols and uppercase presentation

The requested banned-vocabulary scan found 70 whole-word/phrase matches across 27 owned application/data files. These are candidates, not automatic replacements. The UI-symbol scan found 220 Unicode UI-like symbols in 57 files; it excludes neither code nor educational content, so classify before editing. CSS text-transform and uppercase source labels both matter.

| Area | Action |
| --- | --- |
| Marketing/interface copy | Replace listed banned vocabulary with specific verbs/nouns. Remove decorative all-caps eyebrows, synthetic two-line headings and filler triplets. Keep at most one factual environment label if useful. |
| Lessons, activities, prompts, examples and code | Preserve, even if they contain “little”, “robust”, an em dash or an arrow as meaningful content. Do not change scoring or expected output. |
| UI icons | Use installed lucide-react for launch, external link, search, bookmark, expand and download controls. Retain language abbreviations such as JS/TS/Py as labels; they are not decorative icon substitutes. |
| Keyboard notation and technical operators | Retain meaningful code operators, SQL ->>, regex symbols, math and logical arrows; do not replace them with decorative SVG icons. Accessible text must still describe keyboard shortcuts. |
| Em dash | Remove decorative prose separators where appropriate; keep titles/meta descriptions/lab-seo delimiters and all protected educational/code content. |
| Available badges | Suppress redundant Available badge rendering on normal tool cards only. Do not remove availability data or real Experimental/Coming soon/unavailable/status/validation badges. |

## Visual system and accessibility plan

- Shared tokens: near-white canvas, dark slate body text, restrained dark-green action/link accent, 1px separators and 6–8px control/surface radii. Existing approved Sukoaa artwork remains the brand asset. Remove decorative gradients/glows and the lime marketing theme; retain semantic warning/error/success colors and meaningful activity reference colors.
- Prose: at least 16px and 60–75ch line length on documents. Do not cap code editors, query results, network tables or full-width tools to prose width. H1/H2/H3 hierarchy follows actual sections.
- UI: no sub-12px interface text; 12px remains allowed for dense editor metadata/status/line numbers. Body text inside instructional/status panels remains readable. Source CSS contains small values and responsive overrides, so fix the actual cascade rather than append another giant override layer.
- Controls: 44px by 44px minimum touch targets or an equivalent non-overlapping wrapper on mobile/touch. Current `.pl button` minimum is 42px, many icon buttons are 24–36px, and several controls rely on padding alone. Preserve splitter visuals while expanding the interactive hit area where possible.
- Keyboard: visible `:focus-visible`, reachable skip navigation, correct menu/disclosure/dialog semantics, no hidden focus, accessible icon names, announced result/error states and restoration after dialogs. Preserve existing editor shortcuts; do not let global search steal typing inside Monaco/contenteditable.
- Motion: retain present reduced-motion rules. Add coverage for transformed cards/spinners/scroll animation only after checking global inheritance. A missing per-file media query is not itself proof of missing final coverage.
- Contrast: compute final text/background combinations and states, including disabled/hover/focus/table/error code output and portaled Monaco menus. Do not overwrite the late Monaco overrides in globals.css or dark/light lab overrides in lab-ide-theme.css.
- Shared footer: Compilers, Practice, Resources and Company, maximum six links per column. Suggested destinations: Compilers = JavaScript/Python/TypeScript/React/PostgreSQL/all tools; Practice = exercises/Play & Learn/daily/interview/GenAI/frontend; Resources = Demo API/notepad/JSON Studio/schema/token counter/downloads; Company = About/Contact/Privacy/Security/browser/extensions. All omitted destinations stay reachable via Tools/Learn/search; no URL is removed. Final labels/placement remain subject to approval.
- Shared header: logo, Tools, Practice, Learn/search and account action, with a compact editor presentation. Keep all currently supported destinations accessible on mobile; do not add a large marketing header/footer inside fullscreen editor grids.

## Maker section: known facts and questions

Source-supported facts: product name Sukoaa; source repository `https://github.com/subodhsingh001/sukoaa-platform`; issues URL with `/issues`; server-configured `SUPPORT_EMAIL` and `SECURITY_EMAIL` hooks. No fixed monitored email or attributable maker biography is published in the source.

Proposed content uses explicit tags until answered:

- `[PLACEHOLDER: public maker name]`
- `[PLACEHOLDER: one- or two-sentence factual maker bio approved for publication]`
- `[PLACEHOLDER: monitored public support email]`
- `[PLACEHOLDER: private security-reporting email, or confirm it uses the support inbox]`

Needed from you before publishing those details: Which name should appear? What factual bio do you approve? Which real inbox is monitored? Should security reports use it or a separate address? A GitHub username, a name inside sample JSON, or private conversation memory is not sufficient evidence for a public bio.

## Sections over 150 words and removal inventory

Word counts below are approximate static JSX text counts; interpolated data and conditional branches can add words. They are a deletion safeguard, not a content-quality score. No long section is approved for wholesale deletion.

| Exact section owner | Approximate static words | Decision |
| --- | --- | --- |
| `app/about/page.tsx`:5 className="prose-page" | 238 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `app/contact/page.tsx`:5 className="prose-page" | 206 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `app/privacy/page.tsx`:3 className="prose-page" | 1156 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `app/publishing/page.tsx`:3 className="prose-page" | 248 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `app/security/page.tsx`:1 className="prose-page" | 178 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `app/tools/tool-schema-generator/page.tsx`:7 className="ut-seo" | 243 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `components/interview/InterviewDirectory.tsx`:59 className="ip-research" | 177 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `components/portal-ready/PortalPage.tsx`:3 className="pr-seo" | 419 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |
| `components/tools/ToolSchemaStudio.tsx`:47 className="ts-card" | 169 | Retain substantive content; only reformat or remove named editorial leaks. No wholesale deletion proposed. |

Additional dynamic/protected long sections: all per-tool FAQs/feature/limit data (`lib/marketing/tools.ts`, `utility-tools.ts`), each `/labs/*` About/FAQ (`lab-seo.ts`), full practice lessons (`practice-lessons.ts`), question lessons/answers (`questions.json`), DemoApiDocs and ApiStudio references, admin SetupGuide. Retain them regardless of whether the static JSX scanner can count interpolated content.

Named deletion/consolidation candidates listed **before** future work:

| Candidate / exact source | Proposed change | Content safeguard |
| --- | --- | --- |
| Homepage `.hero-art` / `.browser-window`, `components/Home.tsx:60` | Remove fake sukoaa://a-fresh-start illustration and noninteractive decorative code window. | Keep real directory, h1 keywords and actual runnable-code functionality. |
| Homepage promotional `.playground-banner`, `.why-section`, `.bottom-cta`, `components/Home.tsx:65–72` | Replace promotional copy with concise functionality/access information or remove redundant wrapper. | Preserve every real capability/constraint, launcher href, SEO section and FAQ. No educational code-sample edits. |
| Homepage `.roadmap`, `components/Home.tsx:70` | Consolidate into factual status where relevant. | Record all removed assertions in CHANGES.md; keep accurate availability and AI boundaries. |
| Browser `.browser-scene`, `app/browser/page.tsx:5` | Remove concept artwork/chrome entirely. | Keep actual release/install/status/FAQ content; no claim that an external release does not exist. |
| Extension `.extension-scene`, `components/marketing/ExtensionPage.tsx:3` | Remove concept paper/mockup and decorative lines. | Keep actual capability/status/permission and store-link facts. |
| Interview `.ip-hero-aside`, `InterviewDirectory.tsx:42` | Remove decorative GenAI sample panel from both track directories. | Actual lessons and 13 supplied questions remain untouched. |
| Legacy Home modal privacy copy and unreachable modal playground branch, `components/Home.tsx:53,74` | Candidate consolidation/dead-code removal in Phase 5 only after reachability verification. | Preserve any reachable modal/runner behavior; do not delete solely because the copy looks old. |

A proposed deletion that grows beyond 150 words during implementation must be re-listed with its full section boundaries before it happens. Do not shorten substantive SEO/FAQ content to evade this rule.

## Tests, preservation checks and phase verification

No existing test has been edited. The corpus-integrity tests intentionally protect original questions, IDs, slugs, source outputs and behavior; keep them.

One foreseeable string-only assertion is `tests/interview.test.ts:35`: it checks that the foundations mock note matches `/not supplied/`. If the approved neutral note replaces the screenshot-history wording, change only that assertion to the exact new factual description and log old/new strings and reason in CHANGES.md. Keep its checks for 13 supplied topics, times and round membership. Do not remove or relax the original-content hashes in `tests/fixtures/interview-v024-question-hashes.json`.

Baseline validation runs in a separate extracted copy, so generated runtime assets/build outputs cannot modify the audited source. The Node runtime is 24.22.3. The installed npm is 11.9.0; npm reports that some PHP-WASM packages request npm >=11.16.0. Installation can succeed despite that warning; do not claim the engine requirement is fully met. No dependency versions or lockfile were changed.

| Baseline check (unmodified v0.25.0 in an isolated copy) | Result |
| --- | --- |
| `npm ci --include=dev` | Completed; no lockfile edits. PHP-WASM npm engine warning noted above. |
| `npm run typecheck` | Passed, Node 24.22.3. |
| `npm test` | 289 passed, 0 failed, 0 skipped. |
| `npm run build` | Passed; Next production build generated 306 static pages. |
| Requested widths | Captured unchanged homepage at embedded 375px, 768px and 1280px viewport widths. |
| Observed overflow | 375: document client width 360px, scroll width 475px; 768: 753px / 1245px; 1280: 1265px / 1450px. The smaller client widths account for scrollbars. Header account/menu content extends beyond the viewport. |
| Capture scope | Actual prerendered production HTML plus its client assets, served in a private local QA preview. Native device emulation, production provider calls and automated axe coverage were not performed. |
| Before captures | `SUKOAA-BEFORE-375.jpg`, `SUKOAA-BEFORE-768.jpg`, `SUKOAA-BEFORE-1280.jpg` supplied with this report. |
| After captures | Not applicable: Phase 0 makes no code/design changes. Capture after the approved implementation phases. |
| Source integrity | All 673 supplied files retain their original bytes; only AUDIT.md is added. |


For every approved implementation phase:

1. Run `npm run typecheck`, `npm test` on Node 24, and `npm run build`. Fix failures before proceeding. Do not replace failures with weaker tests.
2. Compare page-route set, query parameters, redirects, canonical output, JSON-LD values and title/description keywords with this source baseline. Keep the labs ` — ` delimiter and all protected SEO About/FAQ sections.
3. Check all dynamic totals against source arrays and ensure browser-local controls have not imported full solution/question banks merely to show a badge count.
4. Capture before/after at 375px, 768px and 1280px for the changed surfaces. Browser tooling in this environment supports managed cloud-browser checks; exact embedded viewport captures are possible. Native mobile-device emulation and automated axe coverage are not implied.
5. Verify search/menu/account navigation; editor selection/run/stop/save/import/export; full-page and resizable views; focus/dialog/keyboard behavior; and local progress reload/backup. Backend calls/providers must not be exercised merely for a copy review.
6. In CHANGES.md, record per-page changes, each updated string assertion, removed sections/assets, preserved exceptions, unresolved Maker facts and verification limits. No CHANGES.md has been started in Phase 0 because implementation has not begun.

## Proposed implementation sequence after approval

| Phase | Scope | Required exit evidence |
| --- | --- | --- |
| 1 | Shared tokens, scoped typography, focus/contrast/touch rules; common header/footer variants and CommandPalette accessibility. | Checks pass; homepage/document/editor navigation retained; 375/768/1280 before/after; no canonical/JSON-LD changes. |
| 2 | Homepage factual copy, above-fold directory, computed counts, removal of fake hero art and redundant status badges. | Favorites/filter/search/launch behavior preserved; current totals correct; SEO and FAQ retained. |
| 3 | Tool and compiler guides, labs, Studio/native/workspace chrome, utilities/notepad, Play & Learn, Interview Prep and Portal-Ready. | Educational content/code/algorithms unchanged; real previews functional; About/FAQ sections retained; full-screen/split geometry works. |
| 4 | Identified editorial leaks; About/Maker/browser accuracy and scoped AI/local/external facts; data-count consistency. | No invented support/bio/release facts; no production Gemini claim; internal API contract changes explicitly excluded. |
| 5 | Proven-unused CSS/assets/components and scoped banned-word sweep. | Static import graph plus dynamic/string reference review; build/tests; documented allowlist for educational/code/technical terms. No broad delete based on grep. |

Do not restart work automatically after Phase 0. The next user decision is approval of Phase 1 and, separately, the missing Maker/contact facts. A source audit and copy cleanup cannot promise faster indexing or a first-place Google ranking.

## Appendix A: every concrete page URL and owning module

The plan/issue ID refers to the complete route row above, including its shared component/CSS findings. Existing sitemap inclusion and noindex/redirect behavior are preserved, not changed by this table.

| Concrete URL | Source page / audit plan | Current sitemap inclusion |
| --- | --- | --- |
| `/` | `app/page.tsx` / T20 | Included |
| `/about` | `app/about/page.tsx` / T01 | Included |
| `/account` | `app/account/page.tsx` / T02 | Not included (preserve existing policy) |
| `/admin` | `app/admin/page.tsx` / T03 | Not included (preserve existing policy) |
| `/admin/setup` | `app/admin/setup/page.tsx` / T04 | Not included (preserve existing policy) |
| `/brand-preview` | `app/brand-preview/page.tsx` / T05 | Not included (preserve existing policy) |
| `/browser` | `app/browser/page.tsx` / T06 | Included |
| `/contact` | `app/contact/page.tsx` / T07 | Included |
| `/demo-api` | `app/demo-api/page.tsx` / T08 | Included |
| `/downloads` | `app/downloads/page.tsx` / T09 | Included |
| `/extensions` | `app/extensions/page.tsx` / T10 | Included |
| `/extensions/quick-replies` | `app/extensions/quick-replies/page.tsx` / T11 | Not included (preserve existing policy) |
| `/extensions/web-pdf-studio` | `app/extensions/web-pdf-studio/page.tsx` / T12 | Not included (preserve existing policy) |
| `/interview-prep` | `app/interview-prep/page.tsx` / T16 | Included |
| `/interview-prep/frontend` | `app/interview-prep/[track]/page.tsx` / T14 | Included |
| `/interview-prep/frontend/accessible-form` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-http-interceptors` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-list-identity` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-observable-sharing` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-service-lifetimes` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-signals` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-streams` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-typed-form-array` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/angular-zoneless-readiness` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/api-contract-tests` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/batching-edge-cases` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/browser-security` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/closures` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/complex-forms` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/controlled-inputs` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/cursor-pagination-table` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/design-system` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/effects` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/event-loop` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/external-store-snapshots` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/fetch-races` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/immutable-updates` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/incident-story` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/incremental-migration` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/list-keys` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/next-cache-invalidation` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/next-hydration-determinism` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/next-mutation-flow` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/observability` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/offline-conflicts` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/performance-budget` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/personalized-cache` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/project-defence` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/react-error-boundaries` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/react-performance` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/react-transition-priority` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/realtime-event-order` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/reducer-transitions` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/render-purity` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/rendering-choices` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/responsive-layout` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/server-client-boundary` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/state-ownership` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/state-snapshot` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/technical-leadership` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/testing-behavior` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/typescript-boundaries` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/typescript-state-unions` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/untrusted-preview` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/frontend/workspace-design` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai` | `app/interview-prep/[track]/page.tsx` / T14 | Included |
| `/interview-prep/genai/agent-checkpoint-recovery` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/agent-resource-budgets` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/agent-trace-evaluation` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/agents-and-workflows` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/bi-cross-encoder` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/chunking-basics` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/context-budget-order` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/coroutine-task-lifecycle` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/correctness-vs-grounding` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/defend-your-project` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/duplicate-evidence` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/embeddings` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/evaluation-baseline` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/evaluation-leakage` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/evaluation-slices` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/exact-product-codes` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/freshness-drift` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/genai-vs-ml` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/http-response-contract` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/hybrid-rank-fusion` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/latency-cost-budget` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/llm-judge-reliability` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/metadata-filter-recall` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/missing-evidence` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/notice-and-expectations` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/paginated-ingestion` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/production-failure` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/prompt-injection` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/prompt-structure` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/provider-contract-release` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/python-concurrency` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/python-copying` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/python-exception-boundaries` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/python-json-boundary` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/rag-metrics` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/rag-or-finetuning` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/rag-pipeline` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/retrieval-failure-trace` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/retrieval-ranking` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/retry-backoff` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/safe-rollout` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/streaming-batches` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/structured-output` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/support-eval-pipeline` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/tenant-isolation` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/tokens-and-context` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/tool-side-effects` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/two-point-gain` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/two-year-direction` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/genai/validate-chunking` | `app/interview-prep/[track]/[question]/page.tsx` / T13 | Included |
| `/interview-prep/mock` | `app/interview-prep/mock/page.tsx` / T15 | Not included (preserve existing policy) |
| `/interview-prep/project` | `app/interview-prep/project/page.tsx` / T17 | Not included (preserve existing policy) |
| `/labs/fastapi` | `app/labs/[technology]/page.tsx` / T18 | Included |
| `/labs/laravel` | `app/labs/[technology]/page.tsx` / T18 | Included |
| `/labs/nodejs` | `app/labs/[technology]/page.tsx` / T18 | Not included (preserve existing policy) |
| `/labs/php` | `app/labs/[technology]/page.tsx` / T18 | Included |
| `/labs/postgresql` | `app/labs/[technology]/page.tsx` / T18 | Included |
| `/labs/tailwindcss` | `app/labs/[technology]/page.tsx` / T18 | Included |
| `/native` | `app/native/page.tsx` / T19 | Not included (preserve existing policy) |
| `/play` | `app/play/page.tsx` / T23 | Included |
| `/play/css-center` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/css-grid` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/css-wrap` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/daily` | `app/play/daily/page.tsx` / T22 | Included |
| `/play/fastapi-async` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/fastapi-body` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/fastapi-bounds` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/fastapi-missing` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/fastapi-path-type` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/fastapi-query` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-bug-assign` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-bug-mutate` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-bug-return` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-bug-sort` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-bug-zero` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-closure` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-filter` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-map` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-nullish` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-order-branch` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-order-filter` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-order-fn` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-order-loop` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-order-object` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/js-total` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/laravel-mass-assignment` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/laravel-missing` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/laravel-n-plus-one` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/laravel-response` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/laravel-route` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/laravel-validation` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/llm-browser-key` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/llm-max-tokens` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/llm-roles` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/llm-stateless` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/llm-stream-parse` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/llm-temperature` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/nodejs-await` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/nodejs-event-loop` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/nodejs-json` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/nodejs-path` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/nodejs-size` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/nodejs-status` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/php-escape` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/php-json` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/php-keys` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/php-map` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/php-missing` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/php-strict` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/postgresql-in-stock` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/postgresql-jsonb` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/postgresql-jsonb-read` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/postgresql-null` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/postgresql-parameter` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/postgresql-window` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/progress` | `app/play/progress/page.tsx` / T24 | Not included (preserve existing policy) |
| `/play/py-alias` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-bug-append` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-bug-bound` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-bug-condition` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-bug-indent` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-bug-key` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-count` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-fallback` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-order-count` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-order-error` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-order-fn` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-order-list` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-order-sort` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-range` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/py-slice` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/rag-chunk-overlap` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/rag-cosine` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/rag-no-match` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/rag-same-model` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/rag-topk` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/rag-untrusted-context` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/repair-active` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/repair-count` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/repair-names` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/repair-sort` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/repair-stock` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/repair-total` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/sql-group` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/sql-stock` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/sql-total` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/tailwindcss-button` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/tailwindcss-center` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/tailwindcss-dynamic` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/tailwindcss-focus` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/tailwindcss-grid` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/tailwindcss-responsive` | `app/play/[slug]/page.tsx` / T21 | Included |
| `/play/tracks/api-repair` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/fastapi` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/javascript` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/laravel` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/llm-api` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/nodejs` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/php` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/postgresql` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/python` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/rag` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/sql` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/tailwindcss` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/play/tracks/web` | `app/play/tracks/[track]/page.tsx` / T25 | Included |
| `/portal-ready` | `app/portal-ready/page.tsx` / T27 | Not included (preserve existing policy) |
| `/portal-ready/custom-photo` | `app/portal-ready/[preset]/page.tsx` / T26 | Not included (preserve existing policy) |
| `/portal-ready/custom-signature` | `app/portal-ready/[preset]/page.tsx` / T26 | Not included (preserve existing policy) |
| `/portal-ready/ibps-po-xvi-photo` | `app/portal-ready/[preset]/page.tsx` / T26 | Not included (preserve existing policy) |
| `/portal-ready/ibps-po-xvi-signature` | `app/portal-ready/[preset]/page.tsx` / T26 | Not included (preserve existing policy) |
| `/portal-ready/image-to-pdf` | `app/portal-ready/[preset]/page.tsx` / T26 | Not included (preserve existing policy) |
| `/practice` | `app/practice/page.tsx` / T30 | Included |
| `/practice/javascript` | `app/practice/[language]/page.tsx` / T29 | Included |
| `/practice/javascript/calculate-cart-total` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/javascript/capitalize-each-word` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/javascript/count-orders-by-status` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/javascript/filter-array-of-objects` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/javascript/remove-duplicate-values` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/javascript/sort-array-by-price` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/json` | `app/practice/[language]/page.tsx` / T29 | Included |
| `/practice/json/fix-invalid-json` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/json/write-valid-json-config` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/python` | `app/practice/[language]/page.tsx` / T29 | Included |
| `/practice/python/average-function-empty-list` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/python/count-words-dictionary` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/python/list-comprehension-even-squares` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/python/palindrome-check` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/sql` | `app/practice/[language]/page.tsx` / T29 | Included |
| `/practice/sql/group-by-sum-orders` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/sql/having-count-filter` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/sql/join-customers-and-orders` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/sql/where-and-order-by` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/typescript` | `app/practice/[language]/page.tsx` / T29 | Included |
| `/practice/typescript/filter-active-users` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/typescript/generic-first-element` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/practice/typescript/typed-ticket-function` | `app/practice/[language]/[slug]/page.tsx` / T28 | Included |
| `/privacy` | `app/privacy/page.tsx` / T31 | Included |
| `/publishing` | `app/publishing/page.tsx` / T32 | Included |
| `/security` | `app/security/page.tsx` / T33 | Included |
| `/setup` | `app/setup/page.tsx` / T34 | Not included (preserve existing policy) |
| `/studio` | `app/studio/page.tsx` / T35 | Not included (preserve existing policy) |
| `/tools` | `app/tools/page.tsx` / T52 | Included |
| `/tools/angular` | `app/tools/angular/page.tsx` / T36 | Included |
| `/tools/base64-url-encoder` | `app/tools/base64-url-encoder/page.tsx` / T37 | Included |
| `/tools/c` | `app/tools/c/page.tsx` / T38 | Not included (preserve existing policy) |
| `/tools/color-converter` | `app/tools/color-converter/page.tsx` / T39 | Included |
| `/tools/cpp` | `app/tools/cpp/page.tsx` / T40 | Not included (preserve existing policy) |
| `/tools/csharp` | `app/tools/csharp/page.tsx` / T41 | Not included (preserve existing policy) |
| `/tools/hash-generator` | `app/tools/hash-generator/page.tsx` / T42 | Included |
| `/tools/html-css` | `app/tools/html-css/page.tsx` / T43 | Included |
| `/tools/java` | `app/tools/java/page.tsx` / T44 | Not included (preserve existing policy) |
| `/tools/javascript` | `app/tools/javascript/page.tsx` / T45 | Included |
| `/tools/json` | `app/tools/json/page.tsx` / T46 | Included |
| `/tools/json-studio` | `app/tools/json-studio/page.tsx` / T47 | Included |
| `/tools/json-to-typescript` | `app/tools/json-to-typescript/page.tsx` / T48 | Included |
| `/tools/jwt-decoder` | `app/tools/jwt-decoder/page.tsx` / T49 | Included |
| `/tools/nextjs` | `app/tools/nextjs/page.tsx` / T50 | Included |
| `/tools/notepad` | `app/tools/notepad/page.tsx` / T51 | Included |
| `/tools/portal-ready` | `app/tools/portal-ready/page.tsx` / T54 | Included |
| `/tools/portal-ready/custom-photo` | `app/tools/portal-ready/[preset]/page.tsx` / T53 | Included |
| `/tools/portal-ready/custom-signature` | `app/tools/portal-ready/[preset]/page.tsx` / T53 | Included |
| `/tools/portal-ready/ibps-po-xvi-photo` | `app/tools/portal-ready/[preset]/page.tsx` / T53 | Included |
| `/tools/portal-ready/ibps-po-xvi-signature` | `app/tools/portal-ready/[preset]/page.tsx` / T53 | Included |
| `/tools/portal-ready/image-to-pdf` | `app/tools/portal-ready/[preset]/page.tsx` / T53 | Included |
| `/tools/python` | `app/tools/python/page.tsx` / T55 | Included |
| `/tools/rag-playground` | `app/tools/rag-playground/page.tsx` / T56 | Included |
| `/tools/react` | `app/tools/react/page.tsx` / T57 | Included |
| `/tools/react-native` | `app/tools/react-native/page.tsx` / T58 | Included |
| `/tools/regex` | `app/tools/regex/page.tsx` / T59 | Included |
| `/tools/rust` | `app/tools/rust/page.tsx` / T60 | Not included (preserve existing policy) |
| `/tools/sql` | `app/tools/sql/page.tsx` / T61 | Included |
| `/tools/text-compare` | `app/tools/text-compare/page.tsx` / T62 | Included |
| `/tools/token-counter` | `app/tools/token-counter/page.tsx` / T63 | Included |
| `/tools/tool-schema-generator` | `app/tools/tool-schema-generator/page.tsx` / T64 | Included |
| `/tools/typescript` | `app/tools/typescript/page.tsx` / T65 | Included |
| `/tools/uuid-generator` | `app/tools/uuid-generator/page.tsx` / T66 | Included |
| `/workspace` | `app/workspace/page.tsx` / T67 | Not included (preserve existing policy) |

## Appendix B: API, metadata and infrastructure entry points

| Endpoint / kind | Exact file | Audit finding / planned treatment |
| --- | --- | --- |
| `/.well-known/security.txt` | `app/.well-known/security.txt/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/account/export` | `app/api/account/export/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/admin` | `app/api/admin/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/ai/run` | `app/api/ai/run/route.ts` | Confirmed disabled agent endpoint: 503 AI_DISABLED. See F02; do not change behavior. |
| `/api/auth/[action]` | `app/api/auth/[action]/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/demo/[[...path]]` | `app/api/demo/[[...path]]/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/demo/chat/completions` | `app/api/demo/chat/completions/route.ts` | Simulated model-shaped API; no real inference. Preserve wire contract. |
| `/api/demo/github` | `app/api/demo/github/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/demo/graphql` | `app/api/demo/graphql/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/demo/sandboxes/[id]/[[...path]]` | `app/api/demo/sandboxes/[id]/[[...path]]/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/demo/sandboxes` | `app/api/demo/sandboxes/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/execute/[id]` | `app/api/execute/[id]/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/execute` | `app/api/execute/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/learning/starters/[technology]` | `app/api/learning/starters/[technology]/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/play/progress` | `app/api/play/progress/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/projects/[id]` | `app/api/projects/[id]/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/projects` | `app/api/projects/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/releases` | `app/api/releases/route.ts` | No visual redesign target; preserve API paths, payloads, validation, permissions and status codes. |
| `/api/status` | `app/api/status/route.ts` | Stale version metadata F09; separately scoped correction required. |
| `/api/token-wording` | `app/api/token-wording/route.ts` | Development-only Gemini outbound proxy; production gate and consent required. See AI table. |
| `/og` | `app/og/route.tsx` | Generated social image styles; title/path input and output URL are protected. P3 style only if needed; no SEO metadata changes. |
| Infrastructure | `app/sitemap.ts` | Map protected publicPaths and environment gates; no URL, priority, canonical or lastmod change in this task. |
| Infrastructure | `app/robots.ts` | Preserve current environment-dependent allow/disallow and sitemap link. |
| Infrastructure | `app/not-found.tsx` | Shared chrome and factual error copy; preserve 404/noindex. |
| Infrastructure | `app/chatgpt-auth.ts` | Integration/auth adapter, not visitor marketing copy; no changes. |
| Infrastructure | `app/og/route.tsx` | Already listed as /og above; retain input/output metadata contract. |
| Infrastructure | `next.config.ts` | Headers, WebContainer cross-origin isolation and build settings are protected; no functionality changes. |
| Infrastructure | `postcss.config.mjs` | Keep Tailwind integration and build pipeline. |
| Infrastructure | `package.json` | Preserve dependencies, scripts and Node engine. No new icon/design dependency required. |
| Infrastructure | `package-lock.json` | Preserve locked dependency graph. |
| Infrastructure | `tsconfig.json` | Keep strict settings and @/* alias. |
| Infrastructure | `tsconfig.build.json` | Keep build-specific generated-route exclusions; do not hide type errors. |

## Appendix C: complete supplied-file inventory

This inventory makes exclusions explicit. Runtime bundles, licence files, examples, migrations, tests and docs are accounted for; listing them does not authorize modification. No secret `.env.local` file was supplied or read.

- `.dockerignore`
- `.env.example`
- `.gitignore`
- `003_compiled_language_projects.txt`
- `ANGULAR-STUDIO-SETUP.txt`
- `ANGULAR-VERIFICATION.txt`
- `API-STUDIO-SETUP.txt`
- `BACKEND-COMPILERS-README.md`
- `BACKGROUND-PREPARATION-v0.15.5.txt`
- `CARD-LINK-FIX.txt`
- `COMPACT-WORKSPACE.txt`
- `COMPILED-LANGUAGES-SETUP.txt`
- `COMPILER-CONNECTION-NEXT-STEPS.txt`
- `COMPILER-SESSIONS-v0.15.4.txt`
- `DISCOVERY-CONTACT-PERFORMANCE.txt`
- `Dockerfile`
- `GEMINI-WORDING-LOCAL-SETUP.txt`
- `GENAI-INTERVIEW-TOPICS.txt`
- `GOOGLE-COMPILER-SEARCH.txt`
- `INTERVIEW-PREP-v0.24.0.txt`
- `INTERVIEW-PREP-v0.25.0.txt`
- `LEARNING-STAGE-v0.18.0.txt`
- `NOTEPAD-AND-COMPACT-WORKSPACE-v0.16.0.txt`
- `PLAY-CLOUD-PROGRESS-SQL.txt`
- `PLAY-LEARN-v0.17.0.txt`
- `PORTAL-READY-SETUP.md`
- `PRACTICE-AND-SEO-SETUP.txt`
- `PRACTICE-BUTTON-FIX.txt`
- `REACT-NATIVE-AND-GOOGLE-SETUP.txt`
- `REACT-NATIVE-SETUP.txt`
- `README.md`
- `RELEASE-STATUS.txt`
- `SCHEMA-GENERATOR-FIX-v0.24.1.txt`
- `SELF-HOSTED-JUDGE0-SETUP.txt`
- `SEO-AVAILABILITY-UPDATE.txt`
- `SEO-SETUP.txt`
- `SEO-UPDATE-v0.16.0.txt`
- `STARTUP-AND-BUILD-FIX-v0.15.3.txt`
- `STUDIO-FIX-VERIFICATION.txt`
- `STUDIO-STARTUP-AND-MENU-FIX.txt`
- `THIRD-PARTY-NOTICES.md`
- `TOOL-SCHEMA-GENERATOR.md`
- `TOOLBOX-AND-CLOUD.txt`
- `TYPES-STUDIO-README.md`
- `UPDATE-README.txt`
- `WORKSPACE-MENUS-v0.16.1.txt`
- `WORKSPACE-REPAIR-v0.15.2.txt`
- `WORKSPACE-UPDATE.txt`
- `app/.well-known/security.txt/route.ts`
- `app/about/page.tsx`
- `app/account/account.css`
- `app/account/layout.tsx`
- `app/account/page.tsx`
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/setup/page.tsx`
- `app/api/account/export/route.ts`
- `app/api/admin/route.ts`
- `app/api/ai/run/route.ts`
- `app/api/auth/[action]/route.ts`
- `app/api/demo/[[...path]]/route.ts`
- `app/api/demo/chat/completions/route.ts`
- `app/api/demo/github/route.ts`
- `app/api/demo/graphql/route.ts`
- `app/api/demo/sandboxes/[id]/[[...path]]/route.ts`
- `app/api/demo/sandboxes/route.ts`
- `app/api/execute/[id]/route.ts`
- `app/api/execute/route.ts`
- `app/api/learning/starters/[technology]/route.ts`
- `app/api/play/progress/route.ts`
- `app/api/projects/[id]/route.ts`
- `app/api/projects/route.ts`
- `app/api/releases/route.ts`
- `app/api/status/route.ts`
- `app/api/token-wording/route.ts`
- `app/brand-preview/page.tsx`
- `app/brand-preview/preview.css`
- `app/browser/page.tsx`
- `app/chatgpt-auth.ts`
- `app/contact/page.tsx`
- `app/demo-api/page.tsx`
- `app/downloads/page.tsx`
- `app/extensions/page.tsx`
- `app/extensions/quick-replies/page.tsx`
- `app/extensions/web-pdf-studio/page.tsx`
- `app/globals.css`
- `app/interview-prep/[track]/[question]/page.tsx`
- `app/interview-prep/[track]/page.tsx`
- `app/interview-prep/mock/page.tsx`
- `app/interview-prep/page.tsx`
- `app/interview-prep/project/page.tsx`
- `app/labs/[technology]/page.tsx`
- `app/layout.tsx`
- `app/native/ExpoWorkspace.tsx`
- `app/native/layout.tsx`
- `app/native/native.css`
- `app/native/page.tsx`
- `app/not-found.tsx`
- `app/og/route.tsx`
- `app/page.tsx`
- `app/play/[slug]/page.tsx`
- `app/play/daily/page.tsx`
- `app/play/page.tsx`
- `app/play/progress/page.tsx`
- `app/play/tracks/[track]/page.tsx`
- `app/portal-ready/[preset]/page.tsx`
- `app/portal-ready/page.tsx`
- `app/practice/[language]/[slug]/page.tsx`
- `app/practice/[language]/page.tsx`
- `app/practice/page.tsx`
- `app/privacy/page.tsx`
- `app/publishing/page.tsx`
- `app/robots.ts`
- `app/security/page.tsx`
- `app/setup/layout.tsx`
- `app/setup/page.tsx`
- `app/sitemap.ts`
- `app/studio/layout.tsx`
- `app/studio/page.tsx`
- `app/studio/studio.css`
- `app/tools/angular/page.tsx`
- `app/tools/base64-url-encoder/page.tsx`
- `app/tools/c/page.tsx`
- `app/tools/color-converter/page.tsx`
- `app/tools/cpp/page.tsx`
- `app/tools/csharp/page.tsx`
- `app/tools/hash-generator/page.tsx`
- `app/tools/html-css/page.tsx`
- `app/tools/java/page.tsx`
- `app/tools/javascript/page.tsx`
- `app/tools/json-studio/page.tsx`
- `app/tools/json-to-typescript/page.tsx`
- `app/tools/json/page.tsx`
- `app/tools/jwt-decoder/page.tsx`
- `app/tools/nextjs/page.tsx`
- `app/tools/notepad/page.tsx`
- `app/tools/page.tsx`
- `app/tools/portal-ready/[preset]/page.tsx`
- `app/tools/portal-ready/page.tsx`
- `app/tools/python/page.tsx`
- `app/tools/rag-playground/page.tsx`
- `app/tools/react-native/page.tsx`
- `app/tools/react/page.tsx`
- `app/tools/regex/page.tsx`
- `app/tools/rust/page.tsx`
- `app/tools/sql/page.tsx`
- `app/tools/text-compare/page.tsx`
- `app/tools/token-counter/page.tsx`
- `app/tools/tool-schema-generator/page.tsx`
- `app/tools/typescript/page.tsx`
- `app/tools/uuid-generator/page.tsx`
- `app/workspace/layout.tsx`
- `app/workspace/page.tsx`
- `app/workspace/workspace.css`
- `components/AccountDataTools.tsx`
- `components/AccountSession.tsx`
- `components/EditorFontControl.tsx`
- `components/Home.tsx`
- `components/SukoaaLogo.tsx`
- `components/admin/SetupGuide.tsx`
- `components/connector-error.tsx`
- `components/home-extra.css`
- `components/interview/InterviewDirectory.tsx`
- `components/interview/InterviewQuestion.tsx`
- `components/interview/MockInterview.tsx`
- `components/interview/ProjectDefence.tsx`
- `components/interview/QuestionPractice.tsx`
- `components/interview/interview.css`
- `components/interview/useProgress.ts`
- `components/learning/BackendPlayground.tsx`
- `components/learning/BrowserLabs.tsx`
- `components/learning/LabIDE.tsx`
- `components/learning/LearningDiscovery.tsx`
- `components/learning/NodePlayground.tsx`
- `components/learning/SQLPlayground.tsx`
- `components/learning/TailwindPlayground.tsx`
- `components/learning/TechnicalActivity.tsx`
- `components/learning/TrackGuide.tsx`
- `components/learning/backend-playground.css`
- `components/learning/lab-ide-theme.css`
- `components/learning/learning-discovery.css`
- `components/marketing/CommandPalette.tsx`
- `components/marketing/ExtensionPage.tsx`
- `components/marketing/MarketingStyles.tsx`
- `components/marketing/PracticeProgress.tsx`
- `components/marketing/SiteFrame.tsx`
- `components/marketing/StructuredData.tsx`
- `components/marketing/ToolPage.tsx`
- `components/marketing/command-palette.css`
- `components/marketing/marketing.css`
- `components/notepad/MarkdownPreview.tsx`
- `components/notepad/Notepad.tsx`
- `components/notepad/notepad.css`
- `components/play/ActivityPlayer.tsx`
- `components/play/ApiStudio.tsx`
- `components/play/DemoApiDocs.tsx`
- `components/play/LearningNoteInbox.tsx`
- `components/play/LearningTools.tsx`
- `components/play/PlayHub.tsx`
- `components/play/api-studio.css`
- `components/play/demo-api.css`
- `components/play/play.css`
- `components/play/useProgress.ts`
- `components/portal-ready/ExamChecklist.tsx`
- `components/portal-ready/OfflineTool.tsx`
- `components/portal-ready/PortalEditor.tsx`
- `components/portal-ready/PortalPage.tsx`
- `components/portal-ready/portal-ready.css`
- `components/portal-ready/useImageGestures.ts`
- `components/studio/ProjectEditor.tsx`
- `components/studio/RuntimeStartupPanel.tsx`
- `components/studio/StudioSplitter.tsx`
- `components/studio/StudioWorkspace.tsx`
- `components/tools/RagPlayground.tsx`
- `components/tools/TokenCounter.tsx`
- `components/tools/TokenWording.tsx`
- `components/tools/ToolSchemaStudio.tsx`
- `components/tools/UtilityPage.tsx`
- `components/tools/UtilityTools.tsx`
- `components/tools/token-wording.css`
- `components/tools/tool-schema-studio.css`
- `components/tools/utility-tools.css`
- `components/types-studio/TypesStudio.tsx`
- `components/types-studio/types-studio.css`
- `components/ui/accordion.tsx`
- `components/ui/alert-dialog.tsx`
- `components/ui/alert.tsx`
- `components/ui/aspect-ratio.tsx`
- `components/ui/attachment.tsx`
- `components/ui/avatar.tsx`
- `components/ui/badge.tsx`
- `components/ui/breadcrumb.tsx`
- `components/ui/bubble.tsx`
- `components/ui/button-group.tsx`
- `components/ui/button.tsx`
- `components/ui/calendar.tsx`
- `components/ui/card.tsx`
- `components/ui/carousel.tsx`
- `components/ui/chart.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/collapsible.tsx`
- `components/ui/combobox.tsx`
- `components/ui/command.tsx`
- `components/ui/context-menu.tsx`
- `components/ui/dialog.tsx`
- `components/ui/direction.tsx`
- `components/ui/drawer.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/empty.tsx`
- `components/ui/field.tsx`
- `components/ui/form.tsx`
- `components/ui/hover-card.tsx`
- `components/ui/input-group.tsx`
- `components/ui/input-otp.tsx`
- `components/ui/input.tsx`
- `components/ui/item.tsx`
- `components/ui/kbd.tsx`
- `components/ui/label.tsx`
- `components/ui/marker.tsx`
- `components/ui/menubar.tsx`
- `components/ui/message-scroller.tsx`
- `components/ui/message.tsx`
- `components/ui/native-select.tsx`
- `components/ui/navigation-menu.tsx`
- `components/ui/pagination.tsx`
- `components/ui/popover.tsx`
- `components/ui/progress.tsx`
- `components/ui/radio-group.tsx`
- `components/ui/resizable.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/select.tsx`
- `components/ui/separator.tsx`
- `components/ui/sheet.tsx`
- `components/ui/sidebar.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/slider.tsx`
- `components/ui/sonner.tsx`
- `components/ui/spinner.tsx`
- `components/ui/switch.tsx`
- `components/ui/table.tsx`
- `components/ui/tabs.tsx`
- `components/ui/textarea.tsx`
- `components/ui/toggle-group.tsx`
- `components/ui/toggle.tsx`
- `components/ui/tooltip.tsx`
- `components/workspace/CodeEditor.tsx`
- `components/workspace/ConsoleOutput.tsx`
- `components/workspace/ToolboxLinks.tsx`
- `compose.yaml`
- `data/portalPresets.json`
- `data/publicReleases.json`
- `deploy/judge0/.gitignore`
- `deploy/judge0/Caddyfile`
- `deploy/judge0/README.txt`
- `deploy/judge0/UPSTREAM-NOTICE.txt`
- `deploy/judge0/compose.local.yaml`
- `deploy/judge0/compose.yaml`
- `deploy/judge0/demos/c/main.c`
- `deploy/judge0/demos/cpp/main.cpp`
- `deploy/judge0/demos/csharp/Main.cs`
- `deploy/judge0/demos/go/main.go`
- `deploy/judge0/demos/java/Main.java`
- `deploy/judge0/demos/rust/main.rs`
- `deploy/judge0/manage.py`
- `deploy/judge0/test_manage.py`
- `docs/01-ARCHITECTURE.md`
- `docs/02-LOCAL-SETUP.md`
- `docs/03-DEPLOYMENT.md`
- `docs/04-DATABASE-AND-SECURITY.md`
- `docs/05-CODE-RUNTIMES.md`
- `docs/06-GROWTH-AND-DISTRIBUTION.md`
- `docs/07-VALIDATION.md`
- `docs/08-PROJECT-STUDIO.md`
- `docs/09-PUBLISHING-AND-SEO.md`
- `docs/15-BRANDING.md`
- `docs/16-ACCOUNTS-AND-DOWNLOADS.md`
- `docs/18-GOOGLE-SEO-SETUP.txt`
- `docs/19-REACT-NATIVE.txt`
- `docs/20-TOOLBOX-AND-CLOUD.txt`
- `docs/21-GOOGLE-COMPILER-SEARCH.txt`
- `docs/22-COMPILED-LANGUAGES.txt`
- `docs/23-COMPACT-WORKSPACE.txt`
- `docs/24-SELF-HOSTED-JUDGE0.txt`
- `docs/25-NATIVE-WEB-AND-INDEXING.txt`
- `docs/26-PRACTICE-SEO-UPDATE.txt`
- `docs/27-DISCOVERY-TRUST-PERFORMANCE.txt`
- `docs/28-ANGULAR-STUDIO.txt`
- `docs/29-STUDIO-STARTUP-AND-MENU-FIX.txt`
- `docs/30-SOURCE-AUDIT.md`
- `docs/RELEASE-STATUS-v0.2.0.txt`
- `docs/licenses/gpt-tokenizer-LICENSE.txt`
- `docs/licenses/graphql-LICENSE.txt`
- `docs/licenses/pdf-lib-LICENSE.txt`
- `docs/licenses/yaml-LICENSE.txt`
- `examples/browser-laravel/.env.example`
- `examples/browser-laravel/README.txt`
- `examples/browser-laravel/app/.gitkeep`
- `examples/browser-laravel/artisan`
- `examples/browser-laravel/bootstrap/app.php`
- `examples/browser-laravel/bootstrap/cache/.gitkeep`
- `examples/browser-laravel/bootstrap/providers.php`
- `examples/browser-laravel/composer.json`
- `examples/browser-laravel/composer.lock`
- `examples/browser-laravel/config/app.php`
- `examples/browser-laravel/config/cache.php`
- `examples/browser-laravel/config/logging.php`
- `examples/browser-laravel/phpunit.xml`
- `examples/browser-laravel/public/index.php`
- `examples/browser-laravel/routes/api.php`
- `examples/browser-laravel/storage/framework/cache/data/.gitkeep`
- `examples/browser-laravel/storage/framework/sessions/.gitkeep`
- `examples/browser-laravel/storage/framework/views/.gitkeep`
- `examples/browser-laravel/storage/logs/.gitkeep`
- `examples/browser-laravel/tests/Feature/ProductsTest.php`
- `examples/browser-laravel/tests/TestCase.php`
- `examples/compiled-languages/README.txt`
- `examples/compiled-languages/c/main.c`
- `examples/compiled-languages/cpp/main.cpp`
- `examples/compiled-languages/csharp/Main.cs`
- `examples/compiled-languages/java/Main.java`
- `examples/compiled-languages/rust/main.rs`
- `examples/learning/fastapi/README.txt`
- `examples/learning/fastapi/main.py`
- `examples/learning/fastapi/requirements.txt`
- `examples/learning/fastapi/test_api.py`
- `examples/learning/laravel/.env.example`
- `examples/learning/laravel/README.txt`
- `examples/learning/laravel/app/.gitkeep`
- `examples/learning/laravel/artisan`
- `examples/learning/laravel/bootstrap/app.php`
- `examples/learning/laravel/bootstrap/cache/.gitkeep`
- `examples/learning/laravel/bootstrap/providers.php`
- `examples/learning/laravel/composer.json`
- `examples/learning/laravel/config/app.php`
- `examples/learning/laravel/phpunit.xml`
- `examples/learning/laravel/public/index.php`
- `examples/learning/laravel/routes/api.php`
- `examples/learning/laravel/storage/framework/cache/data/.gitkeep`
- `examples/learning/laravel/storage/framework/sessions/.gitkeep`
- `examples/learning/laravel/storage/framework/views/.gitkeep`
- `examples/learning/laravel/storage/logs/.gitkeep`
- `examples/learning/laravel/tests/Feature/ProductsTest.php`
- `examples/learning/laravel/tests/TestCase.php`
- `examples/learning/nodejs/README.txt`
- `examples/learning/nodejs/package.json`
- `examples/learning/nodejs/run.mjs`
- `examples/learning/nodejs/server.mjs`
- `examples/learning/nodejs/tests.mjs`
- `examples/learning/php/README.txt`
- `examples/learning/php/lib.php`
- `examples/learning/php/router.php`
- `examples/learning/php/tests.php`
- `examples/learning/postgresql/README.txt`
- `examples/learning/postgresql/compose.yaml`
- `examples/learning/postgresql/exercises.sql`
- `examples/learning/postgresql/schema.sql`
- `examples/learning/tailwindcss/README.txt`
- `examples/learning/tailwindcss/package-lock.json`
- `examples/learning/tailwindcss/package.json`
- `examples/learning/tailwindcss/public/index.html`
- `examples/learning/tailwindcss/public/output.css`
- `examples/learning/tailwindcss/src/input.css`
- `hooks/use-mobile.ts`
- `hooks/use-workspace-widths.ts`
- `lib/connector-context.ts`
- `lib/connector-contract.mts`
- `lib/connector-errors.mts`
- `lib/connector-preview.d.ts`
- `lib/connectors.ts`
- `lib/demo-api/builder.ts`
- `lib/demo-api/chat.ts`
- `lib/demo-api/data.ts`
- `lib/demo-api/github.ts`
- `lib/demo-api/graphql.ts`
- `lib/demo-api/handler.ts`
- `lib/demo-api/sandbox-store.ts`
- `lib/demo-api/sandboxes.ts`
- `lib/interview/catalog.ts`
- `lib/interview/filter.ts`
- `lib/interview/progress.ts`
- `lib/interview/questions.json`
- `lib/interview/types.ts`
- `lib/learning/POSTGRESQL-LICENSE.txt`
- `lib/learning/backend-frame.ts`
- `lib/learning/backend-projects.ts`
- `lib/learning/backend-samples.ts`
- `lib/learning/fastapi-adapter.mjs`
- `lib/learning/fastapi-entry.mjs`
- `lib/learning/lab-seo.ts`
- `lib/learning/laravel-browser.lock.json`
- `lib/learning/modules.ts`
- `lib/learning/php-entry.mjs`
- `lib/learning/postgres-worker.ts`
- `lib/learning/starters.json`
- `lib/learning/starters.ts`
- `lib/learning/tailwind-preview.ts`
- `lib/learning/tailwind-project.ts`
- `lib/marketing/availability.ts`
- `lib/marketing/browser-release.ts`
- `lib/marketing/catalog.ts`
- `lib/marketing/practice-hubs.ts`
- `lib/marketing/practice-lessons.ts`
- `lib/marketing/practice.ts`
- `lib/marketing/releases.ts`
- `lib/marketing/site.ts`
- `lib/marketing/tool-links.ts`
- `lib/marketing/tools.ts`
- `lib/marketing/utility-tools.ts`
- `lib/notepad/model.ts`
- `lib/platform/account-config.ts`
- `lib/platform/account-feedback.ts`
- `lib/platform/auth-errors.ts`
- `lib/platform/auth.ts`
- `lib/platform/client.ts`
- `lib/platform/config.ts`
- `lib/platform/console-values.ts`
- `lib/platform/diagnostics.ts`
- `lib/platform/editor-keys.ts`
- `lib/platform/editor-menus.ts`
- `lib/platform/http.ts`
- `lib/platform/json-tool.ts`
- `lib/platform/monaco-client.ts`
- `lib/platform/python-client.ts`
- `lib/platform/python-entry.mjs`
- `lib/platform/python-http-wrapper.mjs`
- `lib/platform/python-http.ts`
- `lib/platform/python-worker.mjs`
- `lib/platform/react-native.ts`
- `lib/platform/redis.ts`
- `lib/platform/remote-languages.ts`
- `lib/platform/runner.ts`
- `lib/platform/sandbox.ts`
- `lib/platform/sql-program.mjs`
- `lib/platform/support.ts`
- `lib/platform/templates.ts`
- `lib/platform/validation.ts`
- `lib/platform/workspace-tools.ts`
- `lib/play/activities.json`
- `lib/play/ai-activities.json`
- `lib/play/backend-activities.json`
- `lib/play/catalog.ts`
- `lib/play/progress.ts`
- `lib/play/sandbox.ts`
- `lib/play/tool-utils.ts`
- `lib/portal-ready/canvas.ts`
- `lib/portal-ready/compress.ts`
- `lib/portal-ready/gestures.ts`
- `lib/portal-ready/rules.ts`
- `lib/portal-ready/vault.ts`
- `lib/rag/core.ts`
- `lib/share-link.ts`
- `lib/studio/angular.ts`
- `lib/studio/background-prepare.ts`
- `lib/studio/bundle-worker.ts`
- `lib/studio/bundler.ts`
- `lib/studio/client.ts`
- `lib/studio/dependency-key.ts`
- `lib/studio/fallback-bundler.ts`
- `lib/studio/fallback-loader.ts`
- `lib/studio/native.ts`
- `lib/studio/node-runtime.ts`
- `lib/studio/observer.ts`
- `lib/studio/preview.ts`
- `lib/studio/project.ts`
- `lib/studio/runtime-assets.ts`
- `lib/studio/runtime-scope.ts`
- `lib/studio/runtime-session.ts`
- `lib/studio/runtime-wait.ts`
- `lib/token-wording.ts`
- `lib/tool-order.ts`
- `lib/tool-schema/drafting.ts`
- `lib/tool-schema/parser.ts`
- `lib/tool-schema/schema.ts`
- `lib/types-studio/convert.ts`
- `lib/utils.ts`
- `next-env.d.ts`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `postcss.config.mjs`
- `public/brand/FONT-LICENSE-DejaVu.txt`
- `public/brand/approved-favicon.svg`
- `public/brand/proposed-logo.png`
- `public/brand/sukoaa-app-icon.png`
- `public/brand/sukoaa-app-icon.svg`
- `public/brand/sukoaa-icon-1024.png`
- `public/brand/sukoaa-icon-128.png`
- `public/brand/sukoaa-icon-16.png`
- `public/brand/sukoaa-icon-256.png`
- `public/brand/sukoaa-icon-32.png`
- `public/brand/sukoaa-icon-48.png`
- `public/brand/sukoaa-icon-512.png`
- `public/brand/sukoaa-icon-64.png`
- `public/brand/sukoaa-mark-black.svg`
- `public/brand/sukoaa-mark-white.svg`
- `public/brand/sukoaa-mark.png`
- `public/brand/sukoaa-mark.svg`
- `public/brand/sukoaa-wordmark-reverse.png`
- `public/brand/sukoaa-wordmark-reverse.svg`
- `public/brand/sukoaa-wordmark.png`
- `public/brand/sukoaa-wordmark.svg`
- `public/favicon.ico`
- `public/favicon.svg`
- `public/play/check-worker.js`
- `public/play/regex-worker.js`
- `public/play/sql-worker.js`
- `public/portal-ready-sw.js`
- `public/rag-worker.mjs`
- `public/runtime/README.txt`
- `public/runtime/backend/fastapi-worker.js`
- `public/runtime/backend/fastapi/annotated_doc-0.0.4-py3-none-any.whl`
- `public/runtime/backend/fastapi/annotated_types-0.7.0-py3-none-any.whl`
- `public/runtime/backend/fastapi/anyio-4.13.0-py3-none-any.whl`
- `public/runtime/backend/fastapi/fastapi-0.136.1-py3-none-any.whl`
- `public/runtime/backend/fastapi/httpx-0.28.1-py3-none-any.whl`
- `public/runtime/backend/fastapi/jinja2-3.1.6-py3-none-any.whl`
- `public/runtime/backend/fastapi/manifest.json`
- `public/runtime/backend/fastapi/markupsafe-3.0.3-cp314-cp314-pyemscripten_2026_0_wasm32.whl`
- `public/runtime/backend/fastapi/pydantic-2.12.5-py3-none-any.whl`
- `public/runtime/backend/fastapi/pydantic_core-2.41.5-cp314-cp314-pyemscripten_2026_0_wasm32.whl`
- `public/runtime/backend/fastapi/sniffio-1.3.1-py3-none-any.whl`
- `public/runtime/backend/fastapi/starlette-1.0.0-py3-none-any.whl`
- `public/runtime/backend/fastapi/typing_extensions-4.15.0-py3-none-any.whl`
- `public/runtime/backend/fastapi/typing_inspection-0.4.2-py3-none-any.whl`
- `public/runtime/backend/laravel.zip`
- `public/runtime/backend/php-worker.js`
- `public/runtime/backend/php/LICENSE.txt`
- `public/runtime/backend/php/php.wasm`
- `public/runtime/backend/versions.json`
- `public/runtime/jsonc-parser-LICENSE.txt`
- `public/runtime/learning/README.txt`
- `public/runtime/learning/pglite-LICENSE.txt`
- `public/runtime/learning/postgres-worker.js`
- `public/runtime/learning/postgres/initdb.wasm`
- `public/runtime/learning/postgres/pglite.data`
- `public/runtime/learning/postgres/pglite.wasm`
- `public/runtime/learning/postgresql-LICENSE.txt`
- `public/runtime/learning/tailwind-LICENSE.txt`
- `public/runtime/learning/tailwind-browser.js`
- `public/runtime/monaco/codicon-LTRFOK3N.ttf`
- `public/runtime/monaco/css.worker.js`
- `public/runtime/monaco/editor.css`
- `public/runtime/monaco/editor.js`
- `public/runtime/monaco/editor.worker.js`
- `public/runtime/monaco/html.worker.js`
- `public/runtime/monaco/json.worker.js`
- `public/runtime/monaco/next-types.json`
- `public/runtime/monaco/react-types.json`
- `public/runtime/monaco/ts.worker.js`
- `public/runtime/python/CPython-LICENSE.txt`
- `public/runtime/python/Pyodide-LICENSE.txt`
- `public/runtime/python/packages/certifi-2026.4.22-py3-none-any.whl`
- `public/runtime/python/packages/charset_normalizer-3.4.7-py3-none-any.whl`
- `public/runtime/python/packages/idna-3.11-py3-none-any.whl`
- `public/runtime/python/packages/manifest.json`
- `public/runtime/python/packages/requests-2.33.1-py3-none-any.whl`
- `public/runtime/python/packages/urllib3-2.6.3-py3-none-any.whl`
- `public/runtime/python/pyodide-lock.json`
- `public/runtime/python/pyodide.asm.mjs`
- `public/runtime/python/pyodide.asm.wasm`
- `public/runtime/python/pyodide.mjs`
- `public/runtime/python/python_stdlib.zip`
- `public/runtime/python/runner.js`
- `public/runtime/python/runner.mjs`
- `public/runtime/react-native-web-LICENSE.txt`
- `public/runtime/react-native.js`
- `public/runtime/react.js`
- `public/runtime/sql/LICENSE.txt`
- `public/runtime/sql/sql-wasm-inline.js`
- `public/runtime/studio/bundle-worker.js`
- `public/runtime/studio/esbuild.wasm`
- `public/runtime/studio/fallback-bundler.js`
- `public/runtime/tokenizers/LICENSE.txt`
- `public/runtime/tokenizers/cl100k_base.js`
- `public/runtime/tokenizers/o200k_base.js`
- `public/runtime/transpile-worker.js`
- `public/runtime/typescript-LICENSE.txt`
- `public/runtime/typescript.js`
- `public/social/sukoaa.png`
- `public/templates/sukoaa-nextjs-starter.zip`
- `scripts/check-seo.mjs`
- `scripts/check-source.mjs`
- `scripts/prepare-api-runtimes.mjs`
- `scripts/prepare-laravel-bundle.mjs`
- `scripts/prepare-learning-runtimes.mjs`
- `scripts/prepare-python-packages.mjs`
- `scripts/prepare-runtimes.mjs`
- `scripts/prepare-tokenizers.mjs`
- `scripts/test-native-web.mjs`
- `scripts/test-platform.mjs`
- `scripts/test-python-browser.mjs`
- `supabase/check-rls.sql`
- `supabase/migrations/001_platform.sql`
- `supabase/migrations/002_sql_json_projects.sql`
- `supabase/migrations/003_compiled_language_projects.sql`
- `supabase/migrations/202611150001_play_progress.sql`
- `tests/accounts.test.ts`
- `tests/ai-tools.test.ts`
- `tests/angular.test.ts`
- `tests/backend-workers.test.mjs`
- `tests/background-prepare.test.ts`
- `tests/compiled-languages.test.ts`
- `tests/console-values.test.ts`
- `tests/data-tools.test.ts`
- `tests/demo-studio.test.ts`
- `tests/diagnostics.test.ts`
- `tests/editor-keys.test.ts`
- `tests/fixtures/interview-v024-question-hashes.json`
- `tests/interview.test.ts`
- `tests/learning-stage.test.ts`
- `tests/marketing.test.ts`
- `tests/next-editor-types.test.mjs`
- `tests/notepad.test.tsx`
- `tests/platform.test.ts`
- `tests/play.test.ts`
- `tests/portal-ready.test.ts`
- `tests/python-http.test.ts`
- `tests/python-sandbox.test.ts`
- `tests/python-worker.test.mjs`
- `tests/python.test.mjs`
- `tests/runtime-startup.test.ts`
- `tests/source-package.test.mjs`
- `tests/sql.test.mjs`
- `tests/studio.test.ts`
- `tests/token-wording.test.ts`
- `tests/tokenizer-workers.test.mjs`
- `tests/tool-schema.test.ts`
- `tests/trust-audit.test.ts`
- `tests/types-studio.test.ts`
- `tests/workspace-repair.test.ts`
- `tsconfig.build.json`
- `tsconfig.json`
- `types/next-production.d.ts`

## Baseline captures

These show the **unmodified** homepage, not the proposed redesign. Framed screenshots were captured at the requested embedded viewport widths; the surrounding grey review area is not part of Sukoaa.

![Unchanged Sukoaa homepage at 375px](SUKOAA-BEFORE-375.jpg)

![Unchanged Sukoaa homepage at 768px](SUKOAA-BEFORE-768.jpg)

![Unchanged Sukoaa homepage at 1280px](SUKOAA-BEFORE-1280.jpg)

## Phase 0 completion and approval gate

Only AUDIT.md may differ from the supplied source. Application, route, CSS, data, test, metadata and asset bytes must match the input archive. Findings and plans are not completed implementation. **Await explicit approval before Phase 1.**


## Phase 3 approved implementation scope (19 November 2026)

Before presentation edits, these long sections are listed for replacement or tightening. Tool-page examples, About sections, FAQs, requirements and all destinations remain. No lesson, exercise, question-bank or code-sample content is rewritten.

| Scope | Files | Planned change |
| --- | --- | --- |
| Tool guides and descriptions | components/marketing/ToolPage.tsx, SiteFrame.tsx; lib/marketing/tools.ts | Plain headings, examples without fake chrome, factual display copy. Preserve metadata and samples. |
| Interview directory hero and methods (over 150 words combined) | components/interview/InterviewDirectory.tsx | Remove decorative sample aside; retain library, methods, employer guidance, backup instructions and links. Compute track counts. |
| Play directory and activity interfaces | components/play/*.tsx; components/learning/TechnicalActivity.tsx | Rewrite wrapper copy and labels only. Preserve grading, activity data and samples. |
| Utility, lab, notepad and Portal-Ready sections | app/tools, app/labs, app/practice; components/notepad, components/portal-ready, components/types-studio | Retain instructions and FAQs; simplify wrapper copy and styling. No long instructional section deletion. |
| Editor chrome | components/studio/StudioWorkspace.tsx; app/workspace/page.tsx | Factual empty states and readable typography. Preserve runtime handlers and preview behavior. |
| Shared presentation | app/layout.tsx, components/layout/documentation.css and existing CSS | Near-white/slate/green, restrained corners, readable typography, focus and touch targets, reduced motion. Keep Monaco and lab contrast fixes. |
| Regex functional exception requested during Phase 3 | app/tools/regex/page.tsx; components/play/RegexPlayground.tsx; lib/play/regex-input.ts; public/play/regex-worker.js; tests/regex.test.ts | Fix worker failure recovery and Unicode zero-width iteration; improve flags, highlights, captures, examples and errors. Keep worker isolation and execution limits. |

About/browser maker facts and cross-site leaked notes remain Phase 4. Dead CSS/assets remain Phase 5. SEO metadata, JSON-LD, routes and dependency manifests are frozen.

## Phase 4 approved scope (19 November 2026)

The user approved Phase 4 after the Phase 3 delivery. The following visitor-facing sections are listed before modification. SEO metadata, JSON-LD, routes and behavior remain protected.

| Files / scope | Current issue | Planned replacement and retained content |
| --- | --- | --- |
| `app/about/page.tsx` (whole article, over 150 words) | Slogan H1; blanket AI-disabled statement; incomplete runtime/progress account of the product; no Maker section. | Factual About Sukoaa article, source-derived catalog totals, execution/storage boundaries, scoped AI disclosure, Maker section using existing repository/contact configuration. Clearly marked placeholders for name, biography and email not present in code; list those questions in CHANGES.md. Retain privacy/contact/repository/practice/tools links. |
| `app/browser/page.tsx` (hero and installation/platform blocks, over 150 words combined) | Illustrative browser mockup, decorative wording, possible implication that connected release links are verified installers. | Plain browser status, same conditional release/download destinations and installation anchor, compact platform instructions. Remove concept artwork. Keep all FAQs and checksum caveats. Do not infer live binary availability, engine/version/signing or updates from this web repository. |
| `app/extensions/page.tsx`, `components/marketing/ExtensionPage.tsx`, `lib/marketing/catalog.ts` (product wrapper sections, over 150 words combined) | Slogans, mock workflows presented as visuals, blanket website-AI statement; unpublished features may appear operational. | Plain directory/details, conditional store-link status, intended-workflow language and real Lucide icons. Remove illustrative mockups. Keep names, SEO fields, store validation/links, FAQs and related-tool destinations. |
| `app/downloads/page.tsx`, `app/publishing/page.tsx` | Slogan titles/eyebrows and implementation-facing release language. | Factual headings and release states. Keep catalog fetching, validation, version/checksum handling, command example and all download destinations. No fabricated checksum or package. |
| `app/contact/page.tsx`, `app/privacy/page.tsx`, `app/security/page.tsx` | Decorative labels and repeated operator-facing setup notes. | Plain headings/contact availability and links. Retain substantive data-flow, retention, security and missing-private-channel disclosures; do not invent a support channel or alter security/auth policy. |
| `app/account/page.tsx` (story/benefit and form-introduction copy, over 150 words combined) | Slogans and decorative feature triplet. | Plain account purpose, exact sign-in/signup/confirmation labels and device/cloud-saving explanation. Keep every form, handler, alert, validation, redirect, service state, export and sign-out control. |
| `app/brand-preview/page.tsx` | Publicly routable decorative hero and nonfunctional mock header/sign-in. | Keep the noindex route and real approved-artwork comparison as a brand reference, using shared chrome. Remove mock controls and slogans. |
| `lib/interview/catalog.ts`, `lib/play/catalog.ts`, `components/learning/LearningDiscovery.tsx`, `components/play/DemoApiDocs.tsx`, `app/demo-api/page.tsx` | Screenshot provenance in round notes; one interface track-description adjective; stale hard-coded interview count and demo-API record counts. | Remove only developer provenance, tighten interface labels, and compute displayed resource counts from actual dataset arrays on the server. Preserve question/activity/exercise code and learning content; keep sample request code and endpoint behavior. |
| Small wrapper notes in `app/workspace/page.tsx`, schema FAQ and Portal-Ready validation error | Changelog-style “this release” wording. | State each current capability/format limit directly. Error condition, error meaning, worker limits, schemas and runtime handlers remain the same. |

### Confirmed source facts and limits

- `app/api/ai/run/route.ts` returns AI_DISABLED and never calls a provider. `app/api/token-wording/route.ts` can call Gemini through `lib/token-wording.ts`, but only in explicitly enabled loopback development; production is rejected. Therefore do not claim all server-mediated AI paths are absent.
- `data/publicReleases.json` is empty. Runtime releases can also come from the existing database lookup; their live contents are not verified in this source-only phase. A configured GitHub release URL is a link, not evidence of an accessible/signed/verified binary.
- No published maker identity or biography is established by source samples or a GitHub account name. Keep explicit placeholders rather than treating sample names as identity evidence.
- User-authored lesson/question/activity/code samples remain protected, including banned-word matches in technical explanations and starter code. Phase 5 owns dead CSS/assets and the final full-repository cleanup.

### Phase 4 resolution and verification

- Replaced the About slogan and blanket AI-disabled claim with source-grounded capabilities and distinct AI/external-service flows. Added requested Maker fields with explicit unknown-value placeholders.
- Removed browser and extension concept artwork; kept conditional release/store destinations, required instructions and FAQs. No package/checksum/engine/identity was invented.
- Reconciled learning and shared-API counts with the actual source arrays. Current exercise/activity/question totals are 19 / 90 / 100; the shared API has nine resources. Kept operational limits separate from catalog totals.
- Updated exactly one expected-copy assertion in `tests/interview.test.ts`, preserving all supplied-question, round and behavior checks. See CHANGES.md for the exact assertion and reason.
- Metadata, JSON-LD, existing event handlers, routes, APIs, compilers, question banks and educational code remain protected. The scoped data/error-text exceptions are documented above and compared separately.
- Node 24 typecheck, 297 tests and production build passed. Static browser review covers eight page types at 375/768/1280px; dynamic extension/download route visual execution remains unverified in that harness. Screenshots and evidence accompany the full package.
- Phase 5 is pending. Remaining Maker questions: public name, factual biography, public contact email. No live deployment has occurred.


## Phase 5 approved scope (19–20 November 2026)

The user approved final cleanup and supplied a replacement orbital/circuit logo. These blocks are listed before modification or deletion.

| Files / scope | Evidence and planned action | Preservation boundary |
| --- | --- | --- |
| `components/Home.tsx`, unreachable dialog (over 150 words), modal state, inline worker and two unused starter strings | No rendered control calls `openTool`; remove the unreachable dialog/worker and unused imports. | Keep rendered homepage, examples, filters, favorites, FAQ, counts and reachable actions/destinations. |
| `components/play/LearningTools.tsx` | `/tools/regex` uses `RegexPlayground`; only JSON Studio/Text Compare use LearningTools. Remove unused regex alternative. | Keep JSON/text functions and dedicated regex implementation, worker and tests. |
| `app/globals.css`, marketing/learning-discovery/brand-preview CSS | Remove individually proven unused homepage, mock-browser/extension and obsolete brand-reference selectors. | Keep dynamic editor/vendor/diagnostic classes, responsive geometry, Monaco/lab contrast, focus, touch and reduced motion. |
| Logo, shared header/footer, brand reference, public branding assets | Use original supplied PNG through SVG viewports, navy chrome and light work surfaces. Remove obsolete unreferenced variants. | Preserve metadata, JSON-LD and their existing image URLs. No artwork ownership/legal clearance claim. |
| Interface icons/copy and learning navigation | Remove unreferenced LearningMenu and decorative UI arrow glyphs; use installed Lucide for Notepad task/chevron and native back controls. | Preserve handlers, routes, educational/question/sample data, API contracts, title separators, SEO About/FAQ sections and Maker placeholders. No long instructional section is deleted. |

### Phase 5 resolution

- Applied exact supplied orbital/circuit PNG to shared chrome and existing logo/social/favicon URLs. Navy header, light work surfaces and dark-teal controls; metadata/JSON-LD URLs unchanged.
- Removed documented unreachable homepage dialog, unused regex alternative, unreferenced learning menu, 392 unused selectors and 19 obsolete assets. No long instructional/SEO About/FAQ section was deleted. Kept historical license and dynamic editor/vendor rules.
- Raw final vocabulary scan retains 18 lines only in protected samples/learning data or the intentional demo-error label. Legitimate release/draft/placeholder terminology and requested Maker placeholders remain. Full scans/exceptions accompany delivery.
- Recovered source after workspace restart, then reran Node 24 typecheck, all 297 tests and production build. No Phase 5 test assertion changed. Protected library/API/data/database/script/runtime bytes, metadata, JSON-LD, all route files and configuration remain unchanged.
- Fresh before/after homepage captures at 375/768/1280px embedded widths. Twenty-one width checks showed no horizontal page overflow. Navigation/search/filter/favorites and regex/JSON/text/JavaScript smoke checks were exercised. CHANGES.md describes the static harness and exact limits.
- Source only, no GitHub push/deployment. Maker identity/biography/public email remain unresolved; supplied artwork carries no claimed legal clearance.


## System design course addition · 20 November 2026

Added `/learn/system-design` and 25 lesson URLs, preserving the supplied image topic order. Each original lesson includes beginner and engineering explanations, a six-stage narrated animation, implementation sketches, worked examples, interview prompts/reference answers, an exercise and a knowledge check. There are 25 H.264/AAC videos (about 29 minutes total), 150 caption chapters, 50 interview prompts, 25 exercises and 25 checks. Progress and notes stay in browser storage with JSON backup/merge. Links were added to Learn, Search and the homepage; new URLs join the existing sitemap mechanism. Existing compiler, auth and API source was not changed.

The English voice is computer-generated locally with Flite SLT. Media uses no source-image portrait/music/footage. Full transcripts and a Markdown handbook are provided. The separate offline HTML edition needs no npm/server/account; persistent notes/timer/progress controls belong to the integrated edition. See `docs/31-SYSTEM-DESIGN-COURSE.md` for scope, reproduction, privacy and exact verification limits.

Validation: Node 24 typecheck, 301 passing tests, production build; all 25 video/audio tracks decoded without errors. Browser interaction, playback, persistence, backup export and responsive course/lesson layouts passed. Browser import confirmation could not be accepted due to an automation-driver timeout; restore was not claimed as end-to-end verified. Import shape/bounds/merge tests pass. Existing tests were preserved; only a new import and four additional tests were added. No previous slogan assertion was altered.

No deployment or GitHub push was performed. Publish the updated project through the existing repository/Vercel workflow.


## Green header and transparent logo · 20 November 2026

Set the shared website/editor header background to the requested `#134741`. Added `public/brand/logo-transparent-v1.png` and switched `SukoaaLogo` to that asset with a transparent wrapper. Retained the white wordmark, turquoise circuit symbol and existing viewport sizing. Updated matching menu colours, the existing footer logo plate, brand reference preview and the embedded favicon. Original artwork and all metadata/canonical/structured-data definitions are retained.

Validation: Node 24 typecheck, 301 passing tests, production build, and browser checks at 375/768/1280 px. Computed header RGB is 19/71/65; logo wrapper RGBA is 0/0/0/0. No horizontal overflow. Mobile navigation and editor header verified. No existing tests or compiler/auth/course implementation were changed. See `docs/32-HEADER-BRANDING.md`. Source prepared for the owner to push/redeploy; no live deployment was performed.

## File and data tools addition · 20 November 2026

| Files | Treatment |
| --- | --- |
| app/tools/data-workbench/page.tsx and five workbench tool routes | New directory and task-specific utilities; no existing routes or target keywords replaced. |
| components/workbench, lib/workbench | Scoped layout, bounded imports, meaningful error states, export actions, reusable cleaning recipes, ID comparisons, image processing, PDF page assembly and synthetic fixture generation. |
| Home, Tools index, CommandPalette, lib/navigation.ts | Add discovery links while retaining existing destinations and compiler behavior. |
| lib/marketing/site.ts | Add new URLs through the existing sitemap list. Existing canonical rules are retained. |
| package.json, package-lock.json, scripts/prepare-workbench.mjs, public/workbench/pdfjs | Install missing document libraries and self-host PDF assets. Existing compiler runtime preparation remains. |
| tests/workbench.test.ts, tests/platform.test.ts | Add behavioral tests and one import. No existing test removed, weakened or assertion rewritten. |

No existing section longer than 150 words was removed. No new hard-coded marketing count is introduced: the directory count comes from workbenchTools. Claims are bounded by file/memory limits, values-only workbook import, unsupported PDF forms/encryption and non-guaranteed image compression. Files do not upload; normal website asset requests still occur. No deployment is performed. Final package verification limits are documented in docs/33-FILE-AND-DATA-TOOLS.md.

## Requested homepage visual restoration · 20 November 2026

The owner explicitly requested the earlier layered browser/editor composition on the homepage's right side. This is a bounded exception to the earlier instruction to remove illustrative mockups. The actual H1, intro copy and compiler CTA are preserved. No section is deleted or rewritten.

| Files | Treatment |
| --- | --- |
| components/Home.tsx | Wrap the existing intro copy and add HomeIntroVisual as its sibling. |
| components/HomeIntroVisual.tsx | New decorative, aria-hidden composition with current Sukoaa artwork and existing Lucide icons; no fake interactive controls. |
| components/home-extra.css | Homepage-only responsive grid and scoped browser/code composition styles. Stacks below copy at 800 px and narrower. |
| docs/34-HOMEPAGE-WORKSPACE-VISUAL.md | Installation, design exception and verification scope. |

No additional hard-coded product count, external dependency or backend change. Browser checks at 375/768/1280 px found no document overflow; existing Data/All tools filters work. Typecheck, 322 tests and production build pass. Existing tests and SEO definitions are retained. No live deployment performed.

Homepage discovery follow-up: Data filtering derives membership from workbenchTools so all five file/data utilities appear, retaining each primary category and avoiding duplicate cards. Counts continue to derive from the filtered array.


## Learning course follow-up — 22 November 2026

The GenAI course and refreshed system-design course are documented in docs/36-GENAI-PREPARATION.md and docs/35-SYSTEM-DESIGN-REFRESH.md. New course styles reset a legacy unscoped header rule only inside the new course. Existing route metadata, compiler functionality and question banks were retained. Current checks: 336 tests, type checking and production build pass; 25 media files decode and meet the documented audio-level range. New counts are derived from lesson data. Browser checks at three widths found no document-level horizontal overflow after the scoped fix. These checks do not assert subjective audio quality or guarantee interview outcomes.
