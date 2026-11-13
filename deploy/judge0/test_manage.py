import contextlib
import importlib.util
import io
import json
from pathlib import Path
import shutil
import stat
import tempfile
import unittest
from unittest.mock import patch
import urllib.error

spec = importlib.util.spec_from_file_location('manage', Path(__file__).with_name('manage.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        with contextlib.redirect_stdout(io.StringIO()):
            m.initialize(self.root, 'runner.sukoaa.com', 'owner@sukoaa.com')

    def tearDown(self):
        self.temp.cleanup()

    def test_secrets_are_private_distinct_and_consistent(self):
        env = m.configuration(self.root)
        conf = m.read_env(self.root / 'judge0.conf')
        self.assertEqual(len(set([env['JUDGE0_AUTH_TOKEN'], env['POSTGRES_PASSWORD'], env['REDIS_PASSWORD'], conf['AUTHZ_TOKEN'], conf['SECRET_KEY_BASE']])), 5)
        for name in ['.env', 'judge0.conf']:
            self.assertEqual(stat.S_IMODE((self.root / name).stat().st_mode), 0o600)
        self.assertEqual(stat.S_IMODE((self.root / '.generated').stat().st_mode), 0o700)

    def test_existing_configuration_cannot_be_silently_replaced(self):
        before = (self.root / '.env').read_bytes()
        with self.assertRaises(ValueError):
            m.initialize(self.root, 'another.sukoaa.com', 'owner@sukoaa.com')
        self.assertEqual((self.root / '.env').read_bytes(), before)

    def test_bad_domain_or_email_cannot_enter_docker_or_caddy_configuration(self):
        for domain in ['https://runner.sukoaa.com', 'runner.sukoaa.com\nENV=bad', 'localhost', '$(id).sukoaa.com', '*.sukoaa.com', 'runner.example']:
            with self.assertRaises(ValueError):
                m.initialize(self.root, domain, 'owner@sukoaa.com')
        with self.assertRaises(ValueError):
            m.initialize(self.root, 'runner.sukoaa.com', 'a@example.com\nX=bad')

    def test_compose_uses_generated_credentials_over_unrelated_host_environment(self):
        with patch.dict(m.os.environ, {'POSTGRES_PASSWORD': 'unrelated-host-password'}), patch.object(m.subprocess, 'run') as run:
            m.compose(self.root, ['config', '--quiet'])
        env = run.call_args.kwargs['env']
        self.assertEqual(env['POSTGRES_PASSWORD'], m.read_env(self.root / '.env')['POSTGRES_PASSWORD'])
        self.assertNotIn(env['POSTGRES_PASSWORD'], ' '.join(run.call_args.args[0]))

    def test_changed_network_policy_or_mismatched_credentials_fail_closed(self):
        p = self.root / 'judge0.conf'
        original = p.read_text()
        for text in [original.replace('ALLOW_ENABLE_NETWORK=false', 'ALLOW_ENABLE_NETWORK=true'), original.replace('AUTHN_TOKEN=', 'AUTHN_TOKEN=wrong')]:
            p.write_text(text)
            with self.assertRaises(ValueError):
                m.configuration(self.root)
        p.write_text(original)

    def test_language_selection_avoids_javascript_and_accepts_explicit_versions(self):
        rows = [{'id': 1, 'name': 'C (GCC 9)'}, {'id': 2, 'name': 'C++ (GCC 9)'}, {'id': 3, 'name': 'Rust (1.40)'}, {'id': 4, 'name': 'C# (Mono 6)'}, {'id': 5, 'name': 'Java (OpenJDK 13)'}, {'id': 6, 'name': 'Go (1.13)'}, {'id': 99, 'name': 'JavaScript (Node)'}, {'id': 10, 'name': 'C (GCC 12)'}]
        result = m.select_languages(rows, {'c': 1})
        self.assertEqual(result['c']['id'], 1)
        self.assertEqual(result['java']['id'], 5)
        with self.assertRaises(ValueError):
            m.select_languages(rows, {'java': 99})
        with self.assertRaises(ValueError):
            m.select_languages([], {})

    def test_submission_cannot_enable_network_and_is_resource_bounded(self):
        for language in m.LANGUAGES:
            data = m.submission(language, 'source', 1)
            self.assertIs(data['enable_network'], False)
            self.assertLessEqual(data['memory_limit'], 256000)
            self.assertLessEqual(data['max_processes_and_or_threads'], 64)
            self.assertEqual(data['cpu_time_limit'], 2)
            self.assertNotIn('callback_url', data)
            self.assertNotIn('additional_files', data)

    def test_failed_smoke_does_not_export_vercel_credentials(self):
        shutil.copytree(Path(__file__).with_name('demos'), self.root / 'demos')
        rows = [{'id': i + 1, 'name': name + ' (test)'} for i, name in enumerate(['C', 'C++', 'Rust', 'C#', 'Java', 'Go'])]
        def fake(url, token, path, data=None):
            if token == 'incorrect-token':
                raise urllib.error.HTTPError(url, 401, 'Unauthorized', {}, io.BytesIO())
            if path == '/languages':
                return rows
            if data and data.get('enable_network'):
                raise urllib.error.HTTPError(url, 422, 'Rejected', {}, io.BytesIO(b'{"enable_network":["not allowed"]}'))
            if data:
                return {'token': 'valid-test-token'}
            return {'status': {'id': 6}, 'stdout': ''}
        with patch.object(m, 'api', fake), contextlib.redirect_stdout(io.StringIO()):
            with self.assertRaises(ValueError):
                m.verify(self.root)
        self.assertFalse((self.root / '.generated/vercel.env').exists())

    def test_successful_public_verification_exports_only_server_settings(self):
        shutil.copytree(Path(__file__).with_name('demos'), self.root / 'demos')
        rows = [{'id': i + 1, 'name': name + ' (test)'} for i, name in enumerate(['C', 'C++', 'Rust', 'C#', 'Java', 'Go'])]
        def fake(url, token, path, data=None):
            if token == 'incorrect-token':
                raise urllib.error.HTTPError(url, 401, 'Unauthorized', {}, io.BytesIO())
            if path == '/languages':
                return rows
            if data and data.get('enable_network'):
                raise urllib.error.HTTPError(url, 422, 'Rejected', {}, io.BytesIO(b'{"enable_network":["not allowed"]}'))
            if data:
                return {'token': 'valid-test-token'}
            return {'status': {'id': 3}, 'stdout': m.base64.b64encode(b'Hello, Sukoaa!\nSum of squares: 55\n').decode()}
        output = io.StringIO()
        with patch.object(m, 'api', fake), contextlib.redirect_stdout(output):
            m.verify(self.root)
        values = m.read_env(self.root / '.generated/vercel.env')
        self.assertEqual(values['JUDGE0_URL'], 'https://runner.sukoaa.com')
        self.assertNotIn('POSTGRES_PASSWORD', values)
        self.assertNotIn(values['JUDGE0_AUTH_TOKEN'], output.getvalue())
        self.assertEqual(len(values), 8)

    def test_local_smoke_never_exports_production_credentials(self):
        shutil.copytree(Path(__file__).with_name('demos'), self.root / 'demos')
        rows = [{'id': i + 1, 'name': name + ' (test)'} for i, name in enumerate(['C', 'C++', 'Rust', 'C#', 'Java', 'Go'])]
        def fake(url, token, path, data=None):
            self.assertEqual(url, 'http://127.0.0.1:2358')
            if token == 'incorrect-token':
                raise urllib.error.HTTPError(url, 401, 'Unauthorized', {}, io.BytesIO())
            if path == '/languages':
                return rows
            if data and data.get('enable_network'):
                raise urllib.error.HTTPError(url, 422, 'Rejected', {}, io.BytesIO(b'{"enable_network":["not allowed"]}'))
            if data:
                return {'token': 'valid-test-token'}
            return {'status': {'id': 3}, 'stdout': m.base64.b64encode(b'Hello, Sukoaa!\nSum of squares: 55\n').decode()}
        with patch.object(m, 'api', fake), contextlib.redirect_stdout(io.StringIO()):
            result = m.verify(self.root, local=True)
        self.assertEqual(len(result['languages']), 6)
        self.assertFalse((self.root / '.generated/vercel.env').exists())
        self.assertTrue((self.root / '.generated/smoke-report.json').exists())

    def test_invalid_authentication_or_network_override_stops_verification(self):
        (self.root / '.generated/vercel.env').write_text('stale settings')
        with patch.object(m, 'api', return_value=[]):
            with self.assertRaisesRegex(ValueError, 'invalid token'):
                m.verify(self.root)
        self.assertFalse((self.root / '.generated/vercel.env').exists())


if __name__ == '__main__':
    unittest.main()
