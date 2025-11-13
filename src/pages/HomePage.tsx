import { Link } from 'react-router-dom';
import PostPreviewCard from '../components/PostPreviewCard';
import { changelogEntries, posts, topics } from '../data/mockData';
import styles from './HomePage.module.css';

const HomePage = () => {
  const featuredPost = posts[0];

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className={styles.heroBadge}>Reisen`s Blog · 编程手记</div>
        <h1>💡记录我在编程世界的灵感与踩坑</h1>
        <p>这里是我写代码、读源码、折腾工具的地方，从前端、后端到心得分享，希望写下的每一篇文章都能帮你少走弯路。</p>
        <div className={styles.heroActions}>
          <Link to={`/posts/${featuredPost.slug}`} className={styles.heroPrimary}>
            阅读最新文章
          </Link>
          <Link to="/categories" className={styles.heroSecondary}>
            浏览全部分类
          </Link>
        </div>
      </section>

      <section className={styles.postsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>最新文章</p>
            <h2>持续更新的笔记</h2>
          </div>
          <Link to="/posts" className={styles.sectionLink}>
            查看全部 →
          </Link>
        </div>
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <PostPreviewCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className={styles.topicsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>主题索引</p>
            <h2>热门分类</h2>
          </div>
        </div>
        <div className={styles.topicsGrid}>
          {topics.map((topic) => (
            <article key={topic.id} className={styles.topicCard}>
              <span className={styles.topicBadge} style={{ background: topic.accent }} />
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span className={styles.topicMeta}>{topic.postCount} 篇文章</span>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.changelogSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>更新日志</p>
            <h2>写作进度</h2>
          </div>
        </div>
        <ol className={styles.changelogList}>
          {changelogEntries.map((entry) => (
            <li key={entry.id} className={styles.changelogItem}>
              <span className={styles.changelogDate}>{entry.date}</span>
              <p>{entry.summary}</p>
              <span className={styles.changelogStatus}>{entry.status}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default HomePage;
