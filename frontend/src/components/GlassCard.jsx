import { ExternalLink, TrendingUp } from 'lucide-react';

export function GlassCard({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={`glass-card p-6 ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function StatCard({ label, value, year, className = '' }) {
  return (
    <div className={`glass-card p-5 text-center group ${className}`}>
      <div className="relative">
        <div className="text-2xl md:text-3xl font-bold gradient-text mb-1 group-hover:scale-105 transition-transform">
          {value}
        </div>
        <div className="text-sm text-white/70">{label}</div>
        {year && <div className="text-xs text-white/50 mt-0.5">{year}</div>}
      </div>
    </div>
  );
}

export function RankCard({ title, big, text, link, linkText }) {
  return (
    <div className="glass-card p-6 md:p-8 flex flex-col h-full group">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60 font-medium">{title}</span>
          <TrendingUp className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="stat-number gradient-text-gold mb-4 group-hover:scale-105 transition-transform origin-left">
          {big}
        </div>
        <p className="text-white/75 text-sm leading-relaxed flex-grow">{text}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5 group/link"
          >
            {linkText || 'Источник'}
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </a>
        )}
      </div>
    </div>
  );
}
