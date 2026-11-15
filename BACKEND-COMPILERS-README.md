# Executable compiler workspaces — v0.20.0

The compiler toolbox, Studio tool dropdown, homepage stack cards and Learn menu open these runnable editors directly:

| Tool | URL path | Execution |
| --- | --- | --- |
| FastAPI | /labs/fastapi | Real FastAPI 0.136.1 and Pydantic 2.12.5 on Pyodide 314.0.7; editable Python, local ASGI requests, status/headers/body and errors. |
| Node.js | /labs/nodejs | Real browser Node/WebContainer HTTP server, source editor, terminal and test requests. Experimental: browser isolation, provider access and applicable licensing still apply. |
| PostgreSQL | /labs/postgresql | Real PGlite PostgreSQL. CREATE/INSERT/UPDATE/DELETE and SELECT scripts in a disposable database. Exercises retain their read-only policy. |
| Tailwind CSS | /labs/tailwindcss | Real Tailwind browser compilation and sandboxed preview. |
| PHP | /labs/php | Real PHP 8.3.33 WASM, editable PHP, request path/method/JSON body, output and syntax/runtime errors. |
| Laravel | /labs/laravel | Real Laravel 13.42.0 with pre-bundled Composer dependencies on PHP WASM; editable routes/api.php, HTTP kernel and validation responses. |

FastAPI/PHP/Laravel execute in opaque-origin frames and dedicated workers with network blocked. Dependencies load only on Run and are cached for further requests. Stop terminates the runtime. Source/body/output sizes and execution/setup times are bounded. Vercel never executes submitted PHP or Python. Existing snippet and project compilers remain separate.

These environments support browser practice, not production hosting: no public TCP server, external database credentials, unrestricted package installs or arbitrary desktop extensions. FastAPI synchronous handlers run directly on one worker thread. Laravel uses the bundled framework; use the local starter for custom Composer dependencies. Tailwind browser previews are development tools; use its local CLI for production CSS.

## Deploy
Use Node 24.18+, npm ci --include=dev, npm test and npm run build. npm run prepare:runtimes bundles workers, verifies pinned FastAPI wheels by SHA-256 and copies PHP assets. The Laravel vendor bundle is already included. No new DB migration, VPS, account or runner credentials are required for these browser runtimes. Node WebContainer prerequisites remain applicable.

Push the complete source to the existing GitHub repository to update the Vercel domain. Native ChatGPT Site publication is separate from www.sukoaa.com.

## Rebuild Laravel
First-party bootstrap/config/routes plus composer.json and composer.lock are in examples/browser-laravel. Run composer install --no-dev --no-scripts there using PHP 8.3+ and Composer. From the repository root, run node scripts/prepare-laravel-bundle.mjs. Dependencies resolve against PHP 8.3.33; platform checks are retained. Vendor source/license files ship inside public/runtime/backend/laravel.zip.

## Verification
Real WASM worker tests cover PHP output, JSON requests and syntax errors; FastAPI sync and async endpoints, HTTP 201/422 and source errors; Laravel edited routes, HTTP 201/422 and syntax failures. Existing platform regressions remain enabled.
