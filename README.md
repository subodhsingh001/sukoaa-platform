# Sukoaa Platform — v0.4.0

A professional home for Sukoaa's browser, extensions and developer tools. This source release includes the frontend, Next.js backend routes, Supabase database migration, optional Redis integration, a code workspace, release distribution metadata and setup guides. **AI agents are disabled.**

## Start here

1. Install Node.js 22 LTS or a newer supported LTS from https://nodejs.org/.
2. Extract the ZIP and open the **sukoaa-platform** directory in VS Code.
3. Open Terminal in that directory and run `npm ci`, then `npm run dev`.
4. Open http://localhost:3000 and choose **Workspace**.
5. Run JavaScript, TypeScript, HTML/CSS and single-file React immediately. No account needed.
6. Follow [docs/02-LOCAL-SETUP.md](docs/02-LOCAL-SETUP.md) for Supabase and Redis, then [docs/03-DEPLOYMENT.md](docs/03-DEPLOYMENT.md) to publish your own site.

`npm ci` runs the postinstall script that prepares local TypeScript and React runtime assets. These are shipped in the ZIP too. No third-party runtime CDN is required to run browser examples.

## Project Studio: files, imports and debugging

Open **/studio** for multi-file React/Next.js projects. It includes folders/files, rename with local import updates, editor tabs, Monaco syntax highlighting/autocomplete, live preview sizing, console, clickable errors, API inspection, local autosave, ZIP import/export and a debug snapshot. React Fast bundles source locally. Real Next.js uses the optional browser Node runtime; see [docs/08-PROJECT-STUDIO.md](docs/08-PROJECT-STUDIO.md) for HTTPS/headers/browser prerequisites and commercial licensing.

## What works, and what requires configuration

| Feature | This release |
| --- | --- |
| Homepage, tool search, category filters, favorites | Implemented; favorites stored on this device |
| JavaScript | Browser worker execution; 3-second limit; no network or imports |
| TypeScript | Single-file transpilation + JavaScript execution; syntax diagnostics, **not full type checking** |
| HTML + CSS | Restricted iframe preview; inline JavaScript supported |
| React / TSX | Multi-file Studio with relative/CSS/JSON imports, browser package resolution, local preview and Monaco editor; old quick examples remain available |
| Python | Local Pyodide runtime, standard input, console and source error positions; no login required |
| Go | Judge0 adapter included; requires a real isolated runner, login and Redis; **not live-configured** |
| Next.js coding environment | Multi-file Studio + integrated WebContainer Node runner. Requires supported browser, HTTPS/localhost, isolation headers and runtime/provider access; live browser Node execution needs verification on your deployment |
| Sign up/sign in/sign out/email confirmation | Backend/UI implemented; requires Supabase project and email settings |
| Cloud project create/open/update/delete | Backend/UI + RLS implemented; requires Supabase migration and production Redis |
| Admin release manager/download directory | Implemented; requires Supabase and administrator promotion via SQL |
| Redis | Atomic fixed-window rate limits and expiring runner job ownership mappings; configuration required |
| AI agents | Disabled in UI and API; no AI SDK, key or calls |
| Browser/extension binaries | Not included in this website project; attach reviewed release URLs separately |

## Error locations and red highlights

Press Run to see syntax/runtime diagnostics with line and column when available. Error lines and their gutter numbers turn red. Click a diagnostic to focus the corresponding code position; highlights clear when you edit or start another run. TypeScript and React runtime locations are mapped back to your original TS/TSX source. HTML reports inline JavaScript errors when the browser provides a position. Python/Go diagnostics are parsed from the configured runner; no live runner was connected for this update. CSS validation and a full Next.js hosted runtime are not included. Errors without a reliable position show “Location unavailable” instead of an invented line number.

## Folder guide

| Location | Purpose |
| --- | --- |
| `app/page.tsx`, `app/globals.css` | Marketing homepage and visual system |
| `app/workspace/page.tsx` | Quick single-file playground |
| `app/studio`, `components/studio`, `lib/studio` | Multi-file project IDE, local bundler, Node runtime and debug panels |
| `app/account`, `app/setup`, `app/downloads`, `app/admin` | Accounts, setup guide and product distribution |
| `app/api` | Backend routes; no separate Express/Nest server required |
| `lib/platform` | Authentication, guards, validation, Redis, runtime adapters and browser sandbox helpers |
| `public/runtime` | Local TypeScript compiler, compiler worker and React bundle |
| `public/templates` | Minimal downloadable Next.js starter |
| `supabase/migrations/001_platform.sql` | Tables, indexes, triggers, permissions and row-level security |
| `tests/platform.test.ts` | Automated security/adapter checks with mocked external services |
| `docs` | Architecture, registration, setup, database, deployment, growth and validation guides |
| `.env.example` | Server environment-variable names; contains no secrets |
| `Dockerfile`, `compose.yaml` | Portable app container; uses managed Supabase/Redis |
| `.github/workflows/ci.yml` | Install, type check, tests and Next.js build on pushes/PRs |

