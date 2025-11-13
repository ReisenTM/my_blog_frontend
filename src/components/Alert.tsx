import type { ReactNode } from 'react';
import type { AlertType } from '../types/blog';
import styles from './Alert.module.css';

export interface AlertProps {
  type: AlertType;
  children: ReactNode;
}

const ICON_MAP: Record<AlertType, string> = {
  tip: '💡 提示',
  warning: '⚠️ 警示',
};

const Alert = ({ type, children }: AlertProps) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`} role="note">
      <span className={styles.prefix}>{ICON_MAP[type]}：</span>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Alert;
