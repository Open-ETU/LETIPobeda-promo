import { describe, it, expect } from 'vitest';
import {
  normalizeNewsItem,
  getFallbackNews,
  formatNewsDate,
  FEED_CANDIDATES,
  HTML_PAGES,
} from '../lib/news.js';

describe('news.js', () => {
  describe('normalizeNewsItem', () => {
    it('should normalize a complete news item', () => {
      const item = {
        title: 'Test Title',
        url: 'https://example.com/news/1',
        date: '2025-01-15',
        source: 'Test Source',
        excerpt: 'Test excerpt content',
      };

      const result = normalizeNewsItem(item);

      expect(result).toEqual({
        title: 'Test Title',
        url: 'https://example.com/news/1',
        date: '2025-01-15',
        source: 'Test Source',
        excerpt: 'Test excerpt content',
      });
    });

    it('should handle missing title', () => {
      const item = { url: 'https://example.com' };
      const result = normalizeNewsItem(item);
      expect(result.title).toBe('Без заголовка');
    });

    it('should handle alternative field names', () => {
      const item = {
        headline: 'Alternative Title',
        link: 'https://example.com/link',
        pubDate: '2025-02-20',
        description: 'Alternative description',
      };

      const result = normalizeNewsItem(item);

      expect(result.title).toBe('Alternative Title');
      expect(result.url).toBe('https://example.com/link');
      expect(result.date).toBe('2025-02-20');
      expect(result.excerpt).toBe('Alternative description');
    });

    it('should handle href as url', () => {
      const item = { href: 'https://example.com/href' };
      const result = normalizeNewsItem(item);
      expect(result.url).toBe('https://example.com/href');
    });

    it('should default to "#" for missing url', () => {
      const item = { title: 'No URL' };
      const result = normalizeNewsItem(item);
      expect(result.url).toBe('#');
    });

    it('should default source to "ЛЭТИ"', () => {
      const item = { title: 'Test' };
      const result = normalizeNewsItem(item);
      expect(result.source).toBe('ЛЭТИ');
    });

    it('should handle empty object without crashing', () => {
      const result = normalizeNewsItem({});
      expect(result).toBeDefined();
      expect(result.title).toBe('Без заголовка');
      expect(result.url).toBe('#');
      expect(result.source).toBe('ЛЭТИ');
      expect(result.excerpt).toBe('');
    });

    it('should handle null/undefined values gracefully', () => {
      const item = {
        title: null,
        url: undefined,
        date: null,
      };
      const result = normalizeNewsItem(item);
      expect(result.title).toBe('Без заголовка');
      expect(result.url).toBe('#');
    });
  });

  describe('getFallbackNews', () => {
    it('should return array of normalized news items', () => {
      const news = getFallbackNews();
      
      expect(Array.isArray(news)).toBe(true);
      expect(news.length).toBeGreaterThan(0);
    });

    it('should return at least 6 news items', () => {
      const news = getFallbackNews();
      expect(news.length).toBeGreaterThanOrEqual(6);
    });

    it('should return properly normalized items', () => {
      const news = getFallbackNews();
      
      news.forEach((item) => {
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('url');
        expect(item).toHaveProperty('date');
        expect(item).toHaveProperty('source');
        expect(item).toHaveProperty('excerpt');
        
        expect(typeof item.title).toBe('string');
        expect(typeof item.url).toBe('string');
        expect(item.title.length).toBeGreaterThan(0);
      });
    });

    it('should include RAEX news in fallback', () => {
      const news = getFallbackNews();
      const hasRaex = news.some((item) => item.title.includes('RAEX'));
      expect(hasRaex).toBe(true);
    });
  });

  describe('formatNewsDate', () => {
    it('should format ISO date string', () => {
      const result = formatNewsDate('2025-06-19');
      expect(result).toContain('2025');
    });

    it('should handle invalid date gracefully', () => {
      const result = formatNewsDate('invalid-date');
      // Should return something without crashing
      expect(typeof result).toBe('string');
    });

    it('should handle empty string', () => {
      const result = formatNewsDate('');
      expect(typeof result).toBe('string');
    });
  });

  describe('FEED_CANDIDATES', () => {
    it('should contain feed URLs', () => {
      expect(Array.isArray(FEED_CANDIDATES)).toBe(true);
      expect(FEED_CANDIDATES.length).toBeGreaterThan(0);
    });

    it('should contain letitoday.ru feeds', () => {
      const hasLetiToday = FEED_CANDIDATES.some((url) =>
        url.includes('letitoday.ru')
      );
      expect(hasLetiToday).toBe(true);
    });

    it('should contain prioritet2030 feeds', () => {
      const hasPrioritet = FEED_CANDIDATES.some((url) =>
        url.includes('prioritet2030')
      );
      expect(hasPrioritet).toBe(true);
    });
  });

  describe('HTML_PAGES', () => {
    it('should contain HTML page URLs', () => {
      expect(Array.isArray(HTML_PAGES)).toBe(true);
      expect(HTML_PAGES.length).toBeGreaterThan(0);
    });
  });
});
