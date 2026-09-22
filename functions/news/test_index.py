import unittest
from unittest.mock import patch
from types import SimpleNamespace
import index

HTML = '''<div class="recent-article-preview">
<h2 class="title"><a href="/ru/rubriki/nauka-i-innovacii/example">Тестовая новость</a></h2>
<p class="date">22.09.2026 12:00</p><p class="introtext">Описание</p></div>'''


class NewsTests(unittest.TestCase):
    def test_rss_failure_uses_html_and_deduplicates(self):
        def fetch(url):
            if url.endswith('rss/'):
                raise OSError('source unavailable')
            return HTML + HTML
        items = index.collect(fetch)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]['date'], '2026-09-22T09:00:00+00:00')
        self.assertEqual(items[0]['url'], index.SOURCE + 'ru/rubriki/nauka-i-innovacii/example')

    def test_failed_refresh_never_writes_snapshot(self):
        with patch.object(index, 'collect', side_effect=RuntimeError('unavailable')), patch.object(index, 'download') as publish:
            with self.assertRaises(RuntimeError):
                index.handler({}, SimpleNamespace(token={}))
            publish.assert_not_called()

    def test_changed_page_layout_is_failure_not_empty_success(self):
        with self.assertRaises(RuntimeError):
            index.collect(lambda _: '<html><h1>Maintenance</h1></html>')

    def test_external_links_and_unusable_dates_are_rejected(self):
        self.assertIsNone(index.news_item('Title', 'https://other.example/story', '22.09.2026 12:00'))
        self.assertIsNone(index.news_item('Title', '/ru/rubriki/example', 'unknown'))

    def test_rss_entities_are_rejected(self):
        with self.assertRaises(Exception):
            index.parse_rss('<!DOCTYPE x [<!ENTITY x "expanded">]><rss><item><title>&x;</title></item></rss>')


if __name__ == '__main__':
    unittest.main()
