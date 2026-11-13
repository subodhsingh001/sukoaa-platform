#!/usr/bin/env python3
"""Self-host deployment helper. Python 3 standard library; never prints secrets."""
import argparse
import base64
import json
import os
from pathlib import Path
import platform
import re
import secrets
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent
LANGUAGES = {
    'c': ('JUDGE0_C_ID', r'^C\s*\(', 'main.c'),
    'cpp': ('JUDGE0_CPP_ID', r'^C\+\+\s*\(', 'main.cpp'),
    'rust': ('JUDGE0_RUST_ID', r'^Rust\s*\(', 'main.rs'),
    'csharp': ('JUDGE0_CSHARP_ID', r'^C#\s*\(', 'Main.cs'),
    'java': ('JUDGE0_JAVA_ID', r'^Java\s*\(', 'Main.java'),
    'go': ('JUDGE0_GO_ID', r'^Go\s*\(', 'main.go'),
}
POLICY = {
    'JUDGE0_TELEMETRY_ENABLE': 'false', 'RAILS_ENV': 'production',
    'ENABLE_WAIT_RESULT': 'false', 'ENABLE_COMPILER_OPTIONS': 'false',
    'ENABLE_COMMAND_LINE_ARGUMENTS': 'false', 'ENABLE_SUBMISSION_DELETE': 'false',
    'ENABLE_BATCHED_SUBMISSIONS': 'false', 'ENABLE_CALLBACKS': 'false',
    'ENABLE_ADDITIONAL_FILES': 'false', 'ALLOW_ENABLE_NETWORK': 'false',
    'ENABLE_NETWORK': 'false', 'COUNT': '1', 'MAX_QUEUE_SIZE': '20',
    'CPU_TIME_LIMIT': '2', 'MAX_CPU_TIME_LIMIT': '2',
    'CPU_EXTRA_TIME': '0.5', 'MAX_CPU_EXTRA_TIME': '0.5',
    'WALL_TIME_LIMIT': '5', 'MAX_WALL_TIME_LIMIT': '5',
    'MEMORY_LIMIT': '128000', 'MAX_MEMORY_LIMIT': '256000',
    'STACK_LIMIT': '64000', 'MAX_STACK_LIMIT': '64000',
    'MAX_PROCESSES_AND_OR_THREADS': '64', 'MAX_MAX_PROCESSES_AND_OR_THREADS': '64',
    'ENABLE_PER_PROCESS_AND_THREAD_TIME_LIMIT': 'false',
    'ALLOW_ENABLE_PER_PROCESS_AND_THREAD_TIME_LIMIT': 'false',
    'ENABLE_PER_PROCESS_AND_THREAD_MEMORY_LIMIT': 'false',
    'ALLOW_ENABLE_PER_PROCESS_AND_THREAD_MEMORY_LIMIT': 'false',
    'MAX_FILE_SIZE': '1024', 'MAX_MAX_FILE_SIZE': '1024',
    'NUMBER_OF_RUNS': '1', 'MAX_NUMBER_OF_RUNS': '1',
    'RAILS_MAX_THREADS': '2', 'RAILS_SERVER_PROCESSES': '1',
    'REDIS_HOST': 'redis', 'POSTGRES_HOST': 'db',
    'POSTGRES_DB': 'judge0', 'POSTGRES_USER': 'judge0',
    'AUTHN_HEADER': 'X-Auth-Token', 'AUTHZ_HEADER': 'X-Auth-User',
}


def valid_domain(value):
    return len(value) <= 253 and bool(re.fullmatch(r'(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}', value))


def private_write(path, text):
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    fd = os.open(str(path), flags, 0o600)
    with os.fdopen(fd, 'w', encoding='utf-8') as stream:
        stream.write(text)


def env_text(values):
    return ''.join(f'{key}={value}\n' for key, value in values.items())


