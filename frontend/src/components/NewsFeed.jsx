import { useState, useEffect } from 'react';
import { fetchNews, formatNewsDate } from '../lib/news.js';

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
        <p className="text-sm text-white/50">
          Обновляется автоматически
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 card-hover group block"
          >
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

            <div className="mt-4 flex items-center text-sm text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Читать
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 ml-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
