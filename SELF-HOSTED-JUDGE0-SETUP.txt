SUKOAA SELF-HOSTED JUDGE0 - DEPLOYMENT GUIDE
Prepared 13 November 2026. No hosted API subscription is required.

STATUS
The deployment files are prepared and tested at configuration/helper level.
The compiler containers have NOT been started or live-tested in the ChatGPT
workspace: it has no Docker CLI/daemon or your server credentials.
Do not describe the public compilers as live until verify passes on your host.

WHAT YOU NEED
- A dedicated Linux x86_64 server/VM with Docker Engine + Compose plugin,
  Python 3, a public IP, and ports 80/443 reachable.
- For this small configuration, plan roughly 2 vCPUs, 4 GB RAM and 20 GB disk.
  This is a starting allocation, not a concurrency/performance guarantee.
- Follow Judge0 v1.13.1's documented cgroup-v1 host setup. Ubuntu 22.04 is
  the upstream recommendation. check-host refuses cgroup v2; it does not
  modify GRUB, reboot the host, or disable checks automatically.
- A real certificate contact email and DNS access for runner.sukoaa.com.
- Docker install: https://docs.docker.com/engine/install/ubuntu/
- Upstream deployment/host instructions:
  https://github.com/judge0/judge0/blob/v1.13.1/CHANGELOG.md

ISOLATION REQUIREMENT
Judge0's documented server/worker containers use privileged mode for the
isolate sandbox. Run this stack on its own VM, not alongside Sukoaa's web
server, personal files or other sensitive services. Docker memory limits,
network isolation and authentication are configured; they are not a formal
security audit. Keep the host and pinned containers maintained.
The worker/database/Redis network is internal. No database, Redis or Judge0
API host port is published in the production Compose file. Only Caddy's
HTTP/HTTPS ports are public. The local-test override binds API port 2358
only to 127.0.0.1 and must not be used for public access.

1. COPY THIS FOLDER TO YOUR SERVER
From Windows PowerShell in the Sukoaa project folder, replacing server IP/user:

scp -r .\deploy\judge0 ubuntu@YOUR_SERVER_IP:~/sukoaa-judge0
ssh ubuntu@YOUR_SERVER_IP
cd ~/sukoaa-judge0

The folder is self-contained and includes six smoke-test source files.
Do not upload an existing generated configuration to public GitHub.

2. ADD DNS IN SPACESHIP
For sukoaa.com, add an A record:
Host: runner
Value: YOUR_SERVER_PUBLIC_IPV4
TTL: provider default

Only add an AAAA record if the server is also reachable over IPv6.
Use DNS-only resolution while first testing HTTPS. The hostname alone does
not start a server; it must point to the Linux host running this stack.

3. GENERATE PRIVATE CONFIGURATION ON THAT HOST
Replace the email with your real certificate contact address:

python3 manage.py init --domain runner.sukoaa.com --email YOUR_REAL_EMAIL
python3 manage.py check-host

init creates .env and judge0.conf with randomly generated credentials, mode
600, and a private .generated directory. It does not print secrets or
silently overwrite an existing configuration. Back up these private files.
The config disables networking from submissions, callbacks, additional
files, custom compiler flags, command arguments, batching and deletion.
Queue size is 20 with one compilation worker. Per-run limits match Sukoaa.
Judge0 uses its own internal Postgres and Redis containers; these are
separate from your existing Supabase and Upstash accounts.

4. START THE STACK
Once DNS points to the server and the host checks pass:

python3 manage.py up

Caddy automatically obtains the HTTPS certificate for the configured name.
This can take time while DNS propagates and containers initialize. Keep
only SSH access and HTTP/HTTPS reachable; do not publish port 2358, 5432
or 6379. Use your host provider's firewall for these rules.

5. RUN REAL SERVICE TESTS

python3 manage.py verify

The verifier requires invalid authentication to be rejected and checks that
the runner rejects an attempt to enable outbound networking. It detects
installed C, C++, Rust, C#, Java and Go compilers, then compiles/runs each
standard-library demo with input Sukoaa and checks exact stdout:

Hello, Sukoaa!
Sum of squares: 55

It selects the highest listed matching language ID and prints compiler
names for review. Choose explicit installed versions if necessary:

python3 manage.py verify --id c=YOUR_ID --id cpp=YOUR_ID

No successful health or compiler claim is made until these live tests pass.
A failed test stops without exporting new Vercel settings. Check container
readiness, provider/compiler compatibility and logs before retrying. HTTP
or polling timeouts can indicate startup delay, load or resource limits.

6. CONNECT SUKOAA ON VERCEL
Only after all six production smoke tests pass, open this private file ON
YOUR SERVER (do not commit it or send its contents to chat):

.generated/vercel.env

Copy its values into Vercel > sukoaa-platform > Settings > Environment
Variables > Production. It contains:
JUDGE0_URL
JUDGE0_AUTH_TOKEN
JUDGE0_C_ID
JUDGE0_CPP_ID
JUDGE0_RUST_ID
JUDGE0_CSHARP_ID
JUDGE0_JAVA_ID
JUDGE0_GO_ID

Unset JUDGE0_RAPIDAPI_KEY for this self-hosted endpoint. Keep existing
Supabase, APP_ORIGIN and Upstash settings. Redeploy Vercel. Open Sukoaa,
sign in, and test each language. Then check error-line navigation too.
The existing /api/status flags indicate configuration, not live health.

LOCAL-ONLY CONTAINER TEST (SUPPORTED LINUX HOST)
After init/check-host, you may test without public DNS or TLS:

python3 manage.py up --local
python3 manage.py verify --local

This starts only db, redis, server and worker, with the API bound to
127.0.0.1:2358. Local verification NEVER exports production settings.
Sukoaa's production integration still requires trusted HTTPS. Do not bypass
TLS validation or expose the loopback HTTP port to the internet.

STOP WITHOUT REMOVING DATA
python3 manage.py down
Use down --local if you started the local override. These commands preserve
named database, Redis and certificate volumes. No reset/delete-volumes
command is supplied. Back up data and private configuration before upgrades.

TEST DEPLOYMENT HELPER WITHOUT DOCKER
python3 -m unittest discover -s . -p test_manage.py -v
These unit tests mock the HTTP runner. They test configuration and fail-closed
behavior, not actual container isolation or language execution.

NOTES
Judge0 software is GPL-3.0; you manage the machine, updates, capacity and
hosting costs. Container image digests are pinned in compose.yaml. Before
upgrades, review upstream security notes, update pins deliberately, back up,
and rerun all smoke tests. AI remains disabled in the Sukoaa platform.
