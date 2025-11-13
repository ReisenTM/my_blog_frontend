import type { ReactNode } from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import styles from './SiteLayout.module.css';

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => (
  <div className={styles.shell}>
    <SiteHeader />
    <main className={styles.main}>{children}</main>
    <SiteFooter />
  </div>
);

export default SiteLayout;
