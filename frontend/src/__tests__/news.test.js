import { describe, it, expect } from 'vitest';
import { normalizeNewsItem, getFallbackNews, formatNewsDate } from '../data/news.js';

describe('news presentation', () => {
  it('has real dated article links available without the network', () => {
    const items = getFallbackNews();
    expect(items.length).toBeGreaterThanOrEqual(6);
    for (const item of items) {
      expect(item.url).toMatch(/^https:\/\/letitoday.ru\/ru\/rubriki\//);
      expect(Number.isFinite(Date.parse(item.date))).toBe(true);
      expect(item.title.length).toBeGreaterThan(0);
    }
  });
  it('never renders source markup and rejects executable URLs', () => {
    const item = normalizeNewsItem({ title: 'News', url: 'javascript:alert(1)', contentHtml: '<script>alert(1)</script>' });
    expect(item.url).toBe('#');
    expect(item).not.toHaveProperty('contentHtml');
  });
  it('formats publication dates consistently in Moscow time during prerender and hydration', () => {
    expect(formatNewsDate('2026-09-22T22:00:00Z')).toContain('23 сентября');
    expect(formatNewsDate('')).toBe('—');
  });
});
