# Sukoaa website branding

The website uses the orbital/circuit artwork supplied by the project owner. The original 1536 × 1024 PNG bytes are preserved in `public/brand/proposed-logo.png`. The existing filename/URL is retained for organization, Apple icon and metadata compatibility.

## Display and assets

- `components/SukoaaLogo.tsx` displays the exact image through SVG viewports. The compact lockup pairs the symbol and wordmark. `variant="tagline"` includes the supplied Since 2026 line. No artwork is redrawn.
- Shared header: navy `#021d3f`. Reading/editing surfaces: near-white. Light-surface controls: dark teal `#075e60`. Bright cyan is reserved for the artwork and focus on navy. The footer uses a navy logo tile.
- `public/brand/approved-favicon.svg` and `public/favicon.svg` embed cropped views of the same original PNG. The original is about 2 MB; the self-contained SVG files also embed those bytes. Browser caching reuses the PNG across header/footer references. No particular load time is promised.
- `public/social/sukoaa.png` retains its existing URL and contains the supplied 1536 × 1024 image. Dynamic `/og` images retain the 1200 × 630 layout with navy colours.
- `/brand-preview` is the existing noindex reference page. The compact header omits the small date line for readability; the full original remains visible there.

Obsolete unreferenced S-mark/wordmark variants and the old fallback ICO were removed. The historical DejaVu font license is retained as provenance. This does not establish copyright/trademark clearance or an independently verified founding date. Website branding does not replace icons bundled into the separate desktop browser or extensions.

## Update your project

1. Extract the complete project ZIP and copy the source into your checkout. Keep your own `.env.local` private.
2. Use Node.js 24. Run `npm ci --include=dev`, `npm run typecheck`, `npm test` and `npm run build`.
3. Commit and push the reviewed source. Your connected Vercel project can rebuild from that push.
4. Reload the website. Favicons may remain cached until a new tab or browser restart.

No database migration or Redis change is required.
