# File and data tools

Five client-side utilities, added 20 November 2026. Open `/tools/data-workbench` for the directory. Links also appear on the homepage, Tools, Search and Resources.

| Route | Operations | Useful extras |
| --- | --- | --- |
| `/tools/csv-cleaner` | CSV/TSV, JSON and XLSX import; trim, deduplicate, remove empty rows, normalize headers, transform text, filter, split, merge, sort and convert dates | Preview before applying, undo/redo, reusable recipe JSON, optional local recipe storage, spreadsheet-safe CSV export, handoff to comparison |
| `/tools/spreadsheet-compare` | Match two tables by a unique ID; show added, removed, changed and unchanged records | Explicit duplicate/empty-key errors, optional whitespace normalization, key search, full CSV/JSON/XLSX difference reports |
| `/tools/batch-images` | Resize, center-crop, convert JPG/PNG/WebP, adjust lossy quality and add a text watermark | Before/after view, sequential processing, per-file failures, stop after current image, output ZIP with size report |
| `/tools/pdf-organizer` | Merge PDFs, select page ranges, reorder, rotate, duplicate, remove and split pages | Real thumbnails, undo/redo, optional page numbers/watermark, individual-page ZIP, download unchanged originals |
| `/tools/test-data-generator` | Seeded synthetic records, configurable fields and related resources | Valid parent IDs, repeatable seed, schema import/export, JSON/CSV/SQL ZIP, complete SQL foreign keys, handoff to cleaner |

## Install and publish

Use Node 24. Copy the update into the project that contains `package.json`, or use the complete project archive. Keep your own `.env.local`; no new credentials, database tables, Redis keys or services are required.

```sh
npm ci --include=dev
npm run typecheck
npm test
npm run build
npm run dev
```

After reviewing locally, commit the updated source and lockfile to your existing GitHub repository. Your existing Vercel connection can deploy that commit. The files in this release do not deploy themselves or update sukoaa.com automatically.

`npm ci` installs ExcelJS 4.4.0 and PDF.js 6.5.438. Existing pdf-lib and fflate are reused. `scripts/prepare-workbench.mjs` copies the PDF worker, fonts, CMaps and WASM from the installed package to `public/workbench/pdfjs`; it runs after installation and before development/build. Libraries load on the relevant route/operation. Existing compiler runtime preparation is retained. License copies are in `docs/licenses`.

## Privacy and storage

File contents are processed within the browser. These tools do not call an AI service or upload selected files. Website assets still load normally. Files remain in memory until the page is closed or the workspace is cleared. Downloads require an action. Cleaning recipes are stored locally only when you choose Save recipe locally. Explicit cross-tool table handoff uses sessionStorage, expires after ten minutes and is loaded only when you choose the handoff action. Do not put passwords or confidential credentials into test fixtures.

## Bounds and format limits

- Tables: up to 5 MB per input file, 50,000 rows, 80 columns and 20 million result characters. XLSX archives have an expanded-data budget of 60 MB and up to 20 worksheets. Values only: workbook styling, macros and formula recalculation are not preserved. Formulas use stored results. IDs remain text. Spreadsheet-safe CSV export is on by default; the raw-data option requires your choice.
- Recipes: up to 20 steps. Dates require explicit DMY, MDY or YMD interpretation. Splitting/combining adds columns and retains source columns. Undo/redo is local to the workspace.
- Comparison: keys must be non-empty and unique on each side. Comparisons are case-sensitive, text-based and independent of row order. Only the visible preview is bounded; report exports contain all compared records.
- Images: 30 files, 15 MB each, 100 MB total, source dimensions up to 24 megapixels; output at most 4096 px per side and 16 megapixels. JPG/PNG/WebP only. Animated files, SVG and HEIC are unsupported. JPEG uses white behind transparency. PNG is lossless and ignores the lossy quality control. Size reduction is not guaranteed. Re-encoding does not copy source metadata. There is no AI upscaling or background removal.
- PDFs: 15 MB per file, 30 MB total, 8 sources and 100 workspace pages. Up to 5 files per selection. Interactive forms and encrypted files are rejected. This is page organization, not a PDF text editor or secure redaction tool. Editing can invalidate signatures; keep signed originals. Watermarks accept up to 60 basic Latin characters.
- Fixtures: up to 8 resources, 30 fields per resource, 10,000 records per resource and 20,000 total records. References must form an acyclic parent-child graph. Generated people are synthetic; email domains use `example.test`. Phone numbers use a reserved fictional range. Generated SQL creates tables and must be reviewed before execution. It is intended for SQLite/PostgreSQL-compatible basic fixture loading, not a universal database migration.

## Verification

Final checks: Node 24.22.3, typecheck passed, 322/322 tests passed, production build passed. All six new pages have one server-rendered H1. Generated commerce SQL loaded in SQLite with foreign keys enabled, no foreign-key errors and all 100 orders joined to valid customers/products. The production dependency audit reported zero known vulnerabilities at check time. This is not a guarantee of security.

The automated test suite covers actual XLSX write/read, CSV quoting and spreadsheet escaping, immutable recipes, key-based differences, seeded references and SQL escaping, image geometry/header preflight, real PDF copy/reorder/rotation/duplicate exports and interactive-form rejection. The existing compiler/auth tests remain enabled.

The initial implementation received browser checks of sample flows and responsive layouts. A workspace restart required source recovery; the final recovered build was typechecked, rebuilt and regression-tested. Browser automation was unavailable after recovery, so fresh screenshots and a repeat browser end-to-end run of this exact recovered package are not claimed. Check the five sample buttons in your local browser before deploying publicly.
