import { footerContent } from '../lib/content.js';

export function Footer() {
  return (
    <footer className="section bg-black/30 border-t border-white/5">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo and description */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              {footerContent.logo}
            </h3>
            <p className="text-white/60 text-sm">
              {footerContent.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Полезные ссылки</h4>
            <ul className="space-y-2">
              {footerContent.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div>
            <h4 className="text-white font-semibold mb-4">Готовы поступить?</h4>
            <p className="text-white/60 text-sm mb-4">
              Узнайте о программах и подайте документы на официальном сайте.
            </p>
            <a
              href="https://abit.etu.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Перейти на abit.etu.ru
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-white/40 mb-4">
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
