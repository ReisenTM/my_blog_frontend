import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PublishPage.module.css';
import { useAuth } from '../hooks/useAuth';
import { ROLE_ADMIN } from '../utils/auth';
import { api } from '../services/api';
import { renderMarkdown } from '../utils/markdown';

const splitValues = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const PublishPage = () => {
  const auth = useAuth();
  const isLoggedIn = Boolean(auth.token);
  const isAdmin = auth.role === ROLE_ADMIN;

  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const preview = useMemo(() => renderMarkdown(content), [content]);
  const previewHtml = preview.html && preview.html.trim().length ? preview.html : '<p>开始输入以预览...</p>';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setFeedback('请填写文章标题。');
      return;
    }
    setFeedback('');
    try {
      setSubmitting(true);
      await api.createArticle({
        title: title.trim(),
        categories: splitValues(categories),
        tags: splitValues(tags),
        content,
      });
      setFeedback('发布成功，去首页刷新看看吧！');
      setTitle('');
      setCategories('');
      setTags('');
      setContent('');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : '发布失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <p className={styles.kicker}>写下新故事</p>
        <h1>发布文章</h1>
        <p className={styles.description}>管理员可在此通过 `/api/post` 接口快速创建文章草稿，分类与标签请使用逗号分隔。</p>
      </header>

      {!isLoggedIn ? (
        <div className={styles.notice}>
          <p>请先登录后再试。</p>
          <Link to="/login" className={styles.linkButton}>
            去登录
          </Link>
        </div>
      ) : !isAdmin ? (
        <div className={styles.notice}>
          <p>当前账号没有发布权限，请联系管理员升级角色。</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            <span>标题</span>
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="文章标题" required />
          </label>
          <label>
            <span>分类</span>
            <input
              type="text"
              value={categories}
              onChange={(event) => setCategories(event.target.value)}
              placeholder="例如：后端, Go"
            />
          </label>
          <label>
            <span>标签</span>
            <input type="text" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="例如：JWT, 实战" />
          </label>
          <div className={styles.editorRow}>
            <label>
              <span>正文内容</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={12}
                placeholder="支持 Markdown 或纯文本内容"
              />
            </label>
            <div className={styles.preview}>
              <div className={styles.previewHeader}>实时预览</div>
              <div className={styles.previewBody} dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? '发布中…' : '发布文章'}
          </button>
          {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
        </form>
      )}
    </section>
  );
};

export default PublishPage;
