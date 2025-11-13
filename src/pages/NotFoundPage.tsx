import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => (
  <section className={styles.container}>
    <p className={styles.kicker}>404</p>
    <h1>页面还没建好</h1>
    <p>该链接暂时没有内容，你可以回到首页继续探索设计系统的秩序。</p>
    <Link to="/" className={styles.link}>
      返回首页
    </Link>
  </section>
);

export default NotFoundPage;
