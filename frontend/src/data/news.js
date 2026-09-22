import snapshot from './news-snapshot.json';

function text(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export function normalizeNewsItem(item = {}) {
  const candidate = text(item.url);
  let url = '#';
  try {
    const parsed = new URL(candidate);
    if (['https:', 'http:'].includes(parsed.protocol)) url = parsed.href;
  } catch { /* Invalid links are never made clickable. */ }
  return {
    title: text(item.title, 'Без заголовка'), url,
    date: text(item.date), source: text(item.source, 'ЛЭТИ Сегодня'),
    excerpt: text(item.excerpt),
    categories: Array.isArray(item.categories) ? item.categories.filter(value => typeof value === 'string') : [],
  };
}

export function getFallbackNews() {
  return snapshot.items.map(normalizeNewsItem);
}

export async function fetchNews({ signal } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  if (signal?.aborted) abort();
  let timeoutId;
  try {
    const request = async () => {
      const response = await fetch('https://storage.yandexcloud.net/leti-pobeda-news/data/news.json', {
        headers: { Accept: 'application/json' }, signal: controller.signal,
      });
      if (!response.ok) throw new Error(`News request failed: ${response.status}`);
      const data = await response.json();
      if (data.schemaVersion !== 1 || !Array.isArray(data.items)) throw new Error('Invalid news snapshot');
      const items = data.items.filter(item => item && typeof item.title === 'string' && item.title.trim())
        .map(normalizeNewsItem).filter(item => item.url !== '#' && Number.isFinite(Date.parse(item.date))).slice(0, 12);
      if (!items.length) throw new Error('Empty news snapshot');
      return { items, isFallback: false, error: null };
    };
    // Cover both response headers and the body, even if a connection stalls.
    return await Promise.race([request(), new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('News request timed out'));
      }, 4000);
    })]);
  } catch (error) {
    return { items: getFallbackNews(), isFallback: true, error };
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', abort);
  }
}

export function formatNewsDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Moscow',
  }).format(date);
}
