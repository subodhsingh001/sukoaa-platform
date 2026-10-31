# Architecture and product direction

Sukoaa is a practical toolkit: discover a browser or extension, solve a small task, or turn an idea into code. Give each product its own useful workflow rather than trying to launch every category at once.

## Current architecture

- **Frontend:** React, TypeScript and Next.js App Router. The homepage introduces the collection; `/workspace` is the development tool.
- **Backend:** Next.js route handlers in `app/api`. The backend validates identity and input, accesses Supabase using the current user's token, and proxies only the configured code runner. There is no shell-execution endpoint.
- **Identity and data:** Supabase Auth and PostgreSQL. Passwords remain in Supabase Auth. Project ownership is enforced in both API filters and database RLS.
- **Redis:** Upstash REST API, suitable for serverless environments. Counters are shared across all app instances. Redis is not the project database.
- **Code execution:** JavaScript is run in a worker created in an opaque-origin iframe. TypeScript is transpiled in a separate compiler worker, then follows the JavaScript path. React renders within an opaque-origin frame. Python/Go submit to a configured isolated Judge0 service. Project Studio integrates a separate browser Node runtime for Next.js; it is not executed in Sukoaa route handlers. See docs/08-PROJECT-STUDIO.md.
- **Distribution:** product files live on your release/CDN host. Supabase stores version, platform, checksum and URL. The website is not an installer build/signing pipeline.
- **AI:** the UI and endpoint report disabled; no provider is called.

## Important request boundaries

Browser editor → restricted iframe/worker for browser execution.
Browser Save cloud → Next.js guard → Supabase Auth validation → PostgreSQL RLS.
Browser remote Run → login + origin + quota checks → Judge0 → Redis-owned job ID → owner-checked polling.
Admin release form → authenticated database role check → RLS → release metadata.

## Why keep one app initially?

A modular Next.js app is easier to operate than several microservices at this stage. Keep auth, projects, distribution and runner adapters in separate modules, but deploy the web/API app together. Add a queue and separate worker fleet when real execution traffic warrants them. Do not execute untrusted code inside Next.js, Redis, Supabase SQL functions or the same Docker container as the web app.

## Distribution and scaling

Cache public images and versioned runtime files through your host's CDN. Do not CDN-cache auth, project or admin responses; these return `Cache-Control: no-store`. Horizontally scale the stateless app behind a trusted reverse proxy. Use Supabase connection/data APIs and Redis REST; local memory counters are development-only.

At higher traffic, move previews to a separate sandbox origin with a strict message protocol and isolated execution processes, add account-specific quotas and a queue, measure p95 response/compile times, and use object storage for larger project archives. Database schema migrations and backups remain independent from frontend deployments.

Project Studio local React bundling uses esbuild-wasm in a browser worker and Monaco language workers. Files persist locally or through explicit cloud snapshots. Untrusted React previews use opaque-origin iframes; Node previews use the runtime provider's separate origin. Preview instrumentation reports console/errors/fetch/XHR through a per-run channel checked against the iframe window.
