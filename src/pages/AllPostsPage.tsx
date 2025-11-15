import { useEffect, useState } from 'react';
import PostPreviewCard from '../components/PostPreviewCard';
import styles from './AllPostsPage.module.css';
import type { BlogPost } from '../types/blog';
import { api } from '../services/api';

const AllPostsPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.listPosts();
        if (!cancelled) {
          setPosts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '文章加载失败');
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

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <p className={styles.kicker}>所有文章</p>
        <h1>编程日志存档</h1>
        <p>
          这里是 Reisen`s Blog 的完整文章列表，按发布时间倒序排列。随便逛逛，也欢迎按照分类查找自己感兴趣的主题。
        </p>
      </header>
      {error ? <p>{error}</p> : null}
      <div className={styles.grid}>
        {loading && !posts.length ? <p>加载中…</p> : null}
        {posts.map((post) => (
          <PostPreviewCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default AllPostsPage;
