import PostPreviewCard from '../components/PostPreviewCard';
import { posts } from '../data/mockData';
import styles from './AllPostsPage.module.css';

const AllPostsPage = () => {
  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <p className={styles.kicker}>所有文章</p>
        <h1>编程日志存档</h1>
        <p>
          这里是 Reisen`s Blog 的完整文章列表，按发布时间倒序排列。随便逛逛，也欢迎按照分类查找自己感兴趣的主题。
        </p>
      </header>
      <div className={styles.grid}>
        {posts.map((post) => (
          <PostPreviewCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default AllPostsPage;
