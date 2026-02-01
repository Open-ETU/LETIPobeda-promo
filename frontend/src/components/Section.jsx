import { useEffect, useRef, useState } from 'react';

export function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
  withBlob = false,
  blobPosition = 'right',
}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`section relative overflow-hidden ${className}`}
    >
      {/* Decorative blob */}
      {withBlob && (
        <div
          className={`absolute ${
            blobPosition === 'right'
              ? 'top-20 -right-32 md:-right-20'
              : 'top-40 -left-32 md:-left-20'
          } w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-20 pointer-events-none`}
          style={{
            background:
              blobPosition === 'right'
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
          }}
        />
      )}

      <div className="container-custom relative z-10">
        {(title || subtitle) && (
          <div
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
