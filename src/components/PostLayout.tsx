import type { ReactNode } from 'react';
import styles from './PostLayout.module.css';

interface PostLayoutProps {
  children: ReactNode;
  toc: ReactNode;
  sidebar?: ReactNode;
}

const PostLayout = ({ children, toc, sidebar }: PostLayoutProps) => {
  return (
    <div className={styles.layout}>
      <aside className={`${styles.column} ${styles.toc}`} aria-label="文章目录">
        {toc}
      </aside>
      <main className={styles.content}>
        <article className={styles.article}>{children}</article>
      </main>
      {sidebar ? (
        <aside className={`${styles.column} ${styles.sidebar} post-sidebar`} aria-label="侧边栏">
          {sidebar}
        </aside>
      ) : null}
    </div>
  );
};

export default PostLayout;
