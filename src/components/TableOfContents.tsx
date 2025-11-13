import type { FC } from 'react';
import styles from './TableOfContents.module.css';

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocHeading[];
  activeId?: string;
}

const TableOfContents: FC<TableOfContentsProps> = ({ headings, activeId }) => {
  return (
    <nav className={styles.container} aria-label="目录">
      <p className={styles.label}>内容导航</p>
      <ul className={styles.list}>
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li
              key={heading.id}
              className={styles.item}
              style={{ marginLeft: `${(heading.level - 2) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                className={isActive ? styles.activeLink : styles.link}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;
