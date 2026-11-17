# Sukoaa source audit and remediation — 17 November 2026

## Verdict and scope

The supplied audit is a useful prioritization document. Its unverified security questions are not evidence of vulnerabilities. This follow-up inspected the uploaded source and lockfile, ran local regression checks and production builds, and exercised new browser workflows. It did not inspect production Supabase policies, Vercel secrets, real runner isolation, provider logs, SEO rankings or real accounts. There is no defensible numeric security score from these checks.

## Findings and action

| Priority | Finding / exact evidence | Action / remaining limit |
| --- | --- | --- |
| Critical dependency advisories | package-lock.json; original Next 16.3.4, yaml 2.8.1, zod 3.25.76 and transitive DOMPurify 3.4.15 were reported by npm audit. | Updated to Next 16.4.6, yaml 2.9.1, zod 4.6.7 and DOMPurify override 3.4.18. `npm audit --omit=dev` reports zero known production vulnerabilities on the updated portable lockfile. This is not proof of application security. |
| High operator readiness | app/privacy/page.tsx:3, app/contact/page.tsx; no real private contact supplied. | Added configurable public support/security contacts, /security and conditional /.well-known/security.txt. Owner must provide monitored addresses. No fabricated inbox or pretend account-deletion service. |
| High data lifecycle | app/api/account/export/route.ts:2; components/AccountDataTools.tsx; app/privacy/page.tsx:3. | Added authenticated owner-filtered cloud export and account UI. Documented local/cloud/demo/runner/session data flows and application TTLs. Full account deletion and actual provider backup/log retention remain operator tasks. |
| High execution boundaries — review required | lib/platform/runner.ts:25 sends CPU/wall/memory/process/file limits and network disabled; lib/platform/http.ts:13–18 checks same origin; lib/platform/auth.ts:26 uses authenticated identity and quotas. | Existing controls retained. Tests do not establish that the remote provider enforces limits. Verify the actual runner and live RLS with two non-production users before broad launch. |
| High ownership — regression coverage | app/api/projects/[id]/route.ts:3–6 filters id and owner; app/api/projects/route.ts:2–3; tests/trust-audit.test.ts. | Added cross-owner not-found and scoped-export regression coverage. Mocked transport tests do not replace testing deployed database row policies. |
| Medium download trust | lib/marketing/releases.ts:4–11; app/downloads/page.tsx:3; data/publicReleases.json. | Validated release shape, HTTPS URL and SHA256; added reviewed-file fallback and explicit empty/unavailable statuses. No actual browser artifact was verified. Populate only reviewed version/platform/link/checksum records. |
| Medium tokenizer reliability | components/tools/TokenCounter.tsx; scripts/prepare-tokenizers.mjs; tests/tokenizer-workers.test.mjs. | Replaced broad per-keystroke import failure handling with self-hosted dedicated workers, debounce, timeouts, retry, Unicode-safe display and explicit input limit. Browser produced 13 tokens for the displayed 49-character sample. |
| Medium product consistency | components/Home.tsx:58–69; lib/marketing/availability.ts; lib/marketing/site.ts:16. | Retained code/learning-focused homepage, completed account-free FAQ, routed card launch buttons to descriptive tool landing pages and removed internal provider names from visitor FAQ. Existing availability/noindex filtering retained. |
| Medium sensitive local records | lib/portal-ready/vault.ts; components/portal-ready/ExamChecklist.tsx. | IndexedDB only, bounded validated backups, conflict checks, plain-text warning; no image/ID uploads. Local device access is not encryption. |
| Medium maintainability | Many existing pages/routes are long single-line implementations, e.g. app/workspace/page.tsx and components/Home.tsx. | Not rewritten wholesale during a feature/reliability release. Follow-up: extract runtime/session orchestration into bounded modules with behavior tests; format touched modules incrementally. |

## Verification

- 237 local automated tests passed, including browser-runtime smoke tests, tokenizer workers, formatter core rules and account ownership/export regressions.
- Portable TypeScript check and Next production build passed; hosted native build passed.
- Browser checks confirmed a real PNG upload and a 413×531 JPEG output of 52,439 bytes, with all three technical checks passing; local checklist saved and reopened with 1/5 progress. A 233,700-byte A4 PDF was also generated, passed all checks and downloaded through the browser.
- Production dependencies: zero known advisories reported after updates. Re-run audit during every dependency upgrade; the result is time-specific.
- Not established: full offline networking behavior, real user account deletion, live RLS, cross-origin sandbox escape resistance, production runner limits, mobile device speed, Core Web Vitals, backlinks or ranking.

## Next release gates, in order

1. Owner: configure monitored private support/security channels and operational account-deletion workflow. Confirm provider retention and publish truthful details.
2. Owner: test real deployed RLS with two test users; ensure browser bundles contain no privileged keys. Verify only publishable Supabase keys reach clients.
3. Operator: isolate and resource-limit any external execution provider; test timeout, network denial, quotas and cleanup in a staging environment. Do not run arbitrary code in Vercel handlers.
4. Publish reviewed installers and checksums; remove any unavailable product promises. Verify download availability independently of the catalog.
5. Run physical phone/tablet usability and performance checks. Keep heavy runtime startup user initiated.
6. Review authentication flows and sandbox boundaries with a focused security assessment. Add CI checks before merging further platform features.

No ranking or indexing guarantee is made. Search Console requests, canonical verification and real user usefulness remain separate from these source changes.
