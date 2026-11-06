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
