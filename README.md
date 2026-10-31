# Sukoaa Platform — v0.3.1

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
| Python + Go | Judge0 adapter included; requires a real isolated runner, login and Redis; **not live-configured** |
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

Free tiers can support evaluation and small usage, not an unlimited compiler platform. Vercel Hobby is restricted to personal/non-commercial use; a commercial Sukoaa launch needs an eligible plan or another suitable host. Python/Go compute and future AI usage have separate resource costs. Details and official sources are in the deployment guide.

## Verification and remaining work

See [docs/07-VALIDATION.md](docs/07-VALIDATION.md). No live user databases, Redis databases or compiler subscriptions were created for you. Live account flows, database policies and external execution need end-to-end verification after you connect your accounts. This is a tested starter implementation, not a production certification.

Self-service password reset, social sign-in, organizations, billing, an npm package sandbox, a full Next.js browser IDE, admin editing/deletion of releases, and active AI agents are not part of this release. See the staged growth plan.
