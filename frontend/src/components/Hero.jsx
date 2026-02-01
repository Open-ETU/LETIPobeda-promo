import { heroContent, heroStats } from '../lib/content.js';
import { StatCard } from './GlassCard.jsx';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Animated blobs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 bg-indigo-600/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-20 w-72 h-72 md:w-[28rem] md:h-[28rem] bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 md:w-80 md:h-80 bg-cyan-600/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Content */}
      <div className="container-custom relative z-10 px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="gradient-text">{heroContent.title}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              {heroContent.subtitle}
            </p>
            
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
              {heroContent.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={heroContent.ctaPrimary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 inline-block text-center"
              >
                {heroContent.ctaPrimary.text}
              </a>
              <a
                href={heroContent.ctaSecondary.anchor}
                className="btn-secondary text-lg px-8 py-4 inline-block text-center"
              >
                {heroContent.ctaSecondary.text}
              </a>
            </div>
          </div>

          {/* Right: Stats panel */}
          <div className="flex justify-center lg:justify-end">
            <div className="glass p-6 md:p-8 rounded-3xl max-w-md w-full">
              <h3 className="text-lg font-semibold text-white/90 mb-6 text-center">
                Ключевые показатели
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {heroStats.map((stat, index) => (
                  <StatCard
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    year={stat.year}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white/50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </section>
  );
}
