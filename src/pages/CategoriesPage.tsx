import { useEffect, useMemo, useState } from 'react';
import PostPreviewCard from '../components/PostPreviewCard';
import styles from './CategoriesPage.module.css';
import type { ArticleOverviewItem } from '../types/blog';
import { api } from '../services/api';

const palette = ['#FF8A65', '#4DB6AC', '#7986CB', '#FFD54F', '#81C784', '#BA68C8'];

const CategoriesPage = () => {
  const [posts, setPosts] = useState<ArticleOverviewItem[]>([]);
  const [activeTopicId, setActiveTopicId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listArticles({ pageSize: 100 });
        if (cancelled) return;
        setPosts(data.list);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '分类加载失败');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const topics = useMemo(() => {
    const stat = new Map<string, number>();
    posts.forEach((post) => {
      const categories = post.categories ?? [];
      categories.forEach((category) => {
        stat.set(category, (stat.get(category) ?? 0) + 1);
      });
    });

    const entries = Array.from(stat.entries());
    if (!entries.length) return [];
    return entries.map(([title, count], index) => ({
      id: title,
      title,
      description: `${title} 共有 ${count} 篇文章`,
      postCount: count,
      accent: palette[index % palette.length],
    }));
  }, [posts]);

  useEffect(() => {
    if (!activeTopicId && topics.length) {
      setActiveTopicId(topics[0].id);
    }
  }, [topics, activeTopicId]);

  const activeTopic = topics.find((topic) => topic.id === activeTopicId);

  const filteredPosts = useMemo(() => {
    if (!activeTopic) return posts;
    return posts.filter((post) => (post.categories ?? []).includes(activeTopic.title));
  }, [activeTopic, posts]);

  return (
    <section className={styles.wrapper}>
      <aside className={styles.sidebar} aria-label="分类导航">
        <h1>分类</h1>
        <p>挑一个你感兴趣的主题，右侧会展示对应的文章。</p>
        {error ? <p>{error}</p> : null}
        {!topics.length ? <p className={styles.empty}>暂无分类，请先发布文章。</p> : null}
        <ul className={styles.topicList}>
          {topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                className={topic.id === activeTopicId ? styles.topicActive : styles.topicButton}
                onClick={() => setActiveTopicId(topic.id)}
              >
                <span className={styles.topicDot} style={{ background: topic.accent }} />
                <span>
                  {topic.title}
                  <small>{topic.postCount} 篇</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.kicker}>分类 · {activeTopic?.title ?? '全部'}</p>
          <h2>{activeTopic?.description ?? '暂无分类统计，切换到全部文章浏览'}</h2>
        </header>
        <div className={styles.grid}>
          {filteredPosts.map((post) => (
            <PostPreviewCard key={post.id} post={post} />
          ))}
          {filteredPosts.length === 0 ? <p className={styles.empty}>这个分类还没有文章，敬请期待。</p> : null}
        </div>
      </div>
    </section>
  );
};

export default CategoriesPage;
