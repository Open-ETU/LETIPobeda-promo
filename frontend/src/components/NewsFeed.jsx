import { useState, useEffect } from 'react';
import { fetchNews, formatNewsDate, getFallbackNews } from '../data/news.js';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { ModalOrDrawer } from './ModalOrDrawer.jsx';

export function NewsFeed() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function loadNews() {
      try {
        const { items, isFallback: fallbackUsed } = await fetchNews();
        if (Array.isArray(items) && items.length > 0) {
          setNews(items);
          setIsFallback(fallbackUsed);
        } else {
          setNews(getFallbackNews());
          setIsFallback(true);
        }
      } catch (error) {
        console.error('Failed to load news:', error);
        setNews(getFallbackNews());
        setIsFallback(true);
      } finally {
        setIsLoading(false);
      }
    }

    let isActive = true;
    const safetyTimeout = setTimeout(() => {
      if (isActive) {
        setNews(getFallbackNews());
        setIsFallback(true);
        setIsLoading(false);
      }
    }, 6000);

    loadNews();

    return () => {
      isActive = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="skeleton h-4 w-3/4 mb-3" />
            <div className="skeleton h-3 w-full mb-2" />
            <div className="skeleton h-3 w-2/3 mb-4" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <RefreshCw className="w-4 h-4" />
          <span>Обновляется автоматически</span>
        </div>
        {isFallback && (
          <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
            Не удалось обновить ленту новостей.
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedNews(item)}
            className="glass-card p-6 group block text-left"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-indigo-400 font-medium">
                  {item.source}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white/50">
                  {formatNewsDate(item.date)}
                </span>
              </div>

              <h4 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors mb-3 line-clamp-2">
                {item.title}
              </h4>

              {item.excerpt && (
                <p className="text-sm text-white/60 line-clamp-2">
                  {item.excerpt}
                </p>
              )}

              <div className="mt-4 flex items-center text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                Читать
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </button>
        ))}
      </div>

      <ModalOrDrawer
        isOpen={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        title={selectedNews?.title || ''}
      >
        {selectedNews && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                  {selectedNews.source}
                </span>
                {selectedNews.categories?.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center text-xs text-white/70 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
              {selectedNews.url && selectedNews.url !== '#' && (
                <a
                  href={selectedNews.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Перейти к источнику
                </a>
              )}
            </div>

            <div className="text-xs text-white/50">
              {formatNewsDate(selectedNews.date)}
            </div>

            {selectedNews.contentHtml ? (
              <div
                className="rss-content text-sm text-white/80"
                dangerouslySetInnerHTML={{ __html: selectedNews.contentHtml }}
              />
            ) : (
              <p className="text-sm text-white/70 leading-relaxed">
                {selectedNews.excerpt}
              </p>
            )}
          </div>
        )}
      </ModalOrDrawer>
    </div>
  );
}
