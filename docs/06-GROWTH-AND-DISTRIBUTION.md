# Grow Sukoaa through useful workflows

## First audience and launch sequence

Start with frontend developers who want quick, installation-free examples and a few practical browser tools. Your React/Angular background is an advantage for this audience. A visitor should accomplish a task before being asked to create an account.

1. **Private beta:** launch the browser playgrounds, validate local saving/export and mobile layout with real users, attach reviewed browser/extension downloads, and collect concrete usability feedback. Do not invent usage numbers or testimonials.
2. **Persistent workspace:** connect Supabase and Redis, complete auth/RLS tests, add self-service password reset, account deletion/export and proper privacy/contact information. Improve project pagination and add versioned templates based on actual demand.
3. **Measured remote execution:** connect Python/Go for a small authenticated cohort. Add provider quotas, concurrency accounting, spending alerts, queueing and result retention policy before increasing limits.
4. **Useful shareability:** add explicit opt-in public snippets with separate public-read policies, abuse reporting and revocation. The current projects are private; changing a URL must not accidentally publish code.
5. **AI release later:** begin with one bounded action, such as explaining a compile error or writing tests for a selected function. Show exactly what code is sent and require deliberate user action. Add token/spend quotas, cancellation, model selection, redaction and evaluation. The current /api/ai/run intentionally does none of this.
6. **Team/business features only after demand:** organizations, role-scoped shared projects, billing, audit events and enterprise controls. Do not replace single-owner RLS with team sharing without a migration/security review.

## Distributing your browser and extensions

The website project is separate from your existing browser/extension source. No Windows setup.exe, APK, or extension binary is bundled here.

1. Build the actual product from its own repository and complete its release checks.
2. Host a versioned installer/archive on a suitable release host/CDN. Use publisher signing for installers where appropriate and marketplace distribution for extensions.
3. Calculate SHA256. On Windows PowerShell: `Get-FileHash .\YOUR_FILE.exe -Algorithm SHA256`. Use the matching command for APK/ZIP files.
4. Promote your Sukoaa account through SQL, sign in, open /admin and enter title, version, platform, HTTPS URL and checksum. Leave Published unchecked for a draft or check it to show it on /downloads.
5. Verify the final download, file size, platform and checksum on a real device. Never replace an existing versioned file with different bytes; publish a new version.
6. Future work: signed update manifests, release-channel selection, automated checksum upload, installer signing pipeline and CDN bandwidth monitoring. The current admin UI adds/lists releases only; edit/unpublish can be done by an authorized database administrator until an audited edit workflow is added.

## Operating at increasing traffic

Use CDN caching for immutable public assets, shared Redis rate limits, and stateless web/API instances. Keep per-user responses out of public caches. Measure actual bottlenecks before splitting services. At significant remote-execution traffic introduce a queue, authenticated worker-to-runner communication, hard concurrency quotas, job cancellation and an isolated execution fleet. Use object storage for larger archives; keep relational metadata in PostgreSQL.

Useful early measurements: successful first run, repeat use, time to first output, save/export success, error rate, p95 runtime, provider compute per active user and cost per retained user. Add privacy-conscious analytics only after documenting collection and retention. No analytics is installed in this release.

This structure supports growth, but it does not promise a user count or unlimited free operation. Growth comes from solving a clear task well, listening to users and keeping reliability/costs measurable.
