import { useEffect, useMemo, useState } from 'react';
import PostPreviewCard from '../components/PostPreviewCard';
import styles from './AllPostsPage.module.css';
import type { ArticleOverviewItem } from '../types/blog';
import { api } from '../services/api';

const PAGE_SIZE = 12;

const sorters = [
  { label: '最新发布', value: 'newest' },
  { label: '最早发布', value: 'oldest' },
  { label: '标题 A-Z', value: 'title' },
];

const AllPostsPage = () => {
  const [posts, setPosts] = useState<ArticleOverviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState(sorters[0].value);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.listArticles({ page, pageSize: PAGE_SIZE });
        if (!cancelled) {
          setPosts(data.list);
          setTotal(data.count);
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
  }, [page]);

  const filtered = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    const source = posts.slice();
    const searched = term
      ? source.filter(
          (post) =>
            post.title.toLowerCase().includes(term) ||
            post.summary.toLowerCase().includes(term) ||
            (post.tags ?? []).some((tag) => tag.toLowerCase().includes(term)) ||
            (post.categories ?? []).some((cat) => cat.toLowerCase().includes(term)),
        )
      : source;

    return searched.sort((a, b) => {
      if (sort === 'newest') {
        return b.createdAt.localeCompare(a.createdAt);
      }
      if (sort === 'oldest') {
        return a.createdAt.localeCompare(b.createdAt);
      }
      return a.title.localeCompare(b.title, 'zh-CN');
    });
  }, [keyword, posts, sort]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>所有文章</p>
          <h1>编程日志存档</h1>
          <p>
            这里是 Reisen`s Blog 的完整文章列表，按发布时间倒序排列。随便逛逛，也欢迎按照分类查找自己感兴趣的主题。
          </p>
        </div>
        <div className={styles.controls}>
          <label className={styles.sort}>
            <span>排序</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {sorters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <input
            type="search"
            placeholder="搜索标题 / 摘要 / 标签"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
      </header>

      <section className={styles.section}>
        {error ? <p className={styles.info}>{error}</p> : null}
        <div className={styles.grid}>
          {loading && !posts.length ? <p className={styles.info}>加载中…</p> : null}
          {filtered.map((post) => (
            <PostPreviewCard key={post.id} post={post} />
          ))}
          {!loading && !filtered.length ? <p className={styles.info}>暂无匹配结果。</p> : null}
        </div>
        <div className={styles.pagination}>
          <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
            上一页
          </button>
          <span>
            第 {page} / {totalPages} 页
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            下一页
          </button>
        </div>
      </section>
    </div>
  );
};

export default AllPostsPage;
