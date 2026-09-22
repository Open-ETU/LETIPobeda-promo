export function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
  withBlob = false,
  blobPosition = 'right',
}) {
  return (
    <section
      id={id}
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
          <div className="text-center mb-12 md:mb-16">
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

        <div>{children}</div>
      </div>
    </section>
  );
}
