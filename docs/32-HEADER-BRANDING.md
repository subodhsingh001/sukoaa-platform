# Green header and transparent logo

Updated 20 November 2026.

- The shared website and editor headers use the requested `#134741` background.
- `public/brand/logo-transparent-v1.png` is a genuine RGBA PNG with transparency. It preserves the original canvas dimensions, white SUKOAA wordmark, turquoise circuit symbol and date line. It was produced by background extraction from the existing artwork.
- `components/SukoaaLogo.tsx` uses that new asset and a transparent SVG background. The existing compact, wordmark and tagline viewports remain intact, so desktop and phone sizing is preserved.
- Menu hover, border and secondary text colours were adjusted to green-compatible values. The footer's existing logo plate and the brand reference preview share the updated chrome colour.
- The self-contained favicon embeds the transparent artwork's circuit-symbol crop. The original `proposed-logo.png` remains available as the source/reference image. Existing metadata, canonical tags and structured data are retained.

## Files in the branding patch

Copy the patch's `app`, `components`, `public` and `docs` directories into the root of your existing `sukoaa-platform` project, merging directories and replacing matching files. Do not replace the whole repository with the small patch. The full project ZIP is an alternative containing the complete platform, including the system design course.

The new PNG path avoids reusing a cached opaque logo asset. Commit the changed files and redeploy your existing Vercel project to publish the update. This preparation did not push to GitHub or deploy the site.

## Validation

Node 24 typecheck, all 301 existing tests and the production build passed. No tests were added, removed or weakened for this visual update. All compiler/runtime, authentication, database and course implementation source remains unchanged.

Production HTML and static assets were checked in the browser at 375, 768 and 1280 px widths. The computed header background is `rgb(19, 71, 65)` and the logo wrapper background is `rgba(0, 0, 0, 0)`. Each layout fits without horizontal document overflow. The mobile menu opens and closes with Escape. The JavaScript workspace's editor header also uses the new green and transparent logo.
