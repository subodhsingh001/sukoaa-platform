# Step-by-step: run Sukoaa locally

## 1. Install and run

Install Node.js 22 LTS or a newer supported LTS from https://nodejs.org/ and VS Code from https://code.visualstudio.com/. Extract the ZIP into a folder such as `C:\Projects\sukoaa-platform`. In VS Code choose File → Open Folder and select that folder. Open Terminal → New Terminal.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Navigate to Workspace, select a runtime and press Run. Use Ctrl+Enter in the editor as a shortcut. Use Save local to keep one draft in this browser, Restore local draft to reopen it, or the download icon to export the source file. Changing languages replaces the example and prompts if there are unsaved edits.

No environment file is needed for browser-only tools. Stop the development server with Ctrl+C.

## 2. Register for Supabase

1. Open https://supabase.com/dashboard and create your own account.
2. Create a new project. Choose the available region nearest your initial users; for an India-focused launch, use a nearby India/Asia region if offered. Save the database password in a password manager.
3. Open SQL Editor → New query. Paste the complete `supabase/migrations/001_platform.sql` and run it once in a new project. It creates four public tables with RLS, indexes and triggers. It backfills profiles/roles for users who already exist.
4. Under project settings/API or the Connect dialog, copy the project URL and **publishable** API key. Do not use the service-role/secret key for this app.
5. Copy `.env.example` to `.env.local` in the project root. Fill `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `APP_ORIGIN=http://localhost:3000`. Do not include a trailing slash on APP_ORIGIN.
6. In Authentication settings enable Email/password and email confirmation. Set Site URL to `http://localhost:3000`. Add the local and future production URLs to the redirect allow list as required by your settings.
7. In the **Confirm signup** email template, use a custom confirmation link:

```html
<a href="{{ .SiteURL }}/account?token_hash={{ .TokenHash }}">Confirm your Sukoaa account</a>
```

The page clears the token hash from the address bar, then posts it to the server to verify an email confirmation. This release supports signup-confirmation links only, not recovery/invite links. Keep confirmation enabled and test with a real inbox. Configure a suitable SMTP provider before broad public signups; Supabase's default email delivery has limitations.

8. Restart `npm run dev`. Open `/setup` to see configuration status. Open `/account`, create an account, confirm the email, and sign in. Open Workspace → Save cloud, then Cloud projects to reopen it. Cloud updates preserve ownership.

For a deployment, change Supabase Site URL to the production origin and repeat the email test. Using one Supabase project for local and production means they share users/data; prefer a separate staging project when growth warrants it.

## 3. Register for Redis

1. Open https://console.upstash.com/ and register.
2. Create a Redis database in a region compatible with your app/database.
3. Copy its REST URL and write token into `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local`.
4. Restart the app. `/setup` should show Redis configured. This is presence detection; a real sign-in/project action verifies connectivity.

Production protected writes require Redis. Missing/unavailable Redis produces a controlled setup/service error. This avoids pretending an in-memory counter protects a multi-instance deployment. Local development without Redis uses a bounded in-memory limiter for convenient testing.

`TRUSTED_CLIENT_IP_HEADER` must identify a header your hosting proxy overwrites. Leave it blank until you verify that guarantee. Blank means one shared anonymous auth bucket, so it is safe but restrictive for multiple simultaneous signup users. Rate limits are not a substitute for Supabase's auth protections and monitoring.

## 4. Browser Python and optional Go runner

Python works locally after runtime assets are prepared; open `/workspace?language=python`. For Go remote execution, follow `docs/05-CODE-RUNTIMES.md`. Do not fill a random public endpoint or assume free shared execution access. This is a separate service you must choose and operate or subscribe to.

## 5. Commands before deployment

```bash
npm run typecheck
npm test
npm run build
npm start
```

`npm start` runs production mode. On localhost set APP_ORIGIN correctly, but browser Secure cookies require HTTPS for normal production-host use. Use development mode for ordinary local account testing; test production accounts on an HTTPS staging deployment.

If generated runtime assets are missing, run `npm run prepare:runtimes`. If installing from a registry fails, check your own network access; the ZIP does not include node_modules.
