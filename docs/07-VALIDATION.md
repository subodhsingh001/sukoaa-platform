# Validation record — 31 October 2026

## Automated

The platform's 44 unit/security/diagnostic/project checks use mocked Supabase/Redis/provider responses and do not contact production accounts. Run `npm test` to repeat them. They cover origin rejection, streamed request size limits, language/source validation, Unicode runner transport, missing-runner errors, script closing-tag escaping, disabled AI with zero provider calls, fail-closed production behavior without Redis, atomic Redis counter enforcement, forged-cookie rejection, database-role enforcement and missing-Redis remote execution rejection.

The delivery process additionally runs TypeScript checking and production builds. The portable project is a standard Next.js app; the published ChatGPT preview uses Vinext. Record final build and browser results in RELEASE-STATUS.txt at the repository root.

## Browser checks

Exercise JavaScript output, TypeScript output, the React interactive counter, HTML click behavior, local draft save/restore, and explicit setup errors for inactive runtimes. The UI must not claim Python/Go is active without configuration, or present the Next.js starter as a hosted IDE.

## Not claimed as verified here

No real Supabase user, SMTP configuration, Postgres migration execution, Redis database, Judge0 subscription or external GitHub/Vercel deployment was created in this session. Live RLS, signup/confirmation, token rotation, cloud project CRUD, multi-instance limits, real Python/Go sandboxing, container startup and installer downloads need tests in your configured staging environment. No load-testing, penetration-test certification or physical mobile-device certification is claimed.

Before a public launch, follow the two-account/RLS and provider checks in docs/04 and docs/05. Confirm current dependency/security advisories, provider plan eligibility and privacy/contact details.

## Inline diagnostic update

JavaScript syntax/runtime errors now carry source locations, TS/TSX runtime errors use source-map mappings, editor lines/gutter numbers highlight red, and diagnostic buttons focus the matching position. Ten additional tests cover original compiler positions, JS-only syntax restrictions, JSX, mappings, invalid/missing positions and Python/Go error parsing. HTML inline-JavaScript errors are reported when browser ErrorEvents provide positions; CSS syntax is not linted. Error highlights clear on edits and new runs.

## Project Studio update

44 automated tests cover multi-file builds, original-source mappings, missing imports, file/folder rename, import rewriting, path/secret rejection, ZIP size checks, response bootstrap isolation and existing platform guards. Browser tests confirm the imported React counter, mock fetch status/timing/source labels, console capture, folder/file creation, rendering a newly imported component, and editor/runtime error positions in that imported file. The exact Next.js Studio starter passes a real local Next.js webpack production build with its API route. WebContainer boot and browser-hosted npm/dev-server were not verified because the managed browser's HTTP preview is not a secure context. External npm CDN packages and real third-party API CORS behavior are not claimed as live verified.

0.3.1 adds worker URL/cancellation, static asset validation, Pages/App starter selection, error deduplication and stale directory cleanup tests. React worker and fallback were browser-tested. The Pages Router starter builds on native Node. Native Next.js browser preview QA is limited by the managed preview adapter; WebContainer execution is also unverified because its QA host is HTTP.

## Browser Python update — 3 November 2026

- 61 automated checks passed, including real Pyodide/CPython execution, Unicode and multiline input, SyntaxError line/column, nested runtime tracebacks, EOFError, fresh user globals, SystemExit, sandbox markup escaping, separate load/execution deadlines, output limits and late-message handling.
- TypeScript `tsc --noEmit` passed.
- Production Sites build passed.
- The preview daemon returned its URL but that URL was unreachable from the test browser (connection refused; HTTP probe returned 503). Browser preview QA is unverified; no success is inferred from the Node runtime checks.
- The deployed site remained behind its existing ChatGPT sign-in gate. Automated approval review blocked entering the authentication origin, so signed-in browser execution was not verified.
- No live Judge0 service was provisioned; Go remains configuration dependent. AI stays disabled.

## Python startup fix — 3 November 2026

The runtime JavaScript is now bundled into a self-contained module worker. It no longer imports separate blob ES modules while initializing inside the opaque sandbox. Asset checks reject missing/stale worker responses. Worker startup failures preserve the underlying browser message rather than always suggesting a local preparation command.

The generated worker is tested with its real WASM and standard-library payload in worker threads using browser-style globals and no Node process or network access, in addition to the existing native Pyodide and sandbox tests. These are runtime integration checks, not a substitute for real-browser certification. The managed preview URL again returned connection refused to the test browser; real browser QA remains unavailable.

For an existing Vercel deployment, copy the updated source, commit/push it, confirm the Git-integrated production deployment succeeds, then hard-reload. Run `npm ci` and `npm run prepare:runtimes` for local setup; a successful build includes preparation automatically. A change to the ChatGPT-hosted preview does not update a separate GitHub/Vercel deployment.

## Opaque sandbox worker compatibility update

The user reported another startup failure before the Python handler ran. The previous bootstrap used a module worker; the exact browser rejection could not be inspected here. The revised bootstrap uses the same classic blob-worker mode as the JavaScript snippet runner. The already self-contained bundle disables importScripts before initializing the supplied Pyodide loader/factory; no module or external-script loading is needed. This is an adapted bundled runtime, rather than the upstream standalone loader. Opaque-origin isolation, network denial, bounded output, hard termination and per-run state are retained.

65 automated checks pass, including generated-worker WASM execution and an explicit startup-mode regression check. Real browser verification remains unavailable because the managed preview route is unreachable; this update must still be checked on the actual deployment. Runtime asset requests include revision=3 and reject an older worker bundle.

## Account email, data tools and readable editors — 4 November 2026

Account setup now checks Supabase, canonical site origin and production Redis before enabling the form. Signup/resend use an operator-controlled /account callback. SMTP/provider failures and cooldowns are surfaced; default Supabase confirmation redirects and token-hash links are supported. Resend remains rate limited, does not require a password and keeps unknown-account responses generic. No real email was sent or delivery certified: the ChatGPT-hosted preview has no Supabase/Redis credentials. Its APP_ORIGIN has been configured for the existing site. A separate Vercel deployment requires its own environment settings and Supabase SMTP configuration.

SQL uses the actual inlined SQLite WASM engine. Integration checks cover the generated no-network worker, schema/insert/query/aggregation, statement context, result bounds and fresh databases. JSON checks include pretty output, primitives and multiline syntax positions. Editor sizes default to 16px and can be adjusted on the device in both workspaces.

Current update validation: all 80 automated checks passed and TypeScript compilation passed. The Sites production build passed. Browser QA was attempted, but the preview address returned connection refused in the test browser; visual verification remains unavailable.
