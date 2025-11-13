import type { ReactNode } from 'react';
import styles from './SidebarCard.module.css';

interface SidebarCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const SidebarCard = ({ title, children, footer }: SidebarCardProps) => (
  <section className={styles.card}>
    <p className={styles.title}>{title}</p>
    <div className={styles.body}>{children}</div>
    {footer ? <div className={styles.footer}>{footer}</div> : null}
  </section>
);

export default SidebarCard;