def initialize(root, domain, email):
    if not valid_domain(domain) or domain.endswith('.example'):
        raise ValueError('Use your real DNS hostname, for example runner.sukoaa.com.')
    if not re.fullmatch(r'[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}', email):
        raise ValueError('Use a valid certificate contact email.')
    targets = [root / '.env', root / 'judge0.conf']
    if any(p.exists() or p.is_symlink() for p in targets):
        raise ValueError('Configuration already exists; it was not overwritten. Back it up before changing it.')
    if (root / '.generated').is_symlink():
        raise ValueError('Generated output directory must not be a symlink.')
    token, pg, redis, authz, rails = [secrets.token_hex(32) for _ in range(5)]
    env = {'RUNNER_DOMAIN': domain, 'ACME_EMAIL': email, 'JUDGE0_AUTH_TOKEN': token,
           'POSTGRES_PASSWORD': pg, 'REDIS_PASSWORD': redis}
    config = dict(POLICY, AUTHN_TOKEN=token, AUTHZ_TOKEN=authz,
                  POSTGRES_PASSWORD=pg, REDIS_PASSWORD=redis, SECRET_KEY_BASE=rails)
    private_write(targets[0], env_text(env))
    private_write(targets[1], env_text(config))
    generated = root / '.generated'
    generated.mkdir(mode=0o700, exist_ok=True)
    print('Created private .env and judge0.conf files. Secrets were not printed.')


def read_env(path):
    if path.is_symlink():
        raise ValueError('Configuration must be a regular file, not a symlink.')
    if os.name == 'posix' and path.stat().st_mode & 0o077:
        raise ValueError('Configuration permissions must be private (chmod 600).')
    result = {}
    for row in path.read_text().splitlines():
        if row.strip() and not row.lstrip().startswith('#'):
            key, value = row.split('=', 1)
            result[key] = value
    return result


def configuration(root):
    env, conf = read_env(root / '.env'), read_env(root / 'judge0.conf')
    if not valid_domain(env.get('RUNNER_DOMAIN', '')):
        raise ValueError('Invalid configured domain.')
    for key, value in POLICY.items():
        if conf.get(key) != value:
            raise ValueError('Runner policy changed: ' + key + '. Review it before starting.')
    token = env.get('JUDGE0_AUTH_TOKEN', '')
    if not re.fullmatch('[a-f0-9]{64}', token) or conf.get('AUTHN_TOKEN') != token:
        raise ValueError('Runner authentication is missing or inconsistent.')
    for key in ['POSTGRES_PASSWORD', 'REDIS_PASSWORD']:
        if not re.fullmatch('[a-f0-9]{64}', env.get(key, '')) or conf.get(key) != env[key]:
            raise ValueError(key + ' is missing or inconsistent.')
    for key in ['AUTHZ_TOKEN', 'SECRET_KEY_BASE']:
        if not re.fullmatch('[a-f0-9]{64}', conf.get(key, '')):
            raise ValueError(key + ' is missing or invalid.')
    return env


