import { NavLink, Link } from 'react-router-dom';
import styles from './SiteHeader.module.css';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_ADMIN, setAuthToken } from '../../utils/auth';

const navigationLinks = [
  { label: '首页', path: '/' },
  { label: '文章', path: '/posts' },
  { label: '分类', path: '/categories' },
  { label: '关于我', path: '/about' },
];

const SiteHeader = () => {
  const auth = useAuth();
  const isLoggedIn = Boolean(auth.token);
  const isAdmin = auth.role === ROLE_ADMIN;

  const handleLogout = () => {
    setAuthToken(null);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Reisen`s Blog
        </Link>
        <nav className={styles.nav} aria-label="主导航">
          {navigationLinks.map((item) => (
            <NavLink key={item.label} to={item.path} className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.actions}>
        {isAdmin ? (
          <Link to="/publish" className={styles.secondaryCta}>
            发布文章
          </Link>
        ) : null}
        {isLoggedIn ? (
          <button type="button" className={styles.cta} onClick={handleLogout}>
            取消登录
          </button>
        ) : (
          <Link to="/login" className={styles.cta}>
            登录
          </Link>
        )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
