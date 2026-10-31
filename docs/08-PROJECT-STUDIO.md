# Sukoaa Project Studio — v0.3.1

Open `/studio`. This is separate from the small single-file `/workspace` playground. React and Next.js entries in the quick toolbox lead to the Studio.

## First run: React

1. Choose React project. The starter includes package.json, src/main.tsx, App.tsx, components/Counter.tsx, lib/api.ts, styles.css and sukoaa.mock.json.
2. Click Run project. React Fast bundles local imports, TypeScript/TSX, CSS and JSON using esbuild WebAssembly. A worker is preferred, with a local compatibility fallback if it cannot start. No Supabase, Redis or code-execution server is needed for this path.
3. Click the counter in the preview: it comes from an imported component. Click Call /api/hello, then open API / Network. This response is a **local mock**, explicitly labeled mock.
4. Open any file from Explorer or its tab. The Monaco editor provides syntax highlighting, autocomplete and language diagnostics. Ctrl+Enter runs; Ctrl+S saves locally and syncs files when Node is active.
5. Use the file/folder buttons to create paths such as src/ui/Badge.tsx. Intermediate directories are created automatically. Rename/move actions update relative JS/TS import paths that resolve to existing project files. Dynamic computed import strings and non-JS/TS asset references are not automatically rewritten.
6. Errors show their file, line and column where available. Click one to open that file and focus the position. Browser runtime errors are mapped through multi-file source maps to TSX source.

React Fast uses the configured entry module (default src/main.tsx) and a root div. It is a frontend preview, not a full Vite server. The editable index.html and npm scripts are honored when the exported project runs normally or when using Node runtime. React Fast cannot emulate Next.js server components, route handlers, Node built-ins or arbitrary build plugins.

## Packages and imports

Relative imports, folder index modules, `@/` paths, TS/TSX, JSX/JS, CSS, JSON and text SVG imports are supported by the local bundler. React and React DOM are preloaded from this site's installed versions.

For another browser-compatible package, put an **exact version** in package.json dependencies and import it normally. Example:

```json
{ "dependencies": { "react": "19.2.6", "react-dom": "19.2.6", "lodash": "4.17.21" } }
```

React Fast resolves declared browser packages through esm.sh. This requires internet access and makes network requests to that package CDN. Not every npm package is browser-compatible. Use the Node runtime for npm installation/version ranges and full dev-server behavior. Package loading, framework internals and static assets are not all visible in the app's API inspector.

## Real Next.js and Node runtime

The default Next.js browser starter is a multi-file **Pages Router** project, with imported components and an actual `pages/api/hello.ts`. Existing/imported App Router projects are kept as they are. Sukoaa integrates `@webcontainer/api`, which runs a Node-compatible runtime in the visitor's browser. It mounts source files, installs dependencies and starts the project's `npm run dev` process. It does not execute user code inside Sukoaa's web backend.

Requirements:

- Serve Sukoaa on **HTTPS or http://localhost**. An arbitrary HTTP preview host is not sufficient.
- `/studio` must receive `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`. These are in next.config.ts. Check the actual headers when using a different reverse proxy/CDN/adapter.
- Use a supported browser with cross-origin isolation, SharedArrayBuffer, WebAssembly, workers, and the runtime provider's required storage/service-worker/network access. Chromium desktop is a practical first test target; mobile/browser compatibility must be tested separately.
- Internet access for WebContainer, npm packages and framework binaries. Some native modules/platform-specific dependencies are not supported; framework compatibility is not identical to a full Linux VM.

Choose Next.js project and press Run project. The Terminal shows npm install and dev-server output. Once server-ready is received, the runtime's actual preview URL opens in the iframe. If prerequisites are missing or startup fails, a setup/error message is displayed; Sukoaa does not substitute a fake Next.js preview. Stop terminates tracked processes. Save & sync writes edited files into the running project; normal framework HMR handles the refresh. Package.json changes generally need Restart or an npm command.

The terminal supports non-interactive commands such as `npm install axios`, `npm run build` and `ls`. It is not a complete TTY emulator. Commands execute inside the browser runtime, never the Sukoaa web host. Dependencies are initially installed with lifecycle scripts disabled; packages that require postinstall steps may need explicit, deliberate commands in the runtime. Do not paste production credentials into sample projects or commands.

The included Pages Router starter passed a real Next.js production build on the local verification host, including its API route. Live WebContainer boot/npm/dev-server execution was **not verified** in this environment because its browser-facing preview is HTTP and does not satisfy the secure-context requirement. Test the runtime at localhost or a correctly configured HTTPS deployment before offering it as a reliable public service.

### Licensing and mode

WebContainer prototypes/POCs do not require a commercial license. **Production use in a commercial, for-profit setting requires an eligible WebContainer API license.** It is not an unlimited free commercial runtime. Before a business launch review https://webcontainers.io/enterprise and the provider terms.

`.env.local` / hosting variables:

