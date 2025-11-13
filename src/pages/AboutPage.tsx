import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';

const avatarImg = new URL('../../resource/avatar.PNG', import.meta.url).href;

const AboutPage = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.mainColumn}>
        <article className={styles.profileCard}>
          <img src={avatarImg} alt="Reisen 的头像" className={styles.avatar} />
          <div>
            <p className={styles.kicker}>About Reisen</p>
            <h1>写代码、写文章的快乐都在这里</h1>
            <p>
              我是 Reisen，一个常年泡在代码编辑器里的后端工程师。2022年前开始记录编程笔记，从最早的 C++ 算法到如今
              的云原生、AI Agent，我把这些碎片结成一篇篇博客。写作帮助我复盘，也让我与更多开发者建立链接。
            </p>
            <ul className={styles.metaList}>
              <li>📍 郑州 · 喜欢美食和钢琴</li>
              <li>🧑‍💻 目前在学校 大三ing</li>
              <li>✉️ <a href="mailto:s3068272040@gmail.com">s3068272040@gmail.com</a></li>
            </ul>
            <div className={styles.badges}>
              <span>后端开发</span>
              <span>容器 & 运维</span>
              <span>技术写作</span>
            </div>
          </div>
        </article>

        <section className={styles.section}>
          <h2>为什么坚持写博客？</h2>
          <p>
            代码会被覆盖，经验却会长出来。写博客就像给自己建一座知识仓库，顺带把问题拆成人人都能复现的步骤。
            我尽量让文章兼具叙事感和工程细节：先讲为什么，再给出排查命令、配置片段或小工具。
          </p>
          <p>
            Reisen`s Blog 主要包含三类内容：<strong>编程实践</strong>、<strong>系统架构</strong>、<strong>编程随笔</strong>。
            每个部分都会附上代码片段、命令或设计草图，方便在真实项目中直接复用。
          </p>
        </section>

        <section className={styles.section}>
          <h2>如何与我交流</h2>
          <ul>
            <li>想讨论文章里的细节，直接在邮件里引用段落和疑问即可。</li>
            <li>如果你也在写技术博客，欢迎互换站点链接，一起创造更友好的知识生态。</li>
            <li>
              想了解新文章？订阅 <Link to="/feed.xml">RSS</Link> 或在首页下方阅读「写作进度」。
            </li>
          </ul>
        </section>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>当前正在写</p>
          <ul>
            <li>《我如何调优 gRPC 服务的 5 个环节》</li>
            <li>《在 CLI 里管理“第二大脑”》</li>
            <li>《给 Sidecar 降噪：服务网格实践》</li>
          </ul>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>常用工具栈</p>
          <ul>
            <li>Neovim / VS Code</li>
            <li>Go · TypeScript · Rust</li>
            <li>Docker · Kubernetes · GitHub Actions</li>
          </ul>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>想合作？</p>
          <p>可以聊聊以下方向：</p>
          <ul>
            <li>技术写作 / 文档共建</li>
            <li>内部分享 · 友链建设</li>
            <li>开发者工具体验</li>
          </ul>
          <a className={styles.contactBtn} href="mailto:s3068272040@gmail.com">给我写信</a>
          <div className={styles.linkGroup}>
            <span>GitHub：</span>
            <a href="https://github.com/ReisenTM/my_blog" target="_blank" rel="noreferrer" aria-label="Reisen 的 GitHub">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.11.79-.25.79-.55 0-.27-.01-.98-.02-1.93-3.22.7-3.9-1.55-3.9-1.55-.53-1.35-1.3-1.71-1.3-1.71-1.07-.75.08-.74.08-.74 1.18.08 1.8 1.22 1.8 1.22 1.05 1.8 2.76 1.28 3.43.98.11-.77.41-1.28.74-1.57-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.32 1.2-3.14-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.2a11 11 0 0 1 5.82 0c2.2-1.51 3.18-1.2 3.18-1.2.64 1.59.24 2.76.12 3.05.75.82 1.19 1.87 1.19 3.14 0 4.45-2.71 5.44-5.29 5.72.42.36.79 1.08.79 2.18 0 1.58-.02 2.84-.02 3.23 0 .3.21.66.8.55A11.5 11.5 0 0 0 12 .5Z" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default AboutPage;
