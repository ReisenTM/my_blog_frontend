import { useEffect, useState } from 'react';

export const useActiveHeading = (headingIds: string[]) => {
  const [activeId, setActiveId] = useState<string>(headingIds[0] ?? '');

  useEffect(() => {
    if (headingIds.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1,
      },
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headingIds]);

  return activeId;
};
