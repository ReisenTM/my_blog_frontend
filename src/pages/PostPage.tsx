import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-yaml';
import { api } from '../services/api';
import type { ArticleDetail, ArticleOverviewItem } from '../types/blog';
import { formatDate } from '../utils/formatDate';
import DOMPurify from 'dompurify';
import { extractHeadingsFromHtml } from '../utils/markdown';
import PostLayout from '../components/PostLayout';
import TableOfContents from '../components/TableOfContents';
import SidebarCard from '../components/SidebarCard';
import { useActiveHeading } from '../hooks/useActiveHeading';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [recommended, setRecommended] = useState<ArticleOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const [detail, list] = await Promise.all([api.getArticle(slug), api.listArticles({ pageSize: 12 })]);
        if (cancelled) return;
        setArticle(detail);
        setRecommended(list.list.filter((item) => item.slug !== slug).slice(0, 5));
        setError('');
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '文章加载失败');
          setArticle(null);
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
  }, [slug]);

  const content = article?.content ?? '';
  const sanitizedHtml = useMemo(() => DOMPurify.sanitize(content), [content]);
  const headings = useMemo(() => extractHeadingsFromHtml(sanitizedHtml), [sanitizedHtml]);
  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const activeId = useActiveHeading(headingIds);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const copyTimers = useRef<number[]>([]);

  useEffect(() => {
    const container = bodyRef.current;
    if (!container) return;

    Prism.highlightAllUnder(container);

    const blocks = Array.from(container.querySelectorAll('pre code')) as HTMLElement[];
    blocks.forEach((block, index) => {
      const parent = block.parentElement;
      if (!parent) return;

      const buttonId = `copy-btn-${index}`;
      if (!parent.querySelector(`#${buttonId}`)) {
        const button = document.createElement('button');
        button.id = buttonId;
        button.textContent = '复制';
        button.addEventListener('click', async () => {
          await navigator.clipboard.writeText(block.innerText);
          button.textContent = '已复制';
          const timer = window.setTimeout(() => {
            button.textContent = '复制';
          }, 1500);
          copyTimers.current.push(timer);
        });
        parent.appendChild(button);
      }

      const lines = block.innerHTML
        .split('\n')
        .map((line) => `<span class="token-line">${line || '&nbsp;'}</span>`)
        .join('');
      block.innerHTML = lines;
    });
  }, [sanitizedHtml]);

  useEffect(() => {
    return () => {
      copyTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [sanitizedHtml]);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <section className={styles.section}>加载中…</section>;
  }

  if (error) {
    return <section className={styles.section}>加载失败：{error}</section>;
  }

  if (!article) {
    return <section className={styles.section}>没有找到对应的文章。</section>;
  }

  const toc = headings.length ? (
    <TableOfContents headings={headings} activeId={activeId} />
  ) : (
    <p className={styles.tocEmpty}>暂无目录</p>
  );

  const sidebar = recommended.length ? (
    <SidebarCard title="更多文章">
      <ul className={styles.sidebarList}>
        {recommended.map((item) => (
          <li key={item.id}>
            <a href={`/posts/${item.slug}`}>{item.title}</a>
            <span>{formatDate(item.createdAt)}</span>
          </li>
        ))}
      </ul>
    </SidebarCard>
  ) : null;

  return (
    <PostLayout toc={toc} sidebar={sidebar}>
      <>
        <header className={styles.header}>
          <p className={styles.meta}>
            <span>{formatDate(article.createdAt)}</span>
            <span>·</span>
            <span>作者 {article.authorId}</span>
          </p>
          <h1>{article.title}</h1>
          <p className={styles.summary}>{article.summary}</p>
          <div className={styles.tags}>
            {(article.categories ?? []).map((category) => (
              <span key={`category-${category}`} className={styles.tag}>
                {category}
              </span>
            ))}
            {(article.tags ?? []).map((tag) => (
              <span key={`tag-${tag}`} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </header>
        <article className={styles.body}>
          {sanitizedHtml && sanitizedHtml.trim().length ? (
            <div ref={bodyRef} className={styles.markdown} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
          ) : (
            <p className={styles.placeholder}>这篇文章还没有正文内容。</p>
          )}
        </article>
      </>
    </PostLayout>
  );
};

export default PostPage;
