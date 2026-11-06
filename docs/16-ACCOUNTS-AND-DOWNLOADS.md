# Accounts and GitHub browser downloads (v0.8.0)

## Account behavior

- Sign in: inline email/password errors, visible server or network errors, loading state, then home redirect after a real session is established.
- Signup: passwords must match. Email-confirmation requests show a persistent Check your inbox panel. An unconfirmed account is never treated as signed in.
- Email confirmation: verified callback creates HttpOnly session cookies, then redirects home with a success notice.
- Signed-in pages show My account and Sign out. The account page hides the guest invitation while signed in. Home replaces No account needed with Your workspace is ready.
- No credentials or tokens are stored in localStorage. The one-use home notice contains only a fixed success message.
- Current provider configuration and real email delivery still need a live check by the site owner.

## Production settings for www.sukoaa.com

Vercel Production:

```env
APP_ORIGIN=https://www.sukoaa.com
SITE_URL=https://www.sukoaa.com
```

Supabase Authentication > URL Configuration: Site URL `https://www.sukoaa.com`; allow `https://www.sukoaa.com/account`. Redeploy Vercel after environment changes. Keep the origin guard enabled; a www/non-www mismatch returns 403. Supabase and Upstash settings remain required for protected production actions.

## Option A: one GitHub release-page button (no database edits)

1. In your browser repository, open Releases. Publish a release with actual installer/APK assets and matching license/source notices. Visitors must be able to access it without signing into GitHub; drafts and private repositories are unsuitable for public downloads.
2. Open that release in a private browser window to verify access. Copy its URL.
3. Set `BROWSER_RELEASE_URL` in Vercel Production to that exact URL. Accepted forms: `https://github.com/OWNER/REPO/releases/tag/TAG` or `https://github.com/OWNER/REPO/releases/latest`.
4. Redeploy. /browser and /downloads show View GitHub release. Visitors choose the asset on GitHub.

No URL is prefilled because the public API did not expose a latest release for the supplied repository during implementation. A 404 does not establish whether the repository is private or simply has no public latest release.

## Option B: direct Windows/Android buttons with checksums

1. Sign into Sukoaa with your own account. In Supabase SQL Editor (owner operation only), grant that account the existing admin role:

```sql
update public.app_roles
set role = 'admin'
where user_id = (select id from auth.users where email = 'YOUR_ACCOUNT_EMAIL');
```

Do not substitute a visitor's email. New users cannot choose their own role.

2. Visit `/admin` on your site. For each installer/APK, enter Product name, actual Version, Platform, the exact HTTPS asset link copied from GitHub Releases > Assets, and the final file's SHA256. Select Publish and Save release.
3. Open `/downloads` in a private browser window and test the link. Repeat for each platform. This uses the existing releases table; no new migration is needed.

GitHub asset URL shape (example only, not a verified download):

```text
https://github.com/OWNER/REPO/releases/download/TAG/ASSET_FILENAME
```

On Windows, calculate the final installer checksum:

```powershell
(Get-FileHash "C:\path\to\YOUR-INSTALLER.exe" -Algorithm SHA256).Hash.ToLower()
```

Use versioned asset links with their matching checksums. A moving latest-download URL can change underneath a stored checksum. GitHub Actions artifacts and source-code ZIP links are not installer links. Never embed a GitHub access token in a public download URL. Public availability does not mean store approval, signing, or an independent security review.

Browser installers do not need a Chrome Web Store listing. Chrome extensions have a separate publishing process; store links remain configured via the existing CHROME_STORE_* environment variables.

## Apply this update

Copy the source release into your existing platform checkout, preserving `.env.local`. Run `npm ci --include=dev`, `npm test`, and `npm run build` using Node 24. Commit and push to the connected GitHub repository; Vercel then rebuilds. This source ZIP does not itself update your GitHub or Vercel account.
