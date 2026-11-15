# Third-party dependencies

The app uses Next.js, React, React DOM and lucide-react (MIT), TypeScript (Apache-2.0), esbuild (MIT), Node type definitions (MIT), and Tailwind CSS (MIT) with their transitive dependencies as recorded in package-lock.json. Retain upstream notices when redistributing installed dependencies. The generated React runtime retains bundled legal comments. The TypeScript license is copied beside its browser runtime.

No browser binary, extension binary, AI model weights, Go compiler distribution or Judge0 service is included. Those products/services have their own licenses and terms. This is a dependency notice, not a completed legal review or a declaration that third-party browser sources are cleared for distribution.

Project Studio adds esbuild-wasm (MIT), Monaco Editor (MIT), fflate (MIT), and @webcontainer/api (its SDK license plus separate provider runtime terms). The Monaco/runtime generated files retain legal comments. WebContainer commercial production usage requires a provider license; prototypes/POCs are treated separately. See https://webcontainers.io/enterprise. React Fast optional browser dependencies load through esm.sh and retain their own package licenses.

Browser Python adds **Pyodide 314.0.7 (MPL-2.0)** and its bundled CPython/WebAssembly standard library. The upstream files are copied unmodified; source: https://github.com/pyodide/pyodide/tree/314.0.7. Retain MPL-2.0 and the CPython/PSF and bundled component notices. Copies of the Pyodide license and the runtime Python license information are served under public/runtime/python. No optional PyPI packages are included or automatically installed.

SQL adds sql.js 1.15.2 (MIT) and SQLite (public domain). The inline WASM runtime retains its embedded notices; the sql.js license is copied alongside it in public/runtime/sql. Source: https://github.com/sql-js/sql.js . JSON diagnostic positions use Microsoft jsonc-parser 3.3.1 (MIT); its license applies to its bundled code. Source: https://github.com/microsoft/node-jsonc-parser .

## Bundled Python HTTP dependencies (0.7.0)
Unmodified pure-Python wheels from the pinned Pyodide 314.0.7 distribution are distributed in `public/runtime/python/packages`. Each wheel contains its upstream license and metadata. `manifest.json` records the exact version and SHA-256, verified by `scripts/prepare-python-packages.mjs`.

- Requests 2.33.1 — Apache-2.0.
- urllib3 2.6.3 — MIT.
- certifi 2026.4.22 — MPL-2.0.
- idna 3.11 — BSD-3-Clause.
- charset-normalizer 3.4.7 — MIT.

The Python source files, certificate bundle and license notices remain included in those wheels. Preserve them in source and deployment distributions.

React Native Web 0.21.2 — MIT — https://github.com/necolas/react-native-web. License copied to public/runtime/react-native-web-LICENSE.txt.

## Separate learning runtimes
PGlite 0.5.15 by ElectricSQL: Apache-2.0; its bundled PostgreSQL components retain their upstream notices. Tailwind CSS browser 4.2.1 by Tailwind Labs: MIT. Runtime licences are copied to public/runtime/learning. The browser Tailwind engine is used only for practice previews; starter exports use a CLI build for production CSS.

## Types Studio
JSON5 2.2.3 (MIT) parses data in the browser. No executable JavaScript evaluation is used. Package source and license: https://github.com/json5/json5. Types Studio emits Zod source; the generated user's project must install Zod separately.

## Backend browser runtimes
FastAPI 0.136.1 and Pydantic 2.12.5 are MIT-licensed. Their Pyodide dependency wheel archives include package metadata and license notices; prepare-api-runtimes.mjs verifies SHA-256 values against the pinned Pyodide lock.
@php-wasm/universal and @php-wasm/web-8-3 3.1.61 are GPL-2.0-or-later, from https://github.com/WordPress/wordpress-playground (release v3.1.61). PHP 8.3.33 retains its PHP license. The PHP-WASM license is copied alongside php.wasm. The upstream release provides source and build instructions; npm versions and lockfiles identify the build used.
Laravel 13.42.0 is MIT-licensed. Its bundled Composer dependencies retain vendor source and license files inside public/runtime/backend/laravel.zip; examples/browser-laravel/composer.lock records the full dependency set and reconstruction files are supplied.

## API Studio dependencies (v0.21)

GraphQL.js 16.11.0 and yaml 2.8.1 are MIT licensed. Full license texts are included in docs/licenses/. Their sources are https://github.com/graphql/graphql-js and https://github.com/eemeli/yaml. Lockfiles pin the distributed builds. Sukoaa's generated datasets and SVG placeholders are fictional first-party examples.
