import copy
import hashlib
import importlib.util
import io
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('mirror', Path(__file__).parents[1] / 'yyhelper_mirror.py')
mirror = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mirror)


class MirrorTests(unittest.TestCase):
    def setUp(self):
        self.body = b'PKverified package content'
        self.row = {'version': '1.0.0', 'build': 1, 'url': mirror.ORIGIN + '/releases/android/1/download.html'}
        self.pkg = {'version': '1.0.0', 'build': 1, 'platform': 'android', 'name': 'app.apk', 'bytes': len(self.body), 'sha256': hashlib.sha256(self.body).hexdigest(), 'parts': ['part-0.bin', 'part-1.bin']}

    def reader(self, url):
        return io.BytesIO(self.body[:3] if url.endswith('part-0.bin') else self.body[3:])

    def test_combines_parts_in_order_and_verifies(self):
        with tempfile.TemporaryDirectory() as work, patch.object(mirror, 'open_source', self.reader):
            target = Path(work) / 'app.apk'
            mirror.download_package('android', self.pkg, target)
            self.assertEqual(target.read_bytes(), self.body)
            self.assertFalse(target.with_suffix('.apk.partial').exists())

    def test_corrupt_or_truncated_download_cannot_replace_existing_file(self):
        with tempfile.TemporaryDirectory() as work, patch.object(mirror.time, 'sleep'):
            target = Path(work) / 'app.apk'
            target.write_bytes(b'old verified package')
            for data in (b'PKcorrupted', self.body + b'excess'):
                with patch.object(mirror, 'open_source', lambda url: io.BytesIO(data)):
                    with self.assertRaises(ValueError):
                        mirror.download_package('android', self.pkg, target)
                self.assertEqual(target.read_bytes(), b'old verified package')
                self.assertFalse(target.with_suffix('.apk.partial').exists())

    def test_rejects_unsafe_manifests(self):
        for change in ({'parts': ['../secret']}, {'bytes': True}, {'name': 'app.exe'}, {'platform': 'windows'}, {'parts': ['p.bin', 'p.bin']}):
            with self.assertRaises(ValueError):
                mirror.validate_package('android', self.row, {**self.pkg, **change})
        self.assertEqual(mirror.validate_package('android', self.row, self.pkg), self.pkg)

    def test_one_platform_failure_preserves_old_release(self):
        old = {'current': {'build': 1, 'sha256': self.pkg['sha256']}, 'history': []}
        previous = {'platforms': {'android': old, 'windows': old}}
        latest = {'schema': 1, 'product': 'yyhelper-pro', 'platforms': {'android': self.row, 'windows': {'build': 2}}}
        class API:
            def publish_package(self, *args):
                return 'https://github.com/download/app.apk', 'https://github.com/releases/1'
        with patch.object(mirror, 'source_json', side_effect=[latest, self.pkg, {}]):
            catalog = mirror.synchronize(previous, API(), '.')
        self.assertEqual(catalog['platforms']['android']['status'], 'ok')
        self.assertEqual(catalog['platforms']['windows']['current']['build'], 1)
        self.assertEqual(catalog['status'], 'error')
        self.assertNotIn('status', previous['platforms']['android'])

    def test_template_escapes_untrusted_notes(self):
        current = {**self.pkg, 'date': '2026/11/11', 'mirroredAt': '2026-11-11T00:00:00Z', 'downloadUrl': 'https://github.com/file', 'sourceUrl': self.row['url'], 'notes': '<script>alert(1)</script>'}
        template = (Path(__file__).parents[2] / 'downloads/template.html').read_text(encoding='utf-8')
        rendered = mirror.render({'status': 'ok', 'platforms': {'android': {'current': current}}}, template)
        self.assertIn('&lt;script&gt;', rendered)
        self.assertNotIn('<script>alert(1)</script>', rendered)
        self.assertNotIn('{{', rendered)
        self.assertIn('下载 APK', rendered)

    def test_publishing_draft_uses_final_asset_url(self):
        draft_asset = {'name': 'app.apk', 'size': self.pkg['bytes'], 'state': 'uploaded', 'browser_download_url': 'https://github.com/download/untagged/app.apk'}
        final_asset = {**draft_asset, 'browser_download_url': 'https://github.com/download/v1/app.apk'}
        github = mirror.GitHub('owner/repo', 'test-token')
        with patch.object(github, 'find_release', return_value={'draft': True, 'id': 1, 'assets': [draft_asset]}), patch.object(github, 'request', return_value={'html_url': 'https://github.com/release/v1', 'assets': [final_asset]}):
            url, _ = github.publish_package('android', self.row, self.pkg, '.')
        self.assertEqual(url, final_asset['browser_download_url'])


if __name__ == '__main__':
    unittest.main()
