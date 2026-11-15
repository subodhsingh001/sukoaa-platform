# Types Studio — v0.19.0

Open `/tools/json-to-typescript` from Tools, its homepage card, or the Learn menu. Paste a JSON/JSON5 sample, choose interface/type/Zod, and copy or download the generated `.ts` file. No account, backend or database migration is required. Files are read locally, samples are not autosaved, and the converter makes no network calls.

- Named nested declarations; merged arrays of objects; missing fields automatically optional; mixed types and nulls form unions.
- Optional mode applies recursively. Root arrays and primitives use aliases even in interface mode.
- String enum detection: 2–12 distinct values at a field, with at least one repeated value; toggle off when samples are not representative.
- Empty arrays use unknown items. Strings that look like dates stay strings. Review inferred contracts before production use.
- JSON5 accepts comments, trailing commas, unquoted keys and single quotes. Executable expressions, non-finite numbers, samples over 100,000 characters, over 20,000 values or over 40 levels are rejected.
- Zod output uses object/array/union/enum/optional APIs compatible with Zod 3 and 4. Install Zod in the consuming project; this is schema generation, not full API contract discovery.

Six learning tracks are now explicitly linked on the homepage, Tools page and Learn menu: `/play/tracks/fastapi`, `/play/tracks/nodejs`, `/play/tracks/postgresql`, `/play/tracks/tailwindcss`, `/play/tracks/php`, `/play/tracks/laravel`. PostgreSQL and Tailwind have browser labs. Node's browser HTTP lab is experimental. FastAPI, PHP and Laravel full applications run from local starter downloads.

Deploy the complete project to your GitHub/Vercel setup with `npm ci --include=dev` and `npm run build`. Existing environment values stay unchanged. Existing compiler files are unchanged by this release. Native ChatGPT Site publication is separate from www.sukoaa.com.
