import { Link } from 'react-router-dom';
import type { ArticleOverviewItem } from '../types/blog';
import { formatDate } from '../utils/formatDate';
import styles from './PostPreviewCard.module.css';

interface PostPreviewCardProps {
  post: ArticleOverviewItem;
}

const PostPreviewCard = ({ post }: PostPreviewCardProps) => {
  return (
    <article className={styles.card}>
      <p className={styles.meta}>
        <span>{formatDate(post.createdAt)}</span>
        <span>·</span>
        <span>{post.authorId}</span>
      </p>
      <Link to={`/posts/${post.slug}`} className={styles.title}>
        {post.title}
      </Link>
      <p className={styles.summary}>{post.summary}</p>
      <div className={styles.tags}>
        {(post.tags ?? []).map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <Link to={`/posts/${post.slug}`} className={styles.cta}>
        阅读文章 →
      </Link>
    </article>
  );
};

export default PostPreviewCard;
