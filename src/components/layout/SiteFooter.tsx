import styles from './SiteFooter.module.css';

const SiteFooter = () => {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Code Orderliness. 内容基于 React + TypeScript + Design Tokens。</p>
      <p>发布于数字花园 · 持续迭代中。</p>
    </footer>
  );
};

export default SiteFooter;
