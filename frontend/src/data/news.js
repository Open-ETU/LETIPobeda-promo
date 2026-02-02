export const FEED_CANDIDATES = [
  'https://letitoday.ru/rss/',
  'https://www.eltech.ru/rss/stud-mob-app',
];

export const HTML_PAGES = [
  'https://letitoday.ru/news/',
  'https://etu.ru/ru/universitet/novosti/',
  'https://prioritet2030.ru/',
];

function stripHtml(input = '') {
  if (!input) return '';
  try {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent?.trim() || '';
  } catch (error) {
    return input;
  }
}

function sanitizeRssHtml(input = '') {
  if (!input) return '';
  try {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    doc.querySelectorAll('script, style, iframe').forEach((node) => node.remove());
    doc.querySelectorAll('*').forEach((node) => {
      [...node.attributes].forEach((attr) => {
        if (attr.name.startsWith('on')) {
          node.removeAttribute(attr.name);
        }
      });
    });
    return doc.body.innerHTML.trim();
  } catch (error) {
    return stripHtml(input);
  }
}

export function normalizeNewsItem(item = {}) {
  const title =
    item.title ||
    item.headline ||
    item.name ||
    'Без заголовка';
  const url = item.url || item.link || item.href || '#';
  const date = item.date || item.pubDate || item.published || '';
  const source = item.source || item.author || 'ЛЭТИ';
  const rawExcerpt = item.excerpt || item.description || item.summary || '';
  const contentHtml = sanitizeRssHtml(item.contentHtml || item.content || item.description || '');
  const categories = Array.isArray(item.categories) ? item.categories : [];

  return {
    title: title || 'Без заголовка',
    url: url || '#',
    date: date || '',
    source: source || 'ЛЭТИ',
    excerpt: stripHtml(rawExcerpt) || '',
    contentHtml,
    categories,
  };
}

export function getFallbackNews() {
  return [
    {
      title: 'RAEX: ЛЭТИ в числе ведущих технических вузов России',
      url: 'https://raex-rr.com/education/russian_universities/top-100_universities/2025/',
      date: '2025-06-19',
      source: 'RAEX',
      excerpt: 'Университет укрепляет позиции в национальном рейтинге.',
    },
    {
      title: 'ЛЭТИ запускает новую лабораторию ИИ и робототехники',
      url: 'https://letitoday.ru/',
      date: '2025-05-28',
      source: 'ЛЭТИ',
      excerpt: 'Открытие лаборатории расширит возможности исследований и проектов.',
    },
    {
      title: 'Приоритет‑2030: новые образовательные треки',
      url: 'https://priority2030.ru/analytics/jdopua9oid/program',
      date: '2025-04-16',
      source: 'Приоритет‑2030',
      excerpt: 'Университет развивает междисциплинарные программы.',
    },
    {
      title: 'Студенты ЛЭТИ победили в хакатоне по кибербезопасности',
      url: 'https://letitoday.ru/',
      date: '2025-03-11',
      source: 'ЛЭТИ',
      excerpt: 'Команда представила решение по защите критической инфраструктуры.',
    },
    {
      title: 'Открыт набор на магистратуру по data science',
      url: 'https://abit.etu.ru',
      date: '2025-02-05',
      source: 'Абитуриентам',
      excerpt: 'Новые образовательные возможности для будущих аналитиков.',
    },
    {
      title: 'Научные школы ЛЭТИ получили новые гранты',
      url: 'https://etu.ru/ru/universitet/novosti/',
      date: '2025-01-27',
      source: 'ЛЭТИ',
      excerpt: 'Поддержка исследований в сфере микроэлектроники и связи.',
    },
  ].map(normalizeNewsItem);
}

function parseRss(xmlText) {
  if (!xmlText) return [];
  let doc;
  try {
    doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  } catch (error) {
    return [];
  }

  const items = Array.from(doc.querySelectorAll('item'));
  if (items.length === 0) {
    return [];
  }

  const channelTitle = doc.querySelector('channel > title')?.textContent?.trim();

  return items.map((item) => {
    const title = item.querySelector('title')?.textContent?.trim();
    const url = item.querySelector('link')?.textContent?.trim();
    const date = item.querySelector('pubDate')?.textContent?.trim();
    const excerpt = item.querySelector('description')?.textContent?.trim();
    const contentHtml =
      item.querySelector('content\\:encoded')?.textContent?.trim() ||
      item.querySelector('description')?.textContent?.trim() ||
      '';
    const categories = Array.from(item.querySelectorAll('category'))
      .map((category) => category.textContent?.trim())
      .filter(Boolean);

    return normalizeNewsItem({
      title,
      url,
      date,
      source: channelTitle || 'ЛЭТИ',
      excerpt,
      contentHtml,
      categories,
    });
  });
}

async function fetchFeed(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const response = await fetch(url, {
    headers: {
      Accept: 'application/rss+xml, application/xml, text/xml',
    },
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));

  if (!response.ok) {
    throw new Error(`Feed request failed: ${response.status}`);
  }

  return response.text();
}

export async function fetchNews() {
  let lastError = null;

  for (const feedUrl of FEED_CANDIDATES) {
    try {
      const xml = await fetchFeed(feedUrl);
      const items = parseRss(xml);
      if (items.length > 0) {
        return {
          items: items.slice(0, 12),
          isFallback: false,
          error: null,
        };
      }
    } catch (error) {
      lastError = error;
      // Try next feed candidate
    }
  }

  return {
    items: getFallbackNews(),
    isFallback: true,
    error: lastError,
  };
}

export function formatNewsDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
