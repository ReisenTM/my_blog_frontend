import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import CodeBlock from '../components/CodeBlock';
import PostLayout from '../components/PostLayout';
import SidebarCard from '../components/SidebarCard';
import TableOfContents from '../components/TableOfContents';
import { useActiveHeading } from '../hooks/useActiveHeading';
import { api } from '../services/api';
import type { Author, BlogPost } from '../types/blog';
import { formatDate } from '../utils/formatDate';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [recommended, setRecommended] = useState<BlogPost[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) return;
      try {
        const data = await api.getPost(slug);
        if (cancelled) return;
        setPost(data);

        try {
          const authorData = await api.getAuthor(data.authorId);
          if (!cancelled) {
            setAuthor(authorData);
          }
        } catch (authorErr) {
          console.warn('作者信息拉取失败', authorErr);
        }

        try {
          const recommendData = await api.listPosts();
          if (!cancelled) {
            setRecommended(recommendData.filter((item) => data.recommendedSlugs.includes(item.slug)));
          }
        } catch (recommendErr) {
          console.warn('推荐文章加载失败', recommendErr);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '文章加载失败');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return <section className={styles.section}>加载失败：{error}</section>;
  }

  if (!post) {
    return <section className={styles.section}>加载中…</section>;
  }

  const headings = useMemo(
    () =>
      post.sections.map((section) => ({
        id: section.id,
        text: section.title,
        level: section.level,
      })),
    [post],
  );
  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const activeId = useActiveHeading(headingIds);

  const sidebar = (
    <div className="sidebar-stack">
      {author ? (
        <SidebarCard title="关于作者">
          <p>{author.name}</p>
          <p>{author.role}</p>
          <p>{author.bio}</p>
          <ul>
            {author.socials.map((social) => (
              <li key={social.label}>
                <a href={social.url}>{social.label}</a>
              </li>
            ))}
          </ul>
        </SidebarCard>
      ) : null}
      <SidebarCard title="文章信息">
        <ul>
          <li>发布日期：{formatDate(post.publishedAt)}</li>
          <li>阅读时长：{post.readingTime}</li>
          <li>分类：{post.categories.join(' / ')}</li>
        </ul>
      </SidebarCard>
      {recommended.length ? (
        <SidebarCard title="相关文章">
          <ul>
            {recommended.map((item) => (
              <li key={item.id}>
                <Link to={`/posts/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </SidebarCard>
      ) : null}
    </div>
  );

  return slug ? (
    <PostLayout toc={<TableOfContents headings={headings} activeId={activeId} />} sidebar={sidebar}>
      <>
        <header className="article-hero">
          <span className="badge">{post.hero.badge}</span>
          <h1>{post.hero.headline}</h1>
          <p className="lead">{post.hero.description}</p>
        </header>
        {post.sections.map((section) => (
          <section key={section.id} id={section.id} className={styles.section}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={`${section.id}-p-${index}`}>{paragraph}</p>
            ))}
            {section.list ? (
              <ul>
                {section.list.map((item, index) => (
                  <li key={`${section.id}-list-${index}`}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.alert ? <Alert type={section.alert.type}>{section.alert.content}</Alert> : null}
            {section.code ? <CodeBlock language={section.code.language} content={section.code.content} /> : null}
          </section>
        ))}
      </>
    </PostLayout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PostPage;
