import { useEffect, useState } from 'react';

export function UniversityAge() {
  // Identical on the build server and during the first client render.
  const [years, setYears] = useState(null);

  useEffect(() => {
    const update = () => {
      if (!document.hidden) {
        setYears((Date.now() - Date.UTC(1886, 5, 3)) / (365.2425 * 86400000));
      }
    };
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const interval = setInterval(update, reducedMotion ? 60000 : 250);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2 align-middle px-3 py-1 rounded-full glass text-sm md:text-base lg:text-lg font-semibold tracking-wide uppercase text-white/75 whitespace-nowrap leading-none">
      <span className="text-white/60">{years === null ? 'с' : 'уже'}</span>
      <span className="tabular-nums">{years === null ? '1886' : years.toFixed(8)}</span>
      <span className="text-white/60">{years === null ? 'года' : 'лет'}</span>
    </span>
  );
}
