# Sukoaa v0.22.0

## Run and deploy

Use Node.js 24.x. From the folder containing package.json:

```sh
npm ci --include=dev
npm run test
npm run build
npm run dev
```

Open `/portal-ready` or Tools → Photo & Document Tools. The token counter is at `/tools/token-counter`. Both work without account credentials. Runtime preparation runs automatically during install and build; `npm run prepare:runtimes` rebuilds the self-hosted workers if needed.

For Vercel: push this complete source to your repository, use the Next.js preset, Node 24.x, install `npm ci --include=dev`, build `npm run build`, and leave Output Directory at its default. Keep package-lock.json committed. Set APP_ORIGIN and SITE_URL to `https://www.sukoaa.com`; enable SITE_INDEXING_ENABLED only for your production canonical deployment. Preview deployments should remain noindex. Redeploy after changing environment values. This ZIP does not itself update your personal GitHub or Vercel deployment.

## Formatter scope

Crop/fill or contain, rotate, zoom, position, custom pixels, JPG quality search, optional signature cleanup, optional document contrast, custom name/date strip and one image to an A4 PDF. No image, name or date is uploaded. PDF code loads when PDF is prepared. No AI or ads are included. Exact encoded dimensions, MIME type and final bytes are checked; portal acceptance and visual suitability are never guaranteed. If a minimum size cannot be reached, the file is honestly labelled rather than padded.

Only the IBPS PO/MT-XVI photo/signature presets are source-checked against the linked 2026 notice. Other templates are custom starting points. Read the notice for your exam cycle; a formatted upload does not replace required live capture.

The exam checklist stores records in this browser's IndexedDB. It is not encrypted. Do not save passwords, Aadhaar numbers or document images. Backup exports contain the entered IDs in plain text. Optional offline caching stores only formatter pages/static assets; prepare a PDF once online before expecting its library offline. A fully disconnected reopening test was not performed in this release.

## Trust setup still required from the owner

Set SUPPORT_EMAIL and SECURITY_EMAIL to real, monitored addresses in Vercel. They are public contact addresses, not SMTP credentials. Security falls back to support when only that is set. No address is invented. Full account deletion remains operator-assisted, not self-service. Document the actual Supabase/hosting/runner log and backup retention before accepting broad registrations. Account → Export my cloud data exports application-owned cloud projects and learning progress; use each local tool's separate backup control too.

Publish actual release records in Supabase or data/publicReleases.json only after checking artifact availability, exact version/platform and SHA256. An empty catalog intentionally shows an honest status; a repository link is not a verified installer.

See docs/30-SOURCE-AUDIT.md for completed source fixes, evidence and remaining release requirements.
