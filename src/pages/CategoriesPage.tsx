import { useMemo, useState } from 'react';
import PostPreviewCard from '../components/PostPreviewCard';
import { posts, topics } from '../data/mockData';
import styles from './CategoriesPage.module.css';

const CategoriesPage = () => {
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id ?? '');
  const activeTopic = topics.find((topic) => topic.id === activeTopicId);

  const filteredPosts = useMemo(() => {
    if (!activeTopic) return posts;
    return posts.filter((post) => post.categories.includes(activeTopic.title));
  }, [activeTopic]);

  return (
    <section className={styles.wrapper}>
      <aside className={styles.sidebar} aria-label="分类导航">
        <h1>分类</h1>
        <p>挑一个你感兴趣的主题，右侧会展示对应的文章。</p>
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
          <h2>{activeTopic?.description ?? '选择左侧的任意分类查看文章'}</h2>
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
