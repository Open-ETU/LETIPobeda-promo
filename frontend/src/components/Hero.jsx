import { heroContent, heroStats } from '../lib/content.js';
import { StatCard } from './GlassCard.jsx';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Premium animated blobs with glow */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 md:w-[32rem] md:h-[32rem] bg-gradient-to-br from-indigo-600/40 to-purple-600/30 rounded-full animate-blob" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 md:w-[36rem] md:h-[36rem] bg-gradient-to-tl from-violet-600/30 to-cyan-600/20 rounded-full animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 md:w-[28rem] md:h-[28rem] bg-gradient-to-r from-cyan-600/25 to-indigo-600/25 rounded-full animate-blob animation-delay-4000" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-violet-500/20 to-pink-500/15 rounded-full animate-pulse-slow animation-delay-6000" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a1a]/50 pointer-events-none" />

      {/* Content */}
      <div className="container-custom relative z-10 px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-float">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-white/80">Поступление 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 leading-tight">
              <span className="gradient-text">{heroContent.title}</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-medium">
              {heroContent.subtitle}
            </p>
            
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {heroContent.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={heroContent.ctaPrimary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 group"
              >
                <Zap className="w-5 h-5 transition-transform group-hover:scale-110" />
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

          {/* Right: Stats panel with premium glass */}
          <div className="flex justify-center lg:justify-end">
            <div className="glass p-8 md:p-10 rounded-3xl max-w-md w-full relative overflow-hidden">
              {/* Inner glow effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
              
              <h3 className="text-lg font-semibold text-white/90 mb-8 text-center relative z-10">
                Ключевые показатели
              </h3>
              <div className="grid grid-cols-2 gap-4 relative z-10">
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

      {/* Scroll indicator with animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="p-2 rounded-full glass">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </div>
    </section>
  );
}
