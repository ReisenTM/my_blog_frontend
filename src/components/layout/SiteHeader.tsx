import { NavLink, Link } from 'react-router-dom';
import styles from './SiteHeader.module.css';

const navigationLinks = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/posts' },
  { label: '分类', path: '/categories' },
  { label: '关于我', path: '/about' },
];

const SiteHeader = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Reisen`s Blog
      </Link>
      <nav className={styles.nav} aria-label="主导航">
        {navigationLinks.map((item) =>
          item.external ? (
            <a key={item.label} href={item.path} className={styles.link} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ) : (
            <NavLink key={item.label} to={item.path} className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
      <Link to="/login" className={styles.cta}>
        登录
      </Link>
    </header>
  );
};

export default SiteHeader;
