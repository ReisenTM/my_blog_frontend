import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PostPreviewCard from '../components/PostPreviewCard';
import styles from './HomePage.module.css';
import type { ArticleOverviewItem } from '../types/blog';
import { api } from '../services/api';
import { formatDate } from '../utils/formatDate';

const HomePage = () => {
  const [posts, setPosts] = useState<ArticleOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const postResult = await api.listArticles({ page: 1, pageSize: 6 });
        if (cancelled) return;
        setPosts(postResult.list);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '数据加载失败');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const topics = useMemo(() => {
    const palette = ['#FF8A65', '#4DB6AC', '#7986CB', '#FFD54F', '#81C784'];
    const stat = new Map<string, number>();
    posts.forEach((post) => {
      const categories = post.categories ?? [];
      categories.forEach((category) => {
        stat.set(category, (stat.get(category) ?? 0) + 1);
      });
    });
    return Array.from(stat.entries()).map(([title, count], index) => ({
      id: title,
      title,
      description: `共 ${count} 篇文章`,
      postCount: count,
      accent: palette[index % palette.length],
    }));
  }, [posts]);

  const changelog = useMemo(
    () =>
      posts.slice(0, 4).map((post) => ({
        id: post.slug,
        date: formatDate(post.updatedAt),
        summary: `更新《${post.title}》`,
        status: 'shipped',
      })),
    [posts],
  );

  const featuredPost = posts[0];

  return (
    <div className={styles.wrapper}>
      {error ? <p className={styles.error}>{error}</p> : null}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>最新文章</p>
            <h2>持续更新的笔记</h2>
          </div>
          <Link to="/posts" className={styles.sectionLink}>
            查看全部 →
          </Link>
        </div>
        <div className={styles.cards}>
          {loading && !posts.length ? <p>加载文章中…</p> : null}
          {posts.map((post) => (
            <PostPreviewCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>主题索引</p>
            <h2>热门分类</h2>
          </div>
        </div>
        <div className={styles.topicsGrid}>
          {topics.length
            ? topics.map((topic) => (
                <article key={topic.id} className={styles.topicCard}>
                  <span className={styles.topicBadge} style={{ background: topic.accent }} />
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  <span className={styles.topicMeta}>{topic.postCount} 篇文章</span>
                </article>
              ))
            : null}
          {!topics.length ? <p className={styles.empty}>暂无分类数据，去写第一篇文章吧。</p> : null}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.kicker}>更新日志</p>
            <h2>写作进度</h2>
          </div>
        </div>
        <ol className={styles.changelogList}>
          {changelog.length
            ? changelog.map((entry) => (
                <li key={entry.id} className={styles.changelogItem}>
                  <span className={styles.changelogDate}>{entry.date}</span>
                  <p>{entry.summary}</p>
                  <span className={styles.changelogStatus}>{entry.status}</span>
                </li>
              ))
            : null}
          {!changelog.length ? <li className={styles.changelogItem}>暂未有更新记录。</li> : null}
        </ol>
      </section>
    </div>
  );
};

export default HomePage;
