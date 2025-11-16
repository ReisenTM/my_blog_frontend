import type { ReactNode } from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import styles from './SiteLayout.module.css';

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => (
  <div className={styles.app}>
    <SiteHeader />
    <div className={styles.shell}>
      <main className={styles.main}>{children}</main>
      <SiteFooter />
    </div>
  </div>
);

export default SiteLayout;
