import { useState, useEffect } from 'react';
import { fetchNews, formatNewsDate } from '../lib/news.js';
import { ArrowRight, RefreshCw } from 'lucide-react';

export function NewsFeed() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <RefreshCw className="w-4 h-4" />
          <span>Обновляется автоматически</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 group block"
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
          </a>
        ))}
      </div>
    </div>
  );
}
