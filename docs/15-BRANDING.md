# Sukoaa logo update

The website uses the geometric S mark in forest green (#204B40) and lime (#D9EEA2).

## Files

- `public/brand/`: SVG logos, PNG app icons and font license.
- `public/favicon.svg` and `public/favicon.ico`: browser tab icons.
- `public/social/sukoaa.png`: social sharing preview.
- `components/SukoaaLogo.tsx`: shared React logo.
- `app/layout.tsx`: favicon metadata and organization logo.

Keep the DejaVu font license in the distribution; wordmark lettering is outlined DejaVu Sans Bold. No external font request is required.

## Use in a page

```tsx
import { SukoaaLogo } from '@/components/SukoaaLogo';

<a href="/" aria-label="Sukoaa home"><SukoaaLogo height={34} /></a>
<SukoaaLogo variant="reverse" height={34} />
<SukoaaLogo variant="icon" height={40} />
```

The reverse variant is for dark backgrounds. The mark variant is the S alone.

## Update your existing GitHub/Vercel project

1. Copy this release over your existing source folder. Keep your local `.env.local`. Do not commit credentials.
2. Run `npm ci --include=dev` with Node.js 24, then `npm run build`.
3. Run `git add .`, `git commit -m "Update Sukoaa website branding"`, and `git push`.
4. Vercel rebuilds automatically if your repository is connected. Otherwise redeploy from its dashboard.
5. Hard-refresh the page; favicons may stay cached until a new tab or browser restart.

No database migration or Redis change is needed. This release changes website branding; it does not replace icons packaged into a separate desktop browser or Chrome extension.