def check_host():
    if platform.system() != 'Linux' or platform.machine() not in ['x86_64', 'amd64']:
        raise ValueError('This deployment targets a dedicated Linux x86_64 Docker host. Do not start it on the web host.')
    if Path('/sys/fs/cgroup/cgroup.controllers').exists():
        raise ValueError('This host uses cgroup v2. Judge0 v1.13.1 documents cgroup v1 setup; review its official host instructions before continuing. No boot settings were changed.')
    if not shutil.which('docker'):
        raise ValueError('Docker is not installed. Install Docker Engine and the Compose plugin first.')
    subprocess.run(['docker', 'info'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, timeout=15)
    subprocess.run(['docker', 'compose', 'version'], stdout=subprocess.DEVNULL, check=True, timeout=15)
    if shutil.disk_usage(ROOT).free < 10 * 1024**3:
        raise ValueError('Less than 10 GiB free disk space; make space before downloading compiler images.')
    print('Linux, cgroup mode, Docker daemon, Compose and disk checks passed.')


def compose(root, args, local=False):
    command = ['docker', 'compose', '-f', str(root / 'compose.yaml')]
    if local:
        command += ['-f', str(root / 'compose.local.yaml')]
    subprocess.run(command + args, cwd=root, check=True, env={**os.environ, **read_env(root / '.env')})


def select_languages(rows, overrides):
    if not isinstance(rows, list):
        raise ValueError('Invalid /languages response.')
    selected = {}
    for language, (_, pattern, _) in LANGUAGES.items():
        matches = [r for r in rows if isinstance(r, dict) and isinstance(r.get('id'), int)
                   and r['id'] > 0 and isinstance(r.get('name'), str) and re.match(pattern, r['name'])]
        if language in overrides:
            matches = [r for r in matches if r['id'] == overrides[language]]
        if not matches:
            raise ValueError('No compatible installed compiler found for ' + language)
        selected[language] = max(matches, key=lambda r: r['id'])
    return selected


def api(url, token, path, data=None):
    req = urllib.request.Request(url + path, data=json.dumps(data).encode() if data is not None else None,
        headers={'X-Auth-Token': token, 'Content-Type': 'application/json'}, method='POST' if data is not None else 'GET')
    # Do not forward authentication across a provider redirect.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *args):
            return None
    with urllib.request.build_opener(NoRedirect).open(req, timeout=12) as response:
        raw = response.read(256001)
        if len(raw) > 256000:
            raise ValueError('Runner response exceeded the verification size limit.')
        return json.loads(raw)


def endpoint(env, local):
    return 'http://127.0.0.1:2358' if local else 'https://' + env['RUNNER_DOMAIN']


def submission(language, source, language_id):
    return {'language_id': language_id, 'source_code': base64.b64encode(source.encode()).decode(),
        'stdin': base64.b64encode(b'Sukoaa\n').decode(), 'cpu_time_limit': 2, 'wall_time_limit': 5,
        'memory_limit': 256000 if language in ['java', 'csharp'] else 128000,
        'max_processes_and_or_threads': 64 if language in ['java', 'csharp'] else 16,
        'max_file_size': 1024, 'number_of_runs': 1, 'enable_network': False}


def verify(root, local=False, overrides=None):
    env = configuration(root)
    generated = root / '.generated'
    if generated.is_symlink():
        raise ValueError('Generated output directory must not be a symlink.')
    generated.mkdir(mode=0o700, exist_ok=True)
    previous_export = generated / 'vercel.env'
    if not local and (previous_export.exists() or previous_export.is_symlink()):
        if previous_export.is_symlink():
            raise ValueError('Generated settings must not be a symlink.')
        previous_export.unlink()
    url, token = endpoint(env, local), env['JUDGE0_AUTH_TOKEN']
    try:
        api(url, 'incorrect-token', '/languages')
    except urllib.error.HTTPError as error:
        if error.code != 401:
            raise ValueError('Expected an HTTP 401 response for invalid authentication.') from None
    else:
        raise ValueError('Runner accepted an invalid token; verification stopped.')
    selected = select_languages(api(url, token, '/languages'), overrides or {})
    for language, row in selected.items():
        print(language + ': ' + str(row['id']) + ' - ' + row['name'])
    # An unsafe network override must be rejected by the runner itself.
    unsafe = submission('c', 'int main(void){return 0;}', selected['c']['id'])
    unsafe['enable_network'] = True
    try:
        api(url, token, '/submissions?base64_encoded=true&wait=false', unsafe)
    except urllib.error.HTTPError as error:
        details = error.read(10000).decode(errors='replace')
        if error.code != 422 or 'enable_network' not in details:
            raise ValueError('Could not confirm the runner rejects network overrides.') from None
    else:
        raise ValueError('Runner accepted a network override; verification stopped.')
    report = {'endpoint': url, 'local_only': local, 'authentication': 'passed', 'network_override': 'rejected', 'languages': {}}
    for language, (_, _, filename) in LANGUAGES.items():
        source = (root / 'demos' / language / filename).read_text()
        response = api(url, token, '/submissions?base64_encoded=true&wait=false', submission(language, source, selected[language]['id']))
        job = response.get('token', '')
        if not re.fullmatch('[A-Za-z0-9-]{10,100}', job):
            raise ValueError('Runner returned an invalid submission token.')
        for _ in range(80):
            result = api(url, token, '/submissions/' + job + '?base64_encoded=true&fields=status,stdout,stderr,compile_output')
            if result.get('status', {}).get('id') not in [1, 2]:
                break
            time.sleep(0.5)
        else:
            raise ValueError(language + ' did not finish within the verification polling window.')
        stdout = base64.b64decode(result.get('stdout') or '', validate=True).decode().replace('\r\n', '\n')
        if result.get('status', {}).get('id') != 3 or stdout != 'Hello, Sukoaa!\nSum of squares: 55\n':
            raise ValueError(language + ' smoke test failed. Review compiler compatibility and private runner logs; no Vercel settings were exported.')
        report['languages'][language] = {'id': selected[language]['id'], 'name': selected[language]['name'], 'status': 'passed'}
        print(language + ': compile, imports, stdin and stdout PASS')
    generated = root / '.generated'
    generated.mkdir(mode=0o700, exist_ok=True)
    # Overwrite only this helper's generated outputs after the entire suite passes.
    report_path = generated / 'smoke-report.json'
    if report_path.exists():
        if report_path.is_symlink():
            raise ValueError('Generated report must not be a symlink.')
        report_path.unlink()
    private_write(report_path, json.dumps(report, indent=2) + '\n')
    if local:
        print('Local checks passed. No production settings exported; deploy HTTPS and verify again.')
    else:
        target = generated / 'vercel.env'
        if target.exists():
            if target.is_symlink():
                raise ValueError('Generated settings must not be a symlink.')
            target.unlink()
        private_write(target, env_text({'JUDGE0_URL': url, 'JUDGE0_AUTH_TOKEN': token,
            **{metadata[0]: str(selected[language]['id']) for language, metadata in LANGUAGES.items()}}))
        print('All six smoke tests passed. Private Vercel settings written to .generated/vercel.env; no secrets printed.')
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    init = sub.add_parser('init'); init.add_argument('--domain', required=True); init.add_argument('--email', required=True)
    sub.add_parser('check-host')
    up = sub.add_parser('up'); up.add_argument('--local', action='store_true')
    down = sub.add_parser('down'); down.add_argument('--local', action='store_true')
    smoke = sub.add_parser('verify'); smoke.add_argument('--local', action='store_true'); smoke.add_argument('--id', action='append', default=[], metavar='LANGUAGE=ID')
    args = parser.parse_args()
    try:
        if args.command == 'init':
            initialize(ROOT, args.domain, args.email)
        elif args.command == 'check-host':
            check_host()
        elif args.command == 'up':
            configuration(ROOT); check_host(); compose(ROOT, ['config', '--quiet'], args.local)
            services = ['db', 'redis', 'server', 'worker'] + ([] if args.local else ['gateway'])
            compose(ROOT, ['up', '-d'] + services, args.local)
            print('Containers started. Wait for readiness, then run manage.py verify' + (' --local' if args.local else '') + '.')
        elif args.command == 'down':
            compose(ROOT, ['down'], args.local)
            print('Containers stopped; database and certificate volumes were kept.')
        else:
            overrides = {}
            for value in args.id:
                language, raw = value.split('=', 1)
                if language not in LANGUAGES or not raw.isdecimal() or int(raw) <= 0:
                    raise ValueError('Use --id with a supported language and a positive installed ID.')
                overrides[language] = int(raw)
            verify(ROOT, args.local, overrides)
    except (ValueError, OSError, subprocess.SubprocessError, urllib.error.URLError) as error:
        # Do not print upstream response bodies, request headers or configuration values.
        print('Setup stopped: ' + (str(error) if isinstance(error, ValueError) else type(error).__name__ + '. Check the host, DNS, HTTPS and container readiness.'), file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