```env
NEXT_PUBLIC_WEBCONTAINER_MODE=prototype
NEXT_PUBLIC_WEBCONTAINER_API_KEY=
```

Use disabled to turn Node runtime off. For a licensed deployment use licensed and the provider-issued client API key. NEXT_PUBLIC values are browser-visible by design; never put an OpenAI key, Supabase service-role key, Redis token or other server secret there. Restart/rebuild after changing these variables. AI remains disabled in this Sukoaa release.

Official runtime API/setup: https://webcontainers.io/api and https://webcontainers.io/guides/quickstart

## Console, errors and API activity

- Console captures log, info, warn, error and debug from the instrumented preview, up to 300 entries. Node dev-server output appears separately in Terminal.
- Errors combines editor, build and preview errors. Matching editor/runtime positions are grouped. TypeScript editor checks are helpful but are not a full Next.js type-check; run the real project's build for framework validation.
- API / Network observes **app fetch and XHR**, including method, URL, status, duration and mock/live/blocked source. It is not a complete browser DevTools network log or a distributed tracing service. Server-side fetches and all asset/module requests are not captured there; inspect server output and browser DevTools as needed.
- React Fast blocks live APIs by default. In Project settings add exact origins, for example https://api.example.com. This does not bypass browser CORS or add a server proxy. Live Fast requests omit cookies. Local fetch mocks are configured in sukoaa.mock.json; XHR mocks are not implemented.
- Node preview uses actual project networking; it does not apply Fast mode's mock/origin restrictions. It can serve real Next.js API routes. Observe source code and runtime/provider permissions accordingly.
- Optional response previews read at most 4 KB. Request bodies and headers are not recorded. Common sensitive key names and query parameters are redacted, but no pattern-based redactor can guarantee all sensitive content is removed. Leave response recording off when unnecessary.
- Debug snapshot exports a JSON report locally: file names, diagnostics, captured logs, request summaries and recent terminal output. It excludes source code, headers/bodies and response previews. Review logs before sharing. It never uploads a report or enables AI automatically.

## Saving and importing

The current React and Next.js drafts are auto-saved separately on this device. Export ZIP before replacing a draft or switching between several projects of the same kind; this release keeps one local draft per framework. Source import/export supports up to 150 text files / 1 MB total, with 200 KB per-file limits. ZIP input is limited to 2 MB compressed, and oversized ZIP entries are rejected before decompression. Dependency/build folders, traversal paths, secret-file names and unsupported binary files are excluded. Review imported content; file naming is not a guarantee it contains no secrets.

Cloud saves reuse the existing Supabase projects table and its owner-only policies. No database migration is required for Studio. Cloud source snapshots are still limited to 50 KB serialized; use ZIP for larger projects. Quick-playground project lists open Studio snapshots in the correct workspace. Existing Supabase and Redis configuration is unchanged.

This is a useful project-testing workspace, not a claim to replace every desktop IDE, execute every npm/native package, capture every network layer or support unlimited free public compute.

## Layout and runtime recovery — 0.3.1

Console, Errors, API / Network and Terminal now share a full-height inspector on the right of Preview. Choose Editor, Preview or Split above the workbench. Clicking a source file opens Editor. Running successfully switches to Preview. Hide inspector frees more horizontal space; Focus preview temporarily hides both sidebars for a full-width page. Click it again or select a view to return. Explorer and the inspector have independent scrolling. At narrow widths the workbench and inspector stack vertically, and the folder button opens the Explorer drawer.

Runtime assets regenerate automatically during npm ci (postinstall), before npm run dev, and before npm run build. If installation scripts were disabled, run npm run prepare:runtimes manually. The worker URL is resolved at runtime so Next's bundler does not treat the public file as a source worker. Release suffixes prevent old worker/WASM pairs from mixing. Missing files, HTML/sign-in responses and invalid WASM now report their actual cause. Project settings → React bundler → Compatibility runs the same local compiler without a dedicated worker. It can briefly use the main browser thread; browser CSP must still allow the local scripts and WebAssembly.

### Next.js workStore error

“Expected workStore to be initialized” is a Next.js request-context invariant, not a TSX syntax diagnostic. It can occur with App Router in browser Node implementations. Sukoaa does not patch Next's context handling or claim full App Router compatibility. The new browser starter uses the real Pages Router, avoiding the App Router metadata path. It still requires WebContainer prerequisites, and a successful native build is not proof of browser runtime compatibility. Live WebContainer execution remains unverified in this QA environment.

For an existing App Router draft, Preview shows **New Pages Router starter (keeps backup)**. This opens a separate starter after saving the complete prior project under a device-local backup key. **Restore previous project** returns to that backup; Export current project downloads the original source first. Custom App Router applications are never automatically rewritten. For full App Router behavior, export the source and use native Node on your computer. Empty source directories and .next cache are cleaned when the browser runtime restarts/switches projects, preventing stale App Router files from leaking into the Pages project.
