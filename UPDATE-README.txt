SUKOAA FULL UPDATE (on top of your deploy.zip)
Copy everything in this folder over your project, keeping the paths. Then:
  npm ci            (package-lock.json changed: adds gpt-tokenizer for the token counter)
  npm run typecheck && npm test && npm run build

IMPORTANT for the sitemap: sitemap.xml is generated when you BUILD. Set SITE_URL=https://www.sukoaa.com
and SITE_INDEXING_ENABLED=true as build-time environment variables, otherwise it will be empty.
Expected result: 167 URLs, no duplicates.

New:  /tools/rag-playground, token-counter, jwt-decoder, base64-url-encoder, hash-generator, uuid-generator, color-converter
      /api/demo/chat/completions (fake streaming LLM API), /og (per-page share images)
      Play tracks: LLM API basics, RAG fundamentals (12 new exercises)
      Share links, Ctrl+K search, homepage compiler section, contrast fixes, static exercise pages, cache headers
Verified here: typecheck OK, 226 tests pass on Node 24, production build OK, every sitemap URL returned 200.
NOT verified here: real browser behaviour (embedding model download, WebGPU-free generation, mobile layout).

Docker users: build with
  docker build --build-arg SITE_URL=https://www.sukoaa.com --build-arg APP_ORIGIN=https://www.sukoaa.com --build-arg SITE_INDEXING_ENABLED=true -t sukoaa .
(Vercel injects these automatically if they are set in Project Settings > Environment Variables for Production.)