## Commands

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm start
```

Never commit `.env.local`, real tokens, `node_modules` or `.next`. Run `npm run prepare:runtimes` after changing TypeScript/React versions. Browser code is not a secure place for provider credentials.

## Deployment choices

The portable ZIP is a standard Next.js App Router application. Deploy it to a Next.js host or run its Docker container. The ChatGPT Site preview is a separate Vinext/Cloudflare adaptation of the same app sources; its hosting configuration is intentionally absent from the portable ZIP. You do not need a ChatGPT Sites account to deploy the portable project.

Free tiers can support evaluation and small usage, not an unlimited compiler platform. Vercel Hobby is restricted to personal/non-commercial use; a commercial Sukoaa launch needs an eligible plan or another suitable host. Remote execution and future AI usage have separate resource costs. Details and official sources are in the deployment guide.

## Verification and remaining work

See [docs/07-VALIDATION.md](docs/07-VALIDATION.md). No live user databases, Redis databases or compiler subscriptions were created for you. Live account flows, database policies and external execution need end-to-end verification after you connect your accounts. This is a tested starter implementation, not a production certification.

Self-service password reset, social sign-in, organizations, billing, an npm package sandbox, a full Next.js browser IDE, admin editing/deletion of releases, and active AI agents are not part of this release. See the staged growth plan.

## Distribution and SEO

Dedicated browser, extension and developer-tool pages are available. Use docs/09-PUBLISHING-AND-SEO.md to connect real store/installer links, set the canonical domain and enable indexing only on the public production site. Store submissions, binaries and Search Console verification remain separate account actions.

### Browser Python

Open `/workspace?language=python`. Pyodide 314.0.7 runs locally with standard-library imports, prefilled standard input, console output, red error lines, Stop and a 10-second execution limit. No login, Supabase, Redis or Judge0 is needed. Run `npm run prepare:runtimes` after installing dependencies. Python is a single-file snippet tool; arbitrary pip installs, network calls and server projects are not supported. See docs/05-CODE-RUNTIMES.md.

### Account email and data tools update

SQL/SQLite and JSON validation run locally without accounts. Editors start at 16px with persistent A−/A+ controls. For SQL/JSON cloud saves, apply supabase/migrations/002_sql_json_projects.sql after migration 001.

Registration and confirmation resend require a configured APP_ORIGIN, Supabase and production Redis. Actual mail delivery is configured in Supabase (verified custom SMTP sender, email confirmation and callback URL allow list). See docs/02-LOCAL-SETUP.md and /setup#email. No live delivery is claimed from code tests.

### Editor and navigation update (0.5.1)
Tool cards open their editor directly. Quick editors pair brackets and quotes, indent blocks on Enter, and expand `for` with Tab. Tool filters use larger text. Platform setup is available only to server-verified administrators at `/admin/setup`; `/setup` redirects there.

### Spacious workspace (0.6.0)
The quick playground uses side-by-side code and output panels on desktop. Choose Code + output, Code only, or Output only; Full-page view hides surrounding navigation and Escape returns to the regular page. On small screens panels stack.

The editor provides syntax highlighting, bracket pairing, indentation, folding chevrons, Fold all / Expand all, and adjustable text size (18px default). Folding hides code visually without changing saved or exported source. If editor assets are unavailable, a basic textarea remains usable; folding is unavailable in that fallback.

Complete JSON arrays or objects printed as a single JavaScript/TypeScript console argument can be expanded in the console. Other messages remain plain text. Existing runtime output limits still apply; truncated output cannot be expanded. Python is available directly from the homepage toolkit.

### Python async execution fix (0.6.1)
Python code now enters through an awaited PyProxy call on runtimes with WebAssembly JavaScript Promise Integration (JSPI). This fixes `asyncio.run()` / `asyncio.gather()` reporting a synchronous-entrypoint stack-switch error and ensures output and async exceptions arrive before completion. The original source is executed unchanged; error line mapping and the 10-second execution deadline remain in place. Existing synchronous programs retain their previous execution path when JSPI is unavailable; blocking async entrypoints such as `asyncio.run()` require a JSPI-capable runtime. Python runtime assets use revision 4 to avoid the previous runner being reused from cache.

### Python API mode (0.7.0)
The Python playground bundles real Requests 2.33.1, urllib3 2.6.3, certifi 2026.4.22, idna 3.11 and charset-normalizer 3.4.7 from the pinned Pyodide distribution. Dependencies are hash-verified at preparation and browser loading; no user pip command is needed. To try it, select Python, click **Load API example + enable access**, then Run. The example uses `/users/1`; its output is visible in Console and the request/status/body preview in API / Network.

API access starts OFF. This release allows only HTTPS GET/HEAD to `jsonplaceholder.typicode.com`, up to 5 requests per run, a 10-second request timeout and 256 KB responses. API-enabled execution lasts at most 20 seconds (offline mode: 10 seconds). Browser CORS applies. Cookies, authorization headers, request bodies, redirects, streaming, custom TLS certificates and proxies are not supported. Other hosts/methods are blocked. The adapter uses the real Requests response and exception types but is not a full server Python networking environment. Arbitrary pip installation is not supported.

The opaque-origin Python frame and worker retain `connect-src 'none'`; a channel-scoped parent bridge validates every API request and performs credential-free browser fetches. Stopping/editing a run or disabling access cancels pending fetches. No server-side HTTP proxy or Python execution service is introduced; there are no additional service credentials or database migrations. The curated API origin policy lives in `lib/platform/python-http.ts`. Do not add authenticated or private-network services to that list.

### CI runtime fix (0.7.1)
Use Node.js 24 for installation, testing and builds. GitHub CI now selects Node 24. The test launcher explicitly starts its child Node process with `--experimental-wasm-jspi` so the Python worker tests have JavaScript Promise Integration even when it is not enabled by default in the parent Node process. This flag is inherited by test workers; setting it only on the outer launcher did not previously enable the spawned test process. Run tests with `npm test`. Browser code and diagnostic line expectations are unchanged.
