export function GlassCard({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={`glass-card p-6 ${hoverable ? 'card-hover cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, year, className = '' }) {
  return (
    <div className={`glass-card p-4 text-center ${className}`}>
      <div className="text-2xl md:text-3xl font-bold gradient-text">{value}</div>
      <div className="text-sm text-white/70 mt-1">{label}</div>
      {year && <div className="text-xs text-white/50 mt-0.5">{year}</div>}
    </div>
  );
}

export function RankCard({ title, big, text, link, linkText }) {
  return (
    <div className="glass-card p-6 md:p-8 flex flex-col h-full">
      <div className="text-sm text-white/60 mb-2">{title}</div>
      <div className="stat-number gradient-text-gold mb-4">{big}</div>
      <p className="text-white/80 text-sm leading-relaxed flex-grow">{text}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
        >
          {linkText || 'Источник'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      )}
    </div>
  );
}
