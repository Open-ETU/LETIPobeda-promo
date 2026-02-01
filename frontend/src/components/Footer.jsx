import { footerContent } from '../lib/content.js';
import { ExternalLink, ArrowUpRight, GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="section bg-black/40 border-t border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and description */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              {footerContent.logo}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {footerContent.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              Полезные ссылки
            </h4>
            <ul className="space-y-3">
              {footerContent.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              Готовы поступить?
            </h4>
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              Узнайте о программах и подайте документы на официальном сайте.
            </p>
            <a
              href="https://abit.etu.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 group"
            >
              Перейти на abit.etu.ru
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-white/40 mb-4 leading-relaxed">
            {footerContent.disclaimer}
          </p>
          <p className="text-xs text-white/30">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
