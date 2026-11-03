# Compiler/runtime status and setup

JavaScript is an interpreted/runtime language, TypeScript transpiles, React is a UI library, and Next.js is an application framework. They do not share one interchangeable “compiler” backend.

## Browser tools included now

- **JavaScript:** runs in a worker created by an opaque-origin sandbox frame. No parent-site cookies, DOM, network or imports. Console lines are capped. The worker is terminated after three seconds.
- **TypeScript:** local TypeScript compiler in `transpile-worker.js`; user source is parsed but not executed in that compiler worker. Generated JS goes into the JavaScript sandbox. Syntax diagnostics are reported. Transpilation erases types; it does not prove your program is type-correct. Imports/exports are rejected by AST inspection.
- **HTML/CSS:** full source goes into `srcDoc` after a restrictive CSP. Inline script is supported. No outbound requests, forms, popups or same-origin privileges. External images/fonts/scripts will not load by design; use inline CSS/data assets for these simple examples.
- **React/TSX:** define `function App()` and use the provided React global, including React.useState. JSX is transpiled with the classic React transform, then mounted using createRoot. No npm import resolution, multi-file Vite build, React server components or SSR.

Dependencies for browser tools are prepared locally from pinned npm packages. This avoids fetching an arbitrary external CDN every time a visitor presses Run. TypeScript is lazy-loaded into the compiler worker and is a relatively large asset; measure caching and loading on slower connections before a public release.

Browser sandboxing limits privileges, not memory consumption. JS worker loops have a timeout, but HTML/React can still hang the rendering frame. Use code you trust during the beta; a broad public hosted IDE needs separate-origin/process isolation and operational controls.

## Python in the browser

Open `/workspace?language=python`, enter optional standard input and press Run. No account, Redis or execution provider is needed. Pyodide 314.0.7 and its CPython standard library are served locally from pinned npm assets, prepared by `npm run prepare:runtimes`.

Python runs in a self-contained classic worker within an opaque-origin iframe (no allow-same-origin). The parent page loads the pinned static runtime assets and sends copies into the sandbox, so private hosting gates do not require giving Python a login session. The worker initializes from those in-memory bytes. Its Pyodide JavaScript loader and Emscripten factory are bundled ahead of time. The bootstrap disables importScripts before initialization; this adapted bundle does not use Pyodide’s standalone module-worker loader or fetch any scripts. This preserves opaque-origin isolation while avoiding module-worker startup inside the sandbox. Its CSP blocks network access, and it cannot access the application's cookies or local storage.

Each run uses a fresh runtime. Asset loading and runtime initialization each have a 45-second limit; execution is limited to 10 seconds, and output to 200 lines/30,000 characters. Stop, editing code/input, switching languages or leaving the workspace destroys the frame and worker. There is no hard per-worker memory quota; use short experiments rather than large workloads.

Standard input is prefilled, newline-separated text. Exhausting it raises EOFError at the user line. Syntax/runtime errors report main.py line numbers and available syntax columns; click a diagnostic to jump to its red editor line. Standard-library imports work; arbitrary pip installs, outbound API access, shell processes, web servers, and project folders are not part of this snippet runner.

## Optional remote execution using Judge0

1. Choose a managed Judge0 provider or operate a hardened, patched Judge0 service on dedicated execution infrastructure. Do not install the runner inside the Next.js web container or assume Docker alone is a complete security boundary.
2. Follow the selected provider's current provisioning/security instructions. Expose its API only through HTTPS and restrict access to authorized web/API clients as the provider supports.
3. Query `GET /languages` on **your own** endpoint, find its installed Python and Go entries, and record their numeric IDs. Do not copy guessed IDs from another installation.
4. Put the endpoint into JUDGE0_URL, without a trailing slash. Configure JUDGE0_AUTH_TOKEN for X-Auth-Token, or JUDGE0_RAPIDAPI_KEY if your provider uses RapidAPI. Do not put keys in NEXT_PUBLIC variables or client code.
5. Set JUDGE0_PYTHON_ID and JUDGE0_GO_ID. Supabase Auth and Redis must also be connected. Redeploy/restart.
6. Sign in, choose Go and run its example. Verify compiler errors and the timeout case in staging. The Python UI uses the browser runtime; the retained Python server adapter is optional API infrastructure, not its default execution path.
7. Validate that the selected service actually enforces no network, CPU, wall-time, process/thread, memory and file-size limits. The API request asks for a 2-second CPU limit, 5-second wall limit, 128000 KB memory, 16 processes/threads and 1024 KB max files, with network disabled. Provider enforcement must be independently verified.

Submission uses asynchronous jobs (`wait=false`) and base64-encoded source/stdin. The frontend polls a Sukoaa job ID; the underlying runner token is mapped to its owner in Redis for five minutes. Standard output, errors and compiler output are decoded and capped before display. The UI polls at most 20 times and does not cancel provider compute when you stop polling. Provider limits are the execution boundary.

The adapter is implemented and its validation/transport controls are tested with mocks. No live Judge0 service was provisioned or certified in this work. Go remote execution is not active until you configure and test that service.

Official API reference: https://ce.judge0.com/

## Next.js and React Project Studio

The new /studio supports multi-file React and Next.js source projects. React Fast bundles local modules, CSS and JSON and resolves declared exact-version browser dependencies via esm.sh. Next.js uses the integrated WebContainer Node runner, with actual package installation, dev-server output and preview. The optional runtime requires HTTPS/localhost, COOP/COEP, a supported browser, internet, compatible packages and appropriate provider licensing for commercial production. It was not live-tested through WebContainer in this HTTP preview environment; its exact Next.js starter passed a local production build. See docs/08-PROJECT-STUDIO.md for complete behavior and setup.

The old /workspace remains a quick snippet tool. Python runs locally with Pyodide; Go still requires a separate Judge0 service. A browser Node runtime does not make those remote backends active.
