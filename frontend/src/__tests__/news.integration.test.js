import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchNews, getFallbackNews } from '../data/news.js';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('news integration', () => {
  it('returns fallback when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    const result = await fetchNews();

    expect(result.isFallback).toBe(true);
    expect(result.items).toEqual(getFallbackNews());
  });

  it('returns fallback when fetch responds with non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 301,
      text: vi.fn(),
    }));

    const result = await fetchNews();

    expect(result.isFallback).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
  });
});
