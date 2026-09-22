import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchNews, getFallbackNews } from '../data/news.js';

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe('news snapshot delivery', () => {
  it('makes one snapshot request, with no browser scraping', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ schemaVersion: 1, items: getFallbackNews() }) });
    vi.stubGlobal('fetch', fetch);
    const result = await fetchNews();
    expect(result.isFallback).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toBe('https://storage.yandexcloud.net/leti-pobeda-news/data/news.json');
  });
  it.each([
    { ok: false, status: 503 },
    { ok: true, json: async () => ({ schemaVersion: 1, items: [] }) },
    { ok: true, json: async () => ({ items: getFallbackNews() }) },
  ])('keeps the built-in snapshot on invalid response %#', async response => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    expect((await fetchNews()).items).toEqual(getFallbackNews());
    expect((await fetchNews()).isFallback).toBe(true);
  });
  it('returns the snapshot when the source request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect((await fetchNews()).isFallback).toBe(true);
  });
  it('bounds a stalled response body to four seconds and aborts the request', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: () => new Promise(() => {}) });
    vi.stubGlobal('fetch', fetch);
    const result = fetchNews();
    await vi.advanceTimersByTimeAsync(4000);
    expect((await result).isFallback).toBe(true);
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  });
});
