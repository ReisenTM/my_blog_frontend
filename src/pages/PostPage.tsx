import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import CodeBlock from '../components/CodeBlock';
import PostLayout from '../components/PostLayout';
import SidebarCard from '../components/SidebarCard';
import TableOfContents from '../components/TableOfContents';
import { authors, posts } from '../data/mockData';
import { useActiveHeading } from '../hooks/useActiveHeading';
import { formatDate } from '../utils/formatDate';
import styles from './PostPage.module.css';

const PostPage = () => {
  const { slug } = useParams();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return <Navigate to="/" replace />;
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
  const author = authors.find((person) => person.id === post.authorId);
  const recommended = posts.filter((item) => post.recommendedSlugs.includes(item.slug));

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

  return (
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
            {section.code ? (
              <CodeBlock language={section.code.language} content={section.code.content} />
            ) : null}
          </section>
        ))}
      </>
    </PostLayout>
  );
};

export default PostPage;
