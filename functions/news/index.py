"""Refresh a small public news snapshot; never publish an empty failed fetch."""
import json
import os
import time
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup
from defusedxml import ElementTree

SOURCE = "https://letitoday.ru/"
MAX_BYTES = 2_000_000
MAX_ITEMS = 12


def download(url, *, method="GET", data=None, headers=None):
    request = Request(url, data=data, method=method, headers={
        "User-Agent": "LETIPobeda-News/1.0 (+https://xn--80abjdnrwhz3i.xn--p1ai/)",
        **(headers or {}),
    })
    deadline = time.monotonic() + 15
    with urlopen(request, timeout=8) as response:
        chunks, size = [], 0
        while True:
            if time.monotonic() > deadline:
                raise TimeoutError("News download deadline exceeded")
            chunk = response.read1(65536)
            if not chunk:
                return b"".join(chunks)
            size += len(chunk)
            if size > MAX_BYTES:
                raise ValueError("Response exceeds the news size limit")
            chunks.append(chunk)


def plain_text(value, limit):
    soup = BeautifulSoup(value or "", "html.parser")
    for tag in soup(["script", "style", "iframe"]):
        tag.decompose()
    return " ".join(soup.get_text(" ", strip=True).split())[:limit]


def news_item(title, link, date, excerpt=""):
    url = urljoin(SOURCE, link)
    parsed = urlparse(url)
    # Links are displayed, not fetched. Only source article URLs are published.
    if parsed.scheme not in {"http", "https"} or parsed.hostname not in {"letitoday.ru", "www.letitoday.ru"}:
        return None
    title = plain_text(title, 250)
    if not title or not parsed.path.startswith("/ru/rubriki/"):
        return None
    try:
        published = datetime.strptime(date.strip(), "%d.%m.%Y %H:%M").replace(tzinfo=timezone(timedelta(hours=3)))
    except ValueError:
        try:
            published = parsedate_to_datetime(date)
        except (ValueError, TypeError):
            return None
    if published.tzinfo is None:
        published = published.replace(tzinfo=timezone.utc)
    return {
        "title": title, "url": url, "date": published.astimezone(timezone.utc).isoformat(),
        "source": "ЛЭТИ Сегодня", "excerpt": plain_text(excerpt, 240), "categories": [],
    }


def parse_html(html):
    soup = BeautifulSoup(html, "html.parser")
    items = []
    for article in soup.select(".main-article-preview, .recent-article-preview"):
        title, date = article.select_one("h2.title a[href]"), article.select_one(".date")
        if title is None or date is None:
            continue
        intro = article.select_one(".introtext")
        item = news_item(title.get_text(), title["href"], date.get_text(), intro.get_text() if intro else "")
        if item:
            items.append(item)
    return items


def parse_rss(xml):
    doc = ElementTree.fromstring(xml)
    items = []
    for node in doc.findall(".//item"):
        item = news_item(node.findtext("title", ""), node.findtext("link", ""),
                         node.findtext("pubDate", ""), node.findtext("description", ""))
        if item:
            items.append(item)
    return items


def collect(fetch=download):
    # The advertised RSS currently fails; HTML is a tested independent fallback.
    for url, parse in [(urljoin(SOURCE, "rss/"), parse_rss), (SOURCE, parse_html)]:
        try:
            items = parse(fetch(url))
            deduplicated = {item["url"]: item for item in items}
            if deduplicated:
                return sorted(deduplicated.values(), key=lambda item: item["date"], reverse=True)[:MAX_ITEMS]
        except Exception as error:
            print(json.dumps({"source": url, "error": type(error).__name__}))
    raise RuntimeError("No valid news received; existing snapshot was preserved")


def handler(event, context):
    items = collect()
    snapshot = {
        "schemaVersion": 1,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceUrl": SOURCE,
        "items": items,
    }
    bucket = os.environ["NEWS_BUCKET"]
    token = context.token["access_token"]
    download(f"https://storage.yandexcloud.net/{bucket}/data/news.json", method="PUT",
             data=json.dumps(snapshot, ensure_ascii=False).encode(), headers={
                 "Authorization": f"Bearer {token}",
                 "Content-Type": "application/json; charset=utf-8",
                 "Cache-Control": "public, max-age=60, s-maxage=300",
             })
    print(json.dumps({"published": len(items), "updatedAt": snapshot["updatedAt"]}))
    return {"statusCode": 200, "body": json.dumps({"published": len(items)})}
