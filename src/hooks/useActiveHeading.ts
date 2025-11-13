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

    const collectPositions = () =>
      headingIds
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;
          return { id, top: element.getBoundingClientRect().top + window.scrollY };
        })
        .filter((item): item is { id: string; top: number } => Boolean(item));

    let positions = collectPositions();

    const handleResize = () => {
      positions = collectPositions();
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY + 160; // 提前一些让标题更早激活
        let current = positions[0];
        for (const pos of positions) {
          if (pos.top <= scrollY) {
            current = pos;
          }
        }
        if (current && current.id !== activeIdRef.current) {
          setActiveId(current.id);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    handleResize();
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [headingIds]);

  return activeId;
};
