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
