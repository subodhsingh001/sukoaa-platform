# Sukoaa publishing and SEO — v0.4.0

This release prepares the website for distribution and discovery. It does not publish an extension to Chrome Web Store, create browser installers, upload an application binary, verify a Search Console property, or promise a Google ranking. No actual Chrome listing or public installer URL was supplied, so those links are intentionally absent until you connect them.

## 1. Update your Vercel project

Keep your existing .env.local and Vercel credentials. Copy the updated source into your Git checkout, review the changes, and push them to the repository already connected to Vercel. Do not commit node_modules, .next, .env.local or ZIP archives.

Use Node 24.x, Framework Next.js, install `npm ci --include=dev`, build `npm run build`, and default Output Directory. next.config.ts now disables standalone output on Vercel to avoid the reported Next 16.3 adapter/NFT manifest error, while retaining standalone output for Docker. Docker uses Node 24 as well. No dependency upgrade or database migration is needed for this update.

After choosing your real primary domain, add these **Production** environment variables in Vercel and redeploy:

```
APP_ORIGIN=https://YOUR-ACTUAL-DOMAIN
SITE_URL=https://YOUR-ACTUAL-DOMAIN
SITE_INDEXING_ENABLED=true
SUPPORT_EMAIL=YOUR-PUBLIC-SUPPORT-ADDRESS
```

Replace every placeholder. SITE_URL must be an HTTPS origin without a path, credentials, query parameters, or fragment. APP_ORIGIN also remains the origin used for server request checks. Update Supabase Site URL/confirmation settings when changing domains. Choose either www or the apex as the primary address in Vercel; redirect the other there.

Without a valid canonical origin and explicit SITE_INDEXING_ENABLED=true, indexing is disabled. Vercel Preview deployments are noindex even when indexing was enabled in another environment. The owner-private ChatGPT preview remains private; its publication is not a Google-indexable replacement for your public Vercel deployment. Auth, workspace, Studio, setup and admin pages have noindex metadata. This does not replace access control.

## 2. Connect your Chrome extensions

For each extension, use the actual tested Manifest V3 extension ZIP, not this website ZIP. manifest.json must be at the extension ZIP root. Register/sign in to Chrome Developer Dashboard, upload the item, complete listing screenshots and support/privacy information, justify permissions, choose Public distribution, and submit for review. New publisher item limits and account requirements are shown in the dashboard. Do not claim approval before the listing is live.

Copy the published Chrome Web Store detail links into these Vercel Production environment variables:

```
CHROME_STORE_QUICK_REPLIES_URL=
CHROME_STORE_WEB_PDF_STUDIO_URL=
```

Supply full `https://chromewebstore.google.com/detail/.../<extension-id>` URLs. A valid extension ID is 32 characters from a–p. The app deliberately rejects another host, HTTP, credentials, tracking queries and malformed IDs. Paste the canonical listing URL without query parameters. Redeploy after updating environment variables.

These links control Add to Chrome buttons on /extensions, the dedicated product pages, and /downloads. A syntactically valid link is not proof that Google approved a listing: open the actual URL and confirm the publisher/product before setting it. Unconfigured or invalid links display an awaiting-listing status.

The product-page visuals are explicitly labeled concept illustrations. Replace them with real screenshots from tested releases when you have them. Page copy is introductory; verify and refine feature claims against each released extension. The website privacy summary is not an extension-specific policy. Complete the correct data-use, permissions, contact and retention disclosures for each extension before submission.

Official: https://developer.chrome.com/docs/webstore/publish
Privacy fields: https://developer.chrome.com/docs/webstore/cws-dashboard-privacy

## 3. Connect browser installer downloads

A browser application is distributed separately from an extension. Build and test the Windows installer/Android package, then publish the intended binary as a public GitHub Release asset or an equivalent HTTPS download. A private GitHub release will not give anonymous visitors a working download. Do not place large binaries in the Next.js source tree. Include architecture, version, release notes, installation guidance, publisher-signing status and license/notices that apply to the actual software.

Generate the hash of the actual file on Windows:

```powershell
Get-FileHash "C:\Downloads\your-installer.exe" -Algorithm SHA256
```

Configure Supabase and Upstash as before. Promote only your own administrator account through the database-owner SQL operation in docs/04. Sign in at /account and open /admin. Enter product title, version, platform, public HTTPS asset link and the 64-character SHA256. Tick Publish to display it in /downloads. The manager records a link; it does not upload or scan the file. Checksums do not replace signing or security review. Test the download in a signed-out browser after publishing it.

No browser or extension binaries were created or submitted by this website change.

## 4. Submit your public site to Google

1. Open https://search.google.com/search-console and add your actual domain property.
2. Google supplies a DNS TXT verification record. Add that exact record at your registrar and complete verification. Do not change unrelated email or website DNS records.
3. Alternatively, URL-prefix verification can use an HTML tag. Put just its verification token in GOOGLE_SITE_VERIFICATION and redeploy. The root metadata emits the verification tag.
4. Open your deployed /robots.txt. With indexing enabled, it should allow public crawling and point to your actual domain's /sitemap.xml.
5. Open /sitemap.xml. It should list the homepage, product/tool pages, downloads, privacy and installation guide, with your canonical domain. It should not list /admin, /account, /api, /studio or /workspace.
6. Submit `sitemap.xml` in Search Console → Sitemaps.
7. Use URL Inspection on /browser, both extension pages, and the actual tool landing pages. Request indexing when available and check the reported canonical.
8. Track real queries, impressions and clicks over time. Improve useful content based on that evidence. Indexing, rich results, position and timing are not guaranteed.

## What the source implements

- Server-rendered product and tool descriptions with real internal anchors.
- Page-specific titles/descriptions and canonical URLs from SITE_URL/APP_ORIGIN.
- Open Graph/Twitter image at /social/sukoaa.png (1200×630).
- app/sitemap.ts and app/robots.ts with production opt-in.
- Organization/WebSite and breadcrumb JSON-LD. Browser-local tools include SoftwareApplication/WebApplication facts and free offers. Pending extensions do not advertise a software download in structured data until a store URL exists. No fabricated ratings, reviews or testimonials.
- Downloads rendered from public release metadata with HTTPS/checksum validation and clear empty/unavailable states.

Software markup can help search engines understand a page. The properties in this release do not guarantee eligibility for a Google software rich result. Add review/rating data only if you actually have it and meet Google's rules.

## Growth content to add after real releases

Record an honest short demo for each product. Add release-specific screenshots, a changelog, troubleshooting answers and practical tutorials. Start with focused needs such as reusable Chrome replies or testing React imports, rather than expecting a new site to rank immediately for broad terms. Seek relevant links and feedback from actual users; do not buy reviews or publish repetitive thin pages.

## Verification limits

Automated checks cover indexing gates, safe canonical origins, sitemap exclusions, store URL validation, JSON-LD escaping and release link/hash checks, alongside existing platform tests. Native Next.js build checks are separate from a real Vercel adapter deployment, Chrome review, signing, live Supabase/Redis connectivity, real installer downloads and Google indexing. Those account/provider-specific steps must be checked in your deployment.
