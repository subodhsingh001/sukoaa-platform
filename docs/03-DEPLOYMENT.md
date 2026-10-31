# Where to register, upload and deploy

Guidance checked against official sources on 31 October 2026. Provider dashboards, quotas and terms can change. This project does not create paid accounts or deploy into your external accounts automatically.

## Accounts

| Service | Register/manage | Purpose |
| --- | --- | --- |
| GitHub | https://github.com/signup | Source control and deployment integration |
| Supabase | https://supabase.com/dashboard | Auth + PostgreSQL |
| Upstash | https://console.upstash.com/ | Shared rate limits and expiring runner jobs |
| Vercel (one option) | https://vercel.com/signup | Standard Next.js deployment |
| Judge0 host/provider (optional) | https://judge0.com/ | Isolated Python/Go execution |
| Domain registrar (later) | Your preferred registrar | Custom Sukoaa domain; verify availability independently |

## A. Upload the portable project to GitHub

1. Create a **private** repository named `sukoaa-platform` at https://github.com/new. You can change visibility later deliberately.
2. Use GitHub Desktop, Git commands, or GitHub's upload-files page to add the extracted project contents. Keep `package.json` at the repository root, alongside `app/`, `lib/`, `public/`, `supabase/` and `docs/`.
3. Do not upload `.env.local`, node_modules, .next, access tokens or ZIP copies. The provided .gitignore covers normal local build artifacts.
4. Push a commit. With Git installed:

```bash
git init
git add .
git commit -m "Add Sukoaa platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sukoaa-platform.git
git push -u origin main
```

Replace YOUR_USERNAME with your actual GitHub user. Review staged files before pushing; the instructions do not create a repository for you.

## B. Deploy standard Next.js on Vercel

1. Register at Vercel and select Add New → Project → Import Git Repository.
2. Choose the repository and the Next.js framework preset. Root directory is the folder containing package.json. Install command: `npm ci`; build command: `npm run build`. Do not select a static-only export.
3. For browser tools only, deploy without Supabase variables first if desired. For accounts/cloud saving add the server variables from `.env.example` in Project → Settings → Environment Variables. Redis is required for protected production actions.
4. After the initial URL is known, set `APP_ORIGIN=https://YOUR_EXACT_HOST` with no trailing slash. Do not put multiple origins or paths there. Redeploy after changing environment variables.
5. Change Supabase Authentication Site URL and email template/allowed redirects to the same final origin. Test a new signup and confirmation link.
6. For Python/Go configure the runner URL, credentials and the IDs returned by its installed `/languages` endpoint; then redeploy.
7. Add your custom domain using the provider's Domains screen and copy the exact DNS records to your domain registrar. After it is verified, update APP_ORIGIN and Supabase Site URL again.
8. Review the security and two-user tests before opening registration broadly.

Vercel Hobby is for personal, non-commercial use. Because you want Sukoaa to become a business, do not assume Hobby is the long-term eligible plan. Choose a suitable commercial plan or another host whose current terms support your use. No “free forever at unlimited scale” claim is made.

Official: https://vercel.com/docs/plans/hobby and https://vercel.com/legal/terms

## C. Deploy as a Docker container

The included Dockerfile builds a standard Next.js standalone server. It does not contain or run Judge0.

```bash
docker build -t sukoaa-platform .
docker run --env-file .env.local -p 3000:3000 sukoaa-platform
```

Or `docker compose up --build`. Put the service behind an HTTPS reverse proxy, and set APP_ORIGIN to its public HTTPS origin. Keep private environment files out of the image; `.dockerignore` excludes them. Supabase and Upstash remain external managed services. A VPS/container host, domain and runner may incur costs. The Dockerfile is supplied but was not run in this environment.

## D. What “free” means here

Next.js/React/TypeScript are software dependencies; your users' browser executes the basic playground. Supabase and Upstash offer plans with allowances, but quotas, inactivity behavior, backups, bandwidth and overage rules must be checked in their current consoles. A remotely executed Python/Go job consumes someone else's CPU/memory. AI is disabled, so there is no AI usage in this release. A custom domain and a commercially eligible host may not be free.

Start with browser tools and a small private beta. Add remote compute only after checking quotas and abuse controls. Add billing before offering large paid compute allowances.

## Official references

- Next.js deployment: https://nextjs.org/docs/app/getting-started/deploying
- Supabase setup: https://supabase.com/docs/guides/getting-started
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Upstash REST: https://upstash.com/docs/redis/features/restapi
- Judge0 API: https://ce.judge0.com/
