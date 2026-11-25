SUKOAA — SEO CRAWL FIXES
24 November 2026

This update is prepared in the project source. Redeploy it to apply the changes
to https://www.sukoaa.com. It has not changed the live website by itself.

WHAT CHANGED

1. Pagination interview question's PostgreSQL link:
   /tools/postgresql -> /labs/postgresql. No route added or removed.
   Related-tool buttons now name the actual destination on all 100 questions.

2. Distinct guidance for Portal-Ready and Custom Photo, retaining the formatter,
   presets, cropping, exports and existing application limits/FAQ sections.

3. Clear production token-counter description/help. Development-only disclosures
   remain in local development. Legacy JSON-LD description is separately retained
   to honor your no-schema-change guardrail. AI APIs and consent gates unchanged.

4. All 40 GenAI lessons include their existing Engineering/Interview/reference
   content in the server HTML. Inactive sections and answers remain hidden until
   selected/revealed. Interactive labs still mount only when their tab is selected.
   Lesson data, practice tasks, answers and code samples are unchanged.

5. Server-rendered instructions for JSON Studio and Text Compare: comparison
   behavior, examples, limits, copying, exports and privacy, based on actual code.

6. Stable Daily Coding Challenge search description, without changing rotation.

7. Recorded per-page sitemap revisions: 152 changed pages use 24 November;
   199 unchanged pages retain 18 November. Only the existing daily challenge
   follows its real UTC daily content change. Sitemap refreshes hourly.
   Invalid date overrides are ignored; no automatic whole-site build timestamp.

8. Same approved logo with smaller delivery:
   Header: 956,829 bytes -> 152,542-byte WebP (84% smaller).
   PNG fallback: 299,659 bytes. Existing PNG URLs remain valid.
   Organization/social PNGs: 2,007,705 -> 1,234,503 bytes each.
   Alpha and visible RGB colors are preserved. Size/crop/appearance retained.
   Homepage Open Graph dimensions now match its actual 1536 x 1024 image.

9. Maker: your preferred name Subo, factual React/Angular/Next.js developer bio
   and existing GitHub link. No support email was invented.
   Private support remains unavailable until you create a monitored inbox.
   Privacy no longer promises a missing account-deletion contact. Date updated.

10. Literal Windows path separators fixed in the checksum example.
    Downloads introduction/search description accurately describe availability.
    The release catalog/store links still require publisher configuration.
    This update does not create installers or store listings.

PRESERVED AND VERIFIED

Existing page routes, public sitemap URLs, titles, H1s, canonicals and JSON-LD.
Existing tools, runtime/API/authentication behavior, question/lesson content.
No existing tests deleted or weakened. Related-tool assertion now checks actual
registered public routes instead of accepting any string starting /tools/.

Node.js 24.22.3.
npm run typecheck: passed.
npm test: 339 passed, 0 failed, 0 skipped.
npm run build: passed.
Protected fields compared across 367 static HTML outputs and all 351 public
HTTP pages, including the three public pages rendered dynamically.
All 351 public titles and descriptions are unique.
354 local production HTTP checks, including robots/sitemap/new image: all 200.
The full sitemap URL set matches the original crawl.

Chromium launch was blocked here. No new 375/768/1280 screenshots, screen-reader
review or interactive browser certification is claimed.
The original live crawl reports remain historical pre-deployment snapshots.

INSTALL THE PATCH

Back up or commit your current work.
Open Sukoaa-SEO-Crawl-Fixes.zip.
Copy the CONTENTS of its sukoaa-platform folder into your existing project root
(next to package.json) and replace matching files.
Do not create a second sukoaa-platform folder inside the existing project.
No node_modules, build output, credentials or secrets are included.
Dependencies and lockfile are unchanged.

Alternatively, the updated full Sukoaa-Platform-Design-Phase5.zip contains the
complete source with the same changes.

COMMANDS — RUN FROM YOUR PROJECT ROOT USING NODE 24

npm ci
npm run typecheck
npm test
npm run build

If dependencies already match the unchanged lockfile, npm ci can be omitted.
The existing build command prepares runtime/workbench assets.

PRODUCTION SETTINGS IN VERCEL

SITE_URL=https://www.sukoaa.com
APP_ORIGIN=https://www.sukoaa.com
SITE_INDEXING_ENABLED=true

Leave SUPPORT_EMAIL and SECURITY_EMAIL empty until you have real monitored
inboxes. Never publish sample addresses.

SITE_LASTMOD is optional. Leave it unset for recorded per-page dates.
Set it only for a real whole-site content revision, never to today on every build.
Per-page revisions are recorded in lib/marketing/content-updates.ts.

Keep preview deployments excluded from indexing. VERCEL_ENV is supplied by Vercel.

PUSH AND REDEPLOY

Use your normal Git/Vercel deployment workflow.
Suggested commit message:

fix: address SEO crawl findings and improve tool documentation

AFTER DEPLOYMENT

Check /, /tools/token-counter, /tools/portal-ready,
/tools/portal-ready/custom-photo, /learn/gen-ai/rag and /play/daily.
Follow the pagination question's PostgreSQL link.
Check /sitemap.xml and /robots.txt.
Run the existing launch check:

npm run seo:check -- https://www.sukoaa.com

This command checks launch pages, not every tool's functionality.

In Google Search Console, inspect representative changed URLs. Confirm live
fetch/rendering, canonical selection and the actual indexing status.
Keep the existing sitemap registered; request indexing selectively for important
updated pages. There is no guaranteed indexing/ranking outcome or required
keyword-density percentage.

STILL REQUIRES YOUR ACTION

- Create a monitored support inbox, configure SUPPORT_EMAIL and optionally
  SECURITY_EMAIL, then redeploy. Private support/deletion contact remains
  unavailable until then.
- Configure the real release catalog/store links when distributing installers.
- Deploy this source update and confirm Google Search Console results.
