import { useEffect, useRef, useState } from 'react';

export const useActiveHeading = (headingIds: string[]) => {
  const [activeId, setActiveId] = useState<string>(headingIds[0] ?? '');
  const activeIdRef = useRef(activeId);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (typeof window === 'undefined' || headingIds.length === 0) {
      return undefined;
    }

    const findCurrent = () => {
      const scrollY = window.scrollY + 160;
      let current = headingIds[0];

      headingIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollY) {
          current = id;
        }
      });

      return current;
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const next = findCurrent();
        if (next && next !== activeIdRef.current) {
          setActiveId(next);
        }
        ticking = false;
      });
    };

    const handleResize = () => handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [headingIds]);

  return activeId;
};
